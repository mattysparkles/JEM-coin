//! Minimal JSON-RPC server scaffold using axum.

use axum::{extract::State, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{net::SocketAddr, sync::Arc};
use jems_core::ProtocolParams;

#[derive(Debug, Serialize, Deserialize)]
pub struct RpcRequest {
    pub method: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RpcResponse {
    pub result: Value,
}

#[derive(Clone)]
pub struct RpcState {
    pub params: Arc<ProtocolParams>,
}

#[derive(Serialize)]
struct EpochInfo {
    epoch: u64,
    slot: u64,
    target_difficulty: u64,
    beacon: [u8; 32],
}

pub async fn handle(State(state): State<RpcState>, Json(req): Json<RpcRequest>) -> Json<RpcResponse> {
    match req.method.as_str() {
        "get_params" => Json(RpcResponse { result: serde_json::to_value(&*state.params).unwrap() }),
        "get_epoch_info" => {
            let info = EpochInfo { epoch: 0, slot: 0, target_difficulty: 0, beacon: [0u8;32] };
            Json(RpcResponse { result: serde_json::to_value(info).unwrap() })
        }
        _ => Json(RpcResponse { result: serde_json::json!("ok") }),
    }
}

pub async fn serve(addr: SocketAddr, params: Arc<ProtocolParams>) {
    let state = RpcState { params };
    let app = Router::new().route("/", post(handle)).with_state(state);
    let listener = tokio::net::TcpListener::bind(addr).await.expect("bind");
    axum::serve(listener, app).await.expect("server");
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use axum::{Router, routing::post};
    use tower::ServiceExt;

    #[tokio::test]
    async fn get_params() {
        let params = Arc::new(ProtocolParams::default());
        let state = RpcState { params };
        let app = Router::new().route("/", post(super::handle)).with_state(state);
        let request = Request::post("/")
            .header("content-type", "application/json")
            .body(Body::from("{\"method\":\"get_params\"}"))
            .unwrap();
        let response = app.oneshot(request).await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
    }
}

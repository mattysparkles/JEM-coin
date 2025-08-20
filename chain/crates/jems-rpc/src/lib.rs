//! Minimal JSON-RPC server scaffold using axum.

use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

#[derive(Debug, Serialize, Deserialize)]
pub struct RpcRequest {
    pub method: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RpcResponse {
    pub result: String,
}

async fn handle(Json(_req): Json<RpcRequest>) -> Json<RpcResponse> {
    Json(RpcResponse { result: "ok".to_string() })
}

pub async fn serve(addr: SocketAddr) {
    let app = Router::new().route("/", post(handle));
    let listener = tokio::net::TcpListener::bind(addr).await.expect("bind");
    axum::serve(listener, app).await.expect("server");
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use tower::ServiceExt;

    #[tokio::test]
    async fn handle_rpc() {
        let app = Router::new().route("/", post(super::handle));
        let request = Request::post("/")
            .header("content-type", "application/json")
            .body(Body::from("{\"method\":\"ping\"}"))
            .unwrap();
        let response = app.oneshot(request).await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
    }
}

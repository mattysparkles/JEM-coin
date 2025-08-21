//! Minimal JSON-RPC server scaffold using axum.

use axum::{
    extract::State,
    response::sse::{Event as SseEvent, Sse},
    routing::{get, post},
    Json, Router,
};
use jems_core::ProtocolParams;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{net::SocketAddr, sync::Arc};
use tokio::sync::{broadcast, RwLock};
use tokio_stream::wrappers::BroadcastStream;
use futures_util::{stream::Stream, StreamExt};
use std::convert::Infallible;

#[derive(Debug, Serialize, Deserialize)]
pub struct RpcRequest {
    pub method: String,
    #[serde(default)]
    pub params: Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RpcResponse {
    pub result: Value,
}

#[derive(Clone)]
pub struct RpcState {
    pub params: Arc<RwLock<ProtocolParams>>,
    pub epoch: Arc<RwLock<EpochInfo>>,
    pub tx: broadcast::Sender<Event>,
}

#[derive(Debug, Serialize, Clone)]
pub struct EpochInfo {
    pub epoch: u64,
    pub slot: u64,
    pub target_difficulty: u64,
    pub beacon: [u8; 32],
}

#[derive(Debug, Serialize, Clone)]
#[serde(tag = "event", rename_all = "camelCase")]
pub enum Event {
    EpochAdvanced { epoch: u64, slot: u64, target_difficulty: u64 },
    ParamsUpdated { params: ProtocolParams, source: String },
    Governance { proposal_id: String, status: String },
}

pub async fn handle(State(state): State<RpcState>, Json(req): Json<RpcRequest>) -> Json<RpcResponse> {
    match req.method.as_str() {
        "get_params" => {
            let params = state.params.read().await.clone();
            Json(RpcResponse { result: serde_json::to_value(params).unwrap() })
        }
        "get_epoch_info" => {
            let info = state.epoch.read().await.clone();
            Json(RpcResponse { result: serde_json::to_value(info).unwrap() })
        }
        "set_params" => {
            {
                let mut params = state.params.write().await;
                if let Some(v) = req.params.get("lambda_decay").and_then(|v| v.as_f64()) {
                    params.lambda_decay = v;
                }
                if let Some(v) = req
                    .params
                    .get("ticket_cap_per_epoch")
                    .and_then(|v| v.as_u64())
                {
                    params.ticket_cap_per_epoch = v;
                }
                let _ = state.tx.send(Event::ParamsUpdated {
                    params: params.clone(),
                    source: "governance".to_string(),
                });
            }
            Json(RpcResponse { result: serde_json::json!("ok") })
        }
        _ => Json(RpcResponse { result: serde_json::json!("ok") }),
    }
}

async fn sse(State(state): State<RpcState>) -> Sse<impl Stream<Item = Result<SseEvent, Infallible>>> {
    let rx = state.tx.subscribe();
    let stream = BroadcastStream::new(rx).filter_map(|res| async move {
        match res.ok() {
            Some(ev) => Some(Ok::<SseEvent, Infallible>(
                SseEvent::default().json_data(ev).unwrap(),
            )),
            None => None,
        }
    });
    Sse::new(stream)
}

pub async fn serve(addr: SocketAddr, params: Arc<ProtocolParams>) {
    let (tx, _rx) = broadcast::channel(16);
    let state = RpcState {
        params: Arc::new(RwLock::new((*params).clone())),
        epoch: Arc::new(RwLock::new(EpochInfo {
            epoch: 0,
            slot: 0,
            target_difficulty: 0,
            beacon: [0u8; 32],
        })),
        tx,
    };

    // Periodically advance slots and emit events.
    let tick_state = state.clone();
    tokio::spawn(async move {
        loop {
            tokio::time::sleep(std::time::Duration::from_secs(5)).await;
            let mut ep = tick_state.epoch.write().await;
            ep.slot += 1;
            if ep.slot % 10 == 0 {
                ep.epoch += 1;
            }
            let _ = tick_state.tx.send(Event::EpochAdvanced {
                epoch: ep.epoch,
                slot: ep.slot,
                target_difficulty: ep.target_difficulty,
            });
        }
    });

    let app = Router::new()
        .route("/", post(handle))
        .route("/events", get(sse))
        .with_state(state);
    let listener = tokio::net::TcpListener::bind(addr).await.expect("bind");
    axum::serve(listener, app).await.expect("server");
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use axum::{routing::post, Router};
    use tower::ServiceExt;

    #[tokio::test]
    async fn params_update_emits_event() {
        let (tx, mut rx) = broadcast::channel(16);
        let state = RpcState {
            params: Arc::new(RwLock::new(ProtocolParams::default())),
            epoch: Arc::new(RwLock::new(EpochInfo {
                epoch: 0,
                slot: 0,
                target_difficulty: 0,
                beacon: [0u8; 32],
            })),
            tx,
        };
        let app = Router::new().route("/", post(super::handle)).with_state(state.clone());
        let request = Request::post("/")
            .header("content-type", "application/json")
            .body(Body::from("{\"method\":\"set_params\", \"params\":{\"lambda_decay\":0.5}}"))
            .unwrap();
        let response = app.oneshot(request).await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let ev = rx.recv().await.unwrap();
        match ev {
            Event::ParamsUpdated { params, .. } => assert_eq!(params.lambda_decay, 0.5),
            _ => panic!("expected params updated"),
        }
    }
}

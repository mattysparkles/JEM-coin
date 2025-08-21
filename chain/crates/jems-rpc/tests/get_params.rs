use axum::{routing::post, Router};
use axum::body::{Body, to_bytes};
use axum::http::Request;
use tower::ServiceExt;
use jems_rpc::{RpcState, handle, EpochInfo};
use jems_core::ProtocolParams;
use std::sync::Arc;
use tokio::sync::{broadcast, RwLock};

#[tokio::test]
async fn rpc_returns_defaults() {
    let (tx, _rx) = broadcast::channel(16);
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
    let app = Router::new().route("/", post(handle)).with_state(state);
    let request = Request::post("/")
        .header("content-type", "application/json")
        .body(Body::from("{\"method\":\"get_params\"}"))
        .unwrap();
    let response = app.oneshot(request).await.unwrap();
    let bytes = to_bytes(response.into_body(), 1024).await.unwrap();
    let val: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(val["result"]["slot_secs"], 4);
}

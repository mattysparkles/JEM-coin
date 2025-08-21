use axum::{routing::post, Router};
use axum::body::{Body, to_bytes};
use axum::http::Request;
use tower::ServiceExt;
use jems_rpc::{RpcState, handle};
use jems_core::ProtocolParams;
use std::sync::Arc;

#[tokio::test]
async fn rpc_returns_defaults() {
    let params = Arc::new(ProtocolParams::default());
    let state = RpcState { params: params.clone() };
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

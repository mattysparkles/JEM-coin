use axum::extract::State;
use axum::Json;
use jems_rpc::{RpcState, EpochInfo, handle, RpcRequest};
use jems_core::ProtocolParams;
use std::sync::Arc;
use tokio::sync::{broadcast, RwLock};
use serde_json::json;

#[tokio::test]
async fn schema_methods_respond() {
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

    let schema: serde_json::Value = serde_json::from_str(include_str!("../../../../apis/rpc/schema.json")).unwrap();
    for m in schema["methods"].as_array().unwrap() {
        let name = m["name"].as_str().unwrap();
        let params = match name {
            "getBalance" => json!({"address":"0x0"}),
            "submitTx" => json!({"raw":"0x"}),
            "getTx" => json!({"id":"0x0"}),
            "getBlock" => json!({"height":0}),
            _ => json!({}),
        };
        let req = RpcRequest { method: name.to_string(), params };
        let Json(res) = handle(State(state.clone()), Json(req)).await;
        assert!(res.result.is_object() || res.result.is_string(), "{} should return value", name);
    }
}

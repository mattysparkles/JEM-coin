//! Minimal JSON-RPC server scaffold using axum.

use axum::{
    extract::State,
    response::sse::{Event as SseEvent, Sse},
    routing::{get, post},
    Json, Router,
};
use futures_util::{stream::Stream, StreamExt};
use jems_core::ProtocolParams;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::convert::Infallible;
use std::{net::SocketAddr, sync::Arc};
use tokio::sync::{broadcast, RwLock};
use tokio_stream::wrappers::BroadcastStream;

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

#[derive(Debug, Serialize, Clone)]
pub struct NodeInfo {
    pub name: String,
    pub version: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct ChainMeta {
    pub height: u64,
    pub finalized_height: u64,
    pub epoch: u64,
    pub round: u64,
    pub peers: u64,
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
        "getNodeInfo" => {
            let info = NodeInfo {
                name: "jems-node".to_string(),
                version: "0.1.0".to_string(),
            };
            Json(RpcResponse { result: json!(info) })
        }
        "getChainMeta" => {
            let ep = state.epoch.read().await.clone();
            let meta = ChainMeta {
                height: ep.slot,
                finalized_height: ep.slot,
                epoch: ep.epoch,
                round: ep.slot,
                peers: 0,
            };
            Json(RpcResponse { result: json!(meta) })
        }
        "getBalance" => {
            let addr = req
                .params
                .get("address")
                .and_then(|v| v.as_str())
                .unwrap_or("");
            Json(RpcResponse { result: json!({"address": addr, "balance": 0}) })
        }
        "submitTx" => Json(RpcResponse { result: json!({"id": "0x0"}) }),
        "getTx" => {
            let id = req.params.get("id").and_then(|v| v.as_str()).unwrap_or("");
            Json(RpcResponse { result: json!({"id": id, "status": "unknown"}) })
        }
        "getBlock" => {
            let height = req.params.get("height").and_then(|v| v.as_u64()).unwrap_or(0);
            let hash = req
                .params
                .get("hash")
                .and_then(|v| v.as_str())
                .map(|s| s.to_string())
                .unwrap_or_else(|| format!("0x{:x}", height));
            Json(RpcResponse { result: json!({"hash": hash, "height": height}) })
        }
        _ => Json(RpcResponse { result: json!("ok") }),
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


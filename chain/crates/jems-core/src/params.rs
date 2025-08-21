use serde::{Deserialize, Serialize};
use std::{env, fs, path::Path};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ActionKind {
    Like,
    CheckIn,
    Relay,
    Post,
    Visit,
}

pub const ACCOUNT_KEY_SCHEME: &str = "ed25519";
pub const VRF_KEY_SCHEME: &str = "sr25519_vrf";
pub const COMMITTEE_SIG_SCHEME: &str = "bls12-381_agg";
pub const ADDR_HRP: &str = "jem";

pub const SLOT_SECS: u64 = 4;
pub const EPOCH_SLOTS: u64 = 21_600;
pub const COMMITTEE_SIZE: u32 = 64;

pub const EMA_ALPHA: f64 = 0.25;
pub const BLOCKS_PER_EPOCH_TARGET: u64 = EPOCH_SLOTS;
pub const TOTAL_SUPPLY_JEMS: u64 = 100_000_000;

pub const REWARD_SPLIT_LEADER_PCT: u8 = 60;
pub const REWARD_SPLIT_COMMITTEE_PCT: u8 = 20;
pub const REWARD_SPLIT_HONEYPOT_PCT: u8 = 15;
pub const REWARD_SPLIT_ECOSYS_PCT: u8 = 5;

pub const W_MAX: u64 = 1_000_000;
pub const LAMBDA_DECAY: f64 = 0.80;
pub const TICKET_CAP_PER_EPOCH: u64 = 10_000;
pub const TICKET_RATE_PER_SLOT_MAX: u64 = 5;

pub const W_LIKE: u32 = 5;
pub const W_CHECKIN: u32 = 50;
pub const W_RELAY: u32 = 25;
pub const W_POST: u32 = 40;
pub const W_VISIT: u32 = 200;

pub const HP_BOUNTY_TICKETS_MIN: u64 = 10_000;
pub const HP_BOUNTY_TICKETS_MAX: u64 = 100_000;
pub const HP_EXPIRY_K_EPOCHS: u64 = 7;

pub fn default_hp_trigger_catalog() -> Vec<String> {
    vec![
        "6th_like_today".to_string(),
        "12th_checkin_today".to_string(),
        "nth_visit_landmark".to_string(),
    ]
}

pub const MIN_TX_FEE_MICROJEM: u64 = 1000;
pub const FEE_REBATE_COMMITTEE_BP: u32 = 1000;

pub const PRESENCE_COMMIT_SCHEME: &str = "H(landmarkId||timeWindow||actor_salt)";

pub const RPC_MAX_REQ_BYTES: u64 = 1_000_000;
pub const RPC_MAX_ARRAY_LEN: u64 = 5_000;
pub const RPC_RATE_LIMIT_QPS: u64 = 50;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProtocolParams {
    pub slot_secs: u64,
    pub epoch_slots: u64,
    pub committee_size: u32,
    pub ema_alpha: f64,
    pub blocks_per_epoch_target: u64,
    pub total_supply_jems: u64,
    pub reward_split_leader_pct: u8,
    pub reward_split_committee_pct: u8,
    pub reward_split_honeypot_pct: u8,
    pub reward_split_ecosys_pct: u8,
    pub w_max: u64,
    pub lambda_decay: f64,
    pub ticket_cap_per_epoch: u64,
    pub ticket_rate_per_slot_max: u64,
    pub w_like: u32,
    pub w_checkin: u32,
    pub w_relay: u32,
    pub w_post: u32,
    pub w_visit: u32,
    pub hp_bounty_tickets_min: u64,
    pub hp_bounty_tickets_max: u64,
    pub hp_expiry_k_epochs: u64,
    pub hp_trigger_catalog: Vec<String>,
    pub addr_hrp: String,
    pub min_tx_fee_microjem: u64,
    pub fee_rebate_committee_bp: u32,
    pub presence_commit_scheme: String,
    pub rpc_max_req_bytes: u64,
    pub rpc_max_array_len: u64,
    pub rpc_rate_limit_qps: u64,
}

impl Default for ProtocolParams {
    fn default() -> Self {
        Self {
            slot_secs: SLOT_SECS,
            epoch_slots: EPOCH_SLOTS,
            committee_size: COMMITTEE_SIZE,
            ema_alpha: EMA_ALPHA,
            blocks_per_epoch_target: BLOCKS_PER_EPOCH_TARGET,
            total_supply_jems: TOTAL_SUPPLY_JEMS,
            reward_split_leader_pct: REWARD_SPLIT_LEADER_PCT,
            reward_split_committee_pct: REWARD_SPLIT_COMMITTEE_PCT,
            reward_split_honeypot_pct: REWARD_SPLIT_HONEYPOT_PCT,
            reward_split_ecosys_pct: REWARD_SPLIT_ECOSYS_PCT,
            w_max: W_MAX,
            lambda_decay: LAMBDA_DECAY,
            ticket_cap_per_epoch: TICKET_CAP_PER_EPOCH,
            ticket_rate_per_slot_max: TICKET_RATE_PER_SLOT_MAX,
            w_like: W_LIKE,
            w_checkin: W_CHECKIN,
            w_relay: W_RELAY,
            w_post: W_POST,
            w_visit: W_VISIT,
            hp_bounty_tickets_min: HP_BOUNTY_TICKETS_MIN,
            hp_bounty_tickets_max: HP_BOUNTY_TICKETS_MAX,
            hp_expiry_k_epochs: HP_EXPIRY_K_EPOCHS,
            hp_trigger_catalog: default_hp_trigger_catalog(),
            addr_hrp: ADDR_HRP.to_string(),
            min_tx_fee_microjem: MIN_TX_FEE_MICROJEM,
            fee_rebate_committee_bp: FEE_REBATE_COMMITTEE_BP,
            presence_commit_scheme: PRESENCE_COMMIT_SCHEME.to_string(),
            rpc_max_req_bytes: RPC_MAX_REQ_BYTES,
            rpc_max_array_len: RPC_MAX_ARRAY_LEN,
            rpc_rate_limit_qps: RPC_RATE_LIMIT_QPS,
        }
    }
}

#[derive(Default, Debug, Clone, Serialize, Deserialize)]
struct ParamOverrides {
    slot_secs: Option<u64>,
    epoch_slots: Option<u64>,
    committee_size: Option<u32>,
    ema_alpha: Option<f64>,
    blocks_per_epoch_target: Option<u64>,
    total_supply_jems: Option<u64>,
    reward_split_leader_pct: Option<u8>,
    reward_split_committee_pct: Option<u8>,
    reward_split_honeypot_pct: Option<u8>,
    reward_split_ecosys_pct: Option<u8>,
    w_max: Option<u64>,
    lambda_decay: Option<f64>,
    ticket_cap_per_epoch: Option<u64>,
    ticket_rate_per_slot_max: Option<u64>,
    w_like: Option<u32>,
    w_checkin: Option<u32>,
    w_relay: Option<u32>,
    w_post: Option<u32>,
    w_visit: Option<u32>,
    hp_bounty_tickets_min: Option<u64>,
    hp_bounty_tickets_max: Option<u64>,
    hp_expiry_k_epochs: Option<u64>,
    hp_trigger_catalog: Option<Vec<String>>,
    addr_hrp: Option<String>,
    min_tx_fee_microjem: Option<u64>,
    fee_rebate_committee_bp: Option<u32>,
    presence_commit_scheme: Option<String>,
    rpc_max_req_bytes: Option<u64>,
    rpc_max_array_len: Option<u64>,
    rpc_rate_limit_qps: Option<u64>,
}

impl ProtocolParams {
    fn apply(&mut self, o: ParamOverrides) {
        if let Some(v) = o.slot_secs { self.slot_secs = v; }
        if let Some(v) = o.epoch_slots { self.epoch_slots = v; }
        if let Some(v) = o.committee_size { self.committee_size = v; }
        if let Some(v) = o.ema_alpha { self.ema_alpha = v; }
        if let Some(v) = o.blocks_per_epoch_target { self.blocks_per_epoch_target = v; }
        if let Some(v) = o.total_supply_jems { self.total_supply_jems = v; }
        if let Some(v) = o.reward_split_leader_pct { self.reward_split_leader_pct = v; }
        if let Some(v) = o.reward_split_committee_pct { self.reward_split_committee_pct = v; }
        if let Some(v) = o.reward_split_honeypot_pct { self.reward_split_honeypot_pct = v; }
        if let Some(v) = o.reward_split_ecosys_pct { self.reward_split_ecosys_pct = v; }
        if let Some(v) = o.w_max { self.w_max = v; }
        if let Some(v) = o.lambda_decay { self.lambda_decay = v; }
        if let Some(v) = o.ticket_cap_per_epoch { self.ticket_cap_per_epoch = v; }
        if let Some(v) = o.ticket_rate_per_slot_max { self.ticket_rate_per_slot_max = v; }
        if let Some(v) = o.w_like { self.w_like = v; }
        if let Some(v) = o.w_checkin { self.w_checkin = v; }
        if let Some(v) = o.w_relay { self.w_relay = v; }
        if let Some(v) = o.w_post { self.w_post = v; }
        if let Some(v) = o.w_visit { self.w_visit = v; }
        if let Some(v) = o.hp_bounty_tickets_min { self.hp_bounty_tickets_min = v; }
        if let Some(v) = o.hp_bounty_tickets_max { self.hp_bounty_tickets_max = v; }
        if let Some(v) = o.hp_expiry_k_epochs { self.hp_expiry_k_epochs = v; }
        if let Some(v) = o.hp_trigger_catalog { self.hp_trigger_catalog = v; }
        if let Some(v) = o.addr_hrp { self.addr_hrp = v; }
        if let Some(v) = o.min_tx_fee_microjem { self.min_tx_fee_microjem = v; }
        if let Some(v) = o.fee_rebate_committee_bp { self.fee_rebate_committee_bp = v; }
        if let Some(v) = o.presence_commit_scheme { self.presence_commit_scheme = v; }
        if let Some(v) = o.rpc_max_req_bytes { self.rpc_max_req_bytes = v; }
        if let Some(v) = o.rpc_max_array_len { self.rpc_max_array_len = v; }
        if let Some(v) = o.rpc_rate_limit_qps { self.rpc_rate_limit_qps = v; }
    }

    pub fn from_env() -> ParamOverrides {
        let mut o = ParamOverrides::default();
        macro_rules! parse_env {
            ($field:ident, $ty:ty, $name:expr) => {
                if let Ok(val) = env::var($name) { o.$field = val.parse::<$ty>().ok(); }
            };
        }
        parse_env!(slot_secs, u64, "SLOT_SECS");
        parse_env!(epoch_slots, u64, "EPOCH_SLOTS");
        parse_env!(committee_size, u32, "COMMITTEE_SIZE");
        parse_env!(ema_alpha, f64, "EMA_ALPHA");
        parse_env!(blocks_per_epoch_target, u64, "BLOCKS_PER_EPOCH_TARGET");
        parse_env!(total_supply_jems, u64, "TOTAL_SUPPLY_JEMS");
        parse_env!(reward_split_leader_pct, u8, "REWARD_SPLIT_LEADER_PCT");
        parse_env!(reward_split_committee_pct, u8, "REWARD_SPLIT_COMMITTEE_PCT");
        parse_env!(reward_split_honeypot_pct, u8, "REWARD_SPLIT_HONEYPOT_PCT");
        parse_env!(reward_split_ecosys_pct, u8, "REWARD_SPLIT_ECOSYS_PCT");
        parse_env!(w_max, u64, "W_MAX");
        parse_env!(lambda_decay, f64, "LAMBDA_DECAY");
        parse_env!(ticket_cap_per_epoch, u64, "TICKET_CAP_PER_EPOCH");
        parse_env!(ticket_rate_per_slot_max, u64, "TICKET_RATE_PER_SLOT_MAX");
        parse_env!(w_like, u32, "W_LIKE");
        parse_env!(w_checkin, u32, "W_CHECKIN");
        parse_env!(w_relay, u32, "W_RELAY");
        parse_env!(w_post, u32, "W_POST");
        parse_env!(w_visit, u32, "W_VISIT");
        parse_env!(hp_bounty_tickets_min, u64, "HP_BOUNTY_TICKETS_MIN");
        parse_env!(hp_bounty_tickets_max, u64, "HP_BOUNTY_TICKETS_MAX");
        parse_env!(hp_expiry_k_epochs, u64, "HP_EXPIRY_K_EPOCHS");
        if let Ok(val) = env::var("HP_TRIGGER_CATALOG") {
            o.hp_trigger_catalog = Some(val.split(',').map(|s| s.to_string()).collect());
        }
        parse_env!(addr_hrp, String, "ADDR_HRP");
        parse_env!(min_tx_fee_microjem, u64, "MIN_TX_FEE_MICROJEM");
        parse_env!(fee_rebate_committee_bp, u32, "FEE_REBATE_COMMITTEE_BP");
        parse_env!(presence_commit_scheme, String, "PRESENCE_COMMIT_SCHEME");
        parse_env!(rpc_max_req_bytes, u64, "RPC_MAX_REQ_BYTES");
        parse_env!(rpc_max_array_len, u64, "RPC_MAX_ARRAY_LEN");
        parse_env!(rpc_rate_limit_qps, u64, "RPC_RATE_LIMIT_QPS");
        o
    }

    pub fn from_toml(path: impl AsRef<Path>) -> ParamOverrides {
        if let Ok(contents) = fs::read_to_string(path) {
            toml::from_str::<ParamOverrides>(&contents).unwrap_or_default()
        } else {
            ParamOverrides::default()
        }
    }

    pub fn effective() -> Self {
        let mut params = ProtocolParams::default();
        params.apply(ProtocolParams::from_env());
        if let Ok(path) = env::var("JEMS_CONFIG") {
            params.apply(ProtocolParams::from_toml(path));
        }
        params
    }

    pub fn to_markdown_table(&self) -> String {
        format!(r#"| Group | Parameter | Value | Notes |
|---|---|---:|---|
| Timing | `SLOT_SECS` | **{} s** | Target 1 block per slot |
| Timing | `EPOCH_SLOTS` | **{}** | ~1 day at 4 s/slot |
| Committee | `COMMITTEE_SIZE` | **{}** | VRF-sampled per slot |
| Difficulty | `EMA_ALPHA` | **{}** | Smoothing for retarget |
| Emission | `BLOCKS_PER_EPOCH_TARGET` | **{}** | Matches `EPOCH_SLOTS` |
| Emission | `TOTAL_SUPPLY_JEMS` | **{}** | Fixed supply |
| Rewards | `LEADER/COMMITTEE/HONEYPOT/ECOSYS` | **{}% / {}% / {}% / {}%** | Sum = 100% |
| Tickets | `W_MAX` | **{}** | Cap on engagement weight |
| Tickets | `LAMBDA_DECAY` | **{:.2}** | W_next = λ·W_prev + Σw_k |
| Tickets | `TICKET_CAP_PER_EPOCH` | **{}** | Per identity |
| Tickets | `TICKET_RATE_PER_SLOT_MAX` | **{}** | Anti‑spam rate |
| Ticket Weights | `W_LIKE` | **{}** | Relative units |
| Ticket Weights | `W_CHECKIN` | **{}** |  |
| Ticket Weights | `W_RELAY` | **{}** |  |
| Ticket Weights | `W_POST` | **{}** |  |
| Ticket Weights | `W_VISIT` | **{}** | IRL presence commit |
| Honey‑Pot | `HP_BOUNTY_TICKETS_MIN` | **{}** |  |
| Honey‑Pot | `HP_BOUNTY_TICKETS_MAX` | **{}** |  |
| Honey‑Pot | `HP_EXPIRY_K_EPOCHS` | **{}** | ~1 week |
| Honey‑Pot | `HP_TRIGGER_CATALOG` | **{:?}** | Governance‑tunable |
| Crypto | `ACCOUNT_KEY_SCHEME` | **{}** | Accounts |
| Crypto | `VRF_KEY_SCHEME` | **{}** | Leader lottery |
| Crypto | `COMMITTEE_SIG_SCHEME` | **{}** | Finality |
| Addressing | `ADDR_HRP` | **"{}"** | Bech32 HRP |
| Fees | `MIN_TX_FEE_MICROJEM` | **{}** | Example floor |
| Fees | `FEE_REBATE_COMMITTEE_BP` | **{}** | 10% rebate |
| Privacy | `PRESENCE_COMMIT_SCHEME` | **{}** | No raw GPS |
| RPC | `RPC_MAX_REQ_BYTES` | **{}** | Size guard |
| RPC | `RPC_MAX_ARRAY_LEN` | **{}** |  |
| RPC | `RPC_RATE_LIMIT_QPS` | **{}** | Per‑IP guard |"#,
            self.slot_secs,
            self.epoch_slots,
            self.committee_size,
            self.ema_alpha,
            self.blocks_per_epoch_target,
            self.total_supply_jems,
            self.reward_split_leader_pct,
            self.reward_split_committee_pct,
            self.reward_split_honeypot_pct,
            self.reward_split_ecosys_pct,
            self.w_max,
            self.lambda_decay,
            self.ticket_cap_per_epoch,
            self.ticket_rate_per_slot_max,
            self.w_like,
            self.w_checkin,
            self.w_relay,
            self.w_post,
            self.w_visit,
            self.hp_bounty_tickets_min,
            self.hp_bounty_tickets_max,
            self.hp_expiry_k_epochs,
            self.hp_trigger_catalog,
            ACCOUNT_KEY_SCHEME,
            VRF_KEY_SCHEME,
            COMMITTEE_SIG_SCHEME,
            self.addr_hrp,
            self.min_tx_fee_microjem,
            self.fee_rebate_committee_bp,
            self.presence_commit_scheme,
            self.rpc_max_req_bytes,
            self.rpc_max_array_len,
            self.rpc_rate_limit_qps
        )
    }
}

pub fn w_for_action(kind: ActionKind) -> u32 {
    match kind {
        ActionKind::Like => W_LIKE,
        ActionKind::CheckIn => W_CHECKIN,
        ActionKind::Relay => W_RELAY,
        ActionKind::Post => W_POST,
        ActionKind::Visit => W_VISIT,
    }
}

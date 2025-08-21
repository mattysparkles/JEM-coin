# JEMs Protocol v0.3

## Default Parameters

| Group | Parameter | Value | Notes |
|---|---|---:|---|
| Timing | `SLOT_SECS` | **4 s** | Target 1 block per slot |
| Timing | `EPOCH_SLOTS` | **21600** | ~1 day at 4 s/slot |
| Committee | `COMMITTEE_SIZE` | **64** | VRF-sampled per slot |
| Difficulty | `EMA_ALPHA` | **0.25** | Smoothing for retarget |
| Emission | `BLOCKS_PER_EPOCH_TARGET` | **21600** | Matches `EPOCH_SLOTS` |
| Emission | `TOTAL_SUPPLY_JEMS` | **100,000,000** | Fixed supply |
| Rewards | `LEADER/COMMITTEE/HONEYPOT/ECOSYS` | **60% / 20% / 15% / 5%** | Sum = 100% |
| Tickets | `W_MAX` | **1,000,000** | Cap on engagement weight |
| Tickets | `LAMBDA_DECAY` | **0.80** | W_next = λ·W_prev + Σw_k |
| Tickets | `TICKET_CAP_PER_EPOCH` | **10,000** | Per identity |
| Tickets | `TICKET_RATE_PER_SLOT_MAX` | **5** | Anti‑spam rate |
| Ticket Weights | `W_LIKE` | **5** | Relative units |
| Ticket Weights | `W_CHECKIN` | **50** |  |
| Ticket Weights | `W_RELAY` | **25** |  |
| Ticket Weights | `W_POST` | **40** |  |
| Ticket Weights | `W_VISIT` | **200** | IRL presence commit |
| Honey‑Pot | `HP_BOUNTY_TICKETS_MIN` | **10,000** |  |
| Honey‑Pot | `HP_BOUNTY_TICKETS_MAX` | **100,000** |  |
| Honey‑Pot | `HP_EXPIRY_K_EPOCHS` | **7** | ~1 week |
| Honey‑Pot | `HP_TRIGGER_CATALOG` | **[“6th_like_today”, “12th_checkin_today”, “nth_visit_landmark”]** | Governance‑tunable |
| Crypto | `ACCOUNT_KEY_SCHEME` | **ed25519** | Accounts |
| Crypto | `VRF_KEY_SCHEME` | **sr25519_vrf** | Leader lottery |
| Crypto | `COMMITTEE_SIG_SCHEME` | **bls12-381_agg** | Finality |
| Addressing | `ADDR_HRP` | **"jem"** | Bech32 HRP |
| Fees | `MIN_TX_FEE_MICROJEM` | **1000** | Example floor |
| Fees | `FEE_REBATE_COMMITTEE_BP` | **1000** | 10% rebate |
| Privacy | `PRESENCE_COMMIT_SCHEME` | **H(landmarkId||timeWindow||actor_salt)** | No raw GPS |
| RPC | `RPC_MAX_REQ_BYTES` | **1,000,000** | Size guard |
| RPC | `RPC_MAX_ARRAY_LEN` | **5000** |  |
| RPC | `RPC_RATE_LIMIT_QPS` | **50** | Per‑IP guard |

All values are overrideable via `jems.config.toml` or environment variables. All nodes MUST agree on the effective parameter set; governance (JIP) is used to coordinate changes network‑wide.

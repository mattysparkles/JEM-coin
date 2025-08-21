use jems_core::params::*;

#[test]
fn defaults_match() {
    let p = ProtocolParams::default();
    assert_eq!(p.slot_secs, SLOT_SECS);
    assert_eq!(p.epoch_slots, EPOCH_SLOTS);
    assert_eq!(p.committee_size, COMMITTEE_SIZE);
    assert!((p.ema_alpha - EMA_ALPHA).abs() < f64::EPSILON);
    assert_eq!(p.blocks_per_epoch_target, BLOCKS_PER_EPOCH_TARGET);
    assert_eq!(p.total_supply_jems, TOTAL_SUPPLY_JEMS);
    assert_eq!(p.reward_split_leader_pct, REWARD_SPLIT_LEADER_PCT);
    assert_eq!(p.reward_split_committee_pct, REWARD_SPLIT_COMMITTEE_PCT);
    assert_eq!(p.reward_split_honeypot_pct, REWARD_SPLIT_HONEYPOT_PCT);
    assert_eq!(p.reward_split_ecosys_pct, REWARD_SPLIT_ECOSYS_PCT);
    assert_eq!(p.w_max, W_MAX);
    assert_eq!(p.lambda_decay, LAMBDA_DECAY);
    assert_eq!(p.ticket_cap_per_epoch, TICKET_CAP_PER_EPOCH);
    assert_eq!(p.ticket_rate_per_slot_max, TICKET_RATE_PER_SLOT_MAX);
    assert_eq!(p.w_like, W_LIKE);
    assert_eq!(p.w_checkin, W_CHECKIN);
    assert_eq!(p.w_relay, W_RELAY);
    assert_eq!(p.w_post, W_POST);
    assert_eq!(p.w_visit, W_VISIT);
    assert_eq!(p.hp_bounty_tickets_min, HP_BOUNTY_TICKETS_MIN);
    assert_eq!(p.hp_bounty_tickets_max, HP_BOUNTY_TICKETS_MAX);
    assert_eq!(p.hp_expiry_k_epochs, HP_EXPIRY_K_EPOCHS);
    assert_eq!(p.min_tx_fee_microjem, MIN_TX_FEE_MICROJEM);
    assert_eq!(p.fee_rebate_committee_bp, FEE_REBATE_COMMITTEE_BP);
    assert_eq!(p.rpc_max_req_bytes, RPC_MAX_REQ_BYTES);
    assert_eq!(p.rpc_max_array_len, RPC_MAX_ARRAY_LEN);
    assert_eq!(p.rpc_rate_limit_qps, RPC_RATE_LIMIT_QPS);
}

#[test]
fn invariants() {
    let p = ProtocolParams::default();
    assert_eq!(p.reward_split_leader_pct as u16
        + p.reward_split_committee_pct as u16
        + p.reward_split_honeypot_pct as u16
        + p.reward_split_ecosys_pct as u16, 100);
    assert!(p.ema_alpha > 0.0 && p.ema_alpha < 1.0);
    assert!(p.slot_secs >= 1 && p.slot_secs <= 10);
    assert!(p.epoch_slots >= 3600);
}

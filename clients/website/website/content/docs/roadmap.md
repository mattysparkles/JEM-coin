# JEMs Roadmap

This document outlines the major components needed to evolve JEM coin toward a secure, user-ready platform. Each section lists actionable tickets that can be tracked individually.

## 1. PoE-VRF Consensus & Committee Finality
- [ ] **Consensus design**
  - [ ] Specify a Proof of Epoch (PoE) scheme and VRF-based leader selection
  - [ ] Define block structure, committee membership, and slashing rules
- [ ] **VRF implementation**
  - [ ] Adopt a secure VRF library such as `hash-vrf` or `ristretto255`
  - [ ] Integrate VRF calls into the block proposal flow
- [ ] **Committee finality**
  - [ ] Introduce a HotStuff-style protocol for block finalization
  - [ ] Define quorum thresholds and message propagation rules

## 2. Networking, Validation & Transaction Processing
- [ ] **Peer-to-peer networking**
  - [ ] Employ `libp2p` or similar for discovery, connections, and gossip
  - [ ] Collect and expose bandwidth and latency metrics
- [ ] **Transaction pool**
  - [ ] Implement a mempool with validation logic and spam prevention
  - [ ] Support priority rules for transaction selection
- [ ] **Block validation**
  - [ ] Verify blocks and transactions against consensus rules and signatures
  - [ ] Apply state transitions and reject invalid data

## 3. RPC & GraphQL APIs
- [ ] **RPC layer**
  - [ ] Provide JSON-RPC endpoints for node info, account queries, transaction submission, and chain metadata
- [ ] **GraphQL gateway**
  - [ ] Design schemas for blocks, transactions, accounts, and event subscriptions
- [ ] **API documentation**
  - [ ] Auto-generate reference docs using OpenAPI or GraphQL introspection
  - [ ] Host the generated documentation for developers

## 4. Wallet Integration & User Actions
- [ ] **Wallet APIs**
  - [ ] Define methods for key management, signing, and broadcasting transactions
  - [ ] Ensure compatibility with hardware wallets when possible
- [ ] **Sample wallet/UI**
  - [ ] Provide a reference web or desktop wallet for send/receive, balance display, and history
- [ ] **User testing**
  - [ ] Gather feedback from real users to refine UX and detect bugs

## 5. Documentation, Tests & Production Hardening
- [ ] **Documentation**
  - [ ] Expand README and docs covering consensus details, APIs, setup guides, and architecture
- [ ] **Testing**
  - [ ] Add unit tests for consensus logic
  - [ ] Create integration tests for networking and mempool
  - [ ] Implement end-to-end tests for RPC and wallet flows
- [ ] **Security & reliability**
  - [ ] Audit cryptographic usage and enforce logging/metrics
  - [ ] Perform load testing to validate production readiness


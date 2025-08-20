# ZK-friendly Presence Proofs

Clients can emit privacy-preserving commitments for real-world presence without revealing exact coordinates.

```
C = H(landmarkId || timeWindow || actorSalt)
```

These commitments are attached to tickets of kind `Visit` and stored by the indexer.

## Circuit Interface

- Public inputs: `landmarkId`, `timeWindow`, `C`
- Private inputs: `device_secret`, `coarse_location_proof`
- Constraint: `H(landmarkId || timeWindow || H(device_secret)) == C`

Future work will replace the `coarse_location_proof` with a SNARK. See `clients/sdk-web` for test vectors.

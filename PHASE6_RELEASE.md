# Mastery Phase VI — Release: Durable Recovery and Isolated Subscribers

## Scope

A rigorous university-style computing module teaching write-ahead log commit order, idempotent retries, recovery framing, bounded subscriber retention, and the limits of test evidence. The live static website uses a separate JavaScript **pedagogical model**, not arbitrary student-code execution. The native Linux C++20 project implements a real file-backed journal.

### Five lectures

1. Commit points and fsync: acknowledged state must be replayable.
2. Idempotency keys and canonical payloads: the meaning of retry.
3. Complete versus torn records, strict sequences, and fail-closed checksums.
4. Per-subscriber history retention, cursor arithmetic, and resnapshot.
5. Honest claims: power failure, leader consensus, storage hardware, and external side effects.

### Two labs and three written defenses

- Five crash-cut modes and step-by-step WAL/ledger states.
- Retained feed with independent fast and slow cursors, bounded memory, gap detection, and resnapshot.
- Three free-response engineering cases with explicit self-review rubrics; no automatic proof grading.

### Native C++20 reference

- Exclusive advisory lock (Linux `flock`) and fsynced WAL records before memory apply or success acknowledgement.
- Canonical newline records with FNV-1a checksums and strict sequence/epoch verification.
- Automatic truncation only for an incomplete *unterminated* suffix. Complete but invalid lines fail closed.
- Client/key ledger recovered from the same records as the order book, including business-rule rejections.
- Replays committed requests once and returns the original receipt on exact retries; conflicts reject.
- Native crash injection after `fsync` and before in-memory apply in a **forked process**.
- Single-writer file lock and stored epoch promotion records.
- Bounded retained feed with independent cursors and explicit `GAP_NEEDS_SNAPSHOT` when history is missing.
- Max 16 MiB WAL and educational input bounds; there is no compaction, multiwriter safety, or production consensus.

## Local verification (November 5, 2026)

- **C++ Debug CTest:** 1/1 suite passed, including 600 seeded request events, idempotent retries, torn tail and checksum faults, process crash after fsync, replay, promotion and slow subscriber behavior.
- **C++ ASan + UBSan CTest:** 1/1 suite passed locally.
- **Node reference:** Five crash-cut scenarios plus 6,000 deterministic retained-feed messages passed.
- **Chromium:** 10 open routes and interactions passed locally with inlined static source: writing, navigation, crash cases, queue lag, export, timer, small-screen layout and no JavaScript exceptions.

The GitHub workflow `.github/workflows/phase6-ci.yml` additionally tests actual HTTP navigation in Chromium and compiles the native code on Ubuntu. Check its run before calling the released site verified.

## Boundaries and exclusions

This is a **single-process Linux reference**, not a production exchange, settlement engine, or power-cut certified database. A process-kill test is not a hardware power-loss test. An fsync return value is dependent on kernel, filesystem, storage stack and hardware behavior. Checksums are not cryptographic authentication. External side effects are not coordinated. Promotion requires an outside leader authority in any real distributed system. The browser visuals describe the conceptual ordering only; native hardware execution, memory and actual disk IO must be investigated in the C++ reference and OS test environment.

## Next phase (candidate)

Segmented WAL compaction with snapshot/log cutover, malicious-input fuzzing and shrinking, production-grade authentication and risk-boundary threat modeling, and measurable multi-host replay/backpressure experiments.
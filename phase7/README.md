# Phase VII — Segmented WAL, checkpoint compaction, deterministic fault testing

**Course:** `phase7.html` in the Mastery site. **Native reference:** C++20 in `phase7/include/segmented.hpp`, with `phase7/tests/test_segmented.cpp`.

## Teaching objectives

After this laboratory, you should be able to distinguish WAL record durability from application of its effects, explain recovery of a committed prefix, publish a crash-safe logical checkpoint under the stated filesystem assumptions, define a bounded idempotency policy, and write a fault-injection test that falsifies an incorrect implementation.

The four original lecture chapters include definitions, assumptions, a formal claim, proof sketch, worked example, counterexample, open-ended recitation and model answer. Six reference-model scenarios let you inspect the exact crash cut. No lecture progression locks or decorative visualizations.

## Build (Linux/POSIX)

```bash
cmake -S phase7 -B phase7/build -DCMAKE_BUILD_TYPE=Debug
cmake --build phase7/build --parallel
ctest --test-dir phase7/build --output-on-failure
cmake -S phase7 -B phase7/build-san -DCMAKE_BUILD_TYPE=Debug -DMASTERY_SANITIZE=ON
cmake --build phase7/build-san --parallel
ctest --test-dir phase7/build-san --output-on-failure
```

The native reference uses `open`, `flock`, `write`, `fsync`, `rename`, `ftruncate`, `pread` and directory `fsync`; a POSIX-like Linux host is required. The project uses C++20, `-Wall -Wextra -Wpedantic -Werror`, and ASan/UBSan in the sanitizer run. Windows native execution is not covered.

### Model and failure boundaries

The contract is a **single cooperative writer** with a locked directory and a file-backed log. Each complete WAL record is checksummed and assigned a contiguous sequence. A successful call first syncs the record, then updates the in-memory state. When the process exits after sync but before apply/response, restart replays the record; a retry with the same client-token pair returns the stored result without a second append.

The snapshot stores *all* request receipts and the map state at a known sequence. It is staged under a temporary name, fsynced, renamed and followed by directory sync. Only then does compaction start a new segment and delete older WAL files. Old records at or before the snapshot sequence are skipped on recovery. A torn final WAL suffix is truncated; a corrupt complete record is rejected. Crash after snapshot-write before rename is explicitly injected.

The test suite checks: segmentation, FIFO sequence ordering, idempotent retries, conflicts, writer lock, compact-and-recover, a `fork` crash after sync, snapshot publish failure, torn tail, complete-record corruption, snapshot corruption, and **3,000 seeded transactions** compared against an independent map.

### Important limitations

- **This is not a production storage engine.** The checksum is noncryptographic; no hostile tamper resistance or consensus is provided.
- Hardware power-failure durability depends on filesystem, storage device, sync guarantees and kernel behaviour. The suite proves a narrower process-crash boundary, not universal power-loss durability.
- Full idempotency receipt history is preserved, meaning compaction does **not** bound idempotency memory. Designing receipt expiry is an advanced next exercise.
- The sample store contains string key/value transactions rather than actual exchange fills. The exchange engine is in the preceding `phase6/` and `exchange/` modules.
- The browser demonstration is an **independent explanatory reference**, not a trace or sanitizer of learner code.
- It does not support concurrent writers, durable network delivery, replication or end-to-end exactly-once external side effects.
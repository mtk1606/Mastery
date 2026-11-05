# Mastery Phase V · Recovery, bounded fanout and engineering interviews

A rigorous, independent learning module. The website is at [`phase5.html`](../phase5.html). The **native engine** and **browser teaching model** are separate implementations compared using a pinned canonical checkpoint and golden replay fingerprint.

## Build and run the native C++20 lab

From the Mastery repository root:

```sh
cmake -S phase5 -B phase5/build -DCMAKE_BUILD_TYPE=Debug
cmake --build phase5/build
ctest --test-dir phase5/build --output-on-failure
./phase5/build/reliability_demo phase5/build/demo.snapshot
```

Optional sanitizer pass (GCC/Clang on Linux):

```sh
cmake -S phase5 -B phase5/build-asan -DCMAKE_BUILD_TYPE=Debug -DMASTERY_SANITIZE=ON
cmake --build phase5/build-asan
ctest --test-dir phase5/build-asan --output-on-failure
```

The executable asserts deterministic multi-symbol replay, global-versus-local sequencing, checkpoint checksum validation, FIFO restoration and duplicate-ID rejection, epoch fencing, strict sequence-gap rejection, and all-or-nothing bounded fanout. It tests 4,000 seeded venue messages with periodic snapshot re-imports.

### Files and purposes

- `include/reliability.hpp`: multi-symbol dispatcher and snapshot codec, epoch fencing, bounded fanout.
- `../exchange/include/exchange.hpp`: previous exchange engine now supports `export_snapshot()` and strong-commit `import_snapshot()` while rebuilding list iterators.
- `src/demo.cpp`: executable walkthrough that optionally writes/reads a checkpoint file and compares uninterrupted and resumed state hashes.
- `fixtures/checkpoint.txt`: pinned byte-for-byte canonical checkpoint shared with JS tests.
- `tests/test_reliability.cpp`: C++20 assertions for recovery and queue safety.
- `../phase5-sim.js`: separately written browser reference, independently tested against canonical values.
- `../phase5-data.js`, `../phase5.js`: six substantial lectures, two reference experiments, four timed self-review interview rounds.

## Study sequence (accelerated, but rigorous)

1. Router and isolation: prove global-vs-local sequence relations; inspect `Venue::apply`.
2. Checkpoint and replay: derive the induction argument for recovery; compare identical canonical outputs.
3. Epoch fencing: inject stale/future epochs, observe no state mutation, identify the missing consensus layer.
4. Queue saturation: induce backpressure, drain one client and retry, defend a resnapshot policy.
5. Reliability verification: reason from tests and the C++/JS oracle, not just a matching checksum.
6. Performance methods and timed interview simulations: explain the code, justify a design and self-assess against explicit criteria.

## What the implementation DOES and DOES NOT guarantee

**Implemented:** deterministic in-process reference replay, integrity-checked logical checkpoints, FIFO-preserving restore, no partial state change on invalid checkpoint, rejection of stale epochs and nonconsecutive global sequences, explicit queue backpressure with all-or-nothing enqueue, testable browser models and saved study work.

**Not implemented:** a real consensus/lease service, two-phase durable snapshot+WAL commit, fsync and power-cut recovery guarantees, business-level exactly-once order idempotency, OS networking, per-client reconnect streams, true multi-threaded matching, true crash injection, production market protocols or hardware latency guarantees. FNV-1a is a regression checksum, *not* cryptographic authentication. The browser diagrams are not arbitrary learner C++ traces.

The course notes and interview cases are independently authored educational examples, not verified proprietary questions from any named employer. Light and Dark mode come from the existing shared Mastery theme. The timed interviews are practice exercises with manual rubrics, not AI-reviewed proofs.
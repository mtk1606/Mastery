# Mastery Phase V — Release verification

**Release date:** November 5, 2026  
**Course:** https://mtk1606.github.io/Mastery/phase5.html  
**Repository:** https://github.com/mtk1606/Mastery  
**Final code CI:** https://github.com/mtk1606/Mastery/actions/runs/42034286491

## What was added

- Six original advanced reliability lectures with definitions, proof sketches, worked examples, counterexamples, written recitations and full model reasoning.
- An interactive multi-symbol checkpoint/replay experiment including missing event, duplicate delivery, corrupted snapshot and stale-leader scenarios.
- An interactive bounded two-client feed with explicit atomic backpressure and subscriber cursors.
- Four timed SWE-graduate, quant-developer, low-latency-engineer and distributed-systems interview simulations with manual rubrics and editable answers.
- Independent course progress export/restore, persistent study drafts and timers, Light/Dark support and unrestricted access.
- A native C++20 multi-symbol venue with FIFO-preserving logical snapshot export/import, ordered global and per-symbol sequence accounting, epoch fencing, and explicit bounded fanout.
- A separately authored JavaScript reference model with a byte-for-byte matching checkpoint and identical golden state hash.

## Verified QA

GitHub Actions run **42034286491 completed successfully**, with both jobs green:

1. **Native + reference:** JavaScript syntax and deterministic tests; native C++20 CMake build and CTest; C++ demo checkpoint file write/read; AddressSanitizer and UndefinedBehaviorSanitizer CTest.
2. **Actual browser journey:** Headless Playwright Chromium over a served HTTP website. Covered all 12 course routes, lecture notes and model-solution reveal, normal and faulty checkpoint replay, sequence-gap detection, duplicate delivery, corrupt snapshot rejection, bounded queue saturation/retry, timed interviews, checklist persistence, study record download/restore, Light/Dark controls and mobile layout.

Additional tests in the native and independent JavaScript suites process **4,000 seeded events each** and periodically compare state after checkpoint restore. The cross-language reference uses exact bytes of the checkpoint fixture and the same **FNV-1a fingerprint 780225790431407597** at global sequence 10 in epoch 1. A subsequent promotion changes the fingerprint because the epoch is intentionally part of canonical state; the UI correctly distinguishes these hashes.

## Important limitations

- This is an **educational in-process engine**, not a production exchange or exchange gateway.
- A checkpoint represents validated logical state, but this course does not implement durable WAL commit coordination, a file+directory fsync protocol, consensus, recovery from real power interruption, network protocols or business-level exactly-once idempotency.
- Epoch fencing is receiver-local; it does not itself appoint a globally unique leader.
- The all-or-nothing fanout intentionally stalls all clients when any queue is full. A real deployment needs client isolation, spooling/disconnect policies and verified snapshot-resubscription.
- FNV-1a is a **regression checksum**, not a cryptographic signature or protection against malicious modification.
- The interactive browser visualization is an **independent JavaScript reference model**, not an execution trace of learner C++ code.
- Interview problems are original public-style exercises, **not verified or proprietary questions** from a named employer. Written solutions are self-evaluated; no AI proof grader has been added.
- Progress is local to each browser; there is no account-based synchronization.

## Next phase candidate

Build an observable fault-tolerant order gateway with durable append-only log design, replayable client idempotency keys, bounded per-subscriber retention, scenario-specific monitoring, property-based test shrinking and controlled native performance experiments. All new production-style claims should require a separate threat model and crash/consensus tests.

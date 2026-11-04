# Mastery · Phases III–IV — Exchange Engineering & Systems Design

**Course page:** [Market Systems Engineering](market-systems.html) · [Native C++ project](exchange/README.md)

## Phase III — Exchange Simulator and Native Performance (implemented)

- C++20 price–time matching using integer ticks, stable FIFO list iterators, O(log price levels) navigation and indexed cancellation.
- Market IOC, limit crossing, partial fills, explicit reject policy, strict partition sequencing and gap detection.
- Reproducible CSV event replay with a pinned 12-event golden state and 64-bit regression checksum, equal in independent JavaScript and C++ reference implementations.
- Deterministic unit tests, CTest, sanitizer build and GitHub CI.
- Measured native `steady_clock` benchmark p50/p95/p99 JSON export with honest methodological limitations; `std::pmr` arena experiment.
- Four faculty-style lecture chapters with definitions before use, proof/invariant, worked example, counterexample and self-reviewed recitation.
- Interactive browser event tape, FIFO/partial-fill visual, failure injection and an input editor; the visual **does not** instrument learner C++.

## Phase IV — Distributed Architecture Studios (implemented)

- Three substantial open-ended cases: order gateway with risk/idempotency, market-data fanout/recovery, and primary crash/leader failover.
- Each includes constraints, deliverables, two staged hints, worked architecture and manual evaluation rubric. Written submissions and checklists are saved/exportable.
- Interactive bandwidth estimator with explicit units and simplified assumptions.
- User-supplied native benchmark viewer; the page does not invent or silently simulate claimed p99 latency.
- Both Light/Dark themes and existing independent courses remain intact, with no progression locks.

## Still not production features

No cross-process consensus or real exchange feed, no production risk model, no native browser thread counters, no executable remote arbitrary C++ endpoint, no code autograding for architecture essays, and no live trading integration. The native benchmark measures synthetic operations on a specific machine and must not be represented as real venue latency.

## Next phase V proposal

Extend to a multi-symbol replay with recorded snapshot/delta recovery, bounded market-data fanout, deterministic fault injection, and timed senior-level engineering mock interviews. Add source-level provenance, property-based tests, randomized model-checking against an independent oracle, and benchmark experiment comparison tooling. Do not publish a performance claim until collected under documented controls.
# Mastery Phase XIV-D — Visual Systems & Reliability

**Release:** November 5, 2026. **Scope:** all six shared C4 Foundation lessons. Together with earlier phases there are 27 original Foundation visualization labs.

The mission: show *why* correctness breaks under retries, crashes, racing writes and long-tail performance, then show what precise invariants and safeguards repair the failure. These scenes are **deterministic illustrative models**, not actual PostgreSQL transactions, Git commits, backend requests, measured benchmarks or threads executing in production.

## Six interactive scenes

| C4 lesson | New visual | Scenarios and numerical truth |
|---|---|---|
| c4-testing | Event deduplication pipeline | Four-event tape, first-write-wins replay prevention versus naive counting, and conflicting payload with repeated ID. Durable mode totals AAPL 17 and MSFT 5; naive replay can yield AAPL 1016 or MSFT 905. Stable globally unique event IDs and durable receipts are **model assumptions**, not implemented storage. |
| c4-git | Reproducible regression-review sequence | Positive sample passes flawed maximum-window initialization; a negative-only sample exposes incorrect zero output, while correct first-valid-window initialization returns negative one. Describes tests and review evidence without claiming to run Git or CI. |
| c4-profiling | Synthetic latency histogram and exact ranks | Steady, tail and burst workloads with per-request latency, arithmetic mean, nearest-rank p50/p95/p99 and completed-request throughput. Example: nineteen 20ms requests plus one 400ms request yields nearest-rank p95=20ms, p99=400ms. Synthetic inputs, **not a benchmark**. |
| c4-sql | Atomic ledger transfer timeline | Starting balances A100/B50, transfer 30. Atomic commit or crash/rollback versus unprotected two-step writes and crash: total preserved at 150 or improperly left at 120. Explicit committed and tentative balances. Does not simulate transaction isolation anomalies. |
| c4-apis | Retry and idempotency-key timeline | Order creation commits but the network response is lost. Same key uses a durable receipt and returns one stored order; changing the key creates another. The receipt and effect are stipulated to persist atomically, not implemented backend state. |
| c4-failures | Two-worker lost-update schedule | Both workers read zero before writing and the final counter is 1; a serialized lock permits final counter 2. Shows exact local reads and shared writes without claiming the browser runs real threads. |

All six C4 visuals are integrated immediately after the worked example inside the original chapter. The existing proof, transfer, coding lab, source material, and scoring evidence remain unchanged. Each scene has Previous/Next/Play/Pause/Replay, a text-trace view, an ungraded prediction, and appropriate input controls.

## Numerical correctness and assessment boundaries

Every chart/diagram state is drawn from an explicit computation, not relabeled stock illustrations. The automated model tests recalculate event sums and seen-ID sets for all four tape/policy combinations, verify both bug fixtures, exact nearest-rank latency statistics, four ledger failure/success paths, two idempotency-key behaviors, and two concurrency interleavings. Browser tests cover all C4 visual routes and parameter changes. Existing Foundation, mathematics, algorithm and sitewide tests remain mandatory.

The visuals teach *defined* models and do not grade generalized mathematical proofs, establish crash-safe backend code, measure production throughput, or certify interview readiness. Source-visible prediction questions never alter stored objective course progress. Sensitive enterprise data must not be pasted into teaching inputs.

## Original graphics and sources

All drawings are original, lightweight SVG. They use the familiar state-diagram pedagogy of [MIT 6.5840 distributed systems](https://pdos.csail.mit.edu/6.5840/), [PostgreSQL transaction documentation](https://www.postgresql.org/docs/current/tutorial-transactions.html), and [Python threading documentation](https://docs.python.org/3/library/threading.html). Source links are for background concepts, not copyright permissions, endorsement, or an academic equivalence claim.

## What is next

The remaining two early Foundation chapters stay text-only until a useful visual is justified. **Phase XIV-E** should build specialist Quant, AI/ML, and SWE visuals: price-time priority order books and exchange replay, VWAP and spread, training/validation leakage and confusion matrices, distributed request tracing, cache stampedes and fault recovery. Simulators must be benchmarked against independently implemented reference models before claims of correctness.

# Mastery Phases III–IV — Verification Report

**Date:** November 4, 2026
**Live course:** https://mtk1606.github.io/Mastery/market-systems.html
**CI:** https://github.com/mtk1606/Mastery/actions/runs/41935128313
**GitHub Pages deployment:** https://github.com/mtk1606/Mastery/actions/runs/41935127643
**Source:** `exchange/`, `exchange-sim.js`, `market-systems*.js`, `market-systems.html`.

## Verified results

All GitHub Actions jobs passed on the final source commit.

### Native C++20

- The CMake build compiled the reference price–time book, CSV replay CLI, event-cost benchmark and `std::pmr` allocation experiment.
- **3/3 CTest suites** passed: exchange invariants, published CSV replay and allocator experiment.
- **5,000 seeded randomized C++ events** were checked for core order-book invariants in the executable test, in addition to deterministic unit cases.
- The fixture's canonical state and 64-bit FNV-1a fingerprint are pinned: `15719539211984847471`; best bid 100, best ask 102, four resting orders, four fill records.
- Invalid stream gaps fail with a nonzero exit code rather than being applied; the CLI returned the pinned golden JSON twice, byte-equivalent after parsing.
- Native benchmark output was parsed and validated as **measured** `steady_clock` observations with nondecreasing p50/p95/p99 values. The output does not assert production hardware latency.
- AddressSanitizer and UndefinedBehaviorSanitizer build and invariant tests passed on GitHub's Ubuntu runner. C++ tests retain `assert` checks even under Release `NDEBUG` compiler settings.

### Independent JavaScript reference

- The pure JavaScript reference produces the **same canonical string and fingerprint** from the 12-event tape, with matching price/time FIFO partial-fill behaviour.
- The Node test checks 4,200 seeded randomized JS events, invalid input, duplicate IDs, sequence gaps, cancels, and canonical serialization.
- This cross-reference is a correctness regression check; it is not proof that the two independent implementations are correct for all possible inputs.

### Actual Chromium browser journey

- The live-static HTTP test passed in Playwright Chromium, covering lesson content, notes that survive reload, editable reference tape, step controls, golden fingerprint, sequence-gap stop, system-design hints and worked models, rubric persistence, native-report import UI, capacity arithmetic, JSON study-record export, Light/Dark theme persistence and mobile-width layout.
- The browser test uses an explicitly labelled **fake benchmark JSON as a UI fixture only**; it makes no factual performance claim.
- No JavaScript page exceptions were observed in the tested journeys.

## Important limitations

- The JavaScript replay view is a separate **teaching reference**; it does not inspect the student's actual C++ memory/assembly execution.
- Native latency measurements are synthetic single-threaded microbenchmarks. Values vary with CPU, OS, compiler and workload; do **not** claim these are Citadel/Jane Street/HRT hardware measurements or production exchange p99.
- The native engine intentionally omits account authorization, full risk management, multi-symbol sharding, true venue protocol semantics, persistence/consensus, and real network I/O.
- Written architecture answers use a manual rubric, not reliable automatic proof/essay grading.
- Local storage holds course drafts; users can export/restore JSON, but no server or cross-device synchronization exists.
- The use of academic teaching structure is independent and unaffiliated with any named university or firm.

## Next enhancement

Phase V should introduce crash recovery with snapshot+delta replay and leader epoch fencing, bounded client buffers with explicit backpressure, differential property tests against a structurally distinct oracle, and timed interview simulations calibrated to verified public source material. Any new latency comparisons must report fully reproducible measurement conditions.

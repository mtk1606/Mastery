# Mastery Phase X — Adaptive Mock Interview Arena

## Scope
- Four original role-specific interview tracks: Quant Trader, Quant Researcher, Quant Developer/C++, and Low-Latency/SWE.
- 45-, 90-, and 120-minute multiple-round sequences with persistent elapsed-time clocks, pause/resume and an early-end option.
- Twelve parameterized numeric/archetype exercises and five executable JavaScript coding patterns.
- The initial objective result controls the next follow-up: hard transfer when correct, diagnostic repair when incorrect. The interface does not present a predetermined "AI interviewer" as a human or LLM.
- Quantitative answers are checked with a 0.011 tolerance against independently generated numeric oracles. Code tests execute through the existing disposable `readiness-worker.js` with two separate seeded batches and an eight-second watchdog.
- Manual explanation scoring (0–4) and error classification stored separately from numeric and code results. Weakness ledger reports objective misses, not simulated hiring probabilities.
- All state is kept in localStorage and can be exported to JSON. Import restores validated history, not live timers.
- Same Light/Dark theme and mobile responsive layout as the rest of Mastery.

## Distinct tools
Phase VIII `readiness.html`: large source-labelled question library, practice and spaced review.
Phase IX `interview-cpp.html`: genuine C++20 Clang/WASM compilation and structured defense.
Phase X `phase10.html`: interview orchestration, contingent follow-ups, multi-round structure, numeric grading and Worker-backed JavaScript coding.

Phase X does **not** compile C++ in its own page. It links to Phase IX's corresponding C++20 coding lab. Do not conflate passing Phase X JavaScript with passing native C++20.

## Evidence and integrity
All new numerical prompts and parameter generators are original Mastery exercises, not claimed as historical employer questions. Correctness checks use finite cases, not a formal proof or hidden secure tests. Free-text explanations, communication, and reasoning clarity are self-reviewed (or can be assessed by a human coach) and cannot be automatically certified. Test seeds and model answers are bundled in the browser; users can inspect them. Adaptive levels use only prior objectively checked results; changing numbers is not equivalent to a universally harder conceptual problem.

## Acceptance checks
The intended checks are:
- `node --check phase10-core.js` and `node --check phase10.js`.
- `node tests/phase10-reference.test.cjs` deterministic scenario formulas and plan invariants.
- `node tests/phase10-browser.test.cjs` under Playwright/HTTP tests branching, real Worker results, timer, record export, theme and mobile.
- CI workflow `.github/workflows/phase10-ci.yml` runs both suites on push.

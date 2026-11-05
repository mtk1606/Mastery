# Mastery Phase VIII — Interview Readiness Engine

## Scope delivered

- 284 distinct third-party-company-tagged, original-LeetCode-linked interview practice records; 25 existing original/official/source-labelled guided briefs, 309 unique tasks total.
- Company, difficulty and topic search; clear source evidence labels; no fabricated employer recurrence or frequency claim.
- Timed 25/45/60-minute interview rounds, adjustable problem count, optional pause, saved responses and follow-up questions.
- Ten runnable JavaScript interview labs with a disposable Worker, a timeout, seeded edge cases and failure details. A separate link directs C++20 practice to Mastery's Clang/WASM laboratory.
- Per-question prerequisite explanations and five-dimensional self-review rubrics.
- Spaced recall, due queue, weak-topic report, objective test-pass markers separated from subjective ratings, JSON backups, and Light/Dark themes.

## Verification procedure

`node tests/readiness-reference.test.cjs` checks 10 reference algorithms over three seeds, rejects wrong and malformed solutions and audits source metadata. The GitHub workflow `.github/workflows/readiness-ci.yml` tests the actual HTTP/browser user journey in Playwright Chromium, including a failure and a fresh-seed pass, clock controls, mobile layout, exported backup and theme persistence.

## Integrity limits

Community question tags are not verification of real historical employer interviews. In-browser grading does not prove arbitrary program correctness. Timed scores are not externally assessed. This is an independent learning programme, not affiliated with the firms named or with Harvard, MIT, Oxford or the FAANG companies. No outcome is guaranteed.
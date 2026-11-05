# Mastery Phase VII + Mock Interview Academy — Release notes

## Phase VII: original advanced systems seminar

- Four university-style lectures with formal assumptions, a correctness proposition, proof sketch, worked case, counterexample, recitation and model reasoning.
- Six interactive **reference** crash-cut scenarios: normal compaction, post-fsync crash, pre-rename crash, post-rename pre-prune crash, torn final WAL suffix, and corrupt complete record.
- Native C++20 POSIX educational segmented WAL with checksummed records, record fsync, ordered replay, single-writer lock, atomic snapshot publication steps, idempotency receipt preservation, compaction and injection points.
- Debug and ASan/UBSan CTests, seeded differential state testing, and release CI.

## New Mock Interview Academy

- **25** individually attributed practice briefs covering **8 target firms** (Jane Street, Citadel, Google, Meta, Amazon, Apple, Netflix, Hudson River Trading), organized by SWE / Quant Dev / Quant Trading.
- Evidence labels: 2 official Jane Street examples/resources, community company-tagged LeetCode titles from public GitHub snapshots, and original exercises **not** falsely presented as employer questions.
- Full source links to official sample sites, LeetCode canonical problems and tagged GitHub lists; no copied private assessments.
- 25/45/60-minute interview rounds, saved written/code responses, progressive follow-ups, clear definitions, independent solution outlines, five rubric dimensions, per-topic self-assessment history and JSON backup/restore.
- Open access, persistent Light/Dark theme, links to the existing tested C++20 and JavaScript compiler laboratories.

## Limits

No platform guarantees passing an interview. Full-time interviews vary by team, candidate, office and year. Community-tagged records cannot establish actual frequency; the product does not claim access to proprietary interview banks. Written proofs and code in the mock page are not auto-graded; only the separate compiler labs run tests. The native storage lab is single-writer, POSIX-specific, not a production database or certified against every power failure.

## Next suggested improvement

Add a secure supervised answer-review workflow or reviewer comments, expand to a source-audited 100–150 question pool, and couple practical code submissions to the existing WASM compiler with actual test cases before making automated correctness claims. A company-calibrated readiness score should require objective evidence and external validation, never just self-rated checkboxes.
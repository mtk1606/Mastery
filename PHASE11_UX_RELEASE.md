# Mastery — Learning Desk UX Release (pre-audit polish)

## Design principle
Increase *motivation to learn* through fast entry, clear skill feedback, visible evidence and deliberate re-engagement. Do not build an infinite feed, nagging streaks, artificial scarcity, randomized monetary-style rewards or time-on-site scoring.

## Delivered
- **Focus dashboard** at `focus.html`: a single landing point linking quant/math, computing, market systems, the Readiness Academy, C++20 Defense and the full Interview Arena.
- **Quick-win deliberate-practice loop:** 3 original, parameterized interview questions per sprint; two independent objective checks per question (numeric answer and a concept-choice justification). Exact worked explanation and a trap shown only after submission.
- **Focused recall**: the most recent attempt governs weakness priority (an old mistake stops dominating after a correction). Concepts receive a 1-day or 3-day spaced review date; missing a review incurs no shame, penalty or lost streak.
- **Hint integrity**: using a recognition hint is recorded. Even a correct assisted answer gets earlier recall; it is never silently treated as independent first-try reasoning.
- **Credible progress**: displays local counts from existing Mastery records, labelled by what the counts actually mean. Lecture read marks, JavaScript test passes, C++ passing seeds and Phase X checked answers are not combined into a misleading global score.
- **Continuation**: unfinished sprints are saved. The learning desk links to active Phase X sessions and due Readiness practice.
- **Light/Dark, mobile, keyboard, semantic form fields, focus styles, reduced-motion support** and subtle earned-completion animation; no audio.
- **Backup**: JSON export/import of Focus record. Other independent app records remain untouched.

## Integrity and boundaries
- Focus problems are original and do not claim documented appearance at a specific employer.
- Client-side scoring checks only inspectable finite answers, not generalized proofs, free-response explanations, secure hidden tests or external interview readiness.
- Concept check is a multiple-choice prompt, not automated natural-language grading.
- Browser localStorage saves per-origin progress; clearing browser storage or switching devices may lose it unless backups are exported.

## Verification
`node tests/focus-reference.test.cjs` checks deterministic generation, range/oracle invariants and priority selection.
`node tests/focus-browser.test.cjs` checks actual browser interactions, objective feedback, sprint summary, history, due review prioritization, backup, reduced-motion styles and mobile layout.
`.github/workflows/focus-ci.yml` runs both as separate CI jobs.

# AXIOM Studio v4 — Quality assurance

**Release:** November 3, 2026. **Scope:** browser-side functional regression and question-generation shape checks.

## Automated browser regression: 36/36 passed

Tests exercised: landing-page render; dark typography; independent Math and Quant links; 13+22 lesson catalogue; no locked rows; open access to advanced lessons and examinations; faculty-proof structure, assumptions and counterexamples; optional graphics collapsed by default; user-supplied written reasoning notes persisted across navigation; independent marking as studied; wrong-answer feedback followed by the *next question*, not a forced repair; numeric score accounting (4/5 for a deliberate mistake), no fabricated perfect badge; direct access to the final Quant examination; cumulative exam scoring (9/10 after a deliberate mistake) without restarting; persistence of exam results; download/restore of study notes and progress; all 35 lectures rendering with model solutions; user-triggered optional 3D scene; responsive mobile width; no uncaught browser exceptions.

Run locally: `python test_v4.py` (uses Playwright and the installed Chromium browser). The test embeds the site’s own JavaScript and CSS into an in-memory page and intentionally skips the externally hosted MathJax renderer. It checks that the mathematical content remains readable without the CDN. It does **not** prove that the external CDN can always be reached in production.

## Question-bank integrity: 5,250 cases

Run `node test_bank.cjs`. Every case had a finite numeric answer or well-formed multiple-choice / multi-part answer; no malformed question instances were found. This validates question object structure and numeric finiteness, **not independent correctness of every mathematical answer**.

## Academic/content review notes

All 35 lectures have an original principle/theorem, assumptions, a reasoned derivation, worked example, counterexample/limitation, independent free-response problem, hint and solution. The updated domino/chessboard example correctly removes **two same-colored corners**, making tiling impossible by parity.

The Avellaneda–Stoikov lesson attributes its **simplified** Brownian price, exponential utility and order-arrival assumptions; no trading performance claims are made. Statistical examples explicitly distinguish dependence from correlation, base rate from sensitivity, and out-of-sample evidence from searched backtests.

## Known limitations

1. Written mathematical proofs are self-reviewed against authored solutions. The app does not provide an automatic semantic proof grader.
2. Formal professor/subject-matter peer review, long-term retention outcomes and exhaustive mathematical correctness audits have not been completed.
3. The optional MathJax renderer requires connectivity and a working CDN; readable Unicode mathematical formulas remain in the lesson text if unavailable.
4. GPU WebGL support varies. The optional figures are not part of the core learning requirement.
5. Progress is local to a browser unless the user exports/imports a backup.

**Result:** Browser functionality and generated question structure passed the stated automated checks. This is original self-study software, not official Harvard, Oxford, MIT or University of Toronto coursework.
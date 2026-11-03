# AXIOM Studio v3 — Quality assurance report

**Date:** 2026-11-03  
**Repository:** https://github.com/mtk1606/Mastery  
**Build:** dark-theme modular site in repository root.

## Results

- **32/32 end-to-end browser checks passed.** Verified separate Math and Quant paths, locked progression, manual unlock with no false award, wrong-answer recovery, fresh mastery check, perfect exam gate, independent academy records, progress export/import, mobile width/navigation, and no uncaught JavaScript errors.
- **5,250 randomized question instances validated** across 35 lessons. No invalid numeric answers, malformed multiple-choice options, unknown question types, or missing answer metadata were found.
- **Interactive visuals verified in fallback mode.** This test environment disables WebGL, so the application used its CPU canvas renderer. Its order-book model produced nonempty images, and changing inventory changed the displayed calculation and image.
- **GitHub Pages action reported success** for commit `00a7794b339de103106ce4b837b8a697a1f08aab` (the numerical-grading wording fix). See https://github.com/mtk1606/Mastery/actions/runs/41725502149.

## Correction applied

The prior answer-feedback label claimed written reasoning had been checked. It now correctly distinguishes **graded numerical steps** from written reasoning, which is **self-reviewed** and not automatically graded. The mastery completion label now describes 100% on graded answers, not verified mathematical proofs.

## What this QA does not establish

- Native GPU WebGL rendering on a real consumer device remains untested here because hardware WebGL is blocked in the test environment.
- The public GitHub Pages URL could not be opened directly from the current sandbox; GitHub's build action confirms deployment success, not a full public-device acceptance test.
- Formula examples were spot-checked, but these automated tests are **not an external mathematical peer review** of every explanation or proof.
- Browser local storage persists per device; import/export works, but real-time cross-device synchronization is not implemented.
- Written justifications are not AI-graded or proof-checked. A perfect mastery score reflects graded inputs only.

## Repeatable test commands (Linux test environment)

The downloadable QA source package includes test scripts. With Node.js and Python Playwright + Chromium installed:

```sh
node tests/test_bank.cjs
python tests/test_regression.py
python tests/test_visuals.py
```

The first script checks every generated-question family, the second checks learner flows without requiring GPU, and the last exercises actual scene rendering and controls (including the canvas fallback). Test scripts use a headless Chromium browser and may need executable-path adjustment outside Linux.
# Mastery — Independent Course Library (Academic redesign v5)

**Live website:** https://mtk1606.github.io/Mastery/

Mastery is an independent, university-style, open-access learning project. It is not affiliated with Harvard, MIT, Oxford, or a trading firm.

## Current course catalogue

| Course | Available lectures | Learning focus |
|---|---:|---|
| Mathematics | 13 | mathematical fluency, proof, calculus, matrices and inference |
| Probability & Quantitative Finance | 22 | expected value, probability, statistics, research, market microstructure |
| Data Structures & Algorithms | 10 | recognition, invariants, code, traces, complexity and interview questions |
| Modern C++ & Market Systems | 4 | ownership, cache locality, concurrency and price-time matching |
| System Design | 3 | capacity, consistency and failure handling |

All 52 current lectures are available without progression gates. Written notes and progress remain stored in each browser; users can export/import progress backups from the existing course pages.

## v5 improvements

- Consistent course catalogue and academic design. Minimal decoration, useful hierarchy, real chapters, proof-based learning.
- **Light and Dark** buttons in both sites; selection persists in local storage under `mastery-theme`.
- Normal neutral palette and readable standard typography: Arial/Segoe UI for interface, Georgia for academic titles, system monospace for code.
- Math and Quant legacy content and test generators are retained. The layout removes decorative styling and keeps optional figures subordinate to teaching.
- Five in-depth, original **companion seminars** in engineering: linked-list pointer invariants, dynamic programming recurrence design, C++ object lifetime/RAII, price–time order-book matching, and distributed consistency/idempotency. Each adds detailed assumptions, derivations/proofs, worked examples, counterexamples, and recitation questions with solution sketches.
- The existing step-by-step DSA code traces and chapter glossaries are retained.
- No restrictions or grade-based lesson locks.

## Files

- `index.html`, `app.js`: main catalogue, mathematics, probability/quant courses, assessments.
- `engineering.html`, `engineering.js`, `engineering-data.js`: algorithms, C++ and system design.
- `theme.js`: shared, persisted light/dark selection.
- `academic.css`: shared editorial design system loaded after old styles to preserve old UI behavior.
- `faculty-notes.js`: independent substantive companion seminars for 5 engineering lessons.
- `styles.css`, `dark.css`, `scholar.css`, `visuals.js`, `data.js`, `pedagogy.js`, `seminar.js`: legacy curriculum and interactive components.

GitHub Pages builds from `main` at `/ (root)`; no backend or bundler is required. A Python static server can be used locally with `python -m http.server 8000`.

## Educational source policy

Content is independently authored, informed by (but not copied from):

- MIT 6.006 Introduction to Algorithms: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/
- Harvard CS50: https://cs50.harvard.edu/x/
- Open Data Structures: https://opendatastructures.org/
- cppreference: https://en.cppreference.com/w/
- MIT 6.5840 Distributed Systems: https://pdos.csail.mit.edu/6.5840/
- C++ Core Guidelines: https://github.com/isocpp/CppCoreGuidelines
- *Introduction to Probability* by Blitzstein & Hwang; Xinfeng Zhou's interview guide; and Avellaneda & Stoikov's market-making paper (provided references).

Linked sources and published academic materials retain their respective licences and copyrights; they are **not** incorporated wholesale into Mastery.

## Quality and limitations

See `QA_REPORT_v5.md` for checks. In-browser tests used an HTML/CSS/JavaScript DOM assembly because local browser navigation in the test environment was blocked; pages are ordinary static HTML and GitHub Pages deployment should be checked separately.

**Not yet built:** server-side compiled code evaluation, automatic grading of free-text proofs, full-size semester syllabi for every subject, or multi-device synced progress. The five deeper engineering seminars are a first quality standard; the other lessons are not all at the same depth yet.

## Next instructional phase

Bring every engineering lesson up to the flagship-seminar standard, then build a real code-execution and unit-testing environment with role-specific problem sets and design critiques. Audit mathematical accuracy and citation coverage before using the material as a complete replacement for university courses.
## Academic Depth Phase — November 4, 2026

The academic learning layer is **implemented** in `academic-labs.js` and `academic-labs.css`, reused by both the Math/Quant site and the Engineering Academy.

- **31 topics now have two new independent recitation problems each (62 total)**, with two progressive hints, an original worked solution, and an explicit reasoning checklist.
- **All 17 Engineering lectures now have recitations.** The 12 previously lighter Engineering lessons also receive a companion extension covering assumptions, derivation or correctness, an exact worked example, and a failure case. The existing five long-form faculty seminars are retained.
- **14 selected Math/Quant lectures** now have these extra recitations, including counting, Bayes, expected value, recursive states, linear algebra, regression, inference, distributions, order-book execution, and Avellaneda–Stoikov. The other Math/Quant lectures retain their existing substantial seminars and assessments, and are not falsely claimed to have new recitations.
- Written responses are saved as local drafts; the existing course progress exporters now include them as `workshopAnswers`. Restores accept older progress formats without discarding unrelated saved drafts.
- Written proofs and architecture answers are **not automatically graded**. Students reveal model reasoning and use a checklist to review their work; numerical quick-checks remain distinct.
- **No grading gates, forced retakes or locked lessons.** Optional figures remain optional. Light and Dark themes are unchanged.

### Educational standards and readings

Independent educational work guided by the lecture/recitation/problem-set structure of [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/), the free, openly licensed [Open Data Structures](https://opendatastructures.org/), [MIT 6.5840](https://pdos.csail.mit.edu/6.5840/) for distributed-systems rigor, the C++ Core Guidelines, the user-provided Blitzstein–Hwang and Zhou books, and the provided Avellaneda–Stoikov (2008) paper. Material is independently authored, not copied or officially endorsed.

### Quality limits

Automated QA: 26/26 browser-DOM interaction checks, syntax checks for modified JS, and a data audit confirming 17 engineering + 14 selected math/quant topics, two new tasks each. Browser checks use inlined local assets because local web navigation is restricted in the test environment. This is an incremental educational enhancement, not a claim of formal peer review or exhaustive mathematical proof auditing. No remote code execution, AI grading of free text, or cross-device accounts have been added.

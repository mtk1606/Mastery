# AXIOM Studio v4 — Open Academic Quant Academy

Two independent, entirely open academies: 13 Math Prerequisites and 22 Quantitative Finance lectures. Three engineering curricula (SWE, DSA and System Design) are planned.

## The learning method

Each of the 35 lectures now contains a faculty-style note: objective, explicitly stated assumptions, principle/theorem, full derivation, worked example, misleading shortcut or counterexample, and independent written problem with a hint and a worked answer. Original examples and explanations are informed by the supplied prerequisite notes, interview notes, Blitzstein–Hwang, Xinfeng Zhou and Avellaneda–Stoikov. The website has no academic affiliation or endorsement.

Everything is open. No course, lecture or examination is gated by progress or grades. The optional three- and five-question sets and ten-question diagnostics provide feedback and record scores. Wrong answers do not force retakes or block navigation. Written reasoning remains self-assessed against model solutions; numeric steps are automatically graded.

Progress and free-text lecture notes are stored in the browser and can be exported/imported as JSON via **Practice & exams**. Prior v2/v3 JSON progress remains accepted. Perfect numerical sets retain existing mastery badges but never gate study.

## Important files

- `index.html`: single-page website shell and optional MathJax equation renderer.
- `styles.css`, `dark.css`, `scholar.css`: visual foundation and academic reading typography.
- `data.js`, `pedagogy.js`: core curriculum and randomized assessment generators.
- `seminar.js`: 35 complete original faculty-style notes and independently worked transfer problems.
- `visuals.js`: existing WebGL visual models, loaded only when requested on lessons where a figure can clarify a mathematical relation.
- `app.js`: routing, no-lock flow, practice, feedback, progress and notes.

### Deploy to GitHub Pages

The site is static. Keep files in the root of `main`; **Settings → Pages → Deploy from a branch → main → /(root)**. Visit `https://mtk1606.github.io/Mastery/` once GitHub completes its deploy. Hash URLs work on GitHub Pages.

### Caveats

The platform is an independent educational project, not official instruction from MIT, Harvard, Oxford or Toronto. The user-provided books/papers are curricular references; their copyrighted text is not redistributed. The assessment engine checks numerical values, not free-form mathematical proof. The Avellaneda–Stoikov section presents a simplified model, not trade recommendations. MathJax is an optional externally loaded enhancement; plain-text mathematics remains available if it cannot load.

## Engineering Phase I (new)

Open [Engineering Academy](engineering.html) for independent fast-but-rigorous study paths in DSA interview patterns (10 lectures and 30 official LeetCode practice links), C++20 and low-latency infrastructure (4 lectures), and system design (3 lectures). Six DSA topics include step-by-step state visualizations. Each lesson defines unfamiliar terminology/functions, gives invariant proofs, C++ source code, worked traces, complexity and counterexamples. Progress notes stay locally in your browser. See [Phase roadmap](engineering.html#track=dsa) and `engineering-data.js` for the syllabus. Phase II will expand the coverage and add executable programming checks.

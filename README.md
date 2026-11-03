# AXIOM Studio v2 — Quant concepts you can see

An original, interactive teaching website for accelerated quantitative-finance preparation. It takes inspiration from the visual learning *approach* of hft.md but contains no code, images, branding, or lesson copy from that website.

## What's new

- Editorial, light-background course and lesson pages rather than a dashboard-heavy UI.
- **Two completely independent programs**: Math Prerequisites (13 lessons, 2 module exams) and Quant Academy (22 lessons, 4 module exams).
- Clearly reserved future navigation for Software Engineering, Data Structures & Algorithms, and System Design. These tracks are **not implemented yet**.
- Real GPU WebGL cube meshes with orbit rotation, scroll zoom, 3D order book, Bayes populations, Gaussian distributions, joint correlation surfaces, decision columns, regression bars, transition paths, and optimization landscapes. If WebGL is unavailable, a software-rendered rotatable 3D projection runs instead.
- Editable sliders update the 3D scene *and* exact calculated metrics for the displayed mathematical model.
- Each lesson contains the idea, interactive figure, core maths/derivation, interview application, common trap, and practice.
- 105 randomized question-generator archetypes over 35 lessons, with unlimited practice, a strict five-question 100%-correct lesson gate and six ten-question module examinations that require a flawless 10/10.
- Every wrong answer leads to a different targeted repair problem, followed by a new mastery set or exam. A repaired answer does not retroactively earn credit on the previous set.
- Browser progress persistence, an error ledger, and JSON export/import of progress.

## Run locally (Windows/macOS/Linux)

Unzip this package, then open `index.html` using Chrome or Edge. No build step is required. Google Fonts improve typography online; safe system-font fallbacks work without them.

For the most reliable local preview, serve the folder over HTTP (optional):

```
py -m http.server 8000
```

Then visit http://localhost:8000/ (from the folder containing `index.html`). The code is static HTML/CSS/JavaScript and works well with static hosting.

## Deploy online with Cloudflare Pages

1. Sign into Cloudflare and go to **Workers & Pages**.
2. Create a **Pages** project for this *new* site (use direct upload or connect a GitHub repository).
3. Upload the unzipped site files at the project root, with `index.html` at the top level. Do **not** upload the ZIP as the website root.
4. Let Cloudflare deploy; it will provide an `*.pages.dev` URL.
5. Verify both paths, the 3D controls, a wrong-answer repair, and exported progress on the deployed version.

If using GitHub, publish `index.html`, `styles.css`, `data.js`, and `visuals.js`, `app.js` at the repository root. No install or build command is necessary. Framework preset: None. Build command: none. Output directory: root (`.`), depending on hosting UI.

Progress is currently **local to one browser/origin**. Sync between multiple devices or real user accounts would require an online database and authentication. Export/import provides an immediate manual backup.

## Curriculum structure

### Math prerequisite academy

1. Arithmetic, algebra & foundations: number sense, algebra, exponents, series, combinatorics, trigonometry, discrete proofs.
2. Calculus, linear algebra & inference: derivatives, integrals, matrices, multivariable optimization, sampling inference, numerical methods.

### Quant academy

1. Probability & decision-making: events, expectation, indicators, conditioning, Bayes, recursions, symmetry, stopping.
2. Statistics & estimation: variance, distributions, correlation, inference, regression.
3. Quantitative research: covariance mathematics, optimization, validation and leakage.
4. Market making & HFT: information, pricing, limit order books, latency, Markov chains and Avellaneda–Stoikov inventory-aware quotes.

### Future (not implemented)

- SWE curriculum
- DSA and algorithmic problem-solving curriculum
- System design and low-latency systems curriculum

The three future paths should be independent programs with their own modules, coding exercises, exams, and progress storage.

## Research and reference notes

Original content is shaped by the user-provided *Quant Math Prerequisites*, *Quant Interview Notes*, XinFeng Zhou's *A Practical Guide to Quantitative Finance Interviews* (Green Book), Blitzstein & Hwang's *Introduction to Probability*, and Avellaneda & Stoikov, “High-frequency trading in a limit order book,” *Quantitative Finance* **8** (2008), 217–224. No copyrighted PDF pages or substantial book text are copied into this package.

For the Avellaneda–Stoikov example, the displayed reservation and approximate quote equations assume: `r = S − qγσ²τ` and `spread ≈ γσ²τ + (2/γ) ln(1 + γ/k)` with S=100, σ=2, τ=1, k=1.5. The displayed order-book depth is synthetic and illustrative; the quoted prices do not reflect actual exchange liquidity, queue priority, transaction fees, or a validated profitable strategy. This is not investment advice.

## Quality checks and current limits

- Browser-checked separate pathway unlocks, wrong-answer targeted repair, five-question 100% gate, ten-question exam, slider-model reactivity, and mobile no-horizontal-overflow at 390px.
- Statically tested 10,500 generated question instances over all 105 generators: no malformed answers, invalid numbers, or question-generator exceptions. This does not constitute independent mathematical proof of every question/solution.
- The principal visual categories are implemented, **but not every lesson yet has two fully bespoke simulations**. Some closely related lessons share a parameterized 3D instrument.
- Some derivations are introductory and not the full textbook-level treatment. The next build should deepen each proof and add multi-step free-response grading and delayed retention tests.
- 100% on a small exam is a *progression gate*, not a guarantee of permanent mastery or interview-readiness.
- There is no online hosted URL, no student account system, no live brokerage connectivity, no AI tutor, and no SWE/DSA/System Design lessons yet.

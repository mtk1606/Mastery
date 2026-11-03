# AXIOM Studio v3 — Visual Quant Academy

A research-oriented, visual-first learning website with two **independent** academies: **Mathematical Prerequisites** (13 lessons) and **Quantitative Finance** (22 lessons). Three additional paths are reserved for future development: **Software Engineering**, **Data Structures & Algorithms**, and **System Design**.

The design is dark and spacious, with larger reading fonts and native WebGL demonstrations. The goal is to teach *why* a method works, what assumptions it requires, when it fails, and how it transfers to unfamiliar problems.

## What's new in v3

- Dark editorial style, larger lesson typography and improved contrast.
- Research-level deep-dive sections with original derivations, non-obvious examples, assumptions and limitations.
- Multi-part numerically graded questions in Bayes, expected value, recursive expectation, inference, correlation, regression, quoting, order-book execution, and Avellaneda–Stoikov.
- Optional written reasoning for multi-part calculations, followed by an explicit self-review rubric. **Free-text reasoning is not automatically graded.**
- Mastery requires five correct first attempts. Module examinations require ten correct first attempts. A miss triggers a fresh repair problem and a fresh gate.
- **Manual unlock** lets you access lessons and exams for exploration without fabricating mastery or exam passes. Toggle it from a course page or Practice & Exams.
- **Export progress** to JSON and **restore progress** on another device from Practice & Exams. The app upgrades existing v2 progress in the same browser.
- Original WebGL interactive models for probability, distributions, correlation, optimization, stochastic state models and order-book depth.

### Directory

```
index.html       Main application shell
styles.css       Original editorial layout
dark.css         Dark theme, typography and advanced assessment components
data.js          Lessons and randomized core question generators
visuals.js       Native WebGL interactive mathematical figures
pedagogy.js      Deep-dive teaching notes and multi-step problems
app.js           Routing, gating, exercises, progress state and backup
```

No package installation or build command is needed. This is an ordinary static website.

## Deploy on GitHub Pages

In **mtk1606/Mastery**, open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose **main** and **/(root)**, then **Save**. GitHub will provide the project site URL after deployment. The app uses hash-based routes (`#/quant`, `#/math`), compatible with basic static hosting.

## Local preview

Open `index.html` in a modern browser, or start a local static server with `python -m http.server 8000` and open `http://localhost:8000`. A recent Chrome, Edge, Safari or Firefox supporting WebGL is recommended.

## Progress and integrity

Progress is stored in the browser’s local storage, not on GitHub or a server. Use **Practice & Exams → Export progress** to download a backup, then **Restore progress** to import it. Import deliberately replaces the current browser state after confirmation. Manual unlock only affects content access; the earned-score counters remain unchanged.

The numerical evaluator accepts decimals and simple fractions with a small tolerance. Structured multi-step inputs are automatically checked, but the user's written derivation receives a transparent self-assessment rubric, not AI grading. Passing a gate therefore certifies the numeric responses to that gate, not independently verified proof quality or long-term retention.

## Learning references

The explanations and simulations are original educational material informed by the user-provided prerequisite and interview notes, Joseph K. Blitzstein & Jessica Hwang’s *Introduction to Probability*, Xinfeng Zhou’s *A Practical Guide to Quantitative Finance Interviews* and Avellaneda & Stoikov (2008), *High-frequency trading in a limit order book*. Original books and papers are not bundled or reproduced. Models are simplified teaching demonstrations, not live trading strategies.

**Independent project; not an official MIT or University of Toronto program or course.**

## Future phases

Build distinct SWE, DSA and System Design academies with their own content databases, autograders and progress states. Before public scale-up, add a more robust problem taxonomy, full symbolic answer checking, rigorous written-response evaluation, spaced-repetition scheduling, multi-device accounts and an automated testing/deployment pipeline.

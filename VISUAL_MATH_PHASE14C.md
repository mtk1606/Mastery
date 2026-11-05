# Phase XIV-C — Verified Mathematical Visualizations

**Release:** November 5, 2026.
**Scope:** All six C3 Foundation topics (probability, mathematics, and optimization) beyond the 15 previously implemented C0–C2 visuals.

## Instructional objective

Only show graphics that improve understanding of a claim, invariant, distribution or numerical calculation. All diagrams here are **original** SVGs generated from explicit mathematical models. These are not reused figures from copyrighted textbooks or course pages. The teaching style is informed by established university pedagogy, not an assertion of university endorsement or equivalence.

| C3 lesson | Interaction | Mathematics the visualization actually demonstrates |
|---|---|---|
| c3-proofs | Choose n=2,…,6; step from prior square to added border | Induction: (n−1)²+(2n−1)=n², with the border containing exactly 2n−1 new cells |
| c3-counting | Change prior prevalence among 1%, 5%, 10%, 25% | Exact 2×2 counts for 1,000 people, fixed 90% sensitivity and 10% false-positive rate; posterior TP/(TP+FP) |
| c3-expect | Choose 1–4 red balls out of five; draw two | Hypergeometric distribution for 0/1/2 reds without replacement, 10 equiprobable physical pairs, and E[X]=2×red/5 by indicator linearity |
| c3-variance | Vary n∈{25,100,400} and p∈{.1,.25,.5,.75,.9} | Exact binomial PMF of K for IID Bernoulli trials, sample mean K/n, mean p, variance p(1−p)/n; not an unlabeled normal approximation |
| c3-linear | Select identity, stretch, shear, 90° rotation; choose v∈{(2,1),(1,2),(-1,1)} | Images of e1 and e2 form A's columns; Av is an actual matrix-vector product with coordinate-grid arrows |
| c3-opt | Choose η∈{.05,.1,.125,.25,.5,1} | L(w)=(2w−4)², initial w=1, derivative −8, update w1=1+8η and exact resulting loss; oversized steps may increase loss |

### Quality principles

The math is **computed, not merely annotated**. Changing an input recalculates the counts, probability distribution, plotted vectors, proof cells or loss. The user still gets Previous, Next, user-initiated Play/Pause, Replay, Diagram/Text Trace, explanatory captions and a clear prediction task. In Bayes and indicators, the prediction question also follows the changed input; it never silently describes the original default example.

The frequency diagrams explicitly distinguish P(positive|affected) from P(affected|positive). The urn model avoids a common fallacy: the two draws are dependent, but their expectations still add. The sample distribution is the **exact, finite-support binomial probability mass function** for n and p shown—not a normal approximation. All formulas explicitly assume IID Bernoulli sampling when deriving the sample-mean standard error. The gradient graph shows both actual start and end loss rather than guaranteeing every gradient-directed step descends.

These visual activities remain formative; selecting a correct prediction or watching an animation does not update objective coding, proof, or readiness scores. Student-written proofs are still not automatically certified.

## Source inspiration and citation ethics

The mathematical style draws on original worked demonstrations and standard methods discussed in:
- Harvard Stat 110 course materials: https://projects.iq.harvard.edu/stat110/home
- Blitzstein & Hwang, *Introduction to Probability* (expectation, conditional probability and indicators).
- MIT OpenCourseWare (algorithms and proof techniques): https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/
- MIT OpenCourseWare linear algebra: https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/

No source figure or screenshot is copied. These are Mastery-authored visual explanations of standard mathematical concepts. The project is independent and makes no endorsement or certification claims.

## Verification requirements

Independent, deterministic source tests check:

1. All six authored scenes link to the correct existing C3 lesson and produce accessible titled/described SVG.
2. Every supported induction step exactly satisfies the square identity.
3. All supported prevalence settings yield a complete population partition with matching TP/FN/FP/TN and Bayes posterior; updated prediction answers match.
4. Every supported urn composition has 10 distinct unordered physical pairs, a normalized distribution and the correct expected red count.
5. Across the 15 parameter pairs (n,p), the computed *exact binomial* probability masses are finite/nonnegative, sum to 1, and reproduce p and p(1−p)/n to numerical tolerance.
6. All 12 matrix/vector choices produce correct output and transformed basis vectors.
7. All six gradient choices match the analytical derivative and quadratic loss. Check that a small step descends, η=.125 reaches the exact minimum, and η=1 overshoots and increases loss.
8. Playwright Chromium covers all six chapters, controls, changed-state explanations, dark theme, mobile panning and preservation of learning records. Existing C0–C2 visual and general site regressions must stay green.

## Current scope and next phase

This release makes **21 lessons visualized overall**: 15 C0–C2 plus all six C3. It does not add visuals to C4 or the specialist Quant, AI/ML and SWE pathways. The next prioritized release, **XIV-D**, should focus on real transactional failure timelines, API idempotency and retries, concurrency/races, measured latency distributions and replay-safe deduplication. Later XIV-E should add market data and order book mechanics.

These mathematics visuals are deliberately bounded toy examples. They support intuition and verification, **not** arbitrary mathematical proof, professional risk estimation, a university degree or employment certification. Real-screen-reader testing and quantitative learner-outcome studies are still outstanding.

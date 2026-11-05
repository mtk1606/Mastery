# Figure Quality Reboot — Phase XV-A

**Date:** November 5, 2026  
**Status:** First quality-focused correction. This is **not** a claim that all 27 existing illustrations meet textbook standards.

## Why this release exists

The previous visual system produced numerically valid but often poor instructional artwork: oversized UI cards, generic stage blocks, insufficient physical state change and crowded annotations. The Bayes 2×2 dashboard is an example: correct counts without a concrete visual of the 1% prevalence or the positive-test denominator. Passing source tests and rendering without exceptions did **not** establish illustration quality.

The new standard is inspired by excellent algorithm books, especially the **pedagogical structure** of *Introduction to Algorithms* (Cormen, Leiserson, Rivest, Stein): multi-panel numbered states, stable indexing, unambiguous motion arrows, worked examples, meaningful shading and accompanying pseudocode. The copyrighted original book illustrations and screenshots **are not reproduced or embedded**. These figures are independently authored and generated from verified local models.

## What was changed

### Original six-panel insertion sort figure

**Open:** [Insertion Sort Figure Study](insertion-sort.html)

- One editorial page containing all six indexed-array snapshots (a)–(f), array states, right-shift arrows and visual key movement.
- Unlike a generic animation, the entire sequence is legible at once, with a caption explaining the symbols and the invariant. Clicking a panel reveals the reasoning and the related pseudocode line.
- Reproducible tests derive the panels from an actual insertion-sort algorithm, not manually entered static numbers. The default case is [8,3,6,2,7,4] and finishes [2,3,4,6,7,8].
- Sorted and reverse-sorted inputs expose the algorithm's best and worst behavior. A sorted length-six input shifts zero elements; a reverse-sorted length-six input shifts 1+2+3+4+5 = 15.
- Original on-paper figure style, printable sheet and code typography replace decoration. All figure controls are optional, keyboard accessible and motion is user-controlled.

### Bayes figure corrected: a thousand individual people

**Open:** [Foundation · Bayes and conditionals](foundation.html#C3/c3-counting)

- Replaces the four-box dashboard with **1,000 individual marks in an accurate 50×20 frequency diagram**, each representing one person.
- With prior 1%, sensitivity 90% and false-positive rate 10%: 9 true positives, 1 false negative, 99 false positives, 891 true negatives. Only 9 of 108 positive tests indicate the condition, yielding 8.33%.
- Each frame shows which cohort is being compared. The side calculation changes from population base rate, to sensitivity, to false-positive rate, to total positives, to the posterior.
- The controls retain the original available priors (1%, 5%, 10%, 25%) and recompute every category and posterior. The visual and answer change with the input; no values are invented.
- Original vector marks with an off-white editorial-plate aesthetic, legible ink and meaningful two-color distinctions instead of four unrelated decorative cards.

## Acceptance criteria

A figure must pass both **numerical correctness** and **visual quality**:

1. **Semantic necessity**: a figure must show a state transition, distribution, correspondence, algorithm step, proof structure, or clear misconception that prose cannot convey as efficiently.
2. **Actual drawn correspondence**: every shaded cell, person mark, arrow and value is tied to an audited model state. A card labelled "step 2" is not sufficient.
3. **Editorial clarity**: clear indices, count labels, math/caption association, no clipped SVG text, no overlapping labels. Responsive and motion-reduction compatible.
4. **Full sequence**: readers can see all key states at once when it adds value. User-controlled stepping is supplementary, not the only means of comprehension.
5. **No copies**: new diagrams and code examples are independently authored, and any textbook inspiration is credited. Avoid unauthorized figure screenshots, even from PDFs stored on GitHub.
6. **Real QA**: verify actual desktop/mobile rendering and record screenshots for human inspection, in addition to calculation checks and Playwright layout assertions.
7. **Honest scope**: label unreviewed older visuals as existing prototypes. Do not use counts like "27 visualizations" as a substitute for assessing instruction quality.

## Verification

- Independent reference tests compare the insertion-sort panels and each right-shift record against the actual algorithm across three input classes. The sorted-prefix multiset invariant is checked after every pass.
- Browser tests assert six original panels, precise shift-arrow counts, synchronized code, navigation, input variants, mobile overflow, reduced-motion behavior and usable controls.
- Bayes browser tests assert **exactly 1,000 graphical person marks** and verify no SVG text exceeds the viewBox at the default and changed priors. Screenshots of the figure and insertion page are saved as CI artifacts for a human design review.
- Existing C0–C4 Foundation, mathematical, systems, code and sitewide regressions remain mandatory. Notes and objective progress are not mutated by exploratory figures.

## Remaining work: batch by batch, not "everything is fixed"

This release upgrades **two priority teaching experiences** (Bayes and insertion sort). It intentionally does not mark the old 27 scenes as textbook quality. Next batch: redesign sliding windows, lower-bound binary search, BFS and coin-change DP using numbered algorithm plates and precisely annotated transitions. Then mathematical charts (indicators, variance, matrix transformations, gradient descent), and finally systems traces (retries, transactions, races) and specialist Quant/AI/SWE modules. The deployment should be followed by human inspection of the generated screenshots and reports of any clipping, poor instructional mapping or inaccessible input.

**Sources of pedagogical style:** Cormen et al., *Introduction to Algorithms* (original artwork not reused); [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/); [Harvard Stat 110](https://projects.iq.harvard.edu/stat110/home).

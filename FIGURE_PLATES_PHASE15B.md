# Phase XV-B — Four algorithm textbooks plates

This release is the second stage of the Mastery **figure quality reboot**, following the corrected Bayes frequency plate and the original insertion-sort figure.

## Core design decision

**Do not put algorithms into dashboard cards.** Each diagram is an original **complete multipanel plate**: panel (a), (b), (c), and so on, all visible together, with stable indices, physically meaningful arrows, a caption, a stated invariant, and pseudocode tied to the selected step. Users can visually compare the first and last state without waiting for a looping animation. Next, Previous, selected-panel buttons, and optional Play/Replay remain; Text trace remains as an alternate view. Decorative imagery is deliberately excluded.

The four plates are integrated **inside their actual Foundation C2 lessons**, under the relevant worked example—not in a disconnected showcase page. They preserve existing practice records and Python exercises.

### 1. Sliding windows — C2 / c2-windows

The full sequence shows a fixed-width bracket moving across [1,2,3,4]. The current values and indices, the outgoing and incoming elements, the maintained sum, and the best legal sum all follow an independently generated rolling-sum trace.

The k control supports 1, 2, 3, 4. When k changes the number of valid windows, drawn bracket widths and comparison question update to match. The diagram shows the actual **O(1) work per move**, not an abstract "slide" badge. When k=4 only one valid window exists.

### 2. Binary search — C2 / c2-binary

Each panel shows the sorted array [1,2,2,2,5], with a **half-open [lo,hi) bracket**, midpoint and faded discarded cells. Qualifying a[mid] ≥ target keeps mid and the left half; a[mid] < target discards through mid. The final panel locates the first equal index or -1.

The target control supports 0 through 6; the complete trace and prediction answers recalculate. The pseudocode explicitly uses **lo = mid + 1** on the less-than branch. This exposes the failure of returning an arbitrary equal midpoint when duplicates exist.

### 3. Breadth-first search — C2 / c2-structures

The same directed diamond graph is repeated in each panel. Nodes are visually distinguished as undiscovered, discovered/enqueued, or expanded; every discovered node is labelled with its shortest hop distance. A written FIFO queue at the bottom of each panel shows B and C before D and explains why D is not reinserted when another edge reaches it.

The model derives the entire trace from adjacency lists and a real queue simulation; node-state labels do not depend on hand-typed captions. The invariant describes monotone hop-distance processing by FIFO.

### 4. Coin-combination dynamic programming — C2 / c2-graphs

Each panel shows the complete indexed DP array of ways to make amounts 0–5 after a set of allowed coins. The base case starts at [1,0,0,0,0,0], then coins 1, 2, and 5 are added. Curved **dependency arrows** connect the previous required amount to the updated cell, and the exact recurrence numbers are written below.

The final value is four **unordered** ways to make amount five. Coin ordering is fixed outside the amount loop; the diagram does not mistakenly count permutations as different combinations.

## Quality and academic integrity

- All figures are **original drawn SVG**, not photographs or reproductions of copyrighted book illustrations. The instructional sequence style was inspired by classic algorithms pedagogy, particularly Cormen, Leiserson, Rivest and Stein, and MIT introductory algorithms lectures.
- The plates show meaningful mechanisms rather than high-contrast boxes or disembodied numbers. An explanatory caption decodes every shading convention and arrow.
- Typography is deliberately editorial: parchment/ink contrast, calm ochre emphasis, zero-based indices, legible mathematical notation and a short synchronized Python pseudocode listing. Dark/light surrounding Mastery themes both work because these figures function as book pages.
- On narrow screens, the whole figure **pans inside its canvas** instead of shrinking labels to illegibility or widening the website layout.
- Reduced-motion preferences are respected. Predictions and figure playback earn **no automatic mastery credit**.
- The formula, code and drawing derive from inspectable algorithm states. All input variants are checked against independently implemented models. This does not mean arbitrary unseen programs have been formally proven.

## QA and production criteria

The release cannot claim ready on source tests alone. It runs:
1. Independent rolling-window sums and maxima for all four window widths.
2. Every binary-search half-open transition and exact return across targets 0–6.
3. An independent BFS graph traversal whose queue, visited set and distances match every rendered state.
4. A bottom-up coin DP recurrence and exact dependency data.
5. Full drawn-panel counts and selected-state/caption/pseudocode consistency.
6. Real Chromium screenshots for each plate, and mobile, with SVG text-boundary checks.
7. All existing C0–C4 visual tests, original insertion-sort/Bayes quality checks, Foundation/Python regression and sitewide audit.
8. GitHub Pages deployment at the tested source commit.

## Future quality batches

Older visuals remain candidates for this level of redesign, particularly the probability sampling charts, vector transforms, optimization and reliability timelines. **No claim is made that all older visualization prototypes are already textbook quality.** Later specialized Quant/AI/SWE diagrams should also reuse this editorial explanation pattern and independent model validation.

Direct routes:
- [Sliding window](foundation.html#C2/c2-windows)
- [Binary search](foundation.html#C2/c2-binary)
- [BFS](foundation.html#C2/c2-structures)
- [Dynamic programming](foundation.html#C2/c2-graphs)

/* AXIOM Faculty Notes, original instructional material. All mathematical
   statements carry their assumptions and are paired with an independent task. */
'use strict';
const AXIOM_SEMINAR = (() => {
  const L = {
  'number-sense': {
    aim:'Control units, estimate orders of magnitude, and distinguish additive from multiplicative changes.',
    assumptions:'A percentage return is measured relative to the value at the start of that particular period.',
    claim:'Successive simple returns compound: final wealth W = W₀(1+r₁)(1+r₂)···(1+rₙ). They do not add except as a first-order approximation for small returns.',
    proof:['Start with W₁=W₀(1+r₁). A second change of r₂ is measured on W₁, not W₀.','Substitute: W₂=W₁(1+r₂)=W₀(1+r₁)(1+r₂). Repeat by induction.','For a +r move, the exact return that undoes it solves (1+r)(1+s)=1, so s=−r/(1+r).'],
    example:['An asset moves from $80 to $100: a 25% gain. The reverse move is (80−100)/100=−20%.','A 12-basis-point execution cost on $250,000 is 250,000 × 12/10,000=$300.'],
    contrast:'A +20% day and a −20% day produce 1.2×0.8=0.96, a 4% loss; adding percentages incorrectly predicts zero.',
    task:'A strategy earns +10%, then −10%, then +5%. Find its total simple return, exactly.',
    hint:'Multiply all three gross return factors before subtracting one.',
    solution:'(1.10)(0.90)(1.05)−1=1.0395−1=0.0395, or +3.95%.',
    source:'Quant Math Prerequisites: arithmetic and percentage change.'
  },
  algebra: {
    aim:'Turn stories into equations and solve without hiding assumptions.',
    assumptions:'The expected remaining time is finite, and transitions are described by fixed conditional probabilities.',
    claim:'For a finite absorbing process, first-step analysis produces a linear system E = 1 + P E on transient states; when I−P is invertible, E=(I−P)⁻¹1.',
    proof:['Condition on the next transition. Every unsuccessful step costs one unit of time and leaves a new expected time.','For state i, Eᵢ = 1 + Σⱼ pᵢⱼ Eⱼ, with E=0 at absorbing states.','Gather unknowns on the left. The existence of an algebraic inverse alone is not enough: the chain must reach absorption almost surely with finite expected time.'],
    example:['A fair coin is flipped until heads. E=1+(1/2)E, so E=2.','For two states A,B: E_A=1+½E_A+½E_B, E_B=1+½E_A. Substituting E_B gives E_A=6, E_B=4.'],
    contrast:'Setting E=1/(1−p) when p=1 is not a large finite answer. It signals that the process never terminates.',
    task:'A task succeeds independently each try with probability 1/4. Write and solve the first-step equation for expected attempts.',
    hint:'Success adds zero remaining attempts, failure returns you to the same state.',
    solution:'E=1+(3/4)E, hence (1/4)E=1 and E=4.',
    source:'Quant Math Prerequisites: algebra; Blitzstein–Hwang: conditioning and expectation.'
  },
  exponents: {
    aim:'Recognize how logarithms linearize products and why exponential approximations are local.',
    assumptions:'All logarithm arguments are positive; a first-order approximation assumes |x| is small.',
    claim:'log(ab)=log(a)+log(b), and log(1+x)=x−x²/2+O(x³) as x→0.',
    proof:['By definition, a=eᵘ and b=eᵛ for u=ln a, v=ln b. Then ab=eᵘ⁺ᵛ, so ln(ab)=u+v.','Integrate the geometric expansion 1/(1+t)=1−t+t²−··· from 0 to x to obtain ln(1+x).','The leading approximation ln(1+x)≈x is useful only when the neglected quadratic term is small enough for the decision.'],
    example:['Compounded returns (1+r₁)(1+r₂) become a sum of log returns, ln(1+r₁)+ln(1+r₂).','For +1% and −1%, total log return is ln(1.01)+ln(0.99)=ln(0.9999)<0.'],
    contrast:'Applying ln(1+r)≈r to a 50% loss is very inaccurate: ln(0.5)≈−0.693 versus −0.5.',
    task:'What is the continuously compounded rate equivalent to a +21% total return?',
    hint:'The log return is ln(final/start).',
    solution:'ln(1.21)≈0.19062, or about 19.06% in log-return units.',
    source:'Quant Math Prerequisites: exponents, logs and compounding.'
  },
  sequences: {
    aim:'Derive sums rather than memorize them, and know when infinite sums converge.',
    assumptions:'For an infinite geometric series Σrⁿ, convergence requires |r|<1.',
    claim:'Σ(k=0,…,n−1) rᵏ=(1−rⁿ)/(1−r) for r≠1; Σ(k=0,…,∞)rᵏ=1/(1−r) when |r|<1.',
    proof:['Write S=1+r+⋯+rⁿ⁻¹ and rS=r+r²+⋯+rⁿ.','Subtract to cancel all interior terms: (1−r)S=1−rⁿ.','If |r|<1, then rⁿ→0. Without that condition, you cannot discard the terminal term.'],
    example:['A reward of $10 arrives now, then $10×0.8, then $10×0.8², etc. Its total present value is $10/(1−0.8)=$50.','If the continuation probability after each round is 0.8, expected rounds including the first are 1/(1−0.8)=5.'],
    contrast:'At r=1, the infinite sum 1+1+··· diverges. The expression 1/(1−r) is not meaningful there.',
    task:'A process pays 4 now and then 60% as much every subsequent period forever. Find the total.',
    hint:'It is a geometric series with initial term 4.',
    solution:'4/(1−0.6)=10.',
    source:'Quant Math Prerequisites: sequences and asymptotics.'
  },
  counting: {
    aim:'Identify what is being counted before reaching for a formula.',
    assumptions:'Every unordered subset of the given size is equally likely when using combinations to count probabilities.',
    claim:'The number of k-element subsets of n distinct objects is C(n,k)=n!/(k!(n−k)!).',
    proof:['Count ordered lists of k distinct objects: n(n−1)···(n−k+1).','Every unordered chosen subset produces exactly k! orderings. Divide to remove duplicate descriptions.','If the objects are not equally likely or sampling is weighted, counting alone does not give probabilities.'],
    example:['Exactly two aces in five cards: choose 2 from 4 aces and 3 from 48 others, then divide by C(52,5).','The numerator is C(4,2)C(48,3), because ace and non-ace selections are independent combinatorial choices, not independent probabilities.'],
    contrast:'Choosing a chairperson and a deputy from 10 people gives 10×9=90, not C(10,2)=45, because roles matter.',
    task:'How many unordered five-person committees from 12 people contain a designated pair of people?',
    hint:'Fix the two required people and choose the remaining members.',
    solution:'Choose 3 of the remaining 10: C(10,3)=120.',
    source:'Blitzstein–Hwang: Chapter 1 counting; Zhou: combinatorial analysis.'
  },
  trigonometry: {
    aim:'Understand projections, periodicity and vector geometry, not only trig identities.',
    assumptions:'Angles are measured in radians for calculus identities such as d(sin x)/dx=cos x.',
    claim:'For vectors u,v, u·v=‖u‖‖v‖cos θ. This connects trigonometry to covariance geometry.',
    proof:['Project u onto the direction of v: the signed projection length is ‖u‖cos θ.','Multiplying by ‖v‖ gives the dot product, linear in each input.','After centering observations, sample correlation is the cosine of the angle between the centered data vectors.'],
    example:['If centered return vectors are perpendicular, their sample covariance is zero, because their dot product vanishes.','A negative dot product corresponds to an obtuse angle and negative covariance.'],
    contrast:'Perpendicular centered vectors are uncorrelated in the sample, not necessarily statistically independent in the population.',
    task:'Two unit vectors meet at 120°. What is their dot product?',
    hint:'For unit vectors, u·v=cos θ.',
    solution:'cos(120°)=−1/2.',
    source:'Quant Math Prerequisites: trigonometry; Zhou: linear algebra.'
  },
  'discrete-proofs': {
    aim:'Choose invariants, induction and contradiction as problem-solving methods.',
    assumptions:'The claim has a meaningful base case, and each permissible transition preserves the proposed invariant.',
    claim:'If a property P holds initially and is preserved by every legal move, then P holds after any finite sequence of legal moves.',
    proof:['Base case: verify P before any move.','Inductive step: suppose P holds before a move. Show the rules imply it still holds afterward.','By induction on the number of moves, P holds after all finite sequences. A violated target therefore cannot be reached.'],
    example:['On an 8×8 chessboard, remove two diagonally opposite corner squares (the same color). Every domino covers one dark and one light square, but the remaining board has unequal color counts, so a domino tiling is impossible.','Notice that the impossibility follows from a conserved count, not from trying thousands of tile placements.'],
    contrast:'Induction proves statements about a discrete index; it does not by itself prove convergence of an infinite algorithm.',
    task:'Begin with an even integer. You may add or subtract 2 any number of times. Can you reach an odd integer? Prove your answer.',
    hint:'What remains invariant modulo 2?',
    solution:'No. Every move changes the integer by a multiple of 2, preserving its parity. An odd integer has a different parity.',
    source:'Zhou: logic, induction and contradiction; Quant Math Prerequisites: discrete proofs.'
  },
  calculus: {
    aim:'Understand a derivative as a local linear approximation with domain constraints.',
    assumptions:'The function is differentiable at the point under consideration; stationary-point rules apply only to interior points.',
    claim:'If f is differentiable at x, then f(x+h)=f(x)+f′(x)h+o(h). For an interior differentiable local optimum, f′(x)=0.',
    proof:['Differentiability states lim(h→0)[f(x+h)−f(x)−f′(x)h]/h=0. Rearranging gives the local approximation.','If f′(x)>0 then sufficiently small positive moves increase f, contradicting an interior maximum. Similarly if f′(x)<0.','The zero-derivative condition is necessary, not sufficient: check curvature and boundaries.'],
    example:['Suppose expected spread revenue is R(d)=A d e^(−kd) for A,k>0.','Differentiate: R′(d)=A e^(−kd)(1−kd). Thus d*=1/k; the revenue rises before and falls after that point.'],
    contrast:'f(x)=x³ has f′(0)=0 without either a maximum or a minimum there.',
    task:'Maximize f(x)=8x−2x² on 0≤x≤10.',
    hint:'Check the stationary point and both boundaries.',
    solution:'f′=8−4x=0 gives x=2. f″=−4<0, and f(2)=8 exceeds f(0)=0 and f(10)=−120.',
    source:'Zhou: calculus and optimization; Quant Math Prerequisites: derivatives.'
  },
  integration: {
    aim:'Connect integrals to areas, densities, expectations and conditional events.',
    assumptions:'A probability density is nonnegative and integrates to one; the expected value exists when ∫|x|f(x)dx<∞.',
    claim:'For continuous X with density f, P(a≤X≤b)=∫ₐᵇ f(x)dx and E[g(X)]=∫g(x)f(x)dx when integrable.',
    proof:['Approximate the interval by thin bins: P(X in bin)≈f(xᵢ)Δx.','Add bin probabilities and take Δx→0 to obtain the integral.','To calculate E[g(X)], weight each bin’s value g(xᵢ) by its probability and pass to the limit.'],
    example:['Let X be Uniform(0,2), so f(x)=1/2 on [0,2]. E[X²]=∫₀² x²/2 dx=4/3.','Yet (E[X])²=1. This difference produces Var(X)=4/3−1=1/3.'],
    contrast:'A density can exceed one; probability is the area under a density over an interval, not its height.',
    task:'For X Uniform(0,3), calculate E[X] and P(X>2).',
    hint:'The density is 1/3 on [0,3].',
    solution:'E[X]=(1/3)∫₀³ xdx=3/2. P(X>2)=(1/3)∫₂³dx=1/3.',
    source:'Blitzstein–Hwang: continuous random variables; Zhou: integration.'
  },
  'matrix-basics': {
    aim:'Understand matrices as transformations and linear systems as geometry.',
    assumptions:'A square matrix A is invertible if and only if its columns are linearly independent.',
    claim:'Ax=b has a unique solution for every b exactly when A is invertible. Numerically, solving Ax=b is better than explicitly forming A⁻¹.',
    proof:['If A has a nonzero null vector v with Av=0, then any solution x gives another x+v. Uniqueness fails.','Conversely if the null space contains only 0 in a square system, A has full rank and is invertible.','Direct inversion typically adds work and can magnify numerical error; stable factorizations such as QR and Cholesky are preferable when applicable.'],
    example:['For A=[[2,1],[1,2]] and b=[3,3], adding or subtracting the two equations gives x=y=1.','The eigenvectors [1,1] and [1,−1] have eigenvalues 3 and 1, showing how A stretches different directions.'],
    contrast:'A large determinant alone is not a complete measure of numerical conditioning; scaling of units matters.',
    task:'Solve 2x+y=5 and x+2y=4.',
    hint:'Eliminate x or y.',
    solution:'Subtract twice the second equation from the first: −3y=−3, so y=1, x=2.',
    source:'Zhou: linear algebra; Quant Math Prerequisites: matrices and systems.'
  },
  multivariable: {
    aim:'Use gradients, Hessians and constraints to make correct optimization arguments.',
    assumptions:'The objective is twice differentiable; an unconstrained critical point has zero gradient.',
    claim:'For a quadratic f(w)=μᵀw−(λ/2)wᵀΣw with Σ positive definite and λ>0, the unique unconstrained maximizer satisfies λΣw=μ.',
    proof:['The derivative of μᵀw is μ. For symmetric Σ, the gradient of (1/2)wᵀΣw is Σw.','Setting ∇f=0 gives μ−λΣw=0.','The Hessian is −λΣ, negative definite, establishing a strict global maximum. A budget constraint changes the first-order conditions.'],
    example:['With μ=(2,4), Σ=diag(1,4), λ=2, solve 2Σw=μ to obtain w=(1,0.5).','A portfolio budget constraint w₁+w₂=1 would require a Lagrange multiplier and would change this result.'],
    contrast:'An unconstrained optimum is not automatically feasible under leverage, short-selling or weight-sum restrictions.',
    task:'Maximize f(x,y)=4x+2y−x²−y².',
    hint:'Find both partial derivatives and test the Hessian.',
    solution:'∂f/∂x=4−2x, ∂f/∂y=2−2y, so (x,y)=(2,1). Hessian=diag(−2,−2), strictly negative definite.',
    source:'Quant Math Prerequisites: multivariable calculus and constrained optimization.'
  },
  'sampling-inference': {
    aim:'Separate noisy observations, estimators and uncertainty in the estimators.',
    assumptions:'For the standard SE formula, observations are independent and have a common finite variance.',
    claim:'Var(X̄)=σ²/n for independent identically distributed observations; hence SE(X̄)=σ/√n.',
    proof:['Linearity gives E[X̄]=μ.','Var((1/n)ΣXᵢ)=(1/n²)ΣVar(Xᵢ)=(1/n²)nσ²=σ²/n, since covariances vanish under independence.','Replacing σ with sample s estimates SE; inference also requires checking sample size and dependence.'],
    example:['With sample SD s=12 and n=144, estimated SE=12/12=1.','To halve this SE with the same SD, n must increase fourfold from 144 to 576.'],
    contrast:'If observations are positively autocorrelated, σ/√n can understate uncertainty even for a large dataset.',
    task:'A sample has s=10 and n=100. Find estimated SE; then estimate SE if n=400 with the same s.',
    hint:'Scale by the square root of n.',
    solution:'SE=10/10=1 initially, then 10/20=0.5.',
    source:'Blitzstein–Hwang: expectation and variance; Quant Math Prerequisites: sampling.'
  },
  'numerical-methods': {
    aim:'Distinguish an exact mathematical formula from a stable computable algorithm.',
    assumptions:'Newton’s method needs differentiability and a nonzero derivative near the iterate; convergence depends on initialization.',
    claim:'Newton’s root-finding iteration is xₙ₊₁=xₙ−f(xₙ)/f′(xₙ), obtained by solving the linearized equation near xₙ.',
    proof:['Approximate f(xₙ+h)≈f(xₙ)+f′(xₙ)h.','Set the approximation to zero and solve h≈−f(xₙ)/f′(xₙ).','This gives the update, but does not guarantee that later iterates remain in a region where the approximation is good.'],
    example:['To approximate √2, solve f(x)=x²−2 with x₀=1.5.','x₁=1.5−(2.25−2)/3=1.4166667; a second update yields about 1.414216.'],
    contrast:'Newton iteration may diverge or oscillate, particularly from a poor initial guess or near f′(x)=0.',
    task:'Apply one Newton step to f(x)=x²−9 starting from x₀=4.',
    hint:'f′(x)=2x.',
    solution:'x₁=4−(16−9)/8=4−7/8=3.125.',
    source:'Zhou: Newton’s method and numerical algorithms.'
  },
  events: {
    aim:'Define the probability space precisely before manipulating events.',
    assumptions:'The sample space includes every possible outcome, and events are subsets of it.',
    claim:'P(A∪B)=P(A)+P(B)−P(A∩B). The overlap must be subtracted exactly once.',
    proof:['Partition A∪B into disjoint pieces: A\B and B.','Add their probabilities. Since P(A\B)=P(A)−P(A∩B), the identity follows.','For more than two events, overlapping regions require inclusion–exclusion.'],
    example:['In a 52-card deck, P(heart or ace)=13/52+4/52−1/52=16/52=4/13.','The ace of hearts was counted twice and must be removed once.'],
    contrast:'Mutual exclusivity means intersection probability zero. Independence means intersection probability is the product of marginals. These are not synonyms.',
    task:'Roll a fair die. Let A={even} and B={at least 5}. Compute P(A∪B).',
    hint:'Enumerate the outcomes in each event and identify the overlap.',
    solution:'A={2,4,6}, B={5,6}; A∪B={2,4,5,6}. Probability 4/6=2/3.',
    source:'Blitzstein–Hwang: probability and counting.'
  },
  'expected-value': {
    aim:'Use linearity as a tool for clever decomposition, not just a formula to memorize.',
    assumptions:'The random variables have finite expectations; independence is not required for linearity.',
    claim:'For integrable Xᵢ, E[ΣᵢXᵢ]=ΣᵢE[Xᵢ], regardless of dependence.',
    proof:['For a finite sample space, expand E[X+Y]=Σω(X(ω)+Y(ω))P(ω).','Distribute the sum and regroup to obtain E[X]+E[Y]. The calculation never factors joint probabilities.','Use this to break a difficult count into many easy indicators even when outcomes share constraints.'],
    example:['Shuffle n numbered cards and place them in n numbered slots. Let Iᵢ indicate that card i lands in slot i.','Each E[Iᵢ]=1/n, so E[number of correct matches]=Σᵢ(1/n)=1 for every n.'],
    contrast:'In general E[XY]=E[X]E[Y] does require additional structure, such as independence; do not apply the product rule by analogy.',
    task:'Throw 12 fair six-sided dice. What is the expected number of pairs that show the same face?',
    hint:'There are C(12,2) unordered pairs. Each pair matches with probability 1/6.',
    solution:'C(12,2)/6=66/6=11. Pair indicators overlap and are dependent, but expectation remains additive.',
    source:'Blitzstein–Hwang: Chapter 4; Quant Interview Notes: indicators and linearity.'
  },
  indicators: {
    aim:'Translate a global random count into elementary yes/no events.',
    assumptions:'I_A=1 if event A occurs, 0 otherwise; its expectation is well-defined.',
    claim:'E[Σᵢ I_{Aᵢ}]=ΣᵢP(Aᵢ), even when events Aᵢ strongly overlap.',
    proof:['E[I_A]=1·P(A)+0·P(Aᶜ)=P(A).','If N=ΣI_A counts occurrences, linearity gives E[N]=ΣP(A).','The event indicators need not be independent; covariance matters only when finding Var(N), not E[N].'],
    example:['Seat 20 people randomly in 20 labeled seats. The expected number in their assigned seats is 1.','A surprising consequence: doubling the number of people does not change the expected count of correct seats.'],
    contrast:'The probability that at least one person gets their seat is not 1 simply because the expected number is 1.',
    task:'Ten fair coins are tossed. Let N be the number of adjacent HH pairs, including overlapping pairs. Find E[N].',
    hint:'There are nine adjacent positions; each specific adjacent pair is HH with probability 1/4.',
    solution:'N=Σ(i=1,…,9)I{flips i and i+1 are H}. Thus E[N]=9×1/4=9/4.',
    source:'Blitzstein–Hwang: indicator random variables; Quant Interview Notes.'
  },
  conditional: {
    aim:'Understand conditioning as changing the population of possible worlds.',
    assumptions:'P(B)>0. The observation mechanism that produced B must be precisely specified.',
    claim:'P(A|B)=P(A∩B)/P(B). Conditioning on evidence discards outcomes incompatible with B and renormalizes the survivors.',
    proof:['Within the event B, total conditional probability must equal 1.','Relative weights of subevents of B retain their original probability ratios, yielding P(A∩B)/P(B).','Changing the way evidence is selected can change the relevant conditional event, even if the verbal summary sounds similar.'],
    example:['A fair die is rolled and you learn the result exceeds 3. Given {4,5,6}, even outcomes are {4,6}, so P(even|>3)=2/3.','This is not the unconditional probability of even, which is 1/2.'],
    contrast:'“A family has at least one boy” and “I met one of the two children, who was a boy” are different sampling protocols.',
    task:'From a 52-card deck, a card is drawn and is known to be red. What is P(it is a heart)?',
    hint:'Condition on the 26 red cards.',
    solution:'There are 13 hearts among 26 red cards, so P(heart|red)=13/26=1/2.',
    source:'Blitzstein–Hwang: Chapter 2; Quant Interview Notes: conditioning.'
  },
  bayes: {
    aim:'Update hidden-state probabilities using likelihoods and realistic base rates.',
    assumptions:'Hidden states partition the population, and the probability of evidence under each state is known.',
    claim:'P(Hᵢ|E) = P(E|Hᵢ)P(Hᵢ) / Σⱼ P(E|Hⱼ)P(Hⱼ). The denominator is the total probability of the evidence.',
    proof:['Start with P(Hᵢ|E)=P(Hᵢ∩E)/P(E).','Write the numerator as P(E|Hᵢ)P(Hᵢ).','Partition E according to the mutually exclusive Hⱼ, so P(E)=ΣⱼP(E|Hⱼ)P(Hⱼ).'],
    example:['A signal flags a rare event with prevalence 1%, sensitivity 90%, false-positive rate 5%. In 10,000 cases expect 90 true positives and 495 false positives.','Among 585 flags, only 90 are genuine. The posterior event probability is 90/585≈15.38%.'],
    contrast:'A 90% true-positive rate is not a 90% probability that a positive flag is genuine; that confuses P(E|H) with P(H|E).',
    task:'Two equally likely coins have P(H)=1/2 and P(H)=3/4. A random coin is chosen and lands heads. What is P(the second coin was chosen|H)?',
    hint:'Treat each coin as a path to the observed head.',
    solution:'(0.5×0.75)/(0.5×0.5+0.5×0.75)=0.375/0.625=3/5.',
    source:'Blitzstein–Hwang: Bayes’ rule; Quant Interview Notes: posterior normalization.'
  },
  recursive: {
    aim:'Design minimal states and calculate expected waiting times without treating overlaps as independent.',
    assumptions:'Fair independent coin flips; a state remembers the longest suffix that matches a prefix of the target pattern.',
    claim:'For the pattern HH, expected waiting time is 6 flips, not 1/P(HH)=4. Sequence overlap changes the state transitions.',
    proof:['Use state 0 (no useful H), state 1 (last flip H), and absorbing state 2 (HH completed).','From 0: E₀=1+(1/2)E₀+(1/2)E₁. From 1: E₁=1+(1/2)E₀+(1/2)×0.','The second equation gives E₁=1+E₀/2. Substitute: E₀=1+E₀/2+1/2+E₀/4; thus E₀/4=3/2 and E₀=6.'],
    example:['For the pattern HT, state H persists only if a new H occurs. E₀=1+½E₀+½E_H and E_H=1+½E_H because either next T finishes or another H leaves the same state.','Thus E_H=2 and E₀=4. Both HH and HT have one-shot probability 1/4, yet different waiting times.'],
    contrast:'The shortcut 1/P(pattern) applies to independent fresh trials, not arbitrary overlapping windows in a stream.',
    task:'For a fair coin, define E₀ and E_H for waiting until HT. Write both recursions and solve E₀.',
    hint:'After a head in state H, another head keeps you in H; a tail finishes.',
    solution:'E_H=1+(1/2)E_H, so E_H=2. E₀=1+(1/2)E₀+(1/2)E_H=2+(1/2)E₀, so E₀=4.',
    source:'Quant Interview Notes: recursive EV; Zhou: Markov chains and coin sequences.'
  },
  symmetry: {
    aim:'Identify genuine exchangeability and use it to replace tedious enumeration.',
    assumptions:'The labels are exchangeable under the joint distribution; there is no special treatment of any label.',
    claim:'For n i.i.d. continuous variables, every index is equally likely to achieve the unique maximum, so P(Xᵢ=maxⱼXⱼ)=1/n.',
    proof:['Continuity guarantees ties occur with probability zero.','By exchangeability, all n events “index i is largest” have the same probability.','The events are mutually exclusive and exhaustive. Their equal probabilities sum to one, so each is 1/n.'],
    example:['Among 12 i.i.d. continuous execution times, each observation has probability 1/12 of being the fastest.','Distribution shape does not matter: the same claim holds for uniform, exponential or lognormal times if the variables are i.i.d. continuous.'],
    contrast:'If one trader has lower latency than the others, the winning events are no longer exchangeable; 1/n is wrong.',
    task:'Five i.i.d. continuous random variables are observed. What is P(the third one is the smallest)? Explain without integration.',
    hint:'Every index is symmetric and ties have probability zero.',
    solution:'Each of the five indices has the same chance to be the unique minimum; the five disjoint events cover all outcomes, hence 1/5.',
    source:'Zhou: symmetry; Blitzstein–Hwang: i.i.d. continuous variables.'
  },
  stopping: {
    aim:'Use backward induction to distinguish an immediate payoff from the value of waiting.',
    assumptions:'You may reroll a fair six-sided die once without cost and must keep the second result if you reroll.',
    claim:'An optimal stopping policy accepts the current payoff x exactly when x≥continuation value, provided future payoffs do not depend on x.',
    proof:['The last roll is worth E[D]=3.5. With one opportunity remaining, keep x if x≥3.5; otherwise reroll.','The ex ante value is E[max(D,3.5)] = (3×3.5+4+5+6)/6 = 4.25.','With additional reroll opportunities, continuation value changes and must be solved backward, not copied from the one-reroll case.'],
    example:['A reroll fee of $1 lowers continuation value to 2.5. Now keeping 3 is rational.','The payoff distribution did not change; only the decision’s opportunity cost changed.'],
    contrast:'“Always reroll below four” is not universally optimal when reroll costs, remaining time, or risk preferences change.',
    task:'With one reroll available at a cost of $2, which die faces should you keep?',
    hint:'Compute expected net payoff from the replacement roll.',
    solution:'The reroll is worth 3.5−2=1.5. Keep 2,3,4,5,6; reroll only 1.',
    source:'Quant Interview Notes: stopping; Zhou: dynamic programming.'
  },
  variance: {
    aim:'Calculate risk using second moments, and separate scale from expected reward.',
    assumptions:'The indicated second moments exist.',
    claim:'Var(X+Y)=Var(X)+Var(Y)+2Cov(X,Y), where Cov(X,Y)=E[(X−EX)(Y−EY)].',
    proof:['Center X and Y: (X+Y)−E[X+Y]=(X−EX)+(Y−EY).','Square and take expectation: the terms are (X−EX)², (Y−EY)² and twice their product.','If X,Y are independent the covariance is zero, but the converse need not hold.'],
    example:['Suppose Var(X)=4, Var(Y)=9, and Cov(X,Y)=−3. Then Var(X+Y)=4+9−6=7.','Adding standard deviations (2+3) to get “volatility 5” ignores covariance and is generally wrong.'],
    contrast:'Covariance can be negative. This is precisely why diversification sometimes reduces total variance.',
    task:'If Var(X)=9, Var(Y)=16 and Cov(X,Y)=6, find Var(2X−Y).',
    hint:'Use a²Var(X)+b²Var(Y)+2abCov(X,Y).',
    solution:'4×9+1×16+2×2×(−1)×6=36+16−24=28.',
    source:'Blitzstein–Hwang: variance and joint distributions; Quant Interview Notes: risk.'
  },
  distributions: {
    aim:'Select probability families by their generative stories, not a memorized list of symbols.',
    assumptions:'For Poisson counts, events occur with a constant rate and independent increments under the model.',
    claim:'If N is Poisson(λ), then E[N]=Var(N)=λ. In the Poisson process, counts in disjoint intervals are independent.',
    proof:['The Poisson probability mass function is P(N=k)=e^(−λ)λᵏ/k!.','Using k/k!=1/(k−1)!, the expectation ΣkP(N=k) shifts to λΣe^(−λ)λʲ/j!=λ.','Compute E[N(N−1)]=λ² analogously; then E[N²]=λ²+λ and Var(N)=λ.'],
    example:['A queue sees an average of three arrivals per second. Under a Poisson model, P(no arrivals during one second)=e^(−3)≈0.0498.','The probability of at least one arrival is 1−e^(−3)≈0.9502.'],
    contrast:'Exchange traffic often bursts and depends on market state; a single constant-rate Poisson process may underestimate clustered arrivals.',
    task:'A Poisson count has mean 2. Find P(N=1) and the variance.',
    hint:'Use e^(−λ)λᵏ/k! and Var(N)=λ.',
    solution:'P(N=1)=2e^(−2)≈0.2707; Var(N)=2.',
    source:'Blitzstein–Hwang: Poisson; Zhou: random-variable distributions.'
  },
  correlation: {
    aim:'Interpret correlation as standardized covariance and distinguish it from dependence or causation.',
    assumptions:'Both standard deviations are positive and finite.',
    claim:'ρ(X,Y)=Cov(X,Y)/(σXσY), and −1≤ρ≤1 by the Cauchy–Schwarz inequality.',
    proof:['Center X,Y and regard them as vectors in the space of square-integrable random variables.','Cauchy–Schwarz gives |E[(X−EX)(Y−EY)]|≤√E[(X−EX)²] √E[(Y−EY)²].','Divide by σXσY>0 to get |ρ|≤1. Equality requires centered variables to be linearly proportional almost surely.'],
    example:['Let X be equally likely −1,0,1 and Y=X². Then E[X]=0, E[XY]=E[X³]=0, so Cov(X,Y)=0.','Yet Y is completely determined by X. Zero correlation did not imply independence.'],
    contrast:'“Correlation −0.8” does not mean one variable moves “80% in the opposite direction”; slope also depends on scale.',
    task:'If σX=2, σY=5 and Cov(X,Y)=−4, find correlation.',
    hint:'Standardize covariance by both standard deviations.',
    solution:'ρ=−4/(2×5)=−0.4.',
    source:'Blitzstein–Hwang: Chapter 7; Quant Interview Notes: correlation.'
  },
  inference: {
    aim:'Separate statistical significance from economic significance and control false discoveries.',
    assumptions:'A standard t-test relies on an appropriate sampling model and standard-error estimator.',
    claim:'The test statistic t=(estimate−null value)/SE measures distance from a null hypothesis in estimated standard-error units.',
    proof:['Construct an estimator and quantify its sampling variation under a null model.','Standardize by the estimated standard error to make the observed deviation comparable across sample sizes.','A p-value measures tail extremeness under the null, not the probability that the null itself is true.'],
    example:['A daily excess-return estimate of 0.04% with SE=0.02% has t=2.','That does not imply profitable trading if commissions, spread, financing and market impact exceed 0.04%.'],
    contrast:'When 1,000 independent null hypotheses are tested at 1% significance, the expected number of false positives is 10. Selecting the best backtest invalidates naive single-test interpretations.',
    task:'A sample mean is 0.6 and its estimated standard error is 0.15. Test H₀: μ=0. What is t?',
    hint:'Subtract the hypothesized mean, then divide by SE.',
    solution:'t=(0.6−0)/0.15=4. This is evidence relative to the specified null/model, not a direct probability of a true effect.',
    source:'Quant Interview Notes: statistics, inference and multiple testing.'
  },
  regression: {
    aim:'Derive ordinary least squares and diagnose what a fitted regression does not establish.',
    assumptions:'The sample includes variation in X; the formula for the slope divides by Σ(xᵢ−x̄)²>0.',
    claim:'For least squares with an intercept, β̂=Σ(xᵢ−x̄)(yᵢ−ȳ)/Σ(xᵢ−x̄)² and α̂=ȳ−β̂x̄.',
    proof:['Minimize S(α,β)=Σ(yᵢ−α−βxᵢ)². Differentiate with respect to α: Σ(yᵢ−α−βxᵢ)=0.','Thus α=ȳ−βx̄. Substitute into S, giving Σ[(yᵢ−ȳ)−β(xᵢ−x̄)]².','Differentiate with respect to β and set to zero: Σ(xᵢ−x̄)(yᵢ−ȳ)=βΣ(xᵢ−x̄)².'],
    example:['For x=(1,2,3) and y=(2,4,5), x̄=2, ȳ=11/3, numerator is 3, denominator is 2.','β̂=1.5 and α̂=11/3−3=2/3. The fitted line is ŷ=2/3+1.5x. Residuals sum to zero because we included an intercept.'],
    contrast:'Even high in-sample R² neither proves causality nor forecasts future returns. A regime shift or leaked feature can destroy out-of-sample performance.',
    task:'Fit the exact line through (1,4), (2,6), (3,8). What are α, β, and the prediction at x=5?',
    hint:'Slope is the change in y per unit increase in x.',
    solution:'β=2, α=2; ŷ(5)=2+2×5=12. Verify the three fitted residuals are zero.',
    source:'Quant Interview Notes: regression; Zhou: linear algebra / least squares.'
  },
  'linear-algebra': {
    aim:'Explain how covariance matrices encode portfolios and why semidefiniteness is essential.',
    assumptions:'Σ is the covariance matrix of a finite-variance return vector R.',
    claim:'For any weights w, Var(wᵀR)=wᵀΣw≥0. Therefore covariance matrices must be positive semidefinite.',
    proof:['Set portfolio payoff P=wᵀR=ΣᵢwᵢRᵢ.','Expand Var(P)=E[(Σᵢwᵢ(Rᵢ−μᵢ))²]=ΣᵢΣⱼ wᵢwⱼCov(Rᵢ,Rⱼ)=wᵀΣw.','Variance is the expectation of a square, hence nonnegative. Any purported covariance matrix violating this is mathematically impossible.'],
    example:['Two assets with variances 1,1 and covariance 2 give Σ=[[1,2],[2,1]].','For w=(1,−1), wᵀΣw=1+1−4=−2, an impossible variance. This proves Σ cannot be a covariance matrix.'],
    contrast:'A matrix can be symmetric without being positive semidefinite. Symmetry alone does not make it a valid covariance matrix.',
    task:'Given Σ=[[4,1],[1,9]] and w=(1/2,1/2), compute portfolio variance.',
    hint:'Expand wᵀΣw, including both cross terms.',
    solution:'(1/4)×4+(1/4)×9+2×(1/2)(1/2)×1 =1+2.25+0.5=3.75.',
    source:'Zhou: positive semidefinite covariance matrices; Quant Math Prerequisites.'
  },
  optimization: {
    aim:'Distinguish a mathematically optimal policy from an economically realistic optimization model.',
    assumptions:'The objective is concave, the feasible set is convex, and constraints are represented correctly.',
    claim:'For a concave differentiable objective f and convex feasible set, any feasible point satisfying the appropriate first-order optimality conditions is a global maximizer.',
    proof:['Concavity implies f(y)≤f(x)+∇f(x)ᵀ(y−x).','If at a feasible x* every feasible direction has ∇f(x*)ᵀ(y−x*)≤0, then f(y)≤f(x*) for all feasible y.','Constraints change the feasible directions. Interior ∇f=0 is not the correct universal rule for boundary optima.'],
    example:['Maximize expected return 0.06w+0.02(1−w) minus risk penalty 0.04w² for 0≤w≤1.','Objective f(w)=0.02+0.04w−0.04w²; derivative 0.04−0.08w gives w*=0.5, inside the feasible interval.'],
    contrast:'The output is only as reliable as its estimated μ and Σ. Optimized portfolios can exploit noise in sample means.',
    task:'Maximize f(x)=3x−x² over 0≤x≤1. Find the optimal feasible x.',
    hint:'Compare the unconstrained stationary point to the allowed interval.',
    solution:'The unconstrained maximum occurs at x=1.5, outside [0,1]. f is increasing throughout [0,1], so the constrained maximum is x=1.',
    source:'Quant Math Prerequisites: optimization; Zhou: Lagrange multipliers.'
  },
  validation: {
    aim:'Design a research test that measures generalization rather than mining historical noise.',
    assumptions:'Market data are time-ordered, and strategy selection has been influenced by exploratory results.',
    claim:'A performance estimate computed on data repeatedly consulted during model selection is not a valid untouched out-of-sample estimate.',
    proof:['Optimizing parameters against a dataset selects those that benefit from random fluctuations, not only true signal.','The maximum of noisy estimates has an upward selection bias relative to the associated true edge.','Lock a research protocol and evaluate once on genuinely unseen, chronologically later data; report realistic fees, spreads and market impact.'],
    example:['Suppose 500 strategies have zero true expected return, but each generates a noisy historical mean. The maximum observed mean is likely positive.','Trading the observed winner can lose money once the sample-specific noise disappears. The more candidates tested, the stronger the selection pressure.'],
    contrast:'Randomly shuffling a time series into train/test can leak future regimes and fail to represent live chronological deployment.',
    task:'You tried 200 parameter sets on a backtest and chose the best. Is a p-value from that chosen run a valid single-test p-value? Explain.',
    hint:'Ask what influenced the choice of model and whether the reported test was truly pre-specified.',
    solution:'No. The test statistic was selected after looking at the data; its nominal single-test p-value ignores multiple testing and selection bias. Use a fresh holdout or suitable multiple-testing correction and disclose the search.',
    source:'Quant Interview Notes: overfitting, multiple testing and research validation.'
  },
  'info-value': {
    aim:'Price information by its effect on decisions, not by the accuracy of predictions alone.',
    assumptions:'A decision-maker is risk-neutral and may condition their action on the observed signal.',
    claim:'Value of perfect information = E[maxₐ E[payoff(a)|full state]] − maxₐ E[payoff(a)] ≥ 0 when information is free and may be ignored.',
    proof:['Without information choose one action before observing the state, maximizing unconditional expectation.','With information choose an action after observation, maximizing the conditional payoff state by state.','The informed decision-maker can always ignore the signal and replicate the uninformed decision, so information cannot reduce their optimal expected value in this model.'],
    example:['Choice A pays $6 for sure. Choice B pays either $12 or $0 with equal probability. Uninformed maximum EV is $6.','With full information, choose B in the $12 state and A in the $0 state. Informed EV=(12+6)/2=$9. Information is worth $3.'],
    contrast:'Information has value only relative to available actions and objectives; a highly accurate signal can have zero decision value.',
    task:'Choose between $4 surely and a fair gamble paying $10 or $0. What is the value of perfect information?',
    hint:'Compute best expected value before knowing the outcome, then optimize separately in each state.',
    solution:'Without information, choose the gamble: EV=$5. With full information: (10+4)/2=$7. Value=$2.',
    source:'Quant Interview Notes: expected value of information.'
  },
  quoting: {
    aim:'Decompose fair value, spread, risk and inventory in a market-making decision.',
    assumptions:'Quotes are illustrative limit prices and may not execute; fair value and inventory preferences are distinct.',
    claim:'A positive quoted spread is not synonymous with positive expected P&L. Realized execution depends on information, selection and subsequent price movement.',
    proof:['A market maker bids b and offers a>b. If both quotes fill one unit in an unchanged market, cash gain is a−b.','But if a buy order arrives precisely when the true value rises above a, the sale at a may be adversely selected.','Inventory and execution costs create additional P&L components. Expected wealth must account for cash plus inventory valued at the later market price.'],
    example:['If a binary contract pays $100 with posterior probability 0.6, its risk-neutral value is $60.','A dealer may quote $59/$61. After credible evidence changes the posterior to 0.7, fair value moves to $70; inventory alone could shift preferred quotes without changing that probability.'],
    contrast:'A dealer long inventory often shifts the quote center downward to encourage selling. That does not imply the underlying fair value fell.',
    task:'Your bid is $99.90 and ask $100.10. You buy 3 units at the bid and later sell all three at the ask with no other costs. What is gross spread P&L?',
    hint:'Multiply per-unit spread by the number of completed round trips.',
    solution:'(100.10−99.90)×3=$0.60. This intentionally excludes fees, impact and any interim mark-to-market risk.',
    source:'Quant Interview Notes: market making and inventory.'
  },
  orderbook: {
    aim:'Reconstruct execution paths and distinguish book visibility from guaranteed liquidity.',
    assumptions:'The simple example uses price priority, no hidden liquidity, no new cancellations, and a marketable buy order.',
    claim:'An aggressive buy order executes against asks from the lowest available price upward. Its volume-weighted average execution price is Σ(price×filled quantity)/total filled quantity.',
    proof:['At the moment of matching, take all available quantity at best ask until the order or level is exhausted.','Continue to the next-best ask for any remaining quantity.','Total cost is the sum of price×quantity across fills; dividing by shares gives average paid price. This average is not generally the final quoted ask.'],
    example:['Ask 100 shares at $100.01 and 200 at $100.02. Buy 250 shares: fill 100 at $100.01 and 150 at $100.02.','Total cost = $10,001+$15,003=$25,004. VWAP=$25,004/250=$100.016. The remaining displayed depth at $100.02 is 50 shares.'],
    contrast:'The displayed size may cancel before you reach the venue, and queue priority may differ by exchange; simulated full fills are not a guarantee.',
    task:'Asks: 80 @ $20.00, 120 @ $20.10. An incoming buy order requests 150. Compute total execution cost and VWAP.',
    hint:'Consume 80 at the first level and the remaining 70 at the second.',
    solution:'Cost=80×20+70×20.10=$3,007. VWAP=3007/150=$20.046666… per share.',
    source:'Avellaneda–Stoikov: limit order book and execution; Quant Interview Notes: market making.'
  },
  latency: {
    aim:'Explain why tail latency and execution quality matter more than a single average benchmark.',
    assumptions:'A delayed order can miss the quote or expose stale information in a changing market.',
    claim:'Total system latency is an end-to-end distribution, not merely the mean compute time of one component.',
    proof:['Decompose decision latency into market-data delivery, parsing, strategy, risk checks, order formation, network and exchange acceptance.','A slow path in any component can dominate high quantiles even when its mean is small.','For dependent stages, summing their individual p99 values is not generally equal to p99 of end-to-end latency; measure the actual path.'],
    example:['A service usually responds in 30μs but occasionally spends 2ms on allocation and garbage collection.','Its average can look acceptable while a small fraction of orders arrive after a rapidly moving quote has disappeared.'],
    contrast:'Microbenchmarking a function in isolation can miss cache contention, queues, burst arrivals, packet loss and downstream processing.',
    task:'A strategy’s stages take 15μs feed parsing, 25μs decision, 10μs risk checking and 50μs networking in one observed path. What is that path’s total latency?',
    hint:'Add the durations of this particular path; do not mistake it for a population p99.',
    solution:'15+25+10+50=100μs for that observed execution path. No p99 conclusion can be drawn from one observation.',
    source:'Quant Math Prerequisites: complexity and numerical reasoning; engineering context.'
  },
  markov: {
    aim:'Build Markov states that retain exactly the information needed to predict the next step.',
    assumptions:'Future transitions depend only on the current state, not additional unrecorded history.',
    claim:'For an absorbing Markov chain, hitting probabilities hᵢ satisfy hᵢ=Σⱼpᵢⱼhⱼ for transient states, with boundary values fixed at absorbing states.',
    proof:['Condition on the state of the next step. From i, transition to j with probability pᵢⱼ.','After reaching j, the probability of eventual success is hⱼ. Take the weighted average.','Assign h=1 at target states and h=0 at competing absorbing states, then solve the simultaneous system.'],
    example:['A gambler has $1 and repeatedly wins or loses $1 on a fair game, stopping at $0 or $3.','Let h₀=0 and h₃=1. Then h₁=(h₀+h₂)/2=h₂/2; h₂=(h₁+h₃)/2. Solve: h₁=1/3, h₂=2/3.'],
    contrast:'If order-book arrivals depend on unobserved queue pressure or recent order-flow history, a state containing price alone is not Markov.',
    task:'A two-step fair random walk starts at 1 with absorbing boundaries 0 and 2. What is P(reach 2 before 0)?',
    hint:'The first step necessarily hits one of the two boundaries.',
    solution:'With probability 1/2 the first step is up to 2; with probability 1/2 down to 0. Therefore h₁=1/2.',
    source:'Zhou: Chapter 5 Markov chains; Blitzstein–Hwang: Chapter 11.'
  },
  'avellaneda-stoikov': {
    aim:'Derive reservation-price intuition and distinguish model assumptions from real trading constraints.',
    assumptions:'Mid-price follows dS=σdW, terminal horizon T, constant risk-aversion γ>0, exponential utility and a simplified execution-intensity model.',
    claim:'The approximate inventory-adjusted reservation price is r=S−qγσ²(T−t). Positive inventory lowers the price at which a risk-averse dealer is indifferent.',
    proof:['Suppose the dealer ends with inventory q and cash x. For Brownian mid-price, S_T|S_t is normal with mean S_t and variance σ²(T−t).','Expected exponential utility of final wealth −exp[−γ(x+qS_T)] equals −exp[−γ(x+qS_t)+(γ²q²σ²(T−t))/2].','Compare utilities with q and q±1 units to obtain reservation bid/ask prices. Their midpoint is r=S_t−qγσ²(T−t).','Under an additional exponential order-arrival intensity assumption, a common approximate full spread is γσ²(T−t)+(2/γ)ln(1+γ/k). Quotes are centered at r.'],
    example:['With S=100, q=+4, γ=0.1, σ=2, remaining horizon 0.5, r=100−4×0.1×4×0.5=99.20.','If q=−4 instead, r=100.80. Inventory changes the preferred quoting center in opposite directions.'],
    contrast:'The formula is not an empirically calibrated or guaranteed profitable algorithm. It omits fees, queue position, adverse selection, tick size, market impact and changing volatility.',
    task:'Use S=100, q=−3, γ=0.2, σ=1, T−t=2. Compute the reservation price and explain its sign.',
    hint:'r=S−qγσ²τ. A negative inventory means short.',
    solution:'r=100−(−3×0.2×1×2)=101.20. The short dealer values acquiring inventory more highly, shifting reservation price above mid.',
    source:'Avellaneda & Stoikov (2008): Sections 2–3, inventory preference and simplified optimal quoting.'
  }
  };
  // Display equations are optional enhancements. The prose lecture works without external services.
  const F = {
    'number-sense':String.raw`W_n=W_0\prod_{i=1}^{n}(1+r_i),\qquad s=-\frac{r}{1+r}`,
    algebra:String.raw`\boldsymbol E=\boldsymbol 1+P\boldsymbol E\quad\Longrightarrow\quad (I-P)\boldsymbol E=\boldsymbol 1`,
    exponents:String.raw`\log(ab)=\log a+\log b,\qquad \log(1+x)=x-\frac{x^2}{2}+O(x^3)`,
    sequences:String.raw`\sum_{k=0}^{n-1}r^k=\frac{1-r^n}{1-r},\qquad\sum_{k=0}^{\infty}r^k=\frac1{1-r}\ (|r|<1)`,
    counting:String.raw`{n\choose k}=\frac{n!}{k!(n-k)!}`,
    trigonometry:String.raw`\boldsymbol u\cdot\boldsymbol v=\|\boldsymbol u\|\,\|\boldsymbol v\|\cos\theta`,
    'discrete-proofs':String.raw`P(0)\;\land\;\bigl(P(n)\Rightarrow P(n+1)\bigr)\;\Longrightarrow\;P(n)\ \forall n\ge 0`,
    calculus:String.raw`f(x+h)=f(x)+f'(x)h+o(h)`,
    integration:String.raw`\mathbb E[g(X)]=\int_{-\infty}^{\infty}g(x)f_X(x)\,dx`,
    'matrix-basics':String.raw`A\boldsymbol x=\boldsymbol b,\qquad\ker(A)=\{\boldsymbol0\}\quad\Longleftrightarrow\quad A\text{ invertible}`,
    multivariable:String.raw`f(\boldsymbol w)=\boldsymbol\mu^{\mathsf T}\boldsymbol w-\frac\lambda2\boldsymbol w^{\mathsf T}\Sigma\boldsymbol w,\quad\nabla f=\boldsymbol\mu-\lambda\Sigma\boldsymbol w`,
    'sampling-inference':String.raw`\operatorname{Var}(\bar X)=\frac{\sigma^2}{n},\qquad\operatorname{SE}(\bar X)=\frac\sigma{\sqrt n}`,
    'numerical-methods':String.raw`x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}`,
    events:String.raw`P(A\cup B)=P(A)+P(B)-P(A\cap B)`,
    'expected-value':String.raw`\mathbb E\!\left[\sum_{i=1}^{n}X_i\right]=\sum_{i=1}^{n}\mathbb E[X_i]`,
    indicators:String.raw`\mathbb E[\boldsymbol1_A]=P(A),\quad\mathbb E\!\left[\sum_i\boldsymbol1_{A_i}\right]=\sum_iP(A_i)`,
    conditional:String.raw`P(A\mid B)=\frac{P(A\cap B)}{P(B)}\quad(P(B)>0)`,
    bayes:String.raw`P(H_i\mid E)=\frac{P(E\mid H_i)P(H_i)}{\sum_jP(E\mid H_j)P(H_j)}`,
    recursive:String.raw`\begin{aligned}E_0&=1+\tfrac12E_0+\tfrac12E_1\\ E_1&=1+\tfrac12E_0\\ \Longrightarrow\ E_0&=6\end{aligned}`,
    symmetry:String.raw`P\!\left(X_i=\max_j X_j\right)=\frac1n\quad\text{(i.i.d. continuous)}`,
    stopping:String.raw`V_1(x)=\max\{x,\mathbb E[D]\},\qquad\mathbb E[V_1(D)]=4.25`,
    variance:String.raw`\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y)+2\operatorname{Cov}(X,Y)`,
    distributions:String.raw`P(N=k)=e^{-\lambda}\frac{\lambda^k}{k!},\qquad\mathbb E[N]=\operatorname{Var}(N)=\lambda`,
    correlation:String.raw`\rho_{X,Y}=\frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y},\qquad|\rho_{X,Y}|\le1`,
    inference:String.raw`t=\frac{\widehat\theta-\theta_0}{\widehat{\operatorname{SE}}(\widehat\theta)}`,
    regression:String.raw`\widehat\beta=\frac{\sum_i(x_i-\bar x)(y_i-\bar y)}{\sum_i(x_i-\bar x)^2},\qquad\widehat\alpha=\bar y-\widehat\beta\bar x`,
    'linear-algebra':String.raw`\operatorname{Var}(\boldsymbol w^{\mathsf T}\boldsymbol R)=\boldsymbol w^{\mathsf T}\Sigma\boldsymbol w\ge0`,
    optimization:String.raw`f(\boldsymbol y)\le f(\boldsymbol x)+\nabla f(\boldsymbol x)^{\mathsf T}(\boldsymbol y-\boldsymbol x)`,
    validation:String.raw`\text{Observed best backtest}=\max_{1\le i\le m}(\text{signal}_i+\text{noise}_i)`,
    'info-value':String.raw`\operatorname{EVPI}=\mathbb E[\max_a\operatorname{payoff}(a,\omega)]-\max_a\mathbb E[\operatorname{payoff}(a,\omega)]\ge0`,
    quoting:String.raw`\operatorname{P\&L}=\text{cash}+qS_{\mathrm{mark}}-\text{initial wealth}`, 
    orderbook:String.raw`\operatorname{VWAP}=\frac{\sum_j p_j q_j}{\sum_jq_j}`, 
    latency:String.raw`L_{\mathrm{end\ to\ end}}=L_{\mathrm{feed}}+L_{\mathrm{decision}}+L_{\mathrm{risk}}+L_{\mathrm{network}}+\cdots`,
    markov:String.raw`h_i=\sum_jp_{ij}h_j,\qquad h_{\mathrm{success}}=1,\quad h_{\mathrm{failure}}=0`,
    'avellaneda-stoikov':String.raw`r(s,q,t)=s-q\gamma\sigma^2(T-t)`
  };
  const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const p = s => `<p>${escapeHtml(s)}</p>`;
  function chapter(lesson){
    const n=L[lesson.id];
    if(!n) return `<section class="faculty-section reader-section" id="seminar"><h2>Faculty seminar.</h2><p>The extended lecture for this topic is being prepared. Use the foundational exposition and further reading below.</p></section>`;
    return `<section class="faculty-section reader-section" id="seminar">
      <div class="faculty-kicker">FACULTY SEMINAR · ORIGINAL LECTURE NOTES</div>
      <h2>From principle to <em>proof.</em></h2>
      <p class="faculty-objective"><strong>At the end of this lesson, you should be able to:</strong> ${escapeHtml(n.aim)}</p>
      <div class="faculty-claim"><div class="faculty-index">THEOREM / CENTRAL PRINCIPLE</div><p>${escapeHtml(n.claim)}</p>${F[lesson.id]?`<div class="faculty-equation" data-latex="${escapeHtml(F[lesson.id])}"><span>${escapeHtml(lesson.formula)}</span></div>`:''}<div class="faculty-assumptions"><strong>Assumptions:</strong> ${escapeHtml(n.assumptions)}</div></div>
      <div class="faculty-part"><h3>Derivation</h3><ol class="faculty-proof">${n.proof.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol></div>
      <div class="faculty-part"><h3>Worked example</h3>${n.example.map(p).join('')}</div>
      <div class="faculty-counterexample"><div class="faculty-index">WHEN INTUITION FAILS</div>${p(n.contrast)}</div>
      <div class="faculty-problem"><div class="faculty-index">INDEPENDENT PROBLEM · EXPLAIN EACH STEP</div><h3>${escapeHtml(n.task)}</h3><label class="sr-only" for="seminar-notes-${escapeHtml(lesson.id)}">Your reasoning notes</label><textarea class="seminar-notes" id="seminar-notes-${escapeHtml(lesson.id)}" data-seminar-note="${escapeHtml(lesson.id)}" placeholder="Set up the problem. State assumptions. Derive and check your answer. Your notes stay in this browser."></textarea><details class="faculty-hint"><summary>Need a hint?</summary>${p(n.hint)}</details><details class="faculty-solution"><summary>Compare with a worked solution</summary>${p(n.solution)}<p class="faculty-review">Self-review: Can you justify the model, every algebraic step and the final units? Can you explain why the tempting shortcut fails?</p></details></div>
      <p class="faculty-reference">Further reading: ${escapeHtml(n.source)} The notes are original and are not affiliated with any university.</p>
    </section>`;
  }
  function exists(id){return !!L[id];}
  function typeset(){if(!window.MathJax?.typesetPromise)return;const items=[...document.querySelectorAll('.faculty-equation[data-latex]:not([data-typeset])')];if(!items.length)return;items.forEach(x=>{x.textContent='\\['+x.dataset.latex+'\\]';x.dataset.typeset='yes';});window.MathJax.typesetPromise(items).catch(()=>{});}
  window.renderAxiomMath=typeset;
  return {chapter,exists,count:Object.keys(L).length,topics:Object.keys(L)};
})();
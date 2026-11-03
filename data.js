/* Axiom Quant Learning Lab — original, self-contained educational software.
   All curriculum, drills, visuals and persistence are local; no third-party APIs. */
'use strict';
const TRACKS = [
  {id:'math',title:'Mathematical fluency',sub:'Build the machinery before the probability',color:'#d6b990',short:'MATH'},
  {id:'prob',title:'Probability & decision theory',sub:'See the structures behind elite interview questions',color:'#92c9c2',short:'PROB'},
  {id:'stats',title:'Statistics & inference',sub:'Separate real signals from attractive noise',color:'#a6bad9',short:'STATS'},
  {id:'research',title:'Quantitative research',sub:'Understand model geometry, optimization and validation',color:'#c2b1cf',short:'RESEARCH'},
  {id:'market',title:'Trading & microstructure',sub:'Turn probability into quotations, risk and execution',color:'#deb58d',short:'TRADING'}
];
function L(id,title,track,scene,summary,idea,formula,recognize,trap,desk,example){return {id,title,track,scene,summary,idea,formula,recognize,trap,desk,example};}
const LESSONS = [
 L('number-sense','Arithmetic & number sense','math','bars','Percentages, fractions, mental calculations and rapid estimates.',
 'A fraction is a count relative to a whole. In trading interviews, convert it to a percentage and back without losing track of the base. Compound changes multiply rather than cancel.',
 'new = old × (1 + r₁) × (1 + r₂)', 'Percent, fraction, increase, decrease, magnitude', 'Up 20%, then down 20% is a net loss of 4%, not zero.', 'Price changes, win rates, conversion rates and risk limits.', '100 → 120 → 96: the return is −4%.'),
 L('algebra','Algebra & state equations','math','bars','Solve linear equations and small systems without friction.',
 'Unknown quantities become variables. Isolate one variable, or combine simultaneous equations to eliminate a variable. State equations in stochastic problems are just algebra in disguise.',
 'ax + b = c  ⇒  x = (c − b)/a','Solve, isolate, equilibrium, simultaneous equations', 'A recursive equation like E = 1 + ½E must be solved for E; it is not E = 1.', 'Expected waiting times, hedging constraints and quote adjustments.', 'E = 1 + 0.75E implies E = 4.'),
 L('exponents','Exponents & logarithms','math','surface','Understand powers, logs and compounding.',
 'Exponents turn repeated multiplication into a short expression. Logarithms reverse exponentiation; their algebra converts multiplicative growth into additive increments.',
 'aᵐaⁿ = aᵐ⁺ⁿ    ·    ln(eˣ) = x','Compounding, doubling, exponential rate, log-return', 'The log of a sum is not the sum of logs.', 'Log returns, likelihoods, latency growth and statistical models.', '2³ × 2⁴ = 2⁷ = 128.'),
 L('sequences','Series & asymptotics','math','bars','Sum repeated contributions and compare growth rates.',
 'Arithmetic series accumulate equal differences; geometric series accumulate repeated ratios. In recursive trading games, repeated survival creates a geometric pattern.',
 '1 + … + n = n(n+1)/2    ·    Σᵢ₌₀ⁿ⁻¹rⁱ = (1−rⁿ)/(1−r)','Sum, repeat, growth, complexity, geometric decay', 'Do not use the infinite geometric sum unless |r| < 1.', 'Expected repeated fees, queue processes and algorithmic scaling.', '1+2+…+20 = 210.'),
 L('counting','Combinatorics & counting','math','blocks','Count possible worlds without enumerating them.',
 'Ask whether order matters. Choose an unordered committee with combinations, assign distinct roles with permutations, and use complements for at-least-one questions.',
 'C(n,k) = n! / (k!(n−k)!)','Choose, arrange, without replacement, at least one', 'A team of three is not the same as three ordered job titles.', 'Card hands, occupancy, collisions and sampling designs.', 'From 10 people, choose 3: C(10,3) = 120.'),
 L('calculus','Calculus & marginal change','math','surface','Differentiate, find an optimum and read a curve.',
 'A derivative gives local change; an optimum often occurs where marginal benefit is zero. Check the curvature and any boundaries before declaring a maximum.',
 'd(ax² + bx)/dx = 2ax + b','Slope, sensitivity, maximize, first order, approximation', 'f′(x) = 0 alone does not prove a maximum.', 'Optimal quoting, risk budgeting and local price sensitivity.', 'f(x) = −x² + 8x is maximized at x = 4.'),
 L('events','Probability foundations','prob','bayes','Build sample spaces, complements and event unions.',
 'A probability is attached to a clearly defined event, not simply to whatever outcomes sound possible. Every event and its complement exhaust the sample space.',
 'P(A ∪ B) = P(A)+P(B)−P(A ∩ B)','At least one, either, both, exactly, independent', 'Mutually exclusive does not imply independent.', 'Trading event probabilities and option payoffs.', 'P(at least one head in 3 flips) = 87.5%.'),
 L('expected-value','Expected value & linearity','prob','payoff','Find the fair price of random payoffs quickly.',
 'Expectation is a probability-weighted average of payoffs, not necessarily a possible outcome. Linearity lets you sum expectations even when the variables are dependent.',
 'E[X] = Σₓ xP(X=x)   ·   E[X+Y] = E[X]+E[Y]','Fair price, average payoff, expected sum, EV', 'Do not enumerate a huge joint sample space for a simple expected sum.', 'Contract pricing, average PnL and trading-game values.', 'A fair six-sided die has E[X] = 3.5.'),
 L('indicators','Indicator variables','prob','blocks','Count events with one binary variable per item.',
 'Let Iᵢ be 1 if event i happens, 0 otherwise. Then E[Iᵢ] is just its probability. Sum indicators to get an expected count without solving the whole distribution.',
 'E[Σ Iᵢ] = Σ P(Iᵢ = 1)','Expected number of, matching pairs, fixed points', 'Indicators may be dependent: linearity still works.', 'Fill counts, collision estimates, portfolio event counts.', 'Expected number of matching pairs among 10 dice = C(10,2)/6 = 7.5.'),
 L('conditional','Conditional probability','prob','bayes','Shrink the sample space to the evidence.',
 'The word “given” changes which outcomes are still possible. Divide the worlds satisfying both events by all worlds satisfying the observation.',
 'P(A | B) = P(A ∩ B) / P(B)','Given that, known to be, after observing', 'Always change the denominator when evidence arrives.', 'Fills, news updates and selection effects.', 'Given a fair die is >3, P(even)=2/3.'),
 L('bayes','Bayes & base rates','prob','bayes','Reverse conditional probabilities without forgetting priors.',
 'Bayes evaluates every path that could produce the observed evidence. A rare category can remain unlikely after an apparently accurate positive signal.',
 'P(H|E) = P(E|H)P(H) / P(E)','Posterior, prior, evidence, test, inference', 'Do not divide by P(H); normalize by all ways evidence can happen.', 'Updating fair value after order flow and new information.', 'Two equally likely coins with P(H)=½ and ¾; observing H gives biased coin probability 60%.'),
 L('recursive','Recursive expectation','prob','paths','Turn “repeat until” into solvable state equations.',
 'Define the smallest state that contains everything needed for the next step. Write expected remaining cost as one step plus the weighted future-state values.',
 'Eₛ = 1 + Σⱼ P(s → j)Eⱼ','Repeat until, wait for, retry, partial reset', 'Waiting for HH takes 6 fair flips on average, not 1/P(HH)=4.', 'Queue survival, streaks, execution states and stopping times.', 'Wait for a six: E = 1 + (5/6)E ⇒ E=6.'),
 L('symmetry','Symmetry & exchangeability','prob','blocks','Avoid needless enumeration when labels are interchangeable.',
 'If n outcomes are exchangeable and exactly one has the property, each has probability 1/n. State clearly why symmetry actually applies.',
 'P(item i is unique maximum) = 1/n','Random order, first, maximum, identical', 'The argument fails when distributions are unequal or ties are possible.', 'Priority queues, random rankings and combinatorial puzzles.', 'Among five independent continuous identical draws, P(X₃ is largest)=20%.'),
 L('stopping','Stopping rules & optionality','prob','payoff','Price the right to continue or stop.',
 'Work backwards. At each decision compare the payoff you can lock in with the expected value of continuing, after fees and restrictions.',
 'stop if payoff ≥ continuation value','Reroll, accept/reject, optimal stopping, threshold', 'Compare to the value of the option, not to the unconditional average of every strategy.', 'Execution decisions, real options and trading games.', 'With a free die reroll, keep 4, 5, 6; game EV becomes 4.25.'),
 L('variance','Variance & risk scaling','stats','distribution','Understand dispersion separately from averages.',
 'Variance measures squared deviations around the mean. Scaling a position by a multiplies its variance by a². Independent risks add in variance, not in standard deviation.',
 'Var(aX+b)=a²Var(X)','Volatility, standard deviation, independent sums', 'Standard deviation does not scale by a²; variance does.', 'Portfolio risk, standard error and hedging.', 'Two independent positions with variances 4 and 9 sum to variance 13.'),
 L('distributions','Distributions & sampling','stats','distribution','Recognize the random model before calculating.',
 'Binomial models independent yes/no trials with fixed count. Poisson models counts in an interval. A normal distribution describes many symmetric bell-shaped quantities.',
 'Binomial: E=np, Var=np(1−p)   ·   Poisson: E=Var=λ','Trials, event count, normally distributed, geometric wait', 'Use binomial only when trials satisfy the assumptions.', 'Arrival counts, fill counts, event risks and sampling.', '100 Bernoulli trials with p=0.2 produce expected count 20.'),
 L('inference','Statistical inference','stats','distribution','Quantify uncertainty rather than trusting a noisy estimate.',
 'The sample standard deviation describes observations. Standard error describes uncertainty of an estimated mean and falls approximately with the square root of sample size.',
 'SE = s/√n    ·    t = (x̄−μ₀)/SE','Confidence interval, test statistic, p-value, uncertainty', 'A p-value is not the probability that the null hypothesis is true.', 'Evaluating a backtest signal and statistical significance.', 'With s=6 and n=900, SE=0.2.'),
 L('correlation','Covariance & diversification','stats','correlation','See joint movement as a geometric shape.',
 'Correlation measures standardized linear association. Two assets can each have risk, yet a combination can reduce total risk when they do not move together.',
 'Cov(X,Y) = ρσₓσᵧ','Correlation, hedge, pairs, covariance, diversify','Zero correlation is not the same as independence.', 'Portfolio construction and hedging correlated exposures.', 'For equal unit-variance assets with correlation ρ, 50/50 portfolio variance is (1+ρ)/2.'),
 L('regression','Linear regression','stats','regression','Explain an outcome using a baseline, sensitivity and noise.',
 'A linear regression assigns a slope β to the explanatory variable, intercept α to its baseline, and residual ε to what remains unexplained. Test coefficients and validate outside the training period.',
 'Y = α + βX + ε','Regression, sensitivity, beta, R², fitted line', 'High in-sample R² does not prove causality or profitability.', 'Market beta, alpha estimation and factor models.', 'β = 0.6 and a market move of 2% imply a 1.2% market component.'),
 L('linear-algebra','Linear algebra & covariance','research','correlation','Think in vectors, matrix transformations and risk directions.',
 'A dot product collects weighted contributions. A covariance matrix transforms portfolio weights into total risk. Eigenvectors are special directions preserved by a linear transformation.',
 'a·b = Σ aᵢbᵢ    ·    Var(portfolio) = wᵀΣw','Vector, matrix, covariance, eigenvector', 'Matrix dimensions must agree before multiplying.', 'Factor exposures, PCA and portfolio risk.', '(2,3)·(4,5) = 23.'),
 L('optimization','Optimization & constraints','research','surface','Find the best allowable decision, not just any stationary point.',
 'A constrained optimization trades reward against cost while obeying restrictions. Derivatives locate candidates; boundaries and feasibility determine the real optimum.',
 'maxₓ [ax−bx²] at x=a/(2b)','Maximize, constrained, Lagrange, risk penalty', 'Ignoring trading or leverage constraints produces unusable optima.', 'Position sizing, hedge weights and market-making objectives.', 'Max 8x−2x² gives x=2.'),
 L('validation','Backtest validation & leakage','research','regression','Test whether an apparent edge survives honest evaluation.',
 'Research should separate fitting from evaluation. Many tested strategies create false discoveries by chance, especially if test information leaks into training.',
 'E[false positives] = tests × significance level','Backtest, p-hacking, train/test, look-ahead, multiple testing', 'A lucky in-sample t-stat is not an out-of-sample edge.', 'Research design, signal screening and trading cost controls.', '1,000 null strategies at 1% significance produce ~10 false positives.'),
 L('info-value','Value of information','market','bayes','Put a price on better evidence.',
 'With information you can adapt the action to the state. Compare the expected payoff of the best contingent decision with the expected payoff of your best uninformed choice.',
 'VOI = E[best payoff after info] − best E[payoff before info]','Reveal, peek, information, informed choice', 'Do not average all choices: pick the best one in each state.', 'Research signals, data subscriptions and adverse selection.', 'Sure $6 versus a 50% chance of $12: perfect information is worth $3.'),
 L('quoting','Market making & inventory','market','orderbook','Quote bid and ask while managing information risk.',
 'The bid is what you pay to buy and the ask what you charge to sell. Spread compensates inventory, adverse selection, costs and risk. New evidence updates fair value; inventory shifts quote preferences.',
 'spread = ask − bid    ·    fair value = P(event) × payoff','Quote, spread, fair value, informed fill', 'Inventory skew and a change in fair value are different causes of a quote shift.', 'Market making in prediction contracts and listed securities.', 'A 100-payout event with 40% probability has fair value 40.'),
 L('orderbook','Order books & imbalance','market','orderbook','Interpret bids, asks, depth, queues and adverse selection.',
 'An order book displays resting buy and sell interest at each price. Price-time priority makes queue position valuable. Depth imbalance can summarize buy/sell pressure, but is not a guaranteed signal.',
 'mid = (best bid + best ask)/2','Depth, bid, ask, spread, price-time priority', 'Displayed quantity does not guarantee execution or true buying pressure.', 'Execution algorithms, market impact and quote placement.', 'Bid 99.98, ask 100.02 ⇒ mid 100.00.'),
 L('latency','Latency & HFT systems','market','orderbook','Connect speed, correctness and microstructure.',
 'High-frequency systems measure end-to-end latency distributions, not only averages. At very low delays, network paths, CPU caches, allocation and concurrency become part of the trading problem.',
 'p99 latency = 99th percentile of observed delays','Nanosecond, microsecond, p99, tick-to-trade', 'A better average can hide a worse latency tail.', 'Network event processing, order gateways and matching engines.', '2,500 ns = 2.5 μs.')
];
const TOPIC = Object.fromEntries(LESSONS.map(x=>[x.id,x]));
const TRACKLESSONS = id => LESSONS.filter(l=>l.track===id);
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[rand(0,a.length-1)];
const round=(x,n=2)=>Number(x.toFixed(n));
const choose=(n,k)=>{let z=1;for(let i=1;i<=k;i++)z=z*(n-i+1)/i;return Math.round(z);};
function numeric(question,answer,why,skill='Calculation',unit='number') {return {question,answer:round(answer,5),why,skill,unit,type:'number'};}
function multi(question,options,answer,why,skill='Concept') {return {question,options,answer,why,skill,type:'choice'};}
const BANK={
 'number-sense':[
  ()=>{let d=pick([4,5,8,10,20]),n=rand(1,d-1);return numeric(`Convert ${n}/${d} to a percentage.`,100*n/d,`Divide ${n} by ${d}, then multiply by 100.`, 'Fraction conversion','percent');},
  ()=>{let p=pick([10,15,20,25,30]);return numeric(`A price rises ${p}% and then falls ${p}%. What is its TOTAL percentage change? (negative if a loss)`, -p*p/100,`(1+${p}/100)(1−${p}/100)−1 = −(${p}/100)².`, 'Compound percentages','percent');},
  ()=>{let a=rand(12,29),b=pick([11,12,15]);return numeric(`Calculate ${a} × ${b} mentally.`,a*b,`Break ${b} into easy parts: ${a}×(${b}−10) + ${a}×10.`, 'Mental multiplication');}
 ],
 algebra:[
  ()=>{let a=rand(2,7),x=rand(2,12),b=rand(2,15);return numeric(`Solve for x: ${a}x + ${b} = ${a*x+b}.`,x,`Subtract ${b}, then divide by ${a}.`, 'Linear equation');},
  ()=>{let x=rand(2,12),y=rand(1,8);return numeric(`Solve the system: x + y = ${x+y}; x − y = ${x-y}. What is x?`,x,'Add the equations to cancel y, then divide the result by 2.','System of equations');},
  ()=>{let a=rand(2,5),b=rand(3,10),x=rand(2,9);return numeric(`If ${a}E = ${a*x+b} − ${b}, what is E?`,x,'Simplify the right-hand side, then divide by the coefficient of E.','Rearrangement');}
 ],
 exponents:[
  ()=>{let a=rand(1,5),b=rand(1,5);return numeric(`Calculate 2^${a} × 2^${b}.`,2**(a+b),'Add exponents with the same base.','Exponent rules');},
  ()=>{let a=rand(2,8);return numeric(`If e^x = e^${a}, what is x?`,a,'Apply ln to both sides: ln(e^x) = x.','Logarithms');},
  ()=>{let a=rand(2,4),b=rand(2,4);return numeric(`Calculate ${a}^${b}.`,a**b,'Multiply the base by itself the given number of times.','Powers');}
 ],
 sequences:[
  ()=>{let n=rand(12,85);return numeric(`Compute 1 + 2 + ... + ${n}.`,n*(n+1)/2,'Use n(n+1)/2 rather than adding terms individually.','Arithmetic series');},
  ()=>{let n=rand(3,7);return numeric(`Find the sum: 1 + 1/2 + 1/4 + ... for ${n} terms.`,2*(1-.5**n),'Finite geometric series: (1−r^n)/(1−r), here r=1/2.','Geometric series');},
  ()=>{let n=rand(5,18);return numeric(`How many pairs (i,j) satisfy 1 ≤ i < j ≤ ${n}?`,n*(n-1)/2,'This is the number of unordered distinct pairs, C(n,2).','Counting via sums');}
 ],
 counting:[
  ()=>{let n=rand(7,13),k=pick([2,3,4]);return numeric(`From ${n} people, choose an unordered team of ${k}. How many choices?`,choose(n,k),`Use combinations C(${n},${k}). Order does not matter.`,'Combinations');},
  ()=>{let n=rand(6,14);return numeric(`From ${n} distinct applicants, assign two DIFFERENT jobs (lead and deputy). How many assignments?`,n*(n-1),'Choose the lead, then a different deputy: n(n−1).','Permutations');},
  ()=>{let n=rand(4,8);return numeric(`How many different orders of ${n} distinct objects exist?`,Array.from({length:n},(_,i)=>i+1).reduce((a,b)=>a*b,1),'The number of permutations is n!.','Factorials');}
 ],
 calculus:[
  ()=>{let a=rand(1,4),b=rand(1,9),x=rand(2,7);return numeric(`For f(x) = ${a}x² + ${b}x, find f′(${x}).`,2*a*x+b,'Differentiate to 2ax+b and substitute the chosen x.','Derivatives');},
  ()=>{let h=rand(2,10),c=rand(5,18);return numeric(`At what x is f(x) = −(x − ${h})² + ${c} maximized?`,h,'The negative square reaches its maximum when the square is zero.','Optimization');},
  ()=>{let a=rand(1,6),n=rand(1,4);return numeric(`If f(x) = ${a}x^${n+1}, what is f′(1)?`,a*(n+1),'Power rule: d(ax^k)/dx = akx^(k−1).','Power rule');}
 ],
 events:[
  ()=>{let n=rand(2,6);return numeric(`Flip a fair coin ${n} times. What is P(at least one head), as a percentage?`,100*(1-.5**n),'Use the complement: 1−P(no heads).','Complement','percent');},
  ()=>{let a=rand(3,5),b=rand(3,5),inter=rand(1,Math.min(a,b)-1);return numeric(`P(A)=${a*10}%, P(B)=${b*10}%, P(A and B)=${inter*10}%. Find P(A or B), as a percentage.`,(a+b-inter)*10,'Add probabilities and subtract overlap once.','Union','percent');},
  ()=>multi('Which relationship defines independence of events A and B?',['P(A∩B)=P(A)P(B)','P(A∩B)=0','P(A)=P(B)'],'P(A∩B)=P(A)P(B)','Independent events multiply; mutual exclusion means zero intersection.','Independence')
 ],
 'expected-value':[
  ()=>{let n=pick([4,6,8,10,12]);return numeric(`A fair ${n}-sided die pays the rolled number in dollars. What is the fair expected payout?`,(n+1)/2,'Average the equally likely payoffs 1 through n.','Fair value','dollars');},
  ()=>{let p=pick([20,25,40,50,60,75]),w=pick([8,12,16,20,40]);return numeric(`A game pays $${w} with probability ${p}%, otherwise $0. What is EV in dollars?`,w*p/100,`EV = (${p}/100)×${w} + (1−${p}/100)×0.`,'Weighted payoff','dollars');},
  ()=>{let n=rand(15,90);return numeric(`Roll ${n} fair six-sided dice. What is the expected TOTAL of all faces?`,n*3.5,'Each die has expectation 3.5. Use linearity, no independence calculation needed.','Linearity');}
 ],
 indicators:[
  ()=>{let n=pick([24,30,36,48,60]);return numeric(`Roll ${n} fair six-sided dice. Expected number that show a six?`,n/6,'One success indicator per die; E[sum]=n×(1/6).','Indicator count');},
  ()=>{let n=rand(5,16),f=pick([4,6,8]);return numeric(`Roll ${n} independent fair ${f}-sided dice. Expected number of matching UNORDERED pairs?`,choose(n,2)/f,`There are C(${n},2) pairs and each matches with probability 1/${f}.`,'Matching pairs');},
  ()=>{let n=pick([15,25,40,60]);return numeric(`${n} hats are randomly assigned to their ${n} owners. Expected number of correct assignments?`,1,'Each person has probability 1/n of getting their own hat, so n×(1/n)=1.','Fixed points');}
 ],
 conditional:[
  ()=>{let k=rand(1,4),nums=Array.from({length:6-k},(_,i)=>k+i+1),evens=nums.filter(x=>x%2===0).length;return numeric(`A fair six-sided die is known to show >${k}. What is P(even), as a percentage?`,100*evens/nums.length,`Allowed faces are ${nums.join(', ')}. ${evens} are even.`,'Restricted sample space','percent');},
  ()=>{let red=rand(4,12),blue=rand(4,12);return numeric(`A bag contains ${red} red and ${blue} blue balls. Draw 2 without replacement. Given the first was red, what is P(second is red), as a percentage?`,100*(red-1)/(red+blue-1),'After the first red, both the numerator and denominator decrease by one.','Sampling without replacement','percent');},
  ()=>multi('After observing event B, how should you calculate P(A|B)?',['P(A∩B)/P(B)','P(A∩B)/P(A)','P(A)+P(B)'],'P(A∩B)/P(B)','Conditioning renormalizes to the outcomes where B occurred.','Conditional definition')
 ],
 bayes:[
  ()=>{let bp=pick([60,70,75,80,90]);return numeric(`Choose equally likely between a fair coin and a coin with P(heads)=${bp}%. You see heads. Probability it was the biased coin, in percent?`,100*bp/(50+bp),'Likelihood × prior, divided by evidence likelihood summed across both coins.','Bayes coins','percent');},
  ()=>{let p=pick([5,10,20]),sens=pick([80,90,95]),spec=pick([85,90,95]);return numeric(`A condition affects ${p}% of people. Test sensitivity ${sens}%, specificity ${spec}%. If positive, what is P(condition), in percent?`,100*(p*sens)/(p*sens+(100-p)*(100-spec)),`Count true positives ${p}×${sens} and false positives ${100-p}×${100-spec} on the same scale; normalize.`,'Base-rate Bayes','percent');},
  ()=>multi('What is the correct denominator in Bayes’ rule P(H|E)?',['P(E), all paths to the evidence','P(H), the prior','P(E|H), the likelihood'],'P(E), all paths to the evidence','The normalizer must include every hypothesis that could create the evidence.','Evidence normalizer')
 ],
 recursive:[
  ()=>{let k=rand(3,14);return numeric(`Independent trials succeed with probability 1/${k}. Expected trials until first success?`,k,'E=1+(1−p)E ⇒ E=1/p.','Geometric waiting');},
  ()=>{let n=pick([2,3,4]);return numeric(`Fair coin flipped until ${n} CONSECUTIVE heads. Expected flips?`,2**(n+1)-2,'Set states for your current heads streak. For a fair coin, E(k heads in a row) = 2^(k+1)−2.','Pattern waiting');},
  ()=>{let p=pick([25,40,50,60]);return numeric(`Each attempt succeeds with probability ${p}%. On failure restart. Expected attempts?`,100/p,'Solve E = 1 + (1−p)E.','Restart equation');}
 ],
 symmetry:[
  ()=>{let n=pick([4,5,8,10,20]);return numeric(`Draw ${n} i.i.d. continuous values. P(the FIRST is the unique maximum), as a percentage?`,100/n,'All n positions are exchangeable and ties have probability zero.','Unique maximum','percent');},
  ()=>{let a=rand(1,20),b=a+rand(1,10);return numeric(`In a uniformly random permutation, P(label ${a} occurs before label ${b}), as a percentage?`,50,'Swapping the labels pairs every favorable order with one unfavorable order.','Ordering symmetry','percent');},
  ()=>{let n=pick([5,8,10,16]);return numeric(`From ${n} exchangeable individuals, one is uniformly selected to win. Chance a specific named person wins, in percent?`,100/n,'Each of n symmetric labels occupies the single winning position with probability 1/n.','Uniform symmetry','percent');}
 ],
 stopping:[
  ()=>{let n=pick([4,6,8,10]);return numeric(`Fair ${n}-sided die. You may reroll once, free, but must accept the next roll. What is the SMALLEST current face you should KEEP?`,Math.ceil((n+1)/2),'Compare the current face to the expected value of the forced final roll.','Optimal stopping threshold');},
  ()=>{let n=pick([4,6,8]);let ev=(n+1)/2,optimal=Array.from({length:n},(_,i)=>Math.max(i+1,ev)).reduce((a,b)=>a+b,0)/n;return numeric(`Fair ${n}-sided die with ONE free reroll. What is the optimal expected payout (dollars)?`,optimal,'For each first roll x, take max(x, the reroll EV) and average over all first rolls.','Option value','dollars');},
  ()=>{let fee=pick([0,1,2]),reroll=3.5-fee;return numeric(`Fair six-sided die. You can reroll once at a cost of $${fee}, accepting the next roll. Smallest face you should KEEP?`,Math.ceil(reroll),'Keep if current face ≥ reroll EV minus fee. Ties may also be kept.','Stopping with cost');}
 ],
 variance:[
  ()=>{let a=rand(2,5),v=pick([2,3,4,6,9]);return numeric(`Var(X)=${v}. What is Var(${a}X + 7)?`,a*a*v,'A constant adds zero variance; the scale factor is squared.','Variance scaling');},
  ()=>{let x=rand(2,15),y=rand(2,15);return numeric(`Independent X,Y have variances ${x} and ${y}. Find Var(X+Y).`,x+y,'For independent variables, the covariance term vanishes.','Independent sums');},
  ()=>{let s=rand(2,7);return numeric(`A distribution has variance ${s*s}. What is its standard deviation?`,s,'Standard deviation is the nonnegative square root of variance.','Standard deviation');}
 ],
 distributions:[
  ()=>{let n=pick([20,50,100,200]),p=pick([10,20,25,50]);return numeric(`X~Binomial(n=${n}, p=${p}%). Find E[X].`,n*p/100,'The mean of Binomial(n,p) is np.','Binomial mean');},
  ()=>{let l=rand(2,18);return numeric(`X~Poisson(λ=${l}). Find Var(X).`,l,'A Poisson random variable has mean and variance both equal to λ.','Poisson variance');},
  ()=>{let n=pick([20,50,100]),p=pick([20,40,50]);return numeric(`X~Binomial(n=${n}, p=${p}%). Find Var(X).`,n*p/100*(1-p/100),'Binomial variance is np(1−p).','Binomial variance');}
 ],
 inference:[
  ()=>{let s=pick([2,4,6,8]),n=pick([25,100,400]);return numeric(`Sample standard deviation s=${s}, sample size n=${n}. Standard error of mean?`,s/Math.sqrt(n),'SE = s/√n, not s/n.','Standard error');},
  ()=>{let se=pick([.1,.2,.25,.5]),t=pick([2,3,4,5]);return numeric(`An estimated mean is ${round(se*t,3)}, with standard error ${se}. What is its t-statistic against zero?`,t,'t=(estimate−0)/SE.','t-statistic');},
  ()=>{let mu=rand(5,20)/10,se=pick([.1,.2,.3]);return numeric(`An estimate is ${round(mu,2)} with SE=${se}. Approximate the UPPER endpoint of a 95% CI using ±2SE.`,mu+2*se,'Upper endpoint is estimated mean + 2×SE.','Confidence interval');}
 ],
 correlation:[
  ()=>{let r=pick([-.5,0,.25,.5,.75,1]),a=pick([2,3,4]),b=pick([2,3,5]);return numeric(`Corr(X,Y)=${r}, SD(X)=${a}, SD(Y)=${b}. Find Cov(X,Y).`,r*a*b,'Cov=correlation×both standard deviations.','Covariance');},
  ()=>{let r=pick([-1,-.5,0,.5,1]);return numeric(`Two assets each have variance 1 and correlation ${r}. A 50/50 portfolio has what variance?`,(1+r)/2,'Var(.5X+.5Y)=.25Var(X)+.25Var(Y)+.5Cov(X,Y).','Diversification');},
  ()=>multi('Does zero correlation between two random variables guarantee independence?',['No, except under additional assumptions','Yes, always','Only when their variances are zero'],'No, except under additional assumptions','Correlation only measures linear association.','Correlation trap')
 ],
 regression:[
  ()=>{let beta=pick([.4,.6,.8,1.2,1.5]),m=pick([2,3,4]);return numeric(`Market beta=${beta}. Market return=${m}%. What is the beta-related predicted return, in percent?`,beta*m,'Multiply β by the market return. This is a component, not necessarily the whole stock return.','Beta sensitivity','percent');},
  ()=>{let alpha=rand(1,5),beta=rand(2,6),x=rand(2,8);return numeric(`Regression Ŷ = ${alpha} + ${beta}X. What is predicted Ŷ when X=${x}?`,alpha+beta*x,'Substitute X into intercept + slope×input.','Prediction');},
  ()=>multi('Which claim about a high in-sample regression R² is justified?',['It explains a large fraction of in-sample variation','It proves a profitable trading signal','It proves a causal relationship'],'It explains a large fraction of in-sample variation','In-sample fit alone says nothing decisive about causality or future performance.','Interpretation')
 ],
 'linear-algebra':[
  ()=>{let a=rand(1,7),b=rand(1,7),c=rand(1,7),d=rand(1,7);return numeric(`Find dot product (${a}, ${b}) · (${c}, ${d}).`,a*c+b*d,'Multiply corresponding coordinates and sum.','Dot product');},
  ()=>{let a=rand(1,4),b=rand(1,5),x=rand(1,5),y=rand(1,5);return numeric(`For matrix first row [${a}, ${b}] and vector [${x}, ${y}]ᵀ, what is the FIRST coordinate of Av?`,a*x+b*y,'Row-by-column dot product.','Matrix-vector product');},
  ()=>multi('What property must a covariance matrix Σ satisfy?',['wᵀΣw ≥ 0 for every real vector w','All off-diagonal entries are positive','Every eigenvalue is negative'],'wᵀΣw ≥ 0 for every real vector w','A portfolio variance cannot be negative.','Positive semidefinite')
 ],
 optimization:[
  ()=>{let a=rand(4,14)*2,b=pick([1,2,4]);return numeric(`Maximize f(x) = ${a}x − ${b}x². What is the optimal x?`,a/(2*b),'Differentiate: a−2bx=0. The quadratic is concave when b>0.','Quadratic optimum');},
  ()=>{let h=rand(2,8);return numeric(`Maximize −(x−${h})² subject to 0≤x≤10. Find optimal x.`,h,'The unconstrained optimum is feasible, so choose the vertex.','Constraint check');},
  ()=>multi('Which order is sound for a constrained optimization problem?',['Find candidate optima, then check feasibility and boundaries','Ignore constraints until after placing a trade','Assume every stationary point is a maximum'],'Find candidate optima, then check feasibility and boundaries','Unconstrained critical points are not always valid or optimal.','Feasibility')
 ],
 validation:[
  ()=>{let n=pick([100,200,500,1000]),p=pick([1,2,5]);return numeric(`You test ${n} NULL strategies at significance ${p}%. Expected false positives?`,n*p/100,'Multiply number of independent or individually calibrated tests by their nominal false positive rate; expectation does not require independence.','Multiple testing');},
  ()=>multi('Which evaluation is safer for a chronological trading strategy?',['Fit on older data, evaluate later data without leakage','Randomly mix all future and past labels into features','Pick the strongest model using the final test set'],'Fit on older data, evaluate later data without leakage','Keep genuinely unseen future-like data out of model selection.','Out-of-sample validation'),
  ()=>multi('A huge in-sample t-statistic is observed after thousands of model searches. What is the main concern?',['Selection bias and multiple testing','The strategy must be risk-free','Large t-values never occur by luck'],'Selection bias and multiple testing','The search itself raises the chance of impressive false discoveries.','Research skepticism')
 ],
 'info-value':[
  ()=>{let c=pick([4,6,8,10]),p=pick([.25,.5,.75]),u=c*2;let withInfo=p*Math.max(u,c)+(1-p)*c,without=Math.max(c,p*u);return numeric(`Choice A pays $${c} for sure. Choice B pays $${u} with probability ${p*100}%, else $0. What is the value of PERFECT information, in dollars?`,withInfo-without,'With info choose B in the good state, A in the bad; subtract the better uninformed EV.','Perfect information');},
  ()=>multi('Before information arrives, which payoff belongs in the value-of-information baseline?',['The better of the available expected payoffs','The average of all available expected payoffs','The worst available expected payoff'],'The better of the available expected payoffs','You actively choose your best option even before learning the signal.','Decision baseline'),
  ()=>{let p=pick([25,40,50,60]),win=pick([10,20,50]);return numeric(`Knowing a binary event with probability ${p}% pays $${win} if it occurs and $0 otherwise. What is expected value of the payout?`,p*win/100,'Without conditional decisions this is just weighted payout EV.','Value baseline');}
 ],
 quoting:[
  ()=>{let payoff=pick([20,50,100]),p=pick([20,30,40,60,75]);return numeric(`A contract pays ${payoff} if an event occurs, otherwise zero. Event probability ${p}%. Fair value?`,payoff*p/100,'Fair value = probability × conditional payoff.','Event fair value');},
  ()=>{let bid=rand(90,120),spread=pick([.02,.04,.05,.10,.20]);return numeric(`You quote bid ${bid.toFixed(2)} and ask ${(bid+spread).toFixed(2)}. Spread?`,spread,'Ask minus bid.','Bid-ask spread');},
  ()=>multi('A market maker gets unexpectedly long inventory. Which quote shift generally helps reduce it?',['Shift both quotes lower to encourage selling inventory','Shift both quotes higher to encourage buying more','Increase fundamental fair value without new evidence'],'Shift both quotes lower to encourage selling inventory','Long inventory increases the desire to sell, even if the fair value estimate did not change.','Inventory skew')
 ],
 orderbook:[
  ()=>{let mid=rand(80,130),s=pick([.02,.04,.06,.1]);return numeric(`Best bid ${(mid-s/2).toFixed(2)}, best ask ${(mid+s/2).toFixed(2)}. Midprice?`,mid,'Mid = average of best bid and best ask.','Midprice');},
  ()=>{let b=pick([100,200,300,400]),a=pick([100,200,300,400]);return numeric(`Top-of-book bid size=${b}, ask size=${a}. Bid-side share of total displayed size, in percent?`,100*b/(a+b),'Bid size divided by bid+ask total.','Depth imbalance','percent');},
  ()=>multi('Under price-time priority, two orders at the SAME price are usually ranked by:',['Earlier arrival first','Larger order size first','Higher account balance first'],'Earlier arrival first','At the same price, earlier resting orders generally have queue priority.','Queue position')
 ],
 latency:[
  ()=>{let ns=pick([1200,1500,2500,4000,7500]);return numeric(`Convert ${ns} nanoseconds to microseconds.`,ns/1000,'One microsecond contains 1,000 nanoseconds.','Time units','microseconds');},
  ()=>{let old=pick([20,40,60,80]),p=pick([25,50,75]),newVal=old*(1-p/100);return numeric(`Latency drops from ${old} μs to ${newVal} μs. What is the percentage reduction?`,p,'Reduction = (old−new)/old ×100.','Latency improvement','percent');},
  ()=>multi('Which statistic best exposes unusually slow tail events in tick-to-trade time?',['p99 latency','Average alone','Mean order size'],'p99 latency','Averages can hide rare but serious slow paths.','Latency tails')
 ]
};

// ---- persistence and mastery state ----
// Additional original lessons informed by the math prerequisite map, Zhou's
// interview taxonomy, Blitzstein–Hwang and Avellaneda–Stoikov (2008).
const EXTRA_LESSONS = [
 L('trigonometry','Trigonometry & vectors','math','surface','Angles, unit circles and projections without memorization anxiety.',
 'Sine and cosine are the two coordinates of a rotating unit vector. Dot products measure alignment: the projection of one vector onto another depends on cosine of their angle.',
 'sin²θ + cos²θ = 1 · a·b = ‖a‖ ‖b‖ cosθ','Rotation, angle, direction, projection','Angles in formulas are normally in radians, not degrees.','Correlations, vector similarity and phase in time series.','For θ = 60°, cos θ = 1/2.'),
 L('integration','Integrals & continuous expectations','math','distribution','Move from discrete sums to areas and expectations.',
 'An integral accumulates infinitely many tiny contributions. With a probability density, integrate outcome times density to obtain expectation. Density is not itself a probability.',
 'E[X] = ∫ x f(x) dx · ∫ₐᵇ f(x) dx = 1','Area, continuous random variable, mean, density','A probability density may exceed 1; its total area must be 1.','Continuous payoffs, expected shortfall and option pricing.','For X uniform on [0,2], E[X] = 1.'),
 L('matrix-basics','Matrices & linear transformations','math','correlation','Turn vectors into systems, risk maps and changing coordinate frames.',
 'A matrix transforms vectors by combining input coordinates. Matrix multiplication is composition of transformations. Check shapes before multiplying and distinguish a transformation from its inverse.',
 'A ∈ ℝᵐˣⁿ, x ∈ ℝⁿ ⇒ Ax ∈ ℝᵐ','Matrix product, linear system, rank, transpose','Matrix multiplication is not generally commutative.','Factor risk, regressions, covariance and order-flow state estimates.','A 2×3 matrix times a 3×1 vector produces a 2×1 vector.'),
 L('multivariable','Gradients & constrained optimization','math','surface','Understand curvature and how multiple parameters move the answer.',
 'Each partial derivative measures sensitivity to one variable. Together the gradient points toward steepest local increase; a Hessian measures curvature. Constraints limit which improvements are feasible.',
 '∇f = (∂f/∂x, ∂f/∂y) · ∇f = λ∇g at constrained optima','Gradient, Hessian, maximum, constraint','Setting the gradient to zero alone does not establish the global optimum.','Portfolio weights and simultaneous market-making parameters.','For f(x,y)=x²+2y², ∇f(2,3)=(4,12).'),
 L('discrete-proofs','Logic, invariants & induction','math','paths','Prove why a strategy always works, not just why one example works.',
 'Induction proves a statement for all natural numbers via a base case and an inductive step. Invariants remain unchanged after every valid operation and can rule out impossible states.',
 'P(1) ∧ (P(n) ⇒ P(n+1)) ⇒ P(n) for all n≥1','Prove, impossible, invariant, induction, parity','Checking many examples is evidence, not a general proof.','Algorithm correctness, brainteasers and state machines.','The sum of the first n positive integers is n(n+1)/2.'),
 L('sampling-inference','Sampling & statistical inference','math','distribution','Estimate a mean, its uncertainty, and distinguish signal from luck.',
 'A sample mean varies across independent experiments. Standard error describes that variation, shrinking approximately like the inverse square root of sample size under standard assumptions.',
 'SE(x̄)=s/√n · t=(x̄−μ₀)/SE(x̄)','Sample mean, confidence interval, t-test, significance','A p-value is not the probability the null hypothesis is true.','Evaluating strategy alpha under measurement noise.','If s=8 and n=64, estimated SE=1.'),
 L('numerical-methods','Numerical methods & approximation','math','surface','Find roots and approximate curves when no closed form is available.',
 'Newton iteration follows the tangent line to a nearby root. Numerical methods require convergence checks, sensible initialization and attention to floating-point error.',
 'xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)','Approximate, solve numerically, tolerance','Newton iteration can diverge from an unsuitable starting value.','Calibration, implied volatility and execution optimizers.','One Newton step for √2 from x=1.5 gives approximately 1.4167.'),
 L('markov','Markov chains & absorption','market','paths','Follow state transitions, absorption and waiting times.',
 'A Markov chain models the next state from the present one. Absorbing chains describe queue depletion, game endings and risk limits. Transition matrices must have nonnegative entries and rows summing to one.',
 'P(Xₜ₊₁=j | Xₜ=i)=Pᵢⱼ · Σⱼ Pᵢⱼ=1','Transition, state, random walk, absorption','The current state must include all information needed for the next step.','LOB queues, spread regimes and event-driven strategies.','If the probability of remaining in a state is 0.75, its expected dwell time is 4 steps.'),
 L('avellaneda-stoikov','Inventory-aware market making','market','orderbook','See how inventory, volatility and risk aversion reshape live quotes.',
 'The Avellaneda–Stoikov model separates a dealer’s subjective reservation price from the chosen spread. A long position pushes the reservation price below mid; greater volatility or risk aversion magnifies the adjustment. The common closed-form spread is an approximation under specific model assumptions.',
 'r = S − qγσ²τ · spread ≈ γσ²τ + (2/γ)ln(1 + γ/k)','Reservation price, skew, gamma, inventory, execution intensity','These quotes are model-based, not predictions or guaranteed profitable market prices.','Inventory control and risk-sensitive market making.','With S=100, q=+2, γ=0.1, σ=2, τ=1, the reservation price is 99.2.')
];
LESSONS.push(...EXTRA_LESSONS);
BANK.trigonometry=[
 ()=>{let t=pick([0,60,90,180]);let a={0:1,60:.5,90:0,180:-1}[t];return numeric(`What is cos(${t}°)?`,a,'Use the unit circle: cos is the horizontal coordinate of the rotated point.','Unit circle');},
 ()=>{let a=rand(1,6),b=rand(1,6),c=rand(1,6),d=rand(1,6);return numeric(`Find the dot product (${a}, ${b}) · (${c}, ${d}).`,a*c+b*d,'Multiply corresponding coordinates and sum.','Dot product');},
 ()=>multi('Which statement is correct for any angle θ?',['sin²θ+cos²θ=1','sinθ+cosθ=1','sinθ cosθ=1'],'sin²θ+cos²θ=1','This identity follows from the unit circle.','Identity')
];
BANK.integration=[
 ()=>{let b=rand(2,9);return numeric(`For X uniformly distributed on [0, ${b}], what is E[X]?`,b/2,'The uniform mean is the midpoint of the interval.','Continuous expectation');},
 ()=>{let n=rand(1,4),b=rand(1,4);return numeric(`Evaluate ∫ from 0 to ${b} of x^${n} dx.`,b**(n+1)/(n+1),'Integrate to x^(n+1)/(n+1) and apply the bounds.','Power integration');},
 ()=>multi('What makes a valid probability density f?',['f(x)≥0 and total integral = 1','f(x)≤1 everywhere','f(x) must be bell-shaped'],'f(x)≥0 and total integral = 1','Density is nonnegative and has total probability mass 1.','Density validity')
];
BANK['matrix-basics']=[
 ()=>{let a=rand(2,5),b=rand(1,5),c=rand(1,5),d=rand(2,5),x=rand(1,4),y=rand(1,4);return numeric(`A=[[${a},${b}],[${c},${d}]] and v=(${x},${y}). What is the FIRST coordinate of Av?`,a*x+b*y,'Take row 1 dot the input vector.','Matrix-vector product');},
 ()=>{let n=rand(2,6),k=rand(2,7);return numeric(`An ${n}×${k} matrix multiplies a ${k}×1 vector. How many numbers are in the output?`,n,'The output has one number per row of the matrix.','Matrix dimensions');},
 ()=>multi('Which statement about general matrices A and B is true?',['AB and BA need not be equal','AB=BA always','AB always exists'],'AB and BA need not be equal','Matrix multiplication is not commutative in general.','Algebraic structures')
];
BANK.multivariable=[
 ()=>{let a=rand(1,5),b=rand(1,5),x=rand(1,5);return numeric(`f(x,y)=${a}x²+${b}y². What is ∂f/∂x at x=${x}?`,2*a*x,'Treat y as constant. Differentiate the x term.','Partial derivative');},
 ()=>{let a=rand(2,8),b=rand(2,8);return numeric(`f(x,y)=−(x−${a})²−(y−${b})². What is the optimal x?`,a,'Both squared terms are at most zero; maximize when each vanishes.','Two-variable optimization');},
 ()=>multi('The gradient of a differentiable function points in which local direction?',['Steepest increase','Always to the global optimum','Steepest decrease'],'Steepest increase','The negative gradient points toward steepest local decrease.','Gradient intuition')
];
BANK['discrete-proofs']=[
 ()=>{let n=rand(6,30);return numeric(`If 1+2+...+n = n(n+1)/2, find the sum for n=${n}.`,n*(n+1)/2,'Use the arithmetic series identity.','Induction target');},
 ()=>{let n=rand(4,11);return numeric(`How many odd numbers are in {1,2,...,${2*n}}?`,n,'Every consecutive even-odd pair contains exactly one odd number.','Parity invariant');},
 ()=>multi('A proof by induction requires which two ingredients?',['Base case and inductive step','Three randomly chosen examples','Only the final case'],'Base case and inductive step','Prove the initial case, then show truth passes from n to n+1.','Induction')
];
BANK['sampling-inference']=[
 ()=>{let s=pick([4,6,8,12]),n=pick([16,36,64,100]);return numeric(`Sample standard deviation s=${s}, sample size n=${n}. Estimate SE of the mean.`,s/Math.sqrt(n),'SE=s/√n.','Standard error');},
 ()=>{let m=pick([1,2,3,4]),s=pick([.25,.5,1]);return numeric(`Estimated mean ${m}, SE ${s}. What is the UPPER endpoint of the rough 95% interval (mean ± 2SE)?`,m+2*s,'Upper endpoint=estimate+2×standard error.','Confidence interval');},
 ()=>multi('What is a p-value?',['P(data at least this extreme | null true)','P(null is true | data)','Probability a trading strategy earns money'],'P(data at least this extreme | null true)','A p-value is a tail probability computed assuming the null is true.','Hypothesis testing')
];
BANK['numerical-methods']=[
 ()=>{let x=rand(2,6),n=x*x;return numeric(`Newton iteration for f(t)=t²−${n}, starting at t=${x}, gives what t after one step?`,x,'You are already at a root, so the Newton update leaves it unchanged.','Root finding');},
 ()=>{let a=rand(2,8),x=rand(1,8);return numeric(`Apply one Newton step to f(t)=t−${a}, starting from t=${x}. What is the new t?`,a,"The derivative is 1, so x−(x−a)=a.",'Newton step');},
 ()=>multi('Which is a valid caution about Newton’s method?',['It may fail to converge','It always converges in one step','It never needs a derivative'],'It may fail to converge','A bad starting point or a near-zero derivative can cause failure.','Numerical stability')
];
BANK.markov=[
 ()=>{let p=pick([.25,.5,.75,.8]);return numeric(`A state persists each step with probability ${p}. Expected number of time steps spent there before exiting?`,1/(1-p),'Geometric waiting time has mean 1/(exit probability).','Dwell time');},
 ()=>{let p=pick([20,30,40,50,60]);return numeric(`A chain has two states. From state A, it moves to B with probability ${p}%. What is P(A→A), in percent?`,100-p,'Each row of a transition matrix sums to 1.','Transition row','percent');},
 ()=>multi('Which condition is required for a Markov transition matrix?',['Every row sums to one','Every column is strictly increasing','Every diagonal entry is zero'],'Every row sums to one','Each row contains a probability distribution over successor states.','Transition normalization')
];
BANK['avellaneda-stoikov']=[
 ()=>{let q=pick([-4,-2,0,2,4]),s=100,g=.1,sig=2,tau=1;return numeric(`Model r = S−qγσ²τ. S=100, q=${q}, γ=0.1, σ=2, τ=1. Find reservation price r.`,s-q*g*sig**2*tau,'Inventory shifts subjective fair value by q×γ×σ²×time to go.','Reservation price','dollars');},
 ()=>{let q=pick([-3,-1,1,3]);return multi(`A dealer holds inventory q=${q}. Under this model, which direction does reservation price move relative to mid?`,['Below mid','Above mid','Unchanged'],q>0?'Below mid':'Above mid','Long inventory lowers reservation price; short inventory raises it.','Inventory skew');},
 ()=>multi('In Avellaneda–Stoikov, if volatility increases while other parameters stay fixed, inventory-risk skew typically becomes…',['Larger in magnitude','Smaller in magnitude','Always exactly zero'],'Larger in magnitude','Inventory sensitivity is proportional to σ².','Volatility risk')
];

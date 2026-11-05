/* Mastery Phase X: original parameterized scenarios; numeric checks are finite and inspectable. */
(function(){'use strict';const engine=(function buildCore(){
  'use strict';
  const TRACKS={
    trader:{label:'Quant trader',pool:['urn','bayes','payoff','maker','tail','poisson','multiple']},
    researcher:{label:'Quant researcher',pool:['bayes','multiple','stderr','urn','poisson','cache','payoff']},
    quantdev:{label:'Quant developer / C++',pool:['binary','throughput','maker','cache','tail','poisson','retry']},
    infrastructure:{label:'Low-latency / SWE',pool:['throughput','tail','retry','cache','binary','poisson','multiple']}
  };
  const CODE={
    'binary-search':{title:'Binary search under a changing contract',fn:'search',prompt:'Return the index of a target in a sorted array of distinct integers, or -1 if absent. Use logarithmic time.',starter:'function search(nums, target) {\n  // State the inclusive interval invariant before coding.\n  return -1;\n}',strong:'Now the interviewer allows duplicates and asks for the FIRST matching index. What must your binary-search update rule preserve?',strongOptions:['Stop at the first hit; duplicates cannot change correctness','On a match, remember the candidate and continue searching to the left','Sort the input in every iteration'],strongAnswer:1,repair:'Your tests did not all pass. Which invariant would make the original search safe?',repairOptions:['Every removed half is guaranteed not to contain the target','The midpoint never changes','All numbers outside the interval are positive'],repairAnswer:0,lesson:'Use an interval invariant. For first occurrence, store the candidate and continue left. A plain early return may find a later duplicate.'},
    'sliding-window-maximum':{title:'Monotonic deque under load',fn:'maxSlidingWindow',prompt:'For each fixed-width window, emit its maximum. Target O(n) total time, not O(nk). Assume 1 <= k <= array length.',starter:'function maxSlidingWindow(nums, k) {\n  // Store useful indices, not just values.\n  return [];\n}',strong:'Why is the deque O(n) overall even if one iteration removes many elements?',strongOptions:['Each index is pushed once and popped at most once','Each window is constant size','The maximum changes at most once'],strongAnswer:0,repair:'Which index must leave the deque when the current position is i and the window width is k?',repairOptions:['Every index strictly less than i - k + 1','The current index i','Only indices with a negative value'],repairAnswer:0,lesson:'Remove expired indices at the front and dominated indices at the back. Each index enters and leaves at most once.'},
    'merge-intervals':{title:'Greedy interval merger',fn:'merge',prompt:'Merge all overlapping closed intervals and return a sorted set of disjoint intervals. Touching endpoints overlap.',starter:'function merge(intervals) {\n  // Sort by starting endpoint, then merge.\n  return intervals;\n}',strong:'What if intervals are half-open [start, end), and two intervals only touch at an endpoint?',strongOptions:['They are always overlapping','They do not overlap unless their interiors intersect','The answer cannot be computed with sorting'],strongAnswer:1,repair:'What must happen before a single left-to-right greedy pass?',repairOptions:['Sort intervals by start position','Reverse every interval','Randomly shuffle the intervals'],repairAnswer:0,lesson:'Sorting exposes candidate overlaps in order. Endpoint convention matters: [a,b) and [b,c) do not share a point.'},
    'coin-change':{title:'Dynamic programming with impossible states',fn:'coinChange',prompt:'Return the fewest coins needed to form a target amount using unlimited coins, or -1 if impossible.',starter:'function coinChange(coins, amount) {\n  // Define dp[a] and its base case.\n  return -1;\n}',strong:'What is a valid update for a reachable coin denomination c <= amount a?',strongOptions:['dp[a] = min(dp[a], 1 + dp[a-c])','dp[a] = dp[a-c] - 1','dp[a] = a / c for every c'],strongAnswer:0,repair:'Which base case anchors the recurrence?',repairOptions:['dp[0] = 0','dp[0] = infinity','dp[0] = -1'],repairAnswer:0,lesson:'dp[a] is the minimum number of coins. Set dp[0]=0 and unreachable states to infinity; transition from a-c.'},
    'lru-cache':{title:'LRU cache and online recency',fn:'lruCache',prompt:'Implement function lruCache(capacity, ops). For get, return its value or -1; for put, update and evict the least-recently-used key. Return the list of get results. Capacity zero stores nothing.',starter:'function lruCache(capacity, ops) {\n  // An ES Map maintains insertion order.\n  return [];\n}',strong:'If implemented in C++20 with a std::list and unordered_map of list iterators, why use splice for a cache hit?',strongOptions:['It moves a list node while preserving its iterator and avoids allocating a replacement node','It guarantees hash lookup O(1) worst-case','It changes all iterators to the moved node'],strongAnswer:0,repair:'What does a successful get operation change?',repairOptions:['Both the returned value and the key’s recency','Only the hit counter, not recency','Every existing value'],repairAnswer:0,lesson:'LRU recency changes on get and put. In C++, list splice preserves node iterators; a hashmap alone does not encode eviction order.'}
  };
  const round=(x,n=2)=>Number(x.toFixed(n));
  const pct=x=>round(100*x,2);
  const choose2=n=>n*(n-1)/2;
  const choose3=n=>n*(n-1)*(n-2)/6;
  function rng(seed){let s=(seed|0)||1;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};}
  function between(r,a,b){return a+Math.floor(r()*(b-a+1));}
  function makeTask(id,seed,level=1){
    const r=rng(seed),lv=Math.max(1,Math.min(3,level|0));
    let title,prompt,answer,unit='',strong,repair,solution,step='';let strongAnswer,repairAnswer;
    if(id==='urn'){
      const red=between(r,5,8)+lv,blue=between(r,3,7);
      title='Selection bias and conditional draws';answer=pct(choose2(red)/(choose2(red+blue)-choose2(blue)));unit='%';
      prompt=`An urn contains ${red} red and ${blue} blue tokens. Draw TWO without replacement. Given that AT LEAST ONE token is red, what is the probability BOTH are red, as a percentage? Round to 2 decimal places.`;
      strong=`A harder observation: draw THREE tokens instead, and learn that at least one is red. What percentage chance are all three red?`;strongAnswer=pct(choose3(red)/(choose3(red+blue)-choose3(blue)));
      repair=`Simplify: before any observation, what percent chance is the FIRST draw red?`;repairAnswer=pct(red/(red+blue));
      solution=`Count unordered pairs: C(${red},2) / [C(${red+blue},2) - C(${blue},2)]. Given “at least one”, blue-blue pairs are excluded, not replaced by an assumption that the first was red.`;
    }else if(id==='bayes'){
      const prior=between(r,3,15)+lv,sens=between(r,75,94),fpr=between(r,5,18);
      const p=prior/100,s=sens/100,f=fpr/100;
      title='Base rates, false alarms, and Bayes';answer=pct(p*s/(p*s+(1-p)*f));unit='%';
      prompt=`A rare event has prior probability ${prior}%. A detector flags ${sens}% of real events and ${fpr}% of non-events. Given ONE flag, what percent probability is the event real? Round to 2 decimals.`;
      strong='Two conditionally independent detectors with these same error rates BOTH flag. What is the new posterior percent?';strongAnswer=pct(p*s*s/(p*s*s+(1-p)*f*f));
      repair='Before conditioning, what percent of all observations get flagged?';repairAnswer=pct(p*s+(1-p)*f);
      solution='Use posterior = prior × sensitivity / [prior × sensitivity + (1-prior) × false-positive rate]. Do not treat the positive predictive value as sensitivity.';
    }else if(id==='payoff'){
      const w=between(r,10,32)+lv*2,l=between(r,5,21),p=between(r,40,70);
      title='Expected value and break-even odds';unit='credits';answer=round(p/100*w-(1-p/100)*l);
      prompt=`A bet earns +${w} credits with probability ${p}% and loses ${l} credits otherwise. What is its expected NET value per bet? Round to 2 decimals (losses are negative).`;
      strong='What winning probability, as a percentage, makes the bet break even?';strongAnswer=pct(l/(w+l));
      repair='What is the chance of losing, as a percent?';repairAnswer=100-p;
      solution='Linearity over mutually exclusive outcomes: EV = P(win)×win + P(loss)×(-loss). Break even when p×win-(1-p)×loss=0.';
    }else if(id==='maker'){
      const bid=between(r,97,101),up=bid+between(r,2,5),down=bid-between(r,2,5),p=between(r,18,40);
      const ask=bid+between(r,2,4),upLift=between(r,62,88);
      title='Market making and adverse selection';unit='credits/share';answer=round((p/100*up+(1-p/100)*down)-bid);
      prompt=`You post a BID of ${bid}. After your bid gets hit, the next fair price is ${up} with probability ${p}% or ${down} otherwise. What is expected marked-to-market P&L per share for the BUY fill? Round to 2 decimals.`;
      strong=`Your ASK is ${ask}. After your ask is lifted, fair price is ${up} with probability ${upLift}% and ${down} otherwise. What is the expected P&L/share for this SELL fill?`;strongAnswer=round(ask-(upLift/100*up+(1-upLift/100)*down));
      repair='Given the hit bid, what is the expected next fair price (not P&L)?';repairAnswer=round(p/100*up+(1-p/100)*down);
      solution='For a buy, P&L is new fair value minus purchase price. For a sell, P&L is sell price minus new fair value. CONDITIONAL fill information changes the distribution.';
    }else if(id==='tail'){
      const n=between(r,3,6)+lv,q=between(r,93,98);
      title='Tail latency and request fan-out';unit='%';answer=pct(Math.pow(q/100,n));
      prompt=`A request fans out to ${n} independent downstream services. Each finishes before a hard deadline with probability ${q}%. ALL must finish. What percent of requests finish before the deadline? Round to 2 decimals.`;
      strong=`At the same ${q}% service-level probability, what is the MAXIMUM whole-number fan-out n that still achieves at least 80% all-complete probability?`;strongAnswer=Math.floor(Math.log(.8)/Math.log(q/100)+1e-10);
      repair='What is the chance that TWO independent services both finish before the deadline, as a percent?';repairAnswer=pct(Math.pow(q/100,2));
      solution='Independence makes P(all complete)=q^n. Correlated service delays would invalidate this multiplication; explicitly state the assumption.';
    }else if(id==='throughput'){
      const arrival=between(r,650,1200),service=arrival-between(r,70,240),sec=between(r,12,35);
      title='Overload and queue growth';unit='events';answer=(arrival-service)*sec;
      prompt=`A bounded processor receives ${arrival} events/s and processes ${service} events/s for ${sec} seconds, with enough queue capacity and an initially empty queue. Ignoring discrete-event jitter, how many events are backlogged?`;
      strong='To keep utilization at or below 80%, what MINIMUM integer service capacity (events/s) supports the arrival rate?';strongAnswer=Math.ceil(arrival/0.8);
      repair=`How many events arrive in ${sec} seconds before subtracting processed events?`;repairAnswer=arrival*sec;
      solution='Backlog growth is max(0, arrival rate − service rate) × duration. A bounded queue will drop or block traffic if its limit is reached; this prompt explicitly assumes sufficient capacity.';
    }else if(id==='retry'){
      const prob=between(r,48,87),p=prob/100;
      title='Retry math and independent failure';unit='%';answer=pct(1-Math.pow(1-p,2));
      prompt=`An operation independently succeeds with probability ${prob}% on each attempt. With a maximum of TWO attempts (retry once after failure), what is P(at least one success), in percent? Round to 2 decimals.`;
      strong='If THREE attempts are allowed, what is P(at least one success), in percent?';strongAnswer=pct(1-Math.pow(1-p,3));
      repair='What is the percent chance that BOTH independent attempts fail?';repairAnswer=pct(Math.pow(1-p,2));
      solution='Complement event: P(success at least once)=1-P(all attempts fail)=1-(1-p)^k. In real systems, outages often correlate, so independence must be checked.';
    }else if(id==='cache'){
      const hit=between(r,1,4),miss=between(r,45,110),mr=between(r,8,30),target=between(r,8,18);
      title='Cache miss rate and average latency';unit='ms';answer=round((1-mr/100)*hit+(mr/100)*miss);
      prompt=`A cache hit costs ${hit} ms and a miss costs ${miss} ms. The miss rate is ${mr}%. What is mean latency in ms? Round to 2 decimals.`;
      strong=`To keep the mean at or below ${target} ms, what is the MAXIMUM allowed miss rate in percent? Round to 2 decimals.`;strongAnswer=pct((target-hit)/(miss-hit));
      repair='If EVERY request missed the cache, what would mean latency be, in ms?';repairAnswer=miss;
      solution='A mixture mean is (1-miss_rate)×hit_latency + miss_rate×miss_latency. Mean is not p99; high-latency misses may dominate the tail.';
    }else if(id==='binary'){
      const n=between(r,30,700)*lv;
      title='Binary search comparison budget';unit='comparisons';answer=Math.floor(Math.log2(n))+1;
      prompt=`A standard binary search on a sorted array of ${n} DISTINCT elements counts one comparison per visited midpoint. What is the WORST-CASE number of midpoint visits, for either a found or missing target?`;
      strong=`The data size doubles to ${2*n}. What is the worst-case number of midpoint visits now?`;strongAnswer=Math.floor(Math.log2(2*n))+1;
      repair='What is the worst-case number of midpoint visits for a sorted array of 7 distinct elements?';repairAnswer=3;
      solution='Each unsuccessful comparison approximately halves the remaining candidate interval. Worst-case visited midpoints = floor(log2(n))+1 for n≥1.';
    }else if(id==='multiple'){
      const alpha=between(r,2,8),m=between(r,6,18)+lv;
      title='Multiple testing and false discoveries';unit='%';answer=pct(1-Math.pow(1-alpha/100,m));
      prompt=`You perform ${m} independent tests, EACH with a ${alpha}% false-positive probability under the null. If ALL nulls are true, what is the probability of at least one false positive (percent, 2 decimals)?`;
      strong=`Using a Bonferroni bound for a family-wise error rate of ${alpha}%, what maximum per-test alpha (percent) should be used across ${m} tests?`;strongAnswer=round(alpha/m);
      repair=`What is the false-positive probability of just ONE such test, as a percent?`;repairAnswer=alpha;
      solution='P(at least one)=1-(1-alpha)^m under independence. Bonferroni guarantees family-wise error ≤ sum of test-specific alpha levels, even without independence.';
    }else if(id==='stderr'){
      const p=between(r,15,70)/100,n=between(r,9,30)*100;
      title='Estimator precision and sample size';unit='percentage points';answer=round(100*Math.sqrt(p*(1-p)/n));
      prompt=`You sample ${n} independent Bernoulli outcomes with estimated success probability ${round(pct(p),0)}%. Approximate the plug-in standard error of the sample proportion, in PERCENTAGE POINTS. Round to 2 decimals.`;
      strong='Assuming the probability is unchanged, how many total observations are required to HALVE that standard error?';strongAnswer=4*n;
      repair='If you quadruple sample size, by what FACTOR (not a percent) does the standard error change?';repairAnswer=0.5;
      solution='Standard error of an independent Bernoulli mean is sqrt(p(1-p)/n). In percentage points, multiply by 100; halving standard error needs 4× observations.';
    }else if(id==='poisson'){
      const lambda=between(r,2,6),t=between(r,2,5)/10,mu=lambda*t;
      title='Arrival process and Poisson probabilities';unit='%';answer=pct(Math.exp(-mu));
      prompt=`Arrivals follow a homogeneous Poisson process at ${lambda} arrivals/second. What is P(NO arrivals in ${t.toFixed(1)} seconds), as a percent? Round to 2 decimals.`;
      strong='What is the percent probability of EXACTLY ONE arrival in the same period?';strongAnswer=pct(mu*Math.exp(-mu));
      repair='What is the percent probability of AT LEAST ONE arrival in the period?';repairAnswer=pct(1-Math.exp(-mu));
      solution='For N∼Poisson(lambda×time), P(N=k)=exp(-mu)×mu^k/k!. Be careful: “at least one” is the complement of zero.';
    }else throw Error('Unknown task archetype '+id);
    return {id,seed,level:lv,kind:'numeric',title,prompt,answer,unit,strong,repair,strongAnswer,repairAnswer,solution,step,rounding:'Enter a number only; percent questions accept 62.5, not 0.625.'};
  }
  function makeCodeTask(slug,seed,level){const c=CODE[slug];if(!c)throw Error('Unknown coding task');return {...c,id:slug,seed,level,kind:'code',unit:'seeded test batches'};}
  function gradeNumber(value,expected){
    const raw=String(value??'').trim().replace(/,/g,'');if(!/^-?(?:\d+\.?\d*|\.\d+)$/.test(raw))return {ok:false,valid:false,why:'Enter one finite number without units.'};
    const number=Number(raw);if(!Number.isFinite(number))return {ok:false,valid:false,why:'Enter a finite number.'};
    return {ok:Math.abs(number-expected)<=0.011,valid:true,number,expected};
  }
  function adaptiveLevel(id,history){
    const recent=(Array.isArray(history)?history:[]).filter(x=>x?.id===id&&x?.kind==='numeric'&&typeof x.initialOk==='boolean').slice(-3);
    if(recent.length<2)return 1;
    const successes=recent.filter(x=>x.initialOk).length;
    return successes===3?3:successes>=2?2:1;
  }
  function plan(track='trader',duration=90,run=1,history=[]){
    if(!TRACKS[track])throw Error('Invalid track');if(![45,90,120].includes(duration))throw Error('Invalid duration');
    const rngNow=rng(((run*73856093)^(duration*19349663)^TRACKS[track].pool.length*83492791)|0);
    const pool=[...TRACKS[track].pool];
    for(let i=pool.length-1;i>0;i--){const j=between(rngNow,0,i);[pool[i],pool[j]]=[pool[j],pool[i]];}
    const taskCount=duration===45?3:duration===90?5:6;
    const n=taskCount-1;
    const tasks=pool.slice(0,n).map((id,i)=>makeTask(id,(run*1009)+(i+1)*9173,adaptiveLevel(id,history)));
    const slugs=Object.keys(CODE);
    const code=makeCodeTask(slugs[(run+Object.keys(TRACKS).indexOf(track))%slugs.length],run*2999+29,1);
    tasks.splice(Math.min(2,tasks.length),0,code);
    return tasks.map((t,i)=>({...t,section:i===0?'Opening screen':i===2?'Live coding':i===taskCount-1?'Adversarial defense':'Technical deep dive'}));
  }
  return {TRACKS,CODE,makeTask,makeCodeTask,gradeNumber,adaptiveLevel,plan};
})();if(typeof module!=='undefined'&&module.exports)module.exports=engine;else window.Phase10Engine=engine;})();

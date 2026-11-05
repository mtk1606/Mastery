/* Mastery Focus: original, source-independent microdrills; commonJS for deterministic tests. */
(function(){'use strict';const core=(function focusCore(){
 'use strict';
 function rng(seed){let s=(seed|0)||1;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};}
 const n=(r,lo,hi)=>lo+Math.floor(r()*(hi-lo+1));
 const round=(x,dp=2)=>Number(x.toFixed(dp));
 const percent=x=>round(100*x);
 const topics=[
  {id:'ev',title:'Expected value',category:'Probability',link:'index.html#/lesson/expected-value',cue:'A choice has several possible payoffs. Weight the net outcomes by their probabilities.'},
  {id:'bayes',title:'Bayesian updating',category:'Probability',link:'index.html#/lesson/bayes',cue:'You are given evidence and asked about a hidden cause. Start with base rates, not just test accuracy.'},
  {id:'tail',title:'Tail latency & fan-out',category:'Systems',link:'index.html#/lesson/latency',cue:'ALL services must complete. Under independence, multiply success probabilities.'},
  {id:'maker',title:'Market-making P&L',category:'Trading',link:'index.html#/lesson/quoting',cue:'A fill changes the information set. Condition on it before valuing inventory.'},
  {id:'queue',title:'Queue growth',category:'Systems',link:'market-systems.html',cue:'Compare arrival and service rates, then multiply the difference by elapsed time.'},
  {id:'stderr',title:'Standard error',category:'Research',link:'index.html#/lesson/variance',cue:'An independent sample proportion has standard error proportional to 1/√n.'},
  {id:'binary',title:'Binary search',category:'Coding',link:'engineering.html#track=dsa&lesson=binary',cue:'Each comparison halves the remaining interval when the input is sorted.'}
 ];
 function challenge(id,seed=1){
  const t=topics.find(x=>x.id===id);if(!t)throw Error('Unknown sprint topic');
  const r=rng(seed*15131+id.length*479+17);
  let prompt,answer,unit='',solution,why,correct,trap;
  if(id==='ev'){
    const win=n(r,12,38),loss=n(r,5,23),prob=n(r,35,75);
    prompt=`A strategy earns +${win} credits with probability ${prob}% and loses ${loss} credits otherwise. What is its expected NET payoff in credits? Round to two decimals.`;
    answer=round(win*prob/100-loss*(1-prob/100));unit='credits';
    solution=`Expected net payoff = ${prob}/100 × ${win} − ${100-prob}/100 × ${loss} = ${answer} credits.`;
    why=['Weight both payoffs by their probabilities, treating losses as negative.','Average the win and loss without weighting.','Multiply win and loss because both can happen on the same bet.'];correct=0;
    trap='The loss is negative and the two outcomes are mutually exclusive.';
  }else if(id==='bayes'){
    const prior=n(r,3,13),sens=n(r,75,94),falsePos=n(r,5,18);
    answer=percent((prior/100)*(sens/100)/((prior/100)*(sens/100)+(1-prior/100)*(falsePos/100)));unit='%';
    prompt=`An event occurs ${prior}% of the time. A detector flags ${sens}% of real events and ${falsePos}% of non-events. If it flags, what is the probability the event is real (percent, 2 decimals)?`;
    solution=`Posterior = (${prior}/100 × ${sens}/100) ÷ [(${prior}/100 × ${sens}/100) + (${100-prior}/100 × ${falsePos}/100)] = ${answer}%.`;
    why=['Use the true-positive rate as the posterior directly.','Compare flagged real events with ALL flagged events, including false positives.','Assume half the flagged events are real because there are two possible outcomes.'];correct=1;
    trap='Sensitivity is not the same as P(real | flag). The base rate matters.';
  }else if(id==='tail'){
    const per=n(r,91,98),services=n(r,3,7);
    answer=percent((per/100)**services);unit='%';
    prompt=`A request waits for ${services} independent downstream services. Each meets its deadline ${per}% of the time. What percent of requests have ALL services finish on time (2 decimals)?`;
    solution=`Under independence, P(all finish) = (${per}/100)^${services} = ${answer}%.`;
    why=['Multiply independent completion probabilities across all required services.','Take the average deadline probability of the services.','Subtract the number of services from the probability.'];correct=0;
    trap='A single slow dependency can make the whole request late; correlation would change the result.';
  }else if(id==='maker'){
    const bid=n(r,96,105),high=bid+n(r,3,8),low=bid-n(r,3,8),prob=n(r,18,48);
    answer=round((prob/100*high+(1-prob/100)*low)-bid);unit='credits/share';
    prompt=`Your BID at ${bid} is hit. Conditional on this fill, next fair value is ${high} with probability ${prob}% and ${low} otherwise. What is expected marked-to-market P&L on the BUY per share (2 decimals)?`;
    solution=`Expected fair value after the fill = ${prob}/100 × ${high} + ${100-prob}/100 × ${low}. Subtract the buy price ${bid}: ${answer} credits/share.`;
    why=['Your posted bid is automatically a profit because you traded.','Use an unconditional pre-trade price, ignoring fill information.','Condition on the fill and subtract the price paid from expected fair value.'];correct=2;
    trap='Being filled does not imply you earned the spread; you may face adverse selection.';
  }else if(id==='queue'){
    const incoming=n(r,450,900),capacity=incoming-n(r,50,170),seconds=n(r,8,31);
    answer=(incoming-capacity)*seconds;unit='events';
    prompt=`A queue starts empty, receives ${incoming} events/second and processes ${capacity} events/second for ${seconds} seconds. Assume it never reaches capacity and ignore discrete jitter. How many events remain queued?`;
    solution=`Backlog = (${incoming} − ${capacity}) × ${seconds} = ${answer} events.`;
    why=['Multiply the difference between arrival and service rates by elapsed time.','Subtract capacity once and ignore how long the overload lasts.','The queue is always empty if any service rate exists.'];correct=0;
    trap='Queue capacity and service rate are different. The problem assumes no drops or blocking.';
  }else if(id==='stderr'){
    const p=n(r,20,70)/100,sample=n(r,4,20)*100;
    answer=round(100*Math.sqrt(p*(1-p)/sample));unit='percentage points';
    prompt=`From ${sample} independent Bernoulli trials, the observed success proportion is ${round(p*100,0)}%. What is its approximate plug-in standard error in PERCENTAGE POINTS (2 decimals)?`;
    solution=`Standard error ≈ 100 × √(${p} × ${round(1-p,2)} / ${sample}) = ${answer} percentage points.`;
    why=['Standard error increases linearly with sample size.','Standard error is √[p(1−p)/n], then multiplied by 100 for percentage points.','Every independent Bernoulli estimator has exactly zero error.'];correct=1;
    trap='Standard error shrinks like 1/√n, not 1/n.';
  }else{
    const len=n(r,16,650);
    answer=Math.floor(Math.log2(len))+1;unit='midpoint visits';
    prompt=`A conventional binary search runs on ${len} SORTED distinct elements. In the worst case, how many midpoint visits are required to either find a target or conclude it is absent?`;
    solution=`For n ≥ 1, worst-case midpoint visits = floor(log₂ n) + 1 = ${answer}. Each unsuccessful visit halves the candidate interval.`;
    why=['Search every element until a match.','Assume the target is guaranteed to be at the middle.','Maintain the interval invariant and discard roughly half of the remaining candidates each step.'];correct=2;
    trap='For nonempty arrays, worst-case visits are floor(log₂ n)+1, not n/2.';
  }
  return {...t,seed,prompt,answer,unit,solution,why,correct,trap};
 }
 function grade(input,expected){
  const v=String(input??'').trim().replace(/,/g,'');
  if(!/^-?(?:\d+\.?\d*|\.\d+)$/.test(v))return {valid:false,ok:false,message:'Enter a number without units.'};
  const number=Number(v);
  if(!Number.isFinite(number))return {valid:false,ok:false,message:'Enter a finite number.'};
  return {valid:true,ok:Math.abs(number-expected)<=0.011,number};
 }
 function plan(run,history=[],dueIds=[]){
   const r=rng(run*997+17),last=Array.isArray(history)?history:[];
   const latest=new Map();for(const attempt of last.slice(-80))if(attempt&&topics.some(t=>t.id===attempt.id))latest.set(attempt.id,attempt);const missed=new Set([...latest.entries()].filter(([,v])=>v.correct===false).map(([id])=>id));
   const ids=topics.map(x=>x.id);
   for(let i=ids.length-1;i>0;i--){const j=n(r,0,i);[ids[i],ids[j]]=[ids[j],ids[i]];}
   const prioritized=[...new Set([...dueIds.filter(id=>ids.includes(id)),...ids.filter(id=>missed.has(id)),...ids])].slice(0,3);
   return prioritized.map((id,i)=>challenge(id,run*1009+73*i+7));
 }
 return {topics,challenge,grade,plan};
})();if(typeof module!=='undefined'&&module.exports)module.exports=core;else window.MasteryFocusCore=core;})();

/* Mastery Phase XIV-D: deterministic, source-auditable reliability simulations.
 * Explicitly modeled examples, not real database/server/benchmark executions. */
(function(root){
'use strict';
const F=(label,explain,fields)=>({label,explain,...fields});
const allowed={
 tape:['duplicate','conflict'],
 dedup:['durable','naive'],
 fixture:['negative','positive'],
 workload:['steady','tail','burst'],
 transaction:['atomic','unprotected'],
 failure:['crash','success'],
 retry:['stable','new-key'],
 race:['unsafe','locked']
};
function eventsFor(tape){
 if(!allowed.tape.includes(tape))throw Error('Invalid input tape');
 return tape==='duplicate'
 ?[{id:'ev-1',symbol:'AAPL',qty:10},{id:'ev-2',symbol:'MSFT',qty:5},{id:'ev-1',symbol:'AAPL',qty:999},{id:'ev-3',symbol:'AAPL',qty:7}]
 :[{id:'ev-1',symbol:'AAPL',qty:10},{id:'ev-2',symbol:'MSFT',qty:5},{id:'ev-1',symbol:'MSFT',qty:900},{id:'ev-3',symbol:'AAPL',qty:7}];
}
function dedupFrames(params={tape:'duplicate',dedup:'durable'}){
 const {tape,dedup}=params;
 if(!allowed.tape.includes(tape)||!allowed.dedup.includes(dedup))throw Error('Invalid dedup parameters');
 const events=eventsFor(tape),seen=new Set(),totals={},frames=[];
 frames.push(F('Start with a clean ingestion state',
  'The stream contains four events, including a repeated event ID. Before processing, the accepted quantity totals are empty and no IDs have been recorded.',
  {tape,dedup,events,step:0,seen:[],totals:{},accepted:null,reason:'No event processed',current:null}));
 events.forEach((ev,i)=>{
  const duplicate=seen.has(ev.id),accepted=dedup==='naive'||!duplicate;
  if(accepted)totals[ev.symbol]=(totals[ev.symbol]||0)+ev.qty;
  if(!duplicate)seen.add(ev.id);
  const title=duplicate?(accepted?'Unsafe replay: repeated ID counted again':'Idempotent replay: repeated ID skipped'):'First occurrence: apply exactly this payload';
  const text=duplicate?
   (accepted?'This event ID was already observed, but the naive pipeline adds the retried payload again. That inflates totals or moves quantity to the wrong symbol.':
    'The event ID was previously seen; this illustrative first-write-wins pipeline refuses to count this duplicate, even if its payload conflicts.')
   :'The ID '+ev.id+' is new. Record it and add '+ev.qty+' units to '+ev.symbol+' once, so every accepted ID contributes exactly its first payload.';
  frames.push(F(title,text,{tape,dedup,events,step:i+1,seen:[...seen],totals:{...totals},accepted,reason:duplicate?'Duplicate ID '+ev.id:'New ID '+ev.id,current:ev}));
 });
 return frames;
}
const fixtures={negative:{values:[-3,-1],k:1},positive:{values:[2,4],k:1}};
function maxWindow(values,k,buggy){
 if(!Array.isArray(values)||!Number.isInteger(k)||k<=0||k>values.length)throw Error('Invalid window case');
 let best=buggy?0:-Infinity;
 for(let i=0;i+k<=values.length;i++)best=Math.max(best,values.slice(i,i+k).reduce((a,b)=>a+b,0));
 return best;
}
function gitFrames(fixture='negative'){
 if(!allowed.fixture.includes(fixture))throw Error('Unknown regression fixture');
 const input=fixtures[fixture],expected=maxWindow(input.values,input.k,false),observed=maxWindow(input.values,input.k,true),pass=observed===expected;
 const base={fixture,input,expected,observed,corrected:expected,passes:pass};
 return [
 F('Record the contract and a deterministic fixture',
  'We must return the maximum sum among nonempty windows of length k, even if every value is negative. This example is a simulated local regression, not a claim that CI actually ran.',
  {...base,phase:'spec'}),
 F('Run the flawed implementation against the fixture',
  'The buggy code initializes best=0. For '+JSON.stringify(input.values)+', k='+input.k+', it produces '+observed+' while the specified output is '+expected+'. '+(pass?'This positive fixture passes despite the defect.':'The negative fixture exposes the defect.'),
  {...base,phase:'bug'}),
 F('Identify the minimal repair',
  'Initialize best using the sum of the first real valid window, not zero. This maintains the invariant that the reported maximum is the sum of some permitted window.',
  {...base,phase:'patch'}),
 F('Repeat the fixture using the corrected implementation',
  'With a valid initialization, the illustrative implementation returns '+expected+'. Both the original failure and a positive control are useful, but passing finite fixtures is not a proof.',
  {...base,phase:'verify'}),
 F('Communicate evidence accurately in code review',
  'A review should show the input, incorrect actual value, expected value, invariant, correction and test command. This panel models those facts; it does not execute Git or a test runner.',
  {...base,phase:'review'})
 ];
}
function percentile(sorted,p){
 if(!sorted.length||p<=0||p>1)throw Error('Bad percentile');
 return sorted[Math.ceil(sorted.length*p)-1];
}
function workloadFor(name){
 if(!allowed.workload.includes(name))throw Error('Unknown latency workload');
 if(name==='steady')return {name,latencies:Array(20).fill(20),intervalMs:1000};
 if(name==='tail')return {name,latencies:[...Array(19).fill(20),400],intervalMs:1000};
 return {name,latencies:[...Array(93).fill(20),...Array(5).fill(50),400,400],intervalMs:2000};
}
function latencyFrames(name='tail'){
 const workload=workloadFor(name),sorted=[...workload.latencies].sort((a,b)=>a-b);
 const n=sorted.length,p50=percentile(sorted,.5),p95=percentile(sorted,.95),p99=percentile(sorted,.99);
 const avg=sorted.reduce((a,b)=>a+b,0)/n,throughput=n/(workload.intervalMs/1000);
 const buckets=[...new Set(sorted)].map(ms=>({ms,count:sorted.filter(x=>x===ms).length}));
 const base={...workload,n,p50,p95,p99,avg,throughput,buckets,sorted};
 return [
 F('Specify the workload and time interval',
  'This is a deterministic illustrative observation window: '+n+' completed requests over '+workload.intervalMs+' ms. Total throughput is '+throughput+' requests/s for this window, independently of individual response times.',
  {...base,focus:'interval'}),
 F('Plot the measured per-request latency distribution',
  'The distinct observed response times are '+buckets.map(b=>b.ms+' ms ('+b.count+' requests)').join(', ')+'. A throughput figure cannot reveal this latency distribution on its own.',
  {...base,focus:'distribution'}),
 F('Compute the nearest-rank median (p50)',
  'Sort all '+n+' measurements and select one-based rank ceil(0.50×'+n+') = '+Math.ceil(.5*n)+'. Its observed latency is '+p50+' ms. This is the explicitly defined nearest-rank convention.',
  {...base,focus:'p50'}),
 F('Compute nearest-rank p95 and p99 separately',
  'The p95 rank is '+Math.ceil(.95*n)+' and its value is '+p95+' ms; the p99 rank is '+Math.ceil(.99*n)+' and its value is '+p99+' ms. A rare slow request can affect p99 without changing p95.',
  {...base,focus:'tail'}),
 F('Report the scope of every performance claim',
  'For this modeled interval, throughput is '+throughput+' requests/s, arithmetic mean latency '+avg.toFixed(2)+' ms, p95 '+p95+' ms, and p99 '+p99+' ms. No concurrency limit, service-level guarantee or real benchmark follows from these invented sample values.',
  {...base,focus:'summary'})
 ];
}
function transactionFrames(param={transaction:'atomic',failure:'crash'}){
 const {transaction,failure}=param;
 if(!allowed.transaction.includes(transaction)||!allowed.failure.includes(failure))throw Error('Invalid transaction mode');
 const protectedTx=transaction==='atomic',crash=failure==='crash',start={A:100,B:50},amount=30,debit={A:70,B:50},success={A:70,B:80};
 const snapshot=(label,explain,phase,committed,tentative=null,status='PENDING')=>F(label,explain,{transaction,failure,phase,status,start,amount,committed:{...committed},tentative:tentative?{...tentative}:null,conserved:committed.A+committed.B===150});
 const frames=[
  snapshot('Start from an invariant-preserving ledger',
   'Account A has 100 units, account B has 50, and the conserved total is 150. The transfer contract moves 30 units with no creation or destruction of value.','start',start),
  snapshot('Debit A: is this visible or tentative?',
   protectedTx?'In the atomic model, A=70 is tentative inside one transaction; committed balances remain A=100 and B=50 until both writes succeed.':
    'In the unprotected two-step model, A=70 is already committed before the credit. The public ledger now holds only 120 units.',
   'debit',protectedTx?start:debit,protectedTx?debit:null,protectedTx?'UNCOMMITTED':'FIRST WRITE COMMITTED')
 ];
 if(crash){
  frames.push(snapshot('Crash before crediting B',
   protectedTx?'The process crashes before commit, so no partial transfer becomes durable; the tentative debit is discarded.':
    'The process crashes after debit committed but before credit, leaving A=70 and B=50. The ledger has lost 30 units and violated conservation.',
   'crash',protectedTx?start:debit,null,'CRASH'));
  frames.push(snapshot('Recover according to the transaction boundary',
   protectedTx?'Rollback leaves committed balances at A=100 and B=50, conserving 150. This models atomic rollback only; isolation and external side effects require separate analysis.':
    'No atomic group exists to undo the already committed debit. The committed total remains 120 unless explicit durable recovery/compensation corrects it.',
   'recovery',protectedTx?start:debit,null,protectedTx?'ROLLED BACK':'PARTIAL COMMIT'));
 }else{
  frames.push(snapshot('Credit B using the same transfer amount',
   protectedTx?'The transaction now has a tentative debit and credit, A=70 and B=80, while committed balances are still A=100, B=50.':
    'The second unprotected write credits B to 80. The final totals sum to 150, but a crash between writes would have exposed a partial state.',
   'credit',protectedTx?start:success,protectedTx?success:null,protectedTx?'READY TO COMMIT':'SECOND WRITE COMMITTED'));
  frames.push(snapshot('Complete the transfer',
   protectedTx?'Both writes commit atomically. Committed balances are A=70, B=80 and the total remains 150.':
    'Both independent writes happened to complete, so the final sum is 150; this success path does not eliminate the intermediate failure window.',
   'complete',success,null,protectedTx?'ATOMIC COMMIT':'TWO COMMITS'));
 }
 return frames;
}
function retryFrames(mode='stable'){
 if(!allowed.retry.includes(mode))throw Error('Invalid retry mode');
 const primary='req-42',retry=mode==='stable'?primary:'req-43';
 const snapshot=(label,explain,stage,keys,orders,response)=>F(label,explain,{mode,stage,primary,retry,keys:[...keys],orders,acknowledged:response});
 return [
  snapshot('Client submits a create request',
   'A client sends one order-creation request with idempotency key req-42. In this model a durable receipt and the side effect are written atomically.',
   'send',[],0,false),
  snapshot('Server commits the order and its receipt',
   'The server records key req-42 and creates exactly one order. The key-to-result receipt is persisted in the same atomic transaction as the side effect.',
   'commit',[primary],1,false),
  snapshot('The response is lost after the commit',
   'The network drops the success response. The client cannot infer whether the operation committed; a timeout is an unknown outcome, not proof of failure.',
   'lost',[primary],1,false),
  snapshot('Client retries after the unknown outcome',
   mode==='stable'?'The retry reuses req-42. Server finds the durable receipt and returns the original order result without creating a second order.':
    'The retry uses new key req-43. The server treats it as a new operation and creates a second order; duplicate real-world effects can occur.',
   'retry',mode==='stable'?[primary]:[primary,retry],mode==='stable'?1:2,false),
  snapshot('Inspect the final side-effect count',
   mode==='stable'?'Exactly one order exists after the retry: receipt lookup preserved idempotency. In a real service, conflicting payloads for the same key must be rejected.':
    'Two orders now exist because different keys named distinct operations. Preventing duplicates requires a stable client key plus durable atomic receipt semantics.',
   'final',mode==='stable'?[primary]:[primary,retry],mode==='stable'?1:2,true)
 ];
}
function raceFrames(mode='unsafe'){
 if(!allowed.race.includes(mode))throw Error('Unknown concurrency mode');
 const safe=mode==='locked';
 const F2=(label,explain,phase,value,reads,owner)=>F(label,explain,{mode,phase,value,reads:{...reads},owner,expected:2,lost:value!==2});
 return [
  F2('Shared counter begins at zero',
   'Two workers each intend to increment the same logical counter once. Correct serializable behavior should finish with value 2.',
   'start',0,{},null),
  F2('Worker A reads the current value',
   safe?'A acquires the lock and reads 0. B cannot enter the protected critical section until A has completed its write.':
    'A reads shared value 0 before performing its increment. The read, computation and write are not one atomic operation.',
   'readA',0,{A:0},safe?'A':null),
  F2('Worker B attempts to proceed',
   safe?'B waits at the lock while A owns the critical section. B must not read an old value now.':
    'B also reads 0 before A writes. The two workers now hold stale, identical snapshots.',
   'readB',0,safe?{A:0}:{A:0,B:0},safe?'A':null),
  F2('Worker A writes the incremented value',
   'A writes 1 using its local read of 0. This is only one of the two intended increments.',
   'writeA',1,safe?{A:0}:{A:0,B:0},safe?'A':null),
  F2(safe?'Worker B enters after A releases the lock':'Worker B overwrites A with its stale result',
   safe?'A releases the lock. B acquires it and now reads 1 instead of the stale 0, so its pending update can produce 2.':
    'B writes 1 because it computed 0+1 earlier. A’s update is lost: two requests incremented but the shared counter remains 1.',
   'writeB',safe?1:1,safe?{A:0,B:1}:{A:0,B:0},safe?'B':null),
  F2('Compare actual and expected final values',
   safe?'B writes 2 and releases its lock. Actual is 2, equal to the expected total: both increments were preserved.':
    'The final value is 1, not the expected 2. This is the classic lost-update schedule; the GIL does not make a read-modify-write protocol atomic.',
   'final',safe?2:1,safe?{A:0,B:1}:{A:0,B:0},null)
 ];
}
const scene=(id,kind,title,purpose,frames,challenge,source)=>({id,kind,title,purpose,frames,challenge,source});
const scenes=[
 scene('c4-testing','dedup','Replaying events must not duplicate effects','Watch a retry or conflicting payload flow through a first-write-wins event deduplicator.',dedupFrames(),
 {question:'With ev-1 repeated, what prevents adding the second payload?',options:['Deduplicate by symbol','Ignore events whose unique ID is already processed','Sort by quantity'],answer:1,why:'A unique stable event identifier defines replay identity. First-write-wins processes the first payload once; symbol uniqueness would drop legitimate events.'},'Ingestion idempotency / property testing; original educational model'),
 scene('c4-git','review','A useful regression review starts with a failure','Compare a bug-triggering fixture with a control and show the fix to a nonempty-window maximum.',gitFrames(),
 {question:'What does a positive-only fixture passing establish about best=0?',options:['Correct for every input','Nothing about negative-only windows','That its time complexity is O(1)'],answer:1,why:'One passing test covers only its input. A negative-only valid window provides a counterexample to initializing the maximum to zero.'},'Git review and executable regression principles; conceptual simulation'),
 scene('c4-profiling','latency','Throughput is not p95 or p99 latency','See exact observed nearest-rank percentile values and throughput for synthetic workloads.',latencyFrames(),
 {question:'With 19 requests at 20 ms and one at 400 ms, nearest-rank p95 equals…',options:['20 ms','400 ms','Some unmeasured concurrency value'],answer:0,why:'For 20 observations nearest-rank p95 uses sorted index ceil(.95×20)=19, which is 20 ms; p99 selects the slowest 400 ms.'},'Performance distributions and benchmarking; fully synthetic data'),
 scene('c4-sql','transaction','Atomic transfers prevent partial committed value loss','Trace committed and tentative balances across failure and successful transfer paths.',transactionFrames(),
 {question:'Why is a single transaction safer for a debit and credit?',options:['It makes both statements faster','Both effects commit together or roll back','It automatically guarantees no concurrent anomalies ever'],answer:1,why:'Atomicity groups the writes so either both become durable or neither does; isolation level and concurrent correctness are separate issues.'},'SQL transaction atomicity; illustrative ledger'),
 scene('c4-apis','retry','A timeout after commit is an unknown outcome','Replay a create request with the same versus different idempotency key.',retryFrames(),
 {question:'A response is lost after a create committed. Which retry avoids a second order?',options:['Fresh key for every attempt','Reuse durable idempotency key','Assume the first request never committed'],answer:1,why:'A durable atomic receipt lets the server return the original result when the same key is retried; a new key can create another side effect.'},'HTTP idempotency and durable receipts; conceptual server model'),
 scene('c4-failures','race','Two increments can result in only one','Compare a lost-update schedule with an explicitly protected critical section.',raceFrames(),
 {question:'Why can two unprotected increments result in a counter of 1?',options:['Both workers read 0 before either writes','The integer has maximum value 1','The workers ran on the same machine'],answer:0,why:'Two independent read-modify-write operations can interleave so that both compute 0+1 and one overwrites the other, losing an increment.'},'Concurrency and race conditions; deterministic interleaving model')
];
function validate(){
 if(scenes.length!==6)throw Error('Expected six C4 scenes');
 const ids=new Set();
 for(const s of scenes){
  if(ids.has(s.id)||s.frames.length<4||!s.challenge||s.challenge.options.length!==3||!s.source)throw Error('Invalid systems scene '+s.id);
  ids.add(s.id);
  for(const f of s.frames)if(!f.label||f.explain.length<55)throw Error('Incomplete systems frame '+s.id+' / '+f.label);
 }
 return true;
}
function framesFor(s,param){
 switch(s.kind){
  case 'dedup':return dedupFrames(param);
  case 'review':return gitFrames(param);
  case 'latency':return latencyFrames(param);
  case 'transaction':return transactionFrames(param);
  case 'retry':return retryFrames(param);
  case 'race':return raceFrames(param);
  default:throw Error('Unknown C4 scene '+s.kind);
 }
}
function challengeFor(s,param){
 if(s.kind==='latency'){
  const f=latencyFrames(param).at(-1);
  return {question:'For this '+f.n+'-request workload, what is the measured nearest-rank p95?',
   options:[f.p95+' ms','p99 rank '+Math.ceil(.99*f.n)+' (not p95)','throughput '+f.throughput+' requests/s (not a latency)'],
   answer:0,why:'Sort the '+f.n+' observed durations and pick one-based rank ceil(.95×'+f.n+') = '+Math.ceil(.95*f.n)+'. That observation equals '+f.p95+' ms; do not substitute p99 or throughput.'};
 }
 if(s.kind==='dedup'){
  const f=dedupFrames(param).at(-1);
  const amount=f.totals.AAPL||0;
  return {question:'After this '+(param.dedup==='durable'?'first-write-wins':'naive')+' replay of the '+param.tape+' tape, what AAPL quantity is recorded?',
   options:[String(amount),String(amount+1),String(amount+10)],answer:0,
   why:'Follow the IDs, not just the symbol. This modeled pipeline records '+amount+' AAPL units; '+(param.dedup==='durable'?'the repeated ID is ignored.':'the repeated payload may be incorrectly counted.')};
 }
 return s.challenge;
}
const api={allowed,scenes,eventsFor,dedupFrames,gitFrames,maxWindow,fixtures,workloadFor,latencyFrames,percentile,transactionFrames,retryFrames,raceFrames,framesFor,challengeFor,validate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.MasterySystemsVisuals=api;
})(typeof window!=='undefined'?window:globalThis);

'use strict';
const assert=require('node:assert/strict');
const systems=require('../visual-systems.js');
const bank=require('../visual-scenes.js');
const engine=require('../visual-engine.js');
const academy=require('../foundation-data.js');
assert.equal(systems.validate(),true);
assert.equal(systems.scenes.length,6);
assert.equal(bank.scenes.length,27);
assert.equal(engine.sceneCount,27);
for(const scene of systems.scenes){
 assert.equal(academy.chapter(scene.id).module.id,'C4','C4 coverage must be complete: '+scene.id);
 assert(scene.frames.length>=4,scene.id+' lacks states');
 const ids=new Set(scene.frames.map(f=>f.phase||f.stage||f.step||f.focus));
 assert(ids.size>=3,scene.id+' repeats all state transitions');
 for(const frame of scene.frames){
  const svg=engine.renderShape(scene,frame);
  assert(svg.includes('role="img"')&&svg.includes('<desc id=')&&svg.includes('<title id='),scene.id+' accessible SVG');
  assert(!/<script\b/i.test(svg),scene.id+' has unsafe markup');
 }
}
const add=(xs)=>xs.reduce((a,b)=>a+b,0),sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
let tapes=0;
for(const tape of systems.allowed.tape)for(const dedup of systems.allowed.dedup){
 tapes++;
 const frames=systems.dedupFrames({tape,dedup});
 const ids=new Set(),totals={};
 for(let i=1;i<frames.length;i++){
  const event=frames[i].current;
  assert.equal(frames[i].step,i);
  const first=!ids.has(event.id);
  if(first||dedup==='naive')totals[event.symbol]=(totals[event.symbol]||0)+event.qty;
  ids.add(event.id);
  assert.deepEqual(frames[i].seen,[...ids]);
  assert.deepEqual(frames[i].totals,totals);
  assert.equal(frames[i].accepted,first||dedup==='naive');
 }
 const last=frames.at(-1);
 assert.equal(last.totals.AAPL,dedup==='durable'?17:(tape==='duplicate'?1016:17));
 assert.equal(last.totals.MSFT,dedup==='durable'?5:(tape==='duplicate'?5:905));
 const question=systems.challengeFor(systems.scenes[0],{tape,dedup});
 assert(question.options[question.answer]===String(last.totals.AAPL));
 assert.equal(new Set(question.options).size,3);
}
for(const fixture of systems.allowed.fixture){
 const f=systems.gitFrames(fixture),last=f.at(-1);
 const values=last.input.values,expected=Math.max(...values);
 assert.equal(last.expected,expected);
 assert.equal(last.corrected,last.expected);
 assert.equal(last.observed,Math.max(0,expected));
 assert.equal(last.passes,expected>=0);
 assert(f.some(x=>x.phase==='bug')&&f.some(x=>x.phase==='patch'));
}
for(const workload of systems.allowed.workload){
 const f=systems.latencyFrames(workload).at(-1);
 assert.equal(f.n,f.latencies.length);
 assert.deepEqual(f.sorted,[...f.latencies].sort((a,b)=>a-b));
 assert.equal(sum(Object.fromEntries(f.buckets.map(x=>[x.ms,x.count]))),f.n);
 const rank=p=>f.sorted[Math.ceil(p*f.n)-1];
 assert.equal(f.p50,rank(.5));assert.equal(f.p95,rank(.95));assert.equal(f.p99,rank(.99));
 assert.equal(f.avg,add(f.latencies)/f.n);
 assert.equal(f.throughput,f.n/(f.intervalMs/1000));
 assert(f.p50<=f.p95&&f.p95<=f.p99);
 const q=systems.challengeFor(systems.scenes[2],workload);
 assert.equal(q.options[q.answer],f.p95+' ms');
 assert.equal(new Set(q.options).size,3);
}
assert.equal(systems.latencyFrames('tail').at(-1).p95,20);
assert.equal(systems.latencyFrames('tail').at(-1).p99,400);
assert.equal(systems.latencyFrames('burst').at(-1).p95,50);
assert.equal(systems.latencyFrames('burst').at(-1).p99,400);
for(const transaction of systems.allowed.transaction)for(const failure of systems.allowed.failure){
 const f=systems.transactionFrames({transaction,failure});
 assert.equal(f.length,4);
 const initial=f[0],end=f.at(-1),atomic=transaction==='atomic';
 assert.deepEqual(initial.committed,{A:100,B:50});
 assert.equal(f[1].committed.A,atomic?100:70);
 assert.deepEqual(f[1].tentative,atomic?{A:70,B:50}:null);
 if(failure==='crash'){
  assert.deepEqual(end.committed,atomic?{A:100,B:50}:{A:70,B:50});
  assert.equal(end.conserved,atomic);
 }else{
  assert.deepEqual(end.committed,{A:70,B:80});
  assert(end.conserved);
  if(atomic)assert.deepEqual(f[2].committed,{A:100,B:50});
 }
 for(const x of f)assert.equal(x.conserved,x.committed.A+x.committed.B===150);
}
for(const retry of systems.allowed.retry){
 const f=systems.retryFrames(retry),end=f.at(-1),stable=retry==='stable';
 assert.equal(f.length,5);assert.equal(f[1].orders,1);assert.equal(f[2].orders,1);
 assert.equal(f[2].acknowledged,false);
 assert.equal(end.orders,stable?1:2);
 assert.equal(end.keys.length,stable?1:2);
 assert.equal(end.acknowledged,true);
}
for(const race of systems.allowed.race){
 const f=systems.raceFrames(race),end=f.at(-1),safe=race==='locked';
 assert.equal(f.length,6);
 assert.deepEqual(f[1].reads,{A:0});
 assert.deepEqual(f[2].reads,safe?{A:0}:{A:0,B:0});
 assert.equal(f[4].reads.B,safe?1:0);
 assert.equal(end.value,safe?2:1);
 assert.equal(end.lost,!safe);
}
console.log('PASS: 6 C4 visual models with verified event tapes, first-write-wins receipts, deterministic regression fixtures, nearest-rank p50/p95/p99 and throughput, atomic rollback, retry receipt semantics and lost-update/locked schedules.');

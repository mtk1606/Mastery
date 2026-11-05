'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {Venue,Fanout,tape,replayScenario}=require('../phase5-sim.js');
const original=new Venue();
for(const e of tape)assert(original.apply(e).accepted);
assert.equal(original.fingerprint(),'780225790431407597');
assert.equal(original.seq,10);
const first=new Venue();for(const e of tape.slice(0,5))first.apply(e);
const checkpoint=first.checkpoint();
const nativeFixture=fs.readFileSync(path.join(__dirname,'../phase5/fixtures/checkpoint.txt'),'utf8');
assert.equal(checkpoint,nativeFixture,'C++ and JS checkpoint serialization must be byte-for-byte equal');
const restored=new Venue();restored.restore(nativeFixture);
assert.equal(restored.canonical(),first.canonical());
for(const e of tape.slice(5))assert(restored.apply(e).accepted);
assert.equal(restored.canonical(),original.canonical());
const before=restored.canonical();
for(const damage of [nativeFixture.slice(0,-4),nativeFixture.replace('AAPL','ZAPL'),nativeFixture+'junk',nativeFixture.replace('3 S 101 4','3 S 101 0')]){
 assert.throws(()=>restored.restore(damage));assert.equal(restored.canonical(),before,'must restore atomically');
}
assert.equal(restored.apply({...tape[0],seq:11,epoch:2}).reason,'UNKNOWN_EPOCH');
assert.equal(restored.promote(2),true);
assert.equal(restored.apply({...tape[0],seq:11}).reason,'FENCED_EPOCH');
assert.equal(restored.apply({...tape[0],seq:12,epoch:2}).reason,'SEQ_GAP_OR_REPLAY');
assert.equal(restored.seq,10);
assert.equal(restored.apply({...tape[0],seq:11,epoch:2,id:11}).accepted,true);
assert.equal(restored.apply({...tape[0],seq:11,epoch:2,id:11}).reason,'SEQ_GAP_OR_REPLAY');
for(const mode of ['normal','gap','duplicate','corrupt','stale']){
 const {frames}=replayScenario(mode);assert(frames.length>0);assert(frames.every(f=>f.snapshot && typeof f.snapshot.hash==='string'));
}
assert.equal(replayScenario('normal').frames.find(f=>f.snapshot.seq===10)?.snapshot.hash,'780225790431407597');
assert.equal(replayScenario('corrupt').frames[0].ok,false);
assert.equal(replayScenario('gap').frames.at(-1).message,'SEQ_GAP_OR_REPLAY');
const fanout=new Fanout(1);
assert.equal(fanout.publish(),'ACCEPTED');
assert.equal(fanout.publish(),'BACKPRESSURE');assert.equal(fanout.seq,1);
assert.equal(fanout.drain('slow'),1);
assert.equal(fanout.publish(),'BACKPRESSURE'); // fast is still full, no partial enqueue
assert.equal(fanout.drain('fast'),1);
assert.equal(fanout.publish(),'ACCEPTED');assert.equal(fanout.seq,2);
let seed=0xC0FFEE;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
const stress=new Venue();let successes=0;
for(let i=1;i<=4000;i++){
 const r=random();let type=i%13===0?'cancel':i%7===0?'market':'limit';
 const sym=(r&1)?'AAPL':'MSFT';let e={epoch:1,seq:i,symbol:sym,kind:type,id:type==='cancel'?1+(r%100):10000+i,side:(r&2)?'buy':'sell',price:100+(r%10),qty:1+r%30};
 let result=stress.apply(e);if(result.accepted)successes++;
 assert(stress.invariant());
 if(i%500===0){const cp=stress.checkpoint(),other=new Venue();other.restore(cp);assert.equal(other.canonical(),stress.canonical());}
}
assert.equal(stress.seq,4000);
console.log('PHASE V JS PASS: golden cross-language snapshot, recovery, corrupt rejection, epoch fencing, queue atomicity and 4000 seeded invariant cases; successful events '+successes);
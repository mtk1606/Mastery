'use strict';
const assert=require('node:assert/strict'),core=require('../phase10-core.js');
let plans=0,checks=0;
for(const track of Object.keys(core.TRACKS))for(const duration of [45,90,120])for(const run of [1,2,7,11]){
 const tasks=core.plan(track,duration,run,[]);
 assert.equal(tasks.length,duration===45?3:duration===90?5:6);
 assert.equal(tasks.filter(x=>x.kind==='code').length,1);
 assert.equal(new Set(tasks.map(x=>x.id)).size,tasks.length);
 for(const t of tasks.filter(x=>x.kind==='numeric'))for(const f of ['answer','strongAnswer','repairAnswer']){
  assert(Number.isFinite(t[f]),t.id+' '+f);
  assert(core.gradeNumber(String(t[f]),t[f]).ok);
  assert(!core.gradeNumber(String(t[f]+30),t[f]).ok);checks++;
 }
 plans++;
}
for(const id of Object.keys(core.TRACKS).flatMap(k=>core.TRACKS[k].pool))for(let seed=1;seed<=90;seed++){
 const t=core.makeTask(id,seed,seed%3+1);
 for(const name of ['answer','strongAnswer','repairAnswer'])assert(Number.isFinite(t[name]),id+' '+name);
 if(['urn','bayes','tail','retry','multiple','poisson'].includes(id))assert(t.answer>=0&&t.answer<=100,id+' probability');
 if(id==='cache'||id==='stderr')assert(t.answer>0);
 checks++;
}
assert.equal(core.adaptiveLevel('urn',[{id:'urn',kind:'numeric',initialOk:true},{id:'urn',kind:'numeric',initialOk:true}]),2);
assert.equal(core.adaptiveLevel('urn',[{id:'urn',kind:'numeric',initialOk:false},{id:'urn',kind:'numeric',initialOk:true}]),1);
for(const x of ['', 'NaN', '12%', '0x10','Infinity','1e3'])assert.equal(core.gradeNumber(x,1).valid,false,x);
console.log('PASS: '+plans+' seeded track plans; '+checks+' formula/check assertions; branch choices; adaptive-level controls');

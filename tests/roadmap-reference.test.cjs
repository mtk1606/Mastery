'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const api=require('../roadmap-data.js'),labs=require('../python-lab-data.js');
assert.equal(api.validate(),true);
assert.equal(labs.validate(),true);
assert.equal(api.stages.length,23);
assert.equal(labs.tasks.length,10);
assert(labs.tasks.every(t=>/^C[0-4]$/.test(t.foundationStage)),'Each Python exercise must be assigned to its Foundation stage');
assert.deepEqual([...new Set(labs.tasks.map(t=>t.foundationStage))],['C0','C1','C2','C3','C4']);
const shared=api.forTrack('quant').slice(0,5).map(s=>s.id);
assert.deepEqual(api.forTrack('ml').slice(0,5).map(s=>s.id),shared);
assert.deepEqual(api.forTrack('swe').slice(0,5).map(s=>s.id),shared);
for(const [track,details] of Object.entries(api.tracks)){
 const path=api.forTrack(track);
 assert.equal(path.length,11,track+' path must have 11 stages');
 assert.deepEqual(path.slice(0,5).map(s=>s.id),['C0','C1','C2','C3','C4']);
 const count=path.reduce((acc,s)=>acc+s.topics.length,0);
 assert(count>=57,track+' missing detailed concept coverage: '+count);
 assert(path.every(s=>s.topics.length>=5&&s.resources.length&&s.exam.reason&&s.exam.implement&&s.exam.defend&&s.exam.transfer));
}
for(const stage of api.stages){
 for(const source of stage.resources)if(!/^https?:/.test(source.href)){
  const file=source.href.split('#')[0];
  assert(fs.existsSync(path.resolve(__dirname,'..',file)),stage.id+' references missing file '+file);
 }
 if(stage.lab)assert(labs.lookup(stage.lab),'Missing Python lab for '+stage.id);
}
const all=new Set(labs.tasks.map(s=>s.id));
assert.equal(all.size,labs.tasks.length);
assert(labs.tasks.every(s=>s.cases.length>=8&&s.hints.length===2));
for(const task of labs.tasks){
 assert(task.starter.includes('def '+task.fn+'('),task.id+' missing named starter');
 assert(task.solution.includes('def '+task.fn+'('),task.id+' missing named reference solution');
 for(const test of task.cases){assert(Array.isArray(test.args));assert(Object.prototype.hasOwnProperty.call(test,'expected'));}
}
for(const name of ['roadmap.html','python-lab.html']){
 const s=fs.readFileSync(path.resolve(__dirname,'..',name),'utf8');
 assert(s.includes('theme.js')&&s.includes('mastery-polish.css'));
 assert(s.includes('roadmap.html')&&s.includes('focus.html')&&s.includes('python-lab.html'));
}
const worker=fs.readFileSync(path.resolve(__dirname,'..','python-lab-worker.js'),'utf8');
assert(worker.includes('loadPyodide')&&worker.includes('runPythonAsync'),'Lab must execute real Python');
assert(worker.includes('pyodide/v0.27.7'),'Pin real Python runtime version');
const app=fs.readFileSync(path.resolve(__dirname,'..','python-lab.js'),'utf8');
assert(app.includes('source!==document.getElementById'),'Stale code results must not earn credit');
assert(app.includes('delete state.passes[selected]'),'Source change must invalidate prior passes');
console.log('PASS: 23 stage records; three 11-stage A–Z career tracks; 10 real Python exercises with '+labs.tasks.reduce((x,t)=>x+t.cases.length,0)+' inspectable cases; all internal references resolvable.');
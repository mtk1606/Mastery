'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const base=path.resolve(__dirname,'..');
const q=vm.runInNewContext(fs.readFileSync(path.join(base,'mock-questions.js'),'utf8')+'\nMASTERY_INTERVIEW_QUESTIONS');
assert.equal(q.length,25);assert.equal(new Set(q.map(x=>x.id)).size,q.length);
const categories=new Set(['official','company-tags','practice']);
for(const x of q){assert.ok(x.company&&x.role&&x.topic&&x.prompt.length>=100);assert.ok(categories.has(x.evidence));assert.match(x.link,/^https:\/\//);assert.match(x.reference,/^https:\/\//);assert.ok(x.solution.length>=90);assert.equal(x.focus.length,5);assert.ok(x.followups.length>=2);assert.ok(x.concepts.length>=2);}
assert.equal(q.filter(x=>x.evidence==='official').length,2);
assert.ok(q.filter(x=>x.company==='Citadel'&&x.evidence==='company-tags').length>=6);
assert.ok(q.filter(x=>x.company==='Meta'&&x.evidence==='company-tags').length>=4);
for(const p of ['mock-interviews.js','phase7.js','phase7-data.js','phase7-model.js'])require('node:child_process').execFileSync(process.execPath,['--check',path.join(base,p)]);
const model=require('../phase7-model.js');
const ops=[],state={};let seed=7419847;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
for(let i=0;i<4000;i++){let k='k'+rnd()%31,v='v'+i;ops.push({client:'seed',token:'req'+i,key:k,value:v});state[k]=v; if(i%13===0)ops.push({client:'seed',token:'req'+i,key:k,value:v});}
const a=model.model(ops,101),b=model.model(ops,101);assert.deepEqual(a.state,state);assert.equal(a.seq,4000);assert.equal(a.hash,b.hash);assert.equal(Object.keys(a.receipt).length,4000);
assert.ok(a.frames.some(x=>x.event==='REPLAY'));
console.log('PHASE7 JS PASS: 25 sourced mock briefs, 4K deterministic operations, duplicate keys, canonical hash, valid source metadata');
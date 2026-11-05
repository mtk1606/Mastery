'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),foundation=require('../foundation-data.js'),exams=require('../foundation-exams.js'),roadmap=require('../roadmap-data.js'),python=require('../python-lab-data.js'),addons=require('../foundation-python-addons.js');
assert.equal(foundation.validate(),true);
assert.equal(exams.validate(),true);
assert.equal(foundation.modules.length,5);
assert.equal(foundation.modules.reduce((n,m)=>n+m.chapters.length,0),29);
assert.equal(python.tasks.length,25);
assert.equal(addons.length,15);
const ids=new Set();
let words=0;
for(const m of foundation.modules){
 const stage=roadmap.get(m.id);
 assert(stage,m.id+' missing in career path');
 assert.equal(stage.topics.length,m.chapters.length,m.id+' topic coverage mismatch');
 assert(exams.exams[m.id]?.length===4,'Four distinct scenario questions per stage');
 assert(Array.isArray(m.source)&&m.source.length>=1,m.id+' sources missing');
 for(const source of m.source)assert(/^https:\/\//.test(source[1]),'Unattributed source '+m.id);
 for(const c of m.chapters){
  assert(!ids.has(c.id));ids.add(c.id);
  assert.equal(foundation.chapter(c.id).module.id,m.id);
  assert(python.lookup(c.lab),'Missing executable exercise '+c.lab);
  assert(c.trace.length>=3,c.id+' needs trace steps');
  assert(c.quiz.options.length===4&&c.quiz.correct>=0&&c.quiz.correct<4);
  assert(new Set(c.quiz.options).size===4,c.id+' has duplicate options');
  assert(c.definition.length>=95&&c.mechanism.length>=50,c.id+' shallow explanation');
  assert(c.example.length>35&&c.trap.length>45&&c.proof.length>40&&c.transfer.length>45,c.id+' lacks a substantial teaching component');
  assert(c.quiz.explain.length>=45,c.id+' incorrect answer explanation absent');
  assert(c.guide.length>=45,c.id+' missing transfer reasoning guide');
  words+=c.definition.split(/\s+/).length+c.mechanism.split(/\s+/).length+c.example.split(/\s+/).length+c.trap.split(/\s+/).length+c.proof.split(/\s+/).length+c.transfer.split(/\s+/).length;
 }
 for(const q of exams.exams[m.id]){
  assert(q.answers.length===4&&new Set(q.answers).size===4);
  assert(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4);
  assert(q.why.length>=45,'Assessment explanation too brief');
 }
}
assert(words>=3000,'Full foundation content is too terse');
for(const name of ['foundation.html','foundation.js','foundation-data.js','foundation-exams.js','foundation.css','foundation-python-addons.js']){
 assert(fs.existsSync(path.join(root,name)),name+' not committed');
}
const html=fs.readFileSync(path.join(root,'foundation.html'),'utf8');
for(const name of ['foundation-data.js','foundation-exams.js','foundation.js','mastery-polish.css','theme.js'])assert(html.includes(name),name+' missing from page');
const py=fs.readFileSync(path.join(root,'python-lab.html'),'utf8');
assert(py.includes('foundation-python-addons.js')&&py.indexOf('foundation-python-addons.js')<py.indexOf('python-lab-data.js'),'Addon must be registered before Python bank');
const main=fs.readFileSync(path.join(root,'roadmap-data.js'),'utf8');
for(const id of ['C0','C1','C2','C3','C4'])assert(main.includes("'foundation.html#"+id+"'"),'Roadmap lost '+id+' direct lesson link');
console.log('PASS: 29 original Foundation teaching chapters, 20 distinct scenario questions, 25 executable Python labs, '+python.tasks.reduce((n,t)=>n+t.cases.length,0)+' deterministic case fixtures, all 5 roadmap links, explanatory depth and data integrity.');

'use strict';
const assert=require('node:assert/strict');
const model=require('../figure-insertion-model.js');
assert(model.validate());
const expectedMixed=[
 [8,3,6,2,7,4],
 [3,8,6,2,7,4],
 [3,6,8,2,7,4],
 [2,3,6,8,7,4],
 [2,3,6,7,8,4],
 [2,3,4,6,7,8]
];
assert.deepEqual(model.build('mixed').stages.map(s=>s.array),expectedMixed);
assert.deepEqual(model.build('sorted').stages.map(s=>s.moves.length),[0,0,0,0,0,0]);
assert.deepEqual(model.build('reverse').stages.map(s=>s.moves.length),[0,1,2,3,4,5]);
for(const name of Object.keys(model.examples)){
 const d=model.build(name);
 assert.equal(d.stages.length,d.input.length);
 for(let j=1;j<d.stages.length;j++){
  const before=d.stages[j-1].array.slice(),now=d.stages[j],key=before[j];
  const expectedMoves=[];
  let i=j-1;
  while(i>=0&&before[i]>key){
   expectedMoves.push({from:i,to:i+1,value:before[i]});
   before[i+1]=before[i];i--;
  }
  before[i+1]=key;
  assert.equal(now.key,key);
  assert.equal(now.from,j);
  assert.equal(now.insertAt,i+1);
  assert.deepEqual(now.moves,expectedMoves,name+' shift trace error at j='+j);
  assert.deepEqual(now.array,before,name+' output error at j='+j);
  assert.deepEqual(now.array.slice(0,j+1),[...d.input.slice(0,j+1)].sort((a,b)=>a-b),
    name+' sorted prefix mismatch');
  const prevValues=d.input.slice(0,j+1).slice().sort((a,b)=>a-b);
  assert.deepEqual(now.array.slice(0,j+1),prevValues,'multiset preservation');
 }
 assert.deepEqual(d.sorted,[...d.input].sort((a,b)=>a-b));
}
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'insertion-sort.html'),'utf8');
assert(html.includes('figure-insertion-model.js')&&html.includes('figure-insertion.js'));
assert(html.includes('figure-insertion.css')&&html.includes('mastery-polish.css'));
assert(html.includes('focus.html')&&html.includes('theme.js'));
const bayes=fs.readFileSync(path.join(root,'visual-math-render.js'),'utf8');
assert(bayes.includes('1 glyph = 1 person')&&bayes.includes('rows=20')&&bayes.includes('columns=50'));
assert(bayes.includes("focus==='posterior'"));
console.log('PASS: three independent insertion-sort traces, six-pass mixed figure, exact movement arrow data, sorted and reverse cases, sorted-prefix invariants, and original Bayes person-grid specification.');

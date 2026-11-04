/* Repeatable reference checks for Mastery labs, without a browser or secret tokens. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({});
vm.runInContext(fs.readFileSync(__dirname+'/../labs-data.js','utf8')+'\nglobalThis.testLabs = LABS;',ctx);
const labs=ctx.testLabs;
let count=0;
for(const lab of labs){
 const fn=new Function('"use strict";\n'+lab.reference+'\nreturn solve;')();
 for(const t of lab.tests){
  let actual,passed;
  if(lab.id==='reverse-list'){
   let head=null,tail=null;const nodes=[];
   for(const val of t.input){const node={val,next:null};nodes.push(node);if(tail)tail.next=node;else head=node;tail=node;}
   const result=fn(head),seen=new Set(),arr=[],returned=[];
   let n=result;
   while(n!==null){assert.ok(n && typeof n==='object' && !seen.has(n),'cycle or bad node');seen.add(n);arr.push(n.val);returned.push(n);n=n.next;}
   passed=JSON.stringify(arr)===JSON.stringify(t.expected)&&returned.length===nodes.length&&returned.every((node,i)=>node===nodes[nodes.length-i-1]);
  }else{
   actual=fn(structuredClone(t.input));
   if(lab.id==='two-sum'){
    if(!t.expected)passed=Array.isArray(actual)&&actual.length===0;
    else passed=Array.isArray(actual)&&actual.length===2&&Number.isInteger(actual[0])&&Number.isInteger(actual[1])&&actual[0]!==actual[1]&&actual[0]>=0&&actual[1]>=0&&actual[0]<t.input.nums.length&&actual[1]<t.input.nums.length&&t.input.nums[actual[0]]+t.input.nums[actual[1]]===t.input.target;
   }else passed=JSON.stringify(actual)===JSON.stringify(t.expected);
  }
  assert.ok(passed,`Reference failure ${lab.id} / ${t.name}. got=${JSON.stringify(actual)} expected=${JSON.stringify(t.expected)}`);
  count++;
 }
 console.log(`PASS ${lab.id}: ${lab.tests.length} cases`);
}
assert.equal(labs.length,8,'Expected eight browser labs');
assert.equal(count,56,'Expected fifty-six deterministic reference cases');
console.log(`PASS total: ${labs.length} labs, ${count} cases`);
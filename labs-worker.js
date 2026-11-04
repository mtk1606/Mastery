/* User-authored JS executes in a fresh disposable Web Worker per run.
 * No server submission. Not an adversarial sandbox; do not paste secrets.
 */
'use strict';
const clone = value => structuredClone(value);
const eq = (a,b) => JSON.stringify(a)===JSON.stringify(b);
function listFrom(values){let head=null,tail=null;const nodes=[];for(const val of values){const n={val,next:null};nodes.push(n);if(tail)tail.next=n;else head=n;tail=n;}return {head,nodes};}
function checkPair(actual,input,expected){
 if(!expected) return Array.isArray(actual)&&actual.length===0;
 if(!Array.isArray(actual)||actual.length!==2)return false;
 const [a,b]=actual;
 return Number.isInteger(a)&&Number.isInteger(b)&&a!==b&&a>=0&&b>=0&&a<input.nums.length&&b<input.nums.length&&input.nums[a]+input.nums[b]===input.target;
}
function checkLinked(head,originalNodes,expected){
 const visited=new Set(),values=[],ids=[];let ptr=head;
 while(ptr!==null){if(!ptr||typeof ptr!=='object'||visited.has(ptr)||values.length>originalNodes.length)return {ok:false,output:'Invalid links or a cycle detected'};visited.add(ptr);values.push(ptr.val);ids.push(ptr);ptr=ptr.next;}
 const correct=eq(values,expected)&&ids.length===originalNodes.length&&ids.every((node,i)=>node===originalNodes[originalNodes.length-1-i]);
 return {ok:correct,output:values};
}
async function run({source,tests,id}){
 let solve;
 try{solve=new Function('"use strict";\n'+source+'\nreturn typeof solve === "function" ? solve : null;')();if(typeof solve!=='function')throw Error('Define function solve(input), matching the signature.');}
 catch(err){postMessage({type:'compile-error',message:String(err.message||err)});return;}
 const rows=[];const allStart=performance.now();
 for(const t of tests){
  let result,ok=false,error='',output;
  const started=performance.now();
  try{
   const input=clone(t.input);
   if(id==='reverse-list'){
    const list=listFrom(input);
    result=await solve(list.head);
    const checked=checkLinked(result,list.nodes,t.expected);
    ok=checked.ok;output=checked.output;
   }else{
    result=await solve(input);
    ok=id==='two-sum'?checkPair(result,input,t.expected):eq(result,t.expected);
    output=result;
   }
  }catch(err){error=String(err?.stack||err).slice(0,850);}
  rows.push({tier:t.tier,name:t.name,ok,error,actual:typeof output==='undefined'?'undefined':JSON.stringify(output).slice(0,400),expected:id==='two-sum'?(t.expected?'any distinct valid index pair':'[]'):JSON.stringify(t.expected).slice(0,400),ms:+(performance.now()-started).toFixed(3)});
 }
 postMessage({type:'results',rows,totalMs:+(performance.now()-allStart).toFixed(2)});
}
self.onmessage=event=>{if(event.data?.action==='run')run(event.data).catch(err=>postMessage({type:'compile-error',message:String(err)}));};
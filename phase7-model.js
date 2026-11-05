/* Pure reference model. Illustrated steps are not runtime traces of learner C++ code. */
(function(root, factory){const m=factory();if(typeof module==='object'&&module.exports)module.exports=m;else root.PHASE7_MODEL=m;})(typeof window==='undefined'?{}:window,()=>{
 const rules={status:(id,step)=>{
  const x=PHASE7_SCENARIOS.find(x=>x.id===id);return x?x.steps[Math.min(x.steps.length-1,Math.max(0,step))]:null;
 }};
 const checksum=s=>{let h=14695981039346656037n;for(const b of new TextEncoder().encode(s)){h=(h^BigInt(b))*1099511628211n&((1n<<64n)-1n);}return h.toString(16).padStart(16,'0');};
 function model(ops,compactEvery=4){const state={},receipt={},segments=[],frames=[];let seq=0,cp=0,current=[],currentStart=1;
  for(const op of ops){const id=op.client+':'+op.token,signature=op.key+':'+op.value;
   if(receipt[id]){if(receipt[id].signature!==signature){frames.push({event:'CONFLICT',seq,identity:id,checkpoint:cp});continue;}frames.push({event:'REPLAY',seq,identity:id,checkpoint:cp});continue;}
   seq++;receipt[id]={seq,signature};state[op.key]=op.value;current.push({seq,...op});frames.push({event:'COMMIT',seq,identity:id,checkpoint:cp});
   if(seq%compactEvery===0){segments.push({start:currentStart,end:seq,entries:current.slice()});cp=seq;current=[];currentStart=seq+1;frames.push({event:'COMPACT',seq,checkpoint:cp});}
  }
  return {seq,checkpoint:cp,state,receipt,segments:segments.length,frames,hash:checksum(JSON.stringify({seq,state,receipt}))};
 }
 return {model,checksum,rules};
});
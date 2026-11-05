/* Phase XIV-D: original six C4 systems/reliability diagrams from audited model states. */
(function(root){
'use strict';
const money=x=>String(x===null?'—':x);
function dedup(f,{R,T,L,C,P}){
 let o=T(45,30,'EVENT TAPE · ACCEPTED EVENTS AND IDENTITY','mv-kicker');
 f.events.forEach((e,i)=>{
  const y=51+i*59,processed=i<f.step,active=i===f.step-1;
  o+=R(48,y,441,51,active?'mv-selected':processed?'mv-visited':'mv-node',7);
  o+=T(64,y+20,'#'+(i+1)+'   '+e.id+' · '+e.symbol,'mv-strong');
  o+=T(64,y+42,'quantity '+e.qty,'mv-kicker');
 });
 o+=R(514,52,364,86,'mv-value-panel')+T(531,75,'SEEN EVENT IDS','mv-kicker');
 o+=T(531,105,f.seen.length?f.seen.join('  ·  '):'(none)','mv-sys-text');
 o+=R(514,150,364,90,'mv-value-panel')+T(531,174,'ACCEPTED QUANTITY BY SYMBOL','mv-kicker');
 o+=T(531,205,'AAPL: '+(f.totals.AAPL||0)+'   MSFT: '+(f.totals.MSFT||0),'mv-sys-value');
 o+=R(514,252,364,60,f.accepted===false?'mv-sys-bad':f.accepted===true?'mv-sys-good':'mv-node');
 o+=T(531,277,'CURRENT EVENT','mv-kicker');
 o+=T(531,302,f.accepted===null?'Not processed':f.accepted?'APPLIED':'SKIPPED (repeat ID)','mv-sys-status');
 o+=T(51,330,'Mode: '+(f.dedup==='durable'?'deduplicate by globally unique ID':'unsafe naive aggregation')+' · source: '+f.tape,'mv-note');
 return o;
}
function review(f,{R,T,L,C,P}){
 const names=['Contract','Bad result','Smallest patch','Retest','Explain in PR'];
 let o=T(45,34,'REPRODUCIBLE BUG REPORT · ILLUSTRATIVE LOCAL MODEL','mv-kicker');
 names.forEach((name,i)=>{
  const x=44+i*175,order=['spec','bug','patch','verify','review'],active=order.indexOf(f.phase)===i;
  o+=R(x,59,162,67,active?'mv-selected':'mv-node',8);
  o+=T(x+81,83,'0'+(i+1),'mv-kicker','middle')+T(x+81,107,name,'mv-sys-text','middle');
  if(i<4)o+=P(`M ${x+164} 93 L ${x+173} 93`,'mv-arrow');
 });
 o+=R(51,162,291,105,'mv-value-panel')+T(70,189,'INPUT FIXTURE','mv-kicker');
 o+=T(70,228,`[${f.input.values.join(', ')}]  ·  k = ${f.input.k}`,'mv-sys-value');
 o+=R(359,162,240,105,'mv-sys-bad')+T(378,189,'BUGGY best = 0','mv-kicker');
 o+=T(378,228,`returns ${f.observed}  ·  ${f.passes?'PASS':'FAIL'}`,'mv-sys-value');
 o+=R(616,162,254,105,'mv-sys-good')+T(634,189,'VALID WINDOW INIT','mv-kicker');
 o+=T(634,228,`returns ${f.corrected}`,'mv-sys-value');
 o+=T(51,306,`EXPECTED: ${f.expected}   ·   A passing positive fixture alone does not prove universal correctness.`,'mv-note');
 return o;
}
function latency(f,{R,T,L,C,P}){
 let o=T(48,35,'SYNTHETIC LATENCY MEASUREMENTS · NEAREST RANK','mv-kicker');
 const left=70,bottom=264,height=171;
 o+=L(left,bottom,513,bottom,'mv-edge')+L(left,65,left,bottom,'mv-edge');
 const max=Math.max(...f.buckets.map(b=>b.count),1),w=112,space=27;
 f.buckets.forEach((b,i)=>{
  const x=92+i*(w+space),h=b.count/max*height;
  o+=R(x,bottom-h,w,Math.max(h,2),(f.focus==='tail'&&b.ms===f.p99)?'mv-selected':'mv-sys-hist',5);
  o+=T(x+w/2,bottom-h-10,b.count+' requests','mv-kicker','middle');
  o+=T(x+w/2,bottom+25,b.ms+' ms','mv-sys-text','middle');
 });
 const fields=[['n · interval',f.n+' / '+f.intervalMs+' ms'],['p50',f.p50+' ms'],['p95',f.p95+' ms'],['p99',f.p99+' ms']];
 fields.forEach(([k,v],i)=>{
  const y=53+i*57;
  o+=R(557,y,310,49,(f.focus==='p50'&&i===1||f.focus==='tail'&&i>=2)?'mv-selected':'mv-value-panel',6);
  o+=T(576,y+18,k.toUpperCase(),'mv-kicker')+T(576,y+40,v,'mv-sys-text');
 });
 o+=R(557,287,310,42,'mv-value-panel',7)+T(573,314,'Throughput: '+f.throughput+' requests/s','mv-sys-text');
 o+=T(57,329,'Nearest rank: ceil(p × n). Averages and throughput are different metrics.','mv-note');
 return o;
}
function transaction(f,{R,T,L,C,P}){
 let o=T(48,32,'TRANSFER OF 30 UNITS · ATOMICITY BOUNDARY','mv-kicker');
 const tentative=f.tentative,nonconserved=!f.conserved;
 o+=R(56,66,397,161,nonconserved?'mv-sys-bad':'mv-value-panel');
 o+=T(76,96,'COMMITTED LEDGER · DURABLE','mv-kicker');
 o+=T(78,145,'A  '+f.committed.A,'mv-sys-number')+T(276,145,'B  '+f.committed.B,'mv-sys-number');
 o+=L(77,160,432,160,'mv-edge');
 o+=T(77,200,'TOTAL = '+(f.committed.A+f.committed.B),nonconserved?'mv-sys-warning':'mv-sys-text');
 o+=R(481,66,387,161,tentative?'mv-selected':'mv-value-panel');
 o+=T(501,96,'TENTATIVE / NOT YET COMMITTED','mv-kicker');
 o+=T(502,145,tentative?'A  '+tentative.A:'No provisional writes','mv-sys-text');
 o+=T(688,145,tentative?'B  '+tentative.B:'—','mv-sys-text');
 o+=T(501,202,tentative?'Commit requires both writes':'Committed ledger shown at left','mv-note');
 o+=P('M 248 241 L 693 241','mv-arrow');
 o+=R(59,261,809,62,nonconserved?'mv-sys-bad':f.phase==='complete'?'mv-sys-good':'mv-value-panel');
 o+=T(76,285,'STATE: '+f.status,'mv-kicker');
 o+=T(76,310,'Conservation: '+(f.conserved?'150 / 150 ✓':'violated: '+(f.committed.A+f.committed.B)+' / 150 ✕'),'mv-sys-text');
 return o;
}
function retry(f,{R,T,L,C,P}){
 let o=T(48,31,'CLIENT / SERVER / DURABLE RECEIPT · TIMEOUT AFTER COMMIT','mv-kicker');
 const cols=[{x:55,label:'CLIENT',sub:'request with key'},{x:365,label:'SERVER',sub:'create-or-replay'},{x:674,label:'DURABLE STORE',sub:'receipt + side effect'}];
 cols.forEach(({x,label,sub},i)=>{
  o+=R(x,61,247,152,f.stage==='retry'&&i===1?'mv-selected':'mv-node',9);
  o+=T(x+18,88,label,'mv-kicker')+T(x+18,112,sub,'mv-sys-text');
  o+=T(x+18,151,i===0?'retry: '+f.retry:i===1?'orders: '+f.orders:'ids: '+f.keys.length,'mv-sys-value');
  o+=T(x+18,186,i===0?'response '+(f.acknowledged?'received':'unknown'):i===1?'model stage: '+f.stage:'atomic receipt required','mv-note');
 });
 o+=P('M 303 121 L 359 121','mv-arrow')+P('M 611 121 L 666 121','mv-arrow');
 const duplicate=f.orders===2,stage=f.stage;
 o+=R(55,239,815,79,duplicate?'mv-sys-bad':stage==='final'?'mv-sys-good':'mv-value-panel');
 o+=T(77,268,duplicate?'DUPLICATE SIDE EFFECT':stage==='lost'?'RESPONSE LOST AFTER COMMIT':'CURRENT OUTCOME','mv-kicker');
 o+=T(77,302,'Order count: '+f.orders+'  ·  Known keys: '+(f.keys.join(', ')||'(none)'),'mv-sys-text');
 return o;
}
function race(f,{R,T,L,C,P}){
 let o=T(52,31,'TWO WORKERS · SINGLE SHARED COUNTER','mv-kicker');
 const workers=[{name:'WORKER A',x:55,value:f.reads.A},{name:'WORKER B',x:627,value:f.reads.B}];
 workers.forEach(w=>{
  const owns=f.owner===w.name.slice(-1);
  o+=R(w.x,69,247,156,owns?'mv-selected':'mv-node',10);
  o+=T(w.x+18,99,w.name,'mv-kicker');
  o+=T(w.x+18,144,'local read','mv-sys-text');
  o+=T(w.x+18,186,w.value===undefined?'waiting':w.value,'mv-sys-number');
 });
 o+=P('M 310 153 L 373 153','mv-arrow')+P('M 618 153 L 555 153','mv-arrow');
 o+=R(379,95,174,115,f.phase==='final'&&f.lost?'mv-sys-bad':'mv-selected',12);
 o+=T(394,126,'SHARED COUNTER','mv-kicker')+T(466,182,f.value,'mv-sys-number','middle');
 const safe=f.mode==='locked';
 o+=R(55,251,817,72,f.phase==='final'&&f.lost?'mv-sys-bad':f.phase==='final'?'mv-sys-good':'mv-value-panel');
 o+=T(75,281,'EXPECTED AFTER TWO INCREMENTS: 2','mv-kicker');
 o+=T(75,310,'ACTUAL: '+f.value+'   ·   '+(safe?'serialized critical section':'unprotected read → compute → write'),'mv-sys-text');
 return o;
}
const maps={dedup,review,latency,transaction,retry,race};
const api={kinds:Object.keys(maps),render:(scene,frame,h)=>{
 const f=maps[scene.kind];if(!f)throw Error('Unknown systems diagram '+scene.kind);return f(frame,h);
}};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.MasterySystemsRender=api;
})(typeof window!=='undefined'?window:globalThis);

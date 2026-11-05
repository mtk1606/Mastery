/* Original algorithm plates inspired by textbook layout, never copied figures.
 * Shows the ENTIRE sequence together. Numerical truth comes from the local trace.
 */
(function(root){
'use strict';
const model=root.MasteryAlgorithmPlateModel||(typeof module!=='undefined'&&require('./figure-algorithm-model.js'));
if(!model||!model.validate())throw Error('Invalid algorithm plate models');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rect=(x,y,w,h,cls,rx=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}"/>`;
const text=(x,y,value,cls='plate-note',anchor='start')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(value)}</text>`;
const path=(d,cls='plate-guide')=>`<path d="${d}" class="${cls}"/>`;
const line=(x1,y1,x2,y2,cls='plate-guide')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
function n(x){return Number(x).toFixed(1);}
const defs=`<defs>
 <marker id="plateInkArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#605a52"/></marker>
 <marker id="plateBrassArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#986d3c"/></marker>
 </defs>`;
function drawWindow(f){
 const {values,k,left,total,best}=f,cw=44,gap=9,x0=72,y=56;
 let out='';
 values.forEach((v,i)=>{
  const x=x0+i*(cw+gap),inside=i>=left&&i<left+k;
  out+=text(x+cw/2,47,i,'plate-index','middle');
  out+=rect(x,y,cw,43,inside?'plate-cell-focus':'plate-cell-idle');
  out+=text(x+cw/2,y+28,v,'plate-cell-number','middle');
 });
 const start=x0+left*(cw+gap),end=x0+(left+k-1)*(cw+gap)+cw;
 out+=path(`M ${start} 105 v 9 H ${end} v -9`,'plate-bracket');
 out+=text((start+end)/2,132,`[${left}, ${left+k}) · sum ${total}`,'plate-math','middle');
 if(left){
  const old=x0+(left-1)*(cw+gap)+cw/2,newX=x0+(left+k-1)*(cw+gap)+cw/2;
  out+=path(`M ${old} 102 Q ${old-5} 123 ${old-10} 104`,'plate-removed');
  out+=path(`M ${newX+9} 104 Q ${newX+16} 123 ${newX} 103`,'plate-added');
 }
 out+=text(301,76,'best = '+best,'plate-small-strong');
 out+=text(301,97,left===0?'Initialize':'−'+f.out+'  +'+f.in,'plate-note');
 out+=text(22,157,'Invariant: sum equals the bracketed contiguous cells.','plate-small');
 return out;
}
function drawBinary(f){
 const {values,lo,hi,mid,target,result}=f,x0=48,y=59,cw=43,gap=9;
 let out='';
 values.forEach((v,i)=>{
  const x=x0+i*(cw+gap),candidate=i>=lo&&i<hi;
  out+=text(x+cw/2,50,i,'plate-index','middle');
  out+=rect(x,y,cw,43,i===mid?'plate-cell-key':candidate?'plate-cell-focus':'plate-cell-discard');
  out+=text(x+cw/2,87,v,i===mid?'plate-cell-invert':'plate-cell-number','middle');
  if(i===mid)out+=text(x+cw/2,34,'mid','plate-small-strong','middle');
 });
 const left=x0+lo*(cw+gap)-2,right=x0+hi*(cw+gap)-gap+4;
 out+=path(`M ${left} 110 v 9 H ${right} v -9`,'plate-bracket');
 out+=text(Math.min(350,(left+right)/2),137,`[lo,hi) = [${lo},${hi})`,'plate-math','middle');
 if(mid!==null){
  const v=values[mid],qualifies=v>=target;
  out+=text(310,78,`${v} ${qualifies?'≥':'<'} ${target}`,'plate-math');
  out+=text(310,98,qualifies?'keep mid':'discard mid','plate-small-strong');
 }else{
  out+=text(306,77,'STOP','plate-small-strong');
  out+=text(306,99,result===-1?'no match':'index '+result,'plate-math');
 }
 out+=text(22,159,'Invariant: the first qualifying index stays in [lo, hi].','plate-small');
 return out;
}
function drawBFS(f){
 const nodes={A:[78,91],B:[174,63],C:[174,119],D:[278,92]},edges=[['A','B'],['A','C'],['B','D'],['C','D']];
 let out='';
 for(const [u,v] of edges){
  const [sx,sy]=nodes[u],[tx,ty]=nodes[v],dx=tx-sx,dy=ty-sy,length=Math.sqrt(dx*dx+dy*dy);
  const a=20,b=24;
  out+=path(`M ${n(sx+dx/length*a)} ${n(sy+dy/length*a)} L ${n(tx-dx/length*b)} ${n(ty-dy/length*b)}`,'plate-edge');
 }
 for(const [u,[x,y]] of Object.entries(nodes)){
  const isVisited=f.visited.includes(u),inQueue=f.queue.includes(u);
  const cls=inQueue?'plate-vertex-queued':isVisited?'plate-vertex-visited':'plate-vertex-idle';
  out+=`<circle cx="${x}" cy="${y}" r="19" class="${cls}"/>`;
  out+=text(x,y+6,u,'plate-vertex-label','middle');
  out+=text(x,y+31,Number.isInteger(f.distance[u])?'d='+f.distance[u]:'∞','plate-index','middle');
 }
 out+=text(315,69,`expand ${f.active}`,'plate-small-strong');
 out+=text(315,88,`seen: ${f.visited.join(',')||'none'}`,'plate-small');
 out+=text(22,161,`FIFO   front →  ${f.queue.join('   →   ')||'(empty)'}`,'plate-math');
 return out;
}
function drawDP(f){
 const x0=41,y=67,cw=40,gap=10,amounts=f.dp.length;
 let out='';
 out+=text(29,33,'allowed coins: '+(f.coins.join(', ')||'none (base case)'),'plate-small-strong');
 f.dp.forEach((value,s)=>{
  const x=x0+s*(cw+gap);
  out+=text(x+cw/2,58,'s='+s,'plate-index','middle');
  out+=rect(x,y,cw,43,s===f.focus?'plate-cell-key':'plate-cell-idle');
  out+=text(x+cw/2,95,value,s===f.focus?'plate-cell-invert':'plate-cell-number','middle');
 });
 const lastCoin=f.coins.at(-1);
 if(lastCoin!==undefined){
  const t=f.transitions?.find(t=>t.amount===f.focus);
  if(t){
   const from=x0+t.source*(cw+gap)+cw/2,to=x0+t.amount*(cw+gap)+cw/2;
   out+=path(`M ${from} 118 Q ${(from+to)/2} 148 ${to} 118`,'plate-dependency');
   out+=text(34,156,`ways[${t.amount}] = ${t.before} + ways[${t.source}] (${t.addition}) = ${t.after}`,'plate-math');
  }
 }else out+=text(35,153,'ways[0] = 1, the empty combination.','plate-math');
 out+=text(340,34,`dp[5] = ${f.dp[5]}`,'plate-small-strong');
 return out;
}
const drawByKind={window:drawWindow,binary:drawBinary,bfs:drawBFS,dp:drawDP};
const titles={
 window:'Sliding window · preserving the rolling sum',
 binary:'Lower bound · a shrinking half-open interval',
 bfs:'Breadth-first search · expanding in distance layers',
 dp:'Coin combinations · building a dynamic-programming table'
};
const legends={
 window:'Ochre = current window · bracket = exactly k consecutive indices · curved arrows = outgoing/incoming values.',
 binary:'Ochre = interval [lo,hi) · dark = midpoint being tested · light = discarded positions.',
 bfs:'Ochre = discovered frontier · grey = expanded nodes · arrows = directed edges · bottom line = FIFO queue.',
 dp:'Dark = currently illustrated DP cell · curved arrow = dependency on a smaller amount · totals count unordered combinations.'
};
const invariants={
 window:'The maintained sum equals precisely a[left] + … + a[left+k−1]. After each slide, the outgoing value is subtracted and the incoming one added. The best value is the maximum of all visited real windows.',
 binary:'The first position satisfying a[i] ≥ target remains inside the half-open candidate interval [lo,hi). Keep mid when it qualifies; otherwise discard it and all smaller indices. Verify equality after termination.',
 bfs:'Each vertex is discovered and enqueued at most once. FIFO ordering processes vertices in nondecreasing number of edges from the source; distances assigned at first discovery are shortest hop counts.',
 dp:'After processing each coin c, ways[s] counts unordered combinations using only the coins allowed so far. Ascending amount updates allow c to be reused, without counting permutations as different combinations.'
};
const programs={
 window:['total = sum(a[:k])','best = total','for right in range(k, len(a)):','    total += a[right] - a[right-k]','    best = max(best, total)'],
 binary:['lo, hi = 0, len(a)','while lo < hi:','    mid = (lo + hi) // 2','    if a[mid] >= target: hi = mid','    else: lo = mid + 1','return lo if lo < len(a) and a[lo] == target else -1'],
 bfs:['dist = {start: 0}; q = deque([start])','while q:','    u = q.popleft()','    for v in graph[u]:','        if v not in dist:','            dist[v] = dist[u] + 1','            q.append(v)'],
 dp:['ways = [1] + [0] * amount','for coin in coins:','    for s in range(coin, amount + 1):','        ways[s] += ways[s - coin]','return ways[amount]']
};
const codeLine={window:4,binary:3,bfs:5,dp:3};
function relevantLine(kind,f){
 if(kind==='window')return f.left===0?0:3;
 if(kind==='binary')return f.mid===null?5:(f.values[f.mid]>=f.target?3:4);
 if(kind==='bfs')return f.visited.length===0?0:f.queue.length===0?1:5;
 if(kind==='dp')return f.coins.length===0?0:3;
 return 0;
}
function render(scene,frames,index=0){
 const kind=scene.kind,draw=drawByKind[kind];if(!draw)throw Error('Missing plate kind '+kind);
 const count=frames.length,rows=Math.ceil(count/2),height=82+rows*193+53,position=Math.max(0,Math.min(index,count-1));
 let content=`<rect x="0" y="0" width="920" height="${height}" class="plate-page"/>`;
 content+=text(43,29,'FIGURE STUDY  /  '+kind.toUpperCase(),'plate-eyebrow');
 content+=text(875,29,'AN ORIGINAL COMPUTED TRACE · ZERO-BASED INDICES','plate-small','end');
 content+=line(42,43,878,43,'plate-rule');
 for(let i=0;i<count;i++){
  const f=frames[i],col=i%2,row=Math.floor(i/2),x=42+col*428,y=68+row*193;
  content+=`<g transform="translate(${x} ${y})" data-plate-panel="${i}" class="${i===position?'plate-panel-selected':'plate-panel-normal'}">`;
  content+=rect(0,0,408,180,'plate-panel-border',2);
  content+=rect(0,0,408,28,'plate-panel-header',1);
  content+=text(12,19,'('+String.fromCharCode(97+i)+')  '+(f.label||['First window','Move','Update','Finish'][i]||('State '+(i+1))),'plate-panel-title');
  content+=draw(f);
  content+='</g>';
 }
 const yFooter=69+rows*193+6;
 content+=line(42,yFooter-14,878,yFooter-14,'plate-rule');
 content+=text(44,yFooter+6,'DARKER BORDER = SELECTED STATE · EVERY ARROW CORRESPONDS TO A REAL TRANSITION','plate-small');
 const svg=`<svg class="mv-svg mv-plate-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 ${height}" role="img" aria-labelledby="plateTitle plateDesc" preserveAspectRatio="xMidYMin meet">
 <title id="plateTitle">${esc(titles[kind])}, ${count} textbook-like figure panels</title>
 <desc id="plateDesc">${esc('Original indexed-state illustration. '+legends[kind]+' Selected state '+(position+1)+': '+frames[position].explain)}</desc>
 ${defs}${content}</svg>`;
 const selected=frames[position],highlight=relevantLine(kind,selected);
 const code=programs[kind].map((s,i)=>`<span class="mv-plate-code-line ${highlight===i?'is-highlighted':''}"><span class="mv-plate-code-num">${i+1}</span>${esc(s)}</span>`).join('');
 const choices=frames.map((f,i)=>`<button type="button" class="mv-plate-step-choice" data-mv-action="jump" data-mv-step="${i}" aria-pressed="${i===position}">${String.fromCharCode(97+i)} · ${i+1}</button>`).join('');
 return `<figure class="mv-plate" data-plate-kind="${kind}">
 ${svg}
 <figcaption class="mv-plate-caption"><strong>Figure.</strong> ${esc(legends[kind])} The complete sequence is shown so you can compare states without waiting for an animation. Choose a panel to follow its proof and code.</figcaption>
 <div class="mv-plate-choice-row" role="group" aria-label="Select the figure panel">${choices}</div>
 <div class="mv-plate-exegesis"><div><div class="mv-plate-section-label">WHY THE ALGORITHM WORKS</div><p>${esc(invariants[kind])}</p>
 <div class="mv-plate-focus-note"><strong>Selected panel (${String.fromCharCode(97+position)}):</strong> ${esc(selected.explain)}</div></div>
 <div><div class="mv-plate-section-label">SYNCHRONIZED PSEUDOCODE · PYTHON</div><pre class="mv-plate-code" aria-label="Pseudocode with current step highlighted"><code>${code}</code></pre></div></div>
 </figure>`;
}
function challengeFor(scene,param){
 if(scene.kind==='window'){
  const k=param??2,rows=model.windowStates([1,2,3,4],k),best=rows.at(-1).best;
  return {question:'For a=[1,2,3,4] and window length k='+k+', what is the greatest contiguous-window sum?',
   options:[String(best-1),String(best),String(best+1)],answer:1,
   why:'Enumerate each of the '+rows.length+' length-'+k+' windows shown in the figure. The largest observed legal sum is '+best+'; the total of all four elements is not relevant unless k=4.'};
 }
 if(scene.kind==='binary'){
  const target=param??2,rows=model.lowerBoundStates([1,2,2,2,5],target),result=rows.at(-1).result;
  return {question:'For target '+target+' in [1,2,2,2,5], what exact first matching index does lower bound return?',
   options:[String(result+1),String(result),String(result+2)],answer:1,
   why:'The candidate interval shrinks to the first index where a[i] ≥ '+target+'. Only an equal value is accepted; the final answer is '+result+'.'};
 }
 return scene.challenge;
}
const api={kinds:Object.keys(drawByKind),render,programs,challengeFor,model};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.MasteryAlgorithmPlates=api;
})(typeof window!=='undefined'?window:globalThis);

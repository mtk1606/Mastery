/* Mastery original textbook-style figure lab: insertion sort.
 * Every panel is derived from figure-insertion-model.js, not copied from CLRS. */
(function(){
'use strict';
const model=window.MasteryInsertionFigure;
if(!model?.validate())throw Error('Missing insertion-sort models');
const root=document.getElementById('figureApp'),E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const code=[
'for j = 1 to A.length − 1:',
'    key = A[j]',
'    i = j − 1',
'    while i ≥ 0 and A[i] > key:',
'        A[i + 1] = A[i]',
'        i = i − 1',
'    A[i + 1] = key'
];
let data=model.build('mixed'),current=0,timer=null;
function stop(){if(timer){clearInterval(timer);timer=null;}}
function frameFigure(s,active){
 const id='figArrow'+s.pass,ink='figKeyArrow'+s.pass,view=active?'active':'inactive';
 const moves=s.moves||[],cellX=i=>46+i*55,center=i=>cellX(i)+23;
 const keyAt=s.pass===0?1:s.insertAt;
 const cells=s.array.map((v,i)=>{
  const cls=i===keyAt?'fig-ink-cell':i<=s.sortedEnd?'fig-sorted-cell':'fig-open-cell';
  const valueCls=i===keyAt?'fig-value-invert':'fig-value';
  return '<rect class="'+cls+'" x="'+cellX(i)+'" y="46" width="46" height="49" rx="1" />'+
    '<text class="fig-index" text-anchor="middle" x="'+center(i)+'" y="36">'+i+'</text>'+
    '<text class="'+valueCls+'" text-anchor="middle" x="'+center(i)+'" y="78">'+E(v)+'</text>';
 }).join('');
 let shifts='';
 for(const m of moves){
  const x1=center(m.from),x2=center(m.to),mid=(x1+x2)/2;
  shifts+='<path class="fig-shift-arrow" d="M '+x1+' 106 Q '+mid+' 126 '+x2+' 106" marker-end="url(#'+id+')" />';
 }
 let insertion='';
 if(s.pass>0&&s.from!==s.insertAt){
  const from=center(s.from),to=center(s.insertAt),mid=(from+to)/2;
  insertion='<path class="fig-key-arrow" d="M '+from+' 133 Q '+mid+' 171 '+to+' 133" marker-end="url(#'+ink+')" />'+
  '<text class="fig-arrow-text" text-anchor="middle" x="'+mid+'" y="163">key '+s.key+'</text>';
 }else if(s.pass>0){
  insertion='<text class="fig-arrow-text" text-anchor="middle" x="215" y="153">key '+s.key+' stays in place</text>';
 }else{
  insertion='<text class="fig-arrow-text" text-anchor="middle" x="215" y="151">select the second element as the first key</text>';
 }
 return '<svg class="fig-panel-svg" role="img" viewBox="0 0 420 181" aria-label="'+
 E('Array after pass '+s.pass+': '+s.array.join(', ')+'. '+moves.length+' element shifts.')+'">'+
 '<title>'+E('Insertion sort panel '+String.fromCharCode(97+s.pass)+': '+s.label)+'</title>'+
 '<desc>'+E(s.explain)+'</desc>'+
 '<defs><marker id="'+id+'" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="#635e55"/></marker>'+
 '<marker id="'+ink+'" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="#8a6640"/></marker></defs>'+
 '<text class="fig-figure-id" x="12" y="74">('+String.fromCharCode(97+s.pass)+')</text>'+
 cells+shifts+insertion+'</svg>';
}
function caption(s){
 if(s.pass===0)return 'Initially, only the first element forms the sorted prefix.';
 const moved=s.moves.length;
 return 'Pass '+s.pass+'. '+(moved?('Shift '+s.moves.map(m=>m.value).join(', ')+' right; '):'No larger element to shift; ')+'insert key '+s.key+' at index '+s.insertAt+'.';
}
function render(){
 const s=data.stages[current];
 root.innerHTML='<div class="fig-head"><div class="fig-intro"><div class="fig-eyebrow">FIGURE LAB / ALGORITHMS · 01</div>'+
 '<h2>The operation of insertion sort</h2>'+
 '<p class="fig-lede">Read the entire six-panel figure first. Then select a panel to trace how a value is removed conceptually, larger values shift right, and the key settles into the sorted prefix.</p>'+
 '</div><div class="fig-controls-line"><label class="fig-select-label" for="figDataset">Array to sort</label>'+
 '<select id="figDataset" aria-label="Choose insertion-sort input">'+Object.entries(model.examples).map(([key,x])=>'<option value="'+key+'" '+(key===data.variant?'selected':'')+'>'+E(x.label)+' · ['+x.values.join(', ')+']</option>').join('')+'</select></div></div>'+
 '<figure class="fig-paper"><div class="fig-paper-label">FIGURE 1 <span>INDEXED ARRAYS · KEY INSERTION · ELEMENT MOVEMENT</span></div>'+
 '<div class="fig-six">'+data.stages.map((f,i)=>'<button class="fig-panel '+(i===current?'is-active':'')+'" type="button" data-fig-pass="'+i+'" aria-pressed="'+(i===current)+'">'+
 frameFigure(f,i===current)+'<span class="fig-panel-caption">'+E(caption(f))+'</span></button>').join('')+'</div>'+
 '<figcaption class="fig-main-caption"><strong>Figure 1.</strong> The shaded cells are the sorted prefix; the dark cell marks the selected or newly placed key. Grey curved arrows show a right shift of a larger element. The ochre arrow tracks where the held key is inserted. Original illustration, modeled from a correct insertion-sort trace.</figcaption></figure>'+
 '<div class="fig-stagebar"><div class="fig-progress-label"><span>STATE '+String(current+1).padStart(2,'0')+' / '+data.stages.length+'</span>'+
 '<span>'+E(s.label)+'</span></div><div class="fig-progress-track"><span style="width:'+((current+1)/data.stages.length*100)+'%"></span></div>'+
 '<div class="fig-buttons"><button type="button" data-fig-action="prev" '+(current===0?'disabled':'')+'>← Previous</button>'+
 '<button type="button" data-fig-action="next" '+(current===data.stages.length-1?'disabled':'')+'>Next state →</button>'+
 '<button type="button" data-fig-action="play">'+(timer?'Pause':'Play')+'</button>'+
 '<button type="button" data-fig-action="replay">Replay</button></div></div>'+
 '<div class="fig-detail"><div class="fig-read"><div class="fig-eyebrow">WHY THIS STATE IS CORRECT</div><h3>'+E(s.label)+'</h3>'+
 '<p>'+E(s.explain)+'</p><div class="fig-array-read">A = [ '+s.array.join('  ·  ')+' ]</div>'+
 '<p class="fig-invariant"><strong>Invariant.</strong> At the end of pass '+s.pass+', A[0…'+s.sortedEnd+'] is sorted and contains exactly the original values of that prefix, in sorted order. Each subsequent pass extends it by one.</p>'+
 '<p class="fig-proof-note">Key is held separately during shifts; an intermediate duplicated value is temporary, not a lost element.</p></div>'+
 '<div class="fig-code"><div class="fig-code-title">Reference pseudocode <span>Zero-based indexing</span></div>'+
 '<ol>'+code.map((line,i)=>'<li class="'+(i+1===s.line?'fig-code-selected':'')+'"><span class="fig-code-line">'+E(line)+'</span></li>').join('')+'</ol>'+
 '<div class="fig-code-footer">'+(s.pass===0?'Before the loop: the prefix of length one is sorted.':('This pass shifted '+s.moves.length+' '+(s.moves.length===1?'element':'elements')+'; line 7 places the held key.'))+'</div></div></div>'+
 '<div class="fig-bottom"><div><strong>Why this is an algorithm, not a trick</strong><p>The sorted-prefix invariant proves correctness. Worst-case shifts grow as 1 + 2 + … + (n − 1), so insertion sort is O(n²). A previously sorted array triggers no shifts, but still requires O(n) loop work.</p></div>'+
 '<div><strong>Predict before looking ahead</strong><p>From each active panel, identify the next key, which left-side elements are larger, and the position where the key must be inserted. Then select the next state and compare.</p></div></div>';
}
root.addEventListener('click',event=>{
 const panel=event.target.closest('[data-fig-pass]');
 if(panel){stop();current=Number(panel.dataset.figPass);render();return;}
 const btn=event.target.closest('[data-fig-action]');
 if(!btn||btn.disabled)return;
 switch(btn.dataset.figAction){
 case 'prev':stop();current=Math.max(0,current-1);break;
 case 'next':stop();current=Math.min(data.stages.length-1,current+1);break;
 case 'replay':stop();current=0;break;
 case 'play':
  if(timer)stop();
  else{
   if(current===data.stages.length-1)current=0;
   timer=setInterval(()=>{
    if(current>=data.stages.length-1){stop();render();return;}
    current++;render();
   },2500);
  }
  break;
 }
 render();
});
root.addEventListener('change',event=>{
 if(event.target.id==='figDataset'&&model.examples[event.target.value]){
  stop();data=model.build(event.target.value);current=0;render();
 }
});
window.addEventListener('pagehide',stop);
render();
})();

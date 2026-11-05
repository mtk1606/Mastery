/* Mastery Python laboratory: real local CPython in a disposable Web Worker. */
(function(){
'use strict';
const bank=window.MasteryPythonLab,root=document.getElementById('plRoot'),toast=document.getElementById('plToast');
if(!bank||!bank.validate())throw Error('Python exercises missing');
const key='mastery-python-lab-v1',DAY=86400000;
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}};
const initial=()=>({version:'v1',drafts:{},passes:{},attempts:[],due:{},help:{}});
function load(){
 const s=initial(),x=read();
 if(!x||x.version!=='v1')return s;
 if(x.drafts&&typeof x.drafts==='object')for(const [k,v] of Object.entries(x.drafts).slice(0,80))if(bank.lookup(k)&&typeof v==='string')s.drafts[k]=v.slice(0,60000);
 if(x.passes&&typeof x.passes==='object')for(const [k,v] of Object.entries(x.passes).slice(0,80)){
  const t=bank.lookup(k);if(t&&v&&typeof v.source==='string'&&v.source===s.drafts[k]&&v.total===t.cases.length&&v.passed===v.total){
   s.passes[k]={passed:v.passed,total:v.total,source:v.source,at:Number(v.at)||0,assisted:v.assisted===true};
  }
 }
 if(Array.isArray(x.attempts))s.attempts=x.attempts.slice(-300).filter(v=>v&&bank.lookup(v.id)&&Number.isFinite(v.at));
 if(x.due&&typeof x.due==='object')for(const [k,v] of Object.entries(x.due))if(bank.lookup(k)&&Number.isFinite(v))s.due[k]=v;
 if(x.help&&typeof x.help==='object')for(const [k,v] of Object.entries(x.help))if(bank.lookup(k)&&v===true)s.help[k]=true;
 return s;
}
let state=load(),selected=bank.lookup(location.hash.slice(1))?location.hash.slice(1):'sum_positive',filter='all',worker=null,pending=null,nonce=0,statusTimer=null,runTimer=null;
function save(){try{localStorage.setItem(key,JSON.stringify(state))}catch{message('Storage is unavailable; export your work regularly.');}}
function message(x){toast.textContent=x;clearTimeout(statusTimer);statusTimer=setTimeout(()=>toast.textContent='',6000);}
const current=()=>bank.lookup(selected);
const tested=t=>{const p=state.passes[t.id];return !!p&&p.passed===t.cases.length&&p.total===t.cases.length&&p.source===state.drafts[t.id];};
function destroyWorker(){if(worker){worker.terminate();worker=null;}clearTimeout(runTimer);pending=null;}
function setStatus(x){const el=document.getElementById('plStatus');if(el)el.textContent=x;}
function feedback(markup){const el=document.getElementById('plFeedback');if(el)el.innerHTML=markup;}
function route(id){if(!bank.lookup(id))return;destroyWorker();selected=id;location.hash=id;render();document.getElementById('plTaskTitle')?.scrollIntoView({block:'start',behavior:'instant'});}
function render(){
 const t=current(),pass=state.passes[t.id],completed=bank.tasks.filter(tested).length,open=state.due[t.id]<=Date.now(),group=bank.tasks.filter(x=>filter==='all'||x.track===filter);
 root.innerHTML=`<section class="pl-hero"><div><div class="pl-eyebrow">REAL PYTHON · CORRECTNESS FIRST</div><h1>Write it. Test it.<br><em>Defend it.</em></h1>
 <p>A Python-first laboratory for Quant Developer, AI/ML and SWE preparation. Explain the invariant, implement the contract, test edge cases, then recover the idea without help.</p></div>
 <aside><strong>Runs CPython in your browser.</strong>Python 3 via pinned Pyodide WebAssembly, loaded only on your first Run. Tests are deterministic and inspectable; the Worker is disposable, not a secure sandbox. Never paste secrets.</aside></section>
 <section class="pl-layout" aria-label="Python exercises">
 <aside class="pl-menu" aria-labelledby="plMenuTitle"><div class="pl-menu-head"><div class="pl-eyebrow">FOUNDATIONS → APPLIED PRACTICE</div><h2 id="plMenuTitle">${bank.tasks.length} working labs</h2><p>${completed} patterns with locally recorded passes · use hints when stuck, but note that assisted work is labelled.</p></div>
 <div class="pl-toolbar" style="padding:0 13px 12px" role="group" aria-label="Filter Python tasks">
 ${[['all','All'],['foundation','Core'],['quant','Quant'],['ml','AI/ML'],['swe','SWE']].map(([k,l])=>`<button type="button" data-filter="${k}" aria-pressed="${filter===k}">${l}</button>`).join('')}</div>
 ${group.map((x,i)=>`<button class="pl-question" type="button" data-question="${x.id}" aria-current="${x.id===t.id}"><span class="pl-number">${String(i+1).padStart(2,'0')}</span><span class="pl-qtext"><strong>${E(x.title)}</strong><small>${E(x.pattern)} · ${E(x.track)}</small></span><span class="pl-check">${tested(x)?'✓':state.due[x.id]&&state.due[x.id]<=Date.now()?'↻':''}</span></button>`).join('')}
 </aside>
 <div class="pl-main"><article class="pl-content" aria-labelledby="plTaskTitle">
 <div class="pl-meta"><span class="pl-chip">${E(t.level)}</span><span class="pl-chip">${E(t.pattern)}</span><span class="pl-chip">${E(t.track.toUpperCase())}</span>
 ${tested(t)?`<span class="pl-chip">${pass.assisted?'PASSED WITH HELP':'LOCAL PASS RECORDED'}</span>`:''}${open?'<span class="pl-chip">DELAYED REVIEW DUE</span>':''}</div>
 <h2 id="plTaskTitle">${E(t.title)}</h2><p class="pl-lead">${E(t.statement)}</p>
 <div class="pl-invariant"><strong>THE INVARIANT / KEY REASONING</strong><p>${E(t.rule)}</p></div>
 <section class="pl-section" aria-labelledby="plCaseHeading"><h3 id="plCaseHeading">Understand the contract</h3>
 <p>First make the function correct for an empty input, one value, duplicates, boundaries and adversarial cases. The actual assessment runs ${t.cases.length} deterministic, inspectable cases.</p>
 <div class="pl-example"><strong class="pl-small">SAMPLE INPUTS AND EXPECTED OUTPUTS</strong><pre>${t.cases.slice(0,2).map(c=>E(JSON.stringify(c.args))+' → '+E(JSON.stringify(c.expected))).join('\n')}</pre></div>
 <div class="pl-review-row" style="margin-top:12px"><a href="${E(t.lesson)}" class="pl-btn">Read the deeper lesson →</a></div></section>
 <section class="pl-section" aria-label="Complexity and pitfalls"><h3>Complexity &amp; failure mode</h3><p><strong>Target:</strong> ${E(t.complexity)}</p><p><strong>Common trap:</strong> ${E(t.pitfall)}</p></section></article>
 <section class="pl-content pl-code-panel" aria-labelledby="plEditorTitle"><header class="pl-code-top"><strong id="plEditorTitle">Python editor · ${E(t.fn)}()</strong><span>Autosaved locally · Ctrl/Cmd + Enter to run</span></header>
 <label class="pl-small" for="plCode" style="display:block;padding:11px 20px 0">Write your own implementation. Standard-library imports are allowed.</label>
 <textarea class="pl-editor" id="plCode" spellcheck="false" autocapitalize="off" autocorrect="off" aria-label="Python source editor" maxlength="60000">${E(state.drafts[t.id]??t.starter)}</textarea>
 <div class="pl-actions"><button type="button" class="pl-btn primary" id="plRun">Run ${t.cases.length} real Python tests →</button><button type="button" class="pl-btn" id="plReset">Reset starter</button><button type="button" class="pl-btn" id="plDownload">Download .py</button><button type="button" class="pl-btn" id="plExport">Export learning record</button></div>
 <p class="pl-status" id="plStatus" role="status" aria-live="polite">Ready. On first execution the Python runtime downloads from a pinned CDN. Source edits invalidate the current pass.</p></section>
 <div class="pl-feedback pl-content" id="plFeedback" aria-live="polite"><h3>Test evidence appears here</h3><p class="pl-small">A passing finite test batch is evidence about these cases, not a formal proof or a certification.</p></div>
 <section class="pl-content"><div class="pl-eyebrow">AFTER A FIRST ATTEMPT, STUDY THE METHOD</div><h2>Repair the mental model.</h2>
 <details class="pl-reveal" data-hint><summary>Hint 1 — choose a representation</summary><p>${E(t.hints[0])}</p></details>
 <details class="pl-reveal" data-hint><summary>Hint 2 — expose the key transition</summary><p>${E(t.hints[1])}</p></details>
 <details class="pl-reveal" data-solution><summary>Reveal a full worked implementation (assisted attempt)</summary><pre>${E(t.solution)}</pre><p>Read it only after trying; then close it and reproduce the idea on a clean input.</p></details>
 <details class="pl-reveal"><summary>Inspect the full deterministic test bank</summary><pre>${E(JSON.stringify(t.cases,null,2))}</pre><p>These are public client-side checks, not a secret online judge.</p></details>
 <div class="pl-actions" style="padding:16px 0 0"><button type="button" class="pl-btn" id="plNext">Next exercise →</button><a class="pl-btn" href="roadmap.html">Back to A–Z career roadmap</a></div>
 <p class="pl-small" style="margin-top:14px">Your code is executed in a same-origin Worker; a timeout stops a stuck task. That Worker is not a security boundary: don't execute untrusted code or include credentials. No submitted code is sent to the Mastery server.</p>
 </section></div></section>`;
}
function statusResult(m,t,source){
 const rows=m.results||[],allpass=!m.error&&m.total===t.cases.length&&m.passed===m.total&&m.total>=6;
 const assisted=state.help[t.id]===true;
 state.attempts.push({id:t.id,at:Date.now(),passed:m.passed||0,total:m.total||0,assisted});
 state.attempts=state.attempts.slice(-300);
 if(allpass)state.passes[t.id]={passed:m.passed,total:m.total,source,at:Date.now(),assisted};
 else delete state.passes[t.id];
 state.due[t.id]=Date.now()+(allpass&&!assisted?3:1)*DAY;
 save();
 const label=allpass?'All '+m.total+' cases passed'+(assisted?' · assisted':' · unassisted'):'Needs another iteration';
 feedback(`<h3>${E(label)}</h3><div class="pl-score">${m.passed||0} / ${m.total||t.cases.length} <small>deterministic Python cases passed</small></div>
 ${m.error?`<div class="pl-status">${E(m.error)}</div>`:''}
 ${m.stdout?`<details class="pl-reveal"><summary>Printed output</summary><pre>${E(m.stdout)}</pre></details>`:''}
 <div class="pl-case-list">${rows.map(r=>`<div class="pl-case ${r.ok?'pass':'fail'}"><strong>${r.ok?'✓ PASS':'× FIX'} #${r.case}</strong><span>Expected: ${E(r.expected)}<br>Received: ${E(r.actual)}</span></div>`).join('')}</div>
 <p class="pl-small">${allpass?'Great. Now explain the invariant aloud and repeat from memory after the review interval.':'Inspect the failed case; find the violated invariant before trying another fix.'} Next local review after ${allpass&&!assisted?'3 days':'1 day'}.</p>`);
 setStatus(allpass?'Pass recorded locally. Reattempt with a different contract for interview transfer.':'Test run finished. Debug the first failing case.');
 if(allpass){document.querySelector('[data-question="'+t.id+'"] .pl-check')?.replaceChildren(document.createTextNode('✓'));message('Objective Python test pass recorded'+(assisted?' (with hints).':'.'));}
}
function run(){
 if(pending){message('A Python run is already executing.');return;}
 const t=current(),source=document.getElementById('plCode')?.value||'',button=document.getElementById('plRun');
 if(!source.trim()){message('Write the function before running.');return;}
 if(source.length>60000){message('Code exceeds 60 KB. Simplify the submission.');return;}
 if(!worker){try{worker=new Worker('python-lab-worker.js');}catch(e){setStatus('This browser does not support local Python Workers: '+e.message);return;}}
 const n=++nonce;pending={nonce:n,id:t.id,source};button.disabled=true;setStatus('Preparing genuine CPython tests…');
 const stamp=performance.now();
 clearTimeout(runTimer);runTimer=setTimeout(()=>{
  if(!pending||pending.nonce!==n)return;
  destroyWorker();button.disabled=false;setStatus('Execution exceeded 45 seconds (including runtime initialization). Worker terminated; retry or use local Python.');
 },45000);
 worker.onmessage=ev=>{
  const m=ev.data;if(!pending||m.nonce!==pending.nonce)return;
  if(m.type==='loading'){setStatus('Downloading and initializing Python (first run needs network)…');return;}
  if(m.type==='executing'){setStatus('Running your code and '+t.cases.length+' deterministic cases…');return;}
  clearTimeout(runTimer);pending=null;button.disabled=false;
  if(m.type==='error'){setStatus('Runtime error: '+String(m.error).slice(0,350)+'. Retry or use local Python 3.');return;}
  if(m.type==='result'){
   if(source!==document.getElementById('plCode')?.value||selected!==t.id){setStatus('Source changed during the test; the old result was discarded.');return;}
   statusResult(m,t,source);
  }
 };
 worker.onerror=ev=>{clearTimeout(runTimer);destroyWorker();button.disabled=false;setStatus('Python Worker failed to load. This lab needs network access to the pinned Pyodide CDN.');};
 worker.postMessage({type:'run',nonce:n,code:source,fn:t.fn,cases:t.cases});
}
function downloadCode(){
 const t=current(),source=document.getElementById('plCode')?.value||t.starter;
 const url=URL.createObjectURL(new Blob(['# Mastery / '+t.title+'\n# '+t.statement+'\n\n'+source],{type:'text/x-python'})),a=document.createElement('a');
 a.href=url;a.download='mastery_'+t.id+'.py';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
}
function exportRecord(){
 const url=URL.createObjectURL(new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'})),a=document.createElement('a');
 a.href=url;a.download='mastery-python-lab-record.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);message('Python record downloaded. This is a local test history, not a certificate.');
}
root.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 if(b.dataset.question){route(b.dataset.question);return;}
 if(b.dataset.filter){filter=b.dataset.filter;render();return;}
 if(b.id==='plRun'){run();return;}
 if(b.id==='plReset'){if(!confirm('Replace this draft with the original starter?'))return;destroyWorker();state.drafts[selected]=current().starter;delete state.passes[selected];delete state.help[selected];save();render();message('Fresh attempt started; previous hints are no longer counted for new runs.');return;}
 if(b.id==='plDownload'){downloadCode();return;}
 if(b.id==='plExport'){exportRecord();return;}
 if(b.id==='plNext'){const i=bank.tasks.findIndex(x=>x.id===selected);route(bank.tasks[(i+1)%bank.tasks.length].id);return;}
});
root.addEventListener('input',event=>{
 if(event.target.id!=='plCode')return;
 const source=event.target.value;
 if(state.drafts[selected]!==source){state.drafts[selected]=source;delete state.passes[selected];save();if(pending){destroyWorker();setStatus('Edited while running: cancelled the previous test.');document.getElementById('plRun').disabled=false;}}
});
root.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key==='Enter'&&event.target.id==='plCode'){event.preventDefault();run();}});
root.addEventListener('toggle',event=>{if(event.target.open&&(event.target.hasAttribute('data-hint')||event.target.hasAttribute('data-solution'))){state.help[selected]=true;save();}},true);
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(bank.lookup(id)&&id!==selected){destroyWorker();selected=id;render();}});
window.addEventListener('pageshow',()=>render());
render();
})();
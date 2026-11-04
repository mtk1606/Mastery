/* Mastery Market Systems Lab — original course UI and deterministic reference illustrations. */
'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORE='mastery-exchange-phases3-4';
let saved={format:2,notes:{},checks:{},courseWork:{},csv:null};
try{const x=JSON.parse(localStorage.getItem(STORE)||'null');if(x&&x.format===2&&x.notes)saved=x;}catch{}
function save(){try{localStorage.setItem(STORE,JSON.stringify(saved))}catch{}}
const GOLDEN=`seq,kind,id,side,price,quantity
1,limit,1,buy,99,5
2,limit,2,sell,104,7
3,limit,3,buy,101,3
4,limit,4,sell,101,1
5,cancel,1,buy,0,0
6,limit,5,sell,103,8
7,market,6,buy,0,3
8,limit,7,buy,100,6
9,limit,8,sell,102,2
10,cancel,5,buy,0,0
11,market,9,sell,0,4
12,limit,10,sell,105,4`;
const SCENARIOS={
 golden:{title:'12-event deterministic replay',csv:GOLDEN,description:'Published native fixture. Expected final state checksum: 15719539211984847471.'},
 fifo:{title:'Same-price FIFO and partial fills',csv:'seq,kind,id,side,price,quantity\n1,limit,11,sell,101,7\n2,limit,12,sell,101,4\n3,limit,13,sell,102,5\n4,market,21,buy,0,9\n5,cancel,12,buy,0,0',description:'Observe maker order 11 fill completely before maker 12, then cancel the partial remainder.'},
 gap:{title:'Sequence gap: halt, do not guess',csv:'seq,kind,id,side,price,quantity\n1,limit,1,buy,99,7\n2,limit,2,sell,104,4\n4,limit,3,buy,102,2',description:'Event 3 is missing. The reference stops at sequence 2 and refuses to apply 4.'},
 crossing:{title:'Crossing limit order and IOC',csv:'seq,kind,id,side,price,quantity\n1,limit,10,sell,101,6\n2,limit,11,sell,102,8\n3,limit,15,buy,101,9\n4,market,20,buy,0,10',description:'Limit 15 executes 6 at 101, leaves a bid remainder at 101; market 20 takes 8 at 102 and discards the remainder.'}
};
let route='',cursor=0,events=[],frames=[],currentCSV=saved.csv||GOLDEN,scenario='golden',revealed=new Set(),benchmark=null;
function routeFromHash(){const id=decodeURIComponent(location.hash.slice(1)||'lecture:matching');return MARKET_LECTURES.some(l=>'lecture:'+l.id===id)||DESIGN_CASES.some(l=>'design:'+l.id===id)||['replay','performance'].includes(id)?id:'lecture:matching';}
function nav(){const items=[['Lectures',MARKET_LECTURES.map(l=>({id:'lecture:'+l.id,label:l.chapter+'. '+l.title}))],['Experiments',[{id:'replay',label:'Live reference replay'},{id:'performance',label:'Native benchmark analysis'}]],['System design workshops',DESIGN_CASES.map(c=>({id:'design:'+c.id,label:c.number+'. '+c.title}))]];
 $('courseNav').innerHTML=items.map(([label,links])=>`<div class="ms-nav-group"><p class="ms-nav-label">${esc(label)}</p>${links.map(v=>`<button type="button" class="ms-nav-item ${v.id===route?'selected':''}" data-route="${esc(v.id)}" aria-current="${v.id===route?'page':'false'}">${esc(v.label)}</button>`).join('')}</div>`).join('');}
function lecture(id){const l=MARKET_LECTURES.find(x=>x.id===id);if(!l)return '';
 return `<p class="overline">${esc(l.unit)} / LECTURE ${l.chapter} / ${l.minutes} MIN READING</p><h2>${esc(l.title)}</h2><p class="lead">${esc(l.objective)}</p><div class="lecture-body">
 <div class="ms-rule"><span class="ms-label">The central question</span><p>${esc(l.intro)}</p></div>
 <section><h3>Definitions before use</h3><dl class="lexicon">${l.definitions.map(([a,b])=>`<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl></section>
 <section><h3>Principle and proof</h3><div class="ms-rule"><span class="ms-label">Invariant / theorem</span><p>${esc(l.theorem)}</p></div><ol>${l.proof.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></section>
 <section><h3>Worked example</h3><div class="ms-note"><p>${esc(l.example)}</p></div><h4>Where a naive implementation fails</h4><ul>${l.pitfalls.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></section>
 <section><h3>Recitation problem</h3><p>${esc(l.problem)}</p><label for="lectureDraft" class="ms-label">Your reasoning and implementation plan</label><textarea class="notes" id="lectureDraft" placeholder="State an invariant, work a case by hand, then defend your method.">${esc(saved.notes[l.id]||'')}</textarea>
 <div class="actions"><button type="button" data-show-solution="${esc(l.id)}">${revealed.has('l:'+l.id)?'Hide':'Reveal'} worked solution</button><button type="button" data-mark="${esc(l.id)}">${saved.checks[l.id]?'✓ Reviewed':'Mark as reviewed'}</button></div>
 ${revealed.has('l:'+l.id)?`<div class="ms-note"><span class="ms-label">Model reasoning · compare against your draft</span><p>${esc(l.solution)}</p></div>`:''}<p class="ms-help">Written explanations are self-reviewed. Mastery does not claim to automatically grade proofs, code quality, or architecture.</p></section>
 <section><h3>Reference implementation and further work</h3><p>The linked source is an independently authored, tested C++20 reference. Read it after attempting the recitation.</p><ul class="source-list">${l.references.map(f=>`<li><a href="https://github.com/mtk1606/Mastery/blob/main/${encodeURI(f)}" target="_blank" rel="noopener noreferrer"><code>${esc(f)}</code></a></li>`).join('')}</ul></section>
 </div>`;}
function scenarioOptions(){return Object.entries(SCENARIOS).map(([id,v])=>`<option value="${id}" ${id===scenario?'selected':''}>${esc(v.title)}</option>`).join('');}
function replayPanel(){return `<p class="overline">INTERACTIVE LABORATORY / REFERENCE MODEL</p><h2>Trace the exchange state.</h2><p class="lead">Follow real event semantics. Examine the order book, FIFO queue position, partial fills, sequence-gap rejection and deterministic state fingerprint at every step.</p>
 <div class="ms-note"><p><strong>C++ reference parity:</strong> The 12-event fixture is tested against the native C++ executable. The JavaScript viewer is a separate teaching reference, not an instrumented recording of your compiled code.</p></div>
 <label class="ms-label" for="scenario">Worked scenario</label><div class="actions"><select id="scenario">${scenarioOptions()}</select><button id="loadScenario" type="button">Load scenario</button></div><p id="scenarioHelp" class="ms-help">${esc(SCENARIOS[scenario].description)}</p>
 <label class="ms-label" for="eventCSV">Your input feed: seq,kind,id,side,price,quantity</label><textarea id="eventCSV" spellcheck="false">${esc(currentCSV)}</textarea>
 <div class="actions"><button class="primary" id="replayFeed" type="button">Validate and replay</button><button id="resetFeed" type="button">Restore original fixture</button><span id="feedStatus" class="ms-help" role="status"></span></div>
 <section><h3>State after event <span id="stageLabel">0</span></h3><div class="actions"><button type="button" id="eventPrev">← Previous</button><input class="replay-range" id="eventSlider" style="flex:1;min-width:150px" type="range" min="0" max="0" value="0" aria-label="Event position"><button type="button" id="eventNext">Next →</button></div>
 <div class="stat-grid" id="replayStats"></div><div class="replay-grid"><div><div class="order-side" id="askBook"></div><div class="order-side" id="bidBook"></div><p id="replayFingerprint" class="status-line"></p><p id="replayOutcome" class="status-line"></p></div><div><p class="ms-label">Feed and selected event</p><div style="overflow-x:auto;max-height:390px;overflow-y:auto"><table class="replay-tape"><thead><tr><th>Seq</th><th>Kind</th><th>ID</th><th>Qty</th></tr></thead><tbody id="replayTable"></tbody></table></div></div></div>
 <p class="ms-help">Red or rejected events are explicitly marked. A missing sequence number stops processing instead of guessing state.</p></section>
 <section><h3>Explain the result</h3><p>Why is FIFO preserved after a partial fill? Under which failure could a client see inconsistent order-book state even though all messages are individually well formed?</p><textarea class="notes" id="replayNotes" placeholder="Explain the invariant, what each transition changes, and when to stop replay.">${esc(saved.notes.replay||'')}</textarea></section>`;}
function riskPanel(){const rows=benchmark?.samples||[];
 const table=rows.length?`<table class="bench-table"><thead><tr><th>Measured operation</th><th>n</th><th>p50</th><th>p95</th><th>p99</th></tr></thead><tbody>${rows.map(s=>`<tr><td>${esc(s.suite)}</td><td>${s.observations.toLocaleString()}</td><td>${s.p50} ns</td><td>${s.p95} ns</td><td>${s.p99} ns</td></tr>`).join('')}</tbody></table>`:'<div class="ms-note"><p>No benchmark report has been uploaded. Mastery does not invent latency measurements.</p></div>';
 const chart=rows.length?rows.map(s=>`<div class="ms-note"><strong>${esc(s.suite)}</strong>${['p50','p95','p99'].map(p=>`<div class="percentile-row"><span>${p}</span><div class="track"><div class="fill" style="width:${(100*s[p]/Math.max(1,s.p99)).toFixed(2)}%"></div></div><strong>${s[p]} ns</strong></div>`).join('')}</div>`).join(''):'';
 return `<p class="overline">PERFORMANCE LABORATORY · NATIVE MEASUREMENTS ONLY</p><h2>Measure before optimizing.</h2><p class="lead">Upload the JSON output of the local C++ benchmark. The laboratory shows observed values and percentile ratios; there is deliberately no fabricated 'exchange latency' chart.</p>
 <section><h3>Run the reference benchmark</h3><pre>cmake -S exchange -B exchange/build -DCMAKE_BUILD_TYPE=Release
cmake --build exchange/build --target mastery_exchange_bench
./exchange/build/mastery_exchange_bench > measurements.json</pre><p class="ms-help">Run on your own machine from the repository root. Record CPU, OS, compiler, frequency scaling, input distribution, sample count and run-to-run variance before drawing conclusions.</p><label for="benchFile" class="ms-label">Import your real measurements.json</label><div class="actions"><input type="file" id="benchFile" accept="application/json,.json"><span id="benchStatus" class="ms-help" role="status"></span></div>${table}${chart}</section>
 <section><h3>Capacity arithmetic: a design estimate</h3><p>Before drawing a distributed architecture, calculate the minimum raw network throughput. This is an estimate, not a production forecast: protocol overhead, retries, bursts, buffering and replication matter.</p><div class="form-row"><label>Updates per second<input id="capRate" type="number" min="1" max="10000000" value="50000"></label><label>Bytes per update<input id="capBytes" type="number" min="1" max="100000" value="120"></label><label>Subscribers<input id="capSubs" type="number" min="1" max="100000" value="1000"></label></div><div id="capResult" class="ms-rule" aria-live="polite"></div><p class="ms-help">Model: updates/sec × bytes/update × subscribers × 8 bits/byte. No packet framing or compression assumed. This is an intentionally simple lower-bound exercise.</p></section>
 <section><h3>Research notebook</h3><p>List experimental controls, workload limitations, and what evidence would convince you that an optimization actually improves tail latency.</p><textarea class="notes" id="performanceNotes" placeholder="Specify CPU, workload, warmup, statistics, controls, and hypotheses.">${esc(saved.notes.performance||'')}</textarea></section>`;}
function designPanel(id){const c=DESIGN_CASES.find(x=>x.id===id);if(!c)return '';
 return `<div class="design-case"><p class="overline">IV / SYSTEM DESIGN STUDIO · CASE ${c.number} / APPROX. ${c.minutes} MIN</p><h2>${esc(c.title)}</h2><p class="lead">${esc(c.task)}</p>
 <section><h3>System constraints</h3><ul>${c.constraints.map(v=>`<li>${esc(v)}</li>`).join('')}</ul><h3>Engineering deliverables</h3><ol>${c.steps.map(v=>`<li>${esc(v)}</li>`).join('')}</ol></section>
 <section><h3>Your architecture proposal</h3><p>Use clear interfaces, a failure matrix, sequence/consistency contracts, capacity calculations and operational metrics. Explain at least one rejected alternative.</p><textarea id="designDraft" placeholder="Requirements → API → state ownership → failure handling → consistency → metrics.">${esc(saved.courseWork[c.id]||'')}</textarea>
 <div class="actions"><button type="button" data-hint="${c.id}" data-level="1">First hint</button><button type="button" data-hint="${c.id}" data-level="2">Second hint</button><button type="button" data-reveal-design="${c.id}">${revealed.has('d:'+id)?'Hide':'Show'} model design</button></div><div id="designHint" class="ms-note" style="display:none"></div>
 ${revealed.has('d:'+id)?`<div class="ms-note"><span class="ms-label">Instructor's worked design · not the only correct architecture</span><p>${esc(c.model)}</p></div>`:''}</section>
 <section><h3>Recitation rubric</h3><p>Check these only after you have written your proposal. The rubric is for self-review, not automatic AI grading.</p><ul class="rubric">${c.rubric.map((r,i)=>`<li><label><input type="checkbox" data-check="${c.id}:${i}" ${saved.checks[c.id+':'+i]?'checked':''}> ${esc(r)}</label></li>`).join('')}</ul><p class="ms-help">Saving a checklist item is not a certification of correctness.</p></section>
 <section><h3>Compare with nearby work</h3><p>Link the architecture to the concrete C++ event machine: its deterministic single-writer contract, replay checksum, risk acceptance policy, and failure-mode boundaries.</p><ul><li><a href="exchange/README.md">Native exchange simulator documentation</a></li><li><a href="cpp-lab.html">C++ browser fundamentals</a></li></ul></section></div>`;}
function render(){route=routeFromHash();nav();
 let content;if(route.startsWith('lecture:'))content=lecture(route.split(':')[1]);else if(route==='replay')content=replayPanel();else if(route==='performance')content=riskPanel();else content=designPanel(route.split(':')[1]);
 $('coursePanel').innerHTML=content;
 if(route==='replay'){if(!frames.length){loadFeed(currentCSV);}else renderReplay();}
 if(route==='performance')capacity();
}
function go(id){const next='#'+id;if(location.hash===next){render();return;}location.hash=next;document.querySelector('.ms-panel')?.scrollIntoView({behavior:'instant'});}
function loadFeed(csv){try{events=MasteryExchangeSim.parseCSV(csv);frames=MasteryExchangeSim.replay(events);cursor=0;currentCSV=csv;saved.csv=csv;save();$('feedStatus').textContent=`${events.length} parsed event(s). ${frames.length-1} processed.`;renderReplay();}catch(err){$('feedStatus').textContent=err.message;frames=[];$('replayStats').innerHTML='';$('askBook').innerHTML='';$('bidBook').innerHTML='';$('replayOutcome').textContent='Cannot replay invalid input.';}}
function renderBook(levels,kind){const max=Math.max(1,...levels.map(l=>l.quantity));return `<header><span>${kind==='ask'?'SELL / asks':'BUY / bids'}</span><span>${levels.length} price level(s)</span></header>`+(levels.length?levels.map(l=>`<div class="book-level"><span class="price">${l.price}</span><div class="qty"><div class="bar" style="width:${(l.quantity/max*100).toFixed(1)}%"></div><span>${l.items.map(o=>`${o.id}→${o.qty}`).join(' · ')}</span></div></div>`).join(''):'<p class="ms-help">No resting orders</p>');}
function renderReplay(){if(!frames.length)return;const f=frames[cursor],b=f.book;
 $('stageLabel').textContent=String(cursor);$('eventSlider').max=String(frames.length-1);$('eventSlider').value=String(cursor);$('eventPrev').disabled=cursor===0;$('eventNext').disabled=cursor===frames.length-1;
 const stats=[['Last sequence',b.seq],['Active orders',b.active],['Fill records',b.trades],['Spread (ticks)',b.bid&&b.ask?b.ask.price-b.bid.price:'—']];$('replayStats').innerHTML=stats.map(([a,z])=>`<div><strong>${esc(z)}</strong><span>${esc(a)}</span></div>`).join('');
 $('askBook').innerHTML=renderBook(b.asks,'ask');$('bidBook').innerHTML=renderBook(b.bids,'bid');
 $('replayFingerprint').innerHTML=`<strong>Deterministic checksum:</strong> ${esc(b.fingerprint)}<br><strong>Canonical:</strong> ${esc(b.canonical)}`;
 $('replayOutcome').textContent=!f.event?'Initial empty order book':`Event ${f.event.seq}: ${f.outcome.reason}. ${f.outcome.fills.length?f.outcome.fills.map(x=>`Maker ${x.maker}, taker ${x.taker}: ${x.quantity} @ ${x.price}`).join('; '):'No fills.'}`;
 $('replayTable').innerHTML=events.map((ev,i)=>`<tr class="${i+1===cursor?'focus':''} ${frames[i+1]?.outcome?.accepted===false?'rejected':''}"><td>${ev.seq}</td><td>${esc(ev.kind)}</td><td>${ev.id}</td><td>${ev.qty}</td></tr>`).join('');
}
function capacity(){const rate=Number($('capRate')?.value),bytes=Number($('capBytes')?.value),subs=Number($('capSubs')?.value);if(![rate,bytes,subs].every(v=>Number.isFinite(v)&&v>0&&v<1e9)){if($('capResult'))$('capResult').textContent='Enter positive finite quantities.';return;}
 const ingressMbps=rate*bytes*8/1e6,egressMbps=ingressMbps*subs;
 if($('capResult'))$('capResult').innerHTML=`<strong>Input:</strong> ${ingressMbps.toLocaleString(undefined,{maximumFractionDigits:2})} Mb/s<br><strong>Naive uncompressed fanout:</strong> ${egressMbps.toLocaleString(undefined,{maximumFractionDigits:2})} Mb/s (${(egressMbps/1000).toLocaleString(undefined,{maximumFractionDigits:2})} Gb/s).<br><span class="ms-help">Multiply by an explicit burst/headroom factor in your design.</span>`;
}
function importBench(file){if(!file)return;file.text().then(t=>{const z=JSON.parse(t);if(z.kind!=='mastery-native-benchmark'||z.version!==1||!Array.isArray(z.samples)||z.samples.length<1||z.samples.length>10)throw Error('Unexpected benchmark schema.');
 for(const s of z.samples){if(typeof s.suite!=='string'||s.suite.length>70||s.units!=='ns'||!Number.isSafeInteger(s.observations)||s.observations<1||![s.p50,s.p95,s.p99].every(x=>Number.isFinite(x)&&x>=0)||!(s.p50<=s.p95&&s.p95<=s.p99))throw Error('Invalid measurements.');}
 benchmark=z;render();$('benchStatus').textContent='Imported native benchmark from file. Values were not simulated.';
}).catch(err=>{$('benchStatus').textContent=err.message;});}
document.addEventListener('click',ev=>{const el=ev.target.closest('button');if(!el)return;
 if(el.dataset.route)return go(el.dataset.route);
 if(el.dataset.mark){saved.checks[el.dataset.mark]=!saved.checks[el.dataset.mark];save();render();return;}
 if(el.dataset.showSolution){const key='l:'+el.dataset.showSolution;revealed.has(key)?revealed.delete(key):revealed.add(key);render();return;}
 if(el.dataset.revealDesign){const key='d:'+el.dataset.revealDesign;revealed.has(key)?revealed.delete(key):revealed.add(key);render();return;}
 if(el.dataset.hint){const c=DESIGN_CASES.find(v=>v.id===el.dataset.hint);const h=$('designHint');h.style.display='block';h.textContent=c.hints[Number(el.dataset.level)-1];return;}
 if(el.id==='loadScenario'){scenario=$('scenario').value;currentCSV=SCENARIOS[scenario].csv;$('eventCSV').value=currentCSV;$('scenarioHelp').textContent=SCENARIOS[scenario].description;loadFeed(currentCSV);return;}
 if(el.id==='resetFeed'){scenario='golden';currentCSV=GOLDEN;$('scenario').value='golden';$('eventCSV').value=currentCSV;$('scenarioHelp').textContent=SCENARIOS.golden.description;loadFeed(currentCSV);return;}
 if(el.id==='replayFeed'){loadFeed($('eventCSV').value);return;}
 if(el.id==='eventPrev'){cursor=Math.max(0,cursor-1);renderReplay();return;}
 if(el.id==='eventNext'){cursor=Math.min(frames.length-1,cursor+1);renderReplay();return;}
 if(el.id==='exportWork'){const data=JSON.stringify({kind:'mastery-market-systems',version:2,exportedAt:new Date().toISOString(),payload:saved},null,2);const blob=new Blob([data],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mastery-market-systems-work.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('storageStatus').textContent='Study record exported.';return;}
});
document.addEventListener('input',ev=>{
 const el=ev.target;
 if(el.id==='lectureDraft'&&route.startsWith('lecture:')){saved.notes[route.split(':')[1]]=el.value.slice(0,30000);save();}
 if(el.id==='replayNotes'){saved.notes.replay=el.value.slice(0,30000);save();}
 if(el.id==='performanceNotes'){saved.notes.performance=el.value.slice(0,30000);save();}
 if(el.id==='designDraft'){saved.courseWork[route.split(':')[1]]=el.value.slice(0,40000);save();}
 if(el.id==='eventSlider'){cursor=Math.min(frames.length-1,Number(el.value));renderReplay();}
 if(['capRate','capBytes','capSubs'].includes(el.id))capacity();
 if(el.dataset.check){saved.checks[el.dataset.check]=el.checked;save();}
});
document.addEventListener('change',ev=>{
 if(ev.target.id==='benchFile')importBench(ev.target.files?.[0]);
 if(ev.target.id==='restoreWork'){
  const file=ev.target.files?.[0];if(!file)return;
  file.text().then(t=>{const z=JSON.parse(t);if(z.kind!=='mastery-market-systems'||z.version!==2||!z.payload||typeof z.payload.notes!=='object'||typeof z.payload.checks!=='object')throw Error('Unsupported study record.');
    if(!confirm('Replace your current market-systems notes and checklists?'))return;
    const cleanObj=(x,limit)=>Object.fromEntries(Object.entries(x).slice(0,100).map(([k,v])=>[String(k).slice(0,80),typeof v==='string'?v.slice(0,limit):v]));
    saved={format:2,notes:cleanObj(z.payload.notes,30000),courseWork:cleanObj(z.payload.courseWork||{},40000),checks:z.payload.checks||{},csv:typeof z.payload.csv==='string'?z.payload.csv.slice(0,15000):null};save();currentCSV=saved.csv||GOLDEN;frames=[];render();$('storageStatus').textContent='Study record restored.';
  }).catch(err=>{$('storageStatus').textContent=err.message;});
  ev.target.value='';
 }
});
window.addEventListener('hashchange',render);
if(!location.hash||routeFromHash()!=='lecture:matching'&&location.hash==='#')history.replaceState(null,'','#lecture:matching');
render();
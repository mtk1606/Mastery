/* Mastery programming labs: all code is original, no grading locks. */
'use strict';
const $=id=>document.getElementById(id);
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const storageKey='mastery-programming-labs-v1';
function fresh(){return {format:'mastery-programming-labs-v1',drafts:{},notes:{},runs:{},completed:{}};}
function load(){try{const o=JSON.parse(localStorage.getItem(storageKey));if(o?.format==='mastery-programming-labs-v1')return {...fresh(),...o};}catch{}return fresh();}
let progress=load();
function save(){try{localStorage.setItem(storageKey,JSON.stringify(progress));}catch{notify('Local storage is unavailable; export your code regularly.');}}
let area='algorithms',labId=LABS[0].id,level='sample',runner=null,timeoutHandle=null;
function notify(msg){let el=$('labStatus');if(el)el.textContent=msg;}
const knownJs=()=>LABS.find(l=>l.id===labId)||LABS[0];
const knownCpp=()=>CPP_LABS.find(l=>l.id===labId)||CPP_LABS[0];
const download=(name,data,type='text/plain')=>{const blob=new Blob([data],{type}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1800);};
function selection(next){if(runner){runner.terminate();runner=null;}clearTimeout(timeoutHandle);labId=next;level='sample';render();history.replaceState(null,'',`#${area}/${labId}`);window.scrollTo({top:0,behavior:'instant'});}
function setArea(next){if(runner){runner.terminate();runner=null;}clearTimeout(timeoutHandle);area=next;labId=area==='cpp'?CPP_LABS[0].id:LABS[0].id;level='sample';render();history.replaceState(null,'',`#${area}/${labId}`);}
function glossary(list){return `<div class="lab-lectures">${list.map(([term,definition])=>`<article><strong>${escapeHtml(term)}</strong><p>${escapeHtml(definition)}</p></article>`).join('')}</div>`;}
function menu(){const rows=area==='algorithms'?LABS:area==='cpp'?CPP_LABS:[];return `<h2>${area==='algorithms'?'Executable exercises':area==='cpp'?'Native C++20 projects':'Study methods'}</h2>`+rows.map(x=>`<button type="button" data-lab="${escapeHtml(x.id)}" class="${labId===x.id?'active':''}"><small>LAB ${escapeHtml(x.week)} ${progress.completed[x.id]?'· COMPLETED':''}</small><strong>${escapeHtml(x.title)}</strong></button>`).join('');}
function actions(){return `<div class="lab-controls"><button type="button" class="lab-btn secondary" data-export>Export all laboratory work</button><label class="lab-btn secondary" style="cursor:pointer">Restore backup <input type="file" id="labImport" accept=".json,application/json" hidden></label><span class="lab-small" id="labStatus" role="status"></span></div>`;}
const BUGGY_VARIANTS = {
 'two-sum': `function solve({nums,target}) {const seen=new Map();for(let i=0;i<nums.length;i++){seen.set(nums[i],i);const j=seen.get(target-nums[i]);if(j!==undefined)return [j,i];}return [];}`,
 'window': `function solve({nums,k}) {if(k<1||k>nums.length)return null;let best=0;for(let i=0;i+k<=nums.length;i++){let sum=0;for(let j=i;j<i+k;j++)sum+=nums[j];best=Math.max(best,sum);}return best;}`,
 'lower-bound': `function solve({nums,target}) {let lo=0,hi=nums.length;while(lo<hi){const mid=(lo+hi)>>1;if(nums[mid]<=target)lo=mid+1;else hi=mid;}return lo;}`,
 'reverse-list': `function solve(head){let prev=null,curr=head;while(curr){curr.next=prev;prev=curr;curr=curr.next;}return prev;}`,
 'valid-brackets': `function solve(s){let n=0;for(const c of s){if('([{'.includes(c))n++;else n--;}return n===0;}`,
 'bfs': `function solve({n,edges,source,target}) {const adj=Array.from({length:n},()=>[]);for(const [u,v] of edges){adj[u].push(v);adj[v].push(u);}const seen=new Set();function dfs(u,d){if(u===target)return d;if(seen.has(u))return -1;seen.add(u);for(const v of adj[u]){const r=dfs(v,d+1);if(r!==-1)return r;}return -1;}return dfs(source,0);}`,
 'coin-change': `function solve({coins,amount}) {let count=0;for(const c of [...coins].sort((a,b)=>b-a)){while(amount>=c){amount-=c;count++;}}return amount===0?count:-1;}`,
 'token-bucket': `function solve({capacity,rate,times}) {let tokens=capacity,last=times[0]||0;return times.map(t=>{tokens+=(t-last)*rate;last=t;if(tokens>=1){tokens--;return true;}return false;});}`
};
const TRACE={
 'reverse-list':[
  {title:'Initial',text:'Nodes 1 → 2 → 3 → null. prev=null, curr=node 1. No links changed.'},
  {title:'Save link',text:'next=curr.next (node 2), then curr.next=prev (null). Node 1 becomes a one-node reversed prefix.'},
  {title:'Advance',text:'prev=node 1, curr=node 2. Preserve access to the remainder using next.'},
  {title:'Rewire node 2',text:'next=node 3; node2.next=node1; prev=node2; curr=node3.'},
  {title:'Finish',text:'node3.next=node2; prev=node3; curr=null. Return original tail node 3.'}
 ],
 'lower-bound':[
  {title:'State 0',text:'nums=[1,3,5,7,7], target=7. lo=0, hi=5. The answer is in [lo, hi].'},
  {title:'Test mid=2',text:'nums[2]=5<7. Discard indices 0..2. lo=3, hi=5.'},
  {title:'Test mid=4',text:'nums[4]=7≥7. Retain mid as possible answer. lo=3, hi=4.'},
  {title:'Test mid=3',text:'nums[3]=7≥7. Set hi=3. Now lo=hi=3, so return 3.'}
 ],
 'window':[
  {title:'First full window',text:'nums=[2,-1,5,-2,3], k=3. Sum(2,-1,5)=6; best=6.'},
  {title:'Slide right',text:'Remove 2 and add -2: sum=2; best stays 6.'},
  {title:'Slide again',text:'Remove -1 and add 3: sum=6; best remains 6.'}
 ]
};
function trace(l){if(!TRACE[l.id])return '';const steps=TRACE[l.id];return `<details class="lab-callout" data-trace><summary><strong>Concept walkthrough</strong> — precomputed teaching example, not a trace of your program</summary><div class="lab-controls"><button type="button" class="lab-btn secondary" data-trace-prev>← Previous</button><span id="traceCounter">Step 1/${steps.length}</span><button type="button" class="lab-btn secondary" data-trace-next>Next →</button></div><strong id="traceTitle">${escapeHtml(steps[0].title)}</strong><p id="traceText">${escapeHtml(steps[0].text)}</p></details>`;}
let traceIndex=0;
function renderJs(){const l=knownJs();const src=progress.drafts[l.id]??l.starter;
 return `<p class="lab-meta">ALGORITHMS / LABORATORY ${escapeHtml(l.week)} / ${escapeHtml(l.time)}</p><h2>${escapeHtml(l.title)}</h2><p class="lab-description">${escapeHtml(l.objective)}</p><div class="lab-facts"><span>Editor language: <strong>JavaScript</strong></span><span>Execution: <strong>Disposable browser Worker</strong></span><span>Grading: <strong>Actual unit tests</strong></span></div>
 <h3>1. Vocabulary & prerequisites</h3>${glossary(l.concepts)}
 <h3>2. Principle and proof obligation</h3><div class="lab-invariant"><strong>Loop/state invariant</strong><p>${escapeHtml(l.invariant)}</p></div><p>${escapeHtml(l.reason)}</p><div class="lab-callout"><strong>Counterexample to a tempting shortcut</strong><p>${escapeHtml(l.failure)}</p><strong>Target complexity</strong><p>${escapeHtml(l.complexity)}</p></div>${trace(l)}
 <hr class="lab-divider"><h3>3. Implementation laboratory</h3><p><code>${escapeHtml(l.interface)}</code></p><p class="lab-small">Press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> to run, or choose a test suite. Edits save to this browser. All tests run locally; avoid pasting secrets.</p>
 <textarea class="lab-editor" id="jsEditor" aria-label="Editable JavaScript solution" spellcheck="false">${escapeHtml(src)}</textarea>
 <div class="lab-controls"><div class="lab-segment" role="group" aria-label="Test scope"><button data-level="sample" class="${level==='sample'?'chosen':''}">Examples</button><button data-level="full" class="${level==='full'?'chosen':''}">Full suite</button><button data-level="stress" class="${level==='stress'?'chosen':''}">Stress</button></div><button class="lab-btn" id="runTests" type="button">Run actual tests</button><button class="lab-btn secondary" id="loadBug" type="button">Debug a flawed solution</button><button class="lab-btn secondary" id="resetEditor" type="button">Reset starter</button><button class="lab-btn secondary" id="exportSolution" type="button">Download .js</button></div>
 <div id="testOutput" class="lab-results" aria-live="polite"><p class="lab-busy">Run a suite to see observed outputs, errors, and case-by-case results.</p></div>
 <h3>4. Debugging workshop & recitation</h3><p class="lab-small">Choose “Debug a flawed solution,” predict which case breaks, run the full suite, explain why it fails, then repair the invariant and rerun. Loading it replaces the current editor text; saved drafts can be exported first.</p><ol class="lab-task-list">${l.tasks.map(t=>`<li>${escapeHtml(t)}</li>`).join('')}</ol><textarea class="lab-notes" id="jsNotes" placeholder="Write your invariant, proof, edge cases, and complexity argument." aria-label="Your written reasoning">${escapeHtml(progress.notes[l.id]||'')}</textarea>
 <div class="lab-controls"><details><summary>Staged hints</summary><ol>${l.hint.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ol></details><details><summary>Instructor's reference (consult after attempting)</summary><pre class="lab-cpp-commands">${escapeHtml(l.reference)}</pre></details></div>${actions()}
 <p class="lab-reading">Independent exercises based on classical algorithmic patterns; not a claim of access to any company's private interview questions. True C++20 compiler tests are under the adjacent C++ track.</p>`;
}
function renderCpp(){const l=knownCpp();return `<p class="lab-meta">C++20 & MARKET SYSTEMS / PROJECT ${escapeHtml(l.week)}</p><h2>${escapeHtml(l.title)}</h2><p class="lab-description">${escapeHtml(l.description)}</p><div class="lab-facts"><span>Language: <strong>C++20</strong></span><span>Verification: <strong>g++/Clang, CTest</strong></span><span>Execution: <strong>your local toolchain</strong></span></div>
 <h3>1. Reference concepts</h3>${glossary(l.concepts.map((x,i)=>['Concept '+(i+1),x]))}
 <h3>2. Implement the specification</h3><p>${escapeHtml(l.focus)}</p><div class="lab-invariant"><strong>Required files</strong><p><code>${escapeHtml(l.file)}</code> — your implementation<br><code>${escapeHtml(l.test)}</code> — executable unit tests and edge cases</p></div>
 <div class="lab-controls"><a class="lab-btn" href="cpp/${escapeHtml(l.file.split('/').slice(1).join('/'))}" download>Download starter header</a><a class="lab-btn secondary" href="cpp/${escapeHtml(l.test.split('/').slice(1).join('/'))}" download>Download test source</a><button type="button" class="lab-btn secondary" id="showStarter">View starter source</button></div>
 <pre id="cppSource" class="lab-cpp-commands" hidden>Choose “View starter source” to load the actual header file from this repository.</pre>
 <h3>3. Run the native test suite</h3><p>The project contains a real CMake build, native C++ unit tests, concurrency tests, and a reproducible microbenchmark baseline. The instructor references pass before you implement anything; the student TODO variants should fail.</p>
 <pre class="lab-cpp-commands"># From the root of the downloaded Mastery C++ labs package:
cmake -S cpp -B cpp/build -DCMAKE_BUILD_TYPE=Debug
cmake --build cpp/build --parallel
ctest --test-dir cpp/build --output-on-failure

# Now test YOUR implementation (initially fails on purpose):
cmake -S cpp -B cpp/student-build -DMASTERY_STUDENT=ON
cmake --build cpp/student-build --parallel
ctest --test-dir cpp/student-build --output-on-failure

# Measure baseline on your machine:
cmake -S cpp -B cpp/release-build -DCMAKE_BUILD_TYPE=Release
cmake --build cpp/release-build --parallel
./cpp/release-build/mastery_benchmark</pre>
 <div class="lab-controls"><a href="cpp/README.md" class="lab-btn secondary">C++ setup guide</a><a href="https://github.com/mtk1606/Mastery/tree/main/cpp" target="_blank" rel="noopener" class="lab-btn secondary">View source on GitHub</a><button class="lab-btn secondary" type="button" id="downloadCpp">Get complete C++ project ZIP</button></div>
 <h3>4. Optional browser C++ compiler</h3><p>For a quick single-file compile you may use a third-party browser-hosted WASM compiler. This is <strong>not</strong> the native test suite, and the external compiler may not support threads, full OS facilities or your multi-file project. Copy a standalone smoke-test source, then paste it into the compiler.</p>
 <div class="lab-controls"><button type="button" id="copyCppSmoke" class="lab-btn secondary">Copy self-contained C++ smoke test</button><a class="lab-btn secondary" target="_blank" rel="noopener" href="https://msorvig.github.io/llvm-wasi/">Open browser C++ compiler</a></div>
 <h3>5. Performance and correctness report</h3><p>Do not infer exchange-grade latency from a single local microbenchmark. Record compiler, flags, CPU, load, sample size, p50/p95/p99, and what the results cannot establish.</p><textarea id="cppNotes" class="lab-notes" placeholder="Record bugs found, test results, benchmark observations and next improvements.">${escapeHtml(progress.notes[l.id]||'')}</textarea><div class="lab-controls"><button class="lab-btn secondary" id="markCpp" type="button">${progress.completed[l.id]?'Marked as attempted ✓':'Mark as attempted'}</button></div>${actions()}`;}
function renderMethod(){return `<p class="lab-meta">LABORATORY MANUAL / ASSESSMENT METHOD</p><h2>How to work like an engineer.</h2><p class="lab-description">The primary artifact is not a green badge. It is a correctness argument supported by executable tests, a clear failure model, and an honest performance report.</p><h3>Course protocol</h3><ol class="lab-task-list"><li>Read the specification and identify all new terminology.</li><li>Write the function contract, including empty inputs and invalid cases.</li><li>State an invariant or a state-machine model before coding.</li><li>Implement a correct baseline; never optimize an untested guess.</li><li>Run examples, adversarial tests, and deterministic randomized cases.</li><li>For C++, compile with warnings, then rerun under supported sanitizers.</li><li>Only then benchmark under a controlled configuration.</li><li>Explain what would change in production: cancellation complexity, overflow, tail latency, synchronization, memory pressure and fault handling.</li></ol>
 <h3>Integrity of the runners</h3><div class="lab-callout"><p><strong>Browser algorithm tests:</strong> run JavaScript authored by you, in a disposable browser worker with a wall-clock timeout. The source and test inputs stay in your browser. Workers are not a secure adversarial sandbox, so never paste credentials or private data.</p><p><strong>C++ projects:</strong> the provided source files are compiled and tested by your real local compiler. A third-party browser C++ playground is optional and cannot be treated as an equivalent result.</p><p><strong>Performance:</strong> microbenchmarks are measurements of a particular build and machine, not promises of HFT-grade p99 or real exchange behavior. The browser JS per-test durations are diagnostic only.</p></div>
 <h3>Review rubric</h3><div class="lab-lectures"><article><strong>Correctness</strong><p>Does it pass edge cases? Can you state and justify its invariant?</p></article><article><strong>Design</strong><p>Are ownership, mutation, and error contracts explicit?</p></article><article><strong>Complexity</strong><p>Can you derive—not guess—time and memory bounds?</p></article><article><strong>Experiment</strong><p>Can another engineer repeat the build and understand what was measured?</p></article></div>${actions()}`;}
function render(){
 document.querySelectorAll('[data-area]').forEach(b=>{b.classList.toggle('active',b.dataset.area===area);b.setAttribute('aria-selected',String(b.dataset.area===area));});
 $('labList').innerHTML=menu();traceIndex=0;
 $('labReader').innerHTML=area==='algorithms'?renderJs():area==='cpp'?renderCpp():renderMethod();
 if(area==='algorithms'){
  const editor=$('jsEditor');
  editor.addEventListener('input',()=>{progress.drafts[labId]=editor.value;save();});
  editor.addEventListener('keydown',ev=>{if(ev.key==='Tab'){ev.preventDefault();const p=editor.selectionStart;editor.setRangeText('  ',p,editor.selectionEnd,'end');editor.dispatchEvent(new Event('input'));}if(ev.key==='Enter'&&(ev.ctrlKey||ev.metaKey)){ev.preventDefault();runTests();}});
  $('jsNotes').addEventListener('input',ev=>{progress.notes[labId]=ev.target.value;save();});
  $('runTests').addEventListener('click',runTests);
  $('loadBug').addEventListener('click',()=>{if(!confirm('Replace the editor with a deliberately buggy implementation? Export your current draft first if needed.'))return;editor.value=BUGGY_VARIANTS[labId]||editor.value;editor.dispatchEvent(new Event('input'));$('testOutput').innerHTML='<p class="lab-busy">Deliberately flawed code loaded. Predict failures, then run Full suite.</p>';});
  $('resetEditor').addEventListener('click',()=>{if(!confirm('Reset the current draft to the starter?'))return;delete progress.drafts[labId];save();render();});
  $('exportSolution').addEventListener('click',()=>download(labId+'.js',editor.value));
 }else if(area==='cpp'){
  $('cppNotes').addEventListener('input',ev=>{progress.notes[labId]=ev.target.value;save();});
  $('markCpp').addEventListener('click',()=>{progress.completed[labId]=true;save();render();});
  $('showStarter').addEventListener('click',async()=>{const l=knownCpp();const element=$('cppSource');element.hidden=false;try{const response=await fetch(l.file);if(!response.ok)throw Error('HTTP '+response.status);element.textContent=await response.text();}catch(error){element.textContent='Unable to load source: '+error.message;}});
  $('copyCppSmoke').addEventListener('click',copyCppSmoke);
  $('downloadCpp').addEventListener('click',()=>{window.open('https://github.com/mtk1606/Mastery/archive/refs/heads/main.zip','_blank','noopener');notify('Full Mastery repository ZIP opened. The C++ project is inside cpp/.');});
 }
 const file=$('labImport');if(file)file.addEventListener('change',importProgress);
}
function renderResults(data){const output=$('testOutput');if(!output)return;
 if(data.type==='compile-error'){output.innerHTML=`<p class="result-heading">Could not compile or execute this submission</p><pre class="lab-cpp-commands">${escapeHtml(data.message)}</pre>`;return;}
 const rows=data.rows,passed=rows.filter(r=>r.ok).length;
 if(level==='stress'&&passed===rows.length){progress.completed[labId]=true;save();}
 const timings=rows.map(r=>r.ms).sort((a,b)=>a-b);const p95=timings[Math.floor((timings.length-1)*.95)]||0;
 output.innerHTML=`<p class="result-heading">${passed}/${rows.length} cases passed</p><p class="lab-small">Measured in a real browser worker · Total ${data.totalMs.toFixed(2)} ms · Per-case p95 ${p95.toFixed(3)} ms. Not a native C++ benchmark.</p>${rows.map(r=>`<div class="test-row"><span class="test-mark ${r.ok?'pass':'fail'}">${r.ok?'✓':'×'}</span><span><strong>${escapeHtml(r.name)}</strong> <small class="lab-small">${escapeHtml(r.tier)}</small></span><span class="lab-small">${r.ms} ms</span>${r.ok?'':`<span class="test-detail">Expected: ${escapeHtml(r.expected)}\nObserved: ${escapeHtml(r.actual)}${r.error?'\nError: '+escapeHtml(r.error):''}</span>`}</div>`).join('')}`;
 progress.runs[labId]={date:new Date().toISOString(),passed,total:rows.length,scope:level};save();
}
function runTests(){if(runner){runner.terminate();runner=null;}clearTimeout(timeoutHandle);
 const lab=knownJs(),source=$('jsEditor')?.value;if(!source)return;
 const tests=lab.tests.filter(t=>level==='sample'?t.tier==='sample':level==='full'?t.tier!=='stress':true);
 const output=$('testOutput');output.innerHTML='<p class="lab-busy">Executing actual test cases in a disposable browser worker…</p>';
 const btn=$('runTests');if(btn)btn.disabled=true;
 try{runner=new Worker('labs-worker.js');}
 catch(err){if(btn)btn.disabled=false;output.textContent='Workers could not start: '+err.message;return;}
 const current=runner;
 const finish=()=>{clearTimeout(timeoutHandle);current.terminate();if(runner===current)runner=null;if(btn)btn.disabled=false;};
 timeoutHandle=setTimeout(()=>{if(runner!==current)return;finish();if(output)output.innerHTML='<p class="result-heading">Execution stopped after 6 seconds</p><p>Possible infinite loop or an input too large for your implementation. This is a wall-clock watchdog, not instruction-count proof.</p>';},6000);
 current.onmessage=ev=>{if(runner!==current)return;finish();renderResults(ev.data);};
 current.onerror=err=>{if(runner!==current)return;finish();output.textContent='Worker error: '+err.message;};
 current.postMessage({action:'run',source,tests,id:lab.id});
}
async function copyCppSmoke(){const l=knownCpp();const status=$('labStatus');try{
 const res=await fetch(l.file);if(!res.ok)throw Error('HTTP '+res.status);
 const header=(await res.text()).replace('#pragma once','');
 const tests=l.id==='cpp-two-sum'?`\n#include <iostream>\nint main(){try{auto r=mastery::two_sum({2,7,11,15},9);if(r.size()!=2||r[0]==r[1])return 1;std::cout<<"smoke OK\\n";}catch(...){std::cout<<"TODO not implemented\\n";return 1;}}`:
 l.id==='cpp-spsc'?`\n#include <iostream>\nint main(){mastery::SpscRing<int,4> q;int x=0;for(int i=0;i<4;i++)if(!q.push(i))return 1;for(int i=0;i<4;i++)if(!q.pop(x)||x!=i)return 2;std::cout<<"sequential smoke OK (NOT concurrent verification)\\n";}`:
 `\n#include <iostream>\nint main(){try{mastery::OrderBook book;book.limit(1,mastery::Side::Sell,101,4);auto t=book.market(mastery::Side::Buy,2);if(t.size()!=1||t[0].quantity!=2)return 1;std::cout<<"book smoke OK\\n";}catch(...){return 2;}}`;
 const full=header+'\n'+tests;
 if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(full);}else{const t=document.createElement('textarea');t.value=full;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();}
 if(status)status.textContent='Copied standalone C++ source. Paste it into the external compiler.';
 }catch(err){if(status)status.textContent='Unable to prepare compiler source: '+err.message;}
}
async function importProgress(ev){const file=ev.target.files?.[0];if(!file)return;try{
 const data=JSON.parse(await file.text());if(data.format!=='mastery-programming-labs-v1'||typeof data.drafts!=='object'||!data.notes)throw Error('Unrecognized backup format.');
 if(!confirm('Replace your browser laboratory drafts, notes, and test history?'))return;
 const known=new Set([...LABS,...CPP_LABS].map(x=>x.id));const cleaned=fresh();
 for(const key of ['drafts','notes'])for(const [id,val] of Object.entries(data[key]||{}))if(known.has(id)&&typeof val==='string')cleaned[key][id]=val.slice(0,120000);
 for(const [id,val] of Object.entries(data.completed||{}))if(known.has(id))cleaned.completed[id]=!!val;
 progress=cleaned;save();render();notify('Backup successfully restored.');
 }catch(err){notify('Import rejected: '+err.message);}ev.target.value='';}
function exportProgress(){download('mastery-programming-labs-progress.json',JSON.stringify(progress,null,2),'application/json');notify('All laboratory drafts and notes exported.');}
document.addEventListener('click',ev=>{
 const el=ev.target.closest('button,[data-export]');if(!el)return;
 if(el.dataset.area){setArea(el.dataset.area);return;}
 if(el.dataset.lab){selection(el.dataset.lab);return;}
 if('export' in el.dataset){exportProgress();return;}
 if(el.dataset.level){level=el.dataset.level;document.querySelectorAll('[data-level]').forEach(b=>b.classList.toggle('chosen',b.dataset.level===level));return;}
 if(el.hasAttribute('data-trace-prev')||el.hasAttribute('data-trace-next')){
 const s=TRACE[labId];if(!s)return;traceIndex=Math.max(0,Math.min(s.length-1,traceIndex+(el.hasAttribute('data-trace-next')?1:-1)));
 $('traceCounter').textContent=`Step ${traceIndex+1}/${s.length}`;$('traceTitle').textContent=s[traceIndex].title;$('traceText').textContent=s[traceIndex].text;}
});
(function startup(){const hash=decodeURIComponent(location.hash.slice(1));const [t,id]=hash.split('/');if(['algorithms','cpp','method'].includes(t)){area=t;if(area==='cpp'&&CPP_LABS.some(l=>l.id===id))labId=id;else if(area==='algorithms'&&LABS.some(l=>l.id===id))labId=id;else labId=area==='cpp'?CPP_LABS[0].id:LABS[0].id;}render();})();
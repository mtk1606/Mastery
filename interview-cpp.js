/* Phase IX C++20 Interview Defense — verified code, structured conceptual checks,
 * and explicitly ungraded written reasoning. No private interview claims. */
'use strict';
const IX=id=>document.getElementById(id);
const ixEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const IX_KEY='mastery-interview-cpp-phase9-v1';
let ixState={version:1,selected:IX_LESSONS[0].id,records:{}};
try{const stored=JSON.parse(localStorage.getItem(IX_KEY)||'null');if(stored?.version===1&&stored.records&&typeof stored.records==='object')ixState=stored;}catch{}
let ixWorker=null,ixReady=false,ixBusy=false,ixRunning=null,ixTimer=null,ixNextId=0;
const ixLesson=()=>IX_LESSONS.find(x=>x.id===ixState.selected)||IX_LESSONS[0];
function ixRec(){const l=ixLesson();return ixState.records[l.id]||{code:l.starter,reason:'',seed:1,passedSeeds:[],invariant:'',time:'',space:'',last:null};}
function ixSave(){try{localStorage.setItem(IX_KEY,JSON.stringify(ixState));}catch{IX('ixBackupStatus').textContent='Storage unavailable. Export your record to avoid losing work.';}}
function ixPatch(fields){const l=ixLesson(),v={...ixRec(),...fields};ixState.records[l.id]=v;ixSave();}
function ixStop(message){if(ixTimer){clearTimeout(ixTimer);ixTimer=null;}if(ixWorker){ixWorker.terminate();ixWorker=null;}ixReady=false;ixBusy=false;ixRunning=null;IX('ixRun').disabled=false;IX('ixNextSeed').disabled=false;if(message)ixStatus(message,'bad');}
function ixStatus(message,kind=''){IX('ixStatus').textContent=message;IX('ixStatus').className='ix-status'+(kind?' '+kind:'');}
function ixRecordProgress(){const count=IX_LESSONS.filter(l=>new Set(ixState.records[l.id]?.passedSeeds||[]).size>=2).length;IX('ixProgress').textContent=count+' / '+IX_LESSONS.length+' labs passed on two distinct test batches';}
function ixRender(){const l=ixLesson(),r=ixRec();
 IX('ixLessons').innerHTML=IX_LESSONS.map((q,i)=>`<button type="button" class="ix-lesson ${q.id===l.id?'active':''}" data-lab="${ixEscape(q.id)}" aria-current="${q.id===l.id}"><span>${String(i+1).padStart(2,'0')}. ${ixEscape(q.title)}</span><small>${ixEscape(q.unit)} ${new Set(ixState.records[q.id]?.passedSeeds||[]).size>=2?' · 2 batches passed':''}</small></button>`).join('');
 IX('ixLecture').innerHTML=`<p class="ix-eyebrow">${ixEscape(l.unit)} · ${ixEscape(l.level)} · ${l.minutes} MINUTE STUDY</p><h2>${ixEscape(l.title)}</h2><p class="ix-lecture-intro">${ixEscape(l.brief)}</p><div class="ix-source"><span>Publisher-hosted problem statement</span><a href="${l.url}" target="_blank" rel="noopener noreferrer">Open LeetCode problem</a><span>Independent Mastery explanation · No employer endorsement</span></div><div class="ix-contract"><b>Function / class contract</b><code>${ixEscape(l.contract)}</code></div><h3>Concept reference</h3><div class="ix-terms">${l.glossary.map(([a,b])=>`<div class="ix-term"><strong>${ixEscape(a)}</strong><p>${ixEscape(b)}</p></div>`).join('')}</div><h3>Derivation and algorithm</h3><ol>${l.strategy.map(p=>`<li>${ixEscape(p)}</li>`).join('')}</ol><div class="ix-proof"><b>Instructor proof outline</b><p>${ixEscape(l.proof)}</p><b>Known counterexample or failure</b><p>${ixEscape(l.counterexample)}</p></div>`;
 IX('ixWorked').innerHTML=`<p class="ix-eyebrow">WORKED REFERENCE TRACE</p><h2>Follow the state</h2><p><b>Input:</b> <code>${ixEscape(l.worked.input)}</code></p><table class="ix-trace"><thead><tr><th>Operation</th><th>What changes</th></tr></thead><tbody>${l.worked.steps.map(([a,b])=>`<tr><td><code>${ixEscape(a)}</code></td><td>${ixEscape(b)}</td></tr>`).join('')}</tbody></table><p class="ix-hard-case">This is the instructor's reference trace, not an instrumented trace of the code you type.</p>`;
 IX('ixSignature').textContent=l.contract;IX('ixCode').value=typeof r.code==='string'?r.code:l.starter;
 IX('ixReason').value=typeof r.reason==='string'?r.reason:'';IX('ixSeed').textContent=String(r.seed||1);
 IX('ixInvariant').innerHTML='<option value="">Choose the invariant</option>'+l.invariant.choices.map((x,i)=>`<option value="${i}">${ixEscape(x)}</option>`).join('');
 IX('ixTime').innerHTML='<option value="">Choose time complexity</option>'+l.complexityOptions.map((x,i)=>`<option value="${i}">${ixEscape(x)}</option>`).join('');
 const spaceChoices=l.spaceChoices||l.complexityOptions;
 IX('ixSpace').innerHTML='<option value="">Choose space complexity</option>'+spaceChoices.map((x,i)=>`<option value="${i}">${ixEscape(x)}</option>`).join('');
 IX('ixInvariant').value=r.invariant??'';IX('ixTime').value=r.time??'';IX('ixSpace').value=r.space??'';
 IX('ixFollowups').innerHTML=l.followups.map(x=>`<li>${ixEscape(x)}</li>`).join('');
 IX('ixDefenseFeedback').textContent='Structured reasoning has not been checked. Your written proof will not be automatically graded.';
 IX('ixModel').hidden=true;IX('ixModel').replaceChildren();
 ixShowCases([],null);ixStatus('Compile the implementation when ready. Passing two different seeded batches gives stronger evidence than memorizing one sample.');
 IX('ixConsole').textContent='No compiler output for this lesson yet.';ixRecordProgress();
}
function ixSelect(id){if(!IX_LESSONS.some(x=>x.id===id))return;if(ixRunning)ixStop();ixState.selected=id;ixSave();ixRender();history.replaceState(null,'','#'+encodeURIComponent(id));}
function ixShowCases(states,failed){const cases=ixCaseData(ixLesson().id,ixRec().seed||1);
 IX('ixCases').innerHTML=cases.map((c,i)=>`<div class="ix-case"><span>${i+1}. ${ixEscape(c.name)}</span><b class="${(states[i]||'PENDING').toLowerCase()}">${ixEscape(states[i]||'PENDING')}</b></div>`).join('')+(failed?`<div class="ix-failure"><strong>First failing input</strong>\nArguments: ${ixEscape(JSON.stringify(failed.args).slice(0,600))}\nExpected: ${ixEscape(JSON.stringify(failed.expected).slice(0,600))}\nThis input is from the client-side test generator.</div>`:'');
}
function ixOnWorker(ev){const m=ev.data||{};
 if(m.type==='status'){ixStatus(m.message||'Loading compiler…');return;}
 if(m.type==='ready'){ixReady=true;if(ixTimer)clearTimeout(ixTimer);ixTimer=null;ixStatus('Clang/WebAssembly compiler ready. Executing the test harness…');if(ixRunning?.queued)ixSubmit();return;}
 if(m.type==='error'){
  if(ixRunning?.id&&m.id&&m.id!==ixRunning.id)return;
  const msg=(m.phase||'Compiler')+': '+(m.message||'Unknown error');IX('ixConsole').textContent=msg;ixStop(msg);return;
 }
 if(m.type!=='result'||!ixRunning||m.id!==ixRunning.id)return;
 if(ixTimer)clearTimeout(ixTimer);ixTimer=null;
 const run=ixRunning,cases=ixCaseData(run.lab,run.seed),hits=new Map();
 for(const match of String(m.stdout||'').matchAll(/^IX_CASE\|(\d+)\|(PASS|FAIL)\s*$/gm))hits.set(Number(match[1]),match[2]);
 const states=cases.map((_,i)=>hits.get(i+1)||'NOT RUN'),passed=states.filter(x=>x==='PASS').length;
 const failedIdx=states.findIndex(x=>x==='FAIL');ixShowCases(states,failedIdx>=0?cases[failedIdx]:null);
 const full=passed===cases.length&&m.exitCode===0;
 IX('ixConsole').textContent=[m.errors?.join('\n')||'',m.stderr||'',m.stdout||'',`Exit code: ${m.exitCode}; elapsed ${m.elapsedMs} ms`].filter(Boolean).join('\n\n').slice(0,140000);
 const previous=new Set(ixRec().passedSeeds||[]);if(full)previous.add(run.seed);
 ixPatch({last:{seed:run.seed,passed,total:cases.length,at:new Date().toISOString(),exitCode:m.exitCode},passedSeeds:[...previous].sort((a,b)=>a-b)});
 ixStatus(full?`All ${passed}/${cases.length} compiled C++20 cases passed on test batch ${run.seed}. ${previous.size>=2?'Two distinct batches verified.':'Try a new batch to check generalization.'}`:`${passed}/${cases.length} C++20 cases passed. Inspect the failing input and compiler diagnostics.`,full?'good':'bad');
 ixRunning=null;ixBusy=false;IX('ixRun').disabled=false;IX('ixNextSeed').disabled=false;ixRecordProgress();
}
function ixInitWorker(){if(ixWorker)return;
 try{ixWorker=new Worker('cpp-wasm-worker.js');ixWorker.onmessage=ixOnWorker;ixWorker.onerror=e=>ixStop('C++ worker error: '+String(e.message||'Worker failure'));
  ixTimer=setTimeout(()=>ixStop('Compiler initialization exceeded 150 seconds. Try again or run the native tests.'),150000);
  ixWorker.postMessage({type:'init'});
 }catch(e){ixStop('C++ compiler could not start: '+e.message);}
}
function ixSubmit(){if(!ixWorker||!ixReady||!ixRunning)return;ixRunning.queued=false;if(ixTimer)clearTimeout(ixTimer);
 ixTimer=setTimeout(()=>ixStop('C++ compile/run exceeded 100 seconds. Worker terminated; try simpler code or native tools.'),100000);
 ixWorker.postMessage({type:'run',id:ixRunning.id,source:ixRunning.source});
 ixStatus('Compiling your C++20 code and running real test cases…');
}
function ixRun(){if(ixRunning)return;const l=ixLesson(),code=IX('ixCode').value,seed=ixRec().seed||1;
 if(!code.trim()){ixStatus('Write an implementation first.','bad');return;}
 if(code.length>30000){ixStatus('Code must be below 30 KB.','bad');return;}
 const source=ixBuildSource(l,code,seed);if(source.length>64000){ixStatus('Combined test source exceeds worker limit.','bad');return;}
 ixPatch({code});ixRunning={id:++ixNextId,source,seed,lab:l.id,queued:true};ixBusy=true;IX('ixRun').disabled=true;IX('ixNextSeed').disabled=true;ixShowCases([],null);IX('ixConsole').textContent='Preparing C++20 test harness…';
 if(!ixWorker)ixInitWorker();else if(ixReady)ixSubmit();
}
function ixDefense(){const l=ixLesson(),choice=Number(IX('ixInvariant').value),time=Number(IX('ixTime').value),space=Number(IX('ixSpace').value);
 const checks=[['Correctness invariant',IX('ixInvariant').value!==''&&choice===l.invariant.answer,l.invariant.explain],['Time complexity',IX('ixTime').value!==''&&time===l.timeAnswer,l.complexity.why],['Space complexity',IX('ixSpace').value!==''&&space===l.spaceAnswer,l.complexity.why]];
 const passed=checks.filter(x=>x[1]).length;
 IX('ixDefenseFeedback').innerHTML=`<p><strong>${passed} / 3 structured claims correct.</strong> This is not a grade for your written proof.</p>`+checks.map(([k,ok,exp])=>`<div><b>${ixEscape(k)} — ${ok?'supported':'revise'}</b><p>${ixEscape(exp)}</p></div>`).join('');
 ixPatch({invariant:IX('ixInvariant').value,time:IX('ixTime').value,space:IX('ixSpace').value,reason:IX('ixReason').value,defenseScore:passed});
}
function ixReveal(){const l=ixLesson();const model=IX('ixModel');model.hidden=false;model.className='ix-model';model.innerHTML=`<h3>Instructor analysis</h3><p><b>Invariant:</b> ${ixEscape(l.invariant.explain)}</p><p><b>Complexity:</b> ${ixEscape(l.complexity.time)} time, ${ixEscape(l.complexity.space)} space. ${ixEscape(l.complexity.why)}</p><h3>Correctness argument</h3><p>${ixEscape(l.proof)}</p><h3>Reference implementation</h3><pre>${ixEscape(l.reference)}</pre><p class="ix-caption">Compare your explanation with the stated proof obligations. Written work is not machine-graded.</p>`;}
function ixDownload(name,text,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function ixImport(file){if(!file)return;file.text().then(s=>{const x=JSON.parse(s);if(x.format!=='mastery-interview-cpp-v1'||!x.records||typeof x.records!=='object'||Array.isArray(x.records))throw Error('Invalid format');if(!confirm('Replace saved Phase IX work with this backup?'))return;
 const safe={};for(const l of IX_LESSONS){const r=x.records[l.id];if(r&&typeof r==='object'){safe[l.id]={code:String(r.code||l.starter).slice(0,30000),reason:String(r.reason||'').slice(0,14000),seed:Number.isSafeInteger(r.seed)&&r.seed>0?r.seed:1,invariant:String(r.invariant||''),time:String(r.time||''),space:String(r.space||''),passedSeeds:Array.isArray(r.passedSeeds)?r.passedSeeds.filter(n=>Number.isSafeInteger(n)&&n>0).slice(0,150):[]};}}
 ixStop();ixState={version:1,selected:IX_LESSONS.some(y=>y.id===x.selected)?x.selected:IX_LESSONS[0].id,records:safe};ixSave();ixRender();IX('ixBackupStatus').textContent='Phase IX backup restored.';
 }).catch(()=>IX('ixBackupStatus').textContent='Unable to restore: invalid Phase IX JSON backup.');}
function ixBind(){IX('ixLessons').onclick=e=>{const b=e.target.closest('[data-lab]');if(b)ixSelect(b.dataset.lab);};
 IX('ixCode').addEventListener('input',()=>ixPatch({code:IX('ixCode').value}));IX('ixReason').addEventListener('input',()=>ixPatch({reason:IX('ixReason').value}));
 IX('ixRun').onclick=ixRun;IX('ixStop').onclick=()=>ixStop('Stopped by student.');
 IX('ixNextSeed').onclick=()=>{if(ixRunning)return;ixPatch({seed:(ixRec().seed||1)+1});IX('ixSeed').textContent=ixRec().seed;ixShowCases([],null);ixStatus('New deterministic test variation loaded. Compile again.');};
 IX('ixReset').onclick=()=>{if(ixRunning)return;if(!confirm('Reset this lesson code to its starter implementation?'))return;ixPatch({code:ixLesson().starter});IX('ixCode').value=ixLesson().starter;ixStatus('Starter restored. The old evidence record is retained.');};
 IX('ixDownload').onclick=()=>ixDownload('mastery-'+ixLesson().id+'.cpp',ixBuildSource(ixLesson(),IX('ixCode').value,ixRec().seed||1));
 IX('ixCheckDefense').onclick=ixDefense;IX('ixReveal').onclick=ixReveal;
 for(const id of ['ixInvariant','ixTime','ixSpace'])IX(id).addEventListener('change',()=>{const key=id.slice(2).toLowerCase();ixPatch({[key]:IX(id).value})});
 IX('ixExport').onclick=()=>ixDownload('mastery-interview-cpp-phase9.json',JSON.stringify({format:'mastery-interview-cpp-v1',exportedAt:new Date().toISOString(),selected:ixState.selected,records:ixState.records},null,2),'application/json');
 IX('ixImport').onchange=e=>{const f=e.target.files?.[0];if(f)ixImport(f);e.target.value='';};
}
ixBind();const hash=decodeURIComponent(location.hash.slice(1));if(IX_LESSONS.some(x=>x.id===hash))ixState.selected=hash;ixRender();
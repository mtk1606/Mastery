/* Mastery WebAssembly C++ runner.
 * Compiler code is vendored, and the immutable 0.3.0 assets are hosted at an
 * explicitly pinned CDN path. User code is compiled and executed inside this
 * disposable Worker, never via eval or an application backend.
 * Licence: @live-codes/clang-wasm MIT; see vendor/THIRD_PARTY.md.
 */
'use strict';
const PINNED_CDN='https://cdn.jsdelivr.net/npm/@live-codes/clang-wasm@0.3.0/assets/';
async function chooseAssets(){
 const local=new URL('./clang/',self.location.href);
 try{
  const resp=await fetch(new URL('runtime-manifest.v1.json',local),{cache:'no-store'});
  if(resp.ok){
   const manifest=await resp.json();
   if(manifest.manifestVersion===1 && manifest.compiler?.provenance?.version==='22.1.8'){
    emit('status',{message:'Using Clang 22 assets hosted on Mastery’s own site.'});
    return local.href;
   }
  }
 }catch{}
 emit('status',{message:'Local compiler assets unavailable; using the pinned 0.3.0 npm CDN.'});
 return PINNED_CDN;
}
let compiler=null;let initializing=null;
const emit=(type,rest={})=>self.postMessage({type,...rest});
async function init(){
 if(compiler)return;
 if(initializing)return initializing;
 initializing=(async()=>{
  emit('status',{message:'Loading Clang 22 and the C++ standard library (approximately 29 MB on first use)…'});
  importScripts('./vendor/clang-wasm.global.js');
  if(!self.clangWasm || typeof self.clangWasm.createCompiler!=='function') throw Error('Compiler vendor script did not load.');
  compiler=await self.clangWasm.createCompiler('cpp',{std:'gnu++20',baseUrl:await chooseAssets()});
  emit('ready',{message:'Clang/WASI runtime ready. Compile and execution stay in this worker.'});
 })().catch(err=>{compiler=null;initializing=null;throw err});
 return initializing;
}
self.onmessage=async(ev)=>{
 const message=ev.data||{};
 if(message.type==='init'){
  try{await init();}catch(err){emit('error',{phase:'initialization',message:String(err.message||err)})}
  return;
 }
 if(message.type!=='run')return;
 try{
  await init();
  const source=String(message.source||'');
  if(source.length>64000)throw Error('Source exceeds the 64 KB exercise limit.');
  emit('status',{message:'Compiling C++20, linking to WASI, then running tests…'});
  const started=performance.now();
  const result=await compiler.run(source,'',{compileArgs:['-Wall','-Wextra']});
  emit('result',{
   id:message.id,
   stdout:String(result.stdout||'').slice(0,100000),
   stderr:String(result.stderr||'').slice(0,40000),
   errors:Array.isArray(result.errors)?result.errors.map(String).slice(0,150):[],
   exitCode:result.exitCode,
   elapsedMs:Math.round(performance.now()-started)
  });
 }catch(err){emit('error',{id:message.id,phase:'execution',message:String(err.message||err)})}
};
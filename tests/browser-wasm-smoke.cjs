// Real C++20 end-to-end tests: 4 programs, 30 cases, actual Clang WASM in Chromium.
// Requires local static HTTP server and browser access to pinned compiler assets.
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 page.on('console',m=>{if(m.type()==='error')console.log('[browser console]',m.text().slice(0,250))});
 await page.goto('http://127.0.0.1:8765/cpp-lab.html',{waitUntil:'domcontentloaded',timeout:30000});
 let total=0;
 for(const labId of ['two-sum','linked-list','ring','orderbook']){
  await page.locator(`[data-lesson="${labId}"]`).click();
  const expected=await page.evaluate((id)=>{
   const lesson=CPP_LESSONS.find(x=>x.id===id);
   document.querySelector('#cppEditor').value=lesson.reference;
   document.querySelector('#cppEditor').dispatchEvent(new Event('input',{bubbles:true}));
   return lesson.tests.length;
  },labId);
  await page.locator('#runCpp').click();
  await page.waitForFunction(n=>{
   const status=document.querySelector('#compileStatus')?.textContent||'';
   return status.includes(`All ${n} C++20 tests passed.`) || status.includes('Worker error') || status.includes('Compiler installation:') || status.includes('exceeded 45 seconds') || status.includes('initialization timed out') || status.includes('0 of '+n+' C++ tests passed.');
  },expected,{timeout:200000});
  const status=await page.locator('#compileStatus').innerText();
  const passes=await page.locator('#cppCases .pass').count();
  const diagnostics=await page.locator('#cppConsole').innerText();
  console.log('LAB',labId,'result:',status,'tests:',passes+'/'+expected);
  if(passes!==expected){console.log('COMPILER OUTPUT',diagnostics.slice(0,2300));throw Error('Actual browser Clang/WASM failed for '+labId)}
  total+=passes;
 }
 await browser.close();
 if(errors.length)throw Error('Page errors: '+errors.join('; ').slice(0,800));
 if(total!==30)throw Error('Expected 30 C++20 cases, got '+total);
 console.log('REAL BROWSER CLANG/WASI: ALL '+total+' / 30 C++20 ASSERTIONS PASS');
})().catch(e=>{console.error(e);process.exit(1)});
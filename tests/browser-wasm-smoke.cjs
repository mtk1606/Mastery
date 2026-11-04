// Real end-to-end browser compiler smoke test. Requires local static server,
// Playwright Chromium, and network access to pinned Clang 0.3.0 assets.
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 page.on('console',m=>{if(m.type()==='error')console.log('[browser console]',m.text().slice(0,350))});
 await page.goto('http://127.0.0.1:8765/cpp-lab.html',{waitUntil:'domcontentloaded',timeout:30000});
 await page.evaluate(()=>{document.querySelector('#cppEditor').value=CPP_LESSONS[0].reference;
 document.querySelector('#cppEditor').dispatchEvent(new Event('input',{bubbles:true}));});
 await page.click('#runCpp');
 await page.waitForFunction(()=>{
   const status=document.querySelector('#compileStatus')?.textContent||'';
   return status.includes('All 9 C++20 tests passed.') || status.includes('Worker error') || status.includes('Compiler installation:') || status.includes('exceeded 45 seconds') || status.includes('initialization timed out');
 },null,{timeout:210000});
 const status=await page.locator('#compileStatus').innerText();
 const diagnostics=await page.locator('#cppConsole').innerText();
 console.log('STATUS',status);console.log('COMPILER OUTPUT',diagnostics.slice(0,2500));
 const passes=await page.locator('#cppCases .pass').count();
 console.log('WASM PASS COUNT',passes);
 await browser.close();
 if(errors.length)throw Error('Page errors: '+errors.join('; ').slice(0,800));
 if(passes!==9)throw Error('Actual browser Clang/WASM compilation failed: '+status+'\n'+diagnostics.slice(0,800));
 console.log('Actual browser Clang/WASI run: 9 / 9 TESTS PASS');
})().catch(e=>{console.error(e);process.exit(1)});
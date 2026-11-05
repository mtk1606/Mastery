'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1200,height:850}}),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:8897/python-lab.html#sum_positive',{waitUntil:'domcontentloaded'});
 const clean='def sum_positive(values):\n    return sum(v for v in values if v > 0)\n';
 await page.locator('#plCode').fill(clean);
 await page.locator('#plRun').click();
 try{
  await page.waitForFunction(()=>{
   const s=JSON.parse(localStorage.getItem('mastery-python-lab-v1')||'{}');
   return s.passes?.sum_positive?.passed===8;
  },null,{timeout:57000});
 }catch(e){
  const diag=await page.locator('#plStatus').textContent();
  throw new Error('Real Pyodide test never passed: '+diag+' | '+e.message);
 }
 assert.match(await page.locator('#plFeedback').textContent(),/8 \/ 8/);
 let s=await page.evaluate(()=>JSON.parse(localStorage.getItem('mastery-python-lab-v1')));
 assert.equal(s.passes.sum_positive.assisted,false);
 await page.locator('#plCode').fill('def sum_positive(values):\n    return 42\n');
 s=await page.evaluate(()=>JSON.parse(localStorage.getItem('mastery-python-lab-v1')));
 assert.equal(s.passes.sum_positive,undefined,'Editing must invalidate objective test credit');
 await page.locator('#plRun').click();
 await page.waitForFunction(()=>{
  const s=JSON.parse(localStorage.getItem('mastery-python-lab-v1')||'{}');
  return s.attempts?.length>=2;
 },null,{timeout:18000});
 s=await page.evaluate(()=>JSON.parse(localStorage.getItem('mastery-python-lab-v1')));
 assert.equal(s.passes.sum_positive,undefined,'Failing new test must not regain credit');
 assert(s.attempts[s.attempts.length-1].passed<8);
 await page.locator('[data-hint]').first().locator('summary').click();
 await page.locator('#plCode').fill(clean);
 await page.locator('#plRun').click();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('mastery-python-lab-v1')||'{}').passes?.sum_positive?.passed===8,null,{timeout:18000});
 s=await page.evaluate(()=>JSON.parse(localStorage.getItem('mastery-python-lab-v1')));
 assert.equal(s.passes.sum_positive.assisted,true,'Hint usage must label assisted result');
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#plReset').click();
 s=await page.evaluate(()=>JSON.parse(localStorage.getItem('mastery-python-lab-v1')));
 assert.equal(s.passes.sum_positive,undefined,'Fresh attempt must clear old pass');
 assert.equal(s.help.sum_positive,undefined,'Fresh attempt must clear assistance label');
 assert.deepEqual(errors,[],'Uncaught browser errors: '+errors.join(' | '));
 await browser.close();
 console.log('PASS: real Pyodide CPython Worker executed 8 cases; code edit invalidation, failed rerun and assisted verification all work.');
})().catch(e=>{console.error(e);process.exit(1)});

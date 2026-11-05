'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const base='http://127.0.0.1:8895/';
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1390,height:920},acceptDownloads:true,reducedMotion:'reduce'});
 await context.addInitScript(()=>localStorage.setItem('mastery-theme','dark'));
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 const pages=['index.html','focus.html','engineering.html','readiness.html','mock-interviews.html','phase10.html','interview-cpp.html','cpp-lab.html','labs.html','market-systems.html','phase5.html','phase6.html','phase7.html'];
 let desktop=0,mobile=0;
 for(const file of pages){
  await page.setViewportSize({width:1390,height:920});
  let response=await page.goto(base+file,{waitUntil:'domcontentloaded'});
  assert(response.ok(),file+' HTTP error');
  await page.waitForFunction(()=>document.documentElement.dataset.theme==='dark',{timeout:8000});
  let computed=await page.evaluate(()=>{
   const html=getComputedStyle(document.documentElement),body=getComputedStyle(document.body);
   const t=document.querySelector('.theme-switch button[data-set-theme="dark"]');
   return {bg:html.getPropertyValue('--bg').trim(),accent:html.getPropertyValue('--accent').trim(),bodyBg:body.backgroundColor,toggle:t?.getAttribute('aria-pressed'),focusLink:!!document.querySelector('a[href="focus.html"]'),overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert.equal(computed.bg,'#0b0b0c',file+' uses incorrect dark background token');
  assert.equal(computed.bodyBg,'rgb(11, 11, 12)',file+' paints incorrect body background');
  assert.equal(computed.accent,'#dfcba1',file+' uses blue accent');
  assert.equal(computed.toggle,'true',file+' dark toggle not selected');
  assert(computed.focusLink,file+' lacks return to Focus');
  desktop++;
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(45);
  const width=await page.evaluate(()=>({body:document.body.scrollWidth,root:document.documentElement.scrollWidth,screen:innerWidth}));
  assert(width.root<=width.screen+3,file+' mobile horizontal overflow '+JSON.stringify(width));
  mobile++;
 }
 await page.goto(base+'index.html#/',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#mastery-mathjax').count(),0,'MathJax should not load for homepage');
 await page.evaluate(()=>{location.hash='#/math'});
 await page.locator('#mastery-mathjax').waitFor({state:'attached',timeout:8000});
 await page.goto(base+'focus.html',{waitUntil:'domcontentloaded'});
 assert((await page.locator('.f-headline h1').textContent()).includes('One clear win.'));
 const ring=await page.locator('.f-ring').evaluate(n=>parseFloat(getComputedStyle(n).animationDuration));
 assert(ring<=0.005,'Reduced-motion should remove decorative animations');
 await page.locator('[data-set-theme="light"]').first().click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()),'#f7f6f3');
 assert.deepEqual(errors,[],'Browser exceptions: '+errors.join(' | '));
 console.log('PASS: '+desktop+' desktop dark theme pages; '+mobile+' mobile layouts; maths lazy-load; accessible toggle and reduced-motion');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const htmls=fs.readdirSync(root).filter(x=>x.endsWith('.html')).sort();
assert.equal(htmls.length,17,'All 17 principal Mastery pages must be covered');
let resources=0,links=0;
for(const file of htmls){
 const text=fs.readFileSync(path.join(root,file),'utf8');
 assert.match(text,/mastery-polish\.css/,file+' missing shared visual design');
 assert.match(text,/theme\.js/,file+' missing shared colour preference');
 assert.match(text,/<nav\b/i,file+' missing navigation');
 assert.match(text,/href="focus\.html"/,file+' missing learning-desk route');
 for(const m of text.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"']+)["']/gi)){
  const href=m[1],name=href.split('?')[0].split('#')[0];
  if(!name||/^(?:https?:|data:|#|mailto:)/i.test(name))continue;
  assert(fs.existsSync(path.join(root,name)),file+' missing dependency '+name);resources++;
 }
 for(const m of text.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)){
  const href=m[1],name=href.split('?')[0].split('#')[0];
  if(!name||/^(?:https?:|data:|#|mailto:|tel:|javascript:)/i.test(name))continue;
  assert(fs.existsSync(path.join(root,name)),file+' broken local link '+name);links++;
 }
}
const css=fs.readFileSync(path.join(root,'mastery-polish.css'),'utf8');
assert(css.includes('--bg:#0b0b0c')&&css.includes('--surface:#171719'),'Dark palette must be charcoal, not navy');
assert(css.includes('--accent:#dfcba1'),'Warm brass accent required for dark readability');
assert(css.includes('prefers-reduced-motion'),'Reduced-motion must be supported');
assert(!css.includes('#111820')&&!css.includes('#19232d'),'Legacy navy leaked into final design system');

function luminance(hex){const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
for(const [label,fg,bg,min] of [
 ['dark body','#f4f1ea','#171719',7],
 ['dark muted text','#bcb8b0','#171719',7],
 ['dark accent','#dfcba1','#0b0b0c',7],
 ['light body','#252420','#fffefa',7],
 ['light muted text','#66645f','#fffefa',4.5]
 ])assert(contrast(fg,bg)>=min,label+' contrast below '+min);

const dark=fs.readFileSync(path.join(root,'dark.css'),'utf8');
assert(!dark.includes('#111b29')&&!dark.includes('#0c111a'),'Legacy course dark CSS still paints navy');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(index.includes('ensureMasteryMath')&&!/<script defer src="https:\/\/cdn\.jsdelivr\.net\/npm\/mathjax/.test(index),'Math engine must load lazily');
const readiness=fs.readFileSync(path.join(root,'readiness.js'),'utf8');
assert(readiness.includes("state.drafts[id]?.code!==code"),'Worker must discard obsolete source run');
assert(readiness.includes('state.reviews[id].verified=false'),'Edits must invalidate current pass');
console.log('PASS: '+htmls.length+' Mastery HTML pages; '+resources+' internal assets; '+links+' internal links; neutral dark design, motion and verification invariants');
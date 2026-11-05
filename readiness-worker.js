/* Single-user, disposable JavaScript Web Worker. NOT a hardened multi-user sandbox.
   Every case is actually run; a parent timer terminates non-terminating student code. */
'use strict';
const functions={
 'two-sum':'twoSum','valid-parentheses':'isValid','binary-search':'search','sliding-window-maximum':'maxSlidingWindow',
 'reverse-linked-list':'reverseList','merge-intervals':'merge','coin-change':'coinChange',
 'longest-substring-without-repeating-characters':'lengthOfLongestSubstring','top-k-frequent-elements':'topKFrequent','lru-cache':'lruCache'
};
function random(seed){let x=(seed|0)||1;return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}}
function rand(r,a,b){return a+Math.floor(r()*(b-a+1))}
function equal(a,b){return JSON.stringify(a)===JSON.stringify(b)}
const asJSON=x=>{try{return JSON.stringify(x)}catch{return String(x)}};
function mkCases(slug,seed){const r=random((seed||1)*998244353+31),list=[],add=(name,args,expected)=>list.push({name,args,expected});
 if(slug==='two-sum'){
  add('canonical',[[2,7,11,15],9],true);add('duplicate values',[[3,3],6],true);add('negative values',[[-10,4,5,20],10],true);
  for(let i=0;i<15;i++){const n=rand(r,2,24),nums=Array.from({length:n},()=>rand(r,-120,120));let a=rand(r,0,n-1),b=(a+rand(r,1,n-1))%n;add('seeded pair '+i,[nums,nums[a]+nums[b]],true)}
 }else if(slug==='valid-parentheses'){
  for(const s of ['','()','([]{})','([)]','((((','{[()]}','())','{','(((())))','[]{}()','[{]}','[[]]'])add('brackets '+JSON.stringify(s),[s],oracleValid(s));
  const chars='()[]{}';for(let i=0;i<18;i++){let s='';for(let j=0,k=rand(r,0,35);j<k;j++)s+=chars[rand(r,0,5)];add('seeded '+i,[s],oracleValid(s))}
 }else if(slug==='binary-search'){
  add('empty',[[],1],-1);add('singleton hit',[[5],5],0);add('singleton miss',[[5],3],-1);
  for(let i=0;i<21;i++){const nums=[...new Set(Array.from({length:rand(r,1,40)},()=>rand(r,-100,100)))].sort((a,b)=>a-b),needle=r()<.6?nums[rand(r,0,nums.length-1)]:rand(r,-100,100);add('sorted '+i,[nums,needle],nums.indexOf(needle))}
 }else if(slug==='sliding-window-maximum'){
  add('known example',[[1,3,-1,-3,5,3,6,7],3],[3,3,5,5,6,7]);
  for(let i=0;i<22;i++){const n=rand(r,1,48),nums=Array.from({length:n},()=>rand(r,-80,80)),k=rand(r,1,n);add('window '+i,[nums,k],nums.slice(0,n-k+1).map((_,j)=>Math.max(...nums.slice(j,j+k))))}
 }else if(slug==='merge-intervals'){
  add('overlap',[[[1,3],[2,6],[8,10],[15,18]]],[[1,6],[8,10],[15,18]]);add('touching boundaries',[[[1,4],[4,5]]],[[1,5]]);add('empty',[[]],[]);
  for(let i=0;i<20;i++){const x=Array.from({length:rand(r,1,20)},()=>{let a=rand(r,-50,50);return [a,a+rand(r,0,15)]});add('merge '+i,[x],oracleMerge(x))}
 }else if(slug==='coin-change'){
  add('canonical',[[1,2,5],11],3);add('impossible',[[2],3],-1);add('zero',[[2],0],0);
  for(let i=0;i<19;i++){const coins=[...new Set(Array.from({length:rand(r,1,6)},()=>rand(r,1,14)))],amount=rand(r,0,80);add('coin '+i,[coins,amount],oracleCoin(coins,amount))}
 }else if(slug==='longest-substring-without-repeating-characters'){
  for(const s of ['','abcabcbb','bbbbb','pwwkew','dvdf','abba','a','abcdef','ababab','tmmzuxt'])add('substring '+JSON.stringify(s),[s],oracleLongest(s));
  for(let i=0;i<18;i++){let s='',chars='abcdefg';for(let k=rand(r,1,75),j=0;j<k;j++)s+=chars[rand(r,0,6)];add('seeded '+i,[s],oracleLongest(s))}
 }else if(slug==='top-k-frequent-elements'){
  add('simple',[[1,1,1,2,2,3],2],true);add('singleton',[[1],1],true);
  for(let i=0;i<22;i++){let unique=rand(r,1,9),nums=[],v=-35;for(let j=0;j<unique;j++){v+=rand(r,1,5);for(let k=0;k<j+1;k++)nums.push(v)};const k=rand(r,1,unique);add('frequency '+i,[nums,k],true)}
 }else if(slug==='lru-cache'){
  const cs=[ [2,[['put',1,1],['put',2,2],['get',1],['put',3,3],['get',2],['put',4,4],['get',1],['get',3],['get',4]]],[0,[['put',1,5],['get',1]]]];
  for(const [c,ops] of cs)add('reference '+c,[c,ops],oracleLRU(c,ops));
  for(let i=0;i<17;i++){const cap=rand(r,0,7),ops=Array.from({length:rand(r,10,70)},()=>r()<.45?['get',rand(r,0,9)]:['put',rand(r,0,9),rand(r,-100,100)]);add('operations '+i,[cap,ops],oracleLRU(cap,ops))}
 }else if(slug==='reverse-linked-list'){
  for(const n of [0,1,2,3,4,9,20,49])add('node count '+n,[Array.from({length:n},()=>rand(r,-10,10))],true);
  for(let i=0;i<17;i++)add('random nodes '+i,[Array.from({length:rand(r,0,35)},()=>rand(r,-100,100))],true);
 }
 return list;
}
function oracleValid(s){const m={')':'(',']':'[','}':'{'},a=[];for(const ch of s){if('([{'.includes(ch))a.push(ch);else if(a.pop()!==m[ch])return false}return !a.length}
function oracleMerge(a){const x=a.map(t=>t.slice()).sort((p,q)=>p[0]-q[0]);const ans=[];for(const t of x){const z=ans[ans.length-1];if(z&&t[0]<=z[1])z[1]=Math.max(z[1],t[1]);else ans.push(t)}return ans}
function oracleCoin(coins,amount){const dp=Array(amount+1).fill(Infinity);dp[0]=0;for(let a=1;a<=amount;a++)for(const c of coins)if(a>=c)dp[a]=Math.min(dp[a],dp[a-c]+1);return Number.isFinite(dp[amount])?dp[amount]:-1}
function oracleLongest(s){let best=0;for(let i=0;i<s.length;i++){const seen=new Set();for(let j=i;j<s.length&&!seen.has(s[j]);j++){seen.add(s[j]);best=Math.max(best,j-i+1)}}return best}
function oracleLRU(cap,ops){const m=new Map(),out=[];for(const op of ops){if(op[0]==='get'){const v=m.has(op[1])?m.get(op[1]):-1;out.push(v);if(m.has(op[1])){m.delete(op[1]);m.set(op[1],v)}}else{if(m.has(op[1]))m.delete(op[1]);if(cap>0){m.set(op[1],op[2]);if(m.size>cap)m.delete(m.keys().next().value)}}}return out}
function createList(values){const nodes=values.map(val=>({val,next:null}));for(let i=0;i<nodes.length-1;i++)nodes[i].next=nodes[i+1];return {head:nodes[0]||null,nodes}}
function verify(slug,fn,tc){if(slug==='reverse-linked-list'){const {head,nodes}=createList(tc.args[0]);const out=fn(head);let current=out,seen=new Set(),actual=[];for(let count=0;current&&count<=nodes.length;count++){if(seen.has(current))break;seen.add(current);actual.push(current);current=current.next}const ok=actual.length===nodes.length&&current===null&&nodes.every((n,i)=>actual[i]===nodes[nodes.length-1-i]);return {ok,received:actual.map(n=>n.val)};}
 const args=JSON.parse(JSON.stringify(tc.args)),answer=fn(...args);if(slug==='two-sum'){const [nums,target]=tc.args,ok=Array.isArray(answer)&&answer.length===2&&answer.every(i=>Number.isInteger(i)&&i>=0&&i<nums.length)&&answer[0]!==answer[1]&&nums[answer[0]]+nums[answer[1]]===target;return {ok,received:answer};}
 if(slug==='top-k-frequent-elements'){const [nums,k]=tc.args,counts=new Map();for(const n of nums)counts.set(n,(counts.get(n)||0)+1);const threshold=[...counts.values()].sort((a,b)=>b-a)[k-1],ok=Array.isArray(answer)&&answer.length===k&&new Set(answer).size===k&&answer.every(v=>counts.has(v)&&counts.get(v)>=threshold);return {ok,received:answer};}
 return {ok:equal(answer,tc.expected),received:answer};}
onmessage=ev=>{const {slug,code,seed}=ev.data||{};if(ev.data?.type!=='run'||!functions[slug])return;const total=mkCases(slug,seed).length;let passed=0,failures=[],error='';try{if(typeof code!=='string'||code.length>60000)throw Error('Source must be under 60 KB');const name=functions[slug];const fn=new Function('"use strict";\n'+code+'\nreturn typeof '+name+' === "function" ? '+name+' : undefined;')();if(typeof fn!=='function')throw Error('Expected a function named '+name);for(const tc of mkCases(slug,seed)){try{const got=verify(slug,fn,tc);if(got.ok)passed++;else failures.push({name:tc.name,input:asJSON(tc.args),expected:slug==='two-sum'?'two distinct indices':slug==='top-k-frequent-elements'?'any valid top-k values':slug==='reverse-linked-list'?'original nodes in reverse order':asJSON(tc.expected),received:asJSON(got.received)});}catch(e){failures.push({name:tc.name,input:asJSON(tc.args),expected:asJSON(tc.expected),received:'Exception: '+String(e.message||e)})}if(failures.length>=6)break;}}catch(e){error=String(e.message||e)}postMessage({type:'result',passed,total,error,failures});};
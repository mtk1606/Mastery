'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const base=__dirname+'/../';
const source=fs.readFileSync(base+'readiness-worker.js','utf8');
const impl={
 'two-sum':`function twoSum(nums,target){const map=new Map();for(let i=0;i<nums.length;i++){let need=target-nums[i];if(map.has(need))return [map.get(need),i];map.set(nums[i],i)}return []}`,
 'valid-parentheses':`function isValid(s){const map={')':'(',']':'[','}':'{'},a=[];for(const c of s){if('([{'.includes(c))a.push(c);else if(a.pop()!==map[c])return false}return a.length===0}`,
 'binary-search':`function search(nums,target){let l=0,r=nums.length-1;while(l<=r){const m=l+Math.floor((r-l)/2);if(nums[m]===target)return m;if(nums[m]<target)l=m+1;else r=m-1}return -1}`,
 'sliding-window-maximum':`function maxSlidingWindow(nums,k){const q=[],out=[];let head=0;for(let i=0;i<nums.length;i++){while(q.length>head&&q[head]<=i-k)head++;while(q.length>head&&nums[q[q.length-1]]<=nums[i])q.pop();q.push(i);if(i>=k-1)out.push(nums[q[head]])}return out}`,
 'reverse-linked-list':`function reverseList(head){let prev=null;while(head){const next=head.next;head.next=prev;prev=head;head=next}return prev}`,
 'merge-intervals':`function merge(intervals){const a=intervals.map(x=>x.slice()).sort((x,y)=>x[0]-y[0]),out=[];for(const x of a){const prev=out[out.length-1];if(prev&&x[0]<=prev[1])prev[1]=Math.max(prev[1],x[1]);else out.push(x)}return out}`,
 'coin-change':`function coinChange(coins,amount){const dp=Array(amount+1).fill(Infinity);dp[0]=0;for(let a=1;a<=amount;a++)for(const c of coins)if(a>=c)dp[a]=Math.min(dp[a],1+dp[a-c]);return Number.isFinite(dp[amount])?dp[amount]:-1}`,
 'longest-substring-without-repeating-characters':`function lengthOfLongestSubstring(s){const seen=new Map();let left=0,best=0;for(let i=0;i<s.length;i++){if(seen.has(s[i]))left=Math.max(left,seen.get(s[i])+1);seen.set(s[i],i);best=Math.max(best,i-left+1)}return best}`,
 'top-k-frequent-elements':`function topKFrequent(nums,k){const m=new Map();for(const x of nums)m.set(x,(m.get(x)||0)+1);return [...m].sort((a,b)=>b[1]-a[1]).slice(0,k).map(x=>x[0])}`,
 'lru-cache':`function lruCache(capacity,ops){const m=new Map(),res=[];for(const op of ops){if(op[0]==='get'){if(!m.has(op[1]))res.push(-1);else{let x=m.get(op[1]);m.delete(op[1]);m.set(op[1],x);res.push(x)}}else{m.delete(op[1]);if(capacity>0){m.set(op[1],op[2]);if(m.size>capacity)m.delete(m.keys().next().value)}}}return res}`
};
let tests=0;
for(const [slug,code] of Object.entries(impl))for(const seed of [1,2,11]){
 let result;const context=vm.createContext({postMessage:x=>{result=x},console});vm.runInContext(source,context);context.onmessage({data:{type:'run',slug,code,seed}});
 assert(result,`no worker response ${slug}`);assert.equal(result.passed,result.total,`${slug} seed ${seed} failures: ${JSON.stringify(result.failures)}`);assert(result.total>=10,`${slug} insufficient test cases`);tests+=result.total;
}
{
 let result;const context=vm.createContext({postMessage:x=>{result=x}});vm.runInContext(source,context);context.onmessage({data:{type:'run',slug:'binary-search',code:'function search(nums,target) { return -1 }',seed:5}});assert(result.passed<result.total,'wrong solution incorrectly passed');
}
{
 let result;const context=vm.createContext({postMessage:x=>{result=x}});vm.runInContext(source,context);context.onmessage({data:{type:'run',slug:'two-sum',code:'function twoSum() { ERROR! }',seed:5}});assert(result.error,'syntax error unreported');
}
let bank=[];
if(fs.existsSync(base+'readiness-bank.js')){const code=fs.readFileSync(base+'readiness-bank.js','utf8');const c=vm.createContext({});bank=vm.runInContext(code+';READINESS_BANK',c);assert(Array.isArray(bank));assert.equal(new Set(bank.map(x=>x.id)).size,bank.length);for(const q of bank){assert(/^https:\/\/leetcode\.com\/problems\/[\w-]+\/$/.test(q.url),q.url);assert(q.sourceUrl?.startsWith('https://github.com/liquidslr/'));assert(q.evidence==='community')}if(process.env.CI){assert(bank.length>=180,`Only ${bank.length} sourced questions`);assert(bank.filter(x=>x.companies.includes('Citadel')).length>=15);}}
console.log(`PASS: ${tests} executed reference assertions across 10 coding patterns, 3 seeds each; negative controls; ${bank.length} validated bank entries`);
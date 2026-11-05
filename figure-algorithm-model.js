/* Original textbook-grade algorithm model and independent reference traces.
 * Source-visible deterministic data: no copied textbook figures. */
(function(root){
'use strict';
const graph={A:['B','C'],B:['D'],C:['D'],D:[]};
function windowStates(values=[1,2,3,4],k=2){
 if(!Array.isArray(values)||!values.every(Number.isFinite)||!Number.isInteger(k)||k<1||k>values.length)throw Error('Bad window');
 const result=[];let total=0,best=-Infinity;
 for(let i=0;i<values.length;i++){
  if(i<k){total+=values[i];if(i!==k-1)continue;}
  else total+=values[i]-values[i-k];
  const left=i-k+1;best=Math.max(best,total);
  result.push({values:values.slice(),k,left,total,best,out:left?values[left-1]:null,in:left?values[i]:null,
  explain:left?'Remove '+values[left-1]+' and add '+values[i]+': window sum '+total+'.':'Initialize from a real window: sum '+total+'.'});
 }
 return result;
}
function lowerBoundStates(values=[1,2,2,2,5],target=2){
 if(!Array.isArray(values)||values.some((x,i)=>i>0&&values[i-1]>x))throw Error('Unsorted input');
 let lo=0,hi=values.length;const steps=[];
 while(lo<hi){
  const mid=Math.floor((lo+hi)/2),value=values[mid];
  steps.push({values:values.slice(),target,lo,hi,mid,result:null,compare:value>=target?'keep left including mid':'discard through mid'});
  if(value>=target)hi=mid;else lo=mid+1;
 }
 steps.push({values:values.slice(),target,lo,hi,mid:null,result:lo<values.length&&values[lo]===target?lo:-1,compare:'done'});
 return steps;
}
function bfsStates(){
 const queue=['A'],distance={A:0},visited=[],steps=[];
 steps.push({queue:[...queue],distance:{...distance},visited:[...visited],active:'A',expanded:null});
 while(queue.length){
  const u=queue.shift();visited.push(u);
  for(const v of graph[u])if(!(v in distance)){distance[v]=distance[u]+1;queue.push(v);}
  steps.push({queue:[...queue],distance:{...distance},visited:[...visited],active:u,expanded:u});
 }
 return steps;
}
function coinStages(coins=[1,2,5],amount=5){
 if(!Array.isArray(coins)||coins.some((c,i)=>!Number.isInteger(c)||c<=0||i>0&&coins[i-1]>=c)||!Number.isInteger(amount)||amount<0)throw Error('Invalid DP');
 const dp=Array(amount+1).fill(0);dp[0]=1;
 const stages=[{coins:[],dp:[...dp],focus:0,transitions:[]}];
 for(const coin of coins){
  const transitions=[];
  for(let s=coin;s<=amount;s++){
   const before=dp[s],source=dp[s-coin];
   dp[s]+=source;
   transitions.push({amount:s,source:s-coin,before,addition:source,after:dp[s]});
  }
  const focus=Math.min(amount,coin===2?4:coin);
  stages.push({coins:coins.slice(0,stages.length),dp:[...dp],focus,transitions});
 }
 return stages;
}
function validate(){
 const windows=windowStates();if(windows.length!==3||windows[2].total!==7||windows[2].best!==7)return false;
 const search=lowerBoundStates();if(search.at(-1).result!==1)return false;
 const bfs=bfsStates();if(bfs.length!==5||bfs.at(-1).distance.D!==2)return false;
 const coins=coinStages();if(coins.length!==4||coins.at(-1).dp[5]!==4)return false;
 return true;
}
const api={graph,windowStates,lowerBoundStates,bfsStates,coinStages,validate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.MasteryAlgorithmPlateModel=api;
})(typeof window!=='undefined'?window:globalThis);

/* Mastery figure lab: a reproducible and independently testable insertion-sort trace.
 * Original dataset and diagram states; not a reproduction of a textbook figure. */
(function(root){
'use strict';
const examples={
 mixed:{label:'Mixed example',values:[8,3,6,2,7,4]},
 sorted:{label:'Already sorted',values:[2,4,6,8,9,10]},
 reverse:{label:'Reverse sorted',values:[10,9,8,7,6,5]}
};
function build(variant='mixed'){
 const entry=examples[variant];
 if(!entry)throw Error('Unknown insertion-sort variant: '+variant);
 const array=entry.values.slice(),stages=[{
  pass:0,label:'Start',array:array.slice(),key:null,from:null,insertAt:null,
  moves:[],sortedEnd:0,explain:'Before the outer loop, the first element is trivially sorted. The remaining values are not yet part of the sorted prefix.',
  line:1
 }];
 for(let j=1;j<array.length;j++){
  const key=array[j],before=array.slice(),moves=[];
  let i=j-1;
  while(i>=0&&array[i]>key){
   moves.push({from:i,to:i+1,value:array[i]});
   array[i+1]=array[i];i--;
  }
  array[i+1]=key;
  const sortedEnd=j,insertAt=i+1;
  const shifted=moves.length?moves.map(m=>m.value).join(', '):'none';
  stages.push({
   pass:j,label:'Insert '+key,array:array.slice(),before,key,from:j,insertAt,moves,
   sortedEnd,line:7,
   explain:'Hold '+key+' as the key from index '+j+'. Shift '+moves.length+
    ' larger '+(moves.length===1?'value':'values')+' one position right ('+shifted+
    '), then place the key at index '+insertAt+'. The prefix A[0…'+j+
    '] is now sorted; the suffix remains unprocessed.'
  });
 }
 return {variant,label:entry.label,input:entry.values.slice(),stages,sorted:array.slice()};
}
function validate(){
 for(const variant of Object.keys(examples)){
  const trace=build(variant);
  const arr=trace.input.slice();
  if(trace.stages.length!==arr.length)throw Error('Stage count mismatch');
  for(let j=1;j<arr.length;j++){
   const f=trace.stages[j];if(f.pass!==j||f.key!==f.before[j])throw Error('Wrong selected key');
   const key=arr[j];let i=j-1;
   while(i>=0&&arr[i]>key){arr[i+1]=arr[i];i--;}arr[i+1]=key;
   if(arr.some((v,k)=>v!==f.array[k]))throw Error('Wrong insertion trace '+variant+'/'+j);
   if(f.array.slice(0,j+1).some((v,k,a)=>k>0&&a[k-1]>v))throw Error('Unsorted prefix');
  }
  if(trace.sorted.some((v,k,a)=>k>0&&a[k-1]>v))throw Error('Final result not sorted');
 }
 return true;
}
const api={examples,build,validate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.MasteryInsertionFigure=api;
})(typeof window!=='undefined'?window:globalThis);

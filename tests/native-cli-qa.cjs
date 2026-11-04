'use strict';
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {execFileSync,spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),exe=p=>path.join(root,'exchange','build',p);
const fixture=path.join(root,'exchange','fixtures','session.csv');
const expected=JSON.parse(fs.readFileSync(path.join(root,'exchange','fixtures','expected.json'),'utf8'));
const one=JSON.parse(execFileSync(exe('mastery_replay'),[fixture],{encoding:'utf8'}));assert.deepEqual(one,expected);
const two=JSON.parse(execFileSync(exe('mastery_replay'),[fixture],{encoding:'utf8'}));assert.deepEqual(two,one);
const altered=fs.mkdtempSync('/tmp/mastery-qa-');
try{
 const gap=path.join(altered,'gap.csv');fs.writeFileSync(gap,'seq,kind,id,side,price,quantity\n1,limit,1,buy,99,4\n3,limit,2,sell,100,2\n');
 const bad=spawnSync(exe('mastery_replay'),[gap],{encoding:'utf8'});assert.equal(bad.status,1);assert.match(bad.stderr,/Sequence gap/);
}finally{fs.rmSync(altered,{recursive:true,force:true});}
const report=JSON.parse(execFileSync(exe('mastery_exchange_bench'),[],{encoding:'utf8'}));
assert.equal(report.kind,'mastery-native-benchmark');assert.equal(report.version,1);assert.equal(report.clock,'steady_clock');assert.equal(report.samples.length,2);
for(const s of report.samples){assert.equal(s.units,'ns');assert(s.observations===10000);assert(s.p50>=0&&s.p95>=s.p50&&s.p99>=s.p95);}
console.log('PASS: C++ replay golden JSON, duplicate determinism, gap failure and real native benchmark schema');
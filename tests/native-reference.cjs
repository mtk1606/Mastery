'use strict';
const assert=require('node:assert/strict');const fs=require('node:fs'),os=require('node:os'),path=require('node:path');const cp=require('node:child_process');
const {IX_LESSONS,ixBuildSource,ixCaseData}=require('../interview-cpp-data.js');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ix-cpp-'));
let total=0;
try{
  for(const lesson of IX_LESSONS){
    for(const seed of [1,2,11]){
      const source=ixBuildSource(lesson,lesson.reference,seed),name=path.join(dir,lesson.id+'-'+seed),expected=ixCaseData(lesson.id,seed).length;
      fs.writeFileSync(name+'.cpp',source);
      const comp=cp.spawnSync('g++',['-std=c++20','-O1','-Wall','-Wextra',name+'.cpp','-o',name],{encoding:'utf8',timeout:45000});
      assert.equal(comp.status,0,'C++ compile failed '+lesson.id+' seed '+seed+'\n'+comp.stderr.slice(-2500));
      const run=cp.spawnSync(name,[],{encoding:'utf8',timeout:12000});
      assert.equal(run.status,0,'C++ reference failed '+lesson.id+' seed '+seed+'\n'+run.stdout+'\n'+run.stderr);
      const passed=[...run.stdout.matchAll(/^IX_CASE\|(\d+)\|PASS$/gm)].length;
      assert.equal(passed,expected,'pass-count '+lesson.id);
      total+=passed;
      console.log('PASS',lesson.id,'seed',seed,passed,'cases');
    }
    const bad=path.join(dir,lesson.id+'-buggy');fs.writeFileSync(bad+'.cpp',ixBuildSource(lesson,lesson.starter,1));
    const comp=cp.spawnSync('g++',['-std=c++20','-O1',bad+'.cpp','-o',bad],{encoding:'utf8',timeout:45000});
    assert.equal(comp.status,0,'Buggy starter must compile '+lesson.id+' '+comp.stderr);
    const run=cp.spawnSync(bad,[],{encoding:'utf8',timeout:12000});
    assert.notEqual(run.status,0,'Starter should fail tests '+lesson.id);
  }
  assert.equal(IX_LESSONS.length,6);assert(total>450);
  console.log('TOTAL NATIVE REFERENCE CASES',total,'/ SIX C++20 LABS, 3 SEEDS EACH. BUGGY STARTERS FAIL.');
} finally { fs.rmSync(dir,{recursive:true,force:true}); }
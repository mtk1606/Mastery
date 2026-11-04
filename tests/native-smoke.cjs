const fs=require('node:fs');const cp=require('node:child_process');const path=require('node:path');
const {CPP_LESSONS,cppBuildSource}=require('../cpp-lessons.js');
const dir=path.resolve(__dirname,'.cache');fs.mkdirSync(dir,{recursive:true});let all=0;
for(const c of CPP_LESSONS){const code=cppBuildSource(c,c.reference);const file=path.join(dir,c.id+'.cpp'),bin=path.join(dir,c.id+'.bin');fs.writeFileSync(file,code);
const compiled=cp.spawnSync('g++',['-std=c++20','-O0','-Wall','-Wextra','-pedantic',file,'-o',bin],{encoding:'utf8',timeout:30000});if(compiled.status!==0){console.log(compiled.stderr);throw Error('Compile failed '+c.id)}
const executed=cp.spawnSync(bin,[],{encoding:'utf8',timeout:5000});if(executed.status!==0){console.log(executed.stderr,executed.stdout);throw Error('Failed '+c.id)}
const tests=(executed.stdout.match(/MASTERY_TEST\|\d+\|PASS/g)||[]).length;
if(tests!==c.tests.length)throw Error('Missing cases '+c.id);
console.log('PASS',c.id,tests+'/'+c.tests.length,'native C++20 cases');all+=tests;
const brokenFile=path.join(dir,c.id+'-starter.cpp');fs.writeFileSync(brokenFile,cppBuildSource(c,c.starter));
const bad=cp.spawnSync('g++',['-std=c++20','-O0',brokenFile,'-o',path.join(dir,c.id+'-starter.bin')],{encoding:'utf8',timeout:30000});if(bad.status===0){const wrong=cp.spawnSync(path.join(dir,c.id+'-starter.bin'),[],{encoding:'utf8',timeout:5000});if(wrong.status===0)throw Error('Incomplete starter unexpectedly passed '+c.id);}else console.log('Starter intentionally incomplete for',c.id);
}
console.log('TOTAL:',all,'tests across',CPP_LESSONS.length,'labs');
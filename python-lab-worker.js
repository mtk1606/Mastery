/* Disposable browser Worker: real CPython via Pyodide. Not a security sandbox.
 * The full test bank is inspectable by students. Termination is imposed by the UI. */
'use strict';
const PYODIDE='https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
let runtime=null;
const RUNNER=`import json, math, contextlib, io
p = json.loads(_mastery_payload_json)
scope = {"__name__": "__mastery_student__"}
def equal(actual, expected):
    if isinstance(expected, bool): return type(actual) is bool and actual == expected
    if expected is None: return actual is None
    if isinstance(expected, int) and not isinstance(expected,bool): return type(actual) is int and actual == expected
    if isinstance(expected, float): return isinstance(actual,(float,int)) and not isinstance(actual,bool) and math.isfinite(actual) and math.isclose(actual,expected,rel_tol=1e-7,abs_tol=1e-8)
    if isinstance(expected, str): return isinstance(actual,str) and actual == expected
    if isinstance(expected, list): return isinstance(actual,(tuple,list)) and len(actual)==len(expected) and all(equal(a,b) for a,b in zip(actual,expected))
    if isinstance(expected, dict): return isinstance(actual,dict) and actual.keys()==expected.keys() and all(equal(actual[k],v) for k,v in expected.items())
    return actual == expected
results=[]
error=None
stdout=io.StringIO()
try:
    with contextlib.redirect_stdout(stdout):
        exec(compile(p["code"],"<student>", "exec"),scope)
    f=scope.get(p["fn"])
    if not callable(f): raise TypeError("Define the requested function: " + p["fn"])
    for idx,case in enumerate(p["cases"]):
        try:
            with contextlib.redirect_stdout(stdout):
                result=f(*case["args"])
            correct=equal(result,case["expected"])
            results.append({"case":idx+1,"ok":correct,"actual":repr(result)[:180],"expected":repr(case["expected"])[:180]})
        except BaseException as ex:
            results.append({"case":idx+1,"ok":False,"actual":type(ex).__name__ + ": " + str(ex)[:160],"expected":repr(case["expected"])[:180]})
except BaseException as ex:
    error=type(ex).__name__ + ": " + str(ex)[:400]
json.dumps({"passed":sum(r["ok"] for r in results),"total":len(p["cases"]),"results":results,"error":error,"stdout":stdout.getvalue()[:400]})
`;
self.onmessage=async event=>{
 const m=event.data;
 if(!m||m.type!=='run'||typeof m.code!=='string'||!Array.isArray(m.cases)||m.code.length>60000||m.cases.length>100)return;
 try{
  if(!runtime){
   self.postMessage({type:'loading',nonce:m.nonce});
   importScripts(PYODIDE+'pyodide.js');
   runtime=await loadPyodide({indexURL:PYODIDE});
  }
  self.postMessage({type:'executing',nonce:m.nonce});
  runtime.globals.set('_mastery_payload_json',JSON.stringify({code:m.code,fn:m.fn,cases:m.cases}));
  const result=await runtime.runPythonAsync(RUNNER);
  self.postMessage({...JSON.parse(result),type:'result',nonce:m.nonce});
 }catch(ex){
  self.postMessage({type:'error',nonce:m.nonce,error:String(ex?.message||ex).slice(0,450)});
 }
};

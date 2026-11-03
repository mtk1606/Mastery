/* AXIOM / original GPU WebGL scientific visualizations.
   No external scene assets; genuinely rendered 3D meshes with orbit/zoom. */
'use strict';
const AXIOM_VIS = (() => {
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const palette={blue:[.15,.37,.91],cyan:[.08,.64,.84],coral:[.95,.40,.29],mint:[.08,.65,.48],yellow:[.96,.68,.29],slate:[.42,.53,.62],white:[.90,.93,.94]};
 const defaultScenes={bayes:'bayes','expected-value':'payoff',stopping:'payoff',variance:'distribution',distributions:'distribution',integration:'distribution','sampling-inference':'distribution',correlation:'correlation','linear-algebra':'correlation','matrix-basics':'correlation',regression:'regression',validation:'regression',quoting:'orderbook',orderbook:'orderbook',latency:'orderbook','avellaneda-stoikov':'orderbook',recursive:'paths',markov:'paths','discrete-proofs':'paths',optimization:'surface',calculus:'surface','numerical-methods':'surface',multivariable:'surface'};
 function typeFor(lesson){return defaultScenes[lesson.id]||({blocks:'bayes',bars:'payoff',surface:'surface',distribution:'distribution',correlation:'correlation',regression:'regression',orderbook:'orderbook',paths:'paths',payoff:'payoff',bayes:'bayes'}[lesson.scene]||'orderbook');}
 function spec(kind){return {
  bayes:{label:'THE EVIDENCE WORLD',title:'Every raised block changes the posterior.',caption:'Blue = hypothesis true. Coral = hypothesis false. Raised cubes produced the observed evidence.',controls:[['prior','Prior probability',1,60,14,'%'],['sensitivity','True-positive rate',40,100,82,'%'],['falseRate','False-positive rate',1,50,18,'%']]},
  payoff:{label:'THE DECISION LANDSCAPE',title:'A strategy is worth its average outcome.',caption:'Each column is a first-roll outcome. Blue columns mean keep; coral columns mean take the reroll.',controls:[['threshold','Keep when roll ≥',1,6,4,''],['cost','Reroll cost',0,3,0,'$']]},
  distribution:{label:'THE DISTRIBUTION LAB',title:'Spread the uncertainty, keep the total area.',caption:'The bell changes shape as uncertainty changes. Larger σ means a wider and flatter distribution.',controls:[['sigma','Standard deviation σ',.45,2.8,1,''],['shift','Mean μ',-2,2,0,'']]},
  correlation:{label:'THE JOINT DENSITY',title:'Correlation changes the shape of risk.',caption:'The density mountain twists as correlation changes. Individual marginals stay the same.',controls:[['rho','Correlation ρ',-.9,.9,.45,''],['spread','Scale',.5,1.8,1,'']]},
  regression:{label:'THE REGRESSION PLANE',title:'Separate the signal from the noise.',caption:'Columns show observed data. Adjust β and noise to see why a fitted line is not a complete explanation.',controls:[['beta','Slope β',-.8,1.8,.8,''],['noise','Residual noise',0,2,.65,'']]},
  orderbook:{label:'THE LIMIT ORDER BOOK',title:'Liquidity is a three-dimensional landscape.',caption:'Blue = resting bids; coral = resting asks. Depth, spread and inventory tilt the quoting problem.',controls:[['imbalance','Buy-side depth',.2,2.1,1,'×'],['risk','Risk aversion γ',.03,.5,.12,''],['inventory','Inventory q',-8,8,3,'']]},
  paths:{label:'THE TRANSITION NETWORK',title:'Waiting times live in the states.',caption:'Each column represents a state and each rising level another possible transition. Alter persistence to change the expected wait.',controls:[['persist','Chance to persist',.1,.85,.5,''],['steps','Shown steps',3,10,7,'']]},
  surface:{label:'THE OPTIMIZATION SURFACE',title:'A maximum is a point in a landscape.',caption:'Rotate to inspect curvature. Adjust the penalty to change how sharply the objective falls away from its peak.',controls:[['penalty','Curvature',.3,2.3,1,''],['target','Optimal x',-2,2,.3,'']]}
 }[kind];}
 const state=new WeakMap();
 function addBox(mesh,x,y,z,w,h,d,col){if(h<.015)return;const p=mesh.p,n=mesh.n,c=mesh.c,idx=mesh.i;const base=p.length/3;const x0=x-w/2,x1=x+w/2,y0=y,y1=y+h,z0=z-d/2,z1=z+d/2;
  const faces=[[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[0,0,1]],[[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],[0,0,-1]],[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],[-1,0,0]],[[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[1,0,0]],[[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],[0,1,0]],[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[0,-1,0]]];
  for(let f=0;f<6;f++){const face=faces[f],ii=base+4*f;for(let k=0;k<4;k++){p.push(...face[k]);n.push(...face[4]);c.push(...col);}idx.push(ii,ii+1,ii+2,ii,ii+2,ii+3);}}
 function emptyMesh(){return {p:[],n:[],c:[],i:[]};}
 function createMesh(kind,v={}){const m=emptyMesh();addBox(m,0,-.17,0,10,.09,7.7,[.87,.91,.92]);
  for(let x=-5;x<=5;x+=1){addBox(m,x,-.09,0,.012,.018,7.4,[.79,.84,.87]);}
  for(let z=-3.5;z<=3.5;z+=.7){addBox(m,0,-.08,z,10,.018,.012,[.79,.84,.87]);}
  const f=(x)=>Number(v[x] ?? 0);
  if(kind==='bayes'){
    const prior=f('prior')/100||.14,sens=f('sensitivity')/100||.82,fpr=f('falseRate')/100||.18,total=320,nTrue=Math.round(total*prior),nTP=Math.round(nTrue*sens),nFP=Math.round((total-nTrue)*fpr);
    for(let j=0;j<16;j++)for(let i=0;i<20;i++){const k=j*20+i,t=k<nTrue,positive=t?k<nTP:(k-nTrue)<nFP;
      const hue=t?palette.blue:palette.coral;const h=positive? .91:.21;addBox(m,-4.55+i*.478,0,-3.2+j*.425,.34,h,.3,positive?hue:hue.map(x=>x*.56+.32));}
  }else if(kind==='payoff'){
    const threshold=Math.round(f('threshold')||4),cost=f('cost')||0,rollEV=3.5-cost;
    for(let i=1;i<=6;i++){const keep=i>=threshold;const value=keep?i:rollEV;addBox(m,-3.7+(i-1)*1.48,0,0,1,Math.max(.2,value*.52),1.6,keep?palette.blue:palette.coral);addBox(m,-3.7+(i-1)*1.48,Math.max(.2,value*.52),0,1,.07,1.6,[.95,.97,.98]);}
  }else if(kind==='distribution'){
    const sigma=f('sigma')||1,mu=f('shift')||0;
    for(let i=0;i<40;i++){const x=-4.7+i*.24,z=(x-mu)/sigma,h=4.1*Math.exp(-z*z/2)/sigma;
      addBox(m,x,0,0,.19,Math.max(.035,h),1.45,z<0?palette.cyan:palette.blue);}
  }else if(kind==='correlation'){
    const rho=f('rho')||0,spread=f('spread')||1,denom=2*(1-rho*rho),scale=Math.sqrt(1-rho*rho);
    for(let a=0;a<24;a++)for(let b=0;b<18;b++){let x=-4.5+a*.39,z=-3.1+b*.355,X=x/1.7/spread,Z=z/1.7/spread;
     let exponent=-(X*X-2*rho*X*Z+Z*Z)/denom;let h=2.95*Math.exp(exponent)*scale;let col=h>1.5?palette.blue:palette.cyan;addBox(m,x,0,z,.335,Math.max(.025,h),.305,col);}
  }else if(kind==='regression'){
    const beta=f('beta')||0,noise=f('noise')||0;
    for(let i=0;i<48;i++){let x=-4.5+(i%12)*.78,z=-2.65+Math.floor(i/12)*1.65;let pred=1.3+beta*x*.26+.15*z;let error=Math.sin(i*8.87)*Math.cos(i*1.29)*noise;
      addBox(m,x,0,z,.42,Math.max(.12,pred+error+.7),.42,error>0?palette.coral:palette.blue);}
    for(let i=0;i<12;i++){let x=-4.5+i*.78,pred=2+beta*x*.26;addBox(m,x,0,3.02,.15,Math.max(.1,pred),.14,palette.mint);}
  }else if(kind==='orderbook'){
    const im=f('imbalance')||1,risk=f('risk')||.12,q=f('inventory')||0;
    for(let i=0;i<12;i++){const z=-3.05+i*.56;const wave=.5+.35*Math.abs(Math.sin(i*.81+1.8))+.27*Math.abs(Math.sin(3*i));
      const bh=Math.max(.1,(1.4+2.4*wave)*im*(1-.04*q)),ah=Math.max(.1,(1.35+2.1*wave)*(2.1-im)*(1+.05*q));
      addBox(m,-.54-i*.37,0,z,.32,bh,.37,palette.blue);
      addBox(m,.54+i*.37,0,z,.32,ah,.37,palette.coral);}
    const shade=Math.min(2.5,Math.abs(q)*risk*1.6);addBox(m,q>0?-.07:.07,0,-3.65,.23,.24+shade,.17,palette.yellow);
  }else if(kind==='paths'){
    const steps=Math.round(f('steps')||7),pr=f('persist')||.5;
    for(let i=0;i<steps;i++)for(let j=0;j<5;j++){let x=-4.2+i*1.2,z=-2.3+j*1.05;let h=.27+Math.pow(pr,i)*3.6*(j===Math.min(4,Math.floor(i*.7))?1:.3);
      addBox(m,x,0,z,.45,h,.45,j===Math.floor(i*.7)%5?palette.blue:palette.cyan);}
  }else{
    const penalty=f('penalty')||1,target=f('target')||0;
    for(let i=0;i<25;i++)for(let j=0;j<18;j++){const x=-4.65+i*.385,z=-3.1+j*.36;const dx=(x-target)/3.2,dz=z/2.8;const h=Math.max(.07,3.5-penalty*(dx*dx*3+dz*dz*2.4));
      addBox(m,x,0,z,.30,h,.29,h>2.5?palette.blue:h>1.2?palette.cyan:palette.mint);}
  }
  return m;}
 function perspective(fov,aspect,near,far){let f=1/Math.tan(fov/2),o=1/(near-far);return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*o,-1, 0,0,2*far*near*o,0]);}
 function lookAt(eye,center){let z=norm(sub(eye,center)),x=norm(cross([0,1,0],z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
 const dot=(a,b)=>a.reduce((t,x,i)=>t+x*b[i],0),sub=(a,b)=>a.map((x,i)=>x-b[i]),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{let l=Math.hypot(...a);return a.map(x=>x/l);};
 function mul(a,b){let out=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++)for(let k=0;k<4;k++)out[j*4+i]+=a[k*4+i]*b[j*4+k];return out;}
 const vs='attribute vec3 aPosition; attribute vec3 aNormal; attribute vec3 aColor; uniform mat4 uVP; varying vec3 vColor; varying float vLight; void main(){gl_Position=uVP*vec4(aPosition,1.0);vColor=aColor;vec3 d=normalize(vec3(-0.4,1.0,0.7));vLight=0.64+0.36*max(dot(normalize(aNormal),d),0.0);}';
 const fs='precision mediump float; varying vec3 vColor; varying float vLight; void main(){gl_FragColor=vec4(vColor*vLight,1.0);}';
 function shader(gl,type,code){let s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
 function setup(canvas){const gl=canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:true});if(!gl)return null;let p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));gl.useProgram(p);
  const locs={p:gl.getAttribLocation(p,'aPosition'),n:gl.getAttribLocation(p,'aNormal'),c:gl.getAttribLocation(p,'aColor'),u:gl.getUniformLocation(p,'uVP')};let buffers={p:gl.createBuffer(),n:gl.createBuffer(),c:gl.createBuffer(),i:gl.createBuffer()};gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);return {gl,p,locs,buffers,count:0};}
 function loadMesh(engine,m){const {gl,locs,buffers}=engine;function put(key,arr,loc){gl.bindBuffer(gl.ARRAY_BUFFER,buffers[key]);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(arr),gl.STATIC_DRAW);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(loc);}put('p',m.p,locs.p);put('n',m.n,locs.n);put('c',m.c,locs.c);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffers.i);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(m.i),gl.STATIC_DRAW);engine.count=m.i.length;}
 function fallback(s){
  const canvas=s.canvas,ctx=canvas.getContext('2d');if(!ctx)return;
  const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
  const az=s.az,el=s.el,r=s.radius,eye=[r*Math.sin(az)*Math.cos(el),3+r*Math.sin(el),r*Math.cos(az)*Math.cos(el)];
  const camera=mul(perspective(Math.PI/4,w/h,.1,100),lookAt(eye,[0,1.12,0]));
  const P=s.mesh.p,N=s.mesh.n,C=s.mesh.c,faces=[];
  const project=(i)=>{const x=P[i*3],y=P[i*3+1],z=P[i*3+2],v=[x,y,z,1],q=[0,0,0,0];for(let row=0;row<4;row++)for(let col=0;col<4;col++)q[row]+=camera[col*4+row]*v[col];return {x:(q[0]/q[3]*.5+.5)*w,y:(.5-q[1]/q[3]*.5)*h,z:q[2]/q[3],behind:q[3]<=0};};
  // Back-to-front CPU projection is a robust 3D fallback on browsers that disable WebGL.
  for(let i=0;i<P.length/3;i+=4){const x=(P[i*3]+P[(i+2)*3])/2,y=(P[i*3+1]+P[(i+2)*3+1])/2,z=(P[i*3+2]+P[(i+2)*3+2])/2,n=[N[i*3],N[i*3+1],N[i*3+2]];
   if(n[0]*(eye[0]-x)+n[1]*(eye[1]-y)+n[2]*(eye[2]-z)<=0)continue;
   const points=[project(i),project(i+1),project(i+2),project(i+3)];if(points.some(p=>p.behind||!Number.isFinite(p.x)))continue;
   const distance=(eye[0]-x)**2+(eye[1]-y)**2+(eye[2]-z)**2;
   const shade=.66+.34*Math.max(0,n[0]*-.35+n[1]*.75+n[2]*.55),colors=[C[i*3],C[i*3+1],C[i*3+2]].map(c=>Math.max(0,Math.min(255,Math.round(c*shade*255))));
   faces.push({points,distance,color:`rgb(${colors.join(',')})`});
  }
  faces.sort((a,b)=>b.distance-a.distance);
  for(const f of faces){const a=f.points;ctx.beginPath();ctx.moveTo(a[0].x,a[0].y);ctx.lineTo(a[1].x,a[1].y);ctx.lineTo(a[2].x,a[2].y);ctx.lineTo(a[3].x,a[3].y);ctx.closePath();ctx.fillStyle=f.color;ctx.fill();}
 }
 function draw(s){if(!s.canvas.isConnected)return;const canvas=s.canvas,ratio=Math.min(2,window.devicePixelRatio||1),w=Math.max(200,canvas.clientWidth*ratio|0),h=Math.max(150,canvas.clientHeight*ratio|0);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  if(!s.engine){fallback(s);return;}
  const {gl,locs,count}=s.engine;gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(s.engine.p);
  const r=s.radius,az=s.az,el=s.el,eye=[r*Math.sin(az)*Math.cos(el),3.0+r*Math.sin(el),r*Math.cos(az)*Math.cos(el)],proj=perspective(Math.PI/4,w/h,.1,100),view=lookAt(eye,[0,1.12,0]);gl.uniformMatrix4fv(locs.u,false,mul(proj,view));
  // Rebind pointers because the last updated engine may have changed WebGL state.
  for(let key of ['p','n','c']){gl.bindBuffer(gl.ARRAY_BUFFER,s.engine.buffers[key]);let loc=locs[key];gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(loc);}gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,s.engine.buffers.i);
  gl.drawElements(gl.TRIANGLES,count,gl.UNSIGNED_SHORT,0);
 }
 function mount(canvas,kind,values={},auto=false){if(!canvas)return null;let engine=null;try{engine=setup(canvas);}catch(e){console.warn('WebGL fallback:',e);}
  const s={canvas,kind,values:{...values},engine,az:-.73,el:.46,radius:kind==='orderbook'?13.9:12.2,drag:false,lastX:0,lastY:0,auto,tick:0,disposed:false};state.set(canvas,s);
  s.mesh=createMesh(kind,s.values);if(engine){if(s.mesh.p.length/3>65530)console.warn('WebGL mesh exceeds 16-bit index limit');loadMesh(engine,s.mesh);}draw(s);
  canvas.style.cursor='grab';canvas.setAttribute('tabindex','0');canvas.setAttribute('aria-label',`Interactive three-dimensional ${kind} visualization. Drag to rotate and scroll to zoom.`);
  canvas.addEventListener('pointerdown',e=>{s.drag=true;s.auto=false;s.lastX=e.clientX;s.lastY=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';});
  canvas.addEventListener('pointermove',e=>{if(!s.drag)return;s.az+=(e.clientX-s.lastX)*.011;s.el=clamp(s.el+(e.clientY-s.lastY)*.009,-.1,1.3);s.lastX=e.clientX;s.lastY=e.clientY;draw(s);});
  canvas.addEventListener('pointerup',()=>{s.drag=false;canvas.style.cursor='grab';});
  canvas.addEventListener('wheel',e=>{e.preventDefault();s.radius=clamp(s.radius*(e.deltaY>0?1.08:.92),10,32);draw(s);},{passive:false});
  canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();s.az+=(e.key==='ArrowLeft'?.15:e.key==='ArrowRight'?-.15:0);s.el=clamp(s.el+(e.key==='ArrowUp'?.1:e.key==='ArrowDown'?-.1:0),-.1,1.3);draw(s);}});
  if(auto){const loop=()=>{if(!canvas.isConnected){s.disposed=true;return;}if(s.auto&&((s.tick++)%4===0)){s.az+=.0064;draw(s);}requestAnimationFrame(loop);};requestAnimationFrame(loop);}
  return s;
 }
 function update(canvas,values){const s=state.get(canvas);if(!s)return;Object.assign(s.values,values);s.mesh=createMesh(s.kind,s.values);if(s.engine)loadMesh(s.engine,s.mesh);draw(s);}
 function describe(kind,v){const f=k=>Number(v[k]??0);let tiles=[];
  if(kind==='bayes'){let prior=f('prior')/100,sen=f('sensitivity')/100,fp=f('falseRate')/100,pos=prior*sen,wrong=(1-prior)*fp,post=pos/(pos+wrong);tiles=[['Posterior',(100*post).toFixed(1)+'%'],['True positives',(1000*pos).toFixed(0)+'/1000'],['False positives',(1000*wrong).toFixed(0)+'/1000']];}
  if(kind==='payoff'){let th=Math.round(f('threshold')),ev=3.5-f('cost'),value=Array.from({length:6},(_,i)=>i+1).reduce((t,n)=>t+(n>=th?n:ev),0)/6;tiles=[['Expected payoff','$'+value.toFixed(3)],['Forced reroll EV','$'+ev.toFixed(2)],['Optimal threshold',String(Math.ceil(ev))]];}
  if(kind==='distribution'){tiles=[['Mean',f('shift').toFixed(2)],['Standard deviation',f('sigma').toFixed(2)],['Variance',(f('sigma')**2).toFixed(2)]];}
  if(kind==='correlation'){let r=f('rho');tiles=[['Correlation ρ',r.toFixed(2)],['Variance each','1.00'],['Covariance',r.toFixed(2)]];}
  if(kind==='regression'){tiles=[['Slope β',f('beta').toFixed(2)],['Noise scale',f('noise').toFixed(2)],['Model','y = α + βx + ε']];}
  if(kind==='orderbook'){let q=f('inventory'),g=f('risk'),sigma=2,k=1.5,S=100,tau=1;let r=S-q*g*sigma*sigma*tau,spread=g*sigma*sigma*tau+2/g*Math.log(1+g/k);tiles=[['Reservation price','$'+r.toFixed(3)],['Approx. bid','$'+(r-spread/2).toFixed(3)],['Approx. ask','$'+(r+spread/2).toFixed(3)]];}
  if(kind==='paths'){tiles=[['Persistence',Math.round(f('persist')*100)+'%'],['Expected wait',(1/(1-f('persist'))).toFixed(2)+' steps'],['Displayed steps',String(Math.round(f('steps')))] ];}
  if(kind==='surface'){tiles=[['Objective optimum x',f('target').toFixed(2)],['Curvature',f('penalty').toFixed(2)],['At the peak','gradient = 0']];}
  return tiles;
 }
 return {mount,update,typeFor,spec,describe};
})();

import"./modulepreload-polyfill-3cfb730f.js";import{t as S,T as X,G as f,a,v as Y,q as u,F as k,C as Z,s as B,R as r,r as _,w as tt,A as et,D as ot,g as I,S as st,x as at,P as nt,W as it,y as rt}from"./three.module-13a89988.js";import{O as dt}from"./OrbitControls-63ae8fc2.js";import{G as ct}from"./lil-gui.esm-1e0f7d72.js";const ht="#ff7d46",l=new S(ht,1,7);l.position.set(0,2.2,2.7);l.castShadow=!0;l.shadow.mapSize.width=256;l.shadow.mapSize.height=256;l.shadow.camera.far=7;const t=new X,pt=t.load("/textures/door/color.jpg"),wt=t.load("/textures/door/alpha.jpg"),gt=t.load("/textures/door/ambientOcclusion.jpg"),ut=t.load("/textures/door/height.jpg"),lt=t.load("/textures/door/metalness.jpg"),mt=t.load("/textures/door/normal.jpg"),xt=t.load("/textures/door/roughness.jpg"),Mt=t.load("/textures/bricks/color.jpg"),bt=t.load("/textures/bricks/ambientOcclusion.jpg.jpg"),yt=t.load("/textures/bricks/normal.jpg"),St=t.load("/textures/bricks/roughness.jpg"),b=new f,x=new a(new Y(4,2.5,4),new u({map:Mt,aoMap:bt,normalMap:yt,roughnessMap:St}));x.geometry.setAttribute("uv2",new k(x.geometry.attributes.uv.array,2));x.castShadow=!0;x.position.y=2.5/2;b.add(x);const A=new a(new Z(3.5,1,4),new u({color:"#b35f45"}));A.rotation.y=Math.PI*.25;A.position.y=2.5+.5;b.add(A);const M=new a(new B(2,2,100,100),new u({map:pt,transparent:!0,alphaMap:wt,aoMap:gt,displacementMap:ut,displacementScale:.1,normalMap:mt,metalnessMap:lt,roughnessMap:xt}));M.geometry.setAttribute("uv2",new k(M.geometry.attributes.uv.array,2));M.position.z=2.01;M.position.y=2/2;b.add(M);b.add(l);const T=t.load("/textures/grass/color.jpg"),z=t.load("/textures/grass/ambientOcclusion.jpg.jpg"),v=t.load("/textures/grass/normal.jpg"),j=t.load("/textures/grass/roughness.jpg");T.repeat.set(8,8);z.repeat.set(8,8);v.repeat.set(8,8);j.repeat.set(8,8);T.wrapS=r;T.wrapT=r;z.wrapS=r;z.wrapT=r;v.wrapS=r;v.wrapT=r;j.wrapS=r;j.wrapT=r;const g=new a(new B(20,20),new u({map:T,aoMap:z,normalMap:v,roughnessMap:j}));g.geometry.setAttribute("uv2",new k(g.geometry.attributes.uv.array,2));g.rotation.x=-Math.PI*.5;g.position.y=0;g.receiveShadow=!0;const D=new f,L=new _(1,16,16),C=new u({color:"#89c854"}),P=new a(L,C),G=new a(L,C),R=new a(L,C),O=new a(L,C);P.scale.set(.5,.5,.5);P.position.set(.8,.2,2.2);G.scale.set(.25,.25,.25);G.position.set(1.4,.1,2.1);R.scale.set(.4,.4,.4);R.position.set(-.8,.1,2.2);O.scale.set(.15,.15,.15);O.position.set(-1,.05,2.6);D.add(P,G,R,O);const E=new f,ft=new tt(.6,.8,.2),Tt=new u({color:"#b2b6b1"});for(let e=0;e<50;e++){const s=Math.random()*2*Math.PI,q=3+Math.random()*6,Q=Math.sin(s)*q,V=Math.cos(s)*q,m=new a(ft,Tt);m.position.set(Q,.3,V),m.rotation.y=(Math.random()-.5)*.4,m.rotation.z=(Math.random()-.5)*.4,m.castShadow=!0,E.add(m)}const zt="#b9d5ff",H=new et(zt,.2),vt="#b9d5ff",p=new ot(vt,.2);p.position.set(4,5,-2);p.castShadow=!0;const F=new f,W="#9ab170",d=new S(W,3,3),c=new S(W,1,3),h=new S(W,2,3);d.shadow.mapSize.width=256;d.shadow.mapSize.height=256;d.shadow.camera.far=7;c.shadow.mapSize.width=256;c.shadow.mapSize.height=256;c.shadow.camera.far=7;h.shadow.mapSize.width=256;h.shadow.mapSize.height=256;h.shadow.camera.far=7;F.add(d,c,h);const jt=new I,N=()=>{const e=jt.getElapsedTime(),s=e*.5;d.position.x=Math.cos(s)*4,d.position.z=Math.sin(s)*4,d.position.z=Math.sin(e*3),c.position.x=Math.cos(s)*4,c.position.z=Math.sin(s)*4,c.position.z=Math.sin(e*3)+Math.sin(e*2.5),h.position.x=Math.cos(s)*(7+Math.sin(e*.32)),h.position.z=Math.sin(s)*(7+Math.sin(e*.5)),h.position.z=Math.sin(e*5)+Math.sin(e*2),window.requestAnimationFrame(N)};N();F.castShadow=!0;const y=new ct,$=document.querySelector("canvas.webgl"),w=new st;w.add(g,b,D,E);y.add(H,"intensity").min(0).max(1).step(.001);w.add(H);y.add(p,"intensity").min(0).max(1).step(.001);y.add(p.position,"x").min(-5).max(5).step(.001);y.add(p.position,"y").min(-5).max(5).step(.001);y.add(p.position,"z").min(-5).max(5).step(.001);w.add(p);w.add(F);const U="#262837";w.fog=new at(U,1,15);const o={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",()=>{o.width=window.innerWidth,o.height=window.innerHeight,n.aspect=o.width/o.height,n.updateProjectionMatrix(),i.setSize(o.width,o.height),i.setPixelRatio(Math.min(window.devicePixelRatio,2))});const n=new nt(75,o.width/o.height,.1,100);n.position.x=4;n.position.y=2;n.position.z=5;w.add(n);const J=new dt(n,$);J.enableDamping=!0;const i=new it({canvas:$});i.setSize(o.width,o.height);i.setPixelRatio(Math.min(window.devicePixelRatio,2));i.setClearColor(U);i.shadowMap.enabled=!0;i.shadowMap.type=rt;const Lt=new I,K=()=>{Lt.getElapsedTime(),J.update(),i.render(w,n),window.requestAnimationFrame(K)};K();

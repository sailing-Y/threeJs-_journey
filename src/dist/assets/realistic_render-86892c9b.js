import"./modulepreload-polyfill-3cfb730f.js";import{S as l,h as u,a4 as p,D as v,a9 as x,P as y,W as L,a6 as c,y as S,aa as f,ab as b,ac as C,ad as P,a as z,q as T}from"./three.module-13a89988.js";import{O as j}from"./OrbitControls-63ae8fc2.js";import{G as E}from"./lil-gui.esm-1e0f7d72.js";import{G as F}from"./GLTFLoader-c57b3ea4.js";const i=new E,r={};r.envMapIntensity=5;const h=document.querySelector("canvas.webgl"),o=new l,I=new u,d=I.load(["/textures/environmentMaps/2/px.jpg","/textures/environmentMaps/2/nx.jpg","/textures/environmentMaps/2/py.jpg","/textures/environmentMaps/2/ny.jpg","/textures/environmentMaps/2/pz.jpg","/textures/environmentMaps/2/nz.jpg"]);d.encoding=p;o.background=d;o.environment=d;const m=()=>{o.traverse(n=>{n instanceof z&&n.material instanceof T&&(n.material.envMapIntensity=r.envMapIntensity,n.castShadow=!0,n.receiveShadow=!0)})};i.add(r,"envMapIntensity",0,10,.001).name("模型的envMap强度").onChange(m);const R=new F;R.load("/models/FlightHelmet/glTF/FlightHelmet.gltf",n=>{n.scene.scale.set(10,10,10),n.scene.position.set(0,-4,0),n.scene.rotation.y=Math.PI*.5,o.add(n.scene),m(),i.add(n.scene.rotation,"y",-Math.PI,Math.PI,.001).name("模型的y轴旋转")});const a=new v("#ffffff",3);a.position.set(.25,3,-2.25);a.shadow.camera.far=10;a.castShadow=!0;a.shadow.mapSize.set(1024,1024);a.shadow.normalBias=.05;o.add(a);const w=new x(a.shadow.camera);o.add(w);i.add(w,"visible").name("LightHelper显隐");i.add(a,"intensity",0,10,.001).name("方向光的强度");i.add(a.position,"x",-5,5,.001).name("方向光的x轴");i.add(a.position,"y",-5,5,.001).name("方向光的y轴");i.add(a.position,"z",-5,5,.001).name("方向光的z轴");const t={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",()=>{t.width=window.innerWidth,t.height=window.innerHeight,s.aspect=t.width/t.height,s.updateProjectionMatrix(),e.setSize(t.width,t.height),e.setPixelRatio(Math.min(window.devicePixelRatio,2))});const s=new y(75,t.width/t.height,.1,100);s.position.set(4,1,-4);o.add(s);const g=new j(s,h);g.enableDamping=!0;const e=new L({canvas:h,antialias:!0});e.setSize(t.width,t.height);e.setPixelRatio(Math.min(window.devicePixelRatio,2));e.physicallyCorrectLights=!0;e.outputEncoding=p;e.toneMapping=c;e.toneMappingExposure=3;e.shadowMap.enabled=!0;e.shadowMap.type=S;i.add(e,"toneMapping",{NO:f,线性色调映射Linear:b,Reinhard:c,Cineon:C,ACESFilmic:P}).name("色调映射");i.add(e,"toneMappingExposure",0,10,.001).name("色调映射曝光toneMappingExposure");const M=()=>{g.update(),e.render(o,s),window.requestAnimationFrame(M)};M();

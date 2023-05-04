import"./modulepreload-polyfill-3cfb730f.js";import{S as h,T as g,s as x,d as p,ae as y,V as C,p as M,j as P,a as T,P as b,W as R,g as S}from"./three.module-13a89988.js";import{O as F}from"./OrbitControls-63ae8fc2.js";import{G as q}from"./lil-gui.esm-1e0f7d72.js";var D=`precision mediump float;\r
uniform mat4 projectionMatrix;\r
uniform mat4 viewMatrix;\r
uniform mat4 modelMatrix;

uniform vec2 uFrequenceVec2;\r
uniform float uTime;\r
attribute vec3 position;\r
attribute float aRandom;

attribute vec2 uv;\r
varying vec2 vUv;\r
varying float vRandom;\r
varying float vElevation;\r
void main()\r
{\r
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    
    

    
    float elevation = sin(modelPosition.x * uFrequenceVec2.x - uTime)*0.1;\r
    elevation += sin(modelPosition.y * uFrequenceVec2.y - uTime)*0.1;\r
    modelPosition.z += elevation;

    
    
    

    vec4 viewMatrix = viewMatrix * modelPosition;\r
    gl_Position=projectionMatrix*viewMatrix;

    vRandom = aRandom;\r
    vUv = uv;\r
    vElevation = elevation;\r
}`,V=`precision mediump float;

varying float vRandom;\r
varying vec2 vUv;\r
varying float vElevation;

uniform vec3 uColor;\r
uniform sampler2D uTexture;\r
uniform float uColorDepth;\r
void main(){\r
    vec4 textureColor = texture2D(uTexture,vUv);    

    
    
    textureColor.xyz *= vElevation*2.0 + uColorDepth;\r
    gl_FragColor = textureColor;\r
    \r
}`;const a=new q,l=document.querySelector("canvas.webgl"),s=new h,u=new g,d=u.load("/textures/flag/flag-french.jpg"),_=u.load("/textures/flag/flag-china.webp"),j=u.load("/textures/flag/us-flag.jpg"),i=new x(1,1,32,32);console.log(i);const c=i.attributes.position.count,m=new Float32Array(c);for(let o=0;o<c;o++)m[o]=Math.random();i.setAttribute("aRandom",new p(m,1));const n=new y({vertexShader:D,fragmentShader:V,uniforms:{uFrequenceVec2:{value:new C(10,5)},uTime:{value:0},uColor:{value:new M("orange")},uTexture:{value:d},uColorDepth:{value:.5}},side:P});a.add(n.uniforms.uFrequenceVec2.value,"x",0,20,.01).name("x轴sin的程度效果");a.add(n.uniforms.uFrequenceVec2.value,"y",0,20,.01).name("y轴sin的程度效果");a.addColor(n.uniforms.uColor,"value").name("颜色");a.add(n.uniforms.uColorDepth,"value",0,1,.01).name("贴图颜色深度");a.add(n.uniforms.uTexture,"value",{法国:d,中国:_,美国:j}).name("贴图");const v=new T(i,n);v.scale.y=2/3;s.add(v);const e={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",()=>{e.width=window.innerWidth,e.height=window.innerHeight,t.aspect=e.width/e.height,t.updateProjectionMatrix(),r.setSize(e.width,e.height),r.setPixelRatio(Math.min(window.devicePixelRatio,2))});const t=new b(75,e.width/e.height,.1,100);t.position.set(.25,-.25,1);s.add(t);const f=new F(t,l);f.enableDamping=!0;const r=new R({canvas:l});r.setSize(e.width,e.height);r.setPixelRatio(Math.min(window.devicePixelRatio,2));const z=new S,w=()=>{const o=z.getElapsedTime();n.uniforms.uTime.value=o,f.update(),r.render(s,t),window.requestAnimationFrame(w)};w();

import"./modulepreload-polyfill-3cfb730f.js";import{S as R,P as _,W as G,B as W,p as x,d as w,K as j,z as B,f as O,g as k}from"./three.module-13a89988.js";import{O as q}from"./OrbitControls-63ae8fc2.js";import{G as E}from"./lil-gui.esm-1e0f7d72.js";import{S as H}from"./stats.min-e9b58a7b.js";var I=`uniform float uSize;\r
uniform float uTime;

attribute float aScale;              
attribute vec3 aRandomness;         

varying vec3 vColor;\r
void main() {\r
    
    vec4 modelPosition = modelMatrix * vec4(position ,1. );

    float angle = atan(modelPosition.x, modelPosition.z);\r
    float distanceToCenter = length(modelPosition.xz);\r
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;     
    angle += angleOffset;\r
    modelPosition.x = cos(angle) * distanceToCenter;\r
    modelPosition.z = sin(angle) * distanceToCenter;

    modelPosition.xyz += aRandomness;\r
    
    
    

    
    vec4 viewPosition = viewMatrix * modelPosition;\r
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;\r
    gl_PointSize = uSize * aScale;

    
    
    gl_PointSize *= (1.0 / - viewPosition.z);       \r
    vColor = color;\r
}`,L=`varying vec3 vColor;\r

void main(){

    
    
    
    
    

    
    
    
    

    
    float strength = distance(gl_PointCoord, vec2(0.5));\r
    strength = 1.0 - strength;\r
    strength = pow(strength, 5.0);

    vec3 mixColor = mix(vec3(0.0), vColor, strength);\r
    gl_FragColor = vec4(mixColor, 1.);\r
}`,v=new H;v.showPanel(0);document.body.appendChild(v.dom);const a=new E,S=document.querySelector("canvas.webgl"),C=new R,n={};n.count=2e5;n.size=.005;n.radius=5;n.branches=3;n.spin=1;n.randomness=.5;n.randomnessPower=3;n.insideColor="#ff6030";n.outsideColor="#1b3984";n.uSize=2;let s=null,p=null,g=null;const t=()=>{g!==null&&(s.dispose(),p.dispose(),C.remove(g)),s=new W;const r=new Float32Array(n.count*3),c=new Float32Array(n.count*3),f=new Float32Array(n.count*1),h=new Float32Array(n.count*3),z=new x(n.insideColor),y=new x(n.outsideColor);for(let m=0;m<n.count;m++){const o=m*3,d=Math.random()*n.radius,P=m%n.branches/n.branches*Math.PI*2;r[o+0]=Math.cos(P)*d,r[o+1]=0,r[o+2]=Math.sin(P)*d;const F=Math.pow(Math.random(),n.randomnessPower)*(Math.random()<.5?1:-1)*n.randomness*d,A=Math.pow(Math.random(),n.randomnessPower)*(Math.random()<.5?1:-1)*n.randomness*d,T=Math.pow(Math.random(),n.randomnessPower)*(Math.random()<.5?1:-1)*n.randomness*d;h[o+0]=F,h[o+1]=A,h[o+2]=T;const u=z.clone();u.lerp(y,d/n.radius),c[o]=u.r,c[o+1]=u.g,c[o+2]=u.b,f[m]=Math.random()}s.setAttribute("position",new w(r,3)),s.setAttribute("color",new w(c,3)),s.setAttribute("aScale",new w(f,1)),s.setAttribute("aRandomness",new w(h,3)),p=new j({depthWrite:!1,blending:B,vertexColors:!0,vertexShader:I,fragmentShader:L,uniforms:{uTime:{value:0},uSize:{value:n.uSize*l.getPixelRatio()}}}),g=new O(s,p),C.add(g)};a.add(n,"uSize").min(11).max(30).step(.001).onFinishChange(t);a.add(n,"count").min(100).max(1e6).step(100).onFinishChange(t);a.add(n,"radius").min(.01).max(20).step(.01).onFinishChange(t);a.add(n,"branches").min(2).max(20).step(1).onFinishChange(t);a.add(n,"randomness").min(0).max(2).step(.001).onFinishChange(t);a.add(n,"randomnessPower").min(1).max(10).step(.001).onFinishChange(t);a.addColor(n,"insideColor").onFinishChange(t);a.addColor(n,"outsideColor").onFinishChange(t);const e={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",()=>{e.width=window.innerWidth,e.height=window.innerHeight,i.aspect=e.width/e.height,i.updateProjectionMatrix(),l.setSize(e.width,e.height),l.setPixelRatio(Math.min(window.devicePixelRatio,2))});const i=new _(75,e.width/e.height,.1,100);i.position.x=3;i.position.y=3;i.position.z=3;C.add(i);const b=new q(i,S);b.enableDamping=!0;const l=new G({canvas:S});l.setSize(e.width,e.height);l.setPixelRatio(Math.min(window.devicePixelRatio,2));t();const D=new k,M=()=>{v.begin();const r=D.getElapsedTime();p.uniforms.uTime.value=r,b.update(),l.render(C,i),window.requestAnimationFrame(M),v.end()};M();

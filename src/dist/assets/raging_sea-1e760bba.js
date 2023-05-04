import"./modulepreload-polyfill-3cfb730f.js";import{S as z,s as P,K as w,j as s,V as p,p as d,ah as S,ai as h,a as W,P as C,W as F,g as _}from"./three.module-13a89988.js";import{O as b}from"./OrbitControls-63ae8fc2.js";import{G as q}from"./lil-gui.esm-1e0f7d72.js";import{S as E}from"./stats.min-e9b58a7b.js";var M=`uniform float uTime;
uniform float uWaveSpeed;           
uniform float uWaveElevation;       
uniform vec2 uWaveFrequency;        

uniform float uSmallWaveElevation;       
uniform float uSmallWaveFrequency;       
uniform float uSmallWaveSpeed;           
uniform float uSmallWaveIterations;      

varying float vElevation;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); 
  vec3 Pi1 = Pi0 + vec3(1.0); 
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); 
  vec3 Pf1 = Pf0 - vec3(1.0); 
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

void main() {
    
    vec4 modelPosition = modelMatrix * vec4(position ,1. );

    float elevation =   sin(modelPosition.x * uWaveFrequency.x + uTime * uWaveSpeed) *
                        sin(modelPosition.z * uWaveFrequency.y + uTime * uWaveSpeed) *
                        uWaveElevation;

    
    
    
    

    
    
    

    for(float i = 1.0; i <= uSmallWaveIterations ; i++){
        elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWaveFrequency *i, uTime * uSmallWaveSpeed)) * uSmallWaveElevation /i);
    }

    modelPosition.y += elevation;

    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    vElevation = elevation;
}`,I=`uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;         
uniform float uColorMultiplier;     

varying float vElevation; 
void main(){

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor , uSurfaceColor , mixStrength);

    
    gl_FragColor = vec4(color, 1.);
}`,r=new E;r.showPanel(0);document.body.appendChild(r.dom);const i=new q({width:340}),o={depthColor:"#070f46",surfaceColor:"#88e9ff"},l=i.addFolder("波形控制"),v=i.addFolder("噪声波控制"),u=i.addFolder("颜色控制"),m=document.querySelector("canvas.webgl"),c=new z,T=new P(2,2,512,512),e=new w({vertexShader:M,fragmentShader:I,wireframe:!1,side:s,uniforms:{uTime:{value:0},uWaveSpeed:{value:.75},uWaveElevation:{value:.2},uWaveFrequency:{value:new p(4,1.5)},uSmallWaveElevation:{value:.15},uSmallWaveFrequency:{value:3},uSmallWaveSpeed:{value:.2},uSmallWaveIterations:{value:4},uDepthColor:{value:new d(o.depthColor)},uSurfaceColor:{value:new d(o.surfaceColor)},uColorOffset:{value:.168},uColorMultiplier:{value:2.834}}});i.add(e,"wireframe").name("线框开关");i.add(e,"side",{正面:S,背面:h,双面:s}).name("渲染面");l.add(e.uniforms.uWaveElevation,"value",0,1,.001).name("海拔");l.add(e.uniforms.uWaveFrequency.value,"x",0,10,.001).name("x上的频率(波的x)");l.add(e.uniforms.uWaveFrequency.value,"y",0,10,.001).name("y上的频率(波的z)");l.add(e.uniforms.uWaveSpeed,"value",0,10,.001).name("波的速度");v.add(e.uniforms.uSmallWaveElevation,"value",0,1,.001).name("噪点波——海拔");v.add(e.uniforms.uSmallWaveFrequency,"value",0,30,.001).name("噪点波——频率");v.add(e.uniforms.uSmallWaveSpeed,"value",0,5,.001).name("噪点波——速度");v.add(e.uniforms.uSmallWaveIterations,"value",2,10,1).name("噪点波——迭代添加次数");u.addColor(o,"depthColor").onChange(()=>{e.uniforms.uDepthColor.value.set(o.depthColor)}).name("深处颜色");u.addColor(o,"surfaceColor").name("表面颜色").onChange(()=>{e.uniforms.uSurfaceColor.value.set(o.surfaceColor)});u.add(e.uniforms.uColorOffset,"value",0,1,.001).name("颜色偏移量");u.add(e.uniforms.uColorMultiplier,"value",0,10,.001).name("颜色混合比");const f=new W(T,e);f.rotation.x=-Math.PI*.5;c.add(f);const n={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",()=>{n.width=window.innerWidth,n.height=window.innerHeight,a.aspect=n.width/n.height,a.updateProjectionMatrix(),t.setSize(n.width,n.height),t.setPixelRatio(Math.min(window.devicePixelRatio,2))});const a=new C(75,n.width/n.height,.1,100);a.position.set(1,1,1);c.add(a);const g=new b(a,m);g.enableDamping=!0;const t=new F({canvas:m});t.setSize(n.width,n.height);t.setPixelRatio(Math.min(window.devicePixelRatio,2));const O=new _,x=()=>{r.begin();const y=O.getElapsedTime();e.uniforms.uTime.value=y,g.update(),t.render(c,a),window.requestAnimationFrame(x),r.end()};x();

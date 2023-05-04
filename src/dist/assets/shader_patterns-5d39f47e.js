import"./modulepreload-polyfill-3cfb730f.js";import{S as U,s as p,T as m,l as y,P as w,W as u,a as r,K as b,j as P}from"./three.module-13a89988.js";import{O as z}from"./OrbitControls-63ae8fc2.js";import{F as X,T as Y}from"./TextGeometry-441eb212.js";import{G as _}from"./lil-gui.esm-1e0f7d72.js";var S=`varying vec2 vUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
}`,C=`const float PI = 3.14159265359;
varying vec2 vUv;
uniform float tip;
uniform float colorVersion;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233 ))) * 43758.5453132);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); 
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; 
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main(){
    
    float strength = 1.0;
    if(tip == 3.0){strength = vUv.x;}
    else if(tip == 4.0){strength = vUv.y;}
    else if(tip == 5.0){strength = 1.0 - vUv.y;}
    else if(tip == 6.0){strength = vUv.y * 10.0;}
    else if(tip == 7.0){strength = mod(vUv.y *10.0, 1.0);}
    else if(tip == 8.0){strength = mod(vUv.y *10.0, 1.0); strength = step(0.5, strength);}
    else if(tip == 9.0){strength = mod(vUv.y *10.0, 1.0); strength = step(0.8, strength);}
    else if(tip == 10.0){strength = mod(vUv.x *10.0, 1.0); strength = step(0.8, strength);}
    else if(tip == 11.0){strength = step(0.8, mod(vUv.x *10.0, 1.0)); strength += step(0.8, mod(vUv.y *10.0, 1.0));}
    else if(tip == 12.0){strength = step(0.8, mod(vUv.x *10.0, 1.0)); strength *= step(0.8, mod(vUv.y *10.0, 1.0));}
    else if(tip == 13.0){strength = step(0.4, mod(vUv.x *10.0, 1.0)); strength *= step(0.8, mod(vUv.y *10.0, 1.0));}
    else if(tip == 14.0){
        float barX = step(0.4, mod(vUv.x *10.0, 1.0));
        barX *= step(0.8, mod(vUv.y *10.0, 1.0));
        float barY = step(0.8, mod(vUv.x *10.0, 1.0));
        barY *= step(0.4, mod(vUv.y *10.0, 1.0));
        strength = barX + barY;
    }
    else if(tip == 15.0){
        float barX = step(0.4, mod(vUv.x *10.0, 1.0));
        barX *= step(0.8, mod(vUv.y *10.0 + 0.2, 1.0));
        float barY = step(0.8, mod(vUv.x *10.0 + 0.2, 1.0));
        barY *= step(0.4, mod(vUv.y *10.0, 1.0));
        strength = barX + barY;
    }
    else if(tip == 16.0){
        strength = abs(vUv.x - 0.5);
    }
    else if(tip == 17.0){strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));}
    else if(tip == 18.0){strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));}
    else if(tip == 19.0){strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));}
    else if(tip == 20.0){
        float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
        float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
        strength = square1 * square2;
    }
    else if(tip == 21.0){strength = floor(vUv.x * 10.0) / 10.0; }
    else if(tip == 22.0){strength = floor(vUv.x * 10.0) / 10.0; strength *= floor(vUv.y * 10.0) / 10.0;}
    else if(tip == 23.0){strength = random(vUv);}
    else if(tip == 24.0){
        vec2 gridUv = vec2(
            floor(vUv.x * 10.0) / 10.0,
            floor(vUv.y * 10.0) / 10.0
        );
        strength = random(gridUv);
    }
    else if(tip == 25.0){
        vec2 gridUv = vec2(
            floor(vUv.x * 10.0) / 10.0,
            floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0
        );
        strength = random(gridUv);
    }
    else if(tip == 26.0){strength = length(vUv);}
    else if(tip == 27.0){strength = distance(vUv,vec2(0.5));}
    else if(tip == 28.0){strength = 1.0 - distance(vUv,vec2(0.5));}
    else if(tip == 29.0){strength = 0.015 / distance(vUv,vec2(0.5));}
    else if(tip == 30.0){
        vec2 hightUv = vec2(vUv.x * 0.1 + 0.45,vUv.y * 0.5 + 0.25);
        strength = 0.015 / distance(hightUv,vec2(0.5));
    }
    else if(tip == 31.0){
        vec2 hightUvX = vec2(vUv.x * 0.1 + 0.45,vUv.y * 0.5 + 0.25);
        float lightX = 0.015 / distance(hightUvX, vec2(0.5));
        vec2 hightUvY = vec2(vUv.y * 0.1 + 0.45,vUv.x * 0.5 + 0.25);
        float lightY = 0.015 / distance(hightUvY, vec2(0.5));

        strength = lightX * lightY;
    }
    else if(tip == 32.0){
        vec2 rotatedUv = rotate(vUv, PI* 0.25, vec2(0.5));
        vec2 hightUvX = vec2(rotatedUv.x * 0.1 + 0.45,rotatedUv.y * 0.5 + 0.25);
        float lightX = 0.015 / distance(hightUvX, vec2(0.5));
        vec2 hightUvY = vec2(rotatedUv.y * 0.1 + 0.45,rotatedUv.x * 0.5 + 0.25);
        float lightY = 0.015 / distance(hightUvY, vec2(0.5));

        strength = lightX * lightY;
    }
    else if(tip == 33.0){
        strength = step(0.25, distance(vUv, vec2(0.5)));
    }
    else if(tip == 34.0){
        strength = abs(distance(vUv, vec2(0.5)) - 0.25);
    }
    else if(tip == 35.0){
        strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
    }
    else if(tip == 36.0){
        strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
    }
    else if(tip == 37.0){
        vec2 waveUv = vec2(
            vUv.x, 
            vUv.y + sin(vUv.x * 30.0) * 0.1 
        );
        strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
    }
    else if(tip == 38.0){
        vec2 waveUv = vec2(
            vUv.x + sin(vUv.y * 30.0) * 0.1 , 
            vUv.y + sin(vUv.x * 30.0) * 0.1 
        );
        strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
    }
    else if(tip == 39.0){
        vec2 waveUv = vec2(
            vUv.x + sin(vUv.y * 100.0) * 0.1 , 
            vUv.y + sin(vUv.x * 100.0) * 0.1 
        );
        strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
    }
    else if(tip == 40.0){
        float angle = atan(vUv.x, vUv.y);
        strength = angle;
    }
    else if(tip == 41.0){
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
        strength = angle;
    }
    else if(tip == 42.0){
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
        angle /= PI * 2.0;
        angle += 0.5;
        strength = angle;
    }
    else if(tip == 43.0){
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
        angle /= PI * 2.0;
        angle += 0.5;
        angle *= 20.0;
        angle = mod(angle, 1.0);
        strength = angle;
    }
    else if(tip == 44.0){
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
        angle /= PI * 2.0;
        angle += 0.5;
        strength = sin(angle * 100.0);
    }
    else if(tip == 45.0){
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
        angle /= PI * 2.0;
        angle += 0.5;
        float sinusoid = sin(angle * 100.0);

        float radius = 0.25 + sinusoid * 0.02;
        strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25) - radius);
    }
    else if(tip == 46.0){
        strength = cnoise(vUv * 10.0);
    }   
    else if(tip == 47.0){
        strength = step(0.0, cnoise(vUv * 10.0)); 
    }
    else if(tip == 48.0){
        strength = 1.0 - abs(cnoise(vUv * 10.0));
    }
    else if(tip == 49.0){
        strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0)); 
    }

    
    if(colorVersion == 1.0) {
        strength = clamp(strength, 0.0, 1.0);       

        vec3 backColor = vec3(0.0);
        vec3 uvColor = vec3(vUv , 0.5);
        vec3 mixedColor = mix(backColor, uvColor, strength);
        gl_FragColor=vec4(mixedColor,1.0);
    }else {
        gl_FragColor=vec4(strength,strength,strength,1.0);
    }

}`;const M=new _,l=document.querySelector("canvas.webgl");let t=new U;const F=new p(1,1,32,32),I=new m,V=I.load("/textures/matcaps/8.png"),q=new y({map:V}),G=new X,g={colorVersion:1};let s=null;const c=()=>{for(let n=0;n<50;n++){G.load("/fonts/helvetiker_regular.typeface.json",f=>{const x=new Y(`${n+1}`,{font:f,size:.2,height:.1,curveSegments:12,bevelEnabled:!0,bevelThickness:.03,bevelSize:.02,bevelOffset:0,bevelSegments:3}),a=new r(x,q);a.position.x=n*2-50,a.position.y=1.5,t.add(a)}),s=new b({vertexShader:S,fragmentShader:C,uniforms:{tip:{value:(n+1).toFixed(1)},colorVersion:{value:g.colorVersion}},side:P});const o=new r(F,s);o.position.x=n*2-50,t.add(o)}};c();M.add(g,"colorVersion",0,1,1).name("颜色切换").onFinishChange(n=>{s&&(s=null),console.log(t),t&&t.clear(),c()});const e={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",()=>{e.width=window.innerWidth,e.height=window.innerHeight,v.aspect=e.width/e.height,v.updateProjectionMatrix(),i.setSize(e.width,e.height),i.setPixelRatio(Math.min(window.devicePixelRatio,2))});const v=new w(75,e.width/e.height,.1,100);v.position.set(.25,-.25,1);t.add(v);const d=new z(v,l);d.enableDamping=!0;const i=new u({canvas:l});i.setSize(e.width,e.height);i.setPixelRatio(Math.min(window.devicePixelRatio,2));const h=()=>{d.update(),i.render(t,v),window.requestAnimationFrame(h)};h();

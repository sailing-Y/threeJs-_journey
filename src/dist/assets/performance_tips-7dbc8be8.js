import"./modulepreload-polyfill-3cfb730f.js";import{S as P,T as D,P as y,W as b,y as T,a as i,v,q as c,c as U,r as F,s as f,D as G,k as L,ao as R,aU as k,an as z,aV as I,a2 as q,K as E,aF as W,g as K}from"./three.module-13a89988.js";import{O as j}from"./OrbitControls-63ae8fc2.js";import{S as A}from"./stats.min-e9b58a7b.js";var d=new A;d.showPanel(0);document.body.appendChild(d.dom);const g=document.querySelector("canvas.webgl"),t=new P,B=new D,H=B.load("/textures/displacementMap.png"),e={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",()=>{e.width=window.innerWidth,e.height=window.innerHeight,a.aspect=e.width/e.height,a.updateProjectionMatrix(),o.setSize(e.width,e.height),o.setPixelRatio(Math.min(window.devicePixelRatio,2))});const a=new y(75,e.width/e.height,.1,100);a.position.set(2,2,6);t.add(a);const M=new j(a,g);M.enableDamping=!0;const o=new b({canvas:g,powerPreference:"high-performance",antialias:!0});o.shadowMap.enabled=!0;o.shadowMap.type=T;o.setSize(e.width,e.height);o.setPixelRatio(window.devicePixelRatio);const l=new i(new v(2,2,2),new c);l.castShadow=!0;l.receiveShadow=!0;l.position.set(-5,0,0);t.add(l);const h=new i(new U(1,.4,128,32),new c);h.castShadow=!0;h.receiveShadow=!0;t.add(h);const w=new i(new F(1,32,32),new c);w.position.set(5,0,0);w.castShadow=!0;w.receiveShadow=!0;t.add(w);const s=new i(new f(10,10),new c);s.position.set(0,-2,0);s.rotation.x=-Math.PI*.5;s.castShadow=!0;s.receiveShadow=!0;t.add(s);const n=new G("#ffffff",1);n.castShadow=!0;n.shadow.mapSize.set(1024,1024);n.shadow.camera.far=15;n.shadow.normalBias=.05;n.position.set(.25,3,2.25);t.add(n);const O=new K,x=()=>{d.begin();const r=O.getElapsedTime();h.rotation.y=r*.1,M.update(),o.render(t,a),window.requestAnimationFrame(x),d.end()};x();const Q=new v(.5,.5,.5),V=new L,u=new R(Q,V,50);u.instanceMatrix.setUsage(k);t.add(u);for(let r=0;r<50;r++){const m=new z,p=new W;p.setFromEuler(new I((Math.random()-.5)*Math.PI*2,(Math.random()-.5)*Math.PI*2,0)),m.makeRotationFromQuaternion(p);const C=new q((Math.random()-.5)*10,(Math.random()-.5)*10,(Math.random()-.5)*10);m.setPosition(C),u.setMatrixAt(r,m)}const _=new f(10,10,256,256),N=new E({precision:"lowp",uniforms:{uDisplacementTexture:{value:H}},defines:{uDisplacementStrength:1.5},vertexShader:`
        // #define uDisplacementStrength 1.5
        // uniform float uDisplacementStrength;         //设置常量

        uniform sampler2D uDisplacementTexture;

        varying vec2 vUv;

        void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;
            if(elevation < 0.5)
            {
                elevation = 0.5;
            }

            modelPosition.y += elevation * uDisplacementStrength;

            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            vUv = uv;
        }
    `,fragmentShader:`
        uniform sampler2D uDisplacementTexture;

        varying vec2 vUv;

        void main()                                                             //尽量在 vertexShader中进行计算 对性能来说较好
        {
            float elevation = texture2D(uDisplacementTexture, vUv).r;
            if(elevation < 0.25)
            {
                elevation = 0.25;
            }

            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            // vec3 finalColor = vec3(0.0);
            // finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
            // finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
            // finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;
            vec3 finalColor = mix(depthColor , surfaceColor , elevation);       //善用函数

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `}),S=new i(_,N);S.rotation.x=-Math.PI*.5;t.add(S);

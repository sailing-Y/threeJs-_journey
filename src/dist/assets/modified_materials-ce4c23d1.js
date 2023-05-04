import"./modulepreload-polyfill-3cfb730f.js";import{S as f,T as S,h as T,a4 as m,a as p,s as b,q as d,m as y,aj as P,D as L,P as _,W as z,a5 as C,ad as j,g as k}from"./three.module-13a89988.js";import{O as R}from"./OrbitControls-63ae8fc2.js";import{G}from"./GLTFLoader-c57b3ea4.js";import{G as D}from"./lil-gui.esm-1e0f7d72.js";new D;const u=document.querySelector("canvas.webgl"),n=new f,h=new S,E=new G,B=new T,A=()=>{n.traverse(e=>{e instanceof p&&e.material instanceof d&&(e.material.envMapIntensity=1,e.material.needsUpdate=!0,e.castShadow=!0,e.receiveShadow=!0)})},l=B.load(["/textures/environmentMaps/0/px.jpg","/textures/environmentMaps/0/nx.jpg","/textures/environmentMaps/0/py.jpg","/textures/environmentMaps/0/ny.jpg","/textures/environmentMaps/0/pz.jpg","/textures/environmentMaps/0/nz.jpg"]);l.encoding=m;n.background=l;n.environment=l;const g=h.load("/models/LeePerrySmith/color.jpg");g.encoding=m;const F=h.load("/models/LeePerrySmith/normal.jpg"),r=new p(new b(15,15,15),new d);r.position.x=-2;r.position.y=-5;r.position.z=5;r.rotation.y=Math.PI;n.add(r);const c={uTime:{value:0}},x=new y({depthPacking:P}),w=new d({map:g,normalMap:F});w.onBeforeCompile=e=>{e.uniforms.uTime=c.uTime,e.vertexShader=e.vertexShader.replace("#include <common>",`
            #include <common>                        //在shaderChunk中可以找到
            uniform float uTime;
            mat2 get2dRotateMatrix(float _angle) {                                     // https://thebookofshaders.com/08/   mat2 rotate2d
                return mat2(cos(_angle) , -sin(_angle) , sin(_angle) , cos(_angle));        
            }
        `),e.vertexShader=e.vertexShader.replace("#include <beginnormal_vertex>",`
        #include <beginnormal_vertex>

        float angle = (position.y + uTime) *0.5 ;
        mat2 rotationMatrix = get2dRotateMatrix(angle);
        objectNormal.xz = rotationMatrix * objectNormal.xz;
            
        `),e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`
            #include <begin_vertex>              //在shaderChunk中可以找到  vec3 transformed = vec3( position );

            // float angle = (position.y + uTime) *0.5 ;                //注意语法错误 有时复制时会在一个glsl重复 定义
            // mat2 rotationMatrix = get2dRotateMatrix(angle);
            transformed.xz = rotationMatrix * transformed.xz;

        `)};x.onBeforeCompile=e=>{e.uniforms.uTime=c.uTime,e.vertexShader=e.vertexShader.replace("#include <common>",`
            #include <common>                        //在shaderChunk中可以找到
            uniform float uTime;
            mat2 get2dRotateMatrix(float _angle) {                                     // https://thebookofshaders.com/08/   mat2 rotate2d
                return mat2(cos(_angle) , -sin(_angle) , sin(_angle) , cos(_angle));        
            }
        `),e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`
            #include <begin_vertex>              //在shaderChunk中可以找到  vec3 transformed = vec3( position );

            float angle = (position.y + uTime) *0.5 ;
            mat2 rotationMatrix = get2dRotateMatrix(angle);
            transformed.xz = rotationMatrix * transformed.xz;

        `)};E.load("/models/LeePerrySmith/LeePerrySmith.glb",e=>{const s=e.scene.children[0];s.rotation.y=Math.PI*.5,s.material=w,s.customDepthMaterial=x,n.add(s),A()});const i=new L("#ffffff",3);i.castShadow=!0;i.shadow.mapSize.set(1024,1024);i.shadow.camera.far=15;i.shadow.normalBias=.05;i.position.set(.25,2,-2.25);n.add(i);const a={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",()=>{a.width=window.innerWidth,a.height=window.innerHeight,o.aspect=a.width/a.height,o.updateProjectionMatrix(),t.setSize(a.width,a.height),t.setPixelRatio(Math.min(window.devicePixelRatio,2))});const o=new _(75,a.width/a.height,.1,100);o.position.set(4,1,-4);n.add(o);const v=new R(o,u);v.enableDamping=!0;const t=new z({canvas:u,antialias:!0});t.shadowMap.enabled=!0;t.shadowMap.type=C;t.physicallyCorrectLights=!0;t.outputEncoding=m;t.toneMapping=j;t.toneMappingExposure=1;t.setSize(a.width,a.height);t.setPixelRatio(Math.min(window.devicePixelRatio,2));const I=new k,M=()=>{const e=I.getElapsedTime();c.uTime.value=e,v.update(),t.render(n,o),window.requestAnimationFrame(M)};M();

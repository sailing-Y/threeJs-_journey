import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

// https://threejs.org/docs/index.html?q=eff#examples/zh/postprocessing/EffectComposer
//  用于在three.js中实现后期处理效果。该类管理了产生最终视觉效果的后期处理过程链。 后期处理过程根据它们添加/插入的顺序来执行，最后一个过程会被自动渲染到屏幕上。
//  EffectComposer是一个函数 参数：rander,randerTarget
// /three/examples/jsm/postprocessing/EffectComposer.js
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// pass
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';

import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';                  // shaderpass

import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';                      // SMAAPass

import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';         // UnrealBloomPass
import { Vector3 } from 'three';

import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import Stats from 'stats.js'    //性能监控

import { gsap } from 'gsap'
// https://github.com/mrdoob/stats.js
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



/**
 * Loaders
 */
let sceneReady = false         //装载好的标志
const loadingElement = document.querySelector(".loading-bar")
const loadingManager = new THREE.LoadingManager(() => {
    //loaded
    //和setTimeout一样的
    gsap.delayedCall(0.5 , () => {
        gsap.to(overlayMaterial.uniforms.uAlpha,{duration: 3 ,value : 0} )
        loadingElement.classList.add('ended')
        loadingElement.style.transform = ``     //process中设置的权重较高 取消掉
    })
    setTimeout(() => {          
        sceneReady = true
    },2000)

}, (itemUrl , itemsloaded , itemsTotal) => {
    //process
    const progressRatio = itemsloaded / itemsTotal
    loadingElement.style.transform = `scaleX(${progressRatio})`
})
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
const textureLoader = new THREE.TextureLoader(loadingManager)


/**
 * raycaster 实现 观察点是否显示 标记距离比raycaster小 就显示
 */

const raycaster = new THREE.Raycaster()
const points = [        //点的信息
    {
        position : new THREE.Vector3(1.55, 0, 0),
        element : document.querySelector('.point-0')
    },
    {
        position : new THREE.Vector3(-1.3, 0, -2),
        element : document.querySelector('.point-1')
    },
    {
        position : new THREE.Vector3(1.7, -1.4,0),
        element : document.querySelector('.point-2')
    },
]



/**
 * 遮罩层loading
 */
// 1.全屏设置
//     PlaneGeometry 大小为2    gl_Position = vec4(position , 1.0);

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)            //
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main() {
            gl_Position = vec4(position , 1.0); 
        }
    `,
    fragmentShader: `
        uniform float uAlpha;
        void main() {
            gl_FragColor = vec4(0.0 , 0.0 , 0.0 ,uAlpha); 
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)


/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update effect composer 如果用了后处理 同样要调整effectComposer
    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(renderer.getPixelRatio())
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding            //renderTarget
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// post processing后处理

// 1.如果像素比PixelRatio > 1 用WebGLRenderTarget 且不用antialias pass
// 2.如果像素比PixelRatio = 1   且浏览器支持WebGLMultipleRenderTargets  就用它
// 3.如果像素比PixelRatio = 1   但是浏览器不支持 WebGLRenderTarget + smaa
// renderer.capabilities 可以查看支持性

let RenderTargetClass = null
if (renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2) {
    RenderTargetClass = THREE.WebGLMultipleRenderTargets                    //有兼容性问题
} else {
    RenderTargetClass = THREE.WebGLRenderTarget
}

// randerTarget 如果需要的话 多个过程处理
const renderTarget = new RenderTargetClass(800, 600, {                            //默认是THREE.WebGLRenderTarget
    // const renderTarget = new THREE.WebGLMultipleRenderTargets(800,600,{         //有兼容性问题
    minFilter: THREE.LinearFilter,                                                //默认参数
    maxFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    encoding: THREE.sRGBEncoding
})
// base
const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setSize(sizes.width, sizes.height)
effectComposer.setPixelRatio(renderer.getPixelRatio())
// randerPass也是必须的
const randerPass = new RenderPass(scene, camera)
effectComposer.addPass(randerPass)

// dotScreenPass
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

// glitchPass
const glitchPass = new GlitchPass()
glitchPass.goWild = false          //变得很狂野 字面意思
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

//shaderPass + RGBShiftShader
const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)

const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.enabled = false
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6
effectComposer.addPass(unrealBloomPass)





const postProcessingfolder = gui.addFolder('后处理-pass')
postProcessingfolder.add(dotScreenPass, 'enabled').name('dotScreenPass')
postProcessingfolder.add(glitchPass, 'enabled').name('glitchPass')
postProcessingfolder.add(glitchPass, 'goWild').name('glitchPass---goWild')
postProcessingfolder.add(rgbShiftPass, 'enabled').name('RGBShiftShader')
const unrealBloomPassfolder = postProcessingfolder.addFolder('unrealBloomPass')
unrealBloomPassfolder.add(unrealBloomPass, 'enabled').name('unrealBloomPass')
unrealBloomPassfolder.add(unrealBloomPass, 'strength', 0, 2, 0.001).name('unrealBloomPass(强度)')
unrealBloomPassfolder.add(unrealBloomPass, 'radius', 0, 2, 0.001).name('unrealBloomPass(发光半径)')
unrealBloomPassfolder.add(unrealBloomPass, 'threshold', 0, 1, 0.001).name('unrealBloomPass(发光阈值)')


// Tint pass 加个滤镜 自己写的shaderPass 就像RGBShiftShader差不多意思
const TintPass = {
    uniforms: {
        tDiffuse: { value: null },                   //固定的接收 上一个shader给的texture
        uTint: { value: new Vector3() }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            //modelPosition
            vec4 modelPosition = modelMatrix * vec4(position ,1. );
            
            //viewPosition
            vec4 viewPosition = viewMatrix * modelPosition;
        
            vec4 projectedPosition = projectionMatrix * viewPosition;
        
            gl_Position = projectedPosition;
            vUv = uv;
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        
        uniform vec3 uTint;
        uniform sampler2D tDiffuse;

        void main(){
            vec4 color = texture2D(tDiffuse , vUv);         //可以直接操作rgb颜色 类似更换滤镜
            color.rgb += uTint;
            gl_FragColor = color;
        }
    `
}
const tintpass = new ShaderPass(TintPass)
tintpass.enabled = false
effectComposer.addPass(tintpass)

const TintPassfolder = postProcessingfolder.addFolder('TintPassfolder')
TintPassfolder.add(tintpass, 'enabled').name('滤镜开关')
TintPassfolder.add(tintpass.material.uniforms.uTint.value, 'x', -1, 1, 0.001).name('unrealBloomPass-r')
TintPassfolder.add(tintpass.material.uniforms.uTint.value, 'y', -1, 1, 0.001).name('unrealBloomPass-g')
TintPassfolder.add(tintpass.material.uniforms.uTint.value, 'z', -1, 1, 0.001).name('unrealBloomPass-b')


// Displacement pass 自己写的shaderPass 就像RGBShiftShader差不多意思
const DisplacementPass = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: null },
        uNormap: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            //modelPosition
            vec4 modelPosition = modelMatrix * vec4(position ,1. );
            
            //viewPosition
            vec4 viewPosition = viewMatrix * modelPosition;
        
            vec4 projectedPosition = projectionMatrix * viewPosition;
        
            gl_Position = projectedPosition;
            vUv = uv;
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        
        uniform sampler2D tDiffuse;     //sampler2D 接收 纹理
        uniform sampler2D uNormap;

        uniform float uTime;
        
        void main(){
            vec3 normalColor = texture2D(uNormap, vUv).xyz * 2.0 -1.0;
            vec2 newUv = vUv + normalColor.xy * 0.1;
            vec4 color = texture2D(tDiffuse , newUv);

            vec3 lightDirection = normalize(vec3(-1.0 ,1.0, 0.0));                      // 添加类似光照的效果(优化 可以参照control的光的方向)
            float lightness = clamp(dot(normalColor, lightDirection), 0.0 ,1.0);
            color.rgb += lightness * 2.0;

            gl_FragColor = color;
        }
    `
}
const displacementPass = new ShaderPass(DisplacementPass)
displacementPass.material.uniforms.uNormap.value = textureLoader.load('/textures/interfaceNormalMap.png')
displacementPass.enabled = false
effectComposer.addPass(displacementPass)

postProcessingfolder.add(displacementPass, 'enabled').name('蜂窝贴图')




//github issues#24843，使用伽马矫正
const gammaCorrection = new ShaderPass(GammaCorrectionShader);        //伽马纠正颜色
effectComposer.addPass(gammaCorrection);


//smaaPass  在最后
if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
    const smaaPass = new SMAAPass()         //对性能有影响 但效果稍好 属于antialias pass分析过程
    effectComposer.addPass(smaaPass)
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    stats.begin();
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    //DisplacementPass update
    // displacementPass.material.uniforms.uTime.value = elapsedTime

    // Render
    // renderer.render(scene, camera)
    effectComposer.render()

    if(sceneReady) {
        for(const point of points) {
            const screenPosition = point.position.clone()
    
            screenPosition.project(camera)
            
            // 利用raycaster 判断什么时候显示隐藏
            raycaster.setFromCamera(screenPosition, camera)                              //从相机射出的方向
            const intersects = raycaster.intersectObjects(scene.children , true)        //射线匹配 所有子模型是否相交
            if(intersects.length === 0) {
                point.element.classList.add('visible')
            }else {
                const closerDistance = intersects[0].distance                           //最近和模型交叉点 距离 相机
                const pointDistance = point.position.distanceTo(camera.position)        //标记点 距离 相机
                if(pointDistance > closerDistance) {
                    point.element.classList.remove('visible')
                }else {
                    point.element.classList.add('visible')
                }
    
            }
    
            //html 固定在一个3d坐标
            const translateX = screenPosition.x * sizes.width * 0.5
            const translateY = - screenPosition.y * sizes.height * 0.5
            point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
        }
    }


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    stats.end();
}

tick()
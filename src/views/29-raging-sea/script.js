import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

import Stats from 'stats.js'    //性能监控

// https://github.com/mrdoob/stats.js
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {
    depthColor: '#070f46',
    surfaceColor: '#88e9ff',
};
const bigWavefolder = gui.addFolder('波形控制')
const smallWavefolder = gui.addFolder('噪声波控制')
const colorfolder = gui.addFolder('颜色控制')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    wireframe:false,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0 },
        uWaveSpeed : {value: 0.75 },
        uWaveElevation: { value: 0.2 },
        uWaveFrequency: { value: new THREE.Vector2(4, 1.5) },

        //噪点信息 小的波浪
        uSmallWaveElevation : {value :0.15},
        uSmallWaveFrequency : {value :3},
        uSmallWaveSpeed : {value :0.2},
        uSmallWaveIterations : {value :4.0},

        uDepthColor: {value : new THREE.Color(debugObject.depthColor)},
        uSurfaceColor :{value : new THREE.Color(debugObject.surfaceColor)},
        uColorOffset : {value : 0.168},
        uColorMultiplier : {value : 2.834},
    }
})
gui.add(waterMaterial,'wireframe').name('线框开关')
gui.add(waterMaterial,'side',{'正面':THREE.FrontSide,'背面':THREE.BackSide,'双面':THREE.DoubleSide,}).name('渲染面')

//大波
bigWavefolder.add(waterMaterial.uniforms.uWaveElevation, 'value', 0, 1, 0.001).name('海拔')
bigWavefolder.add(waterMaterial.uniforms.uWaveFrequency.value, 'x', 0, 10, 0.001).name('x上的频率(波的x)')
bigWavefolder.add(waterMaterial.uniforms.uWaveFrequency.value, 'y', 0, 10, 0.001).name('y上的频率(波的z)')
bigWavefolder.add(waterMaterial.uniforms.uWaveSpeed, 'value', 0, 10, 0.001).name('波的速度')
//噪声波
smallWavefolder.add(waterMaterial.uniforms.uSmallWaveElevation, 'value', 0, 1, 0.001).name('噪点波——海拔')
smallWavefolder.add(waterMaterial.uniforms.uSmallWaveFrequency, 'value', 0, 30, 0.001).name('噪点波——频率')
smallWavefolder.add(waterMaterial.uniforms.uSmallWaveSpeed, 'value', 0, 5, 0.001).name('噪点波——速度')
smallWavefolder.add(waterMaterial.uniforms.uSmallWaveIterations, 'value', 2, 10, 1).name('噪点波——迭代添加次数')
//颜色
colorfolder.addColor(debugObject,'depthColor').onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
}).name('深处颜色')
colorfolder.addColor(debugObject,'surfaceColor').name('表面颜色').onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})
colorfolder.add(waterMaterial.uniforms.uColorOffset, 'value', 0, 1, 0.001).name('颜色偏移量')
colorfolder.add(waterMaterial.uniforms.uColorMultiplier, 'value', 0, 10, 0.001).name('颜色混合比')



// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)





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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    stats.begin();

    const elapsedTime = clock.getElapsedTime()

    // update water
    waterMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    stats.end();

}

tick()
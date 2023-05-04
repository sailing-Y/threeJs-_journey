import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

//npm i vite-plugin-glsl 并在vite中配置
import vertexShader from './shaders/test/vertexShader.glsl'
import fragmentShader from './shaders/test/fragmentShader.glsl'
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const france_flag = textureLoader.load('/textures/flag/flag-french.jpg')
const china_flag = textureLoader.load('/textures/flag/flag-china.webp')
const us_flag = textureLoader.load('/textures/flag/us-flag.jpg')
/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
console.log(geometry);
const count = geometry.attributes.position.count
const randoms = new Float32Array(count)
for (let i = 0; i < count; i++) {
    randoms[i] = Math.random()
}
//这里的setAttribute的name 要和vertexShader顶点着色器的attribute float aRandom; 对应
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
// Material
const material = new THREE.RawShaderMaterial({
    // 顶点着色器
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        // uFrequence:{value : 10}                                  //  uniform float uFrequence;
        uFrequenceVec2: { value: new THREE.Vector2(10, 5) },            //  uniform vec2 uFrequenceVec2;
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('orange') },
        uTexture: { value: france_flag },
        uColorDepth:{value : 0.5}
    },

    // wireframe: true,
    side: THREE.DoubleSide
})
gui.add(material.uniforms.uFrequenceVec2.value, 'x', 0, 20, 0.01).name('x轴sin的程度效果')
gui.add(material.uniforms.uFrequenceVec2.value, 'y', 0, 20, 0.01).name('y轴sin的程度效果')
gui.addColor(material.uniforms.uColor, 'value').name('颜色')
gui.add(material.uniforms.uColorDepth, 'value', 0, 1, 0.01).name('贴图颜色深度')
gui.add(material.uniforms.uTexture, 'value',{
    法国:france_flag,
    中国:china_flag,
    美国:us_flag
}).name('贴图')

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2 / 3
scene.add(mesh)

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
camera.position.set(0.25, - 0.25, 1)
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
    const elapsedTime = clock.getElapsedTime()

    //update material       
    material.uniforms.uTime.value = elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
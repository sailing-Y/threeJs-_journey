import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
let scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

// Material
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const textMaterial = new THREE.MeshMatcapMaterial({ map: matcapTexture })
const fontLoader = new FontLoader()
// Mesh
const debugObject = {
    colorVersion:1
}
let material = null
const create = () => {
    for (let i = 0; i < 50; i++) {
        fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry(`${i+1}`, {
                font,
                size: .2,
                height: .1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,      
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            })
            const text = new THREE.Mesh(textGeometry, textMaterial)
            text.position.x = i * 2 - 50
            text.position.y = 1.5
            scene.add(text)
        })
        
        material = new THREE.ShaderMaterial({
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
            uniforms: {
                tip: { value: (i+1).toFixed(1) },
                colorVersion: { value: debugObject.colorVersion },
            },
            side: THREE.DoubleSide
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = i * 2 - 50
        scene.add(mesh)
    }
}
create()
gui.add(debugObject, 'colorVersion', 0,1, 1).name('颜色切换').onFinishChange((a) => {
    material?material = null:""
    console.log(scene);
    scene?scene.clear():""
    create()
})

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
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
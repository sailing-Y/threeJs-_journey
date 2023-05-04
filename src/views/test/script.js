import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertexShader from './shader/test/vertexShader.glsl'
import waterFragmentShader from './shader/test/fragmentShader.glsl'

import earchVertexShader from './shader/earch/vertexShader.glsl'
import earchFragmentShader from './shader/earch/fragmentShader.glsl'

import water3DVertexShader from './shader/water3d/vertexShader.glsl'
import water3DFragmentShader from './shader/water3d/fragmentShader.glsl'

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let planeGeometry = null
let waterMaterial = null
let waterMesh = null

let sphereGeometry = null
let earthMaterial = null
let earchMesh = null

let waterSphereGeometry = null
let water3DMaterial = null
let water3DMesh = null

const generateGalaxy = () => {
    /**
     * Geometry
     */
    planeGeometry = new THREE.PlaneGeometry(100,100)
    sphereGeometry = new THREE.PlaneGeometry(sizes.width,sizes.height)
    // waterSphereGeometry = new THREE.SphereGeometry(15, 32, 16)
    /**
     * Material
     */
    waterMaterial = new THREE.ShaderMaterial({
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        uniforms: {
            iTime: {value: 0},
            iResolution: {value: new THREE.Vector3(1, 1, 1)},
        },
        side:THREE.DoubleSide
    })

    earthMaterial = new THREE.ShaderMaterial({
        vertexShader: earchVertexShader,
        fragmentShader: earchFragmentShader,
        uniforms: {
            time: {value: 0},
            mouse:{value : new THREE.Vector3(0)},
            resolution : {value : new THREE.Vector2(2560 , 1600)},
        }
    })
    /**
     * Mesh
     */
    waterMesh = new THREE.Mesh(planeGeometry, waterMaterial)                //waterShader -- plane
    earchMesh = new THREE.Mesh(sphereGeometry, earthMaterial)               //earthMaterial -- sphere
    waterMesh.visible = false
    scene.add(waterMesh)
    scene.add(earchMesh)
}


window.addEventListener('mousemove', (event) => {
    earthMaterial.uniforms.mouse.x = event.clientX
    earthMaterial.uniforms.mouse.y = event.clientY
})
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
camera.position.set(0,0,40)

scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//在rander后创建mesh 可能会用到renderer.getPixelRatio() 调整不同dpr下的尺寸
generateGalaxy()

gui.add(earchMesh,'visible').name('earch')
gui.add(waterMesh,'visible').name('waterPlane')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // update shader
    waterMaterial.uniforms.iTime.value = elapsedTime
    earthMaterial.uniforms.time.value = elapsedTime
    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
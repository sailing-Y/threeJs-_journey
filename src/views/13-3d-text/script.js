import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { AxesHelper } from 'three';

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
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
/* Fonts */
const fontLoader = new FontLoader()
const bevelThickness = 0.03
const bevelSize = 0.02
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry("yf's threeJounery", {
        font: font,
        size: .5,
        height: .2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: bevelThickness,      //拉伸的z 和实际size有这个差   --文本上斜角的深度，默认值为20
        bevelSize: bevelSize,                //拉伸的xy 和实际size有这个差  --斜角与原始文本轮廓之间的延伸距离
        bevelOffset: 0,
        bevelSegments: 3
    })
    // text居中的方法
    // 1.bounding
    // textGeometry.computeBoundingBox()       //生成textGeometry.boundingBox 这个box3对象
    // textGeometry.translate(                 //BufferGeometry的translate 移动的是Geometry而不是mesh
    //     - (textGeometry.boundingBox.max.x - bevelSize) * 0.5,
    //     - (textGeometry.boundingBox.max.y - bevelSize) * 0.5,
    //     - (textGeometry.boundingBox.max.z - bevelThickness) * 0.5,
    // )
    // 1.center方法
    textGeometry.center()

    // const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
    const textMaterial = new THREE.MeshMatcapMaterial({ map: matcapTexture })
    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)

    const dountGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

    for (let i = 0; i < 100; i++) {
        const dount = new THREE.Mesh(dountGeometry, textMaterial)
        dount.position.x = (Math.random() - 0.5) * 10;
        dount.position.y = (Math.random() - 0.5) * 10;
        dount.position.z = (Math.random() - 0.5) * 10;

        dount.rotation.x = Math.random() * Math.PI
        dount.rotation.y = Math.random() * Math.PI

        const scaleTime = Math.random()
        dount.scale.set(scaleTime, scaleTime, scaleTime)
        scene.add(dount)
    }
})

/* axesHelper */
// const axesHelper = new AxesHelper()
// scene.add(axesHelper)


/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
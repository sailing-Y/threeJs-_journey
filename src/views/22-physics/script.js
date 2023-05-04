import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}
debugObject.createSphere = () => {
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: Math.random() * 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
debugObject.createBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: Math.random() * 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
debugObject.reset = () => {
    for(const object of objectToUpdate) {
        world.remove(object.body)
        scene.remove(object.mesh)

        object.body.removeEventListener('collide',playHitSound)

    }
}
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sound
 */
const hitSound = new Audio('/sounds/hit.mp3')
const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()     //获取碰撞强度信息
    if(impactStrength > 1.5) {                                                  //根据碰撞的强度大小是否播放声音
        hitSound.volume = Math.random()                                         //随机的声音大小0-1
        hitSound.currentTime = 0                                                //重置音频进度 防止多个
        hitSound.play()
    }
}
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

/**
 * Physics world
 */
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)  //广义检测 
world.allowSleep = true                             //休眠模式开启
world.gravity.set(0, - 9.82, 0)                     //重力设置

/* floor Physics */
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape
})
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI / 2
)
world.addBody(floorBody)

/* material Physics */
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,           //摩擦系数
        restitution: 0.7         //反弹效果
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial //整个world都使用defaultMaterial

// gui.add()
/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - (Math.PI / 2)
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/* utils */
const objectToUpdate = []


// 创建圆形
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    // envMapIntensity: 0.5
})

const createSphere = (radius, position) => {
    //threeJS
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // cannonJs Body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        shape,
        mass: 1,
        position: position,
        material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)
    objectToUpdate.push({ mesh, body })
}
createSphere(0.5, { x: 0, y: 3, z: 0 })

//创建方形
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    // envMapIntensity: 0.5
})
const createBox = (width, height, depth, position) => {
    //threeJS
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // cannonJs Body
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2))
    const body = new CANNON.Body({
        shape,
        mass: 1,
        material: defaultMaterial
    })
    body.addEventListener('collide',playHitSound)
    body.position.copy(position)
    world.addBody(body)
    objectToUpdate.push({ mesh, body })
}


/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // update physics world
    world.step(1 / 60, deltaTime, 3)
    for (const object of objectToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
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
 * GLTFLoader Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    // '/models/Duck/glTF/Duck.gltf',                   //glTF 
    // '/models/Duck/glTF-Binary/Duck.glb',             //glTF-Binary
    // '/models/Duck/glTF-Embedded/Duck.gltf',          //glTF-Embedded
    '/models/Duck/glTF-Draco/Duck.gltf',             //glTF-Draco 需要DracoLoader
    // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        // gltf.scene.children[0].children.mesh 放着导入的模型
        // 注意 gltf.scene.children[0].scale 和 position 这些信息
        console.log(gltf);
        const children = [...gltf.scene.children]       //循环添加会搞乱他的顺序 要先拷贝出来
        for (const child of children) {
            scene.add(child)
        }
        // while(gltf.scene.children,length) {     //好像并不管用
        //     scene.add(gltf.scene.children[0])
        // }
        // scene.add(gltf.scene)                        //方法二 直接添加scene
    },
    (progress) => {
        console.log('progress', progress);
    },
    (error) => {
        console.log('error', error);
    },
)

let mixer = null
gltfLoader.load('/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        // https://threejs.org/docs/index.html?q=Animation#api/zh/animation/AnimationAction
        mixer = new THREE.AnimationMixer(gltf.scene)
        
        let action = mixer.clipAction(gltf.animations[0])
        action.play()
        // action.play().setLoop(THREE.LoopOnce)  // 设置循环模式为播放一次
        action.clampWhenFinished = true        // 动画播放完后保持最后一帧状态
                                                //1/2/3 如何播放
        mixer.addEventListener( 'finished', function( e ) {
           console.log(e);
        })
        

        gltf.scene.scale.set(0.025, 0.025, 0.025)
        gltf.scene.rotation.y = Math.PI / 2
        gltf.scene.position.z += 2

        scene.add(gltf.scene)                           //方法二 直接添加scene
    }
)

gltfLoader.load('/models/面包片.glb',
    (gltf) => {
        gltf.scene.scale.set(0.25, 0.25, 0.25)
        gltf.scene.position.z -= 3

        scene.add(gltf.scene)                           //方法二 直接添加scene
    }
)
/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
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

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //update mixer
    if (mixer) {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
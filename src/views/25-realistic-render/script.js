import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CameraHelper } from 'three';


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}
debugObject.envMapIntensity = 5

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * environmentMap
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/2/px.jpg',
    '/textures/environmentMaps/2/nx.jpg',
    '/textures/environmentMaps/2/py.jpg',
    '/textures/environmentMaps/2/ny.jpg',
    '/textures/environmentMaps/2/pz.jpg',
    '/textures/environmentMaps/2/nz.jpg',
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap      //会被设为场景中所有物理材质的环境贴图。会被应用到所有支持envmap的材质 不能够覆盖已存在的、已分配给 MeshStandardMaterial.envMap 的贴图。
/**
 * models_environmentMap
 */

const updateAllMaterial = () => {
    // 在对象以及后代中执行的回调函数。在children中的递归
    scene.traverse((child) => {
        // child包括所有的 Scene/Light/Camera/mesh等等
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            //是网格 且材质为MeshStandardMaterial
            // child.material.envMap = environmentMap      //scene.environment = environmentMap应用所有的支持envmap的材质
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}
gui.add(debugObject, 'envMapIntensity', 0, 10, 0.001).name('模型的envMap强度').onChange(updateAllMaterial)

/**
 * models
 */
const gltfLoader = new GLTFLoader()
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {

    gltf.scene.scale.set(10, 10, 10)
    gltf.scene.position.set(0, -4, 0)
    gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    updateAllMaterial()     //更新models_environmentMap
    // models_gui
    gui.add(gltf.scene.rotation, 'y', -Math.PI, Math.PI, 0.001).name('模型的y轴旋转')
})

/**
 * Lights
 */
const directionLight = new THREE.DirectionalLight("#ffffff", 3)
directionLight.position.set(0.25, 3, -2.25)
directionLight.shadow.camera.far = 10
directionLight.castShadow = true
directionLight.shadow.mapSize.set(1024,1024)
directionLight.shadow.normalBias = 0.05     //消除像素阴影  一个个像素也会在平滑的曲面上生成阴影

scene.add(directionLight)

// lightHelper 
const directionLightHelper = new THREE.CameraHelper(directionLight.shadow.camera)
scene.add(directionLightHelper)
gui.add(directionLightHelper, 'visible').name('LightHelper显隐')


//Lights_gui
gui.add(directionLight, 'intensity', 0, 10, 0.001).name('方向光的强度')
gui.add(directionLight.position, 'x', -5, 5, 0.001).name('方向光的x轴')
gui.add(directionLight.position, 'y', -5, 5, 0.001).name('方向光的y轴')
gui.add(directionLight.position, 'z', -5, 5, 0.001).name('方向光的z轴')

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
    antialias:true,      // - 是否执行抗锯齿。默认为false.   有关dpr
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//真实渲染效果
renderer.physicallyCorrectLights = true                 //是否使用物理上正确的光照模式 -- 接近3d编辑器内的灯光 较3js的光照暗
renderer.outputEncoding = THREE.sRGBEncoding            //定义渲染器的输出编码。默认为THREE.LinearEncoding 其他值仅在材质的贴图、envMap和emissiveMap中有效 配合 environmentMap.encoding = THREE.sRGBEncoding使用
renderer.toneMapping = THREE.ReinhardToneMapping        //色调映射 这些常量定义了WebGLRenderer中toneMapping的属性。 这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。
renderer.toneMappingExposure = 3                        //色调映射曝光度 默认是1

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap        //- type: 定义阴影贴图类型 (未过滤, 关闭部分过滤, 关闭部分双线性过滤), 可选值有:
gui.add(renderer, 'toneMapping', {                      //如果不行 在onFinishChange事件中将 renderer.toneMapping=Number(renderer.toneMapping)  
    NO: THREE.NoToneMapping,                            //THREE.NoToneMapping实际上是一些数字 (出问题的化可能是因为转成字符串了)
    线性色调映射Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
}).name('色调映射')
gui.add(renderer,'toneMappingExposure',0,10,0.001).name('色调映射曝光toneMappingExposure')
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
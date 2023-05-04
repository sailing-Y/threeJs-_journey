import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/* debugger */
const gui = new dat.GUI()

/* loaderManager */
const loaderManager = new THREE.LoadingManager()
loaderManager.onStart = () => {
    console.log('loaderManager-onStart');
}
/* texturesLoader */
const texturesLoader = new THREE.TextureLoader(loaderManager)
const doorAlphaTexture = texturesLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = texturesLoader.load('/textures/door/ambientOcclusion.jpg');
const doorColorTexture = texturesLoader.load('/textures/door/color.jpg');
const doorHeightTexture = texturesLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = texturesLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = texturesLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = texturesLoader.load('/textures/door/roughness.jpg');
const matcapsTexture = texturesLoader.load('/textures/matcaps/3.png');
const gradientTexture = texturesLoader.load('/textures/gradients/5.jpg');
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

/* cubeTexturesLoader */
const cubeTexturesLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTexturesLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/* mesh */
/* MeshBasicMaterial */
const material = new THREE.MeshBasicMaterial({ })
material.map = doorColorTexture  //material.color.set("#ff0000")/material.color=new THREE.Color("red")  //第二种方法
// material.opacity = .5 ; material.transparent = true //透明度的改变
material.alphaMap = doorAlphaTexture;    //alphaMap的应用 观察plane  隐藏alpha图中的黑色
material.aoMap = doorAmbientOcclusionTexture;       //aoMap添加深度纹理 配合ao贴图纹理(AmbientOcclusion)
material.aoMapIntensity = 1
material.side = THREE.DoubleSide                    //设置双面 对gpu有部分压力  THREE.FrontSide/THREE.BackSide/THREE.DoubleSide
material.transparent = true
// gui.add(material,'displacementScale',0,10,0.001)         //设置高度信息的贴图显示程度
gui.add(material,'aoMapIntensity',0,10,0.001)         //设置aoMap纹理贴图显示程度

/* MeshNormalMaterial */ //--对光照的信息处理更好
const normalMaterial = new THREE.MeshNormalMaterial({ map: doorColorTexture })
// normalMaterial.flatShading = true   //定义材质是否使用平面着色进行渲染。默认值为false(在有弧度的形状中观察)
normalMaterial.wireframe = true

/* MeshMatcapMaterial */    //由一个材质捕捉（MatCap，或光照球（Lit Sphere））纹理所定义，其编码了材质的颜色与明暗。
const meshMatcapMaterial = new THREE.MeshMatcapMaterial()   //---没有光照模拟光照 这个材质带有这些信息 用图片贴图好像每个方向它都在正面朝向你
meshMatcapMaterial.matcap = matcapsTexture

/* MeshDepthMaterial */     //---深度基于相机远近平面。白色最近，黑色最远。
const meshDepthMaterial = new THREE.MeshDepthMaterial()

/* MeshLambertMaterial */   //--- 一种非光泽表面的材质，没有镜面高光。性能更好 对light有反应无高光
const meshLambertMaterial = new THREE.MeshLambertMaterial()

/* MeshPhongMaterial */     //--- 一种用于具有镜面高光的光泽表面的材质。对light有反应有高光
const meshPhongMaterial = new THREE.MeshPhongMaterial() 
meshPhongMaterial.shininess = 1000                              //设置高光反射的程度
meshPhongMaterial.specular = new THREE.Color(0xff0000)          //设置高光反射的的颜色

/* MeshToonMaterial */  //--一种实现卡通着色的材质。
const meshToonMaterial = new THREE.MeshToonMaterial()        
meshToonMaterial.gradientMap = gradientTexture

/* meshStandardMaterial */  //--一种基于物理的标准材质，使用Metallic-Roughness工作流程 --基于物理的渲染（PBR）
                            //比MeshLambertMaterial 或MeshPhongMaterial 更精确和逼真的结果
const meshStandardMaterial = new THREE.MeshStandardMaterial()      
// meshStandardMaterial.map = doorColorTexture  //meshStandardMaterial.color.set("#ff0000")/meshStandardMaterial.color=new THREE.Color("red")  //第二种方法
// meshStandardMaterial.opacity = .5 ; meshStandardMaterial.transparent = true //透明度的改变
// meshStandardMaterial.alphaMap = doorAlphaTexture;    //alphaMap的应用 观察plane  隐藏alpha图中的黑色
// meshStandardMaterial.aoMap = doorAmbientOcclusionTexture;       //aoMap添加深度纹理 配合ao贴图纹理(AmbientOcclusion)
// meshStandardMaterial.aoMapIntensity = 1
// meshStandardMaterial.displacementMap = doorHeightTexture   
// meshStandardMaterial.displacementScale = 0.05               //带有高度信息的贴图
// meshStandardMaterial.metalnessMap = doorMetalnessTexture    //金属贴图应用
// meshStandardMaterial.roughnessMap = doorRoughnessTexture    //粗糙度贴图应用
// meshStandardMaterial.normalMap = doorNormalTexture
// meshStandardMaterial.side = THREE.DoubleSide                    //设置双面 对gpu有部分压力  THREE.FrontSide/THREE.BackSide/THREE.DoubleSide
// meshStandardMaterial.transparent = true
meshStandardMaterial.metalness = 0.7
meshStandardMaterial.roughness = 0.2
meshStandardMaterial.envMap = environmentMapTexture
gui.add(meshStandardMaterial,'displacementScale',0,10,0.0001)            //设置金属度
gui.add(meshStandardMaterial,'metalness',0,1,0.0001)            //设置金属度
gui.add(meshStandardMaterial,'roughness',0,1,0.0001)            //设置粗糙度

const sphereStandard = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), meshStandardMaterial)               //圆环
const planeStandard = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), meshStandardMaterial)               //圆环
const torusToon = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 16, 32), meshToonMaterial)               //圆环
const torusPhong = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 16, 32), meshPhongMaterial)               //圆环
const torusLambert = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 16, 32), meshLambertMaterial)               //圆环
const torusDepth = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 16, 32), meshDepthMaterial)               //圆环
const sphereMatcap = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), meshMatcapMaterial)           //圆
const sphereNormal = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), normalMaterial)           //圆
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)                   //圆
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)                             //平面
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 16, 32), material)               //圆环
sphere.position.x = 1.5
torus.position.x = -1.5
sphereNormal.position.y = 1.5
sphereMatcap.position.set(1.5, 1.5)
torusDepth.position.set(-1.5, 1.5)
torusLambert.position.set(-1.5, -1.5)
torusPhong.position.set(0, -1.5)
torusToon.position.set(1.5, -1.5)
planeStandard.position.set(0, 3)
sphereStandard.position.set(-1.5, 3)

plane.geometry.setAttribute('uv2',new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))
sphere.geometry.setAttribute('uv2',new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2))
torus.geometry.setAttribute('uv2',new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2))

scene.add(sphere, plane, torus, sphereNormal, sphereMatcap, torusDepth,torusLambert,torusPhong,torusToon,planeStandard,sphereStandard)
const allMeshs = [sphere, plane, torus, sphereNormal, sphereMatcap, torusDepth,torusLambert,torusPhong,torusToon,planeStandard,sphereStandard]


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

/* Lights */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2, 4, 5)
scene.add(pointLight)
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

    /* Update Object */
    allMeshs.forEach((mesh) => {
        mesh.rotation.x = 0.1 * elapsedTime
        mesh.rotation.y = 0.15 * elapsedTime
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()



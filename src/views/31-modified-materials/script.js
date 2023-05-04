import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

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
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 1
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
 * Material
 */

// Textures
const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg')
mapTexture.encoding = THREE.sRGBEncoding

const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg')

// plane for shadow
const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(15,15,15),new THREE.MeshStandardMaterial())
planeMesh.position.x = -2
planeMesh.position.y = -5
planeMesh.position.z = 5
planeMesh.rotation.y = Math.PI
scene.add(planeMesh)

const customUniforms = {
    uTime : {value : 0},
};
// Material

const depthMaterial = new THREE.MeshDepthMaterial({         //在模型中应用depthMaterial 替换他的默认的 好让我们能够改变shadow
    depthPacking:THREE.RGBADepthPacking         // 收到更高的精度 保存更多的数据
})

const material = new THREE.MeshStandardMaterial( {
    map: mapTexture,
    normalMap: normalTexture
})

material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = customUniforms.uTime
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>                        //在shaderChunk中可以找到
            uniform float uTime;
            mat2 get2dRotateMatrix(float _angle) {                                     // https://thebookofshaders.com/08/   mat2 rotate2d
                return mat2(cos(_angle) , -sin(_angle) , sin(_angle) , cos(_angle));        
            }
        `
    )

    // core shadow（阴影在自身上的的映射）  是在自身默认的材料上更改--uv控制法线    --beginnormal_vertex
    shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
        #include <beginnormal_vertex>

        float angle = (position.y + uTime) *0.5 ;
        mat2 rotationMatrix = get2dRotateMatrix(angle);
        objectNormal.xz = rotationMatrix * objectNormal.xz;
            
        `
    )

    shader.vertexShader = shader.vertexShader.replace(         //#include <begin_vertex>'  在main函数内
        '#include <begin_vertex>',
        `
            #include <begin_vertex>              //在shaderChunk中可以找到  vec3 transformed = vec3( position );

            // float angle = (position.y + uTime) *0.5 ;                //注意语法错误 有时复制时会在一个glsl重复 定义
            // mat2 rotationMatrix = get2dRotateMatrix(angle);
            transformed.xz = rotationMatrix * transformed.xz;

        `
    )
}

//drop shadow（阴影在其他物体的映射）的修复  和在上面定义的 默认材料操作一致
depthMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = customUniforms.uTime
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>                        //在shaderChunk中可以找到
            uniform float uTime;
            mat2 get2dRotateMatrix(float _angle) {                                     // https://thebookofshaders.com/08/   mat2 rotate2d
                return mat2(cos(_angle) , -sin(_angle) , sin(_angle) , cos(_angle));        
            }
        `
    )

    shader.vertexShader = shader.vertexShader.replace(         //#include <begin_vertex>'  在main函数内
        '#include <begin_vertex>',
        `
            #include <begin_vertex>              //在shaderChunk中可以找到  vec3 transformed = vec3( position );

            float angle = (position.y + uTime) *0.5 ;
            mat2 rotationMatrix = get2dRotateMatrix(angle);
            transformed.xz = rotationMatrix * transformed.xz;

        `
    )
}

/**
 * Models
 */
gltfLoader.load(
    '/models/LeePerrySmith/LeePerrySmith.glb',
    (gltf) =>
    {
        // Model
        const mesh = gltf.scene.children[0]
        mesh.rotation.y = Math.PI * 0.5
        mesh.material = material
        mesh.customDepthMaterial = depthMaterial        // depthMaterial的hook中
        scene.add(mesh)

        // Update materials
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
directionalLight.position.set(0.25, 2, - 2.25)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // update uniform
    customUniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
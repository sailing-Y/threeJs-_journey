import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { mergeBufferGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import Stats from 'stats.js'

// https://github.com/mrdoob/stats.js
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const displacementTexture = textureLoader.load('/textures/displacementMap.png')

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
camera.position.set(2, 2, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: 'high-performance',
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * Test meshes
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial()
)
cube.castShadow = true
cube.receiveShadow = true
cube.position.set(- 5, 0, 0)
scene.add(cube)

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
    new THREE.MeshStandardMaterial()
)
torusKnot.castShadow = true
torusKnot.receiveShadow = true
scene.add(torusKnot)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
)
sphere.position.set(5, 0, 0)
sphere.castShadow = true
sphere.receiveShadow = true
scene.add(sphere)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial()
)
floor.position.set(0, - 2, 0)
floor.rotation.x = - Math.PI * 0.5
floor.castShadow = true
floor.receiveShadow = true
scene.add(floor)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, 2.25)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    stats.begin();
    const elapsedTime = clock.getElapsedTime()

    // Update test mesh
    torusKnot.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()
    

	// monitored code goes here


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
	stats.end();

}

tick()

// 1.stats.js 记录/监控帧率等信息
// 2.https://gist.github.com/brunosimon/c15e7451a802fa8e34c0678620022f7d  -- 解除chrome的帧率限制
// 3.chrome插件 Spector.js可记录 描绘信息

/**
 * Tips
 */

// // Tip 4
// console.log(renderer.info)       //查看renderer信息

// 5. 良好的js编码 

// // Tip 6 dispose
// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()

// 7.避免灯光的使用 性能一般  尽量用性能还行的光 环境光 平行光 半球光
// 8.避免 添加/移除灯光 快速移动灯光
// 9.避免阴影 可以bake shadow 烘培/模拟阴影
// // Tip 10    使用光照时 优化阴影贴图 借助canmerHelper
// directionalLight.shadow.camera.top = 3
// directionalLight.shadow.camera.right = 6
// directionalLight.shadow.camera.left = - 6
// directionalLight.shadow.camera.bottom = - 3
// directionalLight.shadow.camera.far = 10
// directionalLight.shadow.mapSize.set(1024, 1024)

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(cameraHelper)

// // Tip 11    明智的使用投射阴影 接收阴影
// cube.castShadow = true
// cube.receiveShadow = false

// torusKnot.castShadow = true
// torusKnot.receiveShadow = false

// sphere.castShadow = true
// sphere.receiveShadow = false

// floor.castShadow = false
// floor.receiveShadow = true

// // Tip 12    autoUpdate = false autoUpdate 有时不需要在每一帧都更新 shadow
// renderer.shadowMap.autoUpdate = false
// renderer.shadowMap.needsUpdate = true

// 13.调整纹理 texture -- gpu memory
// 14.分辨率纹理 保持2的幂次方
// 15.图片的格式 jpg/png gpeg  可以用tinyPng 在书签里
// 16.用bufferGeometry  一般都有默认的图形和buffer图形
// 17.不要更新顶点 特别是在tick函数

// // Tip 18/19        mutualize geometry       合并几何体一次渲染就能出 可以用blender合并 或者 bufferGeometryUtils 但是不能随意操作某一个 tip22可解决

// const geometries = []
// //创造一次 
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
// const material = new THREE.MeshNormalMaterial()
// for(let i = 0; i < 50; i++)
// {   

//     geometry.translate(
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10
//     )
//     geometry.rotateX((Math.random() - 0.5) * Math.PI * 2)
//     geometry.rotateY((Math.random() - 0.5) * Math.PI * 2)
//     geometries.push(geometry)
// }
// const mergeGeometry = mergeBufferGeometries(geometries)
// //多次使用
// const mesh = new THREE.Mesh(mergeGeometry, material)
// scene.add(mesh)


// // Tip 19 
//     const material = new THREE.MeshNormalMaterial()
//     const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
// for(let i = 0; i < 50; i++)
// {
//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// // Tip 20    mutualize material
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    
// for(let i = 0; i < 50; i++)
// {
//     const material = new THREE.MeshNormalMaterial()

//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// // Tip 22
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const material = new THREE.MeshNormalMaterial()
const mesh = new THREE.InstancedMesh(geometry, material, 50)        //InstancedMesh

mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)                //如果要在每一帧更新InstancedMesh 加上这个


scene.add(mesh)
for(let i = 0; i < 50; i++)
{
    //通过 改变矩阵来改变某一个的位置
    const matrix = new THREE.Matrix4()

    const quaternion = new THREE.Quaternion()               //设置旋转位置
    quaternion.setFromEuler(new THREE.Euler(
        (Math.random() - 0.5) * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI * 2,
        0
    ))
    matrix.makeRotationFromQuaternion(quaternion)           //应用旋转到矩阵

    const position = new THREE.Vector3(                     //设置位置信息
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    )
    matrix.setPosition(position)                            //应用位置信息
    mesh.setMatrixAt(i , matrix)

 
}

// 23.low polygons 如果要更多的细节用normalMap
// 24.draco compression -- draco压缩        一开始要draco库 并解压 可能一开始慢一点但是文件会很轻
// 25.gzip  服务端压缩 对于glb gltf obj etc这种文件操作

// 26.camera 稍微降低视野 可以提升部分性能
// 27.包括调整 near/far


// 28.Pixel Ratio
// // Tip 29
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// PixelRatio = renderer.getPixelRatio()

// 30.high-performance  -- 用较好的gpu 如果没有帧率问题就别用了
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//     powerPreference: 'high-performance',
//     antialias: true
// })

// passes 对性能也不怎么好用的话可以merge他们
// // Tip 31, 32, 34 and 35 
const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256)

const shaderMaterial = new THREE.ShaderMaterial({
    precision: 'lowp',      //低精度
    uniforms:
    {
        uDisplacementTexture: { value: displacementTexture }
        // uDisplacementStrength: { value: 1.5 }        //设置常量 少uniform可提升部分性能
    },
    defines : {
        uDisplacementStrength : 1.5                     //或者在threejs中 设置常量
    },
    vertexShader: `
        // #define uDisplacementStrength 1.5
        // uniform float uDisplacementStrength;         //设置常量

        uniform sampler2D uDisplacementTexture;

        varying vec2 vUv;

        void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;
            if(elevation < 0.5)
            {
                elevation = 0.5;
            }

            modelPosition.y += elevation * uDisplacementStrength;

            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D uDisplacementTexture;

        varying vec2 vUv;

        void main()                                                             //尽量在 vertexShader中进行计算 对性能来说较好
        {
            float elevation = texture2D(uDisplacementTexture, vUv).r;
            if(elevation < 0.25)
            {
                elevation = 0.25;
            }

            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            // vec3 finalColor = vec3(0.0);
            // finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
            // finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
            // finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;
            vec3 finalColor = mix(depthColor , surfaceColor , elevation);       //善用函数

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
})

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
shaderMesh.rotation.x = - Math.PI * 0.5
scene.add(shaderMesh)
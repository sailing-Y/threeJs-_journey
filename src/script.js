import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

// import performance_tips from './views/cesium_hello/index.html'
// console.log(performance_tips);
/**
 * Debug
 */
const gui = new dat.GUI()

const pathMap = {
    12:'./views/12-materials/index.html',
    13:'./views/13-3d-text/index.html',
    17:'./views/17-haunted-house/index.html',
    19:'./views/19-galaxy-generator/index.html',
    22:'./views/22-physics/index.html',
    23:'./views/23-imported-models/index.html',
    25:'./views/25-realistic-render/index.html',
    27:'./views/27-myShaders/index.html',
    28:'./views/28-shader-patterns/index.html',
    29:'./views/29-raging-sea/index.html',
    30:'./views/30-animated-galaxy/index.html',
    31:'./views/31-modified-materials/index.html',
    32:'./views/32-post-processing/index.html',
    33:'./views/33-performance-tips/index.html',
    34:'./views/cesium_hello/index.html',
    

    
    test:'./views/test/index.html',
    
}

const parameters = {
    materialColor: '#ffeded'
}

gui.addColor(parameters, 'materialColor').onChange(() => {
    meshMaterial.color.set(parameters.materialColor)
    particlesMaterial.color.set(parameters.materialColor)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
// const gradient3Texture = textureLoader.load('/textures/gradients/3.jpg')
const gradient3Texture = textureLoader.load('/textures/gradients/5.jpg')

gradient3Texture.magFilter = THREE.NearestFilter
/**
 * Mesh
 */
const objectDistance = 4
const meshMaterial = new THREE.MeshToonMaterial({       //基于光照的颜色
    color: parameters.materialColor,
    gradientMap: gradient3Texture,
})
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    meshMaterial
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    meshMaterial
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    meshMaterial
)

mesh1.position.y =-objectDistance * 0
mesh2.position.y =-objectDistance * 1
mesh3.position.y =-objectDistance * 2
mesh1.position.x = 1.5
mesh2.position.x = -1.5
mesh3.position.x = 1.5

scene.add(mesh1, mesh2, mesh3)
const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * 粒子 (让添加深度信息 让用户体验更强)
 */
 let particlesGeometry = null
 let particlesMaterial = null
 let particles = null
const particlesParams = {
    count : 500,
}
const createparticles = () => {
    if (particles) {
        particlesGeometry.dispose()
        particlesMaterial.dispose()
        // point.dispose()  poont是geometry/material 结合的并不再内存中
        scene.remove(particles)
    }


    const positions = new Float32Array(particlesParams.count * 3)
    for (let i = 0; i < particlesParams.count; i++) {
        const i3 = i*3
        positions[i3+0] = (Math.random()-0.5) *10
        positions[i3+1] = objectDistance*0.5 -  Math.random()*  objectDistance*sectionMeshes.length
        positions[i3+2] = (Math.random()-0.5) *10
    }
    particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
    particlesMaterial = new THREE.PointsMaterial({
        color:parameters.materialColor,
        size:0.03,
        sizeAttenuation:true,
    })
    particles = new THREE.Points(particlesGeometry,particlesMaterial)
    scene.add(particles)
}
createparticles()
gui.add(particlesParams,"count",200,2000,20).onChange(createparticles)

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
 * Light
 */
const directionLight = new THREE.DirectionalLight("#ffffff", 1)
directionLight.position.set(1, 1, 0)
scene.add(directionLight)

/**
 * Camera
 */
const cameraGroup = new THREE.Group()
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6

cameraGroup.add(camera)
scene.add(cameraGroup)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,         //可通过setClearAlpha设置alphaMap的程度
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//滑动监听
let scrollY = window.scrollY
let currentSection = 0 
window.addEventListener('scroll',() => {
    scrollY=window.scrollY

    //
    const newSection = Math.round(scrollY/sizes.height)  
    if(newSection !== currentSection) {
        currentSection = newSection
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration:1.5,
                ease:"power2.inOut",
                x:"+=6",
                y:"+=3"
            }
        )
    }
})
//鼠标监听
const cursor = new THREE.Vector2()      //储存二位坐标
cursor.x = 0 
cursor.y = 0
window.addEventListener('mousemove' ,(event) => {
    cursor.x = event.clientX    / sizes.width - 0.5
    cursor.y = event.clientY    / sizes.height - 0.5
    
})
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0        //使高频率的屏幕 效果相同

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime-previousTime      //这个时间在各个频率的屏幕是相同的
    previousTime = elapsedTime
    console.log();
    //相机跟随滑动变化
    camera.position.y = -scrollY / sizes.height * objectDistance
    //相机跟随鼠标变化      //但会影响相机跟随滑动变化  -- 创建一个Group操作group 
    const parallaxX = cursor.x  *0.5
    const parallaxY =- cursor.y *0.5
    // cameraGroup.position.x = parallaxX
    // cameraGroup.position.y = parallaxY
    // cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.02       //使滑动更加平滑 easeing
    // cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.02
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) *5*deltaTime       //使滑动更加平滑 easeing 并使高频率的屏幕 效果相同
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) *5*deltaTime
    // meshes动画
    for (const mesh of sectionMeshes) {
        // mesh.rotation.x = elapsedTime *.5
        // mesh.rotation.y = elapsedTime *.5
        mesh.rotation.x += deltaTime *0.1
        mesh.rotation.y += deltaTime *0.12
    }
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


const sectionDom = document.getElementsByClassName("projectA")

for (let i = 0; i < sectionDom.length; i++) {
    sectionDom[i].addEventListener('click' , (event) => {
        const index = event.target.getAttribute('projectIndex') ;
        if(pathMap[index]) {
            location.href = pathMap[index]
        }
    })
}
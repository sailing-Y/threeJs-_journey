import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 250,
})
gui.close()
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


const textureLoader = new THREE.TextureLoader()
const startTexture = textureLoader.load('/textures/kenney_particle-pack/PNG (Transparent)/circle_02.png')
const plantTexture0 = textureLoader.load('/textures/kenney_planets/Planets/planet00.png')
const plantTexture1 = textureLoader.load('/textures/kenney_planets/Planets/planet01.png')
const plantTexture2 = textureLoader.load('/textures/kenney_planets/Planets/planet02.png')
const plantTexture3 = textureLoader.load('/textures/kenney_planets/Planets/planet03.png')
const plantTexture4 = textureLoader.load('/textures/kenney_planets/Planets/planet04.png')
const plantTexture5 = textureLoader.load('/textures/kenney_planets/Planets/planet05.png')
const plantTexture6 = textureLoader.load('/textures/kenney_planets/Planets/planet06.png')
const plantTexture7 = textureLoader.load('/textures/kenney_planets/Planets/planet07.png')
const plantTexture8 = textureLoader.load('/textures/kenney_planets/Planets/planet08.png')
const plantTexture9 = textureLoader.load('/textures/kenney_planets/Planets/planet09.png')
const plantTextureMap = {
    plantTexture0,plantTexture1,plantTexture2,plantTexture3,plantTexture4,plantTexture5,plantTexture6,plantTexture7,plantTexture8,plantTexture9
}

/* Particles */
// const particlesGeometry = new THREE.SphereBufferGeometry()
const creatParticles_class1 = () => {
    const params = {
        count: 5000
    }
    let count = params.count
    const particlesGeometry = new THREE.BufferGeometry()
    const position = new Float32Array(count * 3)
    const colorArray = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
        position[i] = (Math.random() - 0.5) * 10
        colorArray[i] = Math.random()
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true,             //指定点的大小是否因相机深度而衰减。（仅限透视摄像头。）默认为true。
        // map:startTexture,
        alphaMap: startTexture,          //alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。 默认值为null。
        alphaTest: 0.001,                //设置运行alphaTest时要使用的alpha值。如果不透明度低于此值，则不会渲染材质。默认值为0。
        transparent: true,
        // depthTest:false,             //是否在渲染此材质时启用深度测试。默认为 true。
        depthWrite: false,                //渲染此材质是否对深度缓冲区(depthbuffer)有任何影响。默认为true。
        vertexColors: true,
        blending: THREE.AdditiveBlending
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)
    //动画
    const clock = new THREE.Clock()
    const tick = () => {
        const elapsedTime = clock.getElapsedTime()

        // particles.rotation.y = elapsedTime*0.2
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const x = particlesGeometry.attributes.position.array[i3]
            particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        }
        particlesGeometry.attributes.position.needsUpdate = true

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
}

let geometry = null
let material = null
let point = null
const parameters = {
    count: 10000,
    size: 0.02,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower:3,
    insideColor:"#ff6030",
    outsideColor:"#1b3984"
}

const creatParticles_class2 = () => {
    if (point) {
        geometry.dispose()
        material.dispose()
        // point.dispose()  poont是geometry/material 结合的并不再内存中
        scene.remove(point)
    }


    let count = parameters.count

    geometry = new THREE.BufferGeometry()
    const position = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    //mix两个color
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)
    //0.5是两个比例同时混合
    colorInside.lerp(colorOutside,0.5)      //将该颜色的RGB值线性插值到传入参数的RGB值。alpha参数可以被认为是两种颜色之间的比例值，其中0是当前颜色和1.0是第一个参数的颜色。

    for (let i = 0; i < count; i++) {
        const i3 = i * 3

        const radius = Math.random() * parameters.radius
        const brancheAngle = (i % parameters.branches) / parameters.branches * 2 * Math.PI
        const spinAngle = radius * parameters.spin


        const randomX = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() > 0.5 ? 1:-1)
        const randomY = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() > 0.5 ? 1:-1)
        const randomZ = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() > 0.5 ? 1:-1)

        position[i3 + 0] = Math.cos(brancheAngle + spinAngle) * radius + randomX
        position[i3 + 1] = randomY
        position[i3 + 2] = Math.sin(brancheAngle + spinAngle) * radius + randomZ

    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside,radius/parameters.radius)
        //color
        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({
        alphaMap:plantTexture0,
        alphaTest: 0.001,                //设置运行alphaTest时要使用的alpha值。如果不透明度低于此值，则不会渲染材质。默认值为0。
        transparent: true,
        depthWrite: false,                //渲染此材质是否对深度缓冲区(depthbuffer)有任何影响。默认为true。
        vertexColors: true,
        size: parameters.size*(1),
        sizeAttenuation: true,          //指定点的大小是否因相机深度而衰减。（仅限透视摄像头。）默认为true。
        depthWrite: true,
        blending: THREE.AdditiveBlending,
        vertexColors:true,               //是否使用顶点着色。默认值为false。 此引擎支持RGB或者RGBA两种顶点颜色，取决于缓冲 attribute 使用的是三分量（RGB）还是四分量（RGBA）。
        
    })
    point = new THREE.Points(geometry, material)
    scene.add(point)
}
//性能消耗高时 可以用onFinnishChange
gui.add(parameters, 'count', 100, 100000, 100).onChange(creatParticles_class2)
gui.add(parameters, 'size', 0.001, 0.05, 0.001).onChange(creatParticles_class2)
gui.add(parameters, 'radius', 0.01, 50, 0.01).onChange(creatParticles_class2)
gui.add(parameters, 'branches', 2, 10, 2).onChange(creatParticles_class2)
gui.add(parameters, 'spin', -5, 5,  0.01).onChange(creatParticles_class2)
gui.add(parameters, 'randomness', 0, 2, 0.001).onChange(creatParticles_class2)
gui.add(parameters, 'randomnessPower', 1, 10, 0.001).onChange(creatParticles_class2)
gui.addColor(parameters, 'insideColor').onChange(creatParticles_class2)
gui.addColor(parameters, 'outsideColor').onChange(creatParticles_class2)

// creatParticles_class1()     //第一个 粒子效果
creatParticles_class2()     //第二个 粒子效果

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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


    point.rotation.y = elapsedTime*0.2      //星系旋转
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
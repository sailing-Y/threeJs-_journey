import * as THREE from 'three'
import doorLight from '../Lights/doorLight'
import texturesLoader from './textureLoader'

//doorTextures
const doorTexture = texturesLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = texturesLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = texturesLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = texturesLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = texturesLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = texturesLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = texturesLoader.load('/textures/door/roughness.jpg');

//wallTextures
const bricksColorTexture = texturesLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = texturesLoader.load('/textures/bricks/ambientOcclusion.jpg.jpg')
const bricksNormalTexture = texturesLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = texturesLoader.load('/textures/bricks/roughness.jpg')


const house = new THREE.Group()

/* walls */
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ 
        map:bricksColorTexture,
        aoMap:bricksAmbientOcclusionTexture,
        normalMap:bricksNormalTexture,
        roughnessMap:bricksRoughnessTexture
     })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.castShadow = true

walls.position.y = 2.5 / 2  
house.add(walls)

/* roof */
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)


const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2,100,100),
    new THREE.MeshStandardMaterial({
        map: doorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,  //高度信息displacementMap需要更多的顶点
        displacementScale:0.1,               //高度缩放
        normalMap:doorNormalTexture,         //边框深度
        metalnessMap:doorMetalnessTexture,
        roughnessMap:doorRoughnessTexture,




    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))

door.position.z = 2.01
door.position.y = 2 / 2
house.add(door)

house.add(doorLight)


export default house
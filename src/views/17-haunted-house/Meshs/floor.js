import * as THREE from 'three'
import texturesLoader from './textureLoader'


const grassColorTexture = texturesLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = texturesLoader.load('/textures/grass/ambientOcclusion.jpg.jpg')
const grassNormalTexture = texturesLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = texturesLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8,8)
grassAmbientOcclusionTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping



const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map:grassColorTexture,
        aoMap:grassAmbientOcclusionTexture,
        normalMap:grassNormalTexture,
        roughnessMap:grassRoughnessTexture
     })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow = true
export default floor
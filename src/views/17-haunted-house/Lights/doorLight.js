import * as THREE from 'three'
const doorLightColor = '#ff7d46'
// Ambient light
const doorLight = new THREE.PointLight(doorLightColor, 1,7)
doorLight.position.set(0, 2.2, 2.7)


doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

export default doorLight
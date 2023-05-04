import * as THREE from 'three'
const moonLightColor = '#b9d5ff'
// Ambient light
const moonLight = new THREE.DirectionalLight(moonLightColor, 0.2)
moonLight.position.set(4, 5, - 2)

moonLight.castShadow = true

export default moonLight
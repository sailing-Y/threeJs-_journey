import * as THREE from 'three'

const ghostLight = new THREE.Group()

const ghostLightColor = '#9ab170'
// Ambient light
const ghostLight1 = new THREE.PointLight(ghostLightColor, 3, 3)
const ghostLight2 = new THREE.PointLight(ghostLightColor, 1, 3)
const ghostLight3 = new THREE.PointLight(ghostLightColor, 2, 3)

ghostLight1.shadow.mapSize.width = 256
ghostLight1.shadow.mapSize.height = 256
ghostLight1.shadow.camera.far = 7

ghostLight2.shadow.mapSize.width = 256
ghostLight2.shadow.mapSize.height = 256
ghostLight2.shadow.camera.far = 7


ghostLight3.shadow.mapSize.width = 256
ghostLight3.shadow.mapSize.height = 256
ghostLight3.shadow.camera.far = 7



ghostLight.add(ghostLight1, ghostLight2, ghostLight3)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const ghostAngle = elapsedTime*.5
    ghostLight1.position.x = Math.cos(ghostAngle) * 4   //半径
    ghostLight1.position.z = Math.sin(ghostAngle) * 4   //半径
    ghostLight1.position.z = Math.sin(elapsedTime*3)    //高度

    ghostLight2.position.x = Math.cos(ghostAngle) * 4
    ghostLight2.position.z = Math.sin(ghostAngle) * 4
    ghostLight2.position.z = Math.sin(elapsedTime*3) + Math.sin(elapsedTime*2.5)

    ghostLight3.position.x = Math.cos(ghostAngle) * (7+Math.sin(elapsedTime*0.32))  
    ghostLight3.position.z = Math.sin(ghostAngle) * (7+Math.sin(elapsedTime*0.5))
    ghostLight3.position.z = Math.sin(elapsedTime*5) + Math.sin(elapsedTime*2)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
}

tick()


ghostLight.castShadow = true

export default ghostLight
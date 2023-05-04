import * as THREE from 'three'
const graves = new THREE.Group()

const graveGeometry  = new THREE.BoxBufferGeometry(.6,.8,.2)
const graveMaterial = new THREE.MeshStandardMaterial({color:'#b2b6b1'})

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * 2* Math.PI
    const radius = 3+ Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry,graveMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.y = (Math.random() -0.5) *0.4
    grave.rotation.z = (Math.random() -0.5) *0.4
    grave.castShadow = true
    graves.add(grave)
}

export default graves
import * as THREE from 'three'

const bush = new THREE.Group()
/* 灌木丛bushes */
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })


const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)

bush1.scale.set(.5,.5,.5)
bush1.position.set(.8,.2,2.2)

bush2.scale.set(.25,.25,.25)
bush2.position.set(1.4,.1,2.1)

bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.1,2.2)

bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)

bush.add(bush1,bush2,bush3,bush4)
export default bush
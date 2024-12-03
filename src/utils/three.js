import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import TWEEN from '@tweenjs/tween.js'

export const initThree = (container) => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

  // Setup
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // Basic lighting
  const ambientLight = new THREE.AmbientLight(0x404040)
  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(10, 10, 10)
  scene.add(ambientLight, pointLight)

  return {
    scene,
    camera,
    renderer,
    controls
  }
}
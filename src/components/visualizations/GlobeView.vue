<template>
    <div class="globe-container" ref="globeContainer">
      <!-- Tooltip for destination details -->
      <div 
        v-if="selectedDestination" 
        class="destination-tooltip"
        :style="{ 
          left: `${tooltipPosition.x}px`, 
          top: `${tooltipPosition.y}px` 
        }"
      >
        <h3>{{ selectedDestination.name }}</h3>
        <p>{{ selectedDestination.description }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import TWEEN from '@tweenjs/tween.js'
  
  // Props
  const props = defineProps({
    destinations: {
      type: Array,
      required: true
    }
  })
  
  // Emits
  const emit = defineEmits(['select'])
  
  // Refs
  const globeContainer = ref(null)
  const selectedDestination = ref(null)
  const tooltipPosition = ref({ x: 0, y: 0 })
  
  // Three.js scene setup
  let scene, camera, renderer, controls, globe, raycaster, mouse
  
  // Initialize Three.js scene
  function initScene() {
    // Create scene
    scene = new THREE.Scene()
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 2.5
  
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    globeContainer.value.appendChild(renderer.domElement)
  
    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
  
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040)
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(ambientLight, pointLight)
  
    // Create globe
    createGlobe()
  
    // Add destination markers
    addDestinationMarkers()
  
    // Raycaster for interaction
    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()
  
    // Event listeners
    renderer.domElement.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('click', onMouseClick)
  
    // Animation loop
    animate()
  }
  
  // Create basic globe geometry
  function createGlobe() {
    const geometry = new THREE.SphereGeometry(1, 64, 64)
    const material = new THREE.MeshPhongMaterial({
      color: 0x1e90ff,
      opacity: 0.7,
      transparent: true
    })
    globe = new THREE.Mesh(geometry, material)
    scene.add(globe)
  }
  
  // Add destination markers
  function addDestinationMarkers() {
    props.destinations.forEach(destination => {
      // Convert lat/long to 3D coordinates on the sphere
      const { latitude, longitude } = destination
      const phi = (90 - latitude) * (Math.PI / 180)
      const theta = (longitude + 180) * (Math.PI / 180)
  
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      )
  
      // Position marker on globe surface
      marker.position.set(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      )
  
      // Attach destination data to marker
      marker.userData = destination
  
      scene.add(marker)
    })
  }
  
  // Mouse move handler for hover effects
  function onMouseMove(event) {
    // Calculate mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  
    // Update raycaster
    raycaster.setFromCamera(mouse, camera)
  
    // Check for intersections
    const intersects = raycaster.intersectObjects(scene.children)
    
    // Find destination marker
    const destinationMarker = intersects.find(
      intersect => intersect.object.userData && intersect.object.type === 'Mesh'
    )
  
    if (destinationMarker) {
      selectedDestination.value = destinationMarker.object.userData
      tooltipPosition.value = { x: event.clientX, y: event.clientY }
    } else {
      selectedDestination.value = null
    }
  }
  
  // Click handler for destination selection
  function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  
    raycaster.setFromCamera(mouse, camera)
  
    const intersects = raycaster.intersectObjects(scene.children)
    
    const destinationMarker = intersects.find(
      intersect => intersect.object.userData && intersect.object.type === 'Mesh'
    )
  
    if (destinationMarker) {
      emit('select', destinationMarker.object.userData)
    }
  }
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate)
    
    // Rotate globe slowly
    if (globe) {
      globe.rotation.y += 0.001
    }
  
    // Update controls
    controls.update()
  
    // Render scene
    renderer.render(scene, camera)
  }
  
  // Handle window resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  
  // Lifecycle hooks
  onMounted(() => {
    nextTick(() => {
      initScene()
      window.addEventListener('resize', onWindowResize)
    })
  })
  
  onUnmounted(() => {
    // Clean up event listeners and Three.js resources
    if (renderer) {
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('click', onMouseClick)
      window.removeEventListener('resize', onWindowResize)
      renderer.dispose()
    }
  })
  </script>
  
  <style scoped>
  .globe-container {
    position: relative;
    width: 100%;
    height: 100vh;
    background: linear-gradient(to bottom, #1e5799 0%, #7db9e8 100%);
  }
  
  .destination-tooltip {
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px;
    border-radius: 5px;
    pointer-events: none;
    transform: translate(-50%, -100%);
    max-width: 250px;
    z-index: 100;
  }
  </style>
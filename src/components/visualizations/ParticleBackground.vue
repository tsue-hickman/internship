<template>
    <div class="particle-background" ref="containerRef"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  // Configuration options for particle background
  const props = defineProps({
    particleCount: {
      type: Number,
      default: 100
    },
    connectionDistance: {
      type: Number,
      default: 150
    },
    color: {
      type: String,
      default: '#ffffff'
    }
  })
  
  const containerRef = ref(null)
  let canvas, ctx
  let particles = []
  
  // Particle class
  class Particle {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.radius = Math.random() * 3 + 1
      this.speedX = (Math.random() - 0.5) * 2
      this.speedY = (Math.random() - 0.5) * 2
    }
  
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = props.color
      ctx.fill()
    }
  
    update() {
      this.x += this.speedX
      this.y += this.speedY
  
      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
    }
  }
  
  // Initialize particle system
  function initParticles() {
    // Setup canvas
    canvas = document.createElement('canvas')
    ctx = canvas.getContext('2d')
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.zIndex = '-1'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
  
    // Resize canvas to fill container
    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
  
    // Create particles
    function createParticles() {
      particles = []
      for (let i = 0; i < props.particleCount; i++) {
        particles.push(new Particle(
          Math.random() * canvas.width, 
          Math.random() * canvas.height
        ))
      }
    }
  
    // Connect nearby particles with lines
    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy
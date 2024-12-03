<template>
    <div class="timeline-container">
      <div class="timeline-controls">
        <v-slider
          v-model="currentYear"
          :min="startYear"
          :max="endYear"
          :step="1"
          label="Year"
          @change="updateTimeline"
        ></v-slider>
      </div>
      <div class="timeline-visualization" ref="timelineContainer">
        <div 
          v-for="destination in filteredDestinations" 
          :key="destination.id" 
          class="timeline-destination"
          :style="getDestinationStyle(destination)"
          @click="selectDestination(destination)"
          @mouseenter="hoveredDestination = destination"
          @mouseleave="hoveredDestination = null"
        >
          <div class="destination-marker"></div>
          <div class="destination-details" v-if="hoveredDestination === destination">
            <h3>{{ destination.name }}</h3>
            <p>{{ destination.description }}</p>
            <p>Year Visited: {{ destination.yearVisited }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { gsap } from 'gsap'
  
  // Props
  const props = defineProps({
    destinations: {
      type: Array,
      required: true
    }
  })
  
  // Emits
  const emit = defineEmits(['select'])
  
  // State
  const currentYear = ref(null)
  const hoveredDestination = ref(null)
  const timelineContainer = ref(null)
  
  // Calculate year range
  const startYear = computed(() => 
    Math.min(...props.destinations.map(d => d.yearVisited))
  )
  const endYear = computed(() => 
    Math.max(...props.destinations.map(d => d.yearVisited))
  )
  
  // Initialize current year to the start year
  onMounted(() => {
    currentYear.value = startYear.value
  })
  
  // Filter destinations based on current year
  const filteredDestinations = computed(() => 
    props.destinations.filter(dest => 
      dest.yearVisited <= currentYear.value
    )
  )
  
  // Calculate destination position on timeline
  function getDestinationStyle(destination) {
    // Calculate horizontal position based on year
    const timelineWidth = timelineContainer.value 
      ? timelineContainer.value.clientWidth 
      : 1000
  
    const yearProgress = (destination.yearVisited - startYear.value) / 
                         (endYear.value - startYear.value)
    
    return {
      left: `${yearProgress * 100}%`,
      transform: currentYear.value >= destination.yearVisited 
        ? 'scale(1)' 
        : 'scale(0.5)'
    }
  }
  
  // Update timeline visualization
  function updateTimeline() {
    // Animate destinations
    if (timelineContainer.value) {
      const destinations = timelineContainer.value.querySelectorAll('.timeline-destination')
      destinations.forEach(el => {
        gsap.to(el, {
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    }
  }
  
  // Select destination
  function selectDestination(destination) {
    if (destination.yearVisited <= currentYear.value) {
      emit('select', destination)
    }
  }
  </script>
  
  <style scoped>
  .timeline-container {
    width: 100%;
    height: 500px;
    position: relative;
    background: linear-gradient(to right, #f0f0f0, #e0e0e0);
    padding: 20px;
    box-sizing: border-box;
  }
  
  .timeline-visualization {
    position: relative;
    height: 300px;
    width: 100%;
    border-bottom: 3px solid #333;
    margin-top: 50px;
  }
  
  .timeline-destination {
    position: absolute;
    transform-origin: center;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .destination-marker {
    width: 20px;
    height: 20px;
    background-color: #ff6b6b;
    border-radius: 50%;
    transform: translateX(-50%);
  }
  
  .destination-details {
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    max-width: 250px;
    z-index: 10;
  }
  
  .timeline-controls {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  </style>
<!-- MainContentArea.vue -->
<template>
    <div class="main-content-area" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <h2>Welcome to My App</h2>
      <p>This is the main content area.</p>
      <stats-view />
    </div>
  </template>
  
  <script>
  import StatsView from '@/components/visualizations/StatsView.vue'
  import globeImage from '@/assets/images/globe.webp'
  
  export default {
    name: 'MainContentArea',
    components: {
      StatsView
    },
    props: {
      backgroundImage: {
        type: String,
        required: globeImage
      },
    },
    data() {
      return {
        backgroundImage: this.backgroundImage || globeImage,
      }
    }
  }
  </script>
  
  <style>
  .main-content-area {
    padding: 2rem;
    background-size: cover;
    background-position: center;
    height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  </style>
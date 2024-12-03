<!-- VerticalCarousel.vue -->
<template>
    <div class="vertical-carousel">
      <div 
      class="carousel-item" 
      v-for="(item, index) in items" 
      :key="index"
      @click="handleItemClick(item)">
        <h3>{{ item.title }}</h3>
        <p>{{ item.content }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VerticalCarousel',
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    mounted() {
      this.startCarousel()
    },
    methods: {
      startCarousel() {
        setInterval(() => {
          this.scrollCarousel()
        }, 1300)
      },
      scrollCarousel() {
        const carousel = this.$el
        carousel.scrollBy({
          top: carousel.offsetHeight,
          behavior: 'smooth'
        })
        if (carousel.scrollTop >= carousel.scrollHeight - carousel.offsetHeight) {
          carousel.scrollTop = 0
        }
      }
    }
  }
  </script>
  
  <style>
  .vertical-carousel {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 20%;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .carousel-item {
    padding: 1rem;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    margin-bottom: 1rem;
  }
  </style>
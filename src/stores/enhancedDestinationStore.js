// src/stores/enhancedDestinationStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEnhancedDestinationStore = defineStore('enhancedDestinations', () => {
  const destinations = ref([])
  const favorites = ref([])
  const selectedDestination = ref(null)
  const visualizationMode = ref('table') // 'table', 'globe', 'gallery', 'timeline'
  
  // Enhanced destination structure
  const defaultDestination = {
    id: null,
    name: '',
    type: '',
    description: '',
    createdAt: '',
    latitude: 0,
    longitude: 0,
    image: null,
    visitCount: 0,
    popularity: 0,
    climate: '',
    weather: {},
    travelTime: '',
    distance: '',
    relatedDestinations: [],
    isFavorite: false
  }

  // Computed properties
  const destinationStats = computed(() => {
    return {
      totalDestinations: destinations.value.length,
      popularTypes: getPopularTypes(),
      averagePopularity: calculateAveragePopularity(),
      mostVisited: getMostVisitedDestinations(5)
    }
  })

  // Methods
  function addDestination(destination) {
    destinations.value.push({
      ...defaultDestination,
      ...destination,
      id: `dest_${Date.now()}`
    })
    saveToLocalStorage()
  }

  function updateDestination(id, updates) {
    const index = destinations.value.findIndex(d => d.id === id)
    if (index !== -1) {
      destinations.value[index] = { ...destinations.value[index], ...updates }
      saveToLocalStorage()
    }
  }

  function toggleFavorite(id) {
    const destination = destinations.value.find(d => d.id === id)
    if (destination) {
      destination.isFavorite = !destination.isFavorite
      if (destination.isFavorite) {
        favorites.value.push(destination)
      } else {
        favorites.value = favorites.value.filter(f => f.id !== id)
      }
      saveToLocalStorage()
    }
  }

  function getPopularTypes() {
    const types = {}
    destinations.value.forEach(d => {
      types[d.type] = (types[d.type] || 0) + 1
    })
    return Object.entries(types)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
  }

  function calculateAveragePopularity() {
    if (!destinations.value.length) return 0
    return destinations.value.reduce((acc, d) => acc + d.popularity, 0) / destinations.value.length
  }

  function getMostVisitedDestinations(limit = 5) {
    return [...destinations.value]
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, limit)
  }

  function saveToLocalStorage() {
    localStorage.setItem('enhanced-destinations', JSON.stringify({
      destinations: destinations.value,
      favorites: favorites.value
    }))
  }

  function loadFromLocalStorage() {
    const stored = localStorage.getItem('enhanced-destinations')
    if (stored) {
      const data = JSON.parse(stored)
      destinations.value = data.destinations
      favorites.value = data.favorites
    }
  }

  // Initial load
  loadFromLocalStorage()

  return {
    destinations,
    favorites,
    selectedDestination,
    visualizationMode,
    destinationStats,
    addDestination,
    updateDestination,
    toggleFavorite,
    getPopularTypes,
    getMostVisitedDestinations
  }
})
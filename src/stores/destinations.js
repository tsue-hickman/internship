import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDestinationsStore = defineStore('destinations', () => {
  const destinations = ref([])

  function fetchDestinations() {
    // Initialize with some sample data if needed
    destinations.value = [
      {
        id: 'dest_1',
        name: 'Paris',
        type: 'City',
        description: 'The City of Light',
        createdAt: new Date().toISOString()
      },
      {
        id: 'dest_2',
        name: 'Maldives',
        type: 'Island',
        description: 'Tropical Paradise',
        createdAt: new Date().toISOString()
      }
    ]
  }

  function addDestination(destination) {
    destinations.value.push(destination)
  }

  function updateDestination(updatedDestination) {
    const index = destinations.value.findIndex(d => d.id === updatedDestination.id)
    if (index !== -1) {
      destinations.value[index] = updatedDestination
    }
  }

  function deleteDestination(id) {
    const index = destinations.value.findIndex(d => d.id === id)
    if (index !== -1) {
      destinations.value.splice(index, 1)
    }
  }

  return {
    destinations,
    fetchDestinations,
    addDestination,
    updateDestination,
    deleteDestination
  }
})
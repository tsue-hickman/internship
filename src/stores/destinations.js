import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useDestinationsStore = defineStore('destinations', () => {
  const destinations = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchDestinations() {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('http://localhost:8000/api/v1/destinations/')
      destinations.value = response.data
    } catch (err) {
      error.value = err
      // Fallback to initial sample data if API fails
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
    } finally {
      loading.value = false
    }
  }

  async function addDestination(destination) {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/destinations/', destination)
      destinations.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err
      throw err
    }
  }

  async function updateDestination(updatedDestination) {
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/destinations/${updatedDestination.id}`, updatedDestination)
      const index = destinations.value.findIndex(d => d.id === updatedDestination.id)
      if (index !== -1) {
        destinations.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err
      throw err
    }
  }

  async function deleteDestination(id) {
    try {
      await axios.delete(`http://localhost:8000/api/v1/destinations/${id}`)
      const index = destinations.value.findIndex(d => d.id === id)
      if (index !== -1) {
        destinations.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err
      throw err
    }
  }

  return {
    destinations,
    loading,
    error,
    fetchDestinations,
    addDestination,
    updateDestination,
    deleteDestination
  }
})
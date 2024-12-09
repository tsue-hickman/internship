import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDestinationsStore } from '@/stores/destinations'
import axios from 'axios'

vi.mock('axios')

describe('Destinations Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useDestinationsStore()
    store.destinations = []
    store.loading = false
    store.error = null
  })

  it('fetches destinations successfully', async () => {
    const mockDestinations = [
      { 
        id: 1, 
        name: 'Paris', 
        type: 'City', 
        description: 'The City of Light',
        created_at: new Date().toISOString()
      }
    ]

    axios.get.mockResolvedValue({ data: mockDestinations })

    await store.fetchDestinations()

    expect(store.destinations.length).toBe(1)
    expect(store.destinations[0].name).toBe('Paris')
  })

  it('adds a new destination', async () => {
    const newDestination = { 
      name: 'New York', 
      type: 'City', 
      description: 'The Big Apple' 
    }
    const createdDestination = { 
      id: 2, 
      ...newDestination,
      created_at: new Date().toISOString()
    }

    axios.post.mockResolvedValue({ data: createdDestination })

    const result = await store.addDestination(newDestination)

    expect(store.destinations[store.destinations.length - 1].name).toBe('New York')
    expect(result.id).toBe(2)
  })

  // Other tests remain similar, with minor data structure adjustments
})

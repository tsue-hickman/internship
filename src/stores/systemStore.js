import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSystemStore = defineStore('system', () => {
  // State
  const status = ref('operational') // 'operational', 'maintenance', 'outage'
  const alerts = ref([])
  const lastChecked = ref(null)

  // Getters
  const hasActiveAlerts = computed(() => alerts.value.length > 0)
  const currentStatus = computed(() => status.value)

  // Actions
  const addAlert = alert => {
    alerts.value.push({
      id: Date.now(),
      timestamp: new Date(),
      ...alert,
    })
  }

  const removeAlert = alertId => {
    alerts.value = alerts.value.filter(alert => alert.id !== alertId)
  }

  const checkSystemStatus = async () => {
    try {
      // TODO: Replace with actual API call
      // Simulating API check
      const response = await simulateStatusCheck()
      status.value = response.status
      lastChecked.value = new Date()

      if (response.status !== 'operational') {
        addAlert({
          type: response.status === 'maintenance' ? 'warning' : 'error',
          message: response.message,
        })
      }
    } catch (error) {
      console.error('Failed to check system status:', error)
      status.value = 'outage'
      addAlert({
        type: 'error',
        message: 'Unable to connect to system services',
      })
    }
  }

  // Temporary simulation
  const simulateStatusCheck = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simulate different states (for testing)
    const states = [
      { status: 'operational', message: 'All systems operational' },
      { status: 'maintenance', message: 'Scheduled maintenance in progress' },
      { status: 'outage', message: 'System experiencing issues' },
    ]

    return states[Math.floor(Math.random() * states.length)]
  }

  // Start periodic checks
  const startStatusChecks = () => {
    checkSystemStatus()
    setInterval(checkSystemStatus, 30000) // Check every 30 seconds
  }

  return {
    status,
    alerts,
    lastChecked,
    hasActiveAlerts,
    currentStatus,
    addAlert,
    removeAlert,
    checkSystemStatus,
    startStatusChecks,
  }
})

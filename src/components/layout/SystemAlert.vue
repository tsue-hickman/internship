<template>
  <transition-group name="alert-fade">
    <v-alert
      v-for="alert in systemStore.alerts"
      :key="alert.id"
      :type="alert.type"
      :title="getAlertTitle(alert.type)"
      :text="alert.message"
      density="comfortable"
      variant="tonal"
      closable
      class="system-alert"
      @click:close="systemStore.removeAlert(alert.id)"
    >
      <template v-slot:prepend>
        <v-icon :icon="getAlertIcon(alert.type)" />
      </template>

      <template v-slot:append>
        <span class="alert-time">{{ formatAlertTime(alert.timestamp) }}</span>
      </template>
    </v-alert>
  </transition-group>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSystemStore } from '@/stores/systemStore'
import { format } from 'date-fns'

const systemStore = useSystemStore()

const getAlertTitle = type => {
  switch (type) {
    case 'error':
      return 'System Outage'
    case 'warning':
      return 'System Maintenance'
    default:
      return 'System Notification'
  }
}

const getAlertIcon = type => {
  switch (type) {
    case 'error':
      return 'mdi-alert-circle'
    case 'warning':
      return 'mdi-alert'
    default:
      return 'mdi-information'
  }
}

const formatAlertTime = timestamp => {
  return format(new Date(timestamp), 'HH:mm:ss')
}

onMounted(() => {
  systemStore.startStatusChecks()
})
</script>

<style scoped>
.system-alert {
  margin-bottom: 8px;
}

.alert-time {
  font-size: 0.8em;
  opacity: 0.8;
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>

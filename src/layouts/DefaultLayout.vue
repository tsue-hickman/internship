<template>
  <v-app>
    <!-- App Bar - Always visible -->
    <v-app-bar color="surface" flat>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ currentPageTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- Theme Toggle -->
      <v-btn
        icon="mdi-theme-light-dark"
        size="small"
        @click="toggleTheme"
      ></v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      elevation="2"
      location="left"
      width="300"
      
    >
      <v-list>
        <!-- User Profile Section -->
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :title="user ? user.username : 'Guest User'"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>

        <!-- Navigation Links -->
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
          :subtitle="item.subtitle"
          :active="route.path === item.path"
          @click="drawer = false"
        />
      </v-list>

      <!-- Logout Button -->
      <template v-slot:append>
        <v-divider></v-divider>
        <div class="pa-2">
          <v-btn
            block
            color="primary"
            @click="handleLogout"
            prepend-icon="mdi-logout"
          >
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <!-- Outage Notification -->
      <OutageNotification v-if="showOutage"/>
      
      <!-- Main Content -->
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/auth'
import { useTheme } from 'vuetify'
import OutageNotification from '@/components/OutageNotification.vue'


const theme = useTheme()
const drawer = ref(false)
const router = useRouter()
const route = useRoute()
const { logout, user } = useAuth()

const menuItems = ref([
  { title: 'Home', subtitle: 'Welcome', path: '/', icon: 'mdi-home' },
  { title: 'Profile', subtitle: 'Your information', path: '/profile', icon: 'mdi-account' },
  { title: 'Settings', subtitle: 'App configuration', path: '/settings', icon: 'mdi-cog' },
  { title: 'Monitor', subtitle: 'Watch those charts', path: '/monitor', icon: 'mdi-chart-line' },
  { title: 'Customers', subtitle: 'Manage Customers', path: '/customers', icon: 'mdi-account-group' },
  { title: 'Tasks', subtitle: 'Manage Stuff on GBS', path: '/tasks', icon: 'mdi-clipboard-list' },
  { title: 'Destinations', subtitle: 'Available Destinations', path: '/destinations', icon: 'mdi-map-marker' },
  { title: 'Admin', subtitle: 'Manage Portal', path: '/admin', icon: 'mdi-shield-account' },
])

const currentPageTitle = computed(() => {
  const currentItem = menuItems.value.find(item => item.path === route.path)
  return currentItem ? currentItem.title : 'Dashboard'
})

const showOutage = computed(() => {
  const isOutage = true // Placeholder condition for an outage
  return isOutage && route.path !== '/login'
})

function handleLogout() {
  logout()
  router.push('/login')
  drawer.value = false
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<style scoped>
.v-navigation-drawer {
  height: 100vh !important;
}

.v-list {
  height: 100%;
}
</style>
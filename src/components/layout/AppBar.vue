<template>
  <div>
    <!-- App Bar -->
    <v-app-bar elevation="1" prominent>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Your App Name</v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Add any additional app bar items here -->
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          v-for="item in navigationItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          @click="drawer = false"
        />
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'


const drawer = ref(false)


const navigationItems = [
  { title: 'Home', icon: 'mdi-home', to: '/home' },
  {
    title: 'Admin',
    icon: 'mdi-shield-account',
    to: '/src/views/HamburgerMenu/Admin.vue',
  },
  {
    title: 'Profile',
    icon: 'mdi-account',
    to: '/src/views/HamburgerMenu/Profile.vue',
  },
  {
    title: 'Settings',
    icon: 'mdi-cog',
    to: '/src/views/HamburgerMenu/Settings.vue',
  },
  {
    title: 'Customers',
    icon: 'mdi-account-group',
    to: '/src/views/HamburgerMenu/Customers.vue',
  },
  {
    title: 'Destinations',
    icon: 'mdi-map-marker',
    to: '/src/views/HamburgerMenu/Destinations.vue',
  },
  {
    title: 'Monitor',
    icon: 'mdi-monitor-dashboard',
    to: '/src/views/HamburgerMenu/Monitor.vue',
  },
  {
    title: 'Tasks',
    icon: 'mdi-clipboard-list',
    to: '/src/views/HamburgerMenu/Tasks.vue',
  },
]

</script>

<style scoped>
.v-navigation-drawer {
  top: 0 !important;
}
</style>

<template>
  <v-app theme="dark">
    <v-main class="bg-background">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
// Empty layout component
</script>

<style>
.bg-background {
  background-color: #121212 !important;
}
</style>

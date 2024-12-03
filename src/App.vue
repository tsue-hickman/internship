<template>
  <v-app theme="dark">
    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup></script>

<style>
:root {
  --v-theme-background: #121212;
}

.v-application {
  background-color: var(--v-theme-background) !important;
}

.v-main {
  background-color: var(--v-theme-background) !important;
}
</style>

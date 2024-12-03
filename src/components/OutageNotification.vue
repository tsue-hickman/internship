<template>
    <div v-if="showOutageBanner">
      <!-- Outage Banner -->
      <div v-if="outageConfig.isActive" class="outage-banner">
        <p class="outage-message">
          {{ outageConfig.message }}
          <a @click="showDialog = true" class="learn-more-button">{{ outageConfig.learnMoreText }}</a>
          <a @click="showDialog = true" class="dismiss-button">{{ outageConfig.dismissText }}</a>
        </p>
      </div>
  
      <!-- Outage Dialog -->
      <v-dialog v-model="showDialog" max-width="600px">
        <v-card>
          <v-card-title class="outage-header">
            <h1 class="outage-title">{{ outageConfig.title }}</h1>
            <v-btn icon @click="showDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="outage-content">
            <p v-html="formattedContent"></p>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import outageConfig from '@/config/outage.json';
  
  export default {
    name: 'OutageNotification',
    setup() {
      const showDialog = ref(false);
      const config = ref(outageConfig);
      const route = useRoute();
  
      const formattedContent = computed(() => {
        return config.value.content.replace(/\n/g, '<br>');
      });
  
      const showOutageBanner = computed(() => {
        // Don't show the banner on the login page
        return route.path !== '/login';
      });
  
      return {
        showDialog,
        outageConfig: config,
        formattedContent,
        showOutageBanner
      };
    }
  };
  </script>
  
  <style scoped>
  .outage-banner {
    background-color: red;
    color: white;
    padding: 10px;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    height: 25px;
  }
  
  .outage-message {
    margin-top: -10px;
  }
  
  .learn-more-button {
    color: white;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 10px;
  }
  
  .dismiss-button {
    color: white;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 10px;
  }
  
  .outage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1e1e1e;
    color: white;
  }
  
  .outage-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
  
  .outage-content {
    font-size: 14px;
    line-height: 1.6;
    padding: 20px;
  }
  </style>
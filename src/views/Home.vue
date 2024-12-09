<template>
  <v-app>
    <!-- Hero Section with Parallax -->
    <v-parallax class="globe_img" src="src/assets/images/globe.webp" height="100vh">
      <v-row class="fill-height" align="center" justify="center">
        <v-col class="text-center">
          <h1 class="display-2">Welcome to My Practice App</h1>
          <p class="subheading">
            This is where I learn Vuetify and other aspects of web development.
            With this project, I hope to learn to tailor my designs to your needs.
            Thank you for taking the time to visit my page.
          </p>
          <v-btn large color="primary" @click="getStarted">
            Get Started
          </v-btn>
        </v-col>
      </v-row>
    </v-parallax>

    <div class="features-section">
      <div class="features-carousel-container">
        <div class="features-carousel">
          <div class="features-carousel-item" v-for="(feature, index) in features" :key="index">
            <div class="features-card">
              <div class="features-card-content">
                <div class="features-card-icon">
                  <v-icon large :color="feature.iconColor">{{ feature.icon }}</v-icon>
                </div>
                <h3 class="features-card-title">{{ feature.title }}</h3>
                <p class="features-card-text">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="features-background" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    </div>

    <!-- Call to Action Section -->
    <v-container class="cta-section" fluid>
      <v-row class="align-center justify-center">
        <v-col cols="12" md="8" class="text-center">
          <h2>Ready to Get Started?</h2>
          <p>Call-to-Action section of our application.</p>
          <v-btn large color="secondary" @click="signUp">Sign Up or other CTA</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const backgroundImage = ref('starry-night-sky.jpeg')
const features = ref([
  {
    icon: 'mdi-speedometer',
    iconColor: 'primary',
    title: 'Fast Performance',
    description: 'Experience blazing fast speed with our cutting-edge technology.',
  },
  {
    icon: 'mdi-security',
    iconColor: 'primary',
    title: 'Secure & Reliable',
    description: 'We prioritize security to ensure your data is safe.',
  },
  {
    icon: 'mdi-web',
    iconColor: 'primary',
    title: 'User-Friendly Interface',
    description: 'Intuitive design, easy to use, with a seamless user experience.',
  }
])

const router = useRouter()

function getStarted() {
  router.push('/destinations') // Redirect to the features or dashboard page
}

function signUp() {
  router.push('/signup') // Redirect to sign-up page
}
</script>

<style scoped>
/* Styling for parallax hero section */
.hero-section {
  background-color: #f5f5f5;
}

.globe_img {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100vh;
}

.subheading {
  font-size: 1.25rem;
  margin: 20px 0;
}

.features-section {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.features-carousel-container {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%); /* Center horizontally */
  width: 80%; /* Adjust width as needed */
  height: 80%; /* Adjust height as needed */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  margin: 0 auto;
}

.features-carousel {
  display: flex;
  animation: carousel-scroll 20s linear infinite;
}

.features-carousel-item {
  flex: 0 0 auto;
  margin: 0 20px;
  cursor: pointer;
}

.features-card {
  background-color: rgba(11, 23, 61, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.features-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.features-card-content {
  text-align: center;
}

.features-card-icon {
  margin-bottom: 10px;
}

.features-card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.features-card-text {
  font-size: 14px;
  color: #666;
}

.features-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background-size: cover;
  background-position: center;
  filter: blur(10px) brightness(0.7);
  z-index: 0;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.5);
}

.cta-section {
  margin-top: 20px; /* Add margin to separate from features */
  background-color: #22333b; /* Match your design */
  color: #ffffff;
  padding: 20px 0; /* Optional: adjust padding */
}

h1, h2 {
  font-weight: 700;
  color: white;
}

.v-card {
  padding: 20px;
  text-align: center;
}

@keyframes carousel-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>

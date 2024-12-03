<!-- views/Login/Login.vue -->
<template>
  <v-container class="login-container" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-form @submit.prevent="handleLogin">
          <v-card>
            <v-card-title class="headline">Login</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="username"
                label="Username"
                required
                outlined
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
                outlined
              />
            </v-card-text>
            <v-card-actions>
              <v-btn type="submit" color="primary" block>Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/authStore'

const username = ref('')
const password = ref('')
const router = useRouter()
const { login, isAuthenticated } = useAuth()

// Function to retrieve stored credentials
function loadStoredCredentials() {
  const storedUsername = localStorage.getItem('username')
  const storedPassword = localStorage.getItem('password')
  if (storedUsername && storedPassword) {
    username.value = storedUsername
    password.value = storedPassword
  }
}

// Automatically pre-fill the login form if credentials exist
onMounted(() => {
  loadStoredCredentials()
})

async function handleLogin() {
  try {
    const success = await login({
      username: username.value,
      password: password.value,
    })
    if (success) {
      isAuthenticated.value = true // Use isAuthenticated from useAuth

      // Store the credentials in localStorage
      localStorage.setItem('username', username.value)
      localStorage.setItem('password', password.value)

      router.push('/')
    } else {
      alert('Invalid credentials')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('An error occurred during login. Please try again.')
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: #171515;
}

.v-card {
  padding: 2rem;
  width: 100%;
  background-color: #150c0c;
}

.v-card-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #3030ee;
}

.v-text-field {
  margin-bottom: 1rem;
}

.v-btn {
  margin-top: 1rem;
}
</style>

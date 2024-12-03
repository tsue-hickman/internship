// src/composables/auth.js
import { ref, readonly } from 'vue'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds

const users = [
  { username: 'username', password: 'password' },
  { username: 'admin', password: 'password123' },
  { username: 'newuser', password: 'newpassword' },
]

export function useAuth() {
  const isAuthenticated = ref(false)
  const user = ref(null)

  function login(credentials) {
    const foundUser = users.find(
      u =>
        u.username === credentials.username &&
        u.password === credentials.password,
    )
    if (foundUser) {
      const timestamp = new Date().getTime()
      isAuthenticated.value = true
      user.value = { username: foundUser.username }
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('loginTimestamp', timestamp)
      return true
    } else {
      logout()
      return false
    }
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('loginTimestamp')
  }

  function checkAuth() {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    const storedTimestamp = localStorage.getItem('loginTimestamp')
    const currentTime = new Date().getTime()

    if (storedUser && storedTimestamp) {
      const timeElapsed = currentTime - parseInt(storedTimestamp, 10)
      if (timeElapsed < SESSION_TIMEOUT) {
        user.value = storedUser
        isAuthenticated.value = true
        return storedUser.username
      } else {
        clearCredentials()
      }
    }
    isAuthenticated.value = false
    return null
  }

  function clearCredentials() {
    localStorage.removeItem('user')
    localStorage.removeItem('loginTimestamp')
    isAuthenticated.value = false
    user.value = null
  }

  checkAuth()

  return {
    isAuthenticated: readonly(isAuthenticated),
    user: readonly(user),
    login,
    logout,
    checkAuth,
    clearCredentials,
  }
}

// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/authStore'

// Import layouts and views
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'

// Direct imports for core views
import Login from '@/views/Login/Login.vue'
import Home from '@/views/Home.vue'

// Lazy loaded views for better initial load performance
const Admin = () => import('../views/Admin.vue')
const Customers = () => import('../views/Customers.vue')
const Monitor = () => import('../views/Monitor.vue')
const Destinations = () => import('../views/Destinations.vue')
const Tasks = () => import('../views/Tasks.vue')
const Profile = () => import('../views/Profile.vue')
const Settings = () => import('../views/Settings.vue')

const routes = [
  {
    path: '',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { 
        path: '', 
        name: 'home',
        component: Home,
        meta: { title: 'Home' }
      },
      { 
        path: 'admin', 
        name: 'admin',
        component: Admin,
        meta: { 
          title: 'Admin',
          roles: ['admin'] // Optional: for role-based access
        }
      },
      { 
        path: 'profile', 
        name: 'profile',
        component: Profile,
        meta: { title: 'Profile' }
      },
      { 
        path: 'settings', 
        name: 'settings',
        component: Settings,
        meta: { title: 'Settings' }
      },
      { 
        path: 'customers', 
        name: 'customers',
        component: Customers,
        meta: { title: 'Customers' }
      },
      { 
        path: 'destinations', 
        name: 'destinations',
        component: Destinations,
        meta: { title: 'Destinations' }
      },
      { 
        path: 'monitor', 
        name: 'monitor',
        component: Monitor,
        meta: { title: 'Monitor' }
      },
      { 
        path: 'tasks', 
        name: 'tasks',
        component: Tasks,
        meta: { title: 'Tasks' }
      },
    ],
  },
  {
    path: '/login',
    component: EmptyLayout,
    children: [
      { 
        path: '', 
        name: 'login',
        component: Login,
        meta: { title: 'Login' }
      },
    ],
  },
  // Catch-all route for 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
  // Scroll behavior restoration
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, checkAuth, clearCredentials } = useAuth()
  const storedUsername = checkAuth()

  // Update document title
  document.title = `AfterWipe - ${to.meta.title || 'Dashboard'}`

  // Authentication check
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!storedUsername) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // Optional: Role-based access control
      if (to.meta.roles && !to.meta.roles.includes(user?.role)) {
        next({ path: '/' })
      } else {
        next()
      }
    }
  } else if (storedUsername && to.path === '/login') {
    next('/home')
  } else {
    next()
  }
})

export default router
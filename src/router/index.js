import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'
import Home from '@/views/Home.vue'
import TaskCatalog from '@/views/taskCatalog.vue'
import TaskDetail from '@/views/taskDetail.vue'
import Profile from '@/views/Profile.vue'
import Dashboard from '@/views/dashboard.vue'
import Impressum from '../views/imprint.vue'   
import Datenschutz from '../views/dataProtection.vue' 
import UserManagement from '../views/UserManagement.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    beforeEnter: authGuard
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskCatalog,
    meta: { requiresAuth: true },
    beforeEnter: authGuard
  },

  { 
    // admin user management
    path: '/admin/users', 
    name: 'user-management', 
    component: UserManagement, 
    beforeEnter: authGuard 
  },
  
  {
    path: '/task/:id',
    name: 'task-detail',
    component: TaskDetail,
    props: true,
    meta: { requiresAuth: true },
    beforeEnter: authGuard
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true },
    beforeEnter: authGuard
  },
      {
      path: '/Datenschutz',
      name: 'Datenschutz',
      component: () => import('../views/dataProtection.vue')
    },
  {
      path: '/Impressum',
      name: 'impressum',
      component: () => import('../views/imprint.vue')
    },
    {
      path: '/Kontakt',
      name: 'Kontakt',
      component: () => import('../views/contact.vue')
    }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
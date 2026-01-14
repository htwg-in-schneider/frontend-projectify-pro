import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'
import Home from '@/views/Home.vue'
import Dashboard from '@/views/dashboard.vue'
import TaskCatalog from '@/views/taskCatalog.vue'
import TaskDetail from '@/views/taskDetail.vue'
import Profile from '@/views/Profile.vue'

const Impressum = () => import('../views/imprint.vue')
const Datenschutz = () => import('../views/dataProtection.vue')
const Kontakt = () => import('../views/contact.vue')
const UserManagement = () => import('../views/UserManagement.vue')

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
    path: '/task/:id',
    name: 'task-detail',
    component: TaskDetail,
    props: true,
    meta: { requiresAuth: true },
    beforeEnter: authGuard
  },
  { 
    path: '/admin/users', 
    name: 'user-management', 
    component: UserManagement, 
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
    component: Datenschutz
  },
  {
    path: '/Impressum',
    name: 'impressum',
    component: Impressum
  },
  {
    path: '/Kontakt',
    name: 'Kontakt',
    component: Kontakt
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import TaskCatalog from '@/views/taskCatalog.vue';   
import TaskDetail from '@/views/taskDetail.vue';    
import Login from '@/views/login.vue';
import Profile from '@/views/Profile.vue';             
import Dashboard from '@/views/dashboard.vue';       

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskCatalog,
    meta: { hideLoginButton: true },
  },
  {
    path: '/task/:id',
    name: 'task-detail',
    component: TaskDetail,
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { hideLoginButton: true },
  },
  { path: '/profile', component: Profile },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { hideLoginButton: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

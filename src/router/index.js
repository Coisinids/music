import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home-view'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect:"/m",
    component: HomeView
  },
  {
    path: '/m',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

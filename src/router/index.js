import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home-view'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect:"/m",
    component: HomeView
  },
  {
    path: '/m',
    name: 'home',
    component: HomeView
  },
  {
    path: '/m/playList/:id',
    name: 'playList',
    component: () => import ("@/views/PlayList.vue") // 歌单详情页
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

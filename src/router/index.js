import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home-view'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: "/m/recommend",
    component: HomeView
  },
  {
    path: '/m',
    name: 'home',
    component: HomeView,
    redirect: "/m/recommend",
    children:[
      {
        path: "recommend",
        name: "recommend",
        component: () => import("@/views/home-view/components/Recommend")
      },
      {
        path: "singer",
        name: "singer",
        component: () => import("@/views/home-view/components/Singer")
      },
      {
        path: "ranking",
        name: "ranking",
        component: () => import("@/views/home-view/components/Ranking")
      },
      {
        path: "search",
        name: "search",
        component: () => import("@/views/home-view/components/Search")
      }
    ]
  },
  {
    path: '/m/playList/:id',
    name: 'playList',
    component: () => import ("@/views/PlayList.vue") // 歌单详情页
  },
  {
    path: '/m/singerDetail/:id',
    name: 'singerDetail',
    component: () => import ("@/views/SingerDetail.vue") // 歌手详情页
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

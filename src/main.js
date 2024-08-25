import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import SvgIcon from './components/SvgIcon.vue'
import "@/icons/index"
import "@/styles/index.less"

const app = createApp(App)

//注册为全局组件
app.component("SvgIcon",SvgIcon)

app.use(store).use(router).mount('#app')

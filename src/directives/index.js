import loading from "./loading"
export default {
    install(app){
        // 注册全局自定义指令
        app.directive("loading",loading)
    }
}
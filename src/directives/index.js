import loading from "./loading"
import lazyLoadImg from "./lazyLoadImg"
export default {
    install(app){
        // 注册全局自定义指令
        app.directive("loading",loading)  // 加载框
        app.directive("img-lazy",lazyLoadImg)  // 图片懒加载
    }
}
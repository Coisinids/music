import defaultImg from "@/assets/lazy.jpg"
import {useIntersectionObserver} from "@vueuse/core"
export default{
    /**
     * @param {*} el 指令绑定的dom元素
     * @param {*} binding  指令绑定的值以及配置项信息
     */
    mounted(el,binding){
        // 初始先设置img的src为默认图片(占位)
        el.src = defaultImg
        /**
         * 开启异步监听
         * el : 指令绑定的dom元素
         * 回调函数
         */
        //useIntersectionObserver能够判断一个元素是否进入到了视口（viewport）范围内,
        //例如，在一个图片懒加载的场景中，当图片元素进入视口时，利用useIntersectionObserver可以触发加载图片的操作，从而提高页面的加载性能。
        const {stop} = useIntersectionObserver(el,([{isIntersecting}])=>{
            if(isIntersecting){
                // 将实际的图片地址赋值给元素的src
                el.src = binding.value
                // 当图片加载失败时
                el.onerror = () => {
                    el.src = defaultImg
                }
                // 在可视区域里了, 停止对该元素的监听
                stop()
            }
            
        })
    }
}
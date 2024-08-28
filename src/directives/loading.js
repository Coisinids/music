import  Loading  from "@/components/Loading.vue";
import { createApp } from 'vue'

export default{
    /**
     * 指令绑定的dom元素挂载到页面后触发
     * @param {*} el 指令绑定的dom元素
     * @param {*} binding  指令绑定的值以及配置项信息
     */
    mounted(el, binding){
        let loadApp = createApp(Loading)
        let instance = loadApp.mount(document.createElement("div"))
        el.instance = instance
        if(binding.value)  append(el)
    },
    // 指令绑定的值发生变化时触发
    updated(el, binding){
        binding.value ? append(el) : remove(el)
    }
}
function append(el,){
    // 获取被绑定元素的全部样式
    let allStyle = getComputedStyle(el)
    let arr = ["absolute", "fixed", "relative"]

    if(arr.indexOf(allStyle.position) === -1) el.style.position = "relative"

    el.appendChild(el.instance.$el)
}
function remove(el){
    el.removeChild(el.instance.$el)
}
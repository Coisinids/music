<template>
    <div ref="scrollRootRef">
        <!-- 插槽：接收外部组件传入的内容 -->
        <slot></slot>
    </div>
</template>
<script setup>
import BScroll from "@better-scroll/core"
import ObserveDom from "@better-scroll/observe-dom"
import {onMounted,onUnmounted,ref} from "vue"

BScroll.use(ObserveDom)
/**
 * 注意： 
 *  BScroll默认只处理容器的第一个子元素的滚动，其它的元素会被忽略
 *  监听滚动的容器必须有固定的高度
 * 
 */
let props = defineProps({
    probeType:{
        type:Number,
        default:0
    },
    click:{
        type:Boolean,
        default:true  //不阻止浏览器的原生 click 事件
    }
})
let emit = defineEmits(["scrollView"])

let scrollRootRef = ref(null) // 滚动的容器
let scroll = ref(null)

onMounted(()=>{
    // arg1: 要监听滚动的容器  arg2: 配置项
    scroll.value = new BScroll(scrollRootRef.value,{
        observeDOM:true, //开启observe-dom插件
        ...props
    })
    //滚动视图时将滚动距离传给父组件
    if(props.probeType > 0){
        scroll.value.on("scroll",(position)=>{
            emit("scrollView",position.y) 
        })
    }
})

onUnmounted(()=>{
    //销毁
    scroll.value.destroy()
})

//对外提供scroll实例对象
defineExpose({
    scroll
})
</script>
<style lang='less' scoped>

</style>
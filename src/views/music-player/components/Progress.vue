<template>
  <div class="p-progress-inner" ref="playRef" @click="handleClick">
    <!-- 当前已经播放的进度条-->
    <div class="p-progress-play" ref="playedRef" :style="playedStyle">
      <!-- 滑块 -->
      <div
        class="slider"
        @touchstart.prevent="touchStartProgress"
        @touchmove.prevent="touchMoveProgress"
        @touchend.prevent="touchEndProgress"
        :style="sliderStyle"
      >
        <i class="slider-btn" ref="sliderBtnRef"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"

//进度条容器
const playRef = ref(null)
//进度条容器的宽度
const playWidth = ref(0)

// 获取进度条容器的总宽度
onMounted(()=>{
    playWidth.value = playRef.value.offsetWidth - sliderBtnRef.value.offsetWidth
})

//已播放进度条
const playedRef = ref(null)
//已经播放进度条的宽度
const playedWidth = ref(0)
const playedStyle = computed(()=>`width:${playedWidth.value}px`)

//滑块
const sliderBtnRef = ref(null)
const sliderStyle = computed(()=>`transform:translateX(${playedWidth.value}px)`)

//时间进度比
let props = defineProps(["progressRatio"])

//接受父组件传来的事件
let emits = defineEmits(["progressMove","progressEnd"])

// 存储触摸相关事件的位置信息
const touch = {}

//监听父组件传来的时间进度比的变化,同步进度条的变化
watch(()=>props.progressRatio,(newRatio)=>{
    playedWidth.value = newRatio * playWidth.value 
})

//点击进度条时触发
const handleClick = (e)=>{
    playedWidth.value = Math.max(0,Math.min(e.offsetX,playWidth.value))
    let ratio = playedWidth.value / playWidth.value
    emits("progressEnd",ratio)
}

//触摸滑块
const touchStartProgress = (e)=>{
    touch.x1 = e.touches[0].pageX
    // 获取已经播放进度条的宽度
    touch.initW = playedRef.value.offsetWidth
}
//移动滑块
const touchMoveProgress = (e)=>{
    playedWidth.value =  e.touches[0].pageX - touch.x1 + touch.initW
    playedWidth.value = Math.max(0,Math.min(playedWidth.value,playWidth.value))

    let ratio = playedWidth.value / playWidth.value
    emits("progressMove",ratio)
    
}
// 结束操作
const touchEndProgress = (e)=>{
    let ratio = playedWidth.value / playWidth.value
    emits("progressEnd",ratio)
}


</script>

<style lang="less" scoped>
.p-progress-inner {
  position: relative;
  flex: 1;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  .p-progress-play {
    position: absolute;
    width: 0;
    height: 100%;
    background: #f0d0e0;
  }
  // 滑块
  .slider {
    position: absolute;
    left: -7px;
    top: -13px;
    width: 30px;
    height: 30px;
    .slider-btn{
        position: absolute;
        top: 7px;
        left: 7px;
        width: 16px;
        height: 16px;
        border: 3px solid #fff;
        box-sizing: border-box;
        border-radius: 8px;
        background: @light-color;
    }
  }
}
</style>

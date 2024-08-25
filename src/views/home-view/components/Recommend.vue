<template>
    <div class="recommend">
        <!-- 轮播 -->
        <div class="swipe-container">
            <van-swipe class="remd-swiper" :autoplay="3000" indicator-color="white" lazy-render>
                <van-swipe-item v-for="item in swiperImgList" :key="item">
                    <img :src="item.imageUrl" alt="图片"/>
                </van-swipe-item>
            </van-swipe>
        </div>
        <!-- 推荐歌单 -->
        
        <!-- 推荐新歌 -->
    </div>
</template>
<script setup>
import {onMounted, reactive} from "vue"
import { getSwiperImg } from "@/api/recommend"
const swiperImgList = reactive([])

// 请求轮播数据
let getSwiperImgList = () => {
    getSwiperImg({type: 2})
    .then(res => {
        swiperImgList.push(...res.data.banners)
    })
    .catch(err => {
        console.log("请求轮播数据出错", err);
    })
}
getSwiperImgList()


</script>
<style lang='less' scoped>
.swipe-container{
    width: 100%;
    .remd-swiper{
        .van-swipe-item{
            img{
                width: 100%;
            }
        }
    }
}
</style>
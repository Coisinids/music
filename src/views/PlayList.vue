<template>
   <div class="m-playlist">
        <section class="m-p-header">
           <img class="p-header-bg" :src="playListData.coverImgUrl" alt="背景图"> 
           <div class="p-header-container">
                <div class="p-h-cover">
                    <img :src="playListData.coverImgUrl" alt="背景图">
                    <p class="play-count">
                        <SvgIcon class="icon" iconFileName="music2"/>
                        {{handlePlayCount(playListData.playCount)}}
                    </p>
                </div>
                <!-- 文本描述 -->
                <div class="p-h-text-info">

                </div>
           </div>
        </section>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import { onMounted, reactive, ref } from "vue";
import { getPlaylistDetail } from "@/api/recommend"

let route = useRoute()
let playListData = ref({})
let creatorInfo = ref({})
let songsData = reactive([])


onMounted(()=>{
    getPlaylist()
})

// 获取歌单的详情数据
let getPlaylist = () => {
    getPlaylistDetail(route.params.id)
    .then(res => {
        console.log("歌单详情数据", res);
        playListData.value = res.data.playlist
        creatorInfo.value = res.data.playlist.creator
    })
    .catch(err => {
        console.log("请求歌单详情出错", err);
    })
}

// 处理播放数字的单位
let handlePlayCount = (count) => {
    if(count >= 10000 && count < 100000000){ //超过1万并且小于1亿
        return (count/10000).toFixed()+"万"
    }else if(count >= 100000000){ //超过1亿
        return (count/100000000).toFixed()+"亿"
    }else{
        return count
    }
}
</script>

<style lang='less' scoped>
.m-playlist{
    .m-p-header{
        position: relative;
        height: 186px;
        .p-header-bg{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            // 模糊
            filter: blur(20px);
            -webkit-filter: blur(20px);
        }
        .p-header-container{
            display: flex;
            justify-content: space-between;
            height: 126px;
            padding: 30px 10px 30px 15px;
            box-sizing: border-box;
            .p-h-cover{
                position: relative;
                width: 32%;
                img{
                    width: 100%;
                    height: auto;
                }
                .play-count{
                    position: absolute;
                    right: 4px;
                    top: 4px;
                    color: @light-color-m;
                    font-size: @font-size-mini;
                    .icon{
                        width: 18px;
                        height: 18px;
                    }
                }
            }
        }
    }
}
</style>
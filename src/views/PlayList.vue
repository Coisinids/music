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
                    <h2 class="name">{{playListData.name}}</h2>
                    <p class="creator">
                        <img :src="creatorInfo.avatarUrl" :alt="creatorInfo.nickname" class="avatar">
                        {{creatorInfo.nickname}}
                    </p>
                </div>
           </div>
        </section>

        <SongList :songsData="songsData" />
        
    </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import { onMounted, reactive, ref, computed } from "vue";
import { getPlaylistDetail } from "@/api/recommend"
import { getSongDetail } from "@/api/song"
import SongList from "@/components/SongList.vue"

let route = useRoute()
let playListData = ref({})
let creatorInfo = ref({})
let songsData = reactive([])
let loading = computed(() => songsData.length <= 0)

onMounted(()=>{
    getPlaylist()
})

// 获取歌单的详情数据
let getPlaylist = () => {
    getPlaylistDetail(route.params.id)
    .then(res => {
        // console.log("歌单详情数据", res);
        playListData.value = res.data.playlist
        creatorInfo.value = res.data.playlist.creator

        // 存有歌曲id的数组
        let trackIds = res.data.playlist.trackIds
        trackIds.length = Math.min(30, trackIds.length)
        getSongs(trackIds)
    })
    .catch(err => {
        console.log("请求歌单详情出错", err);
    })
}

// 根据id批量请求歌曲的信息
let getSongs = (trackIds) => {
    let ids = [];
    trackIds.forEach(item => ids.push(item.id))
    
    // 携带参数，发起请求
    getSongDetail(ids.join())
    .then(res => {
        songsData.push(...res.data.songs)
    })
    .catch(err => {
        console.log("批量获取歌曲对象出错", err);
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
                    right: 0;
                    top: 0;
                    padding: 2px;
                    color: @light-color-m;
                    background-color: rgba(0,0,0,.2);
                    font-size: @font-size-mini;
                    .icon{
                        width: 12px;
                        height: 12px;
                    }
                }
            }
            .p-h-text-info{
                width: 65%;
                .name{
                    display: -webkit-box;
                    overflow: hidden;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    height: 3em;
                    line-height: 1.5em;
                    color: @light-color-m;
                    font-size: @font-size-medium;
                    margin-bottom: 16px;
                }
                .creator{
                    overflow:hidden;
                    white-space:nowrap;
                    text-overflow:ellipsis;
                    color: @dark-color;
                    img{
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
}
</style>
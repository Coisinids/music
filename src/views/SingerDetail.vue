<template>
  <div class="singer-detail">
    <div class="artist-info">
      <img class="a-cover" :src="artistInfo.cover" :alt="artistInfo.name" />
      <div class="a-content">
        <div class="avatar">
          <img :src="artistInfo.cover" :alt="artistInfo.name" />
        </div>
        <h2 class="name">{{ artistInfo.name }}</h2>
        <p class="identify">{{ identify.imageDesc }}</p>
        <p class="desc">{{ artistInfo.briefDesc }}</p>
      </div>
    </div>
    <!-- 全部歌曲的列表 -->
    <SongList :songsData="songsDataList" />
  </div>
</template>

<script setup>
import { getSingerDetail, getSingerAllSongs } from "@/api/singer";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import SongList from "@/components/SongList.vue"

let route = useRoute(),
  id = route.params.id,
  artistInfo = ref({}),
  identify = ref({}),
  songsDataList = reactive([]);

onMounted(() => {
  // 基于id请求歌手的信息
  getSingerDetail(id)
    .then((res) => {
      artistInfo.value = res.data.data.artist;
      identify.value = res.data.data.identify;
    })
    .catch((err) => {
      console.log("请求歌手的信息失败", err);
    });
  // 基于id请求歌手的歌曲
  getSingerAllSongs(id)
    .then((res) => {
      songsDataList.push(...res.data.songs)
    })
    .catch((err) => {
      console.log("请求歌手的歌曲失败", err);
    });
});
</script>

<style lang="less">
.singer-detail {
  .artist-info {
    position: relative;
    height: 50vh;
    background-color: @main-background;
    margin-bottom: 10px;
    .a-cover {
      width: 100%;
      height: 70%;
      background-size: cover;
      background-position: center center;
      margin-bottom: 100px;
    }
    .a-content {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 86%;
      height: 40%;
      padding: 10px;
      border-radius: 10px;
      // background-color: rgba(0,0,0,.9);
      background-color: @main-background;
      filter: brightness(0.9);
      box-shadow: 0 0 4px @main-background;
      font-size: @font-size-small;
      text-align: center;
      line-height: 2em;
      .avatar {
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 50%;
        width: 80px;
        height: 80px;
        background-size: cover;
        background-position: center center;
        transform: translateX(-50%) translateY(-50%);
        border-radius: 50%;
        img {
          position: absolute;
          top: 0;
          left: 50%;
          height: 100%;
          transform: translateX(-50%);
        }
      }
      .name {
        padding-top: 40px;
        color: @light-color;
        font-size: @font-size-large;
      }
      .identify {
        overflow: hidden;
        padding: 0 60px;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: @dark-color;
      }
      .desc {
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-top: 8px;
        color: @dark-color;
      }
    }
  }
}
</style>

<template>
    <div class="home">
        <!-- 顶部栏 -->
        <div class="m-topbar">
            <SvgIcon class="icon" iconFileName="music"/>
            <h1 class="title">Music</h1>
        </div>
        <!-- 选项卡区域 -->
        <div class="m-tabs-container">
            <van-tabs v-model:active="active">
                <van-tab title="推荐"><Recommend/></van-tab>
                <van-tab title="歌手"><Singer/></van-tab>
                <van-tab title="排行"><Ranking/></van-tab>
                <van-tab title="搜索"><Search/></van-tab>
            </van-tabs>
        </div>
    </div>
</template>
  
<script setup>
import {ref} from "vue"
import Recommend from "./components/Recommend.vue"
import Singer from "./components/Singer.vue"
import Ranking from "./components/Ranking.vue"
import Search from "./components/Search.vue"
const active = ref(0)


</script>
  
<style lang="less" scoped>
// 顶部栏
.m-topbar {
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: @light-color;
  background-image: linear-gradient(@topbar-gradient 10%, @main-background);
  font-size: @font-size-oversized;
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
  h1{
    font-weight: bold;
  }
}
.m-tabs-container{
  // 覆盖vant样式
  /deep/ .van-tabs{
    .van-tabs__nav{
      background-color: @main-background;
    }
    .van-tab{
      color: @dark-color;
    }
    .van-tab--active{
      color: @light-color;
    }
    .van-tabs__line{
      background: @light-color;
    }
  }
}
</style>

  
  
<template>
  <div class="singer">
    <!-- 歌手的列表区域 -->
    <section class="scroll-plane">
      <ul class="singer-list">
        <!-- 列表组 -->
        <li
          class="singer-list-group"
          v-for="item in singerList"
          :key="item.tag"
        >
          <h3 class="group-title">{{ item.tag }}</h3>
          <ul>
            <li
              class="group-item"
              v-for="sItem in item.singerInfo"
              :key="sItem.id"
            >
              <div class="avatar">
                <!-- 图片的懒加载 -->
                <!-- 出现在可视区域，src的地址就是外部图片链接地址,没出现在可视区域，设置src的地址为默认图片的路径-->
                <img v-img-lazy="sItem.picUrl" :alt="sItem.name" />
              </div>
              <span class="name">{{ sItem.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </section>
    <!-- 固定索引栏 -->
    <div class="index-bar">
      <ul>
        <li v-for="item in singerList" :key="item.tag">
          {{ item.tag }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive } from "vue";
import { getHotSinger, getSingerList } from "@/api/singer.js";
// 歌手数据列表
let singerList = handleAnchor();

// 获取锚点列表里的26个英文字母  A-Z
function handleAnchor() {
  let arr = reactive([{ tag: "热" }]);
  for (let i = 65; i < 91; i++) {
    arr.push({ tag: String.fromCharCode(i) });
  }
  return arr;
}

onMounted(() => {
  singerList.forEach((item) => {
    if (item.tag === "热") {
      // 请求热门歌手
      getHotSinger()
        .then((res) => {
          item.singerInfo = res.data.artists;
        })
        .catch((err) => {
          console.log("热门歌手请求失败", err);
        });
    } else {
      // 根据字母请求歌手
      getSingerList(item.tag)
        .then((res) => {
          item.singerInfo = res.data.artists;
        })
        .catch((err) => {
          console.log("根据字母请求歌手失败", err);
        });
    }
  });
});
</script>
<style lang="less" scoped>
.singer {
  // 索引栏
  .index-bar {
    position: fixed;
    top: 50%;
    right: 10px;
    z-index: 999;
    width: 18px;
    background-color: @sidebar-background;
    transform: translateY(-50%);
    color: @dark-color;
    border-radius: 18px;
    li {
      height: 20px;
      font-size: @font-size-mini;
      line-height: 20px;
      text-align: center;
      box-sizing: border-box;
    }
    .current {
      color: @light-color;
    }
  }
  .singer-list {
    .singer-list-group {
      .group-title {
        padding-left: 16px;
        height: 2em;
        line-height: 2em;
        font-size: @font-size-mini;
        color: @dark-color;
        background: @sidebar-background;
      }
      .group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          overflow: hidden;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        span.name {
          margin-left: 20px;
          color: @dark-color;
          font-size: @font-size-small;
        }
      }
    }
  }
}
</style>

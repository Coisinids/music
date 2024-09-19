<template>
  <div class="singer">
    <!-- 歌手的列表区域  probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画  -->
    <Scroll class="scroll-plane" :probeType="3" ref="scrollRef" @scrollView="handleScrollView" >
      <ul class="singer-list" ref="groupRef" >
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
              @click="handleClick(sItem.id)"
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
    </Scroll>
    <!-- 固定索引栏 -->
    <div class="index-bar">
      <ul>
        <li
          v-for="(item,index) in singerList"
          :key="item.tag"
          :class="{current: currentIndex === index}"
          @touchstart.prevent.stop="handleTouchStart($event, index)"
          @touchmove.prevent.stop="handleTouchMove($event)"
        >
          {{ item.tag }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref,  watch, nextTick } from "vue";
import { getHotSinger, getSingerList } from "@/api/singer.js";
import Scroll from "@/components/Scroll.vue"
import {useRouter} from "vue-router"

const router = useRouter()


// 歌手数据列表
let singerList = handleAnchor();

let tempArr = reactive([]);

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
          tempArr.push(item.singerInfo)
        })
        .catch((err) => {
          console.log("热门歌手请求失败", err);
        });
    } else {
      // 根据字母请求歌手
      getSingerList(item.tag)
        .then((res) => {
          item.singerInfo = res.data.artists;
          tempArr.push(item.singerInfo)
        })
        .catch((err) => {
          console.log("根据字母请求歌手失败", err);
        });
    }
  });
});

/* 处理点击索引栏上的字母锚点 */
let currentIndex = ref(0) //选中的索引栏下标
let scrollRef = ref(null)
let groupRef = ref(null)
let touchPosition = {} 

let allGroupItemHeight = ref([])

//点击对应字母触发
function handleTouchStart(e,i){
  touchPosition.y1 = e.touches[0].pageY //第一个触摸点的y坐标
  touchPosition.anchorIndex = i
  scrollTo(i)
}

//点击后不松手滑动时触发
function handleTouchMove(e){
  touchPosition.y2 = e.touches[0].pageY
  let moveIndex = Math.floor((touchPosition.y2 - touchPosition.y1) / 20)
  // console.log("moveIndex",moveIndex);
  moveIndex += touchPosition.anchorIndex
  scrollTo(moveIndex)
}

//将对应项数据滚动到顶部
function scrollTo(i){
  i = Math.max(0,Math.min(i,groupRef.value.children.length - 1))
  currentIndex.value = i
  let targetElement = groupRef.value.children[i]
  let scroll = scrollRef.value.scroll
  scroll.scrollToElement(targetElement,300)
}

/* 
  在页面视图上滚动，滚动到哪个区域，就高亮该区域对应的字母
*/
watch(()=>tempArr.length,async ()=>{
  // 等待页面更新完毕
  await nextTick()
  //得到所有的列表组元素节点
  let allGroupLi = groupRef.value.children
  //初始高度
  let initHeight = 0
  //临时存储每个列表组的区间
  let temp = [initHeight]
  for(let i = 0;i < allGroupLi.length; i++ ){
    temp.push(initHeight += allGroupLi[i].offsetHeight)
  }
  allGroupItemHeight.value = temp
})
//滚动视图时高亮对应索引栏字母
function handleScrollView(y){
  y = -y
  allGroupItemHeight.value.forEach((itemY,i)=>{
    //得到下一个itemY
    let nextItemY = allGroupItemHeight.value[i+1]
    //判断是否在当前项与下一项之间
    if(y>=itemY && y < nextItemY){
      currentIndex.value = i
    }
  })
}
// 点击歌手，跳转到歌手的详情页
function handleClick(id){
  router.push(`/m/singerDetail/${id}`)
}
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
    // 高亮的颜色
    .current {
      // color: @light-color;
      color: #ff0;
    }
  }
  // 固定滚动容器的高度
  .scroll-plane{
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 88px);
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

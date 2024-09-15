<template>
  <div class="player" v-if="musicPlayList.length">
    <transition name="player">
      <div class="player-transition" v-show="fullScreen">
        <div class="bg-cover">
          <img :src="currentSong.picUrl" :alt="currentSong.name" />
        </div>
        <div class="player-header">
          <svg-icon
            class="icon back"
            iconFileName="back"
            @click="cancelFullScreen"
          />
          <div class="hgroup">
            <h2 class="title">{{ currentSong.name }}</h2>
            <h3>
              <span v-for="item in currentSong.ar" :key="item.name">
                {{ item.name }} &nbsp;
              </span>
            </h3>
          </div>
        </div>
        <div class="song-wrap">
          <!-- 水平滚动区域 -->
          <div class="song-wrap-l">
            <div class="record-disc">
              <div class="rotate" :class="isRotate">
                <img :src="currentSong.picUrl" :alt="currentSong.name" />
              </div>
            </div>
            <!-- 单行歌词 -->
            <p class="song-lyric">歌词歌词歌词歌词</p>
          </div>
          <div class="song-wrap-r"></div>
        </div>
        <div class="player-footer">
          <div class="player-progress">
            <span class="time playtime">{{ formatTime(currentTime) }}</span>
            <Progress
              :progressRatio="progressRatio"
              @progressMove="progressMove"
              @progressEnd="progressEnd"
            />
            <span class="time endtime">{{ formatTime(duration) }}</span>
          </div>
          <div class="player-controller">
            <SvgIcon class="icon" :iconFileName="modeIcon" @click="changeMode" />
            <SvgIcon class="icon" iconFileName="prev" @click="prevSong" />
            <SvgIcon
              class="icon"
              :iconFileName="playStateIcon"
              @click="togglePlayState"
            />
            <SvgIcon class="icon" iconFileName="next" @click="nextSong" />
            <SvgIcon class="icon" iconFileName="heart" />
          </div>
        </div>
      </div>
    </transition>

    <!--底部音乐播放栏-->
    <PlayerBar
      :nextSong="nextSong"
      :progressRatio="progressRatio"
      :togglePlayState="togglePlayState"
      :changeMode="changeMode"
      :modeInfo="{ modeText, modeIcon }"
    />
  </div>
  <!--         
        在谷歌浏览器中不允许媒体自动播放,除非设置静音播放或者与用户有交互行为(就可以调用play方法播放音乐)
    -->
  <audio
    ref="audioRef"
    @canplay="audioReady"
    @timeupdate="timeUpdate"
    @ended="playEnd"
  ></audio>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { getSongUrl } from "@/api/song";
import { formatTime } from "@/utils/fromatTime";
import Progress from "./components/Progress.vue";
import PlayerBar from "./components/PlayerBar.vue";
import controll from "./js/controll";

let audioRef = ref(null);
const store = useStore();
let duration = ref(0);
let { togglePlayState, prevSong, nextSong, changeMode, modeText, modeIcon } =
  controll(audioRef);

//当前播放列表
let musicPlayList = computed(() => store.state.musicPlayList);
//当前播放的歌曲对象
let currentSong = computed(() => store.getters.currentSong);
//全屏状态
let fullScreen = computed(() => store.state.fullScreen);
//当前播放状态
let playingState = computed(() => store.state.playingState);
//播放状态的图标
let playStateIcon = computed(() => (playingState.value ? "pause" : "play"));
//是否旋转唱片
let isRotate = computed(() => (playingState.value ? "play" : "pause"));
//当前已经播放的时间进度
let currentTime = ref(0);
//播放模式
let playMode = computed(() => store.state.playMode);

// 时间进度比 = 当前的播放时间 / 总时长
let progressRatio = computed(() => {
  if (!audioRef.value) return 0;
  return currentTime.value / duration.value;
});

//监听当前要播放的歌曲对象的变化
watch(currentSong, (newSong) => {
  //获取MP3的url
  getSongUrl(newSong.id)
    .then((res) => {
      const musicUrl = res.data.data[0].url;
      //设置audio的src
      audioRef.value.src = musicUrl;
      audioRef.value.play();
      store.commit("setPlayingState", true);
    })
    .catch((err) => {
      console.log("MP3获取失败", err);
    });
});
// 取消播放器的全屏状态
const cancelFullScreen = () => {
  store.commit("setFullScreen", false);
};
// 当audio准备就绪
function audioReady() {
  // 获取mp3的总时长
  duration.value = audioRef.value.duration;
}

//音频播放过程中不断触发
const timeUpdate = () => {
  currentTime.value = audioRef.value.currentTime;
};

//当音乐播放结束时
const playEnd = () => {
  audioRef.value.currentTime = 0;
  if (playMode.value === 1) {
    // 单曲循环
    audioRef.value.play()
  } else {
    // 播放下一首
    nextSong();
  }
};
//移动滑块时触发
const progressMove = (ratio) => {
  if (playingState.value) store.commit("setPlayingState", false);
  currentTime.value = audioRef.value.currentTime = ratio * duration.value;
};
//结束触摸滑块时触发
const progressEnd = (ratio) => {
  if (!playingState.value) store.commit("setPlayingState", true);
  currentTime.value = audioRef.value.currentTime = ratio * duration.value;
};
</script>

<style lang="less" scoped>
.player {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 199;

  // 过渡盒子的动画效果
  .player-transition {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: @main-background;
    &.player-enter-active,
    &.player-leave-active {
      transition: all 0.6s;
      .bg-cover,
      .player-header,
      .song-wrap,
      .player-footer {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.player-enter-from,
    &.player-leave-to {
      background: #fff;
      .player-header {
        transform: translateY(-100px);
      }
      .song-wrap {
        transform: scale(0);
      }
      .player-footer {
        transform: translateY(120px);
      }
    }
  }

  .bg-cover {
    position: absolute;
    left: 0;
    width: 100%;
    top: 0;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(30px);
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .player-header {
    position: relative;
    overflow: hidden;
    height: 60px;
    padding-top: 10px;
    text-align: center;
    box-sizing: border-box;
    .icon.back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      padding: 9px;
      width: 22px;
      height: 22px;
      color: #f0d0e0;
      transform: rotate(-90deg);
    }
    & > * {
      width: 50%;
      margin: 0 auto;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    h2 {
      height: 30px;
      line-height: 30px;
      font-size: @font-size-large;
      color: #fff;
    }
    h3 {
      height: 20px;
      line-height: 20px;
      font-size: @font-size-medium;
      color: #969595;
    }
  }
  .song-wrap {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 190px);
    // cd唱片区块
    .song-wrap-l {
      // position: absolute;
      // top: 0;
      // left: -200%;
      width: 100%;
      padding-top: 20px;
      //唱片圆盘
      .record-disc {
        overflow: hidden;
        // background-color: #fff;
        .rotate {
          position: relative;
          overflow: hidden;
          margin: 0 auto;
          width: 70vw;
          height: 70vw;
          border-radius: 50%;
          border: 10px solid rgba(255, 255, 255, 0.1);
          animation: rotate 20s linear infinite;
          &.play {
            animation-play-state: running;
          }
          &.pause {
            animation-play-state: paused;
          }
          img {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
          }
        }
      }
      // 歌词
      .song-lyric {
        overflow: hidden;
        width: 80%;
        margin: 30px auto 0 auto;
        text-align: center;
        line-height: 2em;
        font-size: @font-size-medium;
        color: @dark-color;
      }
    }
    // 歌词区块
    .song-wrap-r {
      position: absolute;
      left: -200%;
      top: 0;
      width: 100%;
      height: 100%;
      .lyric-block {
        text-align: center;
        font-size: @font-size-small;
        color: @dark-color;
        p {
          line-height: 30px;
        }
      }
      .active {
        color: #fff;
      }
    }
    .showBlock {
      left: 0;
    }
  }
  .player-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 30px;
    width: 80%;
    height: 100px;
    margin: 0 auto;
    // background-color: #fff;
    .player-progress {
      display: flex;
      align-items: center;
      width: 100%;
      margin: 0 auto;
      padding: 10px 0;
      color: #fff;
      .playtime {
        margin-right: 20px;
      }
      .endtime {
        margin-left: 10px;
      }
    }

    .player-controller {
      display: flex;
      height: 60px;
      align-items: center;
      .icon {
        width: 32px;
        height: 32px;
        flex: 1;
        color: #f0d0e0;
      }
    }
  }
}
</style>

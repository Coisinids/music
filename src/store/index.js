import { createStore } from 'vuex'

export default createStore({
  state: {
    // 当前音乐播放列表
    musicPlayList: [],

    // 随机顺序的音乐播放列表
    randomList: [],

    // 当前播放歌曲的下标
    currentIndex: 0,

    // 播放状态 ： true播放 false暂停
    playingState: false,

    // 播放模式: 0 顺序播放  1单曲循环  2随机播放  
    playMode: 0,

    // 全屏播放：true  展示底部播放条：false
    fullScreen: false
  },
  getters: {
    // 当前播放的歌曲对象
    currentSong(state){
      return state.musicPlayList[state.currentIndex] || {}
    }
  },
  mutations: {
    // 设置当前音乐播放列表
    setMusicPlayList(state, list){
      state.musicPlayList = list
    },
    // 设置随机音乐播放列表
    setRandomList(state, list){
      state.randomList = list
    },
    // 设置当前播放歌曲的下标
    setCurrentIndex(state, index){
      state.currentIndex = index
    },
    // 设置播放状态
    setPlayingState(state, isPlayState){
      state.playingState = isPlayState
    },
    // 设置播放模式
    setPlayMode(state, mode){
      state.playMode = mode
    },
    // 设置全屏播放的状态
    setFullScreen(state, isFullScreenState){
      state.fullScreen = isFullScreenState
    },
  },
  actions: {
    // 添加1首歌到播放列表
    addOneSong({state,commit}, song){
        //打开全屏播放
        commit("setFullScreen",true)
        let musicPlayList = state.musicPlayList.slice()
        let randomList = state.randomList.slice()
        let currentIndex = state.currentIndex

        //判断要添加的歌曲是否已经在播放列表中
        let addIndex = musicPlayList.findIndex(item=>item.id === song.id)
        if(addIndex === -1){
          //列表中不存在该歌曲
          currentIndex++
          musicPlayList.splice(currentIndex,0,song)
          randomList.push(song)
        }else{
          //已存在的歌曲在当前播放歌曲的后面
          if(addIndex > currentIndex){
            musicPlayList.splice(addIndex,1)
            currentIndex++
            musicPlayList.splice(currentIndex,0,song)
          }else{
            musicPlayList.splice(currentIndex+1,0,song)
            musicPlayList.splice(addIndex,1)
          }
        }
        //限制边界
        if(musicPlayList.length === 1) currentIndex = 0

        commit("setMusicPlayList",musicPlayList)
        commit("setRandomList",randomList)
        commit("setCurrentIndex",currentIndex)
        commit("setPlayingState",true)
    },
    //删除播放列表中的歌曲
    deleteSong({state,commit},song){
      let musicPlayList = state.musicPlayList.slice()
      let randomList = state.randomList.slice()
      let currentIndex = state.currentIndex
      
      //查找被删除歌曲的下标
      let deleteIndex = musicPlayList.findIndex(item=>item.id === song.id)

      //在随机音乐列表中查找被删除歌曲的下标
      let ranDeleteIndex = randomList.findIndex(item=>item.id === song.id)

      //查找不到
      if(deleteIndex < 0 | ranDeleteIndex < 0) return

      //删除对应歌曲
      musicPlayList.splice(deleteIndex,1)
      randomList.splice(ranDeleteIndex,1)

      //删除歌曲在当前播放歌曲之前
      if(deleteIndex < currentIndex) currentIndex--
      //删除歌曲是列表中最后一项，且当前正在播放
      if(musicPlayList.length === currentIndex) currentIndex = 0
      //删除歌曲后列表中没有歌曲了,暂停播放
      if(musicPlayList.length <= 0) commit("setPlayingState",false)
      
      //重新设置值
      commit("setMusicPlayList",musicPlayList)
      commit("setCurrentIndex",currentIndex)
      commit("setRandomList",randomList)
    },
    //改变播放状态
    changePlayMode({state,getters,commit},modelVal){

      let randomList = state.randomList.slice()
      let currentSong = getters.currentSong
      //随机播放时打乱表里歌曲的顺序
      if(modelVal === 2){
        commit("setMusicPlayList",randomList.sort((a,b)=>Math.random() - 0.5))
      }
      let index = state.musicPlayList.findIndex(item=>item.id === currentSong.id)
      commit("setCurrentIndex",index)
      commit("setPlayMode",modelVal)
    }
  },
  modules: {
  }
})

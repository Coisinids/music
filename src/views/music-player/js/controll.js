import { useStore } from "vuex";
import {computed,watch} from "vue"


export default function(audioRef){
    const store = useStore()
    const playingState = computed(()=>store.state.playingState)
    const musicPlayList = computed(()=>store.state.musicPlayList)
    const currentIndex = computed(()=>store.state.currentIndex)
    const modeTextArr = ["顺序播放", "单曲循环", "随机播放"]
    const modeIconArr = ["sequence", "loop", "random"]
    const playMode = computed(()=>store.state.playMode)
    const modeText = computed(()=>modeTextArr[playMode.value])
    const modeIcon = computed(()=> modeIconArr[playMode.value])

    //监听歌曲的播放状态
    watch(playingState,(newState)=>{
        newState?audioRef.value.play():audioRef.value.pause()
    })

    //播放 or 暂停
    const togglePlayState = ()=>{
        store.commit("setPlayingState",!playingState.value)
    }
    //切换上一首
    const prevSong = ()=>{
        switchSong(currentIndex.value - 1)
    }
    //切换下一首
    const nextSong = ()=>{
        switchSong(currentIndex.value + 1)
    }
    const switchSong = (index)=>{
        let length = musicPlayList.value.length
        //当列表里没有歌曲或者只有一首歌时
        if(length <= 1) return store.commit("setPlayingState",false)
        if(index === length) index = 0
        if(index < 0) index = length - 1
        store.commit("setCurrentIndex",index)
    }
    const changeMode = async ()=>{
        const modelVal = (playMode.value + 1) % 3
        store.dispatch("changePlayMode",modelVal)
    }
    
    return {
        togglePlayState,
        prevSong,
        nextSong,
        changeMode,
        modeText,
        modeIcon
    }

}
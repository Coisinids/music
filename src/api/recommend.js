import request from "@/utils/axios"

// 请求推荐区域的轮播图片
export function getRecommendSwiper(){
    return request({
        url: '/banner',
        method: 'get'
    })
}

// 推荐歌单的列表数据
export function getRecommendPlaylist(){
    return request({
        url: '/personalized',
        method: 'get',
        params: {
            limit: 6 //默认30
        }
    })
}

// 推荐新歌的列表数据
export function getRecommendNewSong(){
    return request({
        url: '/personalized/newsong',
        method: 'get',
        params: {
            limit: 4 //默认10
        }
    })
}

// 推荐歌单的详情数据
export function getPlaylistDetail(id){
    return request({
        url: '/playlist/detail',
        method: 'get',
        params: {
            id
        }
    })
}



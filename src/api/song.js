import request from "@/utils/axios"

// 根据id请求完整的歌曲对象
export function getSongDetail(ids){
    return request({
        url: '/song/detail',
        method: 'get',
        params:{
            ids
        }
    })
}

// 请求mp3
export function getSongUrl(id){
    return request({
        url: '/song/url',
        method: 'get',
        params:{
            id 
        }
    })
}
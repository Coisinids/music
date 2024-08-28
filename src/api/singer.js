import request from "@/utils/axios"

// 请求热门歌手数据
export function getHotSinger(){
    return request({
        url: '/top/artists',
        method: 'get',
        params:{
            limit: 30  //数量, 默认50条
        }
    })
}

// 根据 字母 请求相同首字母名称的歌手的数据
export function getSingerList(letter){
    return request({
        url: '/artist/list',
        method: 'get',
        params:{
            initial: letter,
            // initial: "B",  // 表示查找首字母为B发音的歌手的数据
            type: -1,  //全部性别
            area: 7 //华语歌手
        }
    })
}
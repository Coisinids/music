import request from "@/utils/axios"

// 获取所有排行榜
export function getRankingList(){
    return request({
        url: '/toplist',
        method: 'get'
    })
}
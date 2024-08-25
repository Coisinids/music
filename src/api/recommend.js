import request from "@/utils/axios";
// 请求推荐区域的轮播图片
export function getSwiperImg(parmas){
    return request({
        url: '/banner',
        method: 'get',
        parmas
    })
}
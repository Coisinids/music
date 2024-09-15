// 处理秒数, 返回 00 : 00格式
export function formatTime(time){
    time = time | 0
    // 转分钟
    let m = String((time / 60) | 0).padStart(2, 0) 

    // 转秒数
    let s = String(time % 60).padStart(2, 0) 

    return `${m}:${s} `
}
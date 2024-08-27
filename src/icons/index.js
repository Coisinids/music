const request = require.context("./svg",false,/\.svg$/)
//request.keys() : 得到./svg目录下所有符合条件的文件的相对路径
request.keys().forEach(src => {
    //将路径传入request，实现批量添加路径
    request(src)
});
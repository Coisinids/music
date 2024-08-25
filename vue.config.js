const { defineConfig } = require('@vue/cli-service')
const path = require("path")

const { VantResolver } = require('@vant/auto-import-resolver');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  // 实现项目中使用的UI组件为自动按需导入
  configureWebpack: {
    plugins: [
      AutoImport.default({
        resolvers: [VantResolver()],
      }),
      Components.default({ resolvers: [VantResolver()] }),
    ],
  },
  pluginOptions:{
    // 设置全局样式的loader
    "style-resources-loader": {
      // 指定使用less
      preProcessor: "less",
      // 指定路径, 允许多个
      patterns: [
        // 任意组件的style内都能访问该less文件中的变量
        path.join(__dirname, "./src/styles/variable.less")
      ]
    }
  },
  chainWebpack(config){
    // 配置svg的loader
    config.module.rules.delete("svg"); //重点:删除默认配置中处理svg
    config.module
      .rule('svg')
      .exclude.add(path.join(__dirname, './src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.join(__dirname, './src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'  // 设置引用svg图标的类名
      })
      .end()
  }
})

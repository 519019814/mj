'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
// gizp doc => https://webpack.docschina.org/plugins/compression-webpack-plugin/#root
const CompressionWebpackPlugin = require('compression-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'Admin' // page title
console.log('当前环境：' + process.env.VUE_APP_NODE_ENV)
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

// Vue Cli Doc https://cli.vuejs.org/config/

module.exports = {
  /**
   * 如果需要部署在子路径下，参见: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/mj',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.VUE_APP_NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    before: require('./mock/mock-server.js')
    // proxy: {
    //   // 配置跨域
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: `https://swagger.zjdmwh.cn`,
    //     // target: 'http://192.168.0.200:1866'
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ['^' + process.env.VUE_APP_BASE_API]: ''
    //     }
    //   }
    // }
  },
  configureWebpack: {
    // 插入到document.title之后的字段
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // 资源预加载，可以提升首屏加载速度 => <link href="/static/js/app.js" rel="preload" as="script">
    // https://webpack.docschina.org/guides/code-splitting/#prefetchingpreloading-modules
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    config.plugins.delete('prefetch')
    // svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config
      .when(process.env.VUE_APP_NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
    // g-zip开启
    config.plugin('CompressionWebpackPlugin').use(CompressionWebpackPlugin, [
      {
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        minRatio: 0.8
      }
    ])
  }
}

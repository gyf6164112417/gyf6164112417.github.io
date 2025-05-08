const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/gyf6164112417.github.io/',
  
  // Production optimization
  productionSourceMap: false,
  
  // Dev server configuration
  devServer: {
    host: '0.0.0.0', // Allow access from network
    port: 8081, // Explicitly specify port
    historyApiFallback: true,
    hot: true,
    compress: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      },
      progress: true  // 显示编译进度
    }
  },
  
  // Build optimization
  configureWebpack: {
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      maxEntrypointSize: 1024000,  // 增加入口文件大小限制
      maxAssetSize: 1024000  // 增加资源文件大小限制
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000,
        minChunks: 1,
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      },
      runtimeChunk: 'single',  // 提取运行时代码为单独的chunk
      moduleIds: 'deterministic'  // 使用确定性的模块ID以改善缓存
    }
  },
  
  // CSS optimization
  css: {
    extract: process.env.NODE_ENV === 'production',
    sourceMap: false,
    loaderOptions: {
      css: {
        // 启用CSS模块和缓存
        modules: {
          auto: true,
          localIdentName: '[name]_[local]_[hash:base64:5]'
        }
      }
    }
  },
  
  // 增加编译缓存以提高性能
  chainWebpack: config => {
    config.cache({
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.cache')
    });
    
    // 优化Vue组件加载
    if (process.env.NODE_ENV === 'production') {
      config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => ({
          ...options,
          compilerOptions: {
            // 跳过静态内容预处理以提高编译速度
            whitespace: 'condense'
          }
        }));
    }
  }
})

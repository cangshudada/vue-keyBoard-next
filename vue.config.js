const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  productionSourceMap: false,
  pages: {
    index: {
      entry: resolve("./example/main.ts"),
      template: resolve("./public/index.html"),
      filename: 'index.html'
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('./packages')),
      // 配置svg默认规则排除icons目录中svg文件处理
      config.module
        .rule("svg")
        .exclude.add(resolve("./packages/icons"))
        .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("./packages/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({ symbolId: "icon-[name]" })
      .end();
  },
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 384,
            unitPrecision: 5, // 最小精度，小数点位数
            minPixelValue: 2 // 替换的最小像素值
          })
        ]
      }
    }
  },
}
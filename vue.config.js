module.exports = {
  chainWebpack: config => {
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker')
      .loader('worker-loader')
      .options({
        inline: 'fallback'
      })
    config.output.globalObject('this')
    config.module.rule('js').exclude.add(/\.worker\.js$/)
  }
}

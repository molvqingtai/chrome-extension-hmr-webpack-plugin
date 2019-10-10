
const PLUGIN_NAME = 'ChromeExtensionHmrWebpackPlugin'

class ChromeExtensionHmrWebpackPlugin {
  constructor ({ port, manifest }) {
    console.log('插件加载成功！！！！！！')
    this.port = port || 1234
    this.manifest = manifest || null
  }
  watchRun (compiler, callback) {
    console.log(this.port)
    callback()
  }
  afterOptimizeChunkAssets (chunks) {
    debugger
    chunks.forEach(chunk => {
      console.log(chunk)
    })
  }
  apply (compiler) {
    compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, this.watchRun.bind(this))
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => compilation.hooks.afterOptimizeChunkAssets.tap(PLUGIN_NAME, this.afterOptimizeChunkAssets.bind(this)))
  }
}

module.exports = ChromeExtensionHmrWebpackPlugin

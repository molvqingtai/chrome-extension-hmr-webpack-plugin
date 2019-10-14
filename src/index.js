import { ConcatSource } from 'webpack-sources'
import { $require } from './utils'
import * as client from 'raw-loader!./client'
import { merge, template } from 'lodash'

const PLUGIN_NAME = 'ChromeExtensionHmrWebpackPlugin'

export default class ChromeExtensionHmrWebpackPlugin {
  constructor ({ port, manifest }) {
    console.log('插件加载成功！！！！！！')
    this.port = port || 1234
    this.manifestPath = manifest || null
    this.manifest = null
  }
  watchRun (compiler, callback) {
    callback()
  }
  compile (compilation) {
    this.manifest = $require(this.manifestPath)
    debugger
    console.log('manifest', this.manifest)
  }

  afterOptimizeChunkAssets (compilation, chunks) {
    const host = `ws://localhost:${this.port}/`
    if (!this.server || !this.manifest) return false
    const { background } = this.manifest
    let assets = chunks.reduce((res, chunk) => {
      let [filename] = chunk.files
      if (/\.js$/.test(filename)) {
        let source = template(client)({
          filename,
          id: chunk.id,
          name: chunk.name || null,
          host
        })
        res[filename] = new ConcatSource([source, compilation.assets[filename]])
      }
      return res
    }, {})
    debugger
    if (!background || !(background.page || background.scripts)) {
      let scripts = 'background.reload.js'
      let source = template(client)({
        filename: [scripts],
        id: '-1',
        name: scripts,
        WSHost
      })
      this.manifest.background = { scripts: [scripts], persistent: false }
      assets[scripts] = {
        source: () => source,
        size: () => source.length
      }
    }
    compilation.assets = Object.assign({}, comp.assets, assets)
  }
  emit (compilation, callback) {
    debugger
    if (this.manifest) {
      compilation.fileDependencies.add(this.manifestPath)
      let source = JSON.stringify(this.manifest)
      compilation.assets['manifest.json'] = {
        source: () => source,
        size: () => source.length
      }
    }
    callback()
  }
  afterEmit (compilation, callback) {

  }
  apply (compiler) {
    // 监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前。
    compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, this.watchRun.bind(this))

    // 一个新的编译(compilation)创建之后，钩入(hook into) compiler。
    compiler.hooks.compile.tap(PLUGIN_NAME, this.compile.bind(this))

    // chunk 资源(asset)已经被优化。
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => compilation.hooks.afterOptimizeChunkAssets.tap(PLUGIN_NAME, this.afterOptimizeChunkAssets.bind(this, compilation)))

    // 生成资源到 output 目录之前。
    compiler.hooks.emit.tapAsync(PLUGIN_NAME, this.emit.bind(this))

    // 生成资源到 output 目录之后。
    compiler.hooks.afterEmit.tapAsync(PLUGIN_NAME, this.afterEmit.bind(this))
  }
}

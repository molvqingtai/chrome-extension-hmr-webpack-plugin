// import { ConcatSource } from 'webpack-sources'
// const Module = require('module')
// const fs = require('fs')
import fs from 'fs'
import Module from 'module'

const PLUGIN_NAME = 'ChromeExtensionHmrWebpackPlugin'

const requirePath = filename => {
  if (!fs.existsSync(filename)) {
    throw new TypeError('Not found manifest file!')
  }
  const code = fs.readFileSync(filename, 'utf8')
  const module = new Module(filename)
  module.filename = filename
  module._compile(code, filename)
  module.paths = Module._nodeModulePaths(filename)
  return module.exports
}

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
    this.manifest = requirePath(`${this.manifestPath}`)
    debugger
    const test = require(this.manifestPath)
    debugger
    console.log('manifest', this.manifest)
  }

  afterOptimizeChunkAssets (compilation, chunks) {
    const host = `ws://localhost:${this.port}/`
    const { background } = this.manifest
    // const assets = chunks.reduce((res, chunk) => {
    //   const [filename] = chunk.files
    //   if (/\.js$/.test(filename)) {
    //     const source = template(client)({
    //       filename,
    //       id: chunk.id,
    //       name: chunk.name || null,
    //       host
    //     })
    //     res[filename] = new ConcatSource(source, compilation.assets[filename])
    //   }
    //   return res
    // }, {})
    debugger
    // chunks.forEach(chunk => {
    //
    // })
  }
  apply (compiler) {
    // 监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前。
    compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, this.watchRun.bind(this))

    // 一个新的编译(compilation)创建之后，钩入(hook into) compiler。
    compiler.hooks.compile.tap(PLUGIN_NAME, this.compile.bind(this))

    // chunk 资源(asset)已经被优化。
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => compilation.hooks.afterOptimizeChunkAssets.tap(PLUGIN_NAME, this.afterOptimizeChunkAssets.bind(this, compilation)))
  }
}

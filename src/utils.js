import fs from 'fs'
import Module from 'module'

export const $require = filename => {
  try {
    if (!fs.existsSync(filename)) {
      throw new TypeError('Not found manifest file!')
    }
    const code = fs.readFileSync(filename, 'utf8')
    const module = new Module(filename)
    module.filename = filename
    module._compile(code, filename)
    module.paths = Module._nodeModulePaths(filename)
    return module.exports
  } catch (e) {
    console.log(e)
  }
}

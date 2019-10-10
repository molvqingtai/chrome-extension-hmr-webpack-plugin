const path = require('path')

module.exports = {
  mode: 'development',
  watch: true,
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  }
}

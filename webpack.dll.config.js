const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    dll: ['preact', 'preact/hooks'],
  },
  // 这个是输出 dll 文件
  output: {
    path: path.resolve(__dirname, 'dll'),
    filename: '[name].js',
    library: '[name]',
  },
  // 这个是输出映射表
  plugins: [
    new webpack.DllPlugin({
      name: '[name]', // name === output.library
      path: path.resolve(__dirname, 'dll/[name].manifest.json'),
    })
  ]
};
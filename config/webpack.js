const path = require('path')
const config = require('config')
const webpack = require('webpack')

const ROOT_DIR = path.resolve(__dirname, '..')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './src/client',
  ],
  output: {
    path: path.join(ROOT_DIR, 'public'),
    filename: 'app.js',
    publicPath: '/',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: path.join(ROOT_DIR, 'src', 'client'),
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    alias: {
      react: path.join(ROOT_DIR, 'node_modules', 'react'),
    },
    extensions: ['', '.js', '.jsx'],
    root: ROOT_DIR,
  },
  resolveLoader: {
    fallback: path.join(ROOT_DIR, 'node_modules')
  },
}

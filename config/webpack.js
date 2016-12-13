const path = require('path')
const config = require('config')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const ROOT_DIR = path.resolve(__dirname, '..')

const devtool = 'cheap-module-eval-source-map'
const entry = [
  './src/client',
]
const output = {
  path: path.join(ROOT_DIR, 'public'),
  filename: 'app.js',
  publicPath: '/',
}
const resolve = {
  extensions: ['', '.js', '.jsx'],
  root: ROOT_DIR,
}

const cssLoaderOpts = 'css?modules&localIdentName=[name]__[local]__[hash:base64:5]'
const loaders = [{
  test: /\.jsx?$/,
  loaders: ['babel'],
  include: path.join(ROOT_DIR, 'src', 'client'),
}, {
  test: /\.css$/,
  loader: config.app.minify ?
    ExtractTextPlugin.extract('style', cssLoaderOpts) :
    `style!${cssLoaderOpts}`,
  include: path.join(ROOT_DIR, 'src', 'client'),
}]

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      APP_BASE_URL: JSON.stringify(config.app.baseURL),
      IDM_BASE_URL: JSON.stringify(config.app.idmBaseURL),
      KEEN_API_PROJECT_ID_FLOW: JSON.stringify(config.api.keen.projects.flow.projectId),
      KEEN_API_READ_KEY_FLOW: JSON.stringify(config.api.keen.projects.flow.readKey),
      KEEN_API_PROJECT_ID_QUALITY: JSON.stringify(config.api.keen.projects.quality.projectId),
      KEEN_API_READ_KEY_QUALITY: JSON.stringify(config.api.keen.projects.quality.readKey),
      KEEN_API_PROJECT_ID_USABILITY: JSON.stringify(config.api.keen.projects.usability.projectId),
      KEEN_API_READ_KEY_USABILITY: JSON.stringify(config.api.keen.projects.usability.readKey),
      KEEN_API_PROJECT_ID_SENTIMENT: JSON.stringify(config.api.keen.projects.sentiment.projectId),
      KEEN_API_READ_KEY_SENTIMENT: JSON.stringify(config.api.keen.projects.sentiment.readKey),
    },
  })
]

if (config.app.hotReload) {
  plugins.push(new webpack.HotModuleReplacementPlugin())
  entry.splice(0, 0, 'react-hot-loader/patch', 'webpack-hot-middleware/client')
}

if (config.app.minify) {
  plugins.push(new ExtractTextPlugin('app.css'))
}

module.exports = {
  devtool,
  entry,
  output,
  module: {loaders},
  plugins,
  resolve,
  resolveLoader: {fallback: path.join(ROOT_DIR, 'node_modules')},
}

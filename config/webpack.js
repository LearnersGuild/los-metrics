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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        APP_BASE_URL: JSON.stringify(config.server.baseURL),
        IDM_BASE_URL: JSON.stringify(config.server.idmBaseURL),
        KEEN_API_PROJECT_ID_FLOW: JSON.stringify(config.api.keen.projects.flow.projectId),
        KEEN_API_READ_KEY_FLOW: JSON.stringify(config.api.keen.projects.flow.readKey),
        KEEN_API_PROJECT_ID_QUALITY: JSON.stringify(config.api.keen.projects.quality.projectId),
        KEEN_API_READ_KEY_QUALITY: JSON.stringify(config.api.keen.projects.quality.readKey),
        KEEN_API_PROJECT_ID_USABILITY: JSON.stringify(config.api.keen.projects.usability.projectId),
        KEEN_API_READ_KEY_USABILITY: JSON.stringify(config.api.keen.projects.usability.readKey),
        KEEN_API_PROJECT_ID_SENTIMENT: JSON.stringify(config.api.keen.projects.sentiment.projectId),
        KEEN_API_READ_KEY_SENTIMENT: JSON.stringify(config.api.keen.projects.sentiment.readKey),
      },
    }),
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

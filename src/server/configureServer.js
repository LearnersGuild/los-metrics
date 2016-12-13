import config from 'config'

export default function configureServer(app) {
  if (config.app.hotReload) {
    const webpack = require('webpack')
    const devMiddleware = require('webpack-dev-middleware')
    const hotMiddleware = require('webpack-hot-middleware')
    const webpackConfig = require('../../config/webpack')

    const compiler = webpack(webpackConfig)

    app.use(devMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      historyApiFallback: true,
      quiet: true,
    }))
    app.use(hotMiddleware(compiler))
  }
}

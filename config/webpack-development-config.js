const webpack = require('webpack')
const path = require('path')

module.exports = {

  entry: {
    app: [
      'webpack-hot-middleware/client',
      'bootstrap-loader',
      './client',
    ]
  },

  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'app.js',
  },

  devtool: '#cheap-module-eval-source-map',

  resolve: {extensions: ['', '.js', '.jsx']},

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          plugins: [
            ['react-transform', {
              transforms: [{
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'],
              }],
            }],
          ],
        },
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]',
        ],
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]',
          'sass',
          'sass-resources',
        ],
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loaders: ['url?limit=10000'],
      },
    ],
  },

  sassResources: './config/sass-resources.scss',
}

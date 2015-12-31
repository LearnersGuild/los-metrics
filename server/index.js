/* eslint-disable no-undef */
require('babel-core/register')

const fs = require('fs')
const path = require('path')

// CSS modules on server-side in development.
setupCssModulesRequireHook()

// These may also be defined by webpack on the client-side.
global.__CLIENT__ = false
global.__SERVER__ = true
global.__DEVELOPMENT__ = process.env.NODE_ENV === 'development'
global.__DEVTOOLS__ = global.__CLIENT__ && global.__DEVELOPMENT__

function setupCssModulesRequireHook() {
  const hook = require('css-modules-require-hook')
  const sass = require('node-sass')
  hook({
    extensions: [ '.scss' ],
    generateScopedName: '[name]__[local]__[hash:base64:5]',
    preprocessCss: (css) => {
      const resourcesScss = fs.readFileSync(path.join(__dirname, '..', 'config', 'sass-resources.scss'))
      const result = sass.renderSync({
        data: resourcesScss + css
      })
      return result.css
    }
  })
}

if (__DEVELOPMENT__) {
  if (require('piping')()) {
    // application logic here
    require('dotenv').load()
    require('./server').start()
  }
} else {
  require('./server').start()
}

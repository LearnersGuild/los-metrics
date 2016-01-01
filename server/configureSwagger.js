import fs from 'fs'
import path from 'path'

import swaggerTools from 'swagger-tools'
import YAML from 'yamljs'
import ejs from 'ejs'
import fetch from 'isomorphic-fetch'


// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const swaggerDoc = YAML.load(path.join(__dirname, '../config/swagger.yaml'))

// Customize the look-and-feel of the Swagger docs.
export function replaceSwaggerUiHtml(iconsMetadataTagsHtml) {
  const title = 'product metrics API'
  const logoUrl = 'https://lg-icons.herokuapp.com/favicon-32x32.png'
  const customSwaggerUiTemplateFilename = path.join(__dirname, '..', 'public', 'templates', 'swagger-docs.html.ejs')
  const swaggerUiHtmlFilename = path.join(__dirname, '..', 'node_modules', 'swagger-tools', 'middleware', 'swagger-ui', 'index.html')

  const templateData = fs.readFileSync(customSwaggerUiTemplateFilename).toString('utf-8')
  const renderedTemplate = ejs.render(templateData, { title, logoUrl, iconsMetadataTagsHtml })
  fs.writeFileSync(swaggerUiHtmlFilename, renderedTemplate.toString())
}

export default function configureSwagger(app) {
  return new Promise((resolve) => {
    // Fetch the icons data and then generate the Swagger HTML file.
    fetch(process.env.ICONS_SERVICE_TAGS_API_URL)
      .then((resp) => {
        return resp.json()
      }).then((tags) => {
        return tags.join('\n        ')
      }).then((iconsMetadataTagsHtml) => replaceSwaggerUiHtml(iconsMetadataTagsHtml))

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
      // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
      app.use(middleware.swaggerMetadata())

      // Validate Swagger requests
      app.use(middleware.swaggerValidator())

      // Route validated requests to appropriate controller
      app.use(middleware.swaggerRouter({ useStubs: false, controllers: path.join(__dirname, 'controllers') }))

      // Serve the Swagger documents and Swagger UI
      app.use(middleware.swaggerUi())

      // Start the server
      return resolve()
    })
  })
}

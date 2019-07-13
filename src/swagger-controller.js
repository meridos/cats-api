const swaggerJSDoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cats API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes.js'],
}

const swaggerSpec = swaggerJSDoc(options)

function getSwaggerDefinition(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
}

module.exports = {
  getSwaggerDefinition,
  swaggerSpec,
}

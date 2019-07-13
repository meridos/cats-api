const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')

const {
  addCatByName,
  deleteCatByName,
  getCatById,
  searchCatByName,
} = require('./cats-controller')
const { getSwaggerDefinition, swaggerSpec } = require('./swagger-controller')
const { serverPort } = require('./configs')

const app = express()
app.use(bodyParser.json())

/**
 * @swagger
 *
 * /cats/create-new:
 *   post:
 *     description: Добавление нового кота
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Имя кота
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
app.post('/cats/create-new', addCatByName)
app.get('/cats/get-by-id', getCatById)
app.get('/cats/search-by-name', searchCatByName)
app.delete('/cats/delete-by-name', deleteCatByName)

app.get('/api-docs', getSwaggerDefinition)

app.use('/api-docs-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(serverPort)

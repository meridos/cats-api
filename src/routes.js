const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')

const {
  addCats,
  deleteCatByName,
  getCatById,
  getCatsByGender,
  searchCatsByName,
  saveCatDescription,
  getCatValidationRules,
} = require('./cats-controller')
const { swaggerSpec } = require('./swagger-controller')
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
app.post('/cats/add', addCats)
app.get('/cats/get-by-id', getCatById)
app.get('/cats/get-by-gender', getCatsByGender)
app.post('/cats/search', searchCatsByName)
app.delete('/cats/delete-by-name', deleteCatByName)
app.post('/cats/save-description', saveCatDescription)
app.get('/cats/validation', getCatValidationRules)
app.use('/api-docs-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(serverPort)

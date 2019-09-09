const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')

const {
  addCats,
  deleteCatByName,
  getCatById,
  searchCatsByParams,
  searchCatsByNamePattern,
  saveCatDescription,
  getCatValidationRules,
  getAllCats
} = require('./cats-controller')
const { swaggerSpec } = require('./swagger-controller')
const { serverPort } = require('./configs')

const app = express()
app.use(bodyParser.json())

app.post('/cats/add', addCats)
app.get('/cats/get-by-id', getCatById)
/**
 * @swagger
 *
 * /cats/search:
 *   get:
 *     description: Поиск по имени и доп.характеристикам
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Имя кота
 *         required: true
 *         type: string
 *       - name: genders
 *         description: Список полов (м, ж, унисекс)
 *         required: true
 *         type: array
 *     responses:
 *       200:
 *         description: login
 */
app.post('/cats/search', searchCatsByParams)
app.get('/cats/search-pattern', searchCatsByNamePattern)
app.delete('/cats/delete-by-name', deleteCatByName)
app.post('/cats/save-description', saveCatDescription)
app.get('/cats/validation', getCatValidationRules)
app.get('/cats/getall', getAllCats)
app.use('/api-docs-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(serverPort)

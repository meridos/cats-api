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

/**
 * Документация по описанию swagger:
 * https://swagger.io/docs/specification/about/
 */
/**
 * @swagger
 *
 * definitions:
 *   GenderEnum:
 *     type: string
 *     enum: [male, female, unisex]
 */

app.post('/cats/add', addCats)
app.get('/cats/get-by-id', getCatById)
/**
 * @swagger
 *
 * /cats/search:
 *   post:
 *     description: Поиск по имени и доп.характеристикам
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Фильтр поиска имени
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 description: Имя кота
 *                 type: string
 *                 required: true
 *               genders:
 *                 description: Пол кота
 *                 type: array
 *                 items:
 *                   $ref: '#/definitions/GenderEnum'
 *     responses:
 *       200:
 *         description: Имена по группам алфавита с их количеством
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groups:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       count:
 *                         type: number
 *                       cats:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: number
 *                             name:
 *                               type: string
 *                             description:
 *                               type: string
 *                             tags:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             gender:
 *                               $ref: '#/definitions/GenderEnum'
 */

app.post('/cats/search', searchCatsByParams)

/**
 * @swagger
 *
 * /cats/search-pattern:
 *   get:
 *     description: Поиск по части начала имени
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Часть начала имени
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Ограничение вывода количества имен
 *     responses:
 *       200:
 *         description: список имен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 gender:
 *                   $ref: '#/definitions/GenderEnum'
 */
app.get('/cats/search-pattern', searchCatsByNamePattern)
app.delete('/cats/delete-by-name', deleteCatByName)
app.post('/cats/save-description', saveCatDescription)
app.get('/cats/validation', getCatValidationRules)
app.use('/api-docs-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(serverPort)

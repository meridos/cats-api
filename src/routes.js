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
  uploadCatImage,
} = require('./cats-controller')
const { swaggerSpec } = require('./swagger-controller')
const { serverPort } = require('./configs')
const { upload } = require('./multer')

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
app.use('/api-docs-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
/**
 * @swagger
 *
 * /cats/:id/upload:
 *   post:
 *     description: Добавление изображения кота
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id кота
 *       - in: formData
 *         name: image
 *         schema:
 *           type: file
 *         description: Изображение кота
 *     responses:
 *       200:
 *         description: Имя загруженного изображения
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 */
app.post('/cats/:id/upload', upload.single('file'), uploadCatImage)

app.listen(serverPort)


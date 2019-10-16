const { Pool } = require('pg')
const { pgUser, pgPass, pgDb, pgHost } = require('./configs.js')
const { logger } = require('./logger')

const pool = new Pool({
  user: pgUser,
  database: pgDb,
  password: pgPass,
  host: pgHost,
})

pool.on('error', err => {
  console.error('Ошибка БД', err)
  process.exit(-1)
})

/**
 * Добавляем котов в БД
 */
function addCats(cats) {
  const inserts = []

  for (let i = 0; i < cats.length; i++) {
    const { name, description, gender } = cats[i]

    const insert = pool
      .query(
        'INSERT INTO Cats(name, description, gender) VALUES ($1, $2, $3) RETURNING *',
        [name, description, gender],
      )
      .then(insertResult => insertResult.rows[0])

    inserts.push(insert)
  }

  return Promise.all(inserts)
}

/**
 * Возвращаем всех котов
 */
function allCats(gender) {
  const queryAll = 'SELECT * FROM Cats ORDER BY LOWER(name)'
  const queryWithGender = `SELECT * FROM Cats WHERE gender = '${gender}' ORDER BY LOWER(name)`

  return pool
    .query(gender ? queryWithGender : queryAll)
    .then(selectResult => selectResult.rows)
}


/**
 * Поиск котов по указанным параметрам в БД
 * @param {*} searchParams - список параметров для поиска, переданные от клиента (имя, пол (м,ж, унисекс))
 */
function findCatsByParams(searchParams) {
  const catName = searchParams.name
  const genderFilter = searchParams.gender ? ` AND gender = '${searchParams.gender}'` : ''

  logger.info(`searching cats by name: ${catName} and gender: ${searchParams.gender}`)

  return pool
    .query(
      `SELECT * FROM Cats WHERE name ILIKE $1${genderFilter} ORDER BY LOWER(name)`,
      [`%${catName}%`],
    )
    .then(selectResult => selectResult.rows)
}

function findCatById(catId) {
  return pool
    .query('SELECT * FROM Cats WHERE id = $1', [catId])
    .then(selectResult => {
      if (selectResult.rows.length == 0) {
        return null
      }

      return selectResult.rows[0]
    })
}

function findCatByNamePattern(catName, limit) {
  limit = Number(limit)

  const limitQuery = limit > 0
    ? ` LIMIT ${limit}`
    : ''

  return pool
    .query(
      `SELECT * FROM Cats WHERE LOWER(name) LIKE LOWER ($1) ORDER BY id ASC${limitQuery}`,
      [catName + '%'],
    )
    .then(selectResult => {
      if (selectResult.rows.length == 0) {
        return null
      }

      return selectResult.rows
    })
}

/**
 * Сохранение описания кота в БД
 * @param {*} catId - идентификатор кота, отправленный клиентом
 * @param {*} catDescription - описание кота
 */
function saveCatDescription(catId, catDescription) {
  return pool
    .query('UPDATE Cats SET description = $1 WHERE id = $2 RETURNING *', [
      catDescription,
      catId,
    ])
    .then(updateResult => {
      if (updateResult.rows.length == 0) {
        return null
      }

      return updateResult.rows[0]
    })
}

/**
 * Поиск правил валидации в БД
 */
function findCatsValidationRules() {
  return pool
    .query('SELECT * FROM Cats_Validations WHERE type = $1', ['search'])
    .then(selectResult => selectResult.rows)
}

/**
 * Поиск правил валидации в БД для добавляемых имен
 */
function findAddingCatsValidationRules() {
  return pool
    .query('SELECT * FROM Cats_Validations WHERE type = $1', ['add'])
    .then(selectResult => selectResult.rows)
}

/**
 * Добавление изображения в БД
 */
function uploadCatImage(image_link, cat_id) {

  return pool
    .query(
      'INSERT INTO Images (link, id_cat) VALUES ($1, $2) RETURNING *', [image_link, cat_id])
    .then(insertResult => insertResult.rows[0])
}

/**
 * Получение изображений кота
 */
function getCatImages(catId) {
  return pool
    .query('SELECT Link FROM Images WHERE id_cat = $1', [catId])
    .then(selectResult => {
      if (selectResult.rows.length == 0) {
        return null
      }

      return selectResult.rows
    })
}

/**
 * Получение человеческой ошибки от БД по коду
 * @param {string} errCode
 * @returns {string|null}
 */
function getErrorText(errCode) {
  switch (errCode) {
    case '23505':
      return `Такое значение уже существует`;
    default:
      return null;
  }
}


module.exports = {
  addCats,
  findCatsByParams,
  findCatByNamePattern,
  findCatById,
  saveCatDescription,
  findCatsValidationRules,
  findAddingCatsValidationRules,
  uploadCatImage,
  getCatImages,
  allCats,
  getErrorText,
}

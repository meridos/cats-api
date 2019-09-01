const { Pool } = require('pg')
const { pgUser, pgPass, pgDb, pgHost } = require('./configs.js')

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

function addCats(cats) {
  const inserts = []

  for (let i = 0; i < cats.length; i++) {
    const { name, description, gender } = cats[i]

    const insert = pool
      .query(
        'INSERT INTO Cats(name, description, gender) VALUES ($1, $2, $3) RETURNING *',
        [name, description, gender]
      )
      .then(insertResult => insertResult.rows[0])

    inserts.push(insert)
  }

  return Promise.all(inserts)
}

/**
 * Поиск котов по указанным параметрам в БД
 * @param {*} searchParams - список параметров для поиска, переданные от клиента (имя, пол (м,ж, унисекс))
 */
function findCatsByParams(searchParams) {
  const catName = searchParams.name
  const catGenders = searchParams.genders

  if (catGenders.length === 0) {
    return pool
      .query('SELECT * FROM Cats WHERE name ILIKE $1', [`%${catName}%`])
      .then(selectResult => selectResult.rows)
  } else {
    const whereIn = catGenders.map((gender, i) => `$${i + 2}`).join(',')
    return pool
      .query(
        `SELECT * FROM Cats WHERE name ILIKE $1 AND gender IN (${whereIn})`,
        [`%${catName}%`, ...catGenders]
      )
      .then(selectResult => selectResult.rows)
  }
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

function findCatByNamePattern(catName) {
  return pool
    .query(
      'SELECT * FROM Cats WHERE LOWER(name) LIKE LOWER ($1) ORDER BY id ASC LIMIT 20',
      [catName + '%']
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
    .query('SELECT * FROM Cats_Validations')
    .then(selectResult => selectResult.rows)
}

module.exports = {
  addCats,
  findCatsByParams,
  findCatByNamePattern,
  findCatById,
  saveCatDescription,
  findCatsValidationRules,
}

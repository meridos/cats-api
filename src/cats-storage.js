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

function findCatsByName(catName) {
  return pool
    .query('SELECT * FROM Cats WHERE name ILIKE $1', [`%${catName}%`])
    .then(selectResult => selectResult.rows)
}

function findCatsByGender(catGender) {
  return pool
    .query('SELECT * FROM Cats WHERE gender = $1', [catGender])
    .then(selectResult => {
      if (selectResult.rows.length == 0) {
        return null
      }

      return selectResult.rows
    })
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

function findCatsValidationRules() {
  return pool
    .query('SELECT * FROM Cats_Validations')
    .then(selectResult => selectResult.rows)
}

module.exports = {
  addCats,
  findCatsByName,
  findCatById,
  findCatsByGender,
  saveCatDescription,
  findCatsValidationRules
}

const { Pool } = require('pg')
const { pgUser, pgPass, pgDb} = require('./configs.js')

const pool = new Pool({
  user: pgUser,
  database: pgDb,
  password: pgPass,
})

pool.on('error', err => {
  console.error('Ошибка БД', err)
  process.exit(-1)
})

function addCats(cats) {
  const inserts = []

  for (let i = 0; i < cats.length; i++) {
    const { name, description } = cats[i]

    const insert = pool
      .query('INSERT INTO Cats(name, description) VALUES ($1, $2) RETURNING *', [
        name,
        description,
      ])
      .then(insertResult => insertResult.rows[0])

    inserts.push(insert)
  }

  return Promise.all(inserts)
}

module.exports = {
  addCats,
}

const { Pool } = require('pg')

const pool = new Pool()
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

function addCats(cats) {
  
}

module.exports = {
  addCats,
}

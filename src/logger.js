const logger = require('pino')()
const expressPino = require('express-pino-logger')({
  logger,
})

module.exports = {
  expressPino,
  logger,
}
const boom = require('boom')
const catsStorage = require('./cats-storage')

function searchCatByName(req, res, next) {
  // const needle = req.body.needle
  // if (isValidNeedle(needle, next)) {
  //   namesDb.searchNames(req.body.needle, function(namesFound) {
  //     res.json(namesDb.groupNamesAndSort(namesFound))
  //   })
  // }
}

/**
 * {
 *   "cats": [
 *      {
 *         "name": "some cat",
 *         "description": "my awesome cat" <- optional
 *      }
 *   ]
 * }
 */
function addCats(req, res, next) {
  catsStorage.addCats(req.body.cats)

  // const needle = req.body.needle

  // if (isValidNeedle(needle, next)) {
  //   namesDb.createNewName(needle, function(insertedName) {
  //     res.json(insertedName)
  //   })
  // }
}

function deleteCatByName(req, res) {
  // namesDb.deleteByName(req.body.needle, function() {
  //   res.send('ok')
  // })
}

function getCatById(req, res) {
  // namesDb.searchById(req.params.catId, function({ name, details }) {
  //   res.json({
  //     name,
  //     details,
  //   })
  // })
}

function isValidNeedle(needle, next) {
  if (needle == null || needle.length == 0) {
    next(boom.badRequest('needle is empty'))
    return false
  }

  return true
}

module.exports = {
  searchCatByName,
  addCats,
  deleteCatByName,
  getCatById,
}

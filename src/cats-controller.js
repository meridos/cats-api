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

function addCats(req, res) {
  const { cats } = req.body

  if (isEmpty(cats)) {
    return res.status(400).json(boom.badRequest('cats is absent'))
  }

  for (let i = 0; i < cats.length; i++) {
    if (isEmpty(cats[i].name)) {
      return res.status(400).json(boom.badRequest('cat name is absent'))
    }
  }

  catsStorage
    .addCats(cats)
    .then(storedCats =>
      res.json({
        cats: storedCats,
      })
    )
    .catch(err =>
      res.status(500).json(boom.internal('unable to save cats', err))
    )
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

function isEmpty(value) {
  return value == null || value.length == 0
}

module.exports = {
  searchCatByName,
  addCats,
  deleteCatByName,
  getCatById,
}

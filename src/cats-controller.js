const boom = require('boom')
const catsStorage = require('./cats-storage')

function searchCatsByName(req, res) {
  const { name } = req.body

  console.log(`searching for cats with name like ${name}`)

  return catsStorage
    .findCatsByName(name)
    .then(foundCats => res.json(groupNamesAndSort(foundCats)))
    .catch(err =>
      res.status(500).json(boom.internal('unable to find cats', err))
    )
}

function addCats(req, res) {
  const { cats } = req.body

  console.log(`adding cats: ${JSON.stringify(cats)}`)

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

function saveCatDescription(req, res) {
  const { catId, catDescription } = req.body

  console.log(`saving cat description: ${catId}: ${catDescription}`)

  if (isEmpty(catId) || isEmpty(catDescription)) {
    return res.status(400).json(boom.badRequest('cat id is absent'))
  }

  catsStorage
    .saveCatDescription(catId, catDescription)
    .then(catFound => {
      if (catFound == null) {
        return res.status(404).json(boom.notFound('cat not found'))
      }

      return res.json({ cat: catFound })
    })
    .catch(err =>
      res.status(500).json(boom.internal('unable to save cat description', err))
    )
}

function getCatById(req, res) {
  const { id } = req.query
  if (isEmpty(id)) {
    return res.status(400).json(boom.badRequest('cat id is absent'))
  }

  catsStorage
    .findCatById(id)
    .then(catFound => {
      if (catFound == null) {
        return res.status(404).json(boom.notFound('cat not found'))
      }

      return res.json({ cat: catFound })
    })
    .catch(err =>
      res.status(500).json(boom.internal('unable to find cat', err))
    )
}

function isEmpty(value) {
  return value == null || value.length == 0
}


function groupNamesAndSort(cats) {
  const groups = groupByFirstLetter(cats);
  const sorterGroup = sortGroupAlphabetically(groups);
  const count = countNames(sorterGroup);

  return {
    groups: sorterGroup,
    count
  };
}

function groupByFirstLetter(cats) {
  const groups = {};

  for (let i = 0; i < cats.length; i++) {
    const cat = cats[i];
    const name = capitalizeFirstLetter(cat.name);
    const title = name.charAt(0);

    if (groups[title] == null) {
      groups[title] = [cat];
    } else {
      groups[title].push(cat);
    }
  }

  return groups;
}

function sortGroupAlphabetically(groups) {
  const keysSortedAlphabetically = Array.from(Object.keys(groups)).sort();
  const sorterGroup = [];

  for (let i = 0; i < keysSortedAlphabetically.length; i++) {
    const key = keysSortedAlphabetically[i];
    const group = {
      title: key,
      cats: groups[key], //.sort()
    };
    sorterGroup.push(group);
  }

  return sorterGroup;
}

function countNames(groups) {
  let count = 0;
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    group["count"] = group.cats.length;
    count = count + group.count;
  }
  return count;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  searchCatsByName,
  addCats,
  deleteCatByName,
  getCatById,
  saveCatDescription,
}

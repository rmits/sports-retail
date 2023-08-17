const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  Category
    .findAll()
    .then((data) => {
      res.json(data)
        .catch((err) => {
          throw (err)
        })
    })
  // be sure to include its associated Products
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  Category
    .findOne({ where: { id: req.params.id } })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      throw err
    })
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  // create a new category
  Category
    .create([
      {
        category_name: req.body.category_name
      }])
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      throw err
    })
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category
    .update(
      {
        category_name: req.body.category_name
      }, {
      where: {
        id: req.params.id,
      }
    })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      throw err
    })
    
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category
    .destroy({
      where: {
        id: req.params.id
      },
    })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      throw err
    })
});

module.exports = router;
const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
Tag.belongsToMany(Product, {through: ProductTag});

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  Tag
    .findAll()
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      throw (err)
    })
});
// be sure to include its associated Product data


router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Tag
    .findOne({ where: { id: req.params.id } })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      throw err
    })
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  // create a new tag
  Tag
    .bulkCreate(
      [{
        tag_name: req.body.tag_name
      }])
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      throw err
    })
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag
    .update(
      {
        tag_name: req.body.tag_name
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
  // delete on tag by its `id` value
  Tag
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
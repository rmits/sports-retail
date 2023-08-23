const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
Product.belongsTo(Category, {foreignKey: 'category_id'});
Product.belongsToMany(Tag, {through: ProductTag});

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  Product
    .findAll({include: [
      { model: Category }, 
      { model: Tag , attributes: ['id', 'tag_name']}]})
    .then((products) => {
      res.json(products); // Send the formatted products data as a response
    })
    .catch((err) => {
      throw (err)
    })
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  Product
    .findOne({ include: [{ model: Category }, { model: Tag }]}, { where: { id: req.params.id } })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      throw err
    })
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', (req, res) => {
  let createdProduct;

  Product
    .bulkCreate([
      {
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id,
      }
      
    ])
    .then((product) => {
      createdProduct = product[0]; // Assuming bulkCreate returns an array
      if (req.body.tags_id.length) {
        const productTagIdArr = req.body.tags_id.map((tags) => {
          return {
            product_id: createdProduct.id,
            tag_id: tags,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      return [];
    })
    .then((productTagIds) => {
      const response = {
        product: createdProduct,
        productTagIds: productTagIds
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
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
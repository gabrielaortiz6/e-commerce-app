const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

router.get('/', async (req, res) => {
  try {
    //find all products
    const productData = await Product.findAll({
      include: Category,
      include: Tag
    });

    res.json(productData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    // find a single product by its `id`
    const productData = await Product.findOne(
      {
        where: {
          id: req.params.id,
        },
        include: [
          { model: Category},
          {model: Tag, through: ProductTag}
        ]
    });
    res.json(productData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    const { product_name, price, stock, tagIds } = req.body;
    if (!product_name || !price || !stock || !tagIds) {
      return res.status(400).json({ error: 'Please provide product_name, price, stock, and tagIds' });
    }
  
    try {
      // Create the product
      const product = await Product.create({
        product_name,
        price,
        stock,
      });
      if (tagIds.length) {
        const productTagIdArr = tagIds.map((tag_id) => ({
          product_id: product.id,
          tag_id,
        }));
        await ProductTag.bulkCreate(productTagIdArr);
      }
  
      // Respond with the created product
      res.status(200).json(product);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
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
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
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
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: { id: req.params.id }
    });
    if (!productData) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // be sure to include its associated Products 
  try {
    //find all categories
    const categoryData = await Category.findAll({
      //associate with product data
      include: Product
    });

    // Return the tags as JSON
    res.json(categoryData);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findOne(
      {
        where: {
          id: req.params.id,
        },
        include: [{ model: Product }]
      });
    res.json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Unable to create tag.' });
    }
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
    try {
      const category = await Category.findOne({ where: { id: req.params.id } });
  
      if (!category) {
        return res.status(404).json({ error: 'Tag not found' });
      }
  
      await category.update(req.body);
  
      res.json(category);
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

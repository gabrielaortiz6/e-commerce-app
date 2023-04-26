const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    //find all tags
    const tagData = await Tag.findAll({
      //associate with product data
      include: Product
    });

    // Return the tags as JSON
    res.json(tagData);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// find a single tag by its `id`
// be sure to include its associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findOne(
      {
        where: {
          id: req.params.id,
        },
        include: [{ model: Product }]
      });
    res.json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Unable to create tag.' });
    }
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tag = await Tag.findOne({ where: { id: req.params.id } });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    await tag.update(req.body);

    res.json(tag);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: { id: req.params.id }
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

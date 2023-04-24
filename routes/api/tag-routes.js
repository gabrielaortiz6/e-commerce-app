const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    //find all tags
    const tags = await Tag.findAll({
      //associate with product data
      include: Product
    });

    // Return the tags as JSON
    res.json(tags);
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
    const singleTag = await Tag.findByPk(req.params.id, {
      // JOIN with travellers, using the Trip through table
      include: [{ model: Product}]
    });

    if (!singleTag) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(singleTag);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;

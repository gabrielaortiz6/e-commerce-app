// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  // Define the third table needed to store the foreign keys
  through: {
    model: ProductTag,
    foreignKey: 'product_id',
  },
  // Define an alias for when data is retrieved
  // as: 'product_id'
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  // Define the third table needed to store the foreign keys
  through: {
    model: ProductTag,
    foreignKey: 'tag_id'
  },
  // Define an alias for when data is retrieved
  // as: 'product_id'
});


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};

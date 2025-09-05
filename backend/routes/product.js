const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products');

const router = express.Router();

// Public Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Routes (you can add auth middleware later)
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;

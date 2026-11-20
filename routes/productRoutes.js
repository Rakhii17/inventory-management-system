
const express = require('express');
const router = express.Router();

const validateProduct = require('../middleware/validateProduct');

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    adjustStock,
    restockProduct,
    sellProduct
} = require('../controllers/productController');

router.post('/', validateProduct, createProduct);

router.get('/', getAllProducts);

router.patch('/:id/restock', restockProduct);

router.patch('/:id/sale', sellProduct);

router.patch('/:id/stock', adjustStock);

router.get('/:id', getProductById);

router.put('/:id', validateProduct, updateProduct);

router.delete('/:id', deleteProduct);

module.exports = router;

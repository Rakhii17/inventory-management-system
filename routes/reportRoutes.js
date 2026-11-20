
const express = require('express');
const router = express.Router();

const {
    getLowStockProducts,
    getCategorySummary
} = require('../controllers/reportController');

router.get('/low-stock', getLowStockProducts);

router.get('/category-summary', getCategorySummary);

module.exports = router;

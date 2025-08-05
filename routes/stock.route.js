// routes/stocks.js
const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stock.controller');

router.get('/', stocksController.getAllStocks);

module.exports = router;
router.get('/:id', stocksController.getStockById);
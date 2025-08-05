const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

router.post('/add', transactionController.addTransaction);
router.get('/', transactionController.getAllTransactions);

module.exports = router;

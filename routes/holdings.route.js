
const express = require('express');
const router = express.Router();
const holding = require('../controllers/holdings.controller');


router.post('/buy',holding.addHolding);
router.delete('/:id', holding.deleteHolding);
module.exports = router;
router.get('/', holding.getAllHoldings);

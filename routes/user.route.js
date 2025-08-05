const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// GET /users/:user_id/balance
router.get('/:user_id/', userController.getUserBalance);
router.put('/:user_id/', userController.updateUserBalance);
module.exports = router;

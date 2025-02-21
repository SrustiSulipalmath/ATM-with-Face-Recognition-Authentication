// transactionRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

router.post('/update-balance', authMiddleware, transactionController.updateBalance);

module.exports = router;
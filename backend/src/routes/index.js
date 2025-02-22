const express = require('express');
const cryptoController = require('../controllers/cryptoController');

const router = express.Router();

// Маршруты
router.get('/cryptos', cryptoController.getCryptos);
router.get('/cryptos/:id', cryptoController.getCryptoDetails);

module.exports = router;
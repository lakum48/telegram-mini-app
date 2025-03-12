const express = require('express');
const cryptoController = require('../controllers/cryptoController');

const router = express.Router();

// Маршруты
router.get('/cryptos', cryptoController.getCryptos);
router.get('/cryptos/:id', cryptoController.getCryptoDetails);
router.get('/search', cryptoController.searchCryptos);

module.exports = router;
const express = require('express');
const controller = require('../controllers/config.controller');

const router = express.Router();

router.get('/', controller.obter);
router.put('/', controller.atualizar);

module.exports = router;

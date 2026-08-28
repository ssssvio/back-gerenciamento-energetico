const express = require('express');
const controller = require('../controllers/consumos.controller');

const router = express.Router();

router.get('/comparativo', controller.comparativo);
router.get('/', controller.listar);
router.post('/', controller.criar);

module.exports = router;

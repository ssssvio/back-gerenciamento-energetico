const express = require('express');
const controller = require('../controllers/chamados.controller');

const router = express.Router();

router.get('/', controller.listar);
router.post('/', controller.criar);
router.patch('/:id', controller.atualizar);

module.exports = router;

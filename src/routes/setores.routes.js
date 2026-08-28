const express = require('express');
const controller = require('../controllers/setores.controller');

const router = express.Router();

router.get('/', controller.listar);

module.exports = router;

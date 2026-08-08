const express = require('express');
const router = express.Router();
const parceiroImagemController = require('../controllers/parceiroImagemController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Públicas (o site precisa de mostrar as fotos a qualquer visitante)
router.get('/parceiro/:parceiroId', parceiroImagemController.listar);

// Protegidas (só o admin gere fotos)
router.post('/parceiro/:parceiroId', authenticate, authorizeAdmin, parceiroImagemController.criar);
router.delete('/:id', authenticate, authorizeAdmin, parceiroImagemController.deletar);

module.exports = router;

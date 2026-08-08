const express = require('express');
const router = express.Router();
const utilizadorController = require('../controllers/utilizadorController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Todas as rotas de utilizadores são de admin (dados pessoais dos clientes)
router.get('/', authenticate, authorizeAdmin, utilizadorController.listar);
router.get('/:id', authenticate, authorizeAdmin, utilizadorController.buscarPorId);

module.exports = router;

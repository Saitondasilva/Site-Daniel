const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de login do admin (pública)
router.post('/login', authController.login);

// Rotas de clientes (públicas)
router.post('/registar', authController.registar);
router.post('/login-cliente', authController.loginCliente);

// Rota de verificação de token (protegida)
router.get('/verify', authController.verifyToken);

module.exports = router;
const Admin = require('../models/Admin');
const Utilizador = require('../models/Utilizador');
const { v4: uuidv4 } = require('uuid');
const { generateToken, comparePassword, hashPassword } = require('../config/auth');

const authController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Buscar admin pelo email
            const admin = await Admin.findByEmail(email);
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }
            
            // Verificar senha
            const isValid = await comparePassword(password, admin.senha);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }
            
            // Gerar token
            const token = generateToken({ id: admin.id, email: admin.email, role: admin.role || 'admin' });
            
            res.json({
                success: true,
                token,
                data: {
                    id: admin.id,
                    email: admin.email,
                    nome: admin.nome,
                    role: admin.role
                }
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao realizar login'
            });
        }
    },

    // Registo de cliente — POST /api/auth/registar
    async registar(req, res) {
        try {
            const { nome, email, password, telefone } = req.body;

            if (!nome || !email || !password) {
                return res.status(400).json({ success: false, message: 'Nome, email e palavra-passe são obrigatórios' });
            }
            if (password.length < 6) {
                return res.status(400).json({ success: false, message: 'A palavra-passe deve ter no mínimo 6 caracteres' });
            }

            const existente = await Utilizador.findByEmail(email);
            if (existente) {
                return res.status(409).json({ success: false, message: 'Este email já está registado' });
            }

            const senhaHash = await hashPassword(password);
            const id = `usr-${uuidv4()}`;
            const utilizador = await Utilizador.create({ id, nome, email, senha: senhaHash, telefone });

            const token = generateToken({ id: utilizador.id, email: utilizador.email, role: 'cliente' });

            res.status(201).json({ success: true, token, data: utilizador });
        } catch (error) {
            console.error('Erro no registo:', error);
            res.status(500).json({ success: false, message: 'Erro ao registar utilizador' });
        }
    },

    // Login de cliente — POST /api/auth/login-cliente
    async loginCliente(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email e palavra-passe são obrigatórios' });
            }

            const utilizador = await Utilizador.findByEmail(email);
            if (!utilizador) {
                return res.status(401).json({ success: false, message: 'Email ou palavra-passe incorretos' });
            }

            const valido = await comparePassword(password, utilizador.senha);
            if (!valido) {
                return res.status(401).json({ success: false, message: 'Email ou palavra-passe incorretos' });
            }

            const { senha, ...safe } = utilizador;
            const token = generateToken({ id: utilizador.id, email: utilizador.email, role: 'cliente' });

            res.json({ success: true, token, data: { ...safe, ativo: !!utilizador.ativo } });
        } catch (error) {
            console.error('Erro no login de cliente:', error);
            res.status(500).json({ success: false, message: 'Erro ao realizar login' });
        }
    },
    
    async verifyToken(req, res) {
        try {
            // O middleware authenticate já verificou o token
            res.json({
                success: true,
                user: req.user
            });
        } catch (error) {
            console.error('Erro ao verificar token:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao verificar token'
            });
        }
    }
};

module.exports = authController;
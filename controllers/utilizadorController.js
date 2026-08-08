// controllers/utilizadorController.js
const Utilizador = require('../models/Utilizador');

const utilizadorController = {
    async listar(req, res) {
        try {
            const utilizadores = await Utilizador.findAll();
            res.json({ success: true, data: utilizadores });
        } catch (error) {
            console.error('Erro ao listar utilizadores:', error);
            res.status(500).json({ success: false, message: 'Erro ao listar utilizadores' });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const utilizador = await Utilizador.findById(id);
            if (!utilizador) {
                return res.status(404).json({ success: false, message: 'Utilizador não encontrado' });
            }
            res.json({ success: true, data: utilizador });
        } catch (error) {
            console.error('Erro ao buscar utilizador:', error);
            res.status(500).json({ success: false, message: 'Erro ao buscar utilizador' });
        }
    }
};

module.exports = utilizadorController;

// controllers/parceiroImagemController.js
const ParceiroImagem = require('../models/ParceiroImagem');
const Parceiro = require('../models/Parceiro');

const parceiroImagemController = {
    async listar(req, res) {
        try {
            const { parceiroId } = req.params;
            const imagens = await ParceiroImagem.findByParceiro(parceiroId);
            res.json({ success: true, data: imagens });
        } catch (error) {
            console.error('Erro ao listar imagens:', error);
            res.status(500).json({ success: false, message: 'Erro ao listar imagens' });
        }
    },

    async criar(req, res) {
        try {
            const { parceiroId } = req.params;
            const { url, titulo, tipo, ordem } = req.body;

            if (!url) {
                return res.status(400).json({ success: false, message: 'url da imagem é obrigatória' });
            }

            const parceiro = await Parceiro.findById(parceiroId);
            if (!parceiro) {
                return res.status(404).json({ success: false, message: 'Parceiro não encontrado' });
            }

            const imagem = await ParceiroImagem.create({ parceiro_id: parceiroId, url, titulo, tipo, ordem });
            res.status(201).json({ success: true, data: imagem });
        } catch (error) {
            console.error('Erro ao adicionar imagem:', error);
            res.status(500).json({ success: false, message: 'Erro ao adicionar imagem' });
        }
    },

    async deletar(req, res) {
        try {
            const { id } = req.params;
            await ParceiroImagem.delete(id);
            res.json({ success: true, message: 'Imagem removida' });
        } catch (error) {
            console.error('Erro ao remover imagem:', error);
            res.status(500).json({ success: false, message: 'Erro ao remover imagem' });
        }
    }
};

module.exports = parceiroImagemController;

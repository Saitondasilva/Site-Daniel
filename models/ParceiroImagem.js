// models/ParceiroImagem.js
const { pool } = require('../config/database');

class ParceiroImagem {
    static async findByParceiro(parceiroId) {
        const [rows] = await pool.query(
            'SELECT * FROM parceiro_imagens WHERE parceiro_id = ? ORDER BY tipo = "principal" DESC, ordem ASC, id ASC',
            [parceiroId]
        );
        return rows;
    }

    static async create({ parceiro_id, url, titulo, tipo, ordem }) {
        const [result] = await pool.query(
            `INSERT INTO parceiro_imagens (parceiro_id, url, titulo, tipo, ordem)
             VALUES (?, ?, ?, ?, ?)`,
            [parceiro_id, url, titulo || null, tipo || 'galeria', ordem || 0]
        );
        const [rows] = await pool.query('SELECT * FROM parceiro_imagens WHERE id = ?', [result.insertId]);
        return rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM parceiro_imagens WHERE id = ?', [id]);
    }

    static async deleteByParceiro(parceiroId) {
        await pool.query('DELETE FROM parceiro_imagens WHERE parceiro_id = ?', [parceiroId]);
    }
}

module.exports = ParceiroImagem;

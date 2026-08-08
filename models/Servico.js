// models/Servico.js
const { pool } = require('../config/database');

function parseServico(row) {
    if (!row) return row;
    return { ...row, ativo: !!row.ativo };
}

class Servico {
    static async findAllByCategoria(categoriaId) {
        const [rows] = await pool.query(`
            SELECT s.*, 
                   COUNT(p.id) as total_parceiros
            FROM servicos s
            LEFT JOIN parceiros p ON p.servico_id = s.id
            WHERE s.categoria_id = ?
            GROUP BY s.id
            ORDER BY s.nome ASC
        `, [categoriaId]);
        return rows.map(parseServico);
    }

    static async findById(id) {
        const [rows] = await pool.query(`
            SELECT s.*, 
                   COUNT(p.id) as total_parceiros
            FROM servicos s
            LEFT JOIN parceiros p ON p.servico_id = s.id
            WHERE s.id = ?
            GROUP BY s.id
        `, [id]);
        return parseServico(rows[0]);
    }

    static async create(data) {
        const { id, categoria_id, nome, descricao, icon, image, label, preco, ativo } = data;
        await pool.query(
            `INSERT INTO servicos (id, categoria_id, nome, descricao, icon, image, label, preco, ativo)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, categoria_id, nome, descricao || null, icon || null, image || null,
             label || null, preco || null, ativo !== undefined ? ativo : true]
        );
        return this.findById(id);
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        const allowedFields = ['nome', 'descricao', 'icon', 'image', 'label', 'preco', 'ativo'];

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        }

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        await pool.query(`UPDATE servicos SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    static async delete(id) {
        await pool.query('DELETE FROM servicos WHERE id = ?', [id]);
    }
}

module.exports = Servico;
// models/Parceiro.js
const { pool } = require('../config/database');

function parseParceiro(row) {
    if (!row) return row;
    return {
        ...row,
        tags: row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : [],
        contacto: row.contacto ? (typeof row.contacto === 'string' ? JSON.parse(row.contacto) : row.contacto) : {},
        featured: !!row.featured,
        ativo: !!row.ativo,
    };
}

class Parceiro {
    static async findAll(servicoId = null) {
        let sql = 'SELECT * FROM parceiros WHERE 1=1';
        const params = [];
        
        if (servicoId) {
            sql += ' AND servico_id = ?';
            params.push(servicoId);
        }
        
        sql += ' ORDER BY nome ASC';
        const [rows] = await pool.query(sql, params);
        return rows.map(parseParceiro);
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM parceiros WHERE id = ?', [id]);
        return parseParceiro(rows[0]);
    }

    static async create(data) {
        const {
            id, servico_id, nome, tipo, local, descricao, destaque, preco,
            avaliacao, avaliacoes, tags, contacto, featured, ativo,
        } = data;
        await pool.query(
            `INSERT INTO parceiros (
                id, servico_id, nome, tipo, local, descricao, destaque, preco,
                avaliacao, avaliacoes, tags, contacto, featured, ativo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, servico_id, nome, tipo || null, local || null, descricao || null,
                destaque || null, preco || null,
                avaliacao !== undefined ? avaliacao : 4.5, avaliacoes || 0,
                tags ? JSON.stringify(tags) : null,
                contacto ? JSON.stringify(contacto) : null,
                featured ? 1 : 0, ativo !== undefined ? ativo : true,
            ]
        );
        return this.findById(id);
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        const allowedFields = [
            'nome', 'tipo', 'local', 'descricao', 'destaque', 'preco',
            'avaliacao', 'avaliacoes', 'featured', 'ativo',
        ];

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        }
        if (data.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(data.tags)); }
        if (data.contacto !== undefined) { fields.push('contacto = ?'); values.push(JSON.stringify(data.contacto)); }

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        await pool.query(`UPDATE parceiros SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    static async toggleFeatured(id) {
        const parceiro = await this.findById(id);
        if (!parceiro) return null;
        await pool.query('UPDATE parceiros SET featured = ? WHERE id = ?', [!parceiro.featured, id]);
        return this.findById(id);
    }

    static async delete(id) {
        await pool.query('DELETE FROM parceiros WHERE id = ?', [id]);
    }
}

module.exports = Parceiro;
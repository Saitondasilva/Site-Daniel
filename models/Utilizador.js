// models/Utilizador.js
const { pool } = require('../config/database');

function parseUtilizador(row) {
    if (!row) return row;
    const { senha, ...safe } = row;
    return { ...safe, ativo: !!row.ativo };
}

class Utilizador {
    static async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT * FROM utilizadores WHERE email = ?',
            [email]
        );
        return rows[0]; // inclui senha (hash) — uso interno para validar login
    }

    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM utilizadores WHERE id = ?',
            [id]
        );
        return parseUtilizador(rows[0]);
    }

    static async findAll() {
        const [rows] = await pool.query(
            'SELECT * FROM utilizadores ORDER BY created_at DESC'
        );
        return rows.map(parseUtilizador);
    }

    static async create({ id, nome, email, senha, telefone }) {
        await pool.query(
            `INSERT INTO utilizadores (id, nome, email, senha, telefone, tipo, ativo)
             VALUES (?, ?, ?, ?, ?, 'cliente', 1)`,
            [id, nome, email, senha, telefone || null]
        );
        return this.findById(id);
    }
}

module.exports = Utilizador;

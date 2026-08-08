// models/Admin.js
const { pool } = require('../config/database');

class Admin {
    static async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT * FROM administradores WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM administradores WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = Admin;

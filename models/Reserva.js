// models/Reserva.js
const { pool } = require('../config/database');

class Reserva {
    static async findAll(filters = {}) {
        let sql = 'SELECT * FROM reservas WHERE 1=1';
        const params = [];
        
        if (filters.status) {
            sql += ' AND status = ?';
            params.push(filters.status);
        }
        
        if (filters.usuario_email) {
            sql += ' AND usuario_email = ?';
            params.push(filters.usuario_email);
        }
        
        sql += ' ORDER BY created_at DESC';
        
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const offset = (page - 1) * limit;
        
        // Contar total
        const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.query(countSql, params);
        const total = countResult[0]?.total || 0;
        
        // Adicionar paginação
        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);
        
        const [rows] = await pool.query(sql, params);
        
        return {
            data: rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const {
            id,
            usuario_id,
            servico_id,
            servico_nome,
            parceiro_id,
            parceiro_nome,
            usuario_nome,
            usuario_email,
            usuario_telefone,
            data_reserva,
            hora_reserva,
            numero_pessoas,
            status,
            observacoes
        } = data;
        
        await pool.query(
            `INSERT INTO reservas (
                id, usuario_id, servico_id, servico_nome, parceiro_id, parceiro_nome,
                usuario_nome, usuario_email,
                usuario_telefone, data_reserva, hora_reserva, numero_pessoas,
                status, observacoes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id || `res-${Date.now()}`,
                usuario_id || null,
                servico_id || null,
                servico_nome || null,
                parceiro_id || null,
                parceiro_nome || null,
                usuario_nome,
                usuario_email,
                usuario_telefone || null,
                data_reserva,
                hora_reserva,
                numero_pessoas || 1,
                status || 'pendente',
                observacoes || null
            ]
        );
        return this.findById(id);
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        const allowedFields = [
            'usuario_nome', 'usuario_email', 'usuario_telefone',
            'data_reserva', 'hora_reserva', 'numero_pessoas', 
            'status', 'observacoes'
        ];
        
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        }
        
        if (fields.length === 0) return this.findById(id);
        
        values.push(id);
        await pool.query(`UPDATE reservas SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    static async updateStatus(id, status) {
        await pool.query('UPDATE reservas SET status = ? WHERE id = ?', [status, id]);
        return this.findById(id);
    }

    // Passo 1: admin verifica que há condições e aprova, enviando uma
    // mensagem ao cliente com os próximos passos (pagamento do sinal)
    static async aprovar(id, { mensagem_admin, sinal_valor, sinal_percentual }) {
        await pool.query(
            `UPDATE reservas
             SET status = 'aprovada', mensagem_admin = ?, sinal_valor = ?, sinal_percentual = ?
             WHERE id = ?`,
            [mensagem_admin || null, sinal_valor || null, sinal_percentual || 50, id]
        );
        return this.findById(id);
    }

    // Cliente assinala que já efetuou o pagamento do sinal (fica a aguardar
    // confirmação do admin — não confirma sozinho a reserva)
    static async clienteReportarPagamento(id) {
        await pool.query(
            `UPDATE reservas SET cliente_reportou_pagamento = 1 WHERE id = ? AND status = 'aprovada'`,
            [id]
        );
        return this.findById(id);
    }

    // Passo 2: admin confirma que recebeu o sinal — só aqui a reserva fica
    // 100% confirmada e marcada
    static async confirmarPagamento(id) {
        await pool.query(
            `UPDATE reservas
             SET status = 'confirmada', sinal_pago = 1, sinal_pago_em = NOW()
             WHERE id = ?`,
            [id]
        );
        return this.findById(id);
    }

    static async delete(id) {
        await pool.query('DELETE FROM reservas WHERE id = ?', [id]);
    }

    static async findByCliente({ usuario_id, usuario_email }) {
        let sql = 'SELECT * FROM reservas WHERE 1=1';
        const params = [];
        if (usuario_id) { sql += ' AND usuario_id = ?'; params.push(usuario_id); }
        else if (usuario_email) { sql += ' AND usuario_email = ?'; params.push(usuario_email); }
        else return [];
        sql += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(sql, params);
        return rows;
    }

    static async getStats() {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
                SUM(CASE WHEN status = 'confirmada' THEN 1 ELSE 0 END) as confirmadas,
                SUM(CASE WHEN status = 'cancelada' THEN 1 ELSE 0 END) as canceladas,
                SUM(CASE WHEN status = 'concluida' THEN 1 ELSE 0 END) as concluidas
            FROM reservas
        `);
        return rows[0];
    }
}

module.exports = Reserva;
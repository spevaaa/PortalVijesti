const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, isAdmin } = require('../middleware');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM news ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('SQL Greška:', err);
        res.status(500).json({ message: 'Greška na serveru', error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const sql = 'SELECT * FROM news WHERE id = ?';
        const [rows] = await db.query(sql, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Vijest nije pronađena" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('SQL Greška:', err);
        res.status(500).json({ message: 'Greška na serveru', error: err.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { title, content, image_url, category_id } = req.body;
    const author_id = req.user.id;

    try {
        const sql = 'INSERT INTO news (title, content, image_url, category_id, author_id) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [title, content, image_url, category_id, author_id]);
        
        res.status(201).json({ message: 'Vijest dodana!', id: result.insertId });
    } catch (err) {
        console.error('SQL Greška kod dodavanja:', err);
        res.status(500).json({ message: 'Greška pri spremanju', error: err.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const sql = 'DELETE FROM news WHERE id = ?';
        await db.query(sql, [req.params.id]);
        res.json({ message: 'Vijest obrisana' });
    } catch (err) {
        console.error('SQL Greška:', err);
        res.status(500).json({ message: 'Greška na serveru', error: err.message });
    }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    const { title, content, image_url, category_id } = req.body;
    const newsId = req.params.id;

    try {
        const sql = `
            UPDATE news 
            SET title = ?, content = ?, image_url = ?, category_id = ? 
            WHERE id = ?
        `;

        const [result] = await db.query(sql, [title, content, image_url, category_id, newsId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Vijest nije pronađena" });
        }
        
        res.json({ message: 'Vijest uspješno ažurirana!' });
    } catch (err) {
        console.error('SQL Greška kod ažuriranja:', err);
        res.status(500).json({ message: 'Greška na serveru', error: err.message });
    }
});

module.exports = router;
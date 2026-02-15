const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, isAdmin } = require('../middleware');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.json(rows);
    } catch (err) {
        console.error("Greška kod kategorija:", err.message);
        res.status(500).json({ error: "Greška u bazi podataka" });
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
        res.status(500).json({ message: 'Greška pri spremanju' });
    }
});

router.delete('/:id', verifyToken, isAdmin, (req, res) => {
    const sql = 'DELETE FROM categories WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Kategorija obrisana' });
    });
});

module.exports = router;
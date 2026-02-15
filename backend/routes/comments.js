const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware');

router.get('/:news_id', async (req, res) => {
    try {
        const { news_id } = req.params;
        
        const sql = `
            SELECT 
                comments.*, 
                users.username 
            FROM comments 
            JOIN users ON comments.user_id = users.id 
            WHERE comments.news_id = ? 
            ORDER BY comments.created_at DESC
        `;
        
        const [rows] = await db.query(sql, [news_id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri dohvatu komentara' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { text, news_id } = req.body;
    const user_id = req.user.id;

    try {
        const sql = 'INSERT INTO comments (text, news_id, user_id) VALUES (?, ?, ?)';
        await db.query(sql, [text, news_id, user_id]);
        res.status(201).json({ message: 'Komentar dodan!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri spremanju komentara' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const [rows] = await db.query('SELECT user_id FROM comments WHERE id = ?', [commentId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Komentar nije pronađen." });
        }

        if (rows[0].user_id !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: "Nemate ovlasti za brisanje ovog komentara." });
        }

        await db.query('DELETE FROM comments WHERE id = ?', [commentId]);
        res.json({ message: "Komentar uspješno obrisan." });

    } catch (err) {
        res.status(500).json({ message: "Greška na serveru", error: err.message });
    }
});

module.exports = router;
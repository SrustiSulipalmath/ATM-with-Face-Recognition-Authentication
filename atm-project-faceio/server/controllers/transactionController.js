// transactionRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

router.post('/update-balance', authMiddleware, transactionController.updateBalance);

module.exports = router;

// transactionController.js
const db = require('../config/db');

exports.updateBalance = async (req, res) => {
    try {
        const { amount, type } = req.body;
        const userId = req.userId;

        // Get current balance
        const [user] = await db.query(
            'SELECT balance FROM users WHERE id = ?',
            [userId]
        );
        
        let newBalance = parseFloat(user[0].balance);
        
        // if (type === 'withdraw'&& newBalance < amount) {
        //     if (newBalance < amount) {
        //         return res.status(400).json({ error: 'Insufficient funds' });
        //     }
        //     newBalance -= parseFloat(amount);
        // } else {
        //     newBalance += parseFloat(amount);
        // }

        // In transactionController.js
        if (type === 'withdraw' && newBalance < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        if (type === 'withdraw' && newBalance >= amount) { // Fixed redundant condition
            newBalance -= parseFloat(amount);
        } else {
            newBalance += parseFloat(amount);
        }


        // Update balance
        await db.query(
            'UPDATE users SET balance = ? WHERE id = ?',
            [newBalance, userId]
        );

        // Record transaction
        await db.query(
            `INSERT INTO transactions 
            (user_id, type, amount, balance) 
            VALUES (?, ?, ?, ?)`,
            [userId, type, amount, newBalance]
        );

        res.json({ 
            success: true,
            newBalance: newBalance.toFixed(2)
        });
    } catch (error) {
        console.error('Balance update error:', error);
        res.status(500).json({ error: 'Balance update failed',details: process.env.NODE_ENV === 'development' ? error.message : null });
    }
};
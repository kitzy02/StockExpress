const db = require('../config/db');

// Get user balance by user_id
exports.getUserBalance = (req, res) => {
  const { user_id } = req.params;

  const query = 'SELECT balance FROM users WHERE user_id = ?';

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching balance:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user_id,
      balance: results[0].balance
    });
  });
};

// Update user balance
exports.updateUserBalance = (req, res) => {
  const { user_id } = req.params;
  const { amount, type } = req.body; // amount to add/subtract, type = 'buy' or 'sell'

  if (!amount || !type || !['buy', 'sell'].includes(type)) {
    return res.status(400).json({ message: 'Amount and valid type (buy/sell) are required' });
  }

  const operation = type === 'buy' ? '-' : '+';

  const query = `UPDATE users SET balance = balance ${operation} ? WHERE user_id = ?`;

  db.query(query, [amount, user_id], (err, result) => {
    if (err) {
      console.error('Error updating balance:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `Balance updated successfully after ${type}` });
  });
};

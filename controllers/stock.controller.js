// controllers/stocksController.js
const db = require('../config/db');

exports.getAllStocks = (req, res) => {
  const query = 'SELECT * FROM stocks';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching stocks:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
};
exports.getStockById = (req, res) => {
  const stockId = req.params.id;
  const query = 'SELECT * FROM stocks WHERE sl_no = ?';
  db.query(query, [stockId], (err, results) => {
    if (err) {
      console.error('Error fetching stock:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(results[0]);
  });
};

const db = require('../config/db');

// Add stock to watchlist
exports.addToWatchlist = (req, res) => {
  const { stock_id } = req.body;
  if (!stock_id) {
    return res.status(400).json({ error: 'stock_id is required' });
  }

  const query = 'INSERT IGNORE INTO watchlist (stock_id) VALUES (?)';
  db.query(query, [stock_id], (err, results) => {
    if (err) {
      console.error('Error adding to watchlist:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Stock added to watchlist' });
  });
};

// Get all watchlist stocks
exports.getWatchlist = (req, res) => {
  const query = `
    SELECT w.watch_id, s.sl_no, s.company_name, s.price, w.added_at
    FROM watchlist w
    JOIN stocks s ON w.stock_id = s.sl_no
    ORDER BY w.added_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching watchlist:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
};

// Remove a stock from watchlist
// Remove a stock from watchlist by watch_id
exports.removeFromWatchlist = (req, res) => {
    const { watch_id } = req.params;
  
    const query = 'DELETE FROM watchlist WHERE watch_id = ?';
    db.query(query, [watch_id], (err, results) => {
      if (err) {
        console.error('Error removing from watchlist:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Watchlist entry not found' });
      }
  
      res.status(200).json({ message: 'Stock removed from watchlist' });
    });
  };
  
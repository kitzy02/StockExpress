const db = require('../config/db');

// Add a new transaction
exports.addTransaction = (req, res) => {
    const { company_name, transaction_type, quantity } = req.body;
  
    if (!company_name || !transaction_type || !quantity) {
      return res.status(400).json({ message: 'company_name, transaction_type, and quantity are required' });
    }
  
    // Get stock_id and price from stocks using company_name
    const getStockQuery = `SELECT sl_no AS stock_id, price FROM stocks WHERE company_name = ?`;
  
    db.query(getStockQuery, [company_name], (err, stockResult) => {
      if (err) {
        console.error('Error fetching stock info:', err);
        return res.status(500).json({ message: 'Database error while fetching stock' });
      }
  
      if (stockResult.length === 0) {
        return res.status(404).json({ message: 'Stock not found' });
      }
  
      const { stock_id, price } = stockResult[0];
      const amount = (price * quantity).toFixed(2);
  
      const insertQuery = `
        INSERT INTO transactions (stock_id, transaction_type, quantity, amount)
        VALUES (?, ?, ?, ?)
      `;
  
      db.query(insertQuery, [stock_id, transaction_type, quantity, amount], (err, result) => {
        if (err) {
          console.error('Error inserting transaction:', err);
          return res.status(500).json({ message: 'Database error while inserting transaction' });
        }
  
        res.status(201).json({
          message: 'Transaction added successfully',
          transaction_id: result.insertId,
          company_name,
          transaction_type,
          price,
          quantity,
          amount
        });
      });
    });
  };

// Get all transactions
exports.getAllTransactions = (req, res) => {
  const query = `
    SELECT t.transaction_id, t.transaction_type, t.quantity, t.amount, t.transaction_date,
           s.company_name, s.price AS stock_price
    FROM transactions t
    JOIN stocks s ON t.stock_id = s.sl_no
    ORDER BY t.transaction_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json(results);
  });
};

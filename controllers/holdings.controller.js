const connection = require('../config/db');

// Add a holding
const addHolding = (req, res) => {
    const { company_name, quantity } = req.body;
  
    if (!company_name || !quantity) {
      return res.status(400).json({ error: 'company_name and quantity are required' });
    }
  
    const getPriceQuery = 'SELECT price FROM stocks WHERE company_name = ?';
    connection.query(getPriceQuery, [company_name], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching stock price' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Company not found in stocks' });
      }
  
      const current_price = results[0].price; // Current live price
      const buy_price = current_price; // When buying, this becomes buy price
      const profit_loss = 0;
      const realised_price = quantity * current_price; // Assuming realised price is quantity * current price
  
      const insertQuery = `
        INSERT INTO holdings (company_name, quantity, buy_price, current_price, profit_loss, realised_price)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
  
      connection.query(
        insertQuery,
        [company_name, quantity, buy_price, current_price, profit_loss, realised_price],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error inserting into holdings' });
          }
  
          res.status(201).json({
            message: 'Stock bought and added to holdings',
            holding_id: result.insertId
          });
        }
      );
    });
  };
  
// Get all holdings with profit/loss calculated
const getAllHoldings = (req, res) => {
  const query = 'SELECT * FROM holdings';

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching holdings' });
    }

    const updatedHoldings = results.map(row => {
      const profit_loss = (row.current_price - row.buy_price) ;
      return {
        ...row,
        profit_loss: profit_loss.toFixed(2)
      };
    });

    res.status(200).json(updatedHoldings);
  });
};

// Delete a holding by ID
const deleteHolding = (req, res) => {
  const holdingId = req.params.id;

  if (!holdingId) {
    return res.status(400).json({ error: 'Holding ID is required' });
  }

  const deleteQuery = 'DELETE FROM holdings WHERE u_id = ?';

  connection.query(deleteQuery, [holdingId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting holding' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Holding not found' });
    }

    res.status(200).json({ message: 'Holding deleted successfully' });
  });
};

module.exports = {
  addHolding,
  getAllHoldings,
  deleteHolding
};


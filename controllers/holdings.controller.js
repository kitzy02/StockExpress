const connection = require('../config/db');

const addHolding = (req, res) => {
  const { company_name, quantity } = req.body;

  if (!company_name || !quantity) {
    return res.status(400).json({ error: 'company_name and quantity are required' });
  }

  const getPriceQuery = 'SELECT price FROM stocks WHERE company_name = ?';
  connection.query(getPriceQuery, [company_name], (err, stockResults) => {
    if (err) return res.status(500).json({ error: 'Error fetching stock price' });

    if (stockResults.length === 0) {
      return res.status(404).json({ error: 'Company not found in stocks' });
    }

    const current_price = stockResults[0].price;
    const buy_price = current_price;

    // Step 1: Check if the company already exists in holdings
    const checkHoldingQuery = 'SELECT * FROM holdings WHERE company_name = ?';
    connection.query(checkHoldingQuery, [company_name], (err, holdResults) => {
      if (err) return res.status(500).json({ error: 'Error checking existing holding' });

      if (holdResults.length > 0) {
        // Company exists, update existing record
        const existing = holdResults[0];
        const total_quantity = existing.quantity + quantity;
        const total_value = (existing.buy_price * existing.quantity) + (buy_price * quantity);
        const avg_buy_price = total_value / total_quantity;
        const realised_price = total_quantity * current_price;
        const profit_loss = (current_price - avg_buy_price) * total_quantity;

        const updateQuery = `
          UPDATE holdings
          SET quantity = ?, buy_price = ?, current_price = ?, profit_loss = ?, realised_price = ?
          WHERE company_name = ?
        `;
        connection.query(updateQuery,
          [total_quantity, avg_buy_price, current_price, profit_loss, realised_price, company_name],
          (err, result) => {
            if (err) return res.status(500).json({ error: 'Error updating holding' });

            res.status(200).json({ message: 'Holding updated successfully' });
          }
        );

      } else {
        // Company doesn't exist, insert new
        const profit_loss = 0;
        const realised_price = quantity * current_price;

        const insertQuery = `
          INSERT INTO holdings (company_name, quantity, buy_price, current_price, profit_loss, realised_price)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        connection.query(
          insertQuery,
          [company_name, quantity, buy_price, current_price, profit_loss, realised_price],
          (err, result) => {
            if (err) return res.status(500).json({ error: 'Error inserting into holdings' });

            res.status(201).json({
              message: 'Stock bought and added to holdings',
              holding_id: result.insertId
            });
          }
        );
      }
    });
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


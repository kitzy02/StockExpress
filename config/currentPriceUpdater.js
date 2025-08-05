const db = require('../config/db');

function updateCurrentPrices() {
  const getHoldingsQuery = 'SELECT u_id, company_name FROM holdings';

  db.query(getHoldingsQuery, (err, holdings) => {
    if (err) {
      console.error('Error fetching holdings:', err);
      return;
    }

    holdings.forEach(holding => {
      const getStockPriceQuery = 'SELECT price FROM stocks WHERE company_name = ?';

      db.query(getStockPriceQuery, [holding.company_name], (err, stockResult) => {
        if (err || stockResult.length === 0) {
          console.error(`Error fetching price for ${holding.company_name}:`, err);
          return;
        }

        const latestPrice = stockResult[0].price;

        const updateQuery = 'UPDATE holdings SET current_price = ? WHERE u_id = ?';
        db.query(updateQuery, [latestPrice, holding.u_id], err => {
          if (err) {
            console.error(`Error updating price for holding ID ${holding.u_id}:`, err);
          }
        });
      });
    });

    console.log('Stock prices updated at', new Date().toLocaleTimeString());

    db.query('SELECT * FROM holdings', (err, results) => {
      if (err) {
        console.error('Error fetching updated holdings:', err);
        return;
      }
      console.log('Updated Holdings:', results);
    });
  });
}

// Run every 60 seconds
setInterval(updateCurrentPrices, 60000);

module.exports = updateCurrentPrices;

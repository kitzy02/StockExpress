// priceUpdater.js
const db = require('./db');

function updateStockPrices() {
  const query = 'SELECT sl_no, price FROM stocks';

  db.query(query, (err, stocks) => {
    if (err) {
      return console.error('Error fetching stocks:', err);
    }

    stocks.forEach(stock => {
      const changePercent = (Math.random() *10-5 ) / 100;
      const newPrice = (stock.price * (1 + changePercent)).toFixed(2);

      db.query(
        'UPDATE stocks SET price = ? WHERE sl_no = ?',
        [newPrice, stock.sl_no],
        (err) => {
          if (err) {
            console.error(`Error updating stock ${stock.sl_no}:`, err);
          }
        }
      );
    });

    console.log('Stock prices updated at', new Date().toLocaleTimeString());
  });
}

function startUpdater() {
  updateStockPrices();
  setInterval(updateStockPrices, 1 * 60 * 1000);
}

module.exports = startUpdater;

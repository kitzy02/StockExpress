//express
const express = require('express');
const stocksRoutes = require('./routes/stock.route');
const holdingsRoutes = require('./routes/holdings.route.js');
const current_price=require('./config/currentPriceUpdater.js')
const app = express();
const cors = require('cors');
const port = 5000;
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors()); // Enable CORS for all routes
// Parse JSON bodies

app.use(express.json()); 
app.use('/stocks', stocksRoutes);

priceUpdater = require('./config/priceUpdater');

app.use('/holdings', holdingsRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    current_price(); // Start the current price updater
    priceUpdater(); // Start the price updater
  });
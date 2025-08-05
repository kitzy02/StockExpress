const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlist.controller');

// Add a stock to the watchlist
router.post('/add', watchlistController.addToWatchlist);

// Get all stocks in the watchlist
router.get('/', watchlistController.getWatchlist);

// Remove a stock from the watchlist
router.delete('/remove/:watch_id', watchlistController.removeFromWatchlist);


module.exports = router;

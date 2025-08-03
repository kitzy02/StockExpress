//button 
import express from 'express';
import { getHoldings, addHolding, updateHolding, deleteHolding } from '../controllers/holdingsController.js';
const router = express.Router();                
// Define routes for holdings
router.get('/', getHoldings);
router.post('/', addHolding);
router.put('/:id', updateHolding);
router.delete('/:id', deleteHolding);

export default router;
// Export the router to be used in the main app

module.exports = router;
// This file defines the routes for managing holdings in the stock application.
// This file defines the routes for managing holdings in the stock application.
// It includes routes for getting all holdings, adding a new holding, updating an existing holding,
// and deleting a holding.

//write frintend code to display holdings
//

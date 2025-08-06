
const request = require('supertest');
const express = require('express');
const stocksRoutes = require('../routes/stock.route.js');

// Mock DB
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

const db = require('../config/db');

// Setup Express app
const app = express();
app.use(express.json());
app.use('/stocks', stocksRoutes);

describe('Stocks API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /stocks', () => {
    it('should return a list of stocks', async () => {
      const mockStocks = [
        { company_name: 'ABC Corp', price: 100 },
        { company_name: 'XYZ Ltd', price: 200 }
      ];

      db.query.mockImplementationOnce((query, cb) => cb(null, mockStocks));

      const res = await request(app).get('/stocks');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockStocks);
    });

    it('should return 500 on DB error', async () => {
      db.query.mockImplementationOnce((query, cb) => cb(new Error('DB error'), null));

      const res = await request(app).get('/stocks');
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBe('Internal Server Error');

    });
  });
});

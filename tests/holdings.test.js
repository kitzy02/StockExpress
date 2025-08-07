const request = require('supertest');
const express = require('express');
const holdingsRoutes = require('../routes/holdings.route.js');

// Mock db
jest.mock('../config/db', () => ({
  query: jest.fn()
}));
const db = require('../config/db');

// Express app setup
const app = express();
app.use(express.json());
app.use('/holdings', holdingsRoutes);

describe('Holdings API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /holdings/buy', () => {
    it('should return 201 if new holding is added successfully', async () => {
      const newHolding = {
        company_name: 'ABC Corp',
        quantity: 10
      };

      const mockPrice = [{ price: 100 }];
      const mockCheck = []; // No existing holding
      const mockInsert = { insertId: 123 };

      db.query
        .mockImplementationOnce((sql, params, cb) => cb(null, mockPrice)) // get stock price
        .mockImplementationOnce((sql, params, cb) => cb(null, mockCheck)) // check holdings
        .mockImplementationOnce((sql, params, cb) => cb(null, mockInsert)); // insert new

      const res = await request(app).post('/holdings/buy').send(newHolding);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        message: 'Stock bought and added to holdings',
        holding_id: 123
      });
      expect(db.query).toHaveBeenCalledTimes(3);
    });

    it('should return 200 if existing holding is updated successfully', async () => {
      const existingHolding = {
        company_name: 'ABC Corp',
        quantity: 5
      };

      const mockPrice = [{ price: 100 }];
      const mockExisting = [{ quantity: 10, buy_price: 90 }]; // holding exists
      const mockUpdate = { affectedRows: 1 };

      db.query
        .mockImplementationOnce((sql, params, cb) => cb(null, mockPrice)) // get stock price
        .mockImplementationOnce((sql, params, cb) => cb(null, mockExisting)) // check holdings
        .mockImplementationOnce((sql, params, cb) => cb(null, mockUpdate)); // update holding

      const res = await request(app).post('/holdings/buy').send(existingHolding);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Holding updated successfully' });
      expect(db.query).toHaveBeenCalledTimes(3);
    });

    it('should return 500 if stock price fetch fails', async () => {
      db.query.mockImplementationOnce((sql, params, cb) =>
        cb(new Error('DB error'), null)
      );

      const res = await request(app).post('/holdings/buy').send({
        company_name: 'XYZ',
        quantity: 5
      });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Error fetching stock price' });
    });

    it('should return 404 if stock not found in database', async () => {
      db.query.mockImplementationOnce((sql, params, cb) =>
        cb(null, []) // empty result
      );

      const res = await request(app).post('/holdings/buy').send({
        company_name: 'Invalid Co',
        quantity: 3
      });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Company not found in stocks' });
    });

    it('should return 500 if inserting into holdings fails', async () => {
      const mockPrice = [{ price: 120 }];
      const mockCheck = [];

      db.query
        .mockImplementationOnce((sql, params, cb) => cb(null, mockPrice)) // stock price
        .mockImplementationOnce((sql, params, cb) => cb(null, mockCheck)) // no holding
        .mockImplementationOnce((sql, params, cb) => cb(new Error('Insert error'), null)); // insert fails

      const res = await request(app).post('/holdings/buy').send({
        company_name: 'XYZ Inc',
        quantity: 5
      });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Error inserting into holdings' });
    });

    it('should return 500 if update query fails', async () => {
      const mockPrice = [{ price: 120 }];
      const mockExisting = [{ quantity: 3, buy_price: 100 }];

      db.query
        .mockImplementationOnce((sql, params, cb) => cb(null, mockPrice)) // stock price
        .mockImplementationOnce((sql, params, cb) => cb(null, mockExisting)) // holding exists
        .mockImplementationOnce((sql, params, cb) => cb(new Error('Update error'), null)); // update fails

      const res = await request(app).post('/holdings/buy').send({
        company_name: 'XYZ Inc',
        quantity: 2
      });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Error updating holding' });
    });
  });
});

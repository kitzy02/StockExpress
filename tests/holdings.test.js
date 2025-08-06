
const request = require('supertest');
const express = require('express');
const holdingsRoutes = require('../routes/holdings.route.js');

// Mock DB
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

const db = require('../config/db');

// Setup Express app
const app = express();
app.use(express.json());
app.use('/holdings', holdingsRoutes);

describe('Holdings API', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /holdings/buy', () => {
    it('should return 400 if company_name or quantity is missing', async () => {
      const res = await request(app).post('/holdings/buy').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBe('company_name and quantity are required');
    });

    it('should return 404 if company not found in stocks', async () => {
      db.query.mockImplementationOnce((query, params, cb) => {
        cb(null, []);
      });

      const res = await request(app).post('/holdings/buy').send({ company_name: 'ABC', quantity: 10 });
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBe('Company not found in stocks');
    });

    it('should return 201 if holding is added successfully', async () => {
      db.query
        .mockImplementationOnce((query, params, cb) => cb(null, [{ price: 100 }])) // Get stock price
        .mockImplementationOnce((query, params, cb) => cb(null, { insertId: 1 })); // Insert holding

      const res = await request(app).post('/holdings/buy').send({ company_name: 'XYZ', quantity: 5 });
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe('Stock bought and added to holdings');
      expect(res.body.holding_id).toBe(1);
    });
  });

  describe('GET /holdings/', () => {
    it('should return all holdings with updated profit/loss', async () => {
      const sampleData = [
        { company_name: 'XYZ', quantity: 5, buy_price: 90, current_price: 100 }
      ];
      db.query.mockImplementationOnce((query, cb) => cb(null, sampleData));

      const res = await request(app).get('/holdings');
      expect(res.statusCode).toEqual(200);
      expect(res.body[0].profit_loss).toBe('10.00');
    });
  });

  describe('DELETE /holdings/:id', () => {
    it('should return 400 if no ID is provided', async () => {
      const res = await request(app).delete('/holdings/');
      expect(res.statusCode).toEqual(404); // invalid route
    });

    it('should return 404 if no holding was deleted', async () => {
      db.query.mockImplementationOnce((query, params, cb) => cb(null, { affectedRows: 0 }));

      const res = await request(app).delete('/holdings/1');
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBe('Holding not found');
    });

    it('should return 200 if holding was deleted', async () => {
      db.query.mockImplementationOnce((query, params, cb) => cb(null, { affectedRows: 1 }));

      const res = await request(app).delete('/holdings/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Holding deleted successfully');
    });
  });
});

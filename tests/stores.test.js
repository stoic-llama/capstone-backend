const request = require('supertest');
const express = require('express');
const { storesWrapper } = require('../controllers/storesController.js')
const Store = require('../models/store');

// Set up the express app
const app = express();
app.get('/stores', storesWrapper);

describe('GET /stores', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock data
  });

  it('should return a list of stores and status 200', async () => {
    // Mock the Store.find() method
    const mockStores = [{ name: 'Store 1' }, { name: 'Store 2' }];
    Store.find = jest.fn().mockResolvedValue(mockStores);

    // Send a request to the route
    const response = await request(app).get('/stores');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockStores);
  });

  it('should return status 500 if an error occurs', async () => {
    // Mock the Store.find() method to throw an error
    const mockError = new Error('Something went wrong');
    Store.find = jest.fn().mockRejectedValue(mockError);

    // Send a request to the route
    const response = await request(app).get('/stores');

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: mockError.message });
  });
});

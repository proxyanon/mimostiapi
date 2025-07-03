/**
 * @file api.test.js
 * @description Simple API test using Supertest
 */

const request = require('supertest');
const express = require('express');

// Create a simple Express app for testing
const app = express();

// Define a simple route for testing
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Test successful' });
});

// Test suite
describe('API Tests', () => {
  // Test case
  test('GET /test returns 200 and correct message', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Test successful');
    console.log('[DEBUG_LOG] Test executed successfully');
  });
});
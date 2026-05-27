// unit test for API endpoints
// sample only, adjust according to your actual API endpoints and logic

const request = require('supertest');
const app = require('./app');

describe('POST /', () => {
  it('should return welcome message with name', async () => {
    const response = await request(app)
      .post('/')
      .send({ name: 'Alice' });
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Welcome Alice');
  });
});

describe('POST / without name', () => {
  it('should return welcome message without name', async () => {
    const response = await request(app)
      .post('/')
      .send({});
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Welcome Guest');
  });
});

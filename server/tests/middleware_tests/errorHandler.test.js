import { jest } from '@jest/globals';
import errorHandler from '../../middleware/errorHandler.js';

describe('errorHandler Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let originalConsoleError;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    
    // Suppress console.error in tests to keep output clean
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test('should return 500 status and error JSON', () => {
    const error = new Error('Test error');
    
    errorHandler(error, mockReq, mockRes, mockNext);

    expect(console.error).toHaveBeenCalledWith(error.stack);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

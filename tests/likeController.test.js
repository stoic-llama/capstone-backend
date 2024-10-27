const mongoose = require('mongoose');

// Mock mongoose
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: jest.fn(id => id),
  },
  Schema: function() {
    return {
      // Add any methods or properties that your schema uses
      pre: jest.fn(),
      index: jest.fn(),
    };
  },
}));

// Mock the Store model
const mockFindOneAndUpdate = jest.fn();
jest.mock('../models/store', () => ({
  findOneAndUpdate: mockFindOneAndUpdate
}));

// Mock the store_item model if needed
jest.mock('../models/store_item', () => ({}));

const { updateLikes } = require('../controllers/likeController');

describe('likeController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        store_id: 'mockStoreId',
        product_id: 'mockProductId',
        email: 'test@example.com',
        like: 0,
        dislike: 0,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockFindOneAndUpdate.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a like when like=1 and dislike=0', async () => {
    req.body.like = 1;
    req.body.dislike = 0;
    const mockUpdatedStore = { 
      _id: 'mockStoreId',
      Store_items: [{
        _id: 'mockProductId',
        Likes: ['test@example.com'],
        Total_likes: 1
      }]
    };
    mockFindOneAndUpdate.mockResolvedValue(mockUpdatedStore);

    await updateLikes(req, res);

    // Check if findOneAndUpdate was called
    expect(mockFindOneAndUpdate).toHaveBeenCalled();
    
    // Check if the response was sent correctly
    expect(res.json).toHaveBeenCalledWith(mockUpdatedStore);
  });

  it('should update like and remove dislike when like=1 and dislike=1', async () => {
    req.body.like = 1;
    req.body.dislike = 1;
    mockFindOneAndUpdate.mockResolvedValue({ update_status: 'SUCCESS' });

    await updateLikes(req, res);

    // Check if findOneAndUpdate was called
    expect(mockFindOneAndUpdate).toHaveBeenCalled();
    
    // Check if the correct status and response were sent
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ update_status: 'SUCCESS' });
  });

  it('should return 404 when store or product is not found', async () => {
    req.body.like = 1;
    req.body.dislike = 0;
    mockFindOneAndUpdate.mockResolvedValue(null);

    await updateLikes(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Store or product not found' });
  });

  it('should return 422 for invalid arguments', async () => {
    req.body.like = 0;
    req.body.dislike = 0;

    await updateLikes(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ message: 'Bad Request - Invalid Arguments' });
  });

  it('should handle errors and return 500', async () => {
    req.body.like = 1;
    req.body.dislike = 0;
    const error = new Error('Test error');
    mockFindOneAndUpdate.mockRejectedValue(error);

    await updateLikes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});

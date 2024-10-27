// Mock the entire mongoose module
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: jest.fn(id => id),
  },
}));

// Mock the Store model
const mockFindOneAndUpdate = jest.fn();
jest.mock('../models/store', () => ({
  findOneAndUpdate: mockFindOneAndUpdate
}));

// Mock the store_item model if needed
jest.mock('../models/store_item', () => ({}));

const { updateDislikes } = require('../controllers/dislikeController');

describe('dislikeController', () => {
  let req, res;
  let consoleLogSpy, consoleErrorSpy;

  beforeEach(() => {
    req = {
      body: {
        store_id: 'mockStoreId',
        product_id: 'mockProductId',
        email: 'test@example.com',
        like: 0,
        dislike: 1,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockFindOneAndUpdate.mockClear();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should add a dislike when dislike=1 and like=0', async () => {
    const mockStore = { _id: 'mockStoreId', Store_items: [{ _id: 'mockProductId', Dislikes: ['test@example.com'], Total_dislikes: 1 }] };
    mockFindOneAndUpdate.mockResolvedValue(mockStore);

    await updateDislikes(req, res);

    expect(mockFindOneAndUpdate).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockStore);
  });

  it('should update dislike and remove like when dislike=1 and like=1', async () => {
    req.body.like = 1;
    mockFindOneAndUpdate.mockResolvedValue({ update_status: 'SUCCESS' });

    await updateDislikes(req, res);

    expect(mockFindOneAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ update_status: 'SUCCESS' });
  });

  it('should return 404 when store is not found', async () => {
    mockFindOneAndUpdate.mockResolvedValue(null);

    await updateDislikes(req, res);

    expect(mockFindOneAndUpdate).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Store not found for:', { storeId: 'mockStoreId', productId: 'mockProductId' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Store or product not found' });
  });

  it('should handle errors and return 500', async () => {
    const error = new Error('Test error');
    mockFindOneAndUpdate.mockRejectedValue(error);

    await updateDislikes(req, res);

    expect(mockFindOneAndUpdate).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in updateDislikes:', error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });

  it('should return 422 for invalid arguments', async () => {
    req.body.dislike = 0;
    req.body.like = 0;

    await updateDislikes(req, res);

    expect(mockFindOneAndUpdate).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Bad Request - Invalid Arguments');
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ message: 'Bad Request - Invalid Arguments' });
  });
});

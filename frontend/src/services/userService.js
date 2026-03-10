import api from './api';

const userService = {
  // Profile management
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Cart operations
  addToCart: async (productId, quantity) => {
    const response = await api.post('/users/cart/add', {
      productId,
      quantity,
    });
    return response.data;
  },

  updateCart: async (productId, quantity) => {
    const response = await api.put('/users/cart/update', {
      productId,
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await api.delete(`/users/cart/remove/${productId}`);
    return response.data;
  },

  getCart: async () => {
    const response = await api.get('/users/cart');
    return response.data;
  },

  // Wishlist operations
  addToWishlist: async (productId) => {
    const response = await api.post('/users/wishlist/add', { productId });
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/users/wishlist/remove/${productId}`);
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get('/users/wishlist');
    return response.data;
  },
};

export default userService;

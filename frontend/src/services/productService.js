import api from './api';

const productService = {
  // Public endpoints
  getAllProducts: async (category = '') => {
    const response = await api.get('/products', {
      params: category ? { category } : {},
    });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query) => {
    const response = await api.get('/products/search', {
      params: { q: query },
    });
    return response.data;
  },

  // Vendor endpoints
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getMyProducts: async () => {
    const response = await api.get('/products/vendor/my-products');
    return response.data; // Returns { success, count, products }
  },

  getMyProductById: async (id) => {
    const response = await api.get(`/products/vendor/${id}`);
    return response.data; // Returns { success, product }
  },

  // Admin endpoints
  getAllProductsAdmin: async () => {
    const response = await api.get('/products/admin/all');
    return response.data; // Returns { success, count, products }
  },

  approveProduct: async (id, isApproved) => {
    const response = await api.put(`/products/admin/approve/${id}`, {
      isApproved,
    });
    return response.data;
  },
};

export default productService;

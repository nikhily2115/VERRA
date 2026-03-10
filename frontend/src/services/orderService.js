import api from './api';

const orderService = {
  // User operations
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Vendor operations
  getVendorOrders: async () => {
    const response = await api.get('/orders/vendor/my-orders');
    return response.data;
  },

  // Admin operations
  getAllOrders: async () => {
    const response = await api.get('/orders/admin/all');
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/admin/status/${id}`, { status });
    return response.data;
  },
};

export default orderService;

import api from './api';

const adminService = {
  // Dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // User management
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getAllVendors: async () => {
    const response = await api.get('/admin/vendors');
    return response.data;
  },

  blockUser: async (userId) => {
    const response = await api.put(`/admin/users/block/${userId}`);
    return response.data;
  },

  // Revenue analytics
  getTotalRevenue: async () => {
    const response = await api.get('/admin/revenue');
    return response.data;
  },

  // Vendor statistics
  getVendorStats: async (vendorId) => {
    const response = await api.get(`/admin/vendor-stats/${vendorId}`);
    return response.data;
  },
};

export default adminService;

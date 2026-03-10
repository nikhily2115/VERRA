import api from './api';

const paymentService = {
  // Create Razorpay order
  createOrder: async (shippingAddress) => {
    // Get cart to calculate total amount
    const cartResponse = await api.get('/users/cart');
    const cartData = cartResponse.data.data;
    const totalAmount = cartData.total;

    const response = await api.post('/payment/create-order', {
      amount: totalAmount,
      currency: 'INR'
    });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
  },
};

export default paymentService;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import Loader from '../../components/common/Loader';
import paymentService from '../../services/paymentService';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCart, clearCart } = useCart();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  useEffect(() => {
    loadCart();
  }, [fetchCart]);

  const loadCart = async () => {
    try {
      await fetchCart();
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      showError('Your cart is empty');
      return;
    }
    setShowShippingForm(true);
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate shipping address
    if (!shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode) {
      showError('Please fill in all required fields');
      return;
    }

    setPaymentLoading(true);
    try {
      // Create Razorpay order
      const orderResponse = await paymentService.createOrder(shippingAddress);
      const { orderId, amount, currency, razorpayKeyId } = orderResponse.data;

      // Prepare cart items for payment verification
      const cartItemsForPayment = cartItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }));

      // Initialize Razorpay
      const options = {
        key: razorpayKeyId,
        amount: amount,
        currency: currency,
        name: 'VERRA',
        description: 'Luxury Products Purchase',
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartItems: cartItemsForPayment,
              shippingAddress: shippingAddress
            });

            showSuccess('Order placed successfully!');
            clearCart();
            navigate('/user/orders');
          } catch (error) {
            console.error('Payment verification failed:', error);
            showError(error.response?.data?.message || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: '',
          contact: shippingAddress.phone
        },
        theme: {
          color: '#C6A75E'
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
            showError('Payment cancelled');
          }
        }
      };

      // Check if using mock credentials
      if (razorpayKeyId === 'rzp_test_your_actual_key_id_here') {
        // Mock payment for development
        showSuccess('Mock payment initiated...');
        setTimeout(async () => {
          try {
            await paymentService.verifyPayment({
              razorpay_order_id: orderId,
              razorpay_payment_id: `pay_mock_${Date.now()}`,
              razorpay_signature: 'mock_signature',
              cartItems: cartItemsForPayment,
              shippingAddress: shippingAddress
            });

            showSuccess('Order placed successfully!');
            clearCart();
            navigate('/user/orders');
          } catch (error) {
            console.error('Mock payment verification failed:', error);
            showError(error.response?.data?.message || 'Payment verification failed. Please contact support.');
          }
          setPaymentLoading(false);
        }, 2000);
      } else {
        // Real Razorpay payment
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      showError(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-card rounded-2xl p-12 max-w-md mx-auto luxury-shadow">
          <svg className="w-24 h-24 text-neutral-700 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-white text-3xl font-playfair mb-4">Your cart is empty</h2>
          <p className="text-secondary mb-8">Add some luxury items to get started</p>
          <Link
            to="/products"
            className="inline-block bg-gold text-black px-8 py-4 rounded-2xl font-semibold hover:bg-opacity-90 transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-white text-5xl font-playfair mb-12">Shopping Cart</h1>

      {showShippingForm ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl p-8 luxury-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-playfair">Shipping Address</h2>
              <button
                onClick={() => setShowShippingForm(false)}
                className="text-secondary hover:text-white transition-colors"
              >
                ← Back to Cart
              </button>
            </div>

            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-2">Full Name *</label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                  className="w-full bg-background border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                  className="w-full bg-background border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Address Line 1 *</label>
                <input
                  type="text"
                  value={shippingAddress.addressLine1}
                  onChange={(e) => setShippingAddress({...shippingAddress, addressLine1: e.target.value})}
                  className="w-full bg-background border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Address Line 2</label>
                <input
                  type="text"
                  value={shippingAddress.addressLine2}
                  onChange={(e) => setShippingAddress({...shippingAddress, addressLine2: e.target.value})}
                  className="w-full bg-background border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">City *</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    className="w-full bg-background border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">State *</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                    className="w-full bg-background border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">Pincode *</label>
                  <input
                    type="text"
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                    className="w-full bg-background border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Country *</label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    className="w-full bg-background border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full bg-gold text-black px-8 py-4 rounded-2xl font-semibold hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? 'Processing...' : `Proceed to Payment (₹${calculateTotal().toLocaleString('en-IN')})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              cartTotal={calculateTotal()}
              onCheckout={handleCheckout}
              loading={paymentLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

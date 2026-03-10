import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import orderService from '../../services/orderService';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await orderService.getOrderById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500 bg-opacity-20 text-yellow-500',
      confirmed: 'bg-blue-500 bg-opacity-20 text-blue-500',
      shipped: 'bg-purple-500 bg-opacity-20 text-purple-500',
      delivered: 'bg-green-500 bg-opacity-20 text-green-500',
      cancelled: 'bg-red-500 bg-opacity-20 text-red-500'
    };
    return colors[status] || 'bg-neutral-700 text-neutral-300';
  };

  const getPaymentStatusColor = (status) => {
    return status === 'completed' 
      ? 'bg-green-500 bg-opacity-20 text-green-500'
      : 'bg-yellow-500 bg-opacity-20 text-yellow-500';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-card rounded-2xl p-12 text-center luxury-shadow">
        <p className="text-secondary text-lg mb-6">Order not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-4xl font-playfair mb-2">Order Details</h1>
          <p className="text-gold font-mono text-lg">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline">
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-card rounded-2xl p-6 luxury-shadow">
            <h2 className="text-white text-2xl font-playfair mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.products?.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-neutral-800 rounded-xl">
                  <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{item.name}</h3>
                    <p className="text-secondary text-sm mb-2">{item.category}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-neutral-300">Qty: {item.quantity}</span>
                      <span className="text-neutral-300">₹{item.price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card rounded-2xl p-6 luxury-shadow">
            <h2 className="text-white text-2xl font-playfair mb-4">Shipping Address</h2>
            <div className="text-secondary space-y-2">
              <p className="text-white font-semibold">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
              <p>Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-card rounded-2xl p-6 luxury-shadow">
            <h2 className="text-white text-2xl font-playfair mb-4">Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-secondary text-sm mb-2">Order Status</p>
                <span className={`px-4 py-2 rounded-full text-sm font-medium inline-block ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div>
                <p className="text-secondary text-sm mb-2">Payment Status</p>
                <span className={`px-4 py-2 rounded-full text-sm font-medium inline-block ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-2xl p-6 luxury-shadow">
            <h2 className="text-white text-2xl font-playfair mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-white font-semibold text-lg">
                <span>Total</span>
                <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-card rounded-2xl p-6 luxury-shadow">
            <h2 className="text-white text-2xl font-playfair mb-4">Order Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-secondary mb-1">Order Date</p>
                <p className="text-white">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-secondary mb-1">Payment Method</p>
                <p className="text-white">{order.paymentMethod || 'Razorpay'}</p>
              </div>
              {order.razorpayOrderId && (
                <div>
                  <p className="text-secondary mb-1">Payment ID</p>
                  <p className="text-white font-mono text-xs">{order.razorpayOrderId}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

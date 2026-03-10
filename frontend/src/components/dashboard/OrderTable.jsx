import React from 'react';
import { Link } from 'react-router-dom';
import { TableSkeleton } from '../common/Skeleton';

const OrderTable = ({ orders, onRowClick, loading = false }) => {
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
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={7} />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-12 text-center luxury-shadow">
        <p className="text-secondary text-lg">No orders found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-2xl overflow-hidden luxury-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Items</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-neutral-800 transition-all duration-300 cursor-pointer"
                  onClick={() => onRowClick && onRowClick(order._id)}
                >
                  <td className="px-6 py-4">
                    <span className="text-gold font-mono text-sm font-semibold">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-secondary text-sm">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-secondary text-sm">
                    {order.products?.length || 0} items
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    ₹{order.totalAmount?.toLocaleString('en-IN') || '0'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/orders/${order._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-gold hover:text-yellow-400 text-sm font-semibold transition-all duration-300"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-card rounded-2xl p-4 cursor-pointer hover:bg-opacity-80 transition-all duration-300 luxury-shadow"
            onClick={() => onRowClick && onRowClick(order._id)}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-gold font-mono text-sm">
                #{order._id.slice(-8).toUpperCase()}
              </span>
              <span className="text-neutral-400 text-xs">
                {formatDate(order.createdAt)}
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Items:</span>
                <span className="text-neutral-300">{order.products?.length || 0} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Total:</span>
                <span className="text-white font-semibold">₹{order.totalAmount?.toLocaleString('en-IN') || '0'}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <Link
                to={`/orders/${order._id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-gold hover:text-yellow-400 text-sm font-medium transition-colors"
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderTable;

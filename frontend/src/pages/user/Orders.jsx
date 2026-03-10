import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderTable from '../../components/dashboard/OrderTable';
import Loader from '../../components/common/Loader';
import orderService from '../../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.orderStatus === statusFilter));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-white text-5xl font-playfair mb-2">My Orders</h1>
          <p className="text-secondary text-lg">{orders.length} total orders</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-8 flex gap-3 flex-wrap">
        {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-6 py-3 rounded-2xl transition-all duration-300 capitalize font-semibold ${
              statusFilter === status
                ? 'bg-gold text-black'
                : 'bg-card text-secondary hover:bg-opacity-80'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length > 0 ? (
        <OrderTable orders={filteredOrders} loading={loading} />
      ) : (
        <div className="bg-card rounded-2xl p-16 text-center luxury-shadow">
          <p className="text-secondary mb-6 text-lg">
            {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
          </p>
          {statusFilter === 'all' && (
            <Link
              to="/products"
              className="inline-block bg-gold text-black px-8 py-4 rounded-2xl font-semibold hover:bg-opacity-90 transition-all duration-300"
            >
              Start Shopping
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;

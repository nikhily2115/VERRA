import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import OrderTable from '../../components/dashboard/OrderTable';
import Loader from '../../components/common/Loader';
import orderService from '../../services/orderService';
import userService from '../../services/userService';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    orderCount: 0,
    wishlistCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersResponse, wishlistResponse] = await Promise.all([
        orderService.getMyOrders(),
        userService.getWishlist()
      ]);

      setStats({
        orderCount: ordersResponse.data.length,
        wishlistCount: wishlistResponse.data.length
      });

      setRecentOrders(ordersResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      <div className="mb-12">
        <h1 className="text-white text-5xl font-playfair mb-3">
          Welcome back, {user?.name}
        </h1>
        <p className="text-secondary text-lg">Manage your orders and wishlist</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          label="Total Orders"
          value={stats.orderCount}
        />
        <StatCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          label="Wishlist Items"
          value={stats.wishlistCount}
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/user/cart"
          className="bg-card p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group luxury-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gold bg-opacity-10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-opacity-20 transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">My Cart</h3>
              <p className="text-secondary text-sm">View cart items</p>
            </div>
          </div>
        </Link>

        <Link
          to="/user/wishlist"
          className="bg-card p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group luxury-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gold bg-opacity-10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-opacity-20 transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Wishlist</h3>
              <p className="text-secondary text-sm">Saved items</p>
            </div>
          </div>
        </Link>

        <Link
          to="/user/orders"
          className="bg-card p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group luxury-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gold bg-opacity-10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-opacity-20 transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Orders</h3>
              <p className="text-secondary text-sm">Track orders</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-3xl font-playfair">Recent Orders</h2>
          <Link to="/user/orders" className="text-gold hover:text-yellow-400 transition-all duration-300 font-semibold">
            View All →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <OrderTable orders={recentOrders} />
        ) : (
          <div className="bg-card rounded-2xl p-16 text-center luxury-shadow">
            <p className="text-secondary mb-6 text-lg">No orders yet</p>
            <Link
              to="/products"
              className="inline-block bg-gold text-black px-8 py-4 rounded-2xl font-semibold hover:bg-opacity-90 transition-all duration-300"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

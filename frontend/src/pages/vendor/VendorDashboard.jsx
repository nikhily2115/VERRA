import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import OrderTable from '../../components/dashboard/OrderTable';
import Loader from '../../components/common/Loader';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import adminService from '../../services/adminService';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    salesCount: 0,
    totalEarnings: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        productService.getMyProducts(),
        orderService.getVendorOrders()
      ]);

      // Calculate stats
      const totalProducts = productsResponse.data.length;
      const salesCount = ordersResponse.data.filter(o => o.paymentStatus === 'completed').length;
      
      // Calculate total earnings from completed orders
      const totalEarnings = ordersResponse.data
        .filter(o => o.paymentStatus === 'completed')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalProducts,
        salesCount,
        totalEarnings
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
          Vendor Dashboard
        </h1>
        <p className="text-secondary text-lg">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          label="Total Products"
          value={stats.totalProducts}
        />
        <StatCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          label="Total Sales"
          value={stats.salesCount}
        />
        <StatCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Total Earnings"
          value={`₹${stats.totalEarnings.toLocaleString('en-IN')}`}
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/vendor/products"
          className="bg-card p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group luxury-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gold bg-opacity-10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-opacity-20 transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">My Products</h3>
              <p className="text-secondary text-sm">Manage inventory</p>
            </div>
          </div>
        </Link>

        <Link
          to="/vendor/products/add"
          className="bg-card p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group luxury-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gold bg-opacity-10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-opacity-20 transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Add Product</h3>
              <p className="text-secondary text-sm">List new item</p>
            </div>
          </div>
        </Link>

        <Link
          to="/vendor/orders"
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
              <p className="text-secondary text-sm">View sales</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-3xl font-playfair">Recent Orders</h2>
          <Link to="/vendor/orders" className="text-gold hover:text-yellow-400 transition-all duration-300 font-semibold">
            View All →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <OrderTable orders={recentOrders} />
        ) : (
          <div className="bg-card rounded-2xl p-16 text-center luxury-shadow">
            <p className="text-secondary text-lg">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;

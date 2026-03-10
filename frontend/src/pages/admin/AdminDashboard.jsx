import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import Loader from '../../components/common/Loader';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, revenueResponse] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getTotalRevenue()
      ]);

      const dashboardData = dashboardResponse.data;
      
      setStats({
        totalUsers: dashboardData.users?.total || 0,
        totalVendors: dashboardData.users?.vendors || 0,
        totalOrders: dashboardData.orders?.total || 0,
        totalRevenue: revenueResponse.data.totalRevenue || 0
      });
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
          Admin Dashboard
        </h1>
        <p className="text-secondary text-lg">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          label="Total Users"
          value={stats.totalUsers || 0}
        />
        <StatCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          label="Total Vendors"
          value={stats.totalVendors || 0}
        />
        <StatCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          label="Total Orders"
          value={stats.totalOrders || 0}
        />
        <StatCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Total Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`}
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/products"
          className="bg-card p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group luxury-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-opacity-20 transition-all duration-300 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2 text-lg">Manage Products</h3>
            <p className="text-secondary text-sm">Approve & manage listings</p>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-card p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group luxury-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-opacity-20 transition-all duration-300 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2 text-lg">Manage Users</h3>
            <p className="text-secondary text-sm">User accounts & access</p>
          </div>
        </Link>

        <Link
          to="/admin/vendors"
          className="bg-card p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group luxury-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-opacity-20 transition-all duration-300 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2 text-lg">Manage Vendors</h3>
            <p className="text-secondary text-sm">Vendor accounts & products</p>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-card p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group luxury-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-opacity-20 transition-all duration-300 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2 text-lg">All Orders</h3>
            <p className="text-secondary text-sm">Order management & status</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

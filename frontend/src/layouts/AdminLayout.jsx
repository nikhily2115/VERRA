import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Manage Products', icon: '📦' },
    { path: '/admin/users', label: 'Manage Users', icon: '👥' },
    { path: '/admin/vendors', label: 'Manage Vendors', icon: '🏪' },
    { path: '/admin/orders', label: 'All Orders', icon: '🛍️' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="h-full pt-20 lg:pt-24 px-4 pb-4 overflow-y-auto">
            <div className="mb-6 px-4">
              <h2 className="text-gold font-playfair text-xl">Admin Portal</h2>
              <p className="text-secondary text-sm mt-1">Platform management</p>
            </div>
            
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-gold text-black font-semibold'
                      : 'text-secondary hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-8 px-4 py-4 bg-neutral-800 rounded-2xl border border-border">
              <p className="text-secondary text-xs mb-2">Admin Access</p>
              <p className="text-white text-sm font-semibold">Full platform control</p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 pt-20 lg:pt-24 px-4 lg:px-8 pb-8">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed bottom-4 right-4 z-50 w-14 h-14 bg-gold text-black rounded-full shadow-lg flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

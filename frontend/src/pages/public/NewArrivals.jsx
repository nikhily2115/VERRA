import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import Loader from '../../components/common/Loader';
import productService from '../../services/productService';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await productService.getAllProducts();
      // Get products from last 30 days and sort by newest
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newProducts = (response.products || [])
        .filter(product => new Date(product.createdAt) >= thirtyDaysAgo)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setProducts(newProducts);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4" style={{ backgroundColor: '#0B0B0B' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block mb-4">
            <span className="bg-gold bg-opacity-10 text-gold px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
              Just Arrived
            </span>
          </div>
          <h1 className="font-playfair text-5xl lg:text-6xl text-white">New Arrivals</h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Discover the latest additions to our luxury collection. Fresh pieces curated for the discerning connoisseur.
          </p>
        </div>

        {/* Stats Bar */}
        <div 
          className="rounded-2xl p-6 mb-12 flex flex-wrap gap-8 justify-center"
          style={{ backgroundColor: '#111111' }}
        >
          <div className="text-center">
            <div className="text-gold text-3xl font-playfair mb-1">{products.length}</div>
            <div className="text-secondary text-sm">New Items</div>
          </div>
          <div className="text-center">
            <div className="text-gold text-3xl font-playfair mb-1">30</div>
            <div className="text-secondary text-sm">Days</div>
          </div>
          <div className="text-center">
            <div className="text-gold text-3xl font-playfair mb-1">100%</div>
            <div className="text-secondary text-sm">Authentic</div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader size="lg" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div 
            className="rounded-2xl p-16 text-center"
            style={{ backgroundColor: '#111111' }}
          >
            <svg className="w-24 h-24 mx-auto text-gold opacity-20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-2xl font-playfair text-white mb-2">No New Arrivals Yet</h3>
            <p className="text-secondary mb-6">
              Check back soon for the latest luxury items
            </p>
          </div>
        )}

        {/* Newsletter Section */}
        <div 
          className="mt-20 rounded-2xl p-12 text-center"
          style={{ backgroundColor: '#111111' }}
        >
          <h2 className="text-white text-3xl font-playfair mb-4">
            Be the First to Know
          </h2>
          <p className="text-secondary mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get notified about new arrivals, exclusive offers, and luxury lifestyle insights
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full bg-neutral-800 text-white border border-neutral-700 focus:border-gold focus:outline-none"
            />
            <button className="bg-gold hover:bg-opacity-90 text-black font-semibold px-8 py-3 rounded-full transition-all duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;

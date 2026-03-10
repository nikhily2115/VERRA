import React, { useEffect, useState } from 'react';
import ProductTable from '../../components/dashboard/ProductTable';
import Loader from '../../components/common/Loader';
import productService from '../../services/productService';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalFilter, setApprovalFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [approvalFilter, products]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProductsAdmin();
      const productsData = response.products || [];
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!products || !Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }
    
    if (approvalFilter === 'all') {
      setFilteredProducts(products);
    } else if (approvalFilter === 'approved') {
      setFilteredProducts(products.filter(p => p.isApproved));
    } else if (approvalFilter === 'pending') {
      setFilteredProducts(products.filter(p => !p.isApproved));
    }
  };

  const handleApprove = async (productId, currentStatus) => {
    try {
      await productService.approveProduct(productId, !currentStatus);
      // Update local state
      setProducts(products.map(p =>
        p._id === productId ? { ...p, isApproved: !currentStatus } : p
      ));
    } catch (error) {
      console.error('Error updating product approval:', error);
      alert('Failed to update product approval status');
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
          <h1 className="text-white text-5xl font-playfair mb-2">Manage Products</h1>
          <p className="text-secondary text-lg">{products?.length || 0} total products</p>
        </div>
      </div>

      {/* Approval Filter */}
      <div className="mb-8 flex gap-3">
        {['all', 'approved', 'pending'].map((filter) => (
          <button
            key={filter}
            onClick={() => setApprovalFilter(filter)}
            className={`px-6 py-3 rounded-2xl transition-all duration-300 capitalize font-semibold ${
              approvalFilter === filter
                ? 'bg-gold text-black'
                : 'bg-card text-secondary hover:bg-opacity-80'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredProducts && filteredProducts.length > 0 ? (
        <ProductTable
          products={filteredProducts}
          onApprove={handleApprove}
          showActions={true}
          isAdmin={true}
          loading={loading}
        />
      ) : (
        <div className="bg-card rounded-2xl p-16 text-center luxury-shadow">
          <p className="text-secondary text-lg">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;

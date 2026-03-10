import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductTable from '../../components/dashboard/ProductTable';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import productService from '../../services/productService';

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getMyProducts();
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/vendor/products/edit/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        setProducts(products.filter(p => p._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
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
          <h1 className="text-white text-5xl font-playfair mb-2">My Products</h1>
          <p className="text-secondary text-lg">{products?.length || 0} products listed</p>
        </div>
        <Link to="/vendor/products/add">
          <Button variant="primary">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </span>
          </Button>
        </Link>
      </div>

      {products && products.length > 0 ? (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
          isAdmin={false}
          loading={loading}
        />
      ) : (
        <div className="bg-card rounded-2xl p-16 text-center luxury-shadow">
          <svg className="w-24 h-24 text-neutral-700 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h2 className="text-white text-3xl font-playfair mb-4">No products yet</h2>
          <p className="text-secondary mb-8 text-lg">Start selling by adding your first product</p>
          <Link to="/vendor/products/add">
            <Button variant="primary">Add Your First Product</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyProducts;

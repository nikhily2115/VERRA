import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import SearchBar from '../../components/product/SearchBar';
import Loader from '../../components/common/Loader';
import { ProductCardSkeleton } from '../../components/common/Skeleton';
import productService from '../../services/productService';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;
      
      if (filters.search) {
        response = await productService.searchProducts(filters.search);
      } else {
        response = await productService.getAllProducts(filters.category);
      }

      let filteredProducts = response.products || [];

      // Apply price filters
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= Number(filters.maxPrice));
      }

      // Apply sorting
      switch (filters.sort) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0));
          break;
        case 'newest':
        default:
          filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
      if (initialLoad) {
        setInitialLoad(false);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({
        category: '',
        minPrice: '',
        maxPrice: '',
        sort: 'newest',
        search: ''
      });
      setSearchParams({});
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
      if (key === 'category' && value) {
        setSearchParams({ category: value });
      } else if (key === 'category' && !value) {
        setSearchParams({});
      }
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  return (
    <div className="min-h-screen py-24 px-4 smooth-scroll">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h1 className="font-playfair text-5xl lg:text-6xl text-primary animate-slide-up">
            Luxury Collection
          </h1>
          <p className="text-secondary text-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Discover {loading ? '...' : products.length} exquisite products
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
            <div className="sticky top-24">
              <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 animate-slide-in-right" style={{ animationDelay: '0.8s' }}>
            {loading && initialLoad ? (
              // Initial loading with skeletons
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : loading ? (
              // Subsequent loading with spinner
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <Loader size="lg" />
                  <div className="absolute inset-0 animate-pulse-glow rounded-full" />
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 animate-bounce-in">
                <div className="animate-float">
                  <svg className="w-24 h-24 mx-auto text-secondary mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-playfair text-primary mb-2">No Products Found</h3>
                <p className="text-secondary mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => handleFilterChange('clear')}
                  className="bg-gold hover:bg-opacity-90 text-background font-semibold py-3 px-8 rounded-full transition-ultra-smooth hover:scale-105 luxury-shadow-lg focus-ring"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

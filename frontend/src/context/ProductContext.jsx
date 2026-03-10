import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: 'newest',
    priceRange: { min: 0, max: 1000000 },
  });

  const updateCategory = (category) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const updateSearch = (search) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const updateSort = (sort) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  const updatePriceRange = (priceRange) => {
    setFilters((prev) => ({ ...prev, priceRange }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      search: '',
      sort: 'newest',
      priceRange: { min: 0, max: 1000000 },
    });
  };

  const value = {
    filters,
    updateCategory,
    updateSearch,
    updateSort,
    updatePriceRange,
    resetFilters,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

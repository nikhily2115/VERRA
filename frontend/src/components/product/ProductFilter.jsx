import React from 'react';

const ProductFilter = ({ filters, onFilterChange }) => {
  const categories = ['All', 'Jewelry', 'Watches', 'Handbags', 'Accessories', 'Clothing'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-8">
      {/* Category Filter */}
      <div>
        <h3 className="text-primary font-semibold mb-4 text-sm tracking-wider uppercase">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onFilterChange('category', category === 'All' ? '' : category)}
              className={`block w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 ${
                (category === 'All' && !filters.category) || filters.category === category
                  ? 'bg-gold text-background font-semibold'
                  : 'text-secondary hover:text-gold hover:bg-background'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-primary font-semibold mb-4 text-sm tracking-wider uppercase">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="text-secondary text-sm mb-2 block">Min Price</label>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              placeholder="₹0"
              className="w-full bg-background border border-border focus:border-gold text-primary px-4 py-3 rounded-2xl outline-none transition-colors duration-300 placeholder-secondary"
            />
          </div>
          <div>
            <label className="text-secondary text-sm mb-2 block">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              placeholder="₹999999"
              className="w-full bg-background border border-border focus:border-gold text-primary px-4 py-3 rounded-2xl outline-none transition-colors duration-300 placeholder-secondary"
            />
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="text-primary font-semibold mb-4 text-sm tracking-wider uppercase">Sort By</h3>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full bg-background border border-border focus:border-gold text-primary px-4 py-3 rounded-2xl outline-none transition-colors duration-300"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFilterChange('clear')}
        className="w-full bg-background border border-gold text-gold px-4 py-3 rounded-2xl hover:bg-gold hover:text-background transition-all duration-300 font-semibold"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default ProductFilter;

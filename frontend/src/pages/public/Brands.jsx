import React from 'react';
import { Link } from 'react-router-dom';

const Brands = () => {
  const brands = [
    {
      id: 1,
      name: 'Cartier',
      category: 'Jewelry & Watches',
      description: 'French luxury goods conglomerate known for exquisite jewelry and timepieces',
      founded: '1847',
      origin: 'Paris, France',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Cartier-Logo.png'
    },
    {
      id: 2,
      name: 'Hermès',
      category: 'Handbags & Accessories',
      description: 'Iconic French brand renowned for leather goods and silk scarves',
      founded: '1837',
      origin: 'Paris, France',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Hermes-Logo.png'
    },
    {
      id: 3,
      name: 'Rolex',
      category: 'Watches',
      description: 'Swiss luxury watchmaker synonymous with precision and prestige',
      founded: '1905',
      origin: 'Geneva, Switzerland',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Rolex-Logo.png'
    },
    {
      id: 4,
      name: 'Chanel',
      category: 'Fashion & Fragrances',
      description: 'Legendary fashion house defining elegance and sophistication',
      founded: '1910',
      origin: 'Paris, France',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Chanel-Logo.png'
    },
    {
      id: 5,
      name: 'Louis Vuitton',
      category: 'Handbags & Luggage',
      description: 'Premier French fashion house specializing in luxury leather goods',
      founded: '1854',
      origin: 'Paris, France',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Louis-Vuitton-Logo.png'
    },
    {
      id: 6,
      name: 'Gucci',
      category: 'Fashion & Accessories',
      description: 'Italian luxury brand known for bold designs and craftsmanship',
      founded: '1921',
      origin: 'Florence, Italy',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Gucci-Logo.png'
    },
    {
      id: 7,
      name: 'Tiffany & Co.',
      category: 'Jewelry',
      description: 'American luxury jewelry and specialty retailer',
      founded: '1837',
      origin: 'New York, USA',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Tiffany-Co-Logo.png'
    },
    {
      id: 8,
      name: 'Patek Philippe',
      category: 'Watches',
      description: 'Swiss luxury watch manufacturer with unparalleled heritage',
      founded: '1839',
      origin: 'Geneva, Switzerland',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Patek-Philippe-Logo.png'
    }
  ];

  const brandCategories = [
    { name: 'Jewelry', count: 12 },
    { name: 'Watches', count: 8 },
    { name: 'Handbags', count: 15 },
    { name: 'Clothing', count: 10 },
    { name: 'Accessories', count: 18 },
    { name: 'Fragrances', count: 6 }
  ];

  return (
    <div className="min-h-screen py-24 px-4" style={{ backgroundColor: '#0B0B0B' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="font-playfair text-5xl lg:text-6xl text-white">Luxury Brands</h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Discover the world's most prestigious brands, each representing centuries of craftsmanship and excellence
          </p>
        </div>

        {/* Brand Categories */}
        <div className="mb-16">
          <h2 className="text-white text-2xl font-playfair mb-6 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandCategories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="group"
              >
                <div 
                  className="rounded-xl p-6 text-center transition-all duration-300 hover:transform hover:scale-105"
                  style={{ backgroundColor: '#111111' }}
                >
                  <div className="text-gold text-2xl font-playfair mb-2">{category.count}</div>
                  <div className="text-white text-sm font-semibold mb-1">{category.name}</div>
                  <div className="text-secondary text-xs">Brands</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Brands */}
        <div className="mb-12">
          <h2 className="text-white text-2xl font-playfair mb-8 text-center">Featured Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="group"
                style={{ backgroundColor: '#111111' }}
              >
                <div className="rounded-2xl p-8 transition-all duration-300 hover:bg-opacity-80">
                  {/* Brand Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white text-2xl font-playfair mb-2 group-hover:text-gold transition-colors duration-300">
                        {brand.name}
                      </h3>
                      <span className="text-gold text-sm font-semibold uppercase tracking-wider">
                        {brand.category}
                      </span>
                    </div>
                    <div className="w-20 h-20 rounded-xl bg-white bg-opacity-95 flex items-center justify-center p-3 transition-transform duration-300 group-hover:scale-105">
                      <img 
                        src={brand.logo} 
                        alt={`${brand.name} logo`}
                        className="w-full h-full object-contain filter"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center text-black text-xl font-playfair">
                        {brand.name.charAt(0)}
                      </div>
                    </div>
                  </div>

                  {/* Brand Description */}
                  <p className="text-secondary text-sm leading-relaxed mb-4">
                    {brand.description}
                  </p>

                  {/* Brand Info */}
                  <div className="flex gap-6 text-sm mb-4">
                    <div>
                      <span className="text-secondary">Founded:</span>
                      <span className="text-white ml-2">{brand.founded}</span>
                    </div>
                    <div>
                      <span className="text-secondary">Origin:</span>
                      <span className="text-white ml-2">{brand.origin}</span>
                    </div>
                  </div>

                  {/* View Products Link */}
                  <Link
                    to="/products"
                    className="inline-flex items-center text-gold text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300"
                  >
                    View Products
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className="rounded-2xl p-12 text-center"
          style={{ backgroundColor: '#111111' }}
        >
          <h2 className="text-white text-3xl font-playfair mb-4">
            Become a Brand Partner
          </h2>
          <p className="text-secondary mb-8 max-w-2xl mx-auto">
            Are you a luxury brand looking to showcase your products? Join our exclusive marketplace and reach discerning customers worldwide.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-gold hover:bg-opacity-90 text-black font-semibold py-3 px-8 rounded-full transition-all duration-300"
          >
            Partner With Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Brands;

import React from 'react';
import { Link } from 'react-router-dom';

const Collections = () => {
  const collections = [
    {
      id: 1,
      name: 'Signature Collection',
      description: 'Timeless pieces that define luxury',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Jewelry',
      itemCount: 45
    },
    {
      id: 2,
      name: 'Heritage Timepieces',
      description: 'Exquisite watches crafted with precision',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Watches',
      itemCount: 32
    },
    {
      id: 3,
      name: 'Couture Handbags',
      description: 'Elegant designs for the modern sophisticate',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Handbags',
      itemCount: 28
    },
    {
      id: 4,
      name: 'Fine Accessories',
      description: 'Complete your look with refined details',
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Accessories',
      itemCount: 56
    },
    {
      id: 5,
      name: 'Luxury Fragrances',
      description: 'Captivating scents for every occasion',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Fragrances',
      itemCount: 24
    },
    {
      id: 6,
      name: 'Designer Clothing',
      description: 'Haute couture for the discerning wardrobe',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Clothing',
      itemCount: 38
    }
  ];

  return (
    <div className="min-h-screen py-24 px-4" style={{ backgroundColor: '#0B0B0B' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="font-playfair text-5xl lg:text-6xl text-white">Our Collections</h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Explore our curated collections of luxury items, each telling a unique story of craftsmanship and elegance
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/products?category=${collection.category}`}
              className="group"
            >
              <div 
                className="rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105"
                style={{ backgroundColor: '#111111' }}
              >
                {/* Image */}
                <div className="relative h-80 bg-neutral-800 overflow-hidden">
                  <img 
                    src={collection.image} 
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center bg-neutral-800">
                    <svg className="w-24 h-24 text-gold opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gold text-sm font-semibold uppercase tracking-wider">
                      {collection.category}
                    </span>
                    <span className="text-secondary text-sm">
                      {collection.itemCount} items
                    </span>
                  </div>
                  <h3 className="text-white text-2xl font-playfair mb-2 group-hover:text-gold transition-colors duration-300">
                    {collection.name}
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    {collection.description}
                  </p>
                  <div className="mt-4 flex items-center text-gold text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Explore Collection
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div 
          className="mt-20 rounded-2xl p-12 text-center"
          style={{ backgroundColor: '#111111' }}
        >
          <h2 className="text-white text-3xl font-playfair mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-secondary mb-8 max-w-2xl mx-auto">
            Browse our complete catalog of luxury items or contact our concierge service for personalized assistance
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/products"
              className="bg-gold hover:bg-opacity-90 text-black font-semibold py-3 px-8 rounded-full transition-all duration-300"
            >
              View All Products
            </Link>
            <Link
              to="/contact"
              className="border-2 border-gold text-gold hover:bg-gold hover:text-black font-semibold py-3 px-8 rounded-full transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import productService from '../../services/productService';
import Loader from '../../components/common/Loader';
import { ProductCardSkeleton } from '../../components/common/Skeleton';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        setFeaturedProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Newsletter signup:', email);
    setEmail('');
    setNewsletterLoading(false);
  };

  const categories = [
    { 
      name: 'Jewelry', 
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=800&fit=crop', 
      link: '/products?category=Jewelry' 
    },
    { 
      name: 'Watches', 
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=800&fit=crop', 
      link: '/products?category=Watches' 
    },
    { 
      name: 'Handbags', 
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop', 
      link: '/products?category=Handbags' 
    }
  ];

  const features = [
    { icon: '✓', text: 'Authenticity Guaranteed' },
    { icon: '★', text: 'Curated Selection' },
    { icon: '♦', text: 'Premium Quality' },
    { icon: '◆', text: 'Exclusive Access' }
  ];

  const filters = ['All', 'New', 'Trending', 'Limited'];

  const testimonials = [
    {
      name: 'Sophia Chen',
      role: 'Collector',
      text: 'VERRA has transformed my shopping experience. Every piece is a masterpiece.',
      rating: 5
    },
    {
      name: 'Marcus Williams',
      role: 'Enthusiast',
      text: 'Unparalleled quality and service. The attention to detail is remarkable.',
      rating: 5
    },
    {
      name: 'Isabella Rodriguez',
      role: 'Designer',
      text: 'A curated marketplace that truly understands luxury and elegance.',
      rating: 5
    }
  ];

  const serviceFeatures = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Free Delivery',
      description: 'On orders over $500'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Secure Payment',
      description: 'Protected transactions'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: '24/7 Support',
      description: 'Dedicated assistance'
    }
  ];

  return (
    <div className="min-h-screen smooth-scroll">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center gpu-accelerated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <p className="text-gold text-sm tracking-[0.3em] uppercase font-medium animate-slide-up">
                  Luxury Redefined
                </p>
                <h1 className="font-playfair text-6xl lg:text-7xl xl:text-8xl text-primary leading-tight animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  Timeless
                  <br />
                  <span className="text-gold animate-pulse-glow">Elegance</span>
                </h1>
                <p className="text-secondary text-lg leading-relaxed max-w-md animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  Discover an exclusive collection of meticulously curated luxury pieces from the world's finest artisans.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <Link
                  to="/products"
                  className="bg-gold hover:bg-opacity-90 text-background font-semibold py-4 px-10 rounded-full transition-ultra-smooth hover:scale-105 inline-block luxury-shadow-lg focus-ring"
                >
                  Explore Collection
                </Link>
                <Link
                  to="/about"
                  className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-background font-semibold py-4 px-10 rounded-full transition-ultra-smooth inline-block focus-ring"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative animate-slide-in-right" style={{ animationDelay: '0.8s' }}>
              <div className="relative rounded-2xl overflow-hidden luxury-shadow-xl hover-lift">
                <img
                  src="https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=800&h=1000&fit=crop"
                  alt="Luxury Collection"
                  className="w-full h-[600px] object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-card border border-gold rounded-2xl p-6 luxury-shadow-lg animate-float">
                <p className="text-gold text-4xl font-playfair font-bold">500+</p>
                <p className="text-secondary text-sm">Exclusive Items</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Bar */}
      <section className="border-y border-border bg-card animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center space-x-3 animate-scale-in hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-gold text-2xl animate-pulse-glow">{feature.icon}</span>
                <span className="text-primary text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h2 className="font-playfair text-5xl lg:text-6xl text-primary animate-slide-up">
              Shop by Category
            </h2>
            <p className="text-secondary text-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Explore our curated collections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={category.link}
                className="group relative h-[500px] rounded-2xl overflow-hidden hover:luxury-shadow-xl transition-ultra-smooth animate-fade-in hover-lift gpu-accelerated"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 transform-gpu"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-primary text-3xl font-playfair mb-2 group-hover:text-gold transition-colors duration-300">
                    {category.name}
                  </h3>
                  <span className="text-gold text-sm flex items-center">
                    Explore Collection
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trending Products */}
      <section className="py-24 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4 animate-fade-in">
            <h2 className="font-playfair text-5xl lg:text-6xl text-primary animate-slide-up">
              Trending Now
            </h2>
            <p className="text-secondary text-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Handpicked luxury items for the discerning collector
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {filters.map((filter, index) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter.toLowerCase())}
                className={`px-8 py-3 rounded-full font-medium transition-ultra-smooth hover-scale focus-ring ${
                  activeFilter === filter.toLowerCase()
                    ? 'bg-gold text-background animate-pulse-glow'
                    : 'bg-background text-secondary hover:text-gold border border-border'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {filter}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}

          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '1s' }}>
            <Link
              to="/products"
              className="inline-block bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-background font-semibold py-4 px-10 rounded-full transition-ultra-smooth hover-scale focus-ring"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Offer Banner */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card border border-gold rounded-2xl overflow-hidden luxury-shadow-lg">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: Image */}
              <div className="relative h-[400px] lg:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=600&fit=crop"
                  alt="Special Offer"
                  className="w-full h-full object-cover"
                />
                {/* Discount Badge */}
                <div className="absolute top-8 left-8 bg-gold text-background rounded-full w-24 h-24 flex flex-col items-center justify-center">
                  <span className="text-3xl font-playfair font-bold">25%</span>
                  <span className="text-xs font-semibold">OFF</span>
                </div>
              </div>

              {/* Right: Content */}
              <div className="p-12 lg:p-16 flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <p className="text-gold text-sm tracking-[0.3em] uppercase font-medium">
                    Limited Time Offer
                  </p>
                  <h2 className="font-playfair text-4xl lg:text-5xl text-primary leading-tight">
                    Exclusive
                    <br />
                    <span className="text-gold">Summer Collection</span>
                  </h2>
                  <p className="text-secondary text-lg leading-relaxed">
                    Discover our handpicked selection of summer essentials. Elegance meets functionality in this limited collection.
                  </p>
                </div>
                <div>
                  <Link
                    to="/products"
                    className="inline-block bg-gold hover:bg-opacity-90 text-background font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-playfair text-5xl lg:text-6xl text-primary">
              What Our Clients Say
            </h2>
            <p className="text-secondary text-lg">
              Trusted by collectors worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-background border border-border rounded-2xl p-8 space-y-6 hover:border-gold transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-secondary leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div>
                  <p className="text-primary font-semibold">{testimonial.name}</p>
                  <p className="text-secondary text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Service Features */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center space-y-4 p-8 bg-card border border-border rounded-2xl hover:border-gold transition-all duration-300"
              >
                <div className="text-gold flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-primary font-semibold text-lg">
                  {feature.title}
                </h3>
                <p className="text-secondary text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Newsletter */}
      <section className="py-24 px-4 bg-card">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h2 className="font-playfair text-4xl lg:text-5xl text-primary animate-slide-up">
              Join Our Exclusive Circle
            </h2>
            <p className="text-secondary text-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Subscribe to receive early access to new collections, exclusive offers, and curated recommendations.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-background border border-border focus:border-gold text-primary px-6 py-4 rounded-full outline-none transition-ultra-smooth placeholder-secondary focus:scale-[1.02] focus:luxury-shadow-lg focus-ring"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="bg-gold hover:bg-opacity-90 text-background font-semibold px-8 py-4 rounded-full transition-ultra-smooth hover:scale-105 whitespace-nowrap luxury-shadow-lg focus-ring disabled:opacity-50"
              >
                {newsletterLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    <span>Subscribing...</span>
                  </div>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          </form>

          <p className="text-secondary text-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;

import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gold mb-6 tracking-wider">
            About VERRA
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
            Curating excellence in luxury goods since 2024
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-card rounded-2xl p-8 md:p-12 mb-12 border border-border">
          <h2 className="text-3xl font-playfair font-bold text-primary mb-6">Our Story</h2>
          <div className="space-y-4 text-secondary leading-relaxed">
            <p>
              VERRA was born from a passion for exceptional craftsmanship and timeless elegance. 
              We believe that luxury is not just about price—it's about quality, authenticity, and the story behind each piece.
            </p>
            <p>
              Our marketplace connects discerning collectors with verified vendors who share our commitment 
              to excellence. Every item in our collection is carefully curated to meet the highest standards 
              of quality and authenticity.
            </p>
            <p>
              From rare timepieces to exquisite jewelry, from fine art to luxury accessories, VERRA is your 
              trusted destination for acquiring pieces that transcend trends and become treasured heirlooms.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="text-gold text-4xl mb-4">✦</div>
            <h3 className="text-xl font-playfair font-bold text-primary mb-3">Authenticity</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Every item is verified for authenticity. We work only with trusted vendors who provide 
              complete provenance and certification.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="text-gold text-4xl mb-4">✦</div>
            <h3 className="text-xl font-playfair font-bold text-primary mb-3">Excellence</h3>
            <p className="text-secondary text-sm leading-relaxed">
              We curate only the finest pieces that exemplify superior craftsmanship, timeless design, 
              and exceptional quality.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="text-gold text-4xl mb-4">✦</div>
            <h3 className="text-xl font-playfair font-bold text-primary mb-3">Trust</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Your confidence is paramount. We provide secure transactions, buyer protection, 
              and exceptional customer service.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-2xl p-12 border border-border">
          <h2 className="text-3xl font-playfair font-bold text-primary mb-4">
            Begin Your Collection
          </h2>
          <p className="text-secondary mb-8 max-w-2xl mx-auto">
            Explore our curated selection of luxury items and discover pieces that speak to your refined taste.
          </p>
          <Link
            to="/products"
            className="inline-block bg-gold hover:bg-opacity-90 text-background font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

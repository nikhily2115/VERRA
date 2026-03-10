import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import userService from '../../services/userService';

const ProductCard = ({ product, index = 0 }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showSuccess, showError, showWarning } = useToast();
  const [addingToWishlist, setAddingToWishlist] = React.useState(false);
  const [addingToCart, setAddingToCart] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showWarning('Please login to add items to cart');
      return;
    }
    try {
      setAddingToCart(true);
      await addToCart(product._id, 1);
      showSuccess('Added to cart!');
    } catch (error) {
      showError(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showWarning('Please login to add items to wishlist');
      return;
    }
    try {
      setAddingToWishlist(true);
      await userService.addToWishlist(product._id);
      showSuccess('Added to wishlist!');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to add to wishlist');
    } finally {
      setAddingToWishlist(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="group relative animate-fade-in hover-lift gpu-accelerated will-change-transform"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/products/${product._id}`}
        className="block bg-card border border-border rounded-2xl overflow-hidden hover:border-gold transition-ultra-smooth hover:luxury-shadow-xl transform-gpu"
      >
        {/* Product Image */}
        <div className="relative overflow-hidden bg-background aspect-square">
          {product.images && product.images[0] ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 skeleton animate-shimmer" />
              )}
              <img
                src={product.images[0]}
                alt={product.title}
                loading="lazy"
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out transform-gpu ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-secondary animate-pulse">
              <svg
                className="h-20 w-20 animate-float"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleAddToWishlist}
            disabled={addingToWishlist}
            className={`absolute top-4 right-4 glass-effect hover:bg-gold text-secondary hover:text-background p-3 rounded-full transition-ultra-smooth hover:scale-110 backdrop-blur-sm focus-ring ${
              addingToWishlist ? 'animate-pulse-glow' : ''
            }`}
          >
            <svg
              className={`h-5 w-5 transition-all duration-300 ${addingToWishlist ? 'animate-bounce-in' : ''}`}
              fill={addingToWishlist ? 'currentColor' : 'none'}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full animate-bounce-in">
              Out of Stock
            </div>
          )}

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-3">
          <h3 className="text-lg font-playfair font-semibold text-primary group-hover:text-gold transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
            {product.title}
          </h3>

          <p className="text-secondary text-sm line-clamp-2 min-h-[2.5rem] transition-colors duration-300 group-hover:text-neutral-300">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-playfair font-bold text-gold animate-pulse-glow">
              {formatPrice(product.price)}
            </span>

            {product.stock > 0 && (
              <span className="text-xs text-secondary transition-colors duration-300 group-hover:text-neutral-400">
                {product.stock} available
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Hover Add to Cart Button */}
      {user && user.role === 'user' && product.stock > 0 && (
        <div
          className={`absolute bottom-6 left-6 right-6 transition-all duration-500 ease-out transform-gpu ${
            isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className={`w-full bg-gold hover:bg-opacity-90 text-background font-semibold py-3 px-6 rounded-full transition-ultra-smooth hover:scale-105 luxury-shadow-lg focus-ring ${
              addingToCart ? 'animate-pulse-glow' : ''
            }`}
          >
            {addingToCart ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </div>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;

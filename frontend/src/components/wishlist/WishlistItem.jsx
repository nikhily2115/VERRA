import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import userService from '../../services/userService';
import Button from '../common/Button';

const WishlistItem = ({ product, onRemove }) => {
  const { addToCart } = useCart();

  const handleMoveToCart = async () => {
    try {
      // Add to cart
      await addToCart(product._id, 1);
      // Remove from wishlist
      await userService.removeFromWishlist(product._id);
      onRemove(product._id);
    } catch (error) {
      console.error('Error moving to cart:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await userService.removeFromWishlist(product._id);
      onRemove(product._id);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 flex gap-6 group hover:bg-opacity-80 transition-all duration-300 luxury-shadow">
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="w-32 h-32 flex-shrink-0">
        <img
          src={product.images[0] || 'https://via.placeholder.com/150'}
          alt={product.title}
          className="w-full h-full object-cover rounded-2xl"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-white text-xl font-semibold mb-2 hover:text-gold transition-all duration-300">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-secondary text-sm mb-4">{product.category}</p>
        
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gold text-2xl font-semibold">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.stock > 0 ? (
            <span className="text-green-500 text-sm font-semibold">In Stock</span>
          ) : (
            <span className="text-red-500 text-sm font-semibold">Out of Stock</span>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleMoveToCart}
            variant="primary"
            size="sm"
            disabled={product.stock === 0}
          >
            Move to Cart
          </Button>
          <Button
            onClick={handleRemove}
            variant="outline"
            size="sm"
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Remove Icon Button */}
      <button
        onClick={handleRemove}
        className="text-secondary hover:text-red-500 transition-all duration-300 opacity-0 group-hover:opacity-100"
        title="Remove from wishlist"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default WishlistItem;

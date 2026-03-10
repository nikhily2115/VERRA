import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../common/Button';

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleAddToCart = async () => {
    if (!user) {
      showError('Please login to add items to cart');
      return;
    }

    if (user.role !== 'user') {
      showError('Only customers can add items to cart');
      return;
    }

    try {
      setLoading(true);
      await addToCart(product._id, quantity);
      showSuccess(`${product.title} added to cart!`);
      setQuantity(1); // Reset quantity after successful add
    } catch (error) {
      showError(error.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image Gallery */}
      <div>
        <div className="bg-neutral-900 rounded-lg overflow-hidden mb-4">
          <img
            src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
            alt={product.title}
            className="w-full h-96 object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`bg-neutral-900 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-gold' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h1 className="font-playfair text-4xl text-white mb-4">{product.title}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="text-3xl text-gold font-semibold">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.stock > 0 ? (
            <span className="text-green-500">In Stock ({product.stock})</span>
          ) : (
            <span className="text-red-500">Out of Stock</span>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-white text-lg mb-2">Category</h3>
          <span className="inline-block bg-neutral-800 text-gold px-4 py-2 rounded-lg">
            {product.category}
          </span>
        </div>

        <div className="mb-8">
          <h3 className="text-white text-lg mb-2">Description</h3>
          <p className="text-neutral-300 leading-relaxed">{product.description}</p>
        </div>

        {user && user.role === 'user' && product.stock > 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  -
                </button>
                <span className="text-white text-xl w-12 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <Button 
              onClick={handleAddToCart} 
              variant="primary" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

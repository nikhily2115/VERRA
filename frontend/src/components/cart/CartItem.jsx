import React from 'react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateCart, removeFromCart } = useCart();

  const handleIncrement = () => {
    if (item.quantity < item.product.stock) {
      updateCart(item.product._id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateCart(item.product._id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.product._id);
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <div className="bg-card rounded-2xl p-6 flex gap-6 luxury-shadow hover:bg-opacity-80 transition-all duration-300">
      {/* Product Image */}
      <div className="w-32 h-32 flex-shrink-0">
        <img
          src={item.product.images[0] || 'https://via.placeholder.com/150'}
          alt={item.product.title}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="text-white text-xl font-semibold mb-2">{item.product.title}</h3>
        <p className="text-secondary text-sm mb-4">{item.product.category}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gold text-lg font-semibold">
              ₹{item.product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-neutral-500">×</span>
            
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                disabled={item.quantity <= 1}
                className="w-8 h-8 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="text-white w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={handleIncrement}
                disabled={item.quantity >= item.product.stock}
                className="w-8 h-8 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="text-secondary text-sm">Subtotal</p>
            <p className="text-white text-xl font-semibold">
              ₹{subtotal.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.product.stock && (
          <p className="text-yellow-500 text-sm mt-2 font-semibold">Maximum stock reached</p>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="text-secondary hover:text-red-500 transition-all duration-300"
        title="Remove from cart"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;

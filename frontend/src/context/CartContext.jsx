import React, { createContext, useContext, useState, useEffect } from 'react';
import userService from '../services/userService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getCart();
      // Backend returns { success, data: { cart, total } }
      setCartItems(response.data?.cart || []);
      setCartTotal(response.data?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
      setCartItems([]);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.addToCart(productId, quantity);
      // Backend returns { success, data: cart }
      setCartItems(response.data || []);
      // Recalculate total from cart items
      const total = (response.data || []).reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);
      setCartTotal(total);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = async (productId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      await userService.updateCart(productId, quantity);
      await fetchCart();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      await userService.removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove from cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartTotal(0);
  };

  const value = {
    cartItems,
    cartTotal,
    loading,
    error,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

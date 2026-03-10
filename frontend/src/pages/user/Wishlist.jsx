import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import WishlistItem from '../../components/wishlist/WishlistItem';
import Loader from '../../components/common/Loader';
import userService from '../../services/userService';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await userService.getWishlist();
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (productId) => {
    setWishlist(wishlist.filter(item => item._id !== productId));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-card rounded-2xl p-12 max-w-md mx-auto luxury-shadow">
          <svg className="w-24 h-24 text-neutral-700 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-white text-3xl font-playfair mb-4">Your wishlist is empty</h2>
          <p className="text-secondary mb-8">Save items you love for later</p>
          <Link
            to="/products"
            className="inline-block bg-gold text-black px-8 py-4 rounded-2xl font-semibold hover:bg-opacity-90 transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-white text-5xl font-playfair mb-2">My Wishlist</h1>
          <p className="text-secondary text-lg">{wishlist.length} items saved</p>
        </div>
      </div>

      <div className="space-y-4">
        {wishlist.map((product) => (
          <WishlistItem
            key={product._id}
            product={product}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

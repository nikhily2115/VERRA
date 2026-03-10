import React from 'react';
import Button from '../common/Button';

const CartSummary = ({ cartTotal, onCheckout, loading = false }) => {
  // Calculate additional charges (can be customized)
  const tax = cartTotal * 0.18; // 18% GST
  const shipping = cartTotal > 10000 ? 0 : 200; // Free shipping above ₹10,000
  const total = cartTotal + tax + shipping;

  return (
    <div className="bg-card rounded-2xl p-8 sticky top-24 luxury-shadow">
      <h2 className="text-white text-3xl font-playfair mb-8">Order Summary</h2>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-secondary">
          <span>Subtotal</span>
          <span className="font-semibold">₹{cartTotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between text-secondary">
          <span>Tax (GST 18%)</span>
          <span className="font-semibold">₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
        </div>

        <div className="flex justify-between text-secondary">
          <span>Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-green-500">FREE</span>
            ) : (
              `₹${shipping.toLocaleString('en-IN')}`
            )}
          </span>
        </div>

        {cartTotal < 10000 && cartTotal > 0 && (
          <p className="text-sm text-secondary bg-neutral-800 p-4 rounded-2xl border border-border">
            Add ₹{(10000 - cartTotal).toLocaleString('en-IN')} more for free shipping
          </p>
        )}

        <div className="border-t border-border pt-4">
          <div className="flex justify-between text-white text-xl font-semibold">
            <span>Total</span>
            <span className="text-gold">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        variant="primary"
        className="w-full"
        disabled={loading || cartTotal === 0}
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </Button>

      <div className="mt-8 space-y-3">
        <div className="flex items-center gap-2 text-secondary text-sm">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-2 text-secondary text-sm">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Easy returns within 30 days</span>
        </div>
        <div className="flex items-center gap-2 text-secondary text-sm">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Authentic luxury products</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

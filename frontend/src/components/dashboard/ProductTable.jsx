import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { TableSkeleton } from '../common/Skeleton';

const ProductTable = ({ products, onEdit, onDelete, onApprove, showActions = true, isAdmin = false, loading = false }) => {
  const getApprovalBadge = (isApproved) => {
    return isApproved ? (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500 bg-opacity-20 text-green-500">
        Approved
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 bg-opacity-20 text-yellow-500">
        Pending
      </span>
    );
  };

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return <span className="text-red-500">Out of Stock</span>;
    } else if (stock < 10) {
      return <span className="text-yellow-500">Low Stock ({stock})</span>;
    } else {
      return <span className="text-green-500">In Stock ({stock})</span>;
    }
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={showActions ? 6 : 5} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-12 text-center luxury-shadow">
        <p className="text-secondary text-lg">No products found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-2xl overflow-hidden luxury-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Status</th>
                {showActions && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-neutral-800 transition-all duration-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/50'}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <Link
                          to={`/products/${product._id}`}
                          className="text-white font-medium hover:text-gold transition-all duration-300"
                        >
                          {product.title}
                        </Link>
                        <p className="text-secondary text-sm truncate max-w-xs">
                          {product.description?.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary text-sm">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    ₹{product.price?.toLocaleString('en-IN') || '0'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {getStockStatus(product.stock)}
                  </td>
                  <td className="px-6 py-4">
                    {getApprovalBadge(product.isApproved)}
                  </td>
                  {showActions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isAdmin ? (
                          <Button
                            onClick={() => onApprove && onApprove(product._id, product.isApproved)}
                            variant={product.isApproved ? 'outline' : 'primary'}
                            size="sm"
                          >
                            {product.isApproved ? 'Reject' : 'Approve'}
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={() => onEdit && onEdit(product._id)}
                              variant="outline"
                              size="sm"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => onDelete && onDelete(product._id)}
                              variant="danger"
                              size="sm"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div key={product._id} className="bg-card rounded-2xl p-4 hover:bg-opacity-80 transition-all duration-300 luxury-shadow">
            <div className="flex gap-4 mb-3">
              <img
                src={product.images[0] || 'https://via.placeholder.com/80'}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-2xl"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${product._id}`}
                  className="text-white font-medium hover:text-gold transition-all duration-300 block mb-1"
                >
                  {product.title}
                </Link>
                <p className="text-secondary text-xs mb-2">{product.category}</p>
                <p className="text-white font-semibold">₹{product.price?.toLocaleString('en-IN') || '0'}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-3">
              <div className="text-sm">{getStockStatus(product.stock)}</div>
              {getApprovalBadge(product.isApproved)}
            </div>

            {showActions && (
              <div className="flex gap-2">
                {isAdmin ? (
                  <Button
                    onClick={() => onApprove && onApprove(product._id, product.isApproved)}
                    variant={product.isApproved ? 'outline' : 'primary'}
                    size="sm"
                    className="flex-1"
                  >
                    {product.isApproved ? 'Reject' : 'Approve'}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => onEdit && onEdit(product._id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => onDelete && onDelete(product._id)}
                      variant="danger"
                      size="sm"
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductTable;

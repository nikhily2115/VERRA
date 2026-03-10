import React from 'react';
import Button from '../common/Button';
import { TableSkeleton } from '../common/Skeleton';

const UserTable = ({ users, onBlock, isVendorTable = false, loading = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    const colors = {
      user: 'bg-blue-500 bg-opacity-20 text-blue-500',
      vendor: 'bg-purple-500 bg-opacity-20 text-purple-500',
      admin: 'bg-gold bg-opacity-20 text-gold'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[role] || colors.user}`}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (isBlocked) => {
    return isBlocked ? (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 bg-opacity-20 text-red-500">
        Blocked
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500 bg-opacity-20 text-green-500">
        Active
      </span>
    );
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={isVendorTable ? 7 : 6} />;
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-12 text-center luxury-shadow">
        <p className="text-secondary text-lg">No {isVendorTable ? 'vendors' : 'users'} found</p>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Joined</th>
                {isVendorTable && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Products</th>
                )}
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-neutral-800 transition-all duration-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gold bg-opacity-20 rounded-full flex items-center justify-center text-gold font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary text-sm">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.isBlocked)}
                  </td>
                  <td className="px-6 py-4 text-neutral-300 text-sm">
                    {formatDate(user.createdAt)}
                  </td>
                  {isVendorTable && (
                    <td className="px-6 py-4 text-neutral-300 text-sm">
                      {user.productCount || 0} products
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => onBlock && onBlock(user._id, user.isBlocked)}
                      variant={user.isBlocked ? 'primary' : 'danger'}
                      size="sm"
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user._id} className="bg-card rounded-2xl p-4 hover:bg-opacity-80 transition-all duration-300 luxury-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-gold bg-opacity-20 rounded-full flex items-center justify-center text-gold font-semibold text-lg">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium mb-1">{user.name}</h3>
                <p className="text-secondary text-sm truncate">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Role:</span>
                {getRoleBadge(user.role)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Status:</span>
                {getStatusBadge(user.isBlocked)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Joined:</span>
                <span className="text-secondary text-sm">{formatDate(user.createdAt)}</span>
              </div>
              {isVendorTable && (
                <div className="flex justify-between items-center">
                  <span className="text-secondary text-sm">Products:</span>
                  <span className="text-secondary text-sm">{user.productCount || 0} products</span>
                </div>
              )}
            </div>

            <Button
              onClick={() => onBlock && onBlock(user._id, user.isBlocked)}
              variant={user.isBlocked ? 'primary' : 'danger'}
              size="sm"
              className="w-full"
            >
              {user.isBlocked ? 'Unblock' : 'Block'}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserTable;

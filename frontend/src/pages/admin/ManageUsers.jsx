import React, { useEffect, useState } from 'react';
import UserTable from '../../components/dashboard/UserTable';
import Loader from '../../components/common/Loader';
import adminService from '../../services/adminService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (userId, currentStatus) => {
    try {
      await adminService.blockUser(userId);
      // Update local state
      setUsers(users.map(u =>
        u._id === userId ? { ...u, isBlocked: !currentStatus } : u
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-white text-5xl font-playfair mb-2">Manage Users</h1>
          <p className="text-secondary text-lg">{users.length} registered users</p>
        </div>
      </div>

      {users.length > 0 ? (
        <UserTable users={users} onBlock={handleBlock} isVendorTable={false} loading={loading} />
      ) : (
        <div className="bg-card rounded-2xl p-16 text-center luxury-shadow">
          <p className="text-secondary text-lg">No users found</p>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

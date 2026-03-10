import React, { useEffect, useState } from 'react';
import UserTable from '../../components/dashboard/UserTable';
import Loader from '../../components/common/Loader';
import adminService from '../../services/adminService';

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await adminService.getAllVendors();
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (vendorId, currentStatus) => {
    try {
      await adminService.blockUser(vendorId);
      // Update local state
      setVendors(vendors.map(v =>
        v._id === vendorId ? { ...v, isBlocked: !currentStatus } : v
      ));
    } catch (error) {
      console.error('Error updating vendor status:', error);
      alert('Failed to update vendor status');
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
          <h1 className="text-white text-5xl font-playfair mb-2">Manage Vendors</h1>
          <p className="text-secondary text-lg">{vendors.length} registered vendors</p>
        </div>
      </div>

      {vendors.length > 0 ? (
        <UserTable users={vendors} onBlock={handleBlock} isVendorTable={true} loading={loading} />
      ) : (
        <div className="bg-card rounded-2xl p-16 text-center luxury-shadow">
          <p className="text-secondary text-lg">No vendors found</p>
        </div>
      )}
    </div>
  );
};

export default ManageVendors;

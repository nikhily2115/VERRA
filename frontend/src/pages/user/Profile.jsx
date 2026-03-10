import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import userService from '../../services/userService';

const Profile = () => {
  const { user, checkAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await userService.updateProfile(formData);
      setSuccess('Profile updated successfully');
      await checkAuth(); // Refresh user data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-white text-5xl font-playfair mb-12">My Profile</h1>

      <div className="max-w-2xl">
        <div className="bg-card rounded-2xl p-8 luxury-shadow">
          {error && <ErrorMessage message={error} className="mb-6" />}
          {success && (
            <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-3 rounded-2xl mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />

            <div>
              <label className="block text-secondary text-sm mb-2 font-semibold">
                Account Type
              </label>
              <div className="bg-neutral-800 px-4 py-3 rounded-2xl border border-border">
                <span className="text-white capitalize">{user?.role}</span>
              </div>
              <p className="text-neutral-500 text-xs mt-2">
                Account type cannot be changed
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || ''
                  });
                  setError('');
                  setSuccess('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-card rounded-2xl p-8 mt-6 luxury-shadow">
          <h2 className="text-white text-2xl font-playfair mb-6">Account Information</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-secondary">Member Since</span>
              <span className="text-white font-semibold">
                {new Date(user?.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-secondary">Account Status</span>
              <span className={user?.isBlocked ? 'text-red-500 font-semibold' : 'text-green-500 font-semibold'}>
                {user?.isBlocked ? 'Blocked' : 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

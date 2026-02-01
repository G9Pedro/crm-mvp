import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <Card title="Profile Information">
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleProfileChange}
            required
          />

          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password */}
      <Card title="Change Password">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            required
          />

          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            required
          />

          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={passwordLoading}>
              Change Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Account Information */}
      <Card title="Account Information">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Account Role</label>
            <p className="mt-1 text-gray-900 capitalize">{user?.role}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Account Status</label>
            <p className="mt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Active
              </span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;

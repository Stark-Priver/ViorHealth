import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Shield, Calendar, Save } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await api.put(`/accounts/users/${user.id}/`, profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      await api.post('/accounts/change-password/', {
        old_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      toast.success('Password changed successfully');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'pharmacist':
        return 'bg-green-100 text-green-800';
      case 'cashier':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">My Profile</h1>
        <p className="text-neutral-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-neutral-800">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-neutral-600 mt-1">{user?.username}</p>
              <div className="mt-3">
                <Badge className={getRoleBadgeColor(user?.role)}>
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
              
              <div className="w-full mt-6 pt-6 border-t border-neutral-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user?.email || 'No email'}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-3 text-sm text-neutral-600">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {user?.date_joined ? 
                      new Date(user.date_joined).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Settings Tabs */}
        <div className="lg:col-span-2">
          <Card>
            {/* Tabs */}
            <div className="border-b border-neutral-200 mb-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === 'password'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-1">Password Requirements</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Mix of letters, numbers, and symbols recommended</li>
                        <li>• Different from your current password</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={loading}>
                    <Lock className="w-4 h-4 mr-2" />
                    {loading ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

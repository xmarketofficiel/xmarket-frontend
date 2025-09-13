'use client';

import { useState, useRef } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, Camera, Upload, Eye, EyeOff, Lock } from 'lucide-react';
import { api } from '../../../lib/apiEndpoints';
import { motion } from 'framer-motion';

export default function EditProfilePage() {
  const { user, refreshUser } = useUser();
  const { addToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    whatsappNumber: user?.whatsappNumber || '',
    profilePicture: user?.profileImageUrl || user?.profilePicture || '',
  });

  const [privacySettings, setPrivacySettings] = useState({
    showSoldItems: user?.privacy?.showSoldItems ?? user?.showSoldItems ?? true,
    showPurchases: user?.privacy?.showPurchases ?? user?.showPurchases ?? true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [changingPassword, setChangingPassword] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      addToast('Please select a valid image file (JPG, PNG, or WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size must be less than 5MB', 'error');
      return;
    }

    setImageUploading(true);
    
    try {
      const response = await api.users.uploadAvatar(file);
      
      if (response.data) {
        await refreshUser();
        const newImageUrl = response.data.profileImageUrl;
        if (newImageUrl) {
          setFormData(prev => ({ ...prev, profilePicture: newImageUrl }));
        }
        addToast('Profile image updated successfully', 'success');
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to upload image. Please try again', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        fullName: formData.fullName,
        whatsappNumber: formData.whatsappNumber,
        privacy: privacySettings,
      };
      
      const response = await api.users.updateProfile(updateData);
      
      if (response.data) {
        await refreshUser();
        addToast('Profile updated successfully', 'success');
        router.push('/profile');
      }
    } catch (error: any) {
      if (error.status === 400) {
        addToast(error.message || 'Please check your input and try again', 'error');
      } else if (error.status === 401) {
        addToast('Session expired. Please log in again', 'error');
      } else {
        addToast('Failed to update profile. Please try again', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('New password and confirm password do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      addToast('Password must be at least 8 characters long', 'error');
      return;
    }

    setChangingPassword(true);

    try {
      await api.users.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      addToast('Password changed successfully', 'success');
    } catch (error: any) {
      if (error.status === 400) {
        addToast(error.message || 'Current password is incorrect', 'error');
      } else {
        addToast('Failed to change password. Please try again', 'error');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to edit your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#009F9C]" />
              Profile Picture
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#009F9C]/20">
                  {formData.profilePicture ? (
                    <img 
                      src={formData.profilePicture.startsWith('http') ? formData.profilePicture : `http://localhost:3001${formData.profilePicture}`}
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#009F9C] to-[#007A77] flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                {imageUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#009F9C] text-white rounded-lg hover:bg-[#007A77] transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  Upload New Photo
                </button>
                <p className="text-sm text-gray-500">
                  JPG, PNG or GIF. Max size: 5MB
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </motion.div>

          {/* Basic Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#009F9C]" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009F9C] focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009F9C] focus:border-transparent transition-colors"
                  placeholder="Enter your WhatsApp number"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#009F9C]" />
              Privacy Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Show Sold Items</h3>
                  <p className="text-sm text-gray-500">Other users can see items you've sold</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacySettings(prev => ({ ...prev, showSoldItems: !prev.showSoldItems }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.showSoldItems ? 'bg-[#009F9C]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.showSoldItems ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Show Purchases</h3>
                  <p className="text-sm text-gray-500">Other users can see items you've bought</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacySettings(prev => ({ ...prev, showPurchases: !prev.showPurchases }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.showPurchases ? 'bg-[#009F9C]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.showPurchases ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Save Profile Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-lg hover:from-[#007A77] hover:to-[#006B68] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </motion.div>
        </form>

        {/* Change Password Section - Separate from main form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#009F9C]" />
            Change Password
          </h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009F9C] focus:border-transparent transition-colors"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009F9C] focus:border-transparent transition-colors"
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009F9C] focus:border-transparent transition-colors"
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <ul className="list-disc list-inside space-y-1">
                <li>Password must be at least 8 characters long</li>
                <li>Include at least one uppercase letter, one lowercase letter, and one number</li>
              </ul>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-lg hover:from-[#007A77] hover:to-[#006B68] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                {changingPassword ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Edit Profile</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Picture</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
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
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {imageUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Camera Icon Overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="absolute -bottom-1 -right-1 w-10 h-10 bg-[#009F9C] hover:bg-[#007A77] text-white rounded-full flex items-center justify-center transition-colors shadow-lg disabled:opacity-50"
                title="Upload photo"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Click the camera icon to upload a new profile picture
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG or WebP. Max size: 5MB
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
        </div>

        {/* Basic Information */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your WhatsApp number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">Show Sold Items</h3>
                  <p className="text-sm text-gray-500">Other users can see items you've sold</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacySettings(prev => ({ ...prev, showSoldItems: !prev.showSoldItems }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.showSoldItems ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.showSoldItems ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Show Purchases</h3>
                  <p className="text-sm text-gray-500">Other users can see items you've bought</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacySettings(prev => ({ ...prev, showPurchases: !prev.showPurchases }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.showPurchases ? 'bg-blue-500' : 'bg-gray-200'
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
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#009F9C] text-white rounded-xl hover:bg-[#007A77] transition-colors disabled:opacity-50 font-medium"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Change Password Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
          
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
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
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
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="flex items-center gap-2 px-6 py-3 bg-[#009F9C] text-white rounded-xl hover:bg-[#007A77] transition-colors disabled:opacity-50 font-medium"
              >
                <Lock className="w-4 h-4" />
                {changingPassword ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
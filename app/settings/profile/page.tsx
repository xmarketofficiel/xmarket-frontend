'use client';

import { getSafeImageUrl } from '../../../utils/imageUtils';
import { useState, useRef } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, Camera, Upload, Eye, EyeOff } from 'lucide-react';
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
    profilePicture: (user?.profileImageUrl && user?.profileImageUrl !== 'undefined') ? user?.profileImageUrl : 
                   (user?.profilePicture && user?.profilePicture !== 'undefined') ? user?.profilePicture : '',
  });

  const [privacySettings, setPrivacySettings] = useState({
    showSoldItems: user?.privacy?.showSoldItems ?? user?.showSoldItems ?? true,
    showPurchases: user?.privacy?.showPurchases ?? user?.showPurchases ?? true,
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Starting image upload:', file.name, file.size, file.type);

    // Enhanced validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      addToast('Please select a valid image file (JPG, PNG, or WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      addToast('Image size must be less than 5MB', 'error');
      return;
    }

    if (file.size < 1024) { // 1KB minimum
      addToast('Image file seems too small. Please select a valid image.', 'error');
      return;
    }

    // Check if file is actually an image by trying to create an image object
    const img = new Image();
    const imageLoadPromise = new Promise((resolve, reject) => {
      img.onload = () => {
        if (img.width < 50 || img.height < 50) {
          reject(new Error('Image dimensions too small (minimum 50x50 pixels)'));
        } else {
          resolve(true);
        }
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = URL.createObjectURL(file);
    });

    try {
      await imageLoadPromise;
      URL.revokeObjectURL(img.src); // Clean up
    } catch (validationError: any) {
      addToast(validationError.message || 'Invalid image file', 'error');
      return;
    }

    setImageUploading(true);
    
    try {
      console.log('Calling uploadAvatar API...');
      // Use the uploadAvatar API which handles image upload correctly
      const response = await api.users.uploadAvatar(file);
      console.log('Upload response:', response);
      
      if (response.data) {
        console.log('Upload successful, refreshing user...');
        // Refresh user context to get updated profile image
        await refreshUser();
        
        // Update local form state with the new image URL
        const newImageUrl = response.data.profileImageUrl;
        console.log('New image URL:', newImageUrl);
        if (newImageUrl && newImageUrl !== 'undefined') {
          setFormData(prev => ({ ...prev, profilePicture: newImageUrl }));
        }
        
        addToast('Profile image updated successfully', 'success');
      } else {
        console.error('No response data received');
        addToast('Image uploaded but no response data received', 'error');
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      
      // Provide specific error messages based on the error
      if (error.message?.includes('corrupted')) {
        addToast('The image file appears to be corrupted. Please try a different image.', 'error');
      } else if (error.message?.includes('format')) {
        addToast('Unsupported image format. Please use JPG, PNG, or WebP.', 'error');
      } else if (error.message?.includes('too large') || error.message?.includes('size')) {
        addToast('Image file is too large. Please use an image under 5MB.', 'error');
      } else if (error.message?.includes('too small')) {
        addToast('Image is too small. Please use an image at least 100x100 pixels.', 'error');
      } else if (error.message?.includes('Empty file') || error.message?.includes('No file provided')) {
        addToast('Invalid file. Please select a valid image file.', 'error');
      } else {
        addToast(error.message || 'Failed to upload image. Please try again', 'error');
      }
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Don't send profilePicture in updateProfile - it's handled separately by uploadAvatar
      const updateData = {
        fullName: formData.fullName,
        whatsappNumber: formData.whatsappNumber,
        privacy: privacySettings,
      };
      
      const response = await api.users.updateProfile(updateData);
      
      // Check if update was successful
      if (response.data) {
        await refreshUser();
        addToast('Profile updated successfully', 'success');
        router.push('/profile');
      } else {
        addToast('Profile update completed but response was empty', 'info');
      }
    } catch (error: any) {
      // Handle different types of errors
      if (error.name === 'ValidationError' || error.status === 400) {
        addToast(error.message || 'Please check your input and try again', 'error');
      } else if (error.name === 'AuthenticationError' || error.status === 401) {
        addToast('Session expired. Please log in again', 'error');
      } else {
        addToast('Failed to update profile. Please try again', 'error');
      }
    } finally {
      setLoading(false);
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
                  {formData.profilePicture && formData.profilePicture.trim() && formData.profilePicture !== 'undefined' ? (
                    <img 
                      src={formData.profilePicture.startsWith('http') ? formData.profilePicture : `http://localhost:3001${formData.profilePicture}`}
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Image failed to load:', formData.profilePicture);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-[#009F9C] to-[#007A77] flex items-center justify-center ${(formData.profilePicture && formData.profilePicture.trim() && formData.profilePicture !== 'undefined') ? 'hidden' : ''}`}>
                    <User className="w-10 h-10 text-white" />
                  </div>
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

          {/* Save Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
      </div>
    </div>
  );
}
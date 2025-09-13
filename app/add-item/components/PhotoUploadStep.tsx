'use client';

import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ADD_ITEM_CONFIG, VALIDATION_MESSAGES } from '../constants';
import { PhotoUploadStepProps } from '../types';
import Image from 'next/image';

export default function PhotoUploadStep({
  photos,
  onPhotosChange,
  error,
  onNext,
  onCancel,
  className = ''
}: PhotoUploadStepProps) {

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file count
    if (photos.length + files.length > ADD_ITEM_CONFIG.MAX_IMAGES) {
      return;
    }

    // Validate file size and format
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= ADD_ITEM_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024;
      const isValidFormat = ADD_ITEM_CONFIG.SUPPORTED_FORMATS.includes(file.type);
      return isValidSize && isValidFormat;
    });

    onPhotosChange([...photos, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const reorderPhotos = (dragIndex: number, hoverIndex: number) => {
    const newPhotos = [...photos];
    const draggedPhoto = newPhotos[dragIndex];
    newPhotos.splice(dragIndex, 1);
    newPhotos.splice(hoverIndex, 0, draggedPhoto);
    onPhotosChange(newPhotos);
  };

  const canProceed = photos.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`space-y-6 ${className}`}
    >
      {/* Upload Area */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos {photos.length === 0 && <span className="text-red-500">*</span>}
          </label>
          
          {/* Drag & Drop Zone */}
          <motion.div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES
                ? 'border-gray-200 bg-gray-50'
                : 'border-gray-300 hover:border-[#006666] hover:bg-[#006666]/5'
            }`}
            whileHover={photos.length < ADD_ITEM_CONFIG.MAX_IMAGES ? { scale: 1.01 } : {}}
          >
            <input
              type="file"
              multiple
              accept={ADD_ITEM_CONFIG.SUPPORTED_FORMATS.join(',')}
              onChange={handleFileUpload}
              disabled={photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Upload photos"
            />
            
            <div className="space-y-3">
              <motion.div
                className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                  photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES
                    ? 'bg-gray-200'
                    : 'bg-[#006666]/10'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Upload 
                  size={24} 
                  className={photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES ? 'text-gray-400' : 'text-[#006666]'} 
                />
              </motion.div>
              
              <div>
                <p className={`text-sm font-medium ${
                  photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES ? 'text-gray-400' : 'text-gray-900'
                }`}>
                  {photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES 
                    ? 'Maximum photos reached' 
                    : 'Click to upload or drag and drop'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Up to {ADD_ITEM_CONFIG.MAX_IMAGES} photos • Max {ADD_ITEM_CONFIG.MAX_FILE_SIZE_MB}MB each
                  <br />
                  {ADD_ITEM_CONFIG.SUPPORTED_FORMATS.map(format => format.replace('image/', '')).join(', ').toUpperCase()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Photo Preview Grid */}
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            {photos.map((photo, index) => {
              // Safety check: ensure photo is a valid File object
              if (!photo || !(photo instanceof File)) {
                console.warn(`Invalid photo at index ${index}:`, photo);
                return null;
              }
              
              return (
                <motion.div
                  key={`${photo.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                
                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-[#006666] text-white px-2 py-1 rounded text-xs font-medium">
                    Primary
                  </div>
                )}
                
                {/* Remove Button */}
                <motion.button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Remove photo ${index + 1}`}
                >
                  <X size={14} />
                </motion.button>
                
                {/* Photo Number */}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {index + 1}
                </div>
              </motion.div>
              );
            })}
          </motion.div>
        )}        {/* Help Text */}
        <div className="text-sm space-y-2">
          <p className="text-gray-600">
            📸 <strong>Photo Tips:</strong>
          </p>
          <ul className="text-xs text-gray-500 space-y-1 ml-4">
            <li>• Use good lighting and clear focus</li>
            <li>• Show the item from multiple angles</li>
            <li>• Include any defects or wear</li>
            <li>• First photo will be the main display image</li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
            role="alert"
            aria-live="polite"
          >
            {error}
          </motion.p>
        )}

        {/* Photo Count */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {photos.length} of {ADD_ITEM_CONFIG.MAX_IMAGES} photos uploaded
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-4 rounded-xl font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        
        <motion.button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            canProceed
              ? 'bg-[#006666] text-white hover:bg-[#005555] shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={canProceed ? { scale: 1.02 } : {}}
          whileTap={canProceed ? { scale: 0.98 } : {}}
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
}

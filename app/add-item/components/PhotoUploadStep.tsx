'use client';

import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Camera, Sparkles } from 'lucide-react';
import { ADD_ITEM_CONFIG, VALIDATION_MESSAGES } from '../constants';
import { PhotoUploadStepProps } from '../types';
import Image from 'next/image';
import { useState, useCallback } from 'react';

export default function PhotoUploadStep({
  photos,
  onPhotosChange,
  error,
  onNext,
  onCancel,
  className = ''
}: PhotoUploadStepProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    // Validate file count
    if (photos.length + files.length > ADD_ITEM_CONFIG.MAX_IMAGES) {
      return;
    }

    // Validate file size and format with better error reporting
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= ADD_ITEM_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024;
      const isValidFormat = ADD_ITEM_CONFIG.SUPPORTED_FORMATS.includes(file.type);
      return isValidSize && isValidFormat;
    });

    if (validFiles.length > 0) {
      onPhotosChange([...photos, ...validFiles]);
      setShowPreview(true);
    }
  };

  // Enhanced drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(dragCounter + 1);
    if (!isDragActive) {
      setIsDragActive(true);
    }
  }, [dragCounter, isDragActive]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newCounter = dragCounter - 1;
    setDragCounter(newCounter);
    if (newCounter === 0) {
      setIsDragActive(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setDragCounter(0);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [photos, onPhotosChange]);

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
          
          {/* Enhanced Drag & Drop Zone */}
          <motion.div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES
                ? 'border-gray-200 bg-gray-50'
                : isDragActive
                ? 'border-[#006666] bg-[#006666]/10 scale-105 shadow-lg'
                : 'border-gray-300 hover:border-[#006666] hover:bg-[#006666]/5'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            whileHover={photos.length < ADD_ITEM_CONFIG.MAX_IMAGES ? { scale: 1.02 } : {}}
            animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
          >
            {/* Animated Background */}
            {isDragActive && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#006666]/20 to-blue-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}

            <input
              type="file"
              multiple
              accept={ADD_ITEM_CONFIG.SUPPORTED_FORMATS.join(',')}
              onChange={handleFileUpload}
              disabled={photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              aria-label="Upload photos"
            />
            
            <div className="space-y-4 relative z-0">
              <motion.div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                  photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES
                    ? 'bg-gray-200'
                    : isDragActive 
                    ? 'bg-[#006666] text-white shadow-lg'
                    : 'bg-[#006666]/10'
                }`}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  rotate: isDragActive ? 360 : 0 
                }}
                transition={{ 
                  delay: 0.2,
                  rotate: { duration: 1, ease: "easeInOut" }
                }}
              >
                {isDragActive ? (
                  <Sparkles size={28} className="text-white" />
                ) : (
                  <Upload 
                    size={28} 
                    className={photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES ? 'text-gray-400' : 'text-[#006666]'} 
                  />
                )}
              </motion.div>
              
              <div>
                <motion.p 
                  className={`text-lg font-semibold ${
                    photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES ? 'text-gray-400' : 
                    isDragActive ? 'text-[#006666]' : 'text-gray-900'
                  }`}
                  animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                >
                  {photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES 
                    ? 'Maximum photos reached' 
                    : isDragActive
                    ? 'Drop your photos here!'
                    : 'Add stunning photos'
                  }
                </motion.p>
                <p className="text-sm text-gray-500 mt-2">
                  {!isDragActive && (
                    <>
                      <span className="flex items-center justify-center gap-2 mb-1">
                        <Camera size={16} />
                        Drag & drop or click to browse
                      </span>
                    </>
                  )}
                  Up to {ADD_ITEM_CONFIG.MAX_IMAGES} photos • Max {ADD_ITEM_CONFIG.MAX_FILE_SIZE_MB}MB each
                  <br />
                  <span className="text-xs">
                    {ADD_ITEM_CONFIG.SUPPORTED_FORMATS.map(format => format.replace('image/', '')).join(', ').toUpperCase()}
                  </span>
                </p>
              </div>

              {/* Progress indicator for drag state */}
              {isDragActive && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="h-1 bg-[#006666] rounded-full mx-8"
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Photo Preview Grid */}
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Grid */}
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, index) => {
                // Safety check: ensure photo is a valid File object
                if (!photo || !(photo instanceof File)) {
                  return null;
                }
                
                return (
                  <motion.div
                    key={`${photo.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    layoutId={`photo-${index}`}
                  >
                    <Image
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                    {/* Primary Badge */}
                    {index === 0 && (
                      <motion.div 
                        className="absolute top-2 left-2 bg-[#006666] text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-md"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                      >
                        <span className="flex items-center gap-1">
                          <Sparkles size={12} />
                          Cover Photo
                        </span>
                      </motion.div>
                    )}
                    
                    {/* Remove Button */}
                    <motion.button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Remove photo ${index + 1}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <X size={14} />
                    </motion.button>
                    
                    {/* File Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-white text-xs">
                        <div className="font-medium truncate">{photo.name}</div>
                        <div className="text-gray-300">
                          {(photo.size / 1024 / 1024).toFixed(1)} MB
                        </div>
                      </div>
                    </div>
                    
                    {/* Photo Number */}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      {index + 1}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Smart Preview Toggle */}
            {photos.length > 2 && (
              <motion.button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full py-2 text-sm text-[#006666] hover:text-[#005555] font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ImageIcon size={16} />
                {showPreview ? 'Hide Preview' : 'Show Full Preview'}
              </motion.button>
            )}
          </motion.div>
        )}        {/* Enhanced Help Text */}
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-sm space-y-3">
            <p className="text-gray-700 font-medium flex items-center gap-2">
              <Camera className="text-[#006666]" size={18} />
              <span>Photography Tips for Better Sales</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Use natural lighting when possible</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Show item from multiple angles</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Include close-ups of important details</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Clean the item before photographing</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Show any defects honestly</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Use a plain, uncluttered background</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic border-t border-gray-200 pt-2">
              💡 Pro tip: The first photo will be your main display image and appears in search results
            </p>
          </div>
        </motion.div>

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

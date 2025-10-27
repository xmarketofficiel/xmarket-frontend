'use client';

import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Camera, Sparkles, Lightbulb, Loader2 } from 'lucide-react';
import { ADD_ITEM_CONFIG, VALIDATION_MESSAGES } from '../constants';
import { PhotoUploadStepProps } from '../types';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { compressImages, formatFileSize } from '../../../lib/imageCompression';

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
  const [uploadError, setUploadError] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    setUploadError(''); // Clear previous errors
    
    // Validate file count
    if (photos.length + files.length > ADD_ITEM_CONFIG.MAX_IMAGES) {
      setUploadError(`You can only upload up to ${ADD_ITEM_CONFIG.MAX_IMAGES} photos`);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      // Check file size (7MB limit for original file)
      if (file.size > ADD_ITEM_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        errors.push(`"${file.name}" is too large (${sizeMB}MB). Maximum size is ${ADD_ITEM_CONFIG.MAX_FILE_SIZE_MB}MB`);
        return;
      }

      // Check file format
      if (!ADD_ITEM_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
        errors.push(`"${file.name}" is not a supported format`);
        return;
      }

      validFiles.push(file);
    });

    // Show first error if any
    if (errors.length > 0) {
      setUploadError(errors[0]);
      return;
    }

    // Compress valid files before adding
    if (validFiles.length > 0) {
      try {
        setIsCompressing(true);
        setCompressionProgress({ current: 0, total: validFiles.length });

        // Compress all images (target 800KB per image to stay well under 6MB total)
        const compressionResults = await compressImages(
          validFiles,
          {
            maxSizeMB: 0.8,        // 800KB per image
            maxWidthOrHeight: 1920, // Good quality for web
            quality: 0.85          // High quality
          },
          (current, total) => {
            setCompressionProgress({ current, total });
          }
        );

        // Extract compressed files
        const compressedFiles = compressionResults.map(r => r.file);
        
        // Calculate total size
        const totalSize = compressedFiles.reduce((sum, f) => sum + f.size, 0);
        const totalSizeMB = totalSize / 1024 / 1024;
        
        console.log(`✅ Images compressed: ${formatFileSize(totalSize)} total`);
        
        // Warn if total size is still large (shouldn't happen with our settings)
        if (totalSizeMB > 5) {
          setUploadError(`⚠️ Total size is ${totalSizeMB.toFixed(2)}MB. Consider using fewer or smaller images.`);
        }

        // Add compressed files
        onPhotosChange([...photos, ...compressedFiles]);
        setShowPreview(true);
      } catch (error) {
        console.error('Compression error:', error);
        setUploadError('Failed to compress images. Please try again.');
      } finally {
        setIsCompressing(false);
        setCompressionProgress({ current: 0, total: 0 });
      }
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

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    setDragCounter(0);

    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  }, [processFiles]);

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
    setUploadError(''); // Clear error when removing photo
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
        {/* Upload Error Message */}
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3"
          >
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
              <p className="text-sm text-red-600 mt-1">{uploadError}</p>
            </div>
            <button
              onClick={() => setUploadError('')}
              className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos {photos.length === 0 && <span className="text-red-500">*</span>}
          </label>
          
          {/* Modern Upload Zone - Smaller and mobile-friendly */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 md:p-6 text-center transition-all duration-300 ${
              photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES || isCompressing
                ? 'border-gray-200 bg-gray-50'
                : isDragActive
                ? 'border-[#009F9C] bg-[#009F9C]/10'
                : 'border-gray-300 hover:border-[#009F9C] hover:bg-[#009F9C]/5'
            }`}
            onDragEnter={window.innerWidth >= 768 && !isCompressing ? handleDragEnter : undefined}
            onDragLeave={window.innerWidth >= 768 && !isCompressing ? handleDragLeave : undefined}
            onDragOver={window.innerWidth >= 768 && !isCompressing ? handleDragOver : undefined}
            onDrop={window.innerWidth >= 768 && !isCompressing ? handleDrop : undefined}
          >
            {/* Animated Background */}
            {isDragActive && !isCompressing && (
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
              disabled={photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES || isCompressing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              aria-label="Upload photos"
            />
            
            <div className="space-y-4 relative z-0">
              <div
                className={`mx-auto w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center ${
                  photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES || isCompressing
                    ? 'bg-gray-200'
                    : isDragActive 
                    ? 'bg-[#009F9C] text-white shadow-lg'
                    : 'bg-[#009F9C]/10'
                }`}
              >
                {isCompressing ? (
                  <Loader2 size={20} className="text-blue-500 animate-spin" />
                ) : isDragActive ? (
                  <Sparkles size={20} className="text-white" />
                ) : (
                  <Upload 
                    size={20} 
                    className={photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES ? 'text-gray-400' : 'text-[#009F9C]'} 
                  />
                )}
              </div>
              
              <div>
                <p 
                  className={`text-base md:text-lg font-medium ${
                    photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES || isCompressing ? 'text-gray-400' : 
                    isDragActive ? 'text-[#009F9C]' : 'text-gray-900'
                  }`}
                >
                  {isCompressing
                    ? 'Compressing images...'
                    : photos.length >= ADD_ITEM_CONFIG.MAX_IMAGES 
                    ? 'Maximum photos reached' 
                    : isDragActive
                    ? 'Drop your photos here!'
                    : 'Add photos'
                  }
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {isCompressing ? (
                    <span className="text-blue-600 font-medium">
                      {compressionProgress.current} of {compressionProgress.total} processed
                    </span>
                  ) : !isDragActive ? (
                    <>
                      <span className="flex items-center justify-center gap-1 mb-1">
                        <Camera size={14} />
                        <span className="hidden md:inline">Drag & drop or </span>Tap to browse
                      </span>
                      Up to {ADD_ITEM_CONFIG.MAX_IMAGES} photos • Max {ADD_ITEM_CONFIG.MAX_FILE_SIZE_MB}MB each
                      <br />
                      <span className="text-xs">
                        {ADD_ITEM_CONFIG.SUPPORTED_FORMATS.map(format => format.replace('image/', '')).join(', ').toUpperCase()}
                      </span>
                      <br />
                      <span className="text-green-600 font-medium">✨ Auto-compressed for faster upload</span>
                    </>
                  ) : (
                    <span>Drop to add to your listing</span>
                  )}
                </p>
              </div>

              {/* Progress indicator for drag or compression state */}
              {(isDragActive || isCompressing) && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isCompressing ? `${(compressionProgress.current / compressionProgress.total) * 100}%` : "100%" }}
                  className={`h-1 rounded-full mx-8 ${
                    isCompressing ? 'bg-blue-500' : 'bg-[#006666]'
                  }`}
                />
              )}
            </div>
          </div>
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
        )}
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

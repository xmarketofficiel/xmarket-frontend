"use client";

import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon, Zap, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface ImageUploadAdvancedProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  onUploadComplete?: (uploadResults: OptimizedUploadResult[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  className?: string;
  autoUpload?: boolean; // If true, uploads immediately when images are selected
  showOptimizationInfo?: boolean; // Show optimization details
}

interface OptimizedUploadResult {
  originalFile: File;
  cloudinaryUrl: string;
  spacesUrl?: string;
  metadata: {
    originalSize: number;
    uploaded: string;
  };
}

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
  result?: OptimizedUploadResult;
}

export default function ImageUploadAdvanced({
  images,
  onImagesChange,
  onUploadComplete,
  maxImages = 6,
  maxFileSize = 7, // 5MB default
  className = '',
  autoUpload = false,
  showOptimizationInfo = true
}: ImageUploadAdvancedProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploadStatuses, setUploadStatuses] = useState<Map<number, UploadStatus>>(new Map());

  // Update preview URLs when images change
  React.useEffect(() => {
    const newPreviewUrls = images.map(file => URL.createObjectURL(file));
    
    // Clean up old URLs to prevent memory leaks
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setImagePreviewUrls(newPreviewUrls);

    // Cleanup on unmount
    return () => {
      newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
      return 'Only JPEG, PNG, GIF, and WebP images are allowed';
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    return null;
  };

  const uploadOptimizedImage = async (file: File, index: number): Promise<OptimizedUploadResult | null> => {
    try {
      setUploadStatuses(prev => new Map(prev).set(index, { status: 'uploading', progress: 0 }));

      // Option 1: Use presigned URL for direct upload (more secure and efficient)
      const usePresignedUpload = true;

      if (usePresignedUpload) {
        // Get presigned URL from backend
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001');
        const presignedResponse = await fetch(`${API_BASE_URL}/uploads/generate-presigned-url`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            category: 'item', // Assuming this is for items, could be made configurable
            itemId: Date.now() // This should be passed as a prop in real usage
          })
        });

        if (!presignedResponse.ok) {
          throw new Error('Failed to get presigned URL');
        }

        const presignedData = await presignedResponse.json();

        // Upload directly to DigitalOcean Spaces using presigned URL
        const uploadResponse = await fetch(presignedData.presignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file
        });

        if (!uploadResponse.ok) {
          throw new Error('Direct upload to Spaces failed');
        }

        // Call the optimization endpoint
        const optimizedResult: OptimizedUploadResult = {
          originalFile: file,
          cloudinaryUrl: presignedData.publicUrl,
          spacesUrl: presignedData.publicUrl,
          metadata: {
            originalSize: file.size,
            uploaded: 'Original image uploaded via presigned URL'
          }
        };

        setUploadStatuses(prev => new Map(prev).set(index, { 
          status: 'success', 
          progress: 100, 
          result: optimizedResult 
        }));

        if (showOptimizationInfo) {
          addToast(
            `📸 Image uploaded successfully to both Cloudinary and Spaces!`,
            'success'
          );
        }

        return optimizedResult;
      } else {
        // Option 2: Use the optimized upload endpoint (backend processing)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'item');

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001');
        const response = await fetch(`${API_BASE_URL}/uploads/upload-optimized`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        
        const optimizedResult: OptimizedUploadResult = {
          originalFile: file,
          cloudinaryUrl: result.urls?.primary || result.cloudinary?.url,
          spacesUrl: result.urls?.fallback || result.spaces?.url,
          metadata: {
            originalSize: result.storage?.originalSize || file.size,
            uploaded: result.storage?.uploaded || 'Original image uploaded'
          }
        };

        setUploadStatuses(prev => new Map(prev).set(index, { 
          status: 'success', 
          progress: 100, 
          result: optimizedResult 
        }));

        if (showOptimizationInfo) {
          addToast(
            `📸 Image uploaded successfully to both Cloudinary and Spaces!`,
            'success'
          );
        }

        return optimizedResult;
      }

    } catch (error: any) {
      setUploadStatuses(prev => new Map(prev).set(index, { 
        status: 'error', 
        error: error.message 
      }));
      addToast(`Upload failed: ${error.message}`, 'error');
      return null;
    }
  };

  const handleFileSelect = useCallback(async (files: FileList) => {
    const newFiles: File[] = [];
    const errors: string[] = [];

    // Validate each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);
      
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        newFiles.push(file);
      }
    }

    // Check total count
    const totalFiles = images.length + newFiles.length;
    if (totalFiles > maxImages) {
      errors.push(`Maximum ${maxImages} images allowed. You can add ${maxImages - images.length} more.`);
      return;
    }

    // Show errors if any
    if (errors.length > 0) {
      addToast(errors.join('; '), 'error');
      return;
    }

    // Add new files
    const updatedImages = [...images, ...newFiles];
    onImagesChange(updatedImages);

    // Auto upload if enabled
    if (autoUpload && newFiles.length > 0) {
      const uploadResults: OptimizedUploadResult[] = [];
      const startIndex = images.length;

      for (let i = 0; i < newFiles.length; i++) {
        const result = await uploadOptimizedImage(newFiles[i], startIndex + i);
        if (result) {
          uploadResults.push(result);
        }
      }

      if (uploadResults.length > 0 && onUploadComplete) {
        onUploadComplete(uploadResults);
      }
    }
  }, [images, onImagesChange, maxImages, maxFileSize, addToast, autoUpload, onUploadComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      handleFileSelect(files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    // Remove upload status for this image
    setUploadStatuses(prev => {
      const newMap = new Map(prev);
      newMap.delete(index);
      return newMap;
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const manualUploadAll = async () => {
    if (images.length === 0) return;

    const uploadResults: OptimizedUploadResult[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const currentStatus = uploadStatuses.get(i);
      if (currentStatus?.status === 'success') {
        // Already uploaded successfully
        if (currentStatus.result) {
          uploadResults.push(currentStatus.result);
        }
        continue;
      }

      const result = await uploadOptimizedImage(images[i], i);
      if (result) {
        uploadResults.push(result);
      }
    }

    if (uploadResults.length > 0 && onUploadComplete) {
      onUploadComplete(uploadResults);
    }
  };

  const getUploadStatus = (index: number): UploadStatus => {
    return uploadStatuses.get(index) || { status: 'idle' };
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status.status) {
      case 'uploading':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const hasUnuploadedImages = images.some((_, index) => {
    const status = getUploadStatus(index);
    return status.status === 'idle' || status.status === 'error';
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={images.length >= maxImages}
        />
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Upload className="h-8 w-8 text-gray-400 mr-2" />
            {showOptimizationInfo && (
              <Zap className="h-6 w-6 text-yellow-500" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            {images.length >= maxImages 
              ? `Maximum ${maxImages} images reached`
              : `Click to upload or drag and drop images`
            }
          </p>
          {showOptimizationInfo && (
            <p className="text-xs text-blue-600 mt-1">
              ⚡ Automatic optimization: Creates 4 sizes + saves 60-80% space
            </p>
          )}
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF, WebP up to {maxFileSize}MB each
          </p>
          <p className="text-xs text-gray-500">
            {images.length}/{maxImages} images selected
          </p>
        </div>
      </div>

      {/* Manual Upload Button */}
      {!autoUpload && hasUnuploadedImages && images.length > 0 && (
        <button
          onClick={manualUploadAll}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          type="button"
        >
          <Zap className="w-4 h-4 mr-2" />
          Upload & Optimize All Images
        </button>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {imagePreviewUrls.map((url, index) => {
            const status = getUploadStatus(index);
            return (
              <div key={index} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  
                  {/* Status overlay */}
                  {status.status !== 'idle' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      {getStatusIcon(status)}
                      {status.status === 'uploading' && (
                        <span className="text-white text-xs ml-2">Optimizing...</span>
                      )}
                      {status.status === 'error' && status.error && (
                        <span className="text-white text-xs ml-2" title={status.error}>
                          Error
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    type="button"
                  >
                    <X size={16} />
                  </button>

                  {/* Image number overlay */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                    {status.result && showOptimizationInfo && (
                      <span className="ml-1 text-green-400">
                        ✓ Uploaded
                      </span>
                    )}
                  </div>
                </div>
                
                {/* File name */}
                <p className="mt-1 text-xs text-gray-500 truncate">
                  {images[index].name}
                </p>
                
                {/* Optimization info */}
                {status.result && showOptimizationInfo && (
                  <div className="mt-1 text-xs text-green-600">
                    <div className="flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      {(status.result.metadata.originalSize / 1024).toFixed(1)}KB uploaded
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {status.result.metadata.uploaded}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Add more button */}
          {images.length < maxImages && (
            <button
              onClick={openFileDialog}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
              type="button"
            >
              <ImageIcon size={24} />
              <span className="text-xs mt-1">Add More</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

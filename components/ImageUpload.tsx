"use client";

import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { compressImages, formatFileSize } from '../lib/imageCompression';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  className?: string;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 6,
  maxFileSize = 7, // 5MB default (per original file, will be compressed)
  className = ''
}: ImageUploadProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 });

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

  const handleFileSelect = useCallback(async (files: FileList) => {
    const filesToProcess: File[] = [];
    const errors: string[] = [];

    // Validate each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);
      
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        filesToProcess.push(file);
      }
    }

    // Check total count
    const totalFiles = images.length + filesToProcess.length;
    if (totalFiles > maxImages) {
      errors.push(`Maximum ${maxImages} images allowed. You can add ${maxImages - images.length} more.`);
      return;
    }

    // Show errors if any
    if (errors.length > 0) {
      addToast(errors.join('; '), 'error');
      return;
    }

    // Compress images before adding them
    if (filesToProcess.length > 0) {
      try {
        setIsCompressing(true);
        setCompressionProgress({ current: 0, total: filesToProcess.length });
        
        // Compress all images (target 800KB per image to stay well under 6MB total)
        const compressionResults = await compressImages(
          filesToProcess,
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
        
        // Show success message with compression stats
        const avgCompression = compressionResults.reduce((sum, r) => sum + r.compressionRatio, 0) / compressionResults.length;
        addToast(
          `✅ ${compressedFiles.length} image(s) compressed (${formatFileSize(totalSize)} total, ${Math.round((1 - avgCompression) * 100)}% reduction)`,
          'success'
        );
        
        // Warn if total size is still large (shouldn't happen with our settings)
        if (totalSizeMB > 5) {
          addToast(
            `⚠️ Total size is ${totalSizeMB.toFixed(2)}MB. Consider using fewer or smaller images.`,
            'warning'
          );
        }

        // Add compressed files
        onImagesChange([...images, ...compressedFiles]);
      } catch (error) {
        console.error('Compression error:', error);
        addToast('Failed to compress images. Please try again.', 'error');
      } finally {
        setIsCompressing(false);
        setCompressionProgress({ current: 0, total: 0 });
      }
    }
  }, [images, onImagesChange, maxImages, maxFileSize, addToast]);

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
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

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
          ${images.length >= maxImages || isCompressing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={images.length >= maxImages || isCompressing}
        />
        
        <div className="text-center">
          {isCompressing ? (
            <>
              <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
              <p className="mt-2 text-sm text-gray-600 font-medium">
                Compressing images...
              </p>
              <p className="text-xs text-gray-500">
                {compressionProgress.current} of {compressionProgress.total} processed
              </p>
            </>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {images.length >= maxImages 
                  ? `Maximum ${maxImages} images reached`
                  : `Click to upload or drag and drop images`
                }
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP up to {maxFileSize}MB each
              </p>
              <p className="text-xs text-gray-500">
                {images.length}/{maxImages} images selected
              </p>
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✨ Auto-compressed for faster upload
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {imagePreviewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                
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
                </div>
              </div>
              
              {/* File name */}
              <p className="mt-1 text-xs text-gray-500 truncate">
                {images[index].name}
              </p>
            </div>
          ))}
          
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

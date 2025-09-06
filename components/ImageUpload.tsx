"use client";

import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

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
  maxFileSize = 5, // 5MB default
  className = ''
}: ImageUploadProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

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

  const handleFileSelect = useCallback((files: FileList) => {
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
    onImagesChange([...images, ...newFiles]);
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

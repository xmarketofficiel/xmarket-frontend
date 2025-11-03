"use client";

import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon, Zap, Clock, CheckCircle, Folder, Shield } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { api } from '../lib/apiEndpoints';

interface PresignedImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  onUploadComplete?: (uploadResults: PresignedUploadResult[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  className?: string;
  autoUpload?: boolean;
  showOptimizationInfo?: boolean;
  category?: 'avatar' | 'item' | 'service';
  itemId?: number;
}

interface PresignedUploadResult {
  originalFile: File;
  publicUrl: string;
  key: string;
  folder: string;
  metadata: {
    originalSize: number;
    uploadedSize: number;
    folder: string;
    isSecure: boolean;
  };
}

interface UploadStatus {
  status: 'idle' | 'generating-url' | 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
  result?: PresignedUploadResult;
}

export default function PresignedImageUpload({
  images,
  onImagesChange,
  onUploadComplete,
  maxImages = 6,
  maxFileSize = 7,
  className = '',
  autoUpload = false,
  showOptimizationInfo = true,
  category = 'item',
  itemId
}: PresignedImageUploadProps) {
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

  const uploadWithPresignedUrl = async (file: File, index: number): Promise<PresignedUploadResult | null> => {
    try {
      // Step 1: Generate presigned URL
      setUploadStatuses(prev => new Map(prev).set(index, { status: 'generating-url', progress: 10 }));

      const presignedResponse = await api.items.generatePresignedUrl(
        file.name,
        file.type,
        category,
        itemId
      );

      const presignedData = presignedResponse.data;

      // Step 2: Upload directly to DigitalOcean Spaces
      setUploadStatuses(prev => new Map(prev).set(index, { status: 'uploading', progress: 50 }));

      const uploadResponse = await api.items.uploadToPresignedUrl(
        presignedData.presignedUrl,
        file,
        file.type
      );

      if (!uploadResponse.ok) {
        throw new Error(`Direct upload failed: ${uploadResponse.statusText}`);
      }

      // Step 3: Create result
      const uploadResult: PresignedUploadResult = {
        originalFile: file,
        publicUrl: presignedData.publicUrl,
        key: presignedData.key,
        folder: presignedData.organization.folder,
        metadata: {
          originalSize: file.size,
          uploadedSize: file.size,
          folder: presignedData.organization.folder,
          isSecure: true
        }
      };

      setUploadStatuses(prev => new Map(prev).set(index, { 
        status: 'success', 
        progress: 100, 
        result: uploadResult 
      }));

      if (showOptimizationInfo) {
        addToast(
          `📁 Image uploaded to organized folder: /${presignedData.organization.folder}`,
          'success'
        );
      }

      return uploadResult;

    } catch (error: any) {
      setUploadStatuses(prev => new Map(prev).set(index, { 
        status: 'error', 
        error: error.message 
      }));
      addToast(`Upload failed: ${error.message}`, 'error');
      return null;
    }
  };

  const uploadBatchWithPresignedUrls = async (): Promise<PresignedUploadResult[]> => {
    if (images.length === 0) return [];

    try {
      setUploadStatuses(prev => {
        const newMap = new Map(prev);
        images.forEach((_, index) => {
          newMap.set(index, { status: 'generating-url', progress: 10 });
        });
        return newMap;
      });

      // Generate batch presigned URLs
      const batchResponse = await api.items.generateBatchPresignedUrls(
        images.map(img => img.name),
        'image/jpeg',
        itemId || Date.now()
      );

      const batchData = batchResponse.data;
      const uploadResults: PresignedUploadResult[] = [];

      // Upload each file
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const urlData = batchData.urls[i];

        if (!urlData) continue;

        setUploadStatuses(prev => new Map(prev).set(i, { status: 'uploading', progress: 50 }));

        try {
          const uploadResponse = await api.items.uploadToPresignedUrl(
            urlData.presignedUrl,
            file,
            file.type
          );

          if (uploadResponse.ok) {
            const result: PresignedUploadResult = {
              originalFile: file,
              publicUrl: urlData.publicUrl,
              key: urlData.key,
              folder: batchData.organization.folder,
              metadata: {
                originalSize: file.size,
                uploadedSize: file.size,
                folder: batchData.organization.folder,
                isSecure: true
              }
            };

            uploadResults.push(result);
            setUploadStatuses(prev => new Map(prev).set(i, { 
              status: 'success', 
              progress: 100, 
              result 
            }));
          } else {
            throw new Error(`Upload failed for ${file.name}`);
          }
        } catch (error: any) {
          setUploadStatuses(prev => new Map(prev).set(i, { 
            status: 'error', 
            error: error.message 
          }));
        }
      }

      if (uploadResults.length > 0) {
        addToast(
          `📁 ${uploadResults.length} images uploaded to /${batchData.organization.folder} folder`,
          'success'
        );
      }

      return uploadResults;

    } catch (error: any) {
      addToast(`Batch upload failed: ${error.message}`, 'error');
      return [];
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
      const uploadResults: PresignedUploadResult[] = [];
      const startIndex = images.length;

      for (let i = 0; i < newFiles.length; i++) {
        const result = await uploadWithPresignedUrl(newFiles[i], startIndex + i);
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
    
    setUploadStatuses(prev => {
      const newMap = new Map(prev);
      newMap.delete(index);
      return newMap;
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const manualBatchUpload = async () => {
    if (images.length === 0) return;

    const results = await uploadBatchWithPresignedUrls();
    if (results.length > 0 && onUploadComplete) {
      onUploadComplete(results);
    }
  };

  const getUploadStatus = (index: number): UploadStatus => {
    return uploadStatuses.get(index) || { status: 'idle' };
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status.status) {
      case 'generating-url':
        return <Shield className="w-4 h-4 text-blue-500 animate-pulse" />;
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

  const getFolderName = () => {
    return category === 'avatar' ? 'profile' : 'items';
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
          <div className="flex items-center justify-center mb-2">
            <Upload className="h-8 w-8 text-gray-400 mr-2" />
            <Folder className="h-6 w-6 text-blue-500" />
            <Shield className="h-5 w-5 text-green-500 ml-1" />
          </div>
          <p className="text-sm text-gray-600">
            {images.length >= maxImages 
              ? `Maximum ${maxImages} images reached`
              : `Click to upload or drag and drop images`
            }
          </p>
          {showOptimizationInfo && (
            <p className="text-xs text-blue-600 mt-1">
              🔒 Secure presigned uploads to organized /{getFolderName()} folder
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
          onClick={manualBatchUpload}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          type="button"
        >
          <Shield className="w-4 h-4 mr-2" />
          Upload All to /{getFolderName()} Folder
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
                      {status.status === 'generating-url' && (
                        <span className="text-white text-xs ml-2">Securing...</span>
                      )}
                      {status.status === 'uploading' && (
                        <span className="text-white text-xs ml-2">Uploading...</span>
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
                    {status.result && (
                      <span className="ml-1 text-green-400">
                        (/{status.result.folder})
                      </span>
                    )}
                  </div>
                </div>
                
                {/* File name */}
                <p className="mt-1 text-xs text-gray-500 truncate">
                  {images[index].name}
                </p>
                
                {/* Upload info */}
                {status.result && showOptimizationInfo && (
                  <div className="mt-1 text-xs text-green-600">
                    <div className="flex items-center">
                      <Folder className="w-3 h-3 mr-1" />
                      Stored in /{status.result.folder}
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

      {/* Info Box */}
      {showOptimizationInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-xs text-blue-800 font-medium">
                Secure Presigned Upload to /{getFolderName()} Folder
              </p>
              <p className="text-xs text-blue-700 mt-1">
                • Images are uploaded directly to organized DigitalOcean Spaces folders<br />
                • Presigned URLs ensure secure, time-limited access<br />
                • No backend processing required - faster and more efficient
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

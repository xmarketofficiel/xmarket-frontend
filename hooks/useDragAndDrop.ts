'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

export interface DragAndDropOptions {
  maxFiles?: number;
  acceptedTypes?: string[];
  maxFileSize?: number; // in bytes
  onFilesSelected: (files: File[]) => void;
  onError?: (error: string) => void;
}

export const useDragAndDrop = ({
  maxFiles = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  onFilesSelected,
  onError
}: DragAndDropOptions) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    
    for (const file of files) {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        onError?.(`File "${file.name}" is not a supported image format. Supported formats: JPEG, PNG, WebP`);
        continue;
      }
      
      // Check file size
      if (file.size > maxFileSize) {
        onError?.(`File "${file.name}" is too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB`);
        continue;
      }
      
      validFiles.push(file);
      
      // Stop if we've reached max files
      if (validFiles.length >= maxFiles) {
        break;
      }
    }
    
    return validFiles;
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounter.current++;
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      setIsDragOver(false);
      dragCounter.current = 0;
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(files);
      
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = validateFiles(files);
      
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      
      // Clear the input so the same files can be selected again
      e.target.value = '';
    }
  };

  return {
    isDragOver,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
    inputProps: {
      onChange: handleFileInput,
    },
  };
};

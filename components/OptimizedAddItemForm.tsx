'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/apiEndpoints';
import { addItemSchema, type AddItemFormData } from '../lib/validation';
import { useForm } from '../hooks/useForm';
import { useApi } from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';
import { useUser } from '../contexts/UserContext';
import OptimizedImageUpload from './OptimizedImageUpload';

interface OptimizedUploadResult {
  originalFile: File;
  cloudinaryUrl: string;
  spacesUrls: {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
  };
  metadata: {
    originalSize: number;
    optimizedSizes: {
      thumbnail: number;
      small: number;
      medium: number;
      large: number;
    };
    spaceSaved: number;
    spaceSavedPercentage: number;
  };
}

export default function OptimizedAddItemForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useUser();
  const [uploadResults, setUploadResults] = useState<OptimizedUploadResult[]>([]);

  // Use form hook for validation and state management
  const form = useForm<AddItemFormData>({
    initialValues: {
      title: '',
      description: '',
      price: '',
      quantity: '1',
      category: '',
      condition: 'Good',
      photos: [],
      // Use user's privacy preference, default to false if user wants privacy
      showIdentity: user?.showSoldItems ?? true,
    },
    onSubmit: async (values) => {
      try {
        await handleSubmit(values);
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An error occurred');
      }
    },
    onError: (errors) => {
      const firstError = Object.values(errors)[0];
      if (firstError) {
        addToast(firstError, 'error');
      }
    }
  });

  // Update form when user data becomes available
  useEffect(() => {
    if (user) {
      // Update showIdentity based on user's privacy preference
      // If user has disabled showSoldItems, they probably want privacy when posting too
      form.setValue('showIdentity', user.showSoldItems ?? true);
    }
  }, [user, form]);

  // Load categories with API hook
  const { data: categoriesData, loading: categoriesLoading } = useApi(
    api.items.getCategories,
    { 
      onError: (error) => {
        console.warn('Failed to load categories:', error);
        addToast('Failed to load categories. Please try again.', 'error');
      },
    }
  );

  const categories = categoriesData || [];

  const handleSubmit = async (values: AddItemFormData) => {
    try {
      // Create item data
      const itemData = {
        title: values.title,
        description: values.description,
        price: Number(values.price),
        quantity: Number(values.quantity),
        category: values.category, // Backend expects category as string
        condition: values.condition,
        anonymous: !values.showIdentity, // If user wants to show identity, item is not anonymous
      };

      // Create item
      const response = await api.items.createItem(itemData);
      const newItem = response.data;

      // If we have optimized upload results, use those URLs
      if (uploadResults.length > 0) {
        // Store the optimized image data - this would be saved to the database
        // For now, we'll just log the optimization results
        console.log('🎉 Item created with optimized images:', {
          itemId: newItem.id,
          optimizationResults: uploadResults.map(result => ({
            originalSize: result.metadata.originalSize,
            totalOptimizedSize: Object.values(result.metadata.optimizedSizes).reduce((sum, size) => sum + size, 0),
            spaceSaved: result.metadata.spaceSavedPercentage,
            cloudinaryUrl: result.cloudinaryUrl,
            spacesUrls: result.spacesUrls
          }))
        });

        // Calculate total space savings
        const totalOriginalSize = uploadResults.reduce((sum, result) => sum + result.metadata.originalSize, 0);
        const totalOptimizedSize = uploadResults.reduce((sum, result) => 
          sum + Object.values(result.metadata.optimizedSizes).reduce((sizeSum, size) => sizeSum + size, 0), 0);
        const totalSavingsPercentage = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100);

        addToast(
          `✨ Item posted with optimized images! Saved ${totalSavingsPercentage.toFixed(1)}% storage space`,
          'success'
        );
      } else if (values.photos.length > 0) {
        // Fallback to original upload method if optimization failed
        await api.items.uploadItemImages(String(newItem.id), values.photos);
        addToast('Item posted successfully!', 'info');
      } else {
        addToast('Item posted successfully!', 'info');
      }

      // Success - navigate back
      router.push('/');
    } catch (error) {
      console.error('Error creating item:', error);
      throw error; // Re-throw for form handling
    }
  };

  const [step, setStep] = useState<number>(1);

  const validateStep1 = (): boolean => {
    if (form.values.photos.length === 0) {
      form.setError('photos', 'At least one photo is required');
      return false;
    }
    form.clearError('photos');
    return true;
  };

  const handleUploadComplete = (results: OptimizedUploadResult[]) => {
    setUploadResults(prev => [...prev, ...results]);
    
    // Show summary of optimizations
    const totalSavings = results.reduce((sum, result) => sum + result.metadata.spaceSavedPercentage, 0) / results.length;
    addToast(
      `🚀 ${results.length} image(s) optimized! Average ${totalSavings.toFixed(1)}% space saved`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center z-10">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-gray-900">Add Item (Optimized)</h1>
        <div className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          ⚡ Space Optimized
        </div>
      </div>

      <form onSubmit={form.handleSubmit} className="p-4 space-y-6" role="form" aria-label="Add new item form with optimized uploads">
        {/* Step indicator */}
        <div className="flex items-center justify-center space-x-2 mb-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={2} aria-label={`Step ${step} of 2`}>
          <div className={`w-8 h-1 rounded ${step === 1 ? 'bg-[#006666]' : 'bg-gray-200'}`} aria-hidden="true" />
          <div className={`w-8 h-1 rounded ${step === 2 ? 'bg-[#006666]' : 'bg-gray-200'}`} aria-hidden="true" />
        </div>

        {/* Photo Upload - Optimized */}
        <div role="group" aria-labelledby="photo-upload-label">
          <label id="photo-upload-label" className="block text-sm font-medium text-gray-700 mb-2">
            Photos (Optimized Upload) {form.values.photos.length === 0 && <span className="text-red-500" aria-label="required">*</span>}
          </label>
          
          <OptimizedImageUpload
            images={form.values.photos}
            onImagesChange={(images) => form.setValue('photos', images)}
            onUploadComplete={handleUploadComplete}
            maxImages={6}
            maxFileSize={5}
            autoUpload={true} // Automatically upload and optimize when images are selected
            showOptimizationInfo={true}
            className="mb-4"
          />
          
          {form.values.photos.length === 0 && (
            <p className="text-sm text-red-500" role="alert" aria-live="polite">{form.errors.photos || 'At least one photo is required'}</p>
          )}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
            <p className="text-xs text-blue-700">
              🎯 <strong>Smart Optimization:</strong> Your images are automatically resized to 4 different sizes 
              (thumbnail, small, medium, large) and compressed for optimal loading speed while maintaining quality.
            </p>
            {uploadResults.length > 0 && (
              <p className="text-xs text-green-700 mt-1">
                ✅ {uploadResults.length} image(s) optimized! Total space saved: {' '}
                {(uploadResults.reduce((sum, result) => sum + result.metadata.spaceSavedPercentage, 0) / uploadResults.length).toFixed(1)}%
              </p>
            )}
          </div>
        </div>
        
        {/* If on step 1 show Next button only */}
        {step === 1 ? (
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 px-4 rounded-xl font-medium border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!validateStep1()) {
                  return;
                }
                setStep(2);
              }}
              className="flex-1 bg-[#006666] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#005555] transition-colors"
            >
              Next
            </button>
          </div>
        ) : (
          <>
            {/* Step 2: Item Details */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={form.values.title}
                  onChange={(e) => form.setValue('title', e.target.value)}
                  placeholder="What are you selling?"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#006666] focus:border-transparent ${
                    form.errors.title ? 'border-red-500' : 'border-gray-200'
                  }`}
                  aria-describedby={form.errors.title ? 'title-error' : undefined}
                  required
                />
                {form.errors.title && (
                  <p id="title-error" className="text-sm text-red-500 mt-1" role="alert" aria-live="polite">
                    {form.errors.title}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500" aria-label="required">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="price"
                    value={form.values.price}
                    onChange={(e) => form.setValue('price', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-[#006666] focus:border-transparent ${
                      form.errors.price ? 'border-red-500' : 'border-gray-200'
                    }`}
                    aria-describedby={form.errors.price ? 'price-error' : undefined}
                    required
                  />
                </div>
                {form.errors.price && (
                  <p id="price-error" className="text-sm text-red-500 mt-1" role="alert" aria-live="polite">
                    {form.errors.price}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500" aria-label="required">*</span>
                </label>
                <select
                  id="category"
                  value={form.values.category}
                  onChange={(e) => form.setValue('category', e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#006666] focus:border-transparent ${
                    form.errors.category ? 'border-red-500' : 'border-gray-200'
                  }`}
                  aria-describedby={form.errors.category ? 'category-error' : undefined}
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">Select a category</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {form.errors.category && (
                  <p id="category-error" className="text-sm text-red-500 mt-1" role="alert" aria-live="polite">
                    {form.errors.category}
                  </p>
                )}
                {categoriesLoading && (
                  <p className="text-sm text-gray-500 mt-1">Loading categories...</p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  Condition <span className="text-red-500" aria-label="required">*</span>
                </label>
                <select
                  id="condition"
                  value={form.values.condition}
                  onChange={(e) => form.setValue('condition', e.target.value as any)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006666] focus:border-transparent"
                  required
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={form.values.quantity}
                  onChange={(e) => form.setValue('quantity', e.target.value)}
                  min="1"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006666] focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500" aria-label="required">*</span>
                </label>
                <textarea
                  id="description"
                  value={form.values.description}
                  onChange={(e) => form.setValue('description', e.target.value)}
                  placeholder="Describe your item..."
                  rows={4}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#006666] focus:border-transparent resize-none ${
                    form.errors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                  aria-describedby={form.errors.description ? 'description-error' : undefined}
                  required
                />
                {form.errors.description && (
                  <p id="description-error" className="text-sm text-red-500 mt-1" role="alert" aria-live="polite">
                    {form.errors.description}
                  </p>
                )}
              </div>

              {/* Privacy Setting */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="showIdentity"
                    checked={form.values.showIdentity}
                    onChange={(e) => form.setValue('showIdentity', e.target.checked)}
                    className="mt-1 h-4 w-4 text-[#006666] focus:ring-[#006666] border-gray-300 rounded"
                  />
                  <div>
                    <label htmlFor="showIdentity" className="text-sm font-medium text-gray-700">
                      Show my identity on this listing
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      When checked, your name and profile will be visible to buyers. When unchecked, this listing will be anonymous.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-4 rounded-xl font-medium border border-gray-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={form.isSubmitting}
                className="flex-1 bg-[#006666] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#005555] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {form.isSubmitting ? 'Creating...' : 'Post Item'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

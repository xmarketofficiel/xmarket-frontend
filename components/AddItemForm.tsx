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
import ImageUpload from './ImageUpload';

export default function AddItemForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }, [user]); // Remove form from deps to prevent circular dependency

  // Memoized callbacks to prevent infinite re-renders in useApi
  const onCategoriesSuccess = useCallback((data: any) => {
    // Backend now returns category objects: [{id, name, icon, description}, ...]
    const backendCategories = Array.isArray(data) ? data : [];
    // Set first category as default if available
    if (backendCategories.length > 0 && !form.values.category) {
      form.setValue('category', backendCategories[0].name);
    }
  }, []); // Remove form dependency to prevent circular deps

  const onCategoriesError = useCallback((error: Error) => {
    console.error('Failed to load categories:', error);
    // Use fallback categories if API fails
    if (!form.values.category) {
      form.setValue('category', 'Electronics');
    }
  }, []); // Remove form dependency to prevent circular deps

  // Load categories using our API hook
  const { 
    data: categories = [], 
    loading: loadingCategories, 
    error: categoriesError 
  } = useApi(api.items.getCategories, {
    immediate: true,
    onSuccess: onCategoriesSuccess,
    onError: onCategoriesError
  });

  // Create submission handler
  const handleSubmit = async (values: AddItemFormData) => {
    // Prevent double submissions
    if (isSubmitting) {
      console.warn('Form submission already in progress, ignoring duplicate request');
      return;
    }

    try {
      setIsSubmitting(true);
      
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

      // Upload photos if item creation succeeded
      if (values.photos.length > 0) {
        console.log(`Uploading ${values.photos.length} images for item ${newItem.id}`);
        await api.items.uploadItemImages(String(newItem.id), values.photos);
      }

      // Success - navigate back with success message
      addToast('Item posted successfully!', 'info');
      router.push('/');
    } catch (error) {
      console.error('Error creating item:', error);
      throw error; // Re-throw for form handling
    } finally {
      setIsSubmitting(false);
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
        <h1 className="ml-2 text-lg font-semibold text-gray-900">Add Item</h1>
      </div>

      <form onSubmit={form.handleSubmit} className="p-4 space-y-6" role="form" aria-label="Add new item form">
        {/* Step indicator */}
        <div className="flex items-center justify-center space-x-2 mb-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={2} aria-label={`Step ${step} of 2`}>
          <div className={`w-8 h-1 rounded ${step === 1 ? 'bg-[#006666]' : 'bg-gray-200'}`} aria-hidden="true" />
          <div className={`w-8 h-1 rounded ${step === 2 ? 'bg-[#006666]' : 'bg-gray-200'}`} aria-hidden="true" />
        </div>
        {/* Photo Upload */}
        <div role="group" aria-labelledby="photo-upload-label">
          <label id="photo-upload-label" className="block text-sm font-medium text-gray-700 mb-2">
            Photos {form.values.photos.length === 0 && <span className="text-red-500" aria-label="required">*</span>}
          </label>
          
          <ImageUpload
            images={form.values.photos}
            onImagesChange={(images) => form.setValue('photos', images)}
            maxImages={6}
            maxFileSize={5}
            className="mb-4"
          />
          
          {form.values.photos.length === 0 && (
            <p className="text-sm text-red-500" role="alert" aria-live="polite">{form.errors.photos || 'At least one photo is required'}</p>
          )}
          <p id="photo-upload-help" className="text-xs text-gray-500 mt-1">
            You can upload up to 6 photos. Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB per photo.
            {form.values.photos.length > 0 && ` (${form.values.photos.length}/6 photos uploaded)`}
          </p>
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
            {/* Back button for step 2 */}
            <div className="flex items-center mb-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back to photos"
              >
                <ArrowLeft size={20} />
              </button>
              <span className="ml-2 text-lg font-medium text-gray-700">Item Details</span>
            </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={form.values.title}
            onChange={form.handleChange('title')}
            onBlur={form.handleBlur('title')}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006666] ${
              form.errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., MacBook Air M2 - Excellent condition"
            aria-describedby="title-help title-error"
            aria-invalid={!!form.errors.title}
            maxLength={100}
          />
          <p id="title-help" className="text-xs text-gray-500 mt-1">Choose a clear, descriptive title (5-100 characters)</p>
          {form.errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-500" role="alert" aria-live="polite">{form.errors.title}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={form.values.category}
            onChange={form.handleChange('category')}
            onBlur={form.handleBlur('category')}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006666]"
            aria-describedby="category-help"
          >
            {(() => {
              // Category icons mapping
              const categoryIcons: Record<string, string> = {
                'Electronics': '📱',
                'Books': '📚',
                'Furniture': '🪑',
                'Clothing': '👕',
                'Sports': '⚽',
                'Vehicles': '🚗',
                'Home & Garden': '🏡',
                'Lab Equipment': '🔬',
                'trotinette': '🛴',
                'Other': '🔖'
              };

              let categoriesData: string[] = [];
              
              // Handle backend categories (expects array of category objects)
              if (categories && Array.isArray(categories) && categories.length > 0) {
                // Backend returns array of category objects: [{id, name, icon, description}, ...]
                categoriesData = categories.map((cat: any) => {
                  if (typeof cat === 'string') {
                    return cat;
                  }
                  // Extract name from category object, use the backend icon if available
                  const categoryName = cat.name || cat.id || 'Other';
                  // Update our icon mapping with backend icon if available
                  if (cat.icon && categoryName) {
                    categoryIcons[categoryName] = cat.icon;
                  }
                  return categoryName;
                });
              } else {
                // Fallback categories
                categoriesData = ['Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Other'];
              }
              
              return categoriesData.map((category: string, index: number) => (
                <option key={`${category}-${index}`} value={category}>
                  {categoryIcons[category] || '🔖'} {category}
                </option>
              ));
            })()}
          </select>
          <p id="category-help" className="text-xs text-gray-500 mt-1">Choose the category that best describes your item</p>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price (DH) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            value={form.values.price}
            onChange={form.handleChange('price')}
            onBlur={form.handleBlur('price')}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006666] ${
              form.errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 8500"
            min="0"
            max="100000"
            step="0.01"
            aria-describedby="price-help price-error"
            aria-invalid={!!form.errors.price}
          />
          <p id="price-help" className="text-xs text-gray-500 mt-1">Enter the price in Moroccan Dirhams (DH) - Max: 100,000 DH</p>
          {form.errors.price && (
            <p id="price-error" className="mt-1 text-sm text-red-500" role="alert" aria-live="polite">{form.errors.price}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="quantity"
            value={form.values.quantity}
            onChange={form.handleChange('quantity')}
            onBlur={form.handleBlur('quantity')}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006666] ${
              form.errors.quantity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 1"
            min="1"
            max="1000"
            step="1"
            aria-describedby="quantity-help quantity-error"
            aria-invalid={!!form.errors.quantity}
          />
          <p id="quantity-help" className="text-xs text-gray-500 mt-1">How many units do you have? (1-1000)</p>
          {form.errors.quantity && (
            <p id="quantity-error" className="mt-1 text-sm text-red-500" role="alert" aria-live="polite">{form.errors.quantity}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={form.values.description}
            onChange={form.handleChange('description')}
            onBlur={form.handleBlur('description')}
            rows={4}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006666] ${
              form.errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your item in detail..."
            aria-describedby="description-help description-error"
            aria-invalid={!!form.errors.description}
            maxLength={1000}
          />
          <p id="description-help" className="text-xs text-gray-500 mt-1">Provide detailed information about your item (20-1000 characters)</p>
          {form.errors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-500" role="alert" aria-live="polite">{form.errors.description}</p>
          )}
        </div>

        {/* Show Identity Toggle */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200" role="group" aria-labelledby="identity-toggle-label">
          <div>
            <h3 id="identity-toggle-label" className="font-medium text-gray-900">Show my identity</h3>
            <p className="text-sm text-gray-600">Let buyers see your name and verification status</p>
          </div>
          <button
            type="button"
            onClick={() => form.setValue('showIdentity', !form.values.showIdentity)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.values.showIdentity ? 'bg-[#006666]' : 'bg-gray-300'
            }`}
            role="switch"
            aria-checked={form.values.showIdentity}
            aria-labelledby="identity-toggle-label"
            aria-describedby="identity-toggle-help"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.values.showIdentity ? 'translate-x-6' : 'translate-x-1'
              }`}
              aria-hidden="true"
            />
          </button>
          <p id="identity-toggle-help" className="sr-only">Toggle to show or hide your identity to buyers</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={form.isSubmitting}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
            form.isSubmitting 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-[#006666] text-white hover:bg-[#005555]'
          }`}
        >
          {form.isSubmitting ? 'Posting...' : 'Post Item'}
        </button>

        {/* Bottom Spacing */}
        <div className="h-20"></div>
          </>
        )}
      </form>
    </div>
  );
}
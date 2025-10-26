'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import { api } from '../../../lib/apiEndpoints';

// Component imports
import FormHeader from './FormHeader';
import StepIndicator from './StepIndicator';
import PhotoUploadStep from './PhotoUploadStep';
import ItemDetailsStep from './ItemDetailsStep';

// Hooks and utilities
import { useAddItemForm } from '../hooks/useAddItemForm';
import { useApi } from '../../../hooks/useApi';
import { ADD_ITEM_CONFIG, SUCCESS_MESSAGES, ERROR_MESSAGES, ANALYTICS_EVENTS } from '../constants';
import { AddItemFormProps } from '../types';

export default function AddItemForm({ 
  onSuccess, 
  onCancel, 
  className = '' 
}: AddItemFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const { addToast } = useToast();
  
  // Submission guard to prevent duplicate uploads (React Strict Mode protection)
  const isSubmittingRef = useRef(false);

  // Custom form hook
  const { state, actions } = useAddItemForm({
    onSuccess: (itemId) => {
      addToast(SUCCESS_MESSAGES.ITEM_CREATED, 'success');
      
      // Ensure draft is cleared before navigation
      if (typeof window !== 'undefined') {
        console.log('🧹 Explicitly clearing add-item draft before redirect...');
        localStorage.removeItem('add_item_draft');
        console.log('✅ Draft cleared, redirecting to home page...');
      }
      
      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', ANALYTICS_EVENTS.ITEM_CREATED, {
          item_id: itemId,
          category: state.data.category,
          price: state.data.price
        });
      }
      
      if (onSuccess) {
        onSuccess(itemId);
      } else {
        router.push('/');
      }
    },
    onError: (error) => {
      addToast(error, 'error');
      
      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', ANALYTICS_EVENTS.VALIDATION_ERROR, {
          error_message: error
        });
      }
    }
  });

  // Load categories with fallback
  const { data: categoriesFromAPI = [], loading: loadingCategories } = useApi(
    api.items.getCategories,
    {
      immediate: true,
      onError: (error) => {
        console.error('💥 Add-Item Form: Failed to load categories from backend:', error);
        console.error('🔧 This usually means the backend server is not running or /categories endpoint is unavailable');
        console.log('📦 Using comprehensive fallback categories instead...');
        // Don't show error toast since we have fallback
      }
    }
  );

  // Comprehensive fallback categories matching backend seed data
  const fallbackCategories = [
    { id: '1', name: 'Electronics', icon: '💻', description: 'Phones, laptops, gadgets' },
    { id: '2', name: 'Books', icon: '📚', description: 'Textbooks, novels, references' },
    { id: '3', name: 'Clothing', icon: '👕', description: 'Shirts, pants, shoes, accessories' },
    { id: '4', name: 'Furniture', icon: '🪑', description: 'Desks, chairs, storage, beds' },
    { id: '5', name: 'Sports', icon: '⚽', description: 'Fitness, sports equipment, outdoor gear' },
    { id: '6', name: 'Transportation', icon: '🚗', description: 'Cars, bikes, scooters, parts' },
    { id: '7', name: 'Health & Beauty', icon: '💄', description: 'Cosmetics, skincare, health products' },
    { id: '8', name: 'Art & Crafts', icon: '🎨', description: 'Art supplies, handmade items, crafts' },
    { id: '9', name: 'Music & Instruments', icon: '🎵', description: 'Instruments, audio equipment, music' },
    { id: '10', name: 'Home & Garden', icon: '🏠', description: 'Appliances, tools, garden supplies' },
    { id: '11', name: 'Toys & Games', icon: '🎮', description: 'Video games, board games, toys' },
    { id: '12', name: 'Pet Supplies', icon: '🐕', description: 'Pet food, accessories, toys' },
    { id: '13', name: 'Office Supplies', icon: '📎', description: 'Stationery, office equipment, supplies' },
    { id: '14', name: 'Food & Beverages', icon: '🍕', description: 'Snacks, drinks, food items' },
    { id: '15', name: 'Services', icon: '🔧', description: 'Tutoring, repairs, services' },
    { id: '16', name: 'Other', icon: '📦', description: 'Items that don\'t fit other categories' }
  ];

  // Use API categories if available, otherwise use comprehensive fallback
  const categories = (categoriesFromAPI && categoriesFromAPI.length > 0) ? categoriesFromAPI : fallbackCategories;

  // Debug logging for category loading
  console.log('🔍 Add-Item Form Category Status:');
  console.log('  - Backend categories loaded:', categoriesFromAPI?.length || 0);
  console.log('  - Using fallback categories:', categories === fallbackCategories);
  console.log('  - Total categories available:', categories.length);
  if (categories.length > 0) {
    console.log('  - Available categories:', categories.map(cat => cat.name).join(', '));
  }

  // Cleanup effect - clear draft if user navigates away without completing
  useEffect(() => {
    return () => {
      // Only clear draft on cleanup if form is not being submitted
      // This prevents clearing draft during successful submission
      if (!state.isSubmitting) {
        actions.clearDraft();
      }
    };
  }, [state.isSubmitting, actions]);

  // Handle navigation
  const handleBack = () => {
    if (state.currentStep > 1) {
      actions.previousStep();
    } else {
      if (onCancel) {
        onCancel();
      } else {
        router.push('/');
      }
    }
  };

  // Handle photo step navigation
  const handleNextFromPhotos = () => {
    if (state.data.photos.length === 0) {
      addToast('Please add at least one photo', 'error');
      return;
    }
    actions.nextStep();
  };

  // Handle photo changes
  const handlePhotosChange = (photos: File[]) => {
    actions.updatePhotos(photos);
  };

  // Handle cancel
  const handleCancel = () => {
    // Clear draft when user explicitly cancels the entire form
    actions.clearDraft();
    if (onCancel) {
      onCancel();
    } else {
      router.push('/');
    }
  };

  // Handle form submission with Instagram-style background processing
  const handleSubmit = async () => {
    // Prevent duplicate submissions (React Strict Mode & double-click protection)
    if (isSubmittingRef.current) {
      console.log('🛑 Submission already in progress, ignoring duplicate call');
      return;
    }
    
    if (!user) {
      addToast(ERROR_MESSAGES.UNAUTHORIZED, 'error');
      return;
    }

    // Validate form before submission
    if (!actions.validateForm()) {
      addToast(ERROR_MESSAGES.VALIDATION_FAILED, 'error');
      return;
    }

    // Set loading state immediately and mark as submitting
    isSubmittingRef.current = true;
    actions.setSubmitting(true);
    
    console.log('✅ Starting submission...');

    try {
      // Validate numeric fields before conversion
      const priceValue = parseFloat(state.data.price);
      const quantityValue = parseInt(state.data.quantity);
      
      if (isNaN(priceValue) || priceValue <= 0) {
        addToast('Please enter a valid price', 'error');
        actions.setSubmitting(false);
        return;
      }
      
      if (isNaN(quantityValue) || quantityValue <= 0) {
        addToast('Please enter a valid quantity', 'error');
        actions.setSubmitting(false);
        return;
      }

      // Show posting message
      addToast('Creating your item...', 'info');

      // Prepare item data
      const itemData = {
        title: state.data.title,
        description: state.data.description,
        price: priceValue,
        quantity: quantityValue,
        category: state.data.category,
        condition: state.data.condition,
        anonymous: !state.data.showIdentity,
      };

      // Create item and wait for response
      const response = await api.items.createItem(itemData);
      const newItem = response.data;

      // Upload photos if item creation succeeded
      if (state.data.photos.length > 0) {
        addToast('Uploading images...', 'info');
        try {
          await api.items.uploadItemImages(String(newItem.id), state.data.photos);
        } catch (uploadError: any) {
          console.error('Error uploading images:', uploadError);
          addToast('Item created but some images failed to upload. You can add them later from your profile.', 'warning');
          
          // Clear draft and reset
          actions.clearDraft();
          actions.reset();
          
          // Reset submission guard
          isSubmittingRef.current = false;
          
          // Redirect even if images failed
          if (onSuccess) {
            onSuccess(String(newItem.id));
          } else {
            router.push('/');
          }
          return;
        }
      }

      // Success - everything uploaded successfully!
      addToast('Item posted successfully!', 'success');
      
      // Clear draft and reset form
      actions.clearDraft();
      actions.reset();
      
      // Reset submission guard
      isSubmittingRef.current = false;
      
      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', ANALYTICS_EVENTS.ITEM_CREATED, {
          item_id: String(newItem.id),
          category: state.data.category,
          price: state.data.price,
          images_count: state.data.photos.length
        });
      }

      // Redirect to homepage after successful upload
      if (onSuccess) {
        onSuccess(String(newItem.id));
      } else {
        router.push('/');
      }

    } catch (error: any) {
      console.error('Error creating item:', error);
      addToast(error.message || ERROR_MESSAGES.CREATION_FAILED, 'error');
      actions.setSubmitting(false);
      // Reset submission guard on error
      isSubmittingRef.current = false;
      // Clear draft on error to prevent it from affecting next item creation
      actions.clearDraft();
    }
  };

  // Debug function to check draft status (for development)
  const checkDraftStatus = () => {
    if (typeof window !== 'undefined') {
      const draftExists = localStorage.getItem('add_item_draft') !== null;
      console.log('Draft exists in localStorage:', draftExists);
      if (draftExists) {
        console.log('Draft content:', localStorage.getItem('add_item_draft'));
      }
      return draftExists;
    }
    return false;
  };

  // Add to window for debugging (development only)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).checkAddItemDraft = checkDraftStatus;
    (window as any).clearAddItemDraft = () => {
      localStorage.removeItem('add_item_draft');
      console.log('Draft cleared manually');
    };
    

  }

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 ${className}`}>
      {/* Enhanced Header with Glass Effect */}
      <div className="flex-shrink-0 sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <FormHeader
            title="Add Item"
            onBack={handleBack}
            showBackButton={true}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Enhanced Step Indicator */}
        <div className="max-w-4xl mx-auto w-full">
          <StepIndicator
            currentStep={state.currentStep}
            totalSteps={ADD_ITEM_CONFIG.TOTAL_STEPS}
            className="mb-8 lg:mb-12"
          />
        </div>

        {/* Enhanced Step Content Container */}
        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-2xl lg:max-w-4xl">
            {/* Step Content with Enhanced Responsive Layout */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Content Header */}
              <div className="bg-gradient-to-r from-[#009F9C] to-[#00C4A7] px-6 sm:px-8 py-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {state.currentStep === ADD_ITEM_CONFIG.STEP_PHOTOS ? (
                    <>
                      📸 Add Photos
                      <span className="block text-sm font-normal text-white/80 mt-1">
                        Upload high-quality images to showcase your item
                      </span>
                    </>
                  ) : (
                    <>
                      📝 Item Details
                      <span className="block text-sm font-normal text-white/80 mt-1">
                        Fill in the details about your item
                      </span>
                    </>
                  )}
                </h2>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 lg:p-10">
                {state.currentStep === ADD_ITEM_CONFIG.STEP_PHOTOS && (
                  <div className="space-y-6">
                    <PhotoUploadStep
                      photos={state.data.photos}
                      onPhotosChange={handlePhotosChange}
                      error={state.validation.errors.photos}
                      onNext={handleNextFromPhotos}
                      onCancel={handleCancel}
                    />
                  </div>
                )}

                {state.currentStep === ADD_ITEM_CONFIG.STEP_DETAILS && (
                  <div className="space-y-6">
                    <ItemDetailsStep
                      data={state.data}
                      onChange={actions.updateField}
                      errors={state.validation.errors}
                      categories={categories || []}
                      isSubmitting={state.isSubmitting}
                      onSubmit={handleSubmit}
                      onBack={actions.previousStep}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                💡 <span className="ml-2">Pro Tips</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                {state.currentStep === ADD_ITEM_CONFIG.STEP_PHOTOS ? (
                  <>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Use natural lighting for better photo quality</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Show multiple angles of your item</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Include close-ups of important details</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Clear, uncluttered backgrounds work best</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Write clear, detailed descriptions</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Price competitively by checking similar items</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Be honest about condition and defects</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Choose the most accurate category</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Auto-save Indicator */}
      {state.isAutoSaving && (
        <div className="fixed bottom-24 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-gray-900/90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>💾 Auto-saving draft...</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mobile Progress Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">
              Step {state.currentStep} of {ADD_ITEM_CONFIG.TOTAL_STEPS}
            </span>
            <span className="text-gray-900 font-semibold">
              {state.currentStep === ADD_ITEM_CONFIG.STEP_PHOTOS ? 'Add Photos' : 'Item Details'}
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#009F9C] to-[#00C4A7] h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${(state.currentStep / ADD_ITEM_CONFIG.TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Desktop Progress Sidebar */}
      <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 z-30">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-xs">
          <h3 className="font-bold text-gray-900 mb-4">Progress</h3>
          <div className="space-y-4">
            <div className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
              state.currentStep >= ADD_ITEM_CONFIG.STEP_PHOTOS 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                state.currentStep >= ADD_ITEM_CONFIG.STEP_PHOTOS
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {state.currentStep > ADD_ITEM_CONFIG.STEP_PHOTOS ? '✓' : '1'}
              </div>
              <span className={`font-medium ${
                state.currentStep >= ADD_ITEM_CONFIG.STEP_PHOTOS ? 'text-green-700' : 'text-gray-600'
              }`}>
                Add Photos
              </span>
            </div>
            
            <div className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
              state.currentStep >= ADD_ITEM_CONFIG.STEP_DETAILS 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                state.currentStep >= ADD_ITEM_CONFIG.STEP_DETAILS
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {state.currentStep > ADD_ITEM_CONFIG.STEP_DETAILS ? '✓' : '2'}
              </div>
              <span className={`font-medium ${
                state.currentStep >= ADD_ITEM_CONFIG.STEP_DETAILS ? 'text-green-700' : 'text-gray-600'
              }`}>
                Item Details
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
  }
}
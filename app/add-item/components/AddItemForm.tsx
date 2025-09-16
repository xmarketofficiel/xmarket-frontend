'use client';

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

export default function OptimizedAddItemForm({ 
  onSuccess, 
  onCancel, 
  className = '' 
}: AddItemFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const { addToast } = useToast();

  // Custom form hook
  const { state, actions } = useAddItemForm({
    onSuccess: (itemId) => {
      addToast(SUCCESS_MESSAGES.ITEM_CREATED, 'success');
      
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

  // Load categories
  const { data: categories = [], loading: loadingCategories } = useApi(
    api.items.getCategories,
    {
      immediate: true,
      onError: (error) => {
        console.error('Failed to load categories:', error);
        addToast(ERROR_MESSAGES.CATEGORIES_LOAD_FAILED, 'error');
      }
    }
  );

  // Handle navigation
  const handleBack = () => {
    if (state.currentStep > 1) {
      actions.previousStep();
    } else {
      if (onCancel) {
        onCancel();
      } else {
        router.back();
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  // Handle photo step
  const handlePhotosChange = (photos: File[]) => {
    actions.updateField('photos', photos);
  };

  const handleNextFromPhotos = () => {
    if (actions.validateStep(ADD_ITEM_CONFIG.STEP_PHOTOS)) {
      actions.nextStep();
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', ANALYTICS_EVENTS.STEP_COMPLETED, {
          step: ADD_ITEM_CONFIG.STEP_PHOTOS,
          photos_count: state.data.photos.length
        });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!user) {
      addToast(ERROR_MESSAGES.UNAUTHORIZED, 'error');
      return;
    }

    // Validate form before submission
    if (!actions.validateForm()) {
      addToast(ERROR_MESSAGES.VALIDATION_FAILED, 'error');
      return;
    }

    // Set loading state immediately
    actions.setSubmitting(true);

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

      // Show posting message and redirect immediately (Instagram-style)
      addToast('Your item is being posted...', 'info');
      
      // Redirect to homepage immediately
      if (onSuccess) {
        onSuccess('posting');
      } else {
        router.push('/');
      }

      // Process in background
      const itemData = {
        title: state.data.title,
        description: state.data.description,
        price: priceValue,
        quantity: quantityValue,
        category: state.data.category,
        condition: state.data.condition,
        anonymous: !state.data.showIdentity,
      };

      // Background processing
      setTimeout(async () => {
        try {
          // Create item
          const response = await api.items.createItem(itemData);
          const newItem = response.data;

          // Upload photos if item creation succeeded
          if (state.data.photos.length > 0) {
            await api.items.uploadItemImages(String(newItem.id), state.data.photos);
          }

          // Show success toast
          addToast('Item posted successfully!', 'success');
          actions.reset();
          
          // Analytics tracking
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', ANALYTICS_EVENTS.ITEM_CREATED, {
              item_id: String(newItem.id),
              category: state.data.category,
              price: state.data.price
            });
          }
        } catch (error: any) {
          console.error('Error creating item:', error);
          addToast('Failed to post item. Please try again.', 'error');
        }
      }, 100);

    } catch (error: any) {
      console.error('Error creating item:', error);
      addToast(error.message || ERROR_MESSAGES.CREATION_FAILED, 'error');
      actions.setSubmitting(false);
    }
  };

  return (
    <div className={`h-full flex flex-col bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0">
        <FormHeader
          title="Add Item"
          onBack={handleBack}
          step={state.currentStep}
          totalSteps={ADD_ITEM_CONFIG.TOTAL_STEPS}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={state.currentStep}
          totalSteps={ADD_ITEM_CONFIG.TOTAL_STEPS}
          className="mb-8"
        />

        {/* Step Content */}
        <div className="max-w-md mx-auto">
          {state.currentStep === ADD_ITEM_CONFIG.STEP_PHOTOS && (
            <PhotoUploadStep
              photos={state.data.photos}
              onPhotosChange={handlePhotosChange}
              error={state.validation.errors.photos}
              onNext={handleNextFromPhotos}
              onCancel={handleCancel}
            />
          )}

          {state.currentStep === ADD_ITEM_CONFIG.STEP_DETAILS && (
            <ItemDetailsStep
              data={state.data}
              onChange={actions.updateField}
              errors={state.validation.errors}
              categories={categories || []}
              isSubmitting={state.isSubmitting}
              onSubmit={handleSubmit}
              onBack={actions.previousStep}
            />
          )}
        </div>

        {/* Draft Auto-save Indicator */}
        {state.isAutoSaving && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm">
            💾 Auto-saving draft...
          </div>
        )}

        {/* Progress Indicator */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3 md:hidden">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Step {state.currentStep} of {ADD_ITEM_CONFIG.TOTAL_STEPS}
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: ADD_ITEM_CONFIG.TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i + 1 <= state.currentStep ? 'bg-[#006666]' : 'bg-gray-300'
                  }`}
                />
              ))}
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

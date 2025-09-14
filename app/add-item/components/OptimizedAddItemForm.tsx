'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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

    try {
      // Validate numeric fields before conversion
      const priceValue = parseFloat(state.data.price);
      const quantityValue = parseInt(state.data.quantity);
      
      if (isNaN(priceValue) || priceValue <= 0) {
        addToast('Please enter a valid price', 'error');
        return;
      }
      
      if (isNaN(quantityValue) || quantityValue <= 0) {
        addToast('Please enter a valid quantity', 'error');
        return;
      }

      const itemData = {
        title: state.data.title,
        description: state.data.description,
        price: priceValue,
        quantity: quantityValue,
        category: state.data.category,
        condition: state.data.condition,
        anonymous: !state.data.showIdentity,
      };

      // Create item
      const response = await api.items.createItem(itemData);
      const newItem = response.data;

      // Upload photos if item creation succeeded
      if (state.data.photos.length > 0) {
        await api.items.uploadItemImages(String(newItem.id), state.data.photos);
      }

      // Success
      actions.reset();
      
      if (onSuccess) {
        onSuccess(String(newItem.id));
      } else {
        addToast(SUCCESS_MESSAGES.ITEM_CREATED, 'success');
        router.push('/');
      }
    } catch (error: any) {
      console.error('Error creating item:', error);
      addToast(error.message || ERROR_MESSAGES.CREATION_FAILED, 'error');
    }
  };

  // Step transition variants
  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen bg-gray-50 ${className}`}
    >
      {/* Header */}
      <FormHeader
        title="Add Item"
        onBack={handleBack}
        step={state.currentStep}
        totalSteps={ADD_ITEM_CONFIG.TOTAL_STEPS}
      />

      {/* Content */}
      <div className="p-4 pb-20">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={state.currentStep}
          totalSteps={ADD_ITEM_CONFIG.TOTAL_STEPS}
          className="mb-8"
        />

        {/* Step Content */}
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait" custom={state.currentStep}>
            {state.currentStep === ADD_ITEM_CONFIG.STEP_PHOTOS && (
              <motion.div
                key="photos"
                custom={state.currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                <PhotoUploadStep
                  photos={state.data.photos}
                  onPhotosChange={handlePhotosChange}
                  error={state.validation.errors.photos}
                  onNext={handleNextFromPhotos}
                  onCancel={handleCancel}
                />
              </motion.div>
            )}

            {state.currentStep === ADD_ITEM_CONFIG.STEP_DETAILS && (
              <motion.div
                key="details"
                custom={state.currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                <ItemDetailsStep
                  data={state.data}
                  onChange={actions.updateField}
                  errors={state.validation.errors}
                  categories={categories || []}
                  isSubmitting={state.isSubmitting}
                  onSubmit={handleSubmit}
                  onBack={actions.previousStep}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Draft Auto-save Indicator */}
        {state.isAutoSaving && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm"
          >
            💾 Auto-saving draft...
          </motion.div>
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
    </motion.div>
  );
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
  }
}

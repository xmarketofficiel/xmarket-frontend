// Add Item Form Types

import { ReactNode } from 'react';

// Valid condition types that match the backend
export type ItemCondition = "New" | "Like New" | "Good" | "Fair";

// Core form data types
export interface AddItemFormData {
  title: string;
  description: string;
  price: string;
  quantity: string;
  category: string;
  condition: ItemCondition;
  photos: File[];
  showIdentity: boolean;
  allowMessages?: boolean;
}

export interface AddItemApiData {
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  condition: ItemCondition;
  anonymous: boolean;
}

// Form validation types
export interface FormValidation {
  isValid: boolean;
  errors: Partial<Record<keyof AddItemFormData, string>>;
  touched: Partial<Record<keyof AddItemFormData, boolean>>;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export type ValidationRules = Partial<Record<keyof AddItemFormData, ValidationRule[]>>;

// Form state types
export interface FormState {
  currentStep: number;
  data: AddItemFormData;
  validation: FormValidation;
  isSubmitting: boolean;
  isDirty: boolean;
  isAutoSaving: boolean;
  hasUnsavedChanges: boolean;
}

export interface FormActions {
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateField: (field: keyof AddItemFormData, value: any) => void;
  updateMultipleFields: (updates: Partial<AddItemFormData>) => void;
  validateField: (field: keyof AddItemFormData) => void;
  validateStep: (step: number) => boolean;
  validateForm: () => boolean;
  submit: () => Promise<void>;
  reset: () => void;
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
}

// Component prop types
export interface AddItemFormProps {
  onSuccess?: (itemId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export interface FormHeaderProps {
  title: string;
  onBack: () => void;
  step?: number;
  totalSteps?: number;
  className?: string;
}

export interface PhotoUploadStepProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  error?: string;
  onNext: () => void;
  onCancel: () => void;
  className?: string;
}

export interface ItemDetailsStepProps {
  data: AddItemFormData;
  onChange: (field: keyof AddItemFormData, value: any) => void;
  errors: Partial<Record<keyof AddItemFormData, string>>;
  categories: CategoryOption[];
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
  className?: string;
}

export interface FormFieldProps {
  label: string;
  name: keyof AddItemFormData;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
}

export interface TextInputProps extends FormFieldProps {
  type?: 'text' | 'number' | 'email' | 'tel';
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaProps extends FormFieldProps {
  rows?: number;
  placeholder?: string;
  maxLength?: number;
}

export interface SelectProps extends FormFieldProps {
  options: SelectOption[];
  placeholder?: string;
}

export interface ToggleProps extends FormFieldProps {
  description?: string;
}

// Category types
export interface CategoryOption {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  subcategories?: string[];
}

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
  disabled?: boolean;
}

// Condition types
export interface ConditionOption {
  value: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

// Image upload types
export interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  maxFileSize?: number;
  supportedFormats?: string[];
  error?: string;
  className?: string;
}

export interface ImagePreview {
  file: File;
  url: string;
  id: string;
}

export interface UploadProgress {
  total: number;
  uploaded: number;
  current?: string;
  errors: string[];
}

// API response types
export interface CreateItemResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    price: number;
    category: string;
    createdAt: string;
  };
  message: string;
}

export interface UploadImagesResponse {
  success: boolean;
  data: {
    imageUrls: string[];
    failedUploads: string[];
  };
  message: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: CategoryOption[];
}

// Hook return types
export interface UseAddItemFormReturn {
  state: FormState;
  actions: FormActions;
}

export interface UseImageUploadReturn {
  images: ImagePreview[];
  uploading: boolean;
  progress: UploadProgress;
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  reorderImages: (startIndex: number, endIndex: number) => void;
  clearImages: () => void;
}

export interface UseCategoriesReturn {
  categories: CategoryOption[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Step configuration types
export interface StepConfig {
  title: string;
  description: string;
  icon: string;
  nextLabel: string;
  canSkip: boolean;
  validationRequired: boolean;
}

// Privacy settings types
export interface PrivacySettings {
  showIdentity: boolean;
  allowMessages: boolean;
}

// Form analytics types
export interface FormAnalytics {
  sessionId: string;
  startTime: number;
  stepTimes: Record<number, number>;
  errors: Array<{
    field: string;
    error: string;
    timestamp: number;
  }>;
  abandoned: boolean;
  completed: boolean;
}

// Draft management types
export interface DraftData {
  formData: Partial<AddItemFormData>;
  step: number;
  timestamp: number;
  version: string;
}

// Error types
export interface FormError {
  field: keyof AddItemFormData;
  message: string;
  code?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Loading states
export interface LoadingStates {
  categories: boolean;
  submission: boolean;
  imageUpload: boolean;
  validation: boolean;
  autosave: boolean;
}

// Success states
export interface SuccessStates {
  itemCreated: boolean;
  imagesUploaded: boolean;
  draftSaved: boolean;
}

// Performance monitoring
export interface PerformanceMetrics {
  formLoadTime: number;
  stepTransitionTime: number;
  validationTime: number;
  submissionTime: number;
  imageUploadTime: number;
}

// Accessibility types
export interface A11yLabels {
  stepIndicator: string;
  photoUpload: string;
  formFields: Record<keyof AddItemFormData, string>;
  actions: {
    next: string;
    back: string;
    submit: string;
    cancel: string;
  };
}

// Configuration types
export interface AddItemConfig {
  maxImages: number;
  maxFileSize: number;
  supportedFormats: string[];
  validationDebounce: number;
  autosaveInterval: number;
  maxRetries: number;
}

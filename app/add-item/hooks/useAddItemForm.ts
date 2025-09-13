"use client";

import { useState, useCallback, useEffect } from "react";
import {
  AddItemFormData,
  FormState,
  FormActions,
  ValidationRule,
} from "../types";
import {
  ADD_ITEM_CONFIG,
  VALIDATION_MESSAGES,
  STORAGE_KEYS,
} from "../constants";

interface UseAddItemFormProps {
  onSuccess?: (itemId: string) => void;
  onError?: (error: string) => void;
}

export function useAddItemForm({
  onSuccess,
  onError,
}: UseAddItemFormProps = {}) {
  const [state, setState] = useState<FormState>({
    currentStep: ADD_ITEM_CONFIG.STEP_PHOTOS,
    data: {
      title: "",
      description: "",
      price: "",
      quantity: ADD_ITEM_CONFIG.DEFAULT_QUANTITY,
      category: "",
      condition: ADD_ITEM_CONFIG.DEFAULT_CONDITION,
      photos: [],
      showIdentity: true,
      allowMessages: true,
    },
    validation: {
      isValid: false,
      errors: {},
      touched: {},
    },
    isSubmitting: false,
    isDirty: false,
    isAutoSaving: false,
    hasUnsavedChanges: false,
  });

  // Validation rules
  const validationRules: Record<keyof AddItemFormData, ValidationRule[]> = {
    title: [
      { required: true },
      { minLength: ADD_ITEM_CONFIG.TITLE_MIN_LENGTH },
      { maxLength: ADD_ITEM_CONFIG.TITLE_MAX_LENGTH },
    ],
    description: [
      { required: true },
      { minLength: ADD_ITEM_CONFIG.DESCRIPTION_MIN_LENGTH },
      { maxLength: ADD_ITEM_CONFIG.DESCRIPTION_MAX_LENGTH },
    ],
    price: [
      { required: true },
      { min: ADD_ITEM_CONFIG.MIN_PRICE },
      { max: ADD_ITEM_CONFIG.MAX_PRICE },
      {
        custom: (value: string) => {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) return VALIDATION_MESSAGES.price.invalid;
          return null;
        },
      },
    ],
    quantity: [
      { required: true },
      { min: ADD_ITEM_CONFIG.MIN_QUANTITY },
      { max: ADD_ITEM_CONFIG.MAX_QUANTITY },
      {
        custom: (value: string) => {
          const numValue = parseInt(value);
          if (isNaN(numValue)) return VALIDATION_MESSAGES.quantity.invalid;
          return null;
        },
      },
    ],
    category: [{ required: true }],
    condition: [{ required: true }],
    photos: [
      {
        custom: (files: File[]) => {
          if (files.length === 0) return VALIDATION_MESSAGES.photos.required;
          if (files.length > ADD_ITEM_CONFIG.MAX_IMAGES)
            return VALIDATION_MESSAGES.photos.maxCount;

          // Check file sizes and formats
          for (const file of files) {
            if (file.size > ADD_ITEM_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
              return VALIDATION_MESSAGES.photos.maxSize;
            }
            if (!ADD_ITEM_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
              return VALIDATION_MESSAGES.photos.invalidFormat;
            }
          }
          return null;
        },
      },
    ],
    showIdentity: [],
    allowMessages: [],
  };

  // Validate a single field
  const validateField = useCallback(
    (field: keyof AddItemFormData, value: any): string | null => {
      const rules = validationRules[field];

      for (const rule of rules) {
        if (
          rule.required &&
          (!value || (Array.isArray(value) && value.length === 0))
        ) {
          return (VALIDATION_MESSAGES[field] as any)?.required || `${field} is required`;
        }

        if (
          rule.minLength &&
          typeof value === "string" &&
          value.length < rule.minLength
        ) {
          return (
            (VALIDATION_MESSAGES[field] as any)?.minLength || `${field} is too short`
          );
        }

        if (
          rule.maxLength &&
          typeof value === "string" &&
          value.length > rule.maxLength
        ) {
          return (
            (VALIDATION_MESSAGES[field] as any)?.maxLength || `${field} is too long`
          );
        }

        if (rule.min && typeof value === "string") {
          const numValue = parseFloat(value);
          if (!isNaN(numValue) && numValue < rule.min) {
            return (VALIDATION_MESSAGES[field] as any)?.min || `${field} is too small`;
          }
        }

        if (rule.max && typeof value === "string") {
          const numValue = parseFloat(value);
          if (!isNaN(numValue) && numValue > rule.max) {
            return (VALIDATION_MESSAGES[field] as any)?.max || `${field} is too large`;
          }
        }

        if (rule.custom) {
          const customError = rule.custom(value);
          if (customError) return customError;
        }
      }

      return null;
    },
    []
  );

  // Validate the entire form
  const validateForm = useCallback(() => {
    const errors: Partial<Record<keyof AddItemFormData, string>> = {};
    let isValid = true;

    Object.keys(state.data).forEach((key) => {
      const field = key as keyof AddItemFormData;
      const error = validateField(field, state.data[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setState((prev) => ({
      ...prev,
      validation: {
        ...prev.validation,
        errors,
        isValid,
      },
    }));

    return isValid;
  }, [state.data, validateField]);

  // Validate a specific step
  const validateStep = useCallback(
    (step: number): boolean => {
      if (step === ADD_ITEM_CONFIG.STEP_PHOTOS) {
        const photoError = validateField("photos", state.data.photos);
        setState((prev) => {
          const newErrors = { ...prev.validation.errors };
          if (photoError) {
            newErrors.photos = photoError;
          } else {
            delete newErrors.photos; // Remove photos error if no error
          }
          
          return {
            ...prev,
            validation: {
              ...prev.validation,
              errors: newErrors,
            },
          };
        });
        return !photoError;
      }

      if (step === ADD_ITEM_CONFIG.STEP_DETAILS) {
        return validateForm();
      }

      return true;
    },
    [state.data.photos, validateField, validateForm]
  );

  // Update a single field
  const updateField = useCallback(
    (field: keyof AddItemFormData, value: any) => {
      setState((prev) => {
        const newData = { ...prev.data, [field]: value };
        const error = validateField(field, value);
        
        // Filter out empty/undefined errors
        const newErrors = { ...prev.validation.errors };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field]; // Remove the field if no error
        }

        return {
          ...prev,
          data: newData,
          validation: {
            ...prev.validation,
            errors: newErrors,
            touched: {
              ...prev.validation.touched,
              [field]: true,
            },
          },
          isDirty: true,
          hasUnsavedChanges: true,
        };
      });
    },
    [validateField]
  );

  // Update multiple fields
  const updateMultipleFields = useCallback(
    (updates: Partial<AddItemFormData>) => {
      setState((prev) => {
        const newData = { ...prev.data, ...updates };
        const newErrors = { ...prev.validation.errors };
        const newTouched = { ...prev.validation.touched };

        Object.keys(updates).forEach((key) => {
          const field = key as keyof AddItemFormData;
          const error = validateField(field, updates[field]);
          if (error) {
            newErrors[field] = error;
          } else {
            delete newErrors[field]; // Remove field if no error
          }
          newTouched[field] = true;
        });

        return {
          ...prev,
          data: newData,
          validation: {
            ...prev.validation,
            errors: newErrors,
            touched: newTouched,
          },
          isDirty: true,
          hasUnsavedChanges: true,
        };
      });
    },
    [validateField]
  );

  // Navigation actions
  const setStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    if (validateStep(state.currentStep)) {
      setState((prev) => ({
        ...prev,
        currentStep: Math.min(
          prev.currentStep + 1,
          ADD_ITEM_CONFIG.TOTAL_STEPS
        ),
      }));
    }
  }, [state.currentStep, validateStep]);

  const previousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  // Draft management
  const saveDraft = useCallback(() => {
    try {
      // Exclude photos from draft since File objects can't be serialized
      const { photos, ...draftableData } = state.data;
      
      const draft = {
        formData: draftableData,
        step: state.currentStep,
        timestamp: Date.now(),
        version: "1.0",
      };
      localStorage.setItem(STORAGE_KEYS.DRAFT_FORM, JSON.stringify(draft));
      setState((prev) => ({ ...prev, hasUnsavedChanges: false }));
    } catch (error) {
      console.warn("Failed to save draft:", error);
    }
  }, [state.data, state.currentStep]);

  const loadDraft = useCallback(() => {
    try {
      const draftStr = localStorage.getItem(STORAGE_KEYS.DRAFT_FORM);
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        
        // Exclude photos from draft restoration since File objects can't be serialized
        const { photos, ...restoreData } = draft.formData || {};
        
        setState((prev) => ({
          ...prev,
          data: { 
            ...prev.data, 
            ...restoreData,
            photos: [] // Always start with empty photos array
          },
          currentStep: draft.step || ADD_ITEM_CONFIG.STEP_PHOTOS,
        }));
        return true;
      }
    } catch (error) {
      console.warn("Failed to load draft:", error);
    }
    return false;
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.DRAFT_FORM);
    } catch (error) {
      console.warn("Failed to clear draft:", error);
    }
  }, []);

  // Reset form
  const reset = useCallback(() => {
    setState({
      currentStep: ADD_ITEM_CONFIG.STEP_PHOTOS,
      data: {
        title: "",
        description: "",
        price: "",
        quantity: ADD_ITEM_CONFIG.DEFAULT_QUANTITY,
        category: "",
        condition: ADD_ITEM_CONFIG.DEFAULT_CONDITION,
        photos: [],
        showIdentity: true,
        allowMessages: true,
      },
      validation: {
        isValid: false,
        errors: {},
        touched: {},
      },
      isSubmitting: false,
      isDirty: false,
      isAutoSaving: false,
      hasUnsavedChanges: false,
    });
    clearDraft();
  }, [clearDraft]);

  // Submit form
  const submit = useCallback(async () => {
    if (!validateForm()) {
      onError?.("Please fix the validation errors");
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      // This would be replaced with actual API calls
      const itemData = {
        title: state.data.title,
        description: state.data.description,
        price: Number(state.data.price),
        quantity: Number(state.data.quantity),
        category: state.data.category,
        condition: state.data.condition,
        anonymous: !state.data.showIdentity,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear draft and reset form
      clearDraft();

      onSuccess?.("mock-item-id");
    } catch (error: any) {
      onError?.(error.message || "Failed to create item");
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [state.data, validateForm, onSuccess, onError, clearDraft]);

  // Auto-save effect
  useEffect(() => {
    if (state.hasUnsavedChanges) {
      const timer = setTimeout(() => {
        saveDraft();
      }, ADD_ITEM_CONFIG.AUTOSAVE_DEBOUNCE_MS);

      return () => clearTimeout(timer);
    }
  }, [state.hasUnsavedChanges, saveDraft]);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  const actions: FormActions = {
    setStep,
    nextStep,
    previousStep,
    updateField,
    updateMultipleFields,
    validateField: (field) => validateField(field, state.data[field]),
    validateStep,
    validateForm,
    submit,
    reset,
    saveDraft,
    loadDraft,
    clearDraft,
  };

  return {
    state,
    actions,
  };
}

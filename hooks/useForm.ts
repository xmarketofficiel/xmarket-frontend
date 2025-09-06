'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { z } from 'zod';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  onError?: (errors: Record<string, string>) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  validate: () => boolean;
}

/**
 * Comprehensive form hook with validation, error handling, and submission
 * Consolidates form patterns across all components
 */
export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const {
    initialValues,
    validationSchema,
    onSubmit,
    onError,
    validateOnChange = false,
    validateOnBlur = true
  } = options;

  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use refs to avoid circular dependencies
  const valuesRef = useRef<T>(values);
  const optionsRef = useRef(options);
  const initialValuesRef = useRef<T>(initialValues);

  // Update refs when values or options change
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const validateField = useCallback((field: keyof T, value: any): string | null => {
    const { validationSchema } = optionsRef.current;
    if (!validationSchema) return null;

    try {
      // Create a temporary object with just this field for validation
      const tempValues = { ...valuesRef.current, [field]: value };
      validationSchema.parse(tempValues);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.flatten().fieldErrors[field as string];
        return fieldError?.[0] || null;
      }
      return 'Validation error';
    }
  }, []); // No dependencies - stable function

  const validateAll = useCallback((): Record<string, string> => {
    const { validationSchema } = optionsRef.current;
    if (!validationSchema) return {};

    try {
      validationSchema.parse(valuesRef.current);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const errorMessages: Record<string, string> = {};
        
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            errorMessages[field] = messages[0];
          }
        });
        
        return errorMessages;
      }
      return { general: 'Validation error' };
    }
  }, []); // No dependencies - stable function

  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => {
      const newValues = { ...prev, [field]: value };
      
      if (optionsRef.current.validateOnChange) {
        const error = validateField(field, value);
        if (error) {
          setErrorsState(prevErrors => ({ ...prevErrors, [field]: error }));
        } else {
          setErrorsState(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[field as string];
            return newErrors;
          });
        }
      }
      
      return newValues;
    });
  }, []); // Remove validateField dependency to prevent circular deps

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrorsState(prev => ({ ...prev, [field]: error }));
  }, []);

  const setErrors = useCallback((newErrors: Record<string, string>) => {
    setErrorsState(newErrors);
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setErrorsState(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrorsState({});
  }, []);

  const handleChange = useCallback((field: keyof T) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
      
      setValue(field, value);
    };
  }, []); // Remove setValue dependency to prevent circular deps

  const handleBlur = useCallback((field: keyof T) => {
    return () => {
      setTouched(prev => ({ ...prev, [field]: true }));

      if (optionsRef.current.validateOnBlur) {
        const error = validateField(field, valuesRef.current[field]);
        if (error) {
          setErrorsState(prev => ({ ...prev, [field]: error }));
        } else {
          setErrorsState(prev => {
            const newErrors = { ...prev };
            delete newErrors[field as string];
            return newErrors;
          });
        }
      }
    };
  }, []); // Remove validateField dependency to prevent circular deps

  const validate = useCallback((): boolean => {
    const validationErrors = validateAll();
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, []); // Remove dependencies to prevent circular deps

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Validate all fields using current values
      const validationErrors = validateAll();
      setErrors(validationErrors);
      const isValid = Object.keys(validationErrors).length === 0;
      
      if (!isValid) {
        optionsRef.current.onError?.(validationErrors);
        return;
      }

      // Call onSubmit if provided
      await optionsRef.current.onSubmit?.(valuesRef.current);
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      setError('general' as keyof T, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, []); // Remove all dependencies to prevent circular deps

  const reset = useCallback(() => {
    setValuesState(initialValuesRef.current);
    setErrorsState({});
    setTouched({});
    setIsSubmitting(false);
  }, []); // Remove initialValues dependency to prevent circular deps

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setValues,
    setError,
    setErrors,
    clearError,
    clearErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validate
  };
}

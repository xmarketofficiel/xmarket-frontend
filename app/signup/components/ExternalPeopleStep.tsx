'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../../lib/apiEndpoints';

// Import request access component
import { RequestAccessStep } from './RequestAccessStep';

// Constants and Types
import { SIGNUP_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import { motion } from 'framer-motion';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';
import type { RequestAccessData } from '../types';

interface ExternalPeopleStepProps {
  onBack: () => void;
  onRequestSubmitted?: (submitted: boolean) => void;
}

export function ExternalPeopleStep({ onBack, onRequestSubmitted }: ExternalPeopleStepProps) {
  const router = useRouter();

  const [requestData, setRequestData] = useState<RequestAccessData>({
    firstName: '',
    lastName: '',
    department: '',
    role: 'student',
    address: '',
    email: '',
    whatsappNumber: '',
    reason: '',
    fullName: '' // Legacy field
  });

  const [state, setState] = useState({
    isLoading: false,
    message: '',
    messageType: 'error' as 'success' | 'error',
    focusedField: '',
    requestSubmitted: false
  });

  // Update state helper
  const updateState = (updates: any) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Validate phone number format
  const isValidPhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    if (cleanPhone.startsWith('06') || cleanPhone.startsWith('07')) {
      return cleanPhone.length === 10;
    }
    
    if (cleanPhone.startsWith('+212')) {
      const afterCode = cleanPhone.substring(4);
      return afterCode.length === 9;
    }
    
    return false;
  };

  // Get error message
  const getErrorMessage = (error: any): string => {
    const errorMessage = error?.message || '';
    
    if (errorMessage.includes('Invalid email format')) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }
    if (errorMessage.includes('Cette adresse email est déjà enregistrée') || 
        errorMessage.includes('already registered') || 
        errorMessage.includes('déjà enregistrée')) {
      return ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
    }
    if (errorMessage.includes('Network Error') || errorMessage.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    return ERROR_MESSAGES.GENERIC_ERROR;
  };

  // Handle access request submission
  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateState({ isLoading: true, message: '', messageType: 'error' });

    const { email, firstName, lastName, department, role, address, whatsappNumber } = requestData;
    
    if (!email) {
      updateState({ message: ERROR_MESSAGES.EMAIL_REQUIRED, isLoading: false });
      return;
    }
    
    if (!SIGNUP_CONFIG.EMAIL_REGEX.test(email)) {
      updateState({ message: ERROR_MESSAGES.INVALID_EMAIL, isLoading: false });
      return;
    }
    
    if (!firstName) {
      updateState({ message: 'First name is required', isLoading: false });
      return;
    }
    
    if (!lastName) {
      updateState({ message: 'Last name is required', isLoading: false });
      return;
    }
    
    if (!department) {
      updateState({ message: 'Department is required', isLoading: false });
      return;
    }
    
    if (!address) {
      updateState({ message: 'Address is required', isLoading: false });
      return;
    }
    
    if (!whatsappNumber) {
      updateState({ message: ERROR_MESSAGES.PHONE_REQUIRED, isLoading: false });
      return;
    }
    
    if (!isValidPhoneNumber(whatsappNumber)) {
      updateState({ message: ERROR_MESSAGES.PHONE_INVALID, isLoading: false });
      return;
    }

    try {
      await api.joinRequests.create({
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        whatsappNumber,
        reason: `Department: ${department}, Role: ${role}, Address: ${address}`
      });

      updateState({
        message: SUCCESS_MESSAGES.REQUEST_SUBMITTED,
        messageType: 'success',
        requestSubmitted: true
      });

      // Notify parent component
      onRequestSubmitted?.(true);

      // Redirect after a delay to let user see success message
      setTimeout(() => {
        router.push('/landing');
      }, SIGNUP_CONFIG.REDIRECT_DELAY);

    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      updateState({ message: errorMessage });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const updateRequestData = (updates: Partial<RequestAccessData>) => {
    setRequestData(prev => ({ ...prev, ...updates }));
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
    >

      {/* Request Access Step */}
      <RequestAccessStep
        requestData={requestData}
        isLoading={state.isLoading}
        message={state.message}
        messageType={state.messageType}
        focusedField={state.focusedField}
        onSubmit={handleRequestAccess}
        onFieldFocus={(field: string) => updateState({ focusedField: field })}
        onFieldBlur={() => updateState({ focusedField: '' })}
        onUpdateRequestData={updateRequestData}
        onSwitchToSignup={() => {}}
      />
    </motion.div>
  );
}

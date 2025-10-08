'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ApiErrorBoundary } from '../../../components/ApiErrorBoundary';

// Components
import { AnimatedBackground } from '../components/AnimatedBackground';
import { BrandingPanel } from '../components/BrandingPanel';
import { StepHeader } from '../components/StepHeader';
import { Student1337Step } from '../components/Student1337Step';
import { CompleteStep } from '../components/CompleteStep';

// Types
import { SignupFormData } from '../types';

// Constants
import { STEP_CONFIG } from '../constants';

/**
 * 1337 Student Signup Page
 */
export default function Student1337SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'form' | 'complete'>('form');
  const [completedFormData, setCompletedFormData] = useState<SignupFormData | null>(null);

  const handleBack = () => {
    if (currentStep === 'complete') {
      setCurrentStep('form');
    } else {
      router.push('/signup');
    }
  };

  const handleNext = (formData: SignupFormData) => {
    setCompletedFormData(formData);
    setCurrentStep('complete');
  };

  const config = STEP_CONFIG["1337_STUDENT"];

  return (
    <ApiErrorBoundary>
      <div className="flex">
        {/* Animated Background */}
        <AnimatedBackground floatingElements={[]} />
        
        {/* Left Panel - Branding */}
        <BrandingPanel currentStep="1337-student" signupMode="signup" />
      <div className="flex flex-col p-6 lg:p-12 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
            {/* Back Button */}
            <motion.button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-[#009F9C] transition-colors duration-200 group mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut" 
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to selection
            </motion.button>

        
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="w-full max-w-md">
            {/* Header */}
            <StepHeader
              step={currentStep === 'form' ? '1337-student' : 'complete'}
              signupMode="signup"
            />
            
            {/* Conditional Step Rendering */}
            {currentStep === 'form' ? (
              <Student1337Step 
                onBack={handleBack} 
                onNext={handleNext}
              />
            ) : completedFormData ? (
              <CompleteStep formData={completedFormData} />
            ) : null}
          </div>
        </div>
      </div>
      </div>
    </ApiErrorBoundary>
  );
}

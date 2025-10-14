'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ApiErrorBoundary } from '../../../components/ApiErrorBoundary';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { BrandingPanel } from '../components/BrandingPanel';
import { StepHeader } from '../components/StepHeader';
import { Student1337Step } from '../components/Student1337Step';
import { CompleteStep } from '../components/CompleteStep';
import { SignupFormData, FloatingElement } from '../types';
import { SIGNUP_CONFIG } from '../constants';

/**
 * 1337 Student Signup Page
 */
export default function Student1337SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'form' | 'complete'>('form');
  const [completedFormData, setCompletedFormData] = useState<SignupFormData | null>(null);
  
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

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

  /**
   * Initialize floating elements animation
   */
  useEffect(() => {
    const elements = Array.from({ length: SIGNUP_CONFIG.FLOATING_ELEMENTS_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      delay: Math.random() * 5,
      size: Math.random() * 20 + 15
    }));
    setFloatingElements(elements);
  }, []);

  return (
    <ApiErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <AnimatedBackground floatingElements={floatingElements} />
        
        <div className="relative z-10 min-h-screen flex">
          {/* Hide branding panel on mobile, show only on desktop */}
          <BrandingPanel 
            currentStep={currentStep === 'form' ? '1337-student' : 'complete'} 
            signupMode="signup"
          />
          
          {/* Main Content Panel - Full width on mobile */}
          <div className="w-full lg:w-1/2 lg:ml-auto flex justify-center p-4 lg:p-6">
            <div className="w-full max-w-sm lg:max-w-md">
              <div className="relative">
                {/* Back to Home Button - Mobile optimized */}
                <button
                  onClick={handleBack}
                  className="flex items-center text-gray-600 hover:text-[#009F9C] transition-colors duration-200 mb-6 group self-start touch-manipulation"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                  <span className="font-medium">
                    {currentStep === 'complete' ? 'Back to Form' : 'Back to Selection'}
                  </span>
                </button>

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
      </div>
    </ApiErrorBoundary>
  );
}

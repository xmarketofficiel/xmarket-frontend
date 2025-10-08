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
import { ExternalPeopleStep } from '../components/ExternalPeopleStep';

/**
 * External People (Request Access) Signup Page
 */
export default function ExternalSignupPage() {
  const router = useRouter();
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleBack = () => {
    router.push('/signup');
  };

  const handleRequestSubmitted = (submitted: boolean) => {
    setRequestSubmitted(submitted);
  };

  return (
    <ApiErrorBoundary>
      <div className="flex flex-col p-6 lg:p-12 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        {/* Animated Background */}
        <AnimatedBackground floatingElements={[]} />
        
        {/* Left Panel - Branding */}
        <BrandingPanel currentStep="request-access" signupMode="request-access" />
          {/* Back Button */}
            {!requestSubmitted && (
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
            )}

        {/* Right Panel - Request Access Form */}
        <div className="flex-1 flex justify-center relative z-10">
          <div className="w-full max-w-md">
            {/* Header */}
            <StepHeader
              step="request-access"
              signupMode="request-access"
            />
            
            {/* External People Component */}
            <ExternalPeopleStep onBack={handleBack} onRequestSubmitted={handleRequestSubmitted} />
          </div>
        </div>
      </div>
    </ApiErrorBoundary>
  );
}

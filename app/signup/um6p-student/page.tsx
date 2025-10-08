'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ApiErrorBoundary } from '../../../components/ApiErrorBoundary';

// Components
import { AnimatedBackground } from '../components/AnimatedBackground';
import { BrandingPanel } from '../components/BrandingPanel';
import { StepHeader } from '../components/StepHeader';
import { UM6PStudentStep } from '../components/UM6PStudentStep';

/**
 * UM6P Student Signup Page
 */
export default function UM6PStudentSignupPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/signup');
  };

  return (
    <ApiErrorBoundary>
      <div className="flex flex-col p-6 lg:p-12 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        {/* Animated Background */}
        <AnimatedBackground floatingElements={[]} />
        
        {/* Left Panel - Branding */}
        <BrandingPanel currentStep="email" signupMode="signup" />
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

        {/* Right Panel - Signup Form */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="w-full max-w-md">

            {/* Header */}
            <StepHeader
              step="email"
              signupMode="signup"
            />
            
            {/* UM6P Student Component */}
            <UM6PStudentStep onBack={handleBack} />
          </div>
        </div>
      </div>
    </ApiErrorBoundary>
  );
}

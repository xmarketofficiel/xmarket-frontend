import { motion } from 'framer-motion';
import { ShoppingBag, Users, Shield, Zap } from 'lucide-react';
import { BRAND_FEATURES, ANIMATION_VARIANTS } from '../constants';
import type { BrandingPanelProps } from '../types';

/**
 * Branding Panel Component
 * Left side panel with brand messaging and features
 */
export function BrandingPanel({ currentStep, signupMode }: BrandingPanelProps) {
  const isRequestAccess = signupMode === 'request-access';
  const features = BRAND_FEATURES.FEATURES;
  const iconMap = {
    0: Users,
    1: Shield,
    2: Zap,
    3: ShoppingBag
  };

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#009F9C] to-[#00B8B5] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 w-full flex flex-col justify-center items-center text-white p-12 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Main messaging */}
        <motion.div
          {...ANIMATION_VARIANTS.fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 max-w-lg mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {isRequestAccess ? BRAND_FEATURES.REQUEST_ACCESS.TITLE : BRAND_FEATURES.MAIN_TITLE}
          </h1>
          <p className="text-xl text-white/90 max-w-md">
            {isRequestAccess ? BRAND_FEATURES.REQUEST_ACCESS.SUBTITLE : BRAND_FEATURES.SUBTITLE}
          </p>
          {isRequestAccess && (
            <p className="text-white/80 mt-4 max-w-md">
              {BRAND_FEATURES.REQUEST_ACCESS.DESCRIPTION}
            </p>
          )}
        </motion.div>

        {/* Features list */}
        {!isRequestAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 max-w-sm"
          >
            {features.map((feature, index) => {
              const IconComponent = iconMap[index as keyof typeof iconMap] || ShoppingBag;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-white/80">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Progress indicator for multi-step signup */}
        {signupMode === 'signup' && currentStep !== 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <div className="flex items-center space-x-2">
              {['email', 'otp', 'details'].map((step, index) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    ['email', 'otp', 'details'].indexOf(currentStep) >= index
                      ? 'bg-white'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-white/70 text-sm mt-2">
              Step {['email', 'otp', 'details'].indexOf(currentStep) + 1} of 3
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { ShoppingBag, Shield, Heart, Sparkles } from 'lucide-react';

/**
 * Left branding panel with animated features
 */
export function BrandingPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <div className="w-full h-full bg-gradient-to-br from-[#009F9C] to-[#007B78] flex items-center justify-center p-12 relative">
        {/* Background Pattern */}
        <BackgroundPattern />
        
        <div className="relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BrandLogo />
            <BrandHeading />
            <BrandFeatures />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * Decorative background pattern
 */
function BackgroundPattern() {
  return (
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full" />
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full" />
      <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white rounded-full" />
    </div>
  );
}

/**
 * Brand logo component
 */
function BrandLogo() {
  return (
    <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8">
      <ShoppingBag className="w-12 h-12 text-white" />
    </div>
  );
}

/**
 * Brand heading and description
 */
function BrandHeading() {
  return (
    <>
      <h2 className="text-4xl font-bold mb-6">Welcome to XMarket</h2>
      <p className="text-xl text-teal-100 mb-8 leading-relaxed">
        Your campus marketplace for students and staff to buy and sell items.
      </p>
    </>
  );
}

/**
 * Feature list with icons
 */
function BrandFeatures() {
  const features = [
    { Icon: Shield, text: 'University verified community' },
    { Icon: Heart, text: 'Trusted by thousands of students' },
    { Icon: Sparkles, text: 'Smart interest matching' }
  ];

  return (
    <div className="space-y-4 text-left max-w-sm mx-auto">
      {features.map(({ Icon, text }) => (
        <div key={text} className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-cyan-300" />
          <span className="text-teal-100">{text}</span>
        </div>
      ))}
    </div>
  );
}

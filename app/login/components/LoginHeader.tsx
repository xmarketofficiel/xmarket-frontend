import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface LoginHeaderProps {
  showMobileLogo?: boolean;
}

/**
 * Login form header with logo and title
 */
export function LoginHeader({ showMobileLogo = true }: LoginHeaderProps) {
  return (
    <motion.div 
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {showMobileLogo && (
        <div className="lg:hidden inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#009F9C] to-[#40E0D0] rounded-2xl mb-6 shadow-lg">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
      <p className="text-gray-600">Welcome back to your campus marketplace</p>
    </motion.div>
  );
}

import { ShoppingBag } from 'lucide-react';

interface LoginHeaderProps {
  showMobileLogo?: boolean;
}

/**
 * Login form header with logo and title (static, no animations for better performance)
 */
export function LoginHeader({ showMobileLogo = true }: LoginHeaderProps) {
  return (
    <div className="text-center mb-4 sm:mb-8">
      {showMobileLogo && (
        <div className="lg:hidden inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#009F9C] to-[#40E0D0] rounded-2xl mb-3 sm:mb-6 shadow-lg">
          <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
      <p className="text-sm sm:text-base text-gray-600 px-2">Welcome back to your campus marketplace</p>
    </div>
  );
}

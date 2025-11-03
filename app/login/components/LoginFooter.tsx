import Link from 'next/link';
import { User, ArrowRight } from 'lucide-react';

/**
 * Footer section with signup link (static for better mobile performance)
 */
export function LoginFooter() {
  return (
    <div className="mt-4 sm:mt-8 space-y-4">
      <SignupLink />
    </div>
  );
}

/**
 * Link to signup page (simplified, static for performance)
 */
function SignupLink() {
  return (
    <div className="text-center">
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
        Don't have an account?
      </p>
      <Link href="/signup">
        <div className="design-card inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3 border-2 border-[#009F9C] text-[#009F9C] rounded-xl font-semibold hover:bg-[#009F9C] hover:text-white active:bg-[#007B78] hover:shadow-lg active:shadow-md transition-all duration-300 group min-h-[48px] sm:min-h-[52px] touch-manipulation text-sm sm:text-base">
          <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Create New Account
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </Link>
    </div>
  );
}



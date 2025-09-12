import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, ArrowRight, AlertCircle } from 'lucide-react';
import { LOGIN_CONFIG } from '../constants';

/**
 * Footer section with signup link and test account info
 */
export function LoginFooter() {
  return (
    <motion.div
      className="mt-8 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <SignupLink />
      <TestAccountInfo />
    </motion.div>
  );
}

/**
 * Link to signup page
 */
function SignupLink() {
  return (
    <div className="text-center">
      <p className="text-gray-600 mb-4">Don't have an account?</p>
      <Link href="/signup">
        <motion.div
          className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#009F9C] text-[#009F9C] rounded-xl font-semibold hover:bg-[#009F9C] hover:text-white transition-all duration-300 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <User className="w-5 h-5 mr-2" />
          Create New Account
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.div>
      </Link>
    </div>
  );
}

/**
 * Test account information panel
 */
function TestAccountInfo() {
  return (
    <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-xl p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Test Account</h4>
          <p className="text-xs text-gray-600 mb-2">Pre-filled credentials for testing:</p>
          <div className="text-xs text-gray-700 space-y-1">
            <div><strong>Email:</strong> {LOGIN_CONFIG.DEFAULT_EMAIL}</div>
            <div><strong>Password:</strong> {LOGIN_CONFIG.DEFAULT_PASSWORD}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

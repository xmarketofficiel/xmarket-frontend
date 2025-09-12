import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import type { InputFieldProps } from '../types';

/**
 * Reusable Input Field Component
 * Handles various input types with consistent styling and animations
 */
export function InputField({
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  label,
  required = false,
  focused = false,
  showPassword,
  onTogglePassword,
  icon,
  maxLength
}: InputFieldProps) {
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {/* Input field */}
        <input
          type={actualType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 
            bg-white/50 backdrop-blur-sm placeholder-gray-400
            ${icon ? 'pl-12' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            ${focused 
              ? 'border-[#009F9C] shadow-lg shadow-[#009F9C]/20 bg-white/80' 
              : 'border-gray-200 hover:border-gray-300'
            }
            focus:outline-none focus:border-[#009F9C] focus:shadow-lg focus:shadow-[#009F9C]/20 focus:bg-white/80
          `}
          required={required}
        />
        
        {/* Password toggle button */}
        {isPassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      
      {/* Character count for limited inputs */}
      {maxLength && value.length > 0 && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </motion.div>
  );
}

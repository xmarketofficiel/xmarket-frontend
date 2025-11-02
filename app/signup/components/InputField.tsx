import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import type { InputFieldProps } from '../types';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';

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
  maxLength,
  error,
  isValid,
  disabled = false
}: InputFieldProps) {
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: 'easeOut'
      }}
    >
      <label className="block text-sm font-semibold text-gray-800 mb-2.5 px-1 tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative group">
        {/* Icon */}
        {icon && (
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all z-10 pointer-events-none ${
            disabled 
              ? 'text-gray-300' 
              : focused 
                ? 'text-[#009F9C] scale-110' 
                : error 
                  ? 'text-red-400'
                  : 'text-gray-500'
          }`}
               style={{ 
                 transitionDuration: ANIMATION_SYSTEM.duration.normal + 'ms',
                 transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
               }}>
            {icon}
          </div>
        )}
        
        {/* Input field */}
        <input
          type={actualType}
          value={value}
          onChange={(e) => !disabled && onChange(e.target.value)}
          onFocus={!disabled ? onFocus : undefined}
          onBlur={!disabled ? onBlur : undefined}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`
            w-full px-4 py-4 sm:py-3.5 rounded-xl border-2 transition-all
            bg-white/80 backdrop-blur-sm placeholder-gray-400
            text-base sm:text-sm font-medium
            min-h-[3.5rem] sm:min-h-[3.25rem]
            ${icon ? 'pl-12' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            ${disabled 
              ? 'border-gray-200 bg-gray-50/90 text-gray-500 cursor-not-allowed'
              : error 
                ? 'border-red-400 shadow-lg shadow-red-400/20 bg-red-50/90' 
                : focused 
                  ? 'border-[#009F9C] shadow-lg shadow-[#009F9C]/20 bg-white/90' 
                  : isValid === true
                    ? 'border-green-400 bg-green-50/90'
                    : 'border-gray-200 hover:border-gray-300'
            }
            ${!disabled && 'focus:outline-none'} ${!disabled && (error 
              ? 'focus:border-red-400 focus:shadow-lg focus:shadow-red-400/20' 
              : 'focus:border-[#009F9C] focus:shadow-lg focus:shadow-[#009F9C]/20'
            )} ${!disabled && 'focus:bg-white/90'}
            touch-manipulation
          `}
          style={{ 
            transitionDuration: ANIMATION_SYSTEM.duration.normal + 'ms',
            transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
          }}
          required={required && !disabled}
          autoComplete={type === 'email' ? 'email' : type === 'password' ? 'current-password' : 'off'}
          inputMode={type === 'email' ? 'email' : 'text'}
        />
        
        {/* Password toggle button */}
        {isPassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            disabled={disabled}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-[#009F9C]/20 rounded-md p-1 transition-all z-10 ${
              disabled 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ 
              transitionDuration: ANIMATION_SYSTEM.duration.normal + 'ms',
              transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
            }}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-red-600 mt-1 flex items-center space-x-1"
        >
          <span>⚠️</span>
          <span>{error}</span>
        </motion.div>
      )}
      
      {/* Character count for limited inputs */}
      {maxLength && value.length > 0 && !error && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </motion.div>
  );
}

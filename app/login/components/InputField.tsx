import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface InputFieldProps {
  type: 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  placeholder: string;
  label: string;
  required?: boolean;
}

/**
 * Animated input field with icon and focus states
 */
export function InputField({
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  focused,
  showPassword,
  onTogglePassword,
  placeholder,
  label,
  required = true
}: InputFieldProps) {
  const Icon = type === 'email' ? Mail : Lock;
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative">
      <label htmlFor={type} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <motion.div
        className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
          focused ? 'ring-2 ring-[#009F9C] ring-opacity-50' : ''
        }`}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-4 focus-within:border-[#009F9C] focus-within:bg-white transition-all duration-300">
          <Icon className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type={inputType}
            id={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
            required={required}
          />
          {type === 'password' && onTogglePassword && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="ml-3 text-gray-400 hover:text-[#009F9C] transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { TextInputProps } from '../types';

export default function TextInput({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  helpText,
  type = 'text',
  placeholder,
  maxLength,
  min,
  max,
  step,
  className = ''
}: TextInputProps) {

  const inputId = `input-${name}`;
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${className}`}
    >
      {/* Label */}
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input */}
      <motion.input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006666] transition-colors ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-[#006666]'
        }`}
        aria-describedby={`${helpText ? helpId : ''} ${error ? errorId : ''}`.trim()}
        aria-invalid={!!error}
        whileFocus={{ scale: 1.01 }}
      />

      {/* Character count for text inputs */}
      {type === 'text' && maxLength && (
        <div className="flex justify-between items-center text-xs">
          <div /> {/* Spacer */}
          <span className={`${
            value.length > maxLength * 0.9 
              ? value.length >= maxLength ? 'text-red-500' : 'text-yellow-600'
              : 'text-gray-400'
          }`}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p id={helpId} className="text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-1 text-red-500"
        >
          <AlertCircle size={14} />
          <p id={errorId} className="text-sm" role="alert" aria-live="polite">
            {error}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

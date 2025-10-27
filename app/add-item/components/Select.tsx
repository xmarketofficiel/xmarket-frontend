'use client';

import { motion } from 'framer-motion';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { SelectProps } from '../types';

export default function Select({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  helpText,
  options,
  placeholder,
  className = ''
}: SelectProps) {

  const selectId = `select-${name}`;
  const helpId = `${selectId}-help`;
  const errorId = `${selectId}-error`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {/* Label */}
      <label 
        htmlFor={selectId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Select Container */}
      <div className="relative mt-2">
        <motion.select
          id={selectId}
          name={name}
          value={value}
          onChange={handleChange}
          className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006666] transition-colors appearance-none bg-white ${
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-[#006666]'
          }`}
          aria-describedby={`${helpText ? helpId : ''} ${error ? errorId : ''}`.trim()}
          aria-invalid={!!error}
          whileFocus={{ scale: 1.01 }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.icon && `${option.icon} `}{option.label}
            </option>
          ))}
        </motion.select>

        {/* Custom Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Options Preview for Category */}
      {name === 'category' && value && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          {(() => {
            const selectedOption = options.find(opt => opt.value === value);
            return selectedOption?.description ? (
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">
                  {selectedOption.icon} {selectedOption.label}
                </div>
                <div className="text-gray-600 text-xs">
                  {selectedOption.description}
                </div>
              </div>
            ) : null;
          })()}
        </motion.div>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p id={helpId} className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-1 text-red-500 mt-2"
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

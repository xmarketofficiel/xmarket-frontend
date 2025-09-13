'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ItemDetailsStepProps } from '../types';
import { CATEGORY_CONFIG, CONDITION_OPTIONS, FIELD_CONFIG, PRIVACY_CONFIG } from '../constants';
import TextInput from './TextInput';
import Textarea from './Textarea';
import Select from './Select';
import Toggle from './Toggle';

export default function ItemDetailsStep({
  data,
  onChange,
  errors,
  categories,
  isSubmitting,
  onSubmit,
  onBack,
  className = ''
}: ItemDetailsStepProps) {

  // Convert categories to select options
  const categoryOptions = categories.length > 0 
    ? categories.map(cat => ({
        value: cat.name,
        label: cat.name,
        icon: cat.icon,
        description: cat.description
      }))
    : Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
        value: key,
        label: key,
        icon: config.icon,
        description: config.description
      }));

  // Convert conditions to select options
  const conditionOptions = CONDITION_OPTIONS.map(condition => ({
    value: condition.value,
    label: condition.label,
    icon: condition.icon,
    description: condition.description
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // Debug: Log errors for troubleshooting
  console.log('Current errors:', errors);
  console.log('Error count:', Object.keys(errors).length);
  console.log('Form data:', data);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`space-y-6 ${className}`}
    >
      {/* Back to Photos Button */}
      <div className="flex items-center mb-4">
        <motion.button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back to photos"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </motion.button>
        <span className="ml-2 text-lg font-medium text-gray-700">Item Details</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <TextInput
          label="Title"
          name="title"
          value={data.title}
          onChange={(value) => onChange('title', value)}
          error={errors.title}
          required
          placeholder={FIELD_CONFIG.title.placeholder}
          helpText={FIELD_CONFIG.title.helpText}
          maxLength={FIELD_CONFIG.title.maxLength}
        />

        {/* Category */}
        <Select
          label="Category"
          name="category"
          value={data.category}
          onChange={(value) => onChange('category', value)}
          error={errors.category}
          required
          options={categoryOptions}
          helpText="Choose the category that best describes your item"
        />

        {/* Price and Quantity Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Price (DH)"
            name="price"
            type="number"
            value={data.price}
            onChange={(value) => onChange('price', value)}
            error={errors.price}
            required
            placeholder={FIELD_CONFIG.price.placeholder}
            helpText={FIELD_CONFIG.price.helpText}
            min={FIELD_CONFIG.price.min}
            max={FIELD_CONFIG.price.max}
            step={FIELD_CONFIG.price.step}
          />

          <TextInput
            label="Quantity"
            name="quantity"
            type="number"
            value={data.quantity}
            onChange={(value) => onChange('quantity', value)}
            error={errors.quantity}
            required
            placeholder={FIELD_CONFIG.quantity.placeholder}
            helpText={FIELD_CONFIG.quantity.helpText}
            min={FIELD_CONFIG.quantity.min}
            max={FIELD_CONFIG.quantity.max}
            step={FIELD_CONFIG.quantity.step}
          />
        </div>

        {/* Condition */}
        <Select
          label="Condition"
          name="condition"
          value={data.condition}
          onChange={(value) => onChange('condition', value)}
          error={errors.condition}
          required
          options={conditionOptions}
          helpText="Honestly describe the condition of your item"
        />

        {/* Description */}
        <Textarea
          label="Description"
          name="description"
          value={data.description}
          onChange={(value) => onChange('description', value)}
          error={errors.description}
          required
          placeholder={FIELD_CONFIG.description.placeholder}
          helpText={FIELD_CONFIG.description.helpText}
          rows={FIELD_CONFIG.description.rows}
          maxLength={FIELD_CONFIG.description.maxLength}
        />

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
          
          <Toggle
            label={PRIVACY_CONFIG.showIdentity.title}
            name="showIdentity"
            value={data.showIdentity}
            onChange={(value) => onChange('showIdentity', value)}
            description={PRIVACY_CONFIG.showIdentity.description}
          />

          {data.allowMessages !== undefined && (
            <Toggle
              label={PRIVACY_CONFIG.allowMessages.title}
              name="allowMessages"
              value={data.allowMessages}
              onChange={(value) => onChange('allowMessages', value)}
              description={PRIVACY_CONFIG.allowMessages.description}
            />
          )}
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 mt-0.5">💡</div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Tips for a great listing</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Write a clear, descriptive title</li>
                <li>• Include all relevant details in the description</li>
                <li>• Be honest about the condition</li>
                <li>• Set a fair, competitive price</li>
                <li>• Choose the most accurate category</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Form Validation Summary */}
        {Object.keys(errors).filter(key => errors[key as keyof typeof errors]).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="text-red-500 mt-0.5">⚠️</div>
              <div>
                <h4 className="font-medium text-red-900 mb-2">Please fix the following errors:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.entries(errors)
                    .filter(([field, error]) => error) // Only show non-empty errors
                    .map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).filter(key => errors[key as keyof typeof errors]).length > 0}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
            isSubmitting || Object.keys(errors).filter(key => errors[key as keyof typeof errors]).length > 0
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-[#006666] text-white hover:bg-[#005555] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
          whileHover={!isSubmitting && Object.keys(errors).filter(key => errors[key as keyof typeof errors]).length === 0 ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting && Object.keys(errors).filter(key => errors[key as keyof typeof errors]).length === 0 ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Posting Item...</span>
            </>
          ) : (
            <>
              <span>🎉</span>
              <span>Post Item</span>
            </>
          )}
        </motion.button>

        {/* Legal Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xs text-gray-500">
            By posting this item, you agree to our{' '}
            <a href="/terms" className="text-[#006666] hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-[#006666] hover:underline">Privacy Policy</a>
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
}

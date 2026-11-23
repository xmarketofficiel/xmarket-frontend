'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Calendar, Zap, ChevronDown } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { servicesApi, type ServiceCategory } from '../../../lib/api/services';
import CustomDatePicker from './CustomDatePicker';
import CustomTimePicker from './CustomTimePicker';
import LocationAutocomplete from './LocationAutocomplete';

interface AddServiceFormProps {
  onBack: () => void;
}

export default function AddServiceForm({ onBack }: AddServiceFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    serviceCategoryId: '',
    price: '',
    type: 'time-based' as 'time-based' | 'ongoing',
    description: '',
    location: '',
    fromLocation: '',
    toLocation: '',
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const departureTimeRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Fetch service categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await servicesApi.getServiceCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to load service categories:', error);
        addToast('Failed to load service categories', 'error');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [addToast]);

  // Scroll to top when form mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-show time picker when date is selected
  useEffect(() => {
    if (selectedDate && !selectedTime) {
      setShowTimePicker(true);
      setTimeout(() => {
        timePickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [selectedDate, selectedTime]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Service name is required';
    }

    if (!formData.serviceCategoryId) {
      newErrors.serviceCategoryId = 'Please select a category';
    }
    if (formData.price === '' || parseFloat(formData.price) < 0) {
      newErrors.price = 'Please enter a valid price';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.type === 'time-based' && (!selectedDate || !selectedTime)) {
      newErrors.departureTime = 'Departure date and time are required for time-based services';
    }
    
    // Validate From/To fields for Covoiturage
    if (formData.serviceCategoryId === 'covoiturage') {
      if (!formData.fromLocation.trim()) {
        newErrors.fromLocation = 'From location is required for Covoiturage';
      }
      if (!formData.toLocation.trim()) {
        newErrors.toLocation = 'To location is required for Covoiturage';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine date and time
      let departureTime = null;
      if (formData.type === 'time-based' && selectedDate && selectedTime) {
        departureTime = new Date(selectedDate);
        departureTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      }

      const serviceData: any = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        serviceCategoryId: formData.serviceCategoryId,
        type: formData.type,
      };

      // Only add optional fields if they have values
      if (departureTime) {
        serviceData.departureTime = departureTime.toISOString();
      }
      if (formData.location && formData.location.trim()) {
        serviceData.location = formData.location.trim();
      }
      
      // Add From/To locations for Covoiturage
      if (formData.serviceCategoryId === 'covoiturage') {
        serviceData.fromLocation = formData.fromLocation.trim();
        serviceData.toLocation = formData.toLocation.trim();
      }

      console.log('📤 Submitting service:', serviceData);
      
      const response = await servicesApi.createService(serviceData);
      
      addToast('Service created successfully!', 'success');
      // Redirect to marketplace with services mode and the category UUID from response
      const createdService = response.data;
      router.push(`/marketplace?mode=services&category=${createdService.serviceCategoryId}`);
    } catch (error) {
      console.error('Error creating service:', error);
      addToast('Failed to create service. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2 md:px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-4 px-2 md:px-0">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to selection</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-4 md:p-8 space-y-6 w-full">
          {/* Service Name */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Service Name *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Laundry Service"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <div className="relative">
              <select
                id="serviceCategoryId"
                name="serviceCategoryId"
                value={formData.serviceCategoryId}
                onChange={handleChange}
                disabled={loadingCategories}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors appearance-none bg-white cursor-pointer ${
                  errors.serviceCategoryId
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                } ${loadingCategories ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">{loadingCategories ? 'Loading categories...' : 'Select a category'}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.icon || '🔧'} {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.serviceCategoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceCategoryId}</p>
            )}
          </div>

          {/* From/To Fields - Only for Covoiturage */}
          {formData.serviceCategoryId === 'covoiturage' && (
            <div className="transition-all duration-500 ease-in-out">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideDown">
                {/* From Location */}
                <LocationAutocomplete
                  id="fromLocation"
                  name="fromLocation"
                  value={formData.fromLocation}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, fromLocation: value }));
                    if (errors.fromLocation) {
                      setErrors(prev => ({ ...prev, fromLocation: '' }));
                    }
                  }}
                  placeholder="e.g., Casablanca"
                  label="From"
                  error={errors.fromLocation}
                  required
                />

                {/* To Location */}
                <LocationAutocomplete
                  id="toLocation"
                  name="toLocation"
                  value={formData.toLocation}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, toLocation: value }));
                    if (errors.toLocation) {
                      setErrors(prev => ({ ...prev, toLocation: '' }));
                    }
                  }}
                  placeholder="e.g., Rabat"
                  label="To"
                  error={errors.toLocation}
                  required
                />
              </div>
            </div>
          )}

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
              Price (DH) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 50"
              min="0"
              step="0.01"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                errors.price
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">
              Service Type *
            </label>
            
            {/* Mobile: Dropdown Select */}
            <div className="md:hidden relative">
              <select
                id="serviceType"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors appearance-none bg-white cursor-pointer border-gray-200 focus:border-blue-500 focus:ring-blue-200"
              >
                <option value="time-based">⏰ Temporary</option>
                <option value="ongoing">⚡ Permanent</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Desktop: Button Grid */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'ongoing' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'ongoing'
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Ongoing</div>
                    <div className="text-xs text-gray-600">Always available</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'time-based' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'time-based'
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Time-Based</div>
                    <div className="text-xs text-gray-600">Specific time</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Departure Date & Time (only for time-based) */}
          {formData.type === 'time-based' && (
            <div ref={departureTimeRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Departure Date & Time *
              </label>
              
              {/* Split Layout - Desktop: side-by-side, Mobile: stacked */}
              <div className="flex flex-col md:flex-row gap-3">
                {/* Date Picker - Desktop: Animates to 50%, Mobile: Full width */}
                <div className={`transition-all duration-300 w-full ${selectedDate ? 'md:w-1/2' : 'md:w-full'}`}>
                  <CustomDatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    minDate={new Date()}
                  />
                </div>

                {/* Time Picker - Desktop: Appears beside, Mobile: Below */}
                {selectedDate && (
                  <div ref={timePickerRef} className="w-full md:w-1/2">
                    <CustomTimePicker
                      value={selectedTime}
                      onChange={setSelectedTime}
                      autoOpen={!selectedTime}
                      selectedDate={selectedDate}
                    />
                  </div>
                )}
              </div>

              {errors.departureTime && (
                <p className="mt-2 text-sm text-red-600">{errors.departureTime}</p>
              )}
              
              {selectedDate && selectedTime && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                  <p className="text-sm text-blue-900 font-medium">
                    📅 Service scheduled for: {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {selectedTime.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    ⏰ This service will automatically expire 30 minutes after the departure time
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your service in detail..."
              rows={5}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors resize-none ${
                errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#009F9C] text-white rounded-xl font-semibold hover:bg-[#007A77] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 flex-shrink-0" />
                  <span>Create Service</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

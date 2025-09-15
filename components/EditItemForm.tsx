'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/apiEndpoints';
import { useToast } from '../contexts/ToastContext';
import { useUser } from '../contexts/UserContext';
import ImageUpload from './ImageUpload';
import ConfirmedPurchaseInfoModal from './ConfirmedPurchaseInfoModal';

interface EditItemFormProps {
  itemId: string;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  quantity: string;
  category: string;
  condition: string;
  showIdentity: boolean;
  photos: File[];
}

export default function EditItemForm({ itemId }: EditItemFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Warning modal state
  const [showPurchaseWarning, setShowPurchaseWarning] = useState(false);
  const [warningData, setWarningData] = useState<{
    field: 'price' | 'title' | 'quantity';
    newValue: number | string;
    confirmedBuyers: number;
  } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    condition: 'Good',
    showIdentity: true,
    photos: []
  });

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load item data and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load categories first
        try {
          const categoriesResponse = await api.items.getCategories();
          setCategories(categoriesResponse.data || []);
        } catch (error) {
          console.error('Failed to load categories:', error);
          setCategories([
            { name: 'Electronics', icon: '📱' },
            { name: 'Books', icon: '📚' },
            { name: 'Furniture', icon: '🪑' },
            { name: 'Clothing', icon: '👕' },
            { name: 'Sports', icon: '⚽' },
            { name: 'Other', icon: '🔖' }
          ]);
        }

        // Load item data
        const itemResponse = await api.items.getItem(itemId);
        const itemData = itemResponse.data;
        
        // Check ownership
        if (user && String(itemData.sellerId) !== String(user.id) && String(itemData.seller?.id) !== String(user.id)) {
          addToast('You can only edit your own items', 'error');
          router.push('/profile');
          return;
        }

        setItem(itemData);
        setOriginalData(itemData);
        
        // Populate form with current data
        setFormData({
          title: itemData.title || '',
          description: itemData.description || '',
          price: String(itemData.price) || '',
          quantity: String(itemData.quantity || 1),
          category: typeof itemData.category === 'object' ? itemData.category.name : itemData.category || '',
          condition: itemData.condition || 'Good',
          showIdentity: !itemData.anonymous,
          photos: []
        });
        
      } catch (error) {
        console.error('Failed to load item:', error);
        addToast('Failed to load item data', 'error');
        router.push('/profile');
      } finally {
        setLoading(false);
      }
    };

    if (itemId && user) {
      loadData();
    }
  }, [itemId, user]);

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | boolean | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Valid price is required';
    } else if (price > 100000) {
      newErrors.price = 'Price cannot exceed 100,000 DH';
    }

    const quantity = parseInt(formData.quantity);
    if (!formData.quantity || isNaN(quantity) || quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    } else if (quantity > 1000) {
      newErrors.quantity = 'Quantity cannot exceed 1000';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.condition.trim()) {
      newErrors.condition = 'Condition is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form to original values
  const resetForm = () => {
    if (originalData) {
      setFormData({
        title: originalData.title || '',
        description: originalData.description || '',
        price: String(originalData.price) || '',
        quantity: String(originalData.quantity || 1),
        category: typeof originalData.category === 'object' ? originalData.category.name : originalData.category || '',
        condition: originalData.condition || 'Good',
        showIdentity: !originalData.anonymous,
        photos: []
      });
      setErrors({});
      addToast('Reset to original values', 'info');
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('Please fix the errors below', 'error');
      return;
    }

    try {
      setSubmitting(true);

      // Prepare update data - only include changed fields
      const updateData: any = {};
      
      if (formData.title !== originalData?.title) {
        updateData.title = formData.title.trim();
      }
      if (formData.description !== originalData?.description) {
        updateData.description = formData.description.trim();
      }
      if (parseFloat(formData.price) !== originalData?.price) {
        updateData.price = parseFloat(formData.price);
      }
      if (parseInt(formData.quantity) !== originalData?.quantity) {
        updateData.quantity = parseInt(formData.quantity);
      }
      if (formData.category !== (typeof originalData?.category === 'object' ? originalData.category.name : originalData?.category)) {
        updateData.category = formData.category;
      }
      if (formData.condition !== originalData?.condition) {
        updateData.condition = formData.condition;
      }
      if (formData.showIdentity === originalData?.anonymous) {
        updateData.anonymous = !formData.showIdentity;
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0 || formData.photos.length > 0) {
        // Update item data if there are changes
        if (Object.keys(updateData).length > 0) {
          const response = await api.items.updateItem(itemId, updateData);
          
          // Check for warning information in the response
          if (response.data && typeof response.data === 'object' && 'hasConfirmedPurchases' in response.data) {
            const result = response.data as any;
            
            if (result.hasConfirmedPurchases && result.warning) {
              // Show warning modal instead of completing the update
              let field: 'price' | 'title' | 'quantity';
              let newValue: number | string;
              
              // Determine which field changed based on the update data
              if ('price' in updateData) {
                field = 'price';
                newValue = updateData.price;
              } else if ('title' in updateData) {
                field = 'title';
                newValue = updateData.title;
              } else if ('quantity' in updateData) {
                field = 'quantity';
                newValue = updateData.quantity;
              } else {
                // Default to price if we can't determine
                field = 'price';
                newValue = parseFloat(formData.price);
              }
              
              setWarningData({
                field,
                newValue,
                confirmedBuyers: result.warning.confirmedBuyers
              });
              setShowPurchaseWarning(true);
              return; // Don't proceed with success yet
            }
          }
        }

        // Upload new photos if any
        if (formData.photos.length > 0) {
          await api.items.uploadItemImages(itemId, formData.photos);
        }

        addToast('Item updated successfully!', 'success');
        router.push('/profile');
      } else {
        addToast('No changes detected', 'info');
      }
    } catch (error: any) {
      console.error('Error updating item:', error);
      if (error.response?.status === 403) {
        addToast('You can only edit your own items', 'error');
      } else if (error.response?.status === 400 && error.response?.data?.message) {
        // For validation errors (like pending purchases), show the message
        addToast(error.response.data.message, 'error');
      } else if (error.response?.data?.message) {
        addToast(error.response.data.message, 'error');
      } else {
        addToast('Failed to update item', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006666] mx-auto mb-2"></div>
          <p className="text-gray-600">Loading item data...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Item not found</h2>
          <p className="text-gray-600 mb-4">The item you're trying to edit could not be found.</p>
          <button
            onClick={() => router.push('/profile')}
            className="bg-[#006666] text-white px-6 py-2 rounded-lg hover:bg-[#005555] transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center z-10">
        <button
          onClick={() => router.push('/profile')}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="ml-3 text-xl font-semibold text-gray-900">Edit Item</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Current Item Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📝</span>
            Currently Editing: {item.title}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="font-medium text-gray-700">Current Price:</span>
              <div className="text-[#009F9C] font-semibold mt-1">{item.price} DH</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="font-medium text-gray-700">Category:</span>
              <div className="text-gray-900 mt-1">
                {typeof item.category === 'object' ? item.category.name : item.category}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="font-medium text-gray-700">Condition:</span>
              <div className="text-gray-900 mt-1">{item.condition}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="text-gray-900 mt-1">{item.quantity || 1} units</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009F9C] focus:border-[#009F9C] transition-colors ${
                errors.title ? 'border-red-500 ring-red-500' : 'border-gray-200'
              }`}
              placeholder="Enter item title..."
              maxLength={100}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500">{errors.title}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">5-100 characters</p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-3">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009F9C] focus:border-[#009F9C] transition-colors ${
                errors.description ? 'border-red-500 ring-red-500' : 'border-gray-200'
              }`}
              placeholder="Describe your item in detail..."
              maxLength={1000}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-500">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">20-1000 characters</p>
          </div>

          {/* Price and Quantity Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Price */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-3">
                Price (DH) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009F9C] focus:border-[#009F9C] transition-colors ${
                  errors.price ? 'border-red-500 ring-red-500' : 'border-gray-200'
                }`}
                placeholder="0.00"
                min="0"
                max="100000"
                step="0.01"
              />
              {errors.price && (
                <p className="mt-2 text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            {/* Quantity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label htmlFor="quantity" className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009F9C] focus:border-[#009F9C] transition-colors ${
                  errors.quantity ? 'border-red-500 ring-red-500' : 'border-gray-200'
                }`}
                placeholder="1"
                min="1"
                max="1000"
                step="1"
              />
              {errors.quantity && (
                <p className="mt-2 text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Category and Condition Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Category */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-3">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009F9C] focus:border-[#009F9C] transition-colors ${
                  errors.category ? 'border-red-500 ring-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat: any, index: number) => (
                  <option key={`${cat.name || cat}-${index}`} value={cat.name || cat}>
                    {cat.icon || '🔖'} {cat.name || cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Condition */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label htmlFor="condition" className="block text-sm font-semibold text-gray-900 mb-3">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                id="condition"
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009F9C] focus:border-[#009F9C] transition-colors ${
                  errors.condition ? 'border-red-500 ring-red-500' : 'border-gray-200'
                }`}
              >
                <option value="New">📦 New</option>
                <option value="Like New">✨ Like New</option>
                <option value="Good">👍 Good</option>
                <option value="Fair">👌 Fair</option>
              </select>
              {errors.condition && (
                <p className="mt-2 text-sm text-red-500">{errors.condition}</p>
              )}
            </div>
          </div>

        {/* Privacy Setting */}
                  {/* Privacy Setting */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Show my identity</h3>
                <p className="text-sm text-gray-600 mt-1">Let buyers see your name and verification status</p>
              </div>
              <button
                type="button"
                onClick={() => handleInputChange('showIdentity', !formData.showIdentity)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#009F9C] focus:ring-offset-2 ${
                  formData.showIdentity ? 'bg-[#009F9C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.showIdentity ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

        {/* Additional Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add New Photos (Optional)
          </label>
          <ImageUpload
            images={formData.photos}
            onImagesChange={(images) => handleInputChange('photos', images)}
            maxImages={6}
            maxFileSize={5}
            className="mb-2"
          />
          <p className="text-xs text-gray-500">
            Upload additional photos. Existing photos will be kept. Max 6 new photos, 5MB each.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-3 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              🔄 Reset
            </button>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="flex-1 py-3 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
              submitting 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-[#009F9C] text-white hover:bg-[#007A77]'
            }`}
          >
            {submitting ? '💾 Updating...' : '💾 Update Item'}
          </button>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </form>
      </div>

      {/* Confirmed Purchase Info Modal */}
      {showPurchaseWarning && warningData && (
        <ConfirmedPurchaseInfoModal
          isOpen={showPurchaseWarning}
          onClose={() => {
            setShowPurchaseWarning(false);
            setWarningData(null);
          }}
          onProceed={() => {
            setShowPurchaseWarning(false);
            setWarningData(null);
            // You could implement a "force update" API endpoint here if needed
            // For now, show informational message
            addToast('Consider notifying your buyers about this change.', 'info');
            router.push('/profile');
          }}
          itemTitle={item?.title || ''}
          confirmedBuyersCount={warningData.confirmedBuyers}
          changeType={warningData.field}
          currentValue={
            warningData.field === 'price' ? parseFloat(item?.price || '0') :
            warningData.field === 'quantity' ? parseInt(item?.quantity || '1') :
            item?.title || ''
          }
          newValue={warningData.newValue}
        />
      )}
    </div>
  );
}

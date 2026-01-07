'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { servicesApi } from '../../../../lib/apiEndpoints';
import type { Service } from '../../../../lib/api/services';
import { useUser } from '../../../../contexts/UserContext';
import Image from 'next/image';

export default function ServiceDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  
  const serviceId = params.id as string;
  const action = searchParams.get('action');
  const contactId = searchParams.get('contactId');
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  useEffect(() => {
    // Auto-open rating modal if action=rate in URL
    if (action === 'rate' && service) {
      setShowRatingModal(true);
    }
  }, [action, service]);

  const loadService = async () => {
    try {
      setLoading(true);
      const response = await servicesApi.getService(serviceId);
      setService(response.data);
    } catch (error) {
      console.error('Failed to load service:', error);
      setError('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (!user || !service || rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      setSubmittingRating(true);
      await servicesApi.addRating(
        service.id,
        rating,
        comment.trim() || undefined
      );

      alert('Thank you for your feedback!');
      setShowRatingModal(false);
      
      // Reload service to show updated rating
      loadService();
      
      // Remove action and contactId from URL
      router.replace(`/marketplace/services/${serviceId}`);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleContactSeller = () => {
    if (!service?.user?.whatsappNumber) {
      alert('Seller has no WhatsApp number available');
      return;
    }

    const message = encodeURIComponent(
      `Hi! I'm interested in your service: ${service.title}`
    );
    const cleanNumber = service.user.whatsappNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');

    // Log contact event in background
    servicesApi.logContact(service.id).catch((error) => {
      console.error('Failed to log contact:', error);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This service does not exist or has been removed.'}</p>
          <button
            onClick={() => router.push('/marketplace?mode=services')}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => router.push('/marketplace?mode=services')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="mr-2">←</span>
              Back to Services
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Service Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Image */}
            {service.imageUrl && (
              <div className="relative h-64 bg-gray-200">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-teal-600">
                  {service.priceFrom} MAD
                </span>
                {service.priceTo && (
                  <span className="text-xl text-gray-500"> - {service.priceTo} MAD</span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{service.description}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                {service.type && (
                  <div>
                    <span className="text-sm text-gray-500">Type</span>
                    <p className="font-medium text-gray-900 capitalize">{service.type.replace('-', ' ')}</p>
                  </div>
                )}
                {service.location && (
                  <div>
                    <span className="text-sm text-gray-500">Location</span>
                    <p className="font-medium text-gray-900">{service.location}</p>
                  </div>
                )}
                {service.departureTime && (
                  <div>
                    <span className="text-sm text-gray-500">Departure</span>
                    <p className="font-medium text-gray-900">
                      {new Date(service.departureTime).toLocaleString()}
                    </p>
                  </div>
                )}
                {service.duration && (
                  <div>
                    <span className="text-sm text-gray-500">Duration</span>
                    <p className="font-medium text-gray-900">{service.duration}</p>
                  </div>
                )}
              </div>

              {/* Rating */}
              {service.averageRating > 0 && (
                <div className="mb-6 flex items-center">
                  <span className="text-2xl mr-2">⭐</span>
                  <span className="text-xl font-semibold">{service.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-2">({service.totalReviews} reviews)</span>
                </div>
              )}

              {/* Seller Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Service Provider</h2>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    {(service.user?.fullName || 'P').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{service.user?.fullName || 'Service Provider'}</p>
                    <p className="text-sm text-gray-500">Service Provider</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={handleContactSeller}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                >
                  📱 Contact Seller
                </button>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="px-6 py-4 border-2 border-teal-600 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-all"
                >
                  ⭐ Rate Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Your Experience</h2>
            
            <p className="text-gray-600 mb-6">
              How would you rate <strong>{service.title}</strong>?
            </p>

            {/* Star Rating */}
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  {star <= rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={submittingRating}
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                disabled={rating === 0 || submittingRating}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

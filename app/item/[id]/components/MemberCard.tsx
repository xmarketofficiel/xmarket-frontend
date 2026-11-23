'use client';

import { CheckCircle, MessageCircle, User, Star, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface MemberInfo {
  id?: string | number;
  userRole?: 'student' | 'staff';
  name?: string;
  fullName?: string;
  program?: string;
  year?: string;
  isVerified?: boolean;
  verified?: boolean;
  rating?: number;
  responseTime?: string;
  whatsappNumber?: string;
  profileImageUrl?: string;
  profilePicture?: string;
}

interface MemberCardProps {
  member: MemberInfo;
  isAnonymous?: boolean;
  isOwnItem?: boolean;
  onMessageClick: () => void;
  className?: string;
}

export default function MemberCard({
  member,
  isAnonymous = false,
  isOwnItem = false,
  onMessageClick,
  className = ''
}: MemberCardProps) {

  const getMemberName = () => {
    if (isAnonymous) return 'Community member';
    return member.fullName || member.name || 'Community member';
  };

  const getMemberInitial = () => {
    if (isAnonymous) return '🕶️';
    const name = getMemberName();
    return name.charAt(0).toUpperCase();
  };

  const getProfilePhotoUrl = () => {
    const photoUrl = member.profileImageUrl || member.profilePicture;
    if (!photoUrl) return null;
    
    // If it's already a full URL, return as is
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    
    // If it's a relative path, prepend the API base U
    if (photoUrl.startsWith('/')) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001');
      return `${baseUrl}${photoUrl}`;
    }
    
    return photoUrl;
  };

  const isVerified = member.isVerified || member.verified;



  return (
    <div 
      className={`bg-gray-50 rounded-xl p-4 transition-all duration-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
          <User size={18} />
          <span>Posted by</span>
        </h3>
        
        {!isAnonymous && member.id && (
          <Link href={`/user/${member.id}`} className="text-sm font-semibold text-[#007B78] hover:underline">
            View profile
          </Link>
        )}
      </div>

      {/* Member info */}
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div 
          className="w-12 h-12 bg-[#006666] rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md transition-transform duration-200 hover:scale-105 overflow-hidden relative"
        >
          {getProfilePhotoUrl() && !isAnonymous ? (
            <Image
              src={getProfilePhotoUrl()!}
              alt={getMemberName()}
              fill
              className="object-cover"
              sizes="48px"
              onError={(e) => {
                // Hide image on error and show initial instead
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span>{getMemberInitial()}</span>
          )}</div>
        
        {/* Details */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">
              {getMemberName()}
            </span>
            
            {!isAnonymous && isVerified && (
              <div>
                <CheckCircle size={16} className="text-[#006666]" />
              </div>
            )}
            
            {isAnonymous && (
              <span 
                className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
              >
                🕶️ Private
              </span>
            )}
          </div>
          
          {!isAnonymous && (
            <div className="space-y-1">
              {member.userRole && <p className="text-sm text-gray-500">{member.userRole === 'staff' ? 'Staff' : 'Student'}</p>}
              {/* Program and Year */}
              {(member.program || member.year) && (
                <div className="text-sm text-gray-600">
                  {member.program} {member.year && `• ${member.year}`}
                </div>
              )}
              
              {/* Rating and Response Time */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {member.rating && (
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span>{member.rating.toFixed(1)}</span>
                  </div>
                )}
                
                {member.responseTime && (
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>Responds in {member.responseTime}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Community member Info */}
      {isAnonymous && (
        <div
          className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100"
        >
          <div className="flex items-start space-x-2">
            <div className="text-blue-500 mt-0.5">ℹ️</div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Private Listing</p>
              <p className="text-xs">This member has chosen to keep their identity private on this listing. Contact is available through WhatsApp.</p>
            </div>
          </div>
        </div>
      )}

      {/* Own Item Notice */}
      {isOwnItem && (
        <div
          className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100"
        >
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">This is your listing</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            You can edit or manage this item from your profile
          </p>
        </div>
      )}
    </div>
  );
}

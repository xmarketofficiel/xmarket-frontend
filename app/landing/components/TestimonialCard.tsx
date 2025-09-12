import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  isActive: boolean;
}

/**
 * Testimonial card component with star rating and user avatar
 */
export function TestimonialCard({ name, role, avatar, content, rating, isActive }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.6, 
        scale: isActive ? 1 : 0.95,
        y: isActive ? 0 : 20
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`bg-white rounded-2xl p-8 shadow-xl border ${
        isActive ? 'border-[#009F9C]/20' : 'border-gray-200'
      } transition-all duration-300`}
    >
      <div className="flex items-center space-x-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      
      <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
        "{content}"
      </blockquote>
      
      <div className="flex items-center">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image
            src={avatar}
            alt={`${name}'s avatar`}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}

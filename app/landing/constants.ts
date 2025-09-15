// Landing page constants and data
import { 
  ShoppingBag, 
  Wrench, 
  MessageCircle, 
  Shield, 
  GraduationCap, 
  Users,
  TrendingUp,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react';

export const BRAND_COLORS = {
  PRIMARY: '#009F9C',
  SECONDARY: '#007B78',
  ACCENT: '#FF6B35'
} as const;

export const FEATURES = [
  {
    icon: ShoppingBag,
    title: "University Marketplace",
    description: "Buy and sell items within your verified university community with secure transactions",
    color: "from-[#009F9C] to-[#007B78]",
    delay: 0.1
  },
  {
    icon: Wrench,
    title: "Services Hub",
    description: "Find tutoring, cleaning, delivery, maintenance, and pet care services from fellow students",
    color: "from-[#FF6B35] to-[#E55A2B]",
    delay: 0.2
  },
  {
    icon: MessageCircle,
    title: "Direct Messaging",
    description: "Connect instantly with buyers and sellers through our integrated chat system",
    color: "from-[#8B5CF6] to-[#7C3AED]",
    delay: 0.3
  },
  {
    icon: Shield,
    title: "Verified Community",
    description: "All users are verified with university email addresses for safety and trust",
    color: "from-[#10B981] to-[#059669]",
    delay: 0.4
  },
  {
    icon: GraduationCap,
    title: "Academic Focus",
    description: "Find textbooks, study materials, and academic services tailored for university life",
    color: "from-[#F59E0B] to-[#D97706]",
    delay: 0.5
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built by students, for students - creating connections that matter",
    color: "from-[#EF4444] to-[#DC2626]",
    delay: 0.6
  }
] as const;

export const STATISTICS = [
  { number: "500+", label: "Active Students", icon: Users },
  { number: "1,200+", label: "Items Listed", icon: ShoppingBag },
  { number: "98%", label: "Success Rate", icon: TrendingUp },
  { number: "24/7", label: "Support", icon: Clock }
] as const;

export const TESTIMONIALS = [
  {
    name: "Sarah Ahmed",
    role: "Computer Science Student",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    content: "XMarket made it so easy to sell my old textbooks and find affordable tech accessories from other students!",
    rating: 5
  },
  {
    name: "Omar Benali",
    role: "Engineering Student", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    content: "Found an amazing laptop at half the price. The verification system makes me feel safe buying from other students.",
    rating: 5
  },
  {
    name: "Fatima El Mansouri",
    role: "Business Student",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    content: "The service marketplace helped me find a reliable tutor for calculus. Highly recommend!",
    rating: 5
  }
] as const;

export const CATEGORIES = [
  { name: "Electronics", icon: "📱", count: "150+ items" },
  { name: "Books", icon: "📚", count: "300+ items" },
  { name: "Furniture", icon: "🪑", count: "80+ items" },
  { name: "Clothing", icon: "👕", count: "120+ items" },
  { name: "Sports", icon: "⚽", count: "90+ items" },
  { name: "Services", icon: "🛠️", count: "200+ offers" }
] as const;

export const FAQ_ITEMS = [
  {
    question: "How do I verify my university email?",
    answer: "Simply sign up with your university email address and we'll send you a verification link. Only verified students can access the marketplace."
  },
  {
    question: "Is it safe to buy from other students?",
    answer: "Yes! All users are verified university students. We also provide secure payment options and have a rating system for added trust."
  },
  {
    question: "What types of services can I offer?",
    answer: "You can offer tutoring, cleaning, delivery, tech support, writing assistance, and many other services that fellow students might need."
  },
  {
    question: "How do payments work?",
    answer: "We support multiple secure payment methods. For services, payment is held in escrow until both parties confirm completion."
  }
] as const;

export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
} as const;

// Landing page constants and data
import { 
  ShoppingBag, 
  MessageCircle, 
  Shield, 
  Heart,
  Search,
  Zap,
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
    description: "Browse thousands of items from textbooks to electronics. Buy and sell safely within your verified university community.",
    color: "from-[#009F9C] to-[#007B78]",
    delay: 0.1
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Contact",
    description: "Contact members through WhatsApp to ask questions, discuss prices, and arrange a campus meetup.",
    color: "from-[#8B5CF6] to-[#7C3AED]",
    delay: 0.2
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Save items you like and find them again in your favorites.",
    color: "from-[#EF4444] to-[#DC2626]",
    delay: 0.3
  },
  {
    icon: Shield,
    title: "Verified Community",
    description: "Join with your @um6p.ma or @student.1337.ma email. Buy and sell with students and staff on campus.",
    color: "from-[#10B981] to-[#059669]",
    delay: 0.4
  },
  {
    icon: Search,
    title: "Smart Search & Filters",
    description: "Find exactly what you need with advanced search, category filters, and price ranges. Save time browsing.",
    color: "from-[#F59E0B] to-[#D97706]",
    delay: 0.5
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with instant load times, smooth scrolling, and responsive design on any device.",
    color: "from-[#06B6D4] to-[#0891B2]",
    delay: 0.6
  }
] as const;

export const STATISTICS = [
  { number: "500+", label: "Active Students", icon: ShoppingBag },
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
    content: "Contacting buyers through WhatsApp made it easy to arrange a campus meetup.",
    rating: 5
  }
] as const;

export const CATEGORIES = [
  { name: "Electronics", icon: "📱", count: "150+ items" },
  { name: "Books", icon: "📚", count: "300+ items" },
  { name: "Furniture", icon: "🪑", count: "80+ items" },
  { name: "Clothing", icon: "👕", count: "120+ items" },
  { name: "Sports", icon: "⚽", count: "90+ items" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "How do I verify my university email?",
    answer: "Sign up with your university email and enter the verification code we send you. Students and staff join with an @um6p.ma or @student.1337.ma email address."
  },
  {
    question: "Is it safe to buy from other students?",
    answer: "The marketplace is for students and staff in our community. Contact members through WhatsApp, check the item before paying, and meet in a public place on campus."
  },
  {
    question: "How do I list an item for sale?",
    answer: "Click 'Add Item' from your dashboard, fill in the details (title, description, price, category), upload photos, and publish. Your listing will be visible to community students and staff."
  },
  {
    question: "Can I negotiate item prices?",
    answer: "Yes! Use the WhatsApp contact button to discuss prices directly with the member who posted the item. Members may accept reasonable offers, especially for bulk purchases or quick sales."
  },
  {
    question: "What categories are available?",
    answer: "We support a wide range of categories including Electronics, Books, Furniture, Clothing, Sports Equipment, Transportation, Health & Beauty, and many more. Browse by category to find exactly what you need."
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

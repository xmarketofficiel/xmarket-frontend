'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '../../contexts/UserContext';
import { 
  Sparkles, 
  Globe, 
  Users, 
  ShoppingBag, 
  Zap, 
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  MessageCircle,
  Heart,
  TrendingUp,
  Shield,
  Clock,
  Download,
  ChevronRight,
  Search,
  Camera,
  Bell,
  Award,
  Smartphone,
  BookOpen,
  Wrench,
  Car,
  GraduationCap,
  DollarSign,
  Lock
} from 'lucide-react';

// Real XMarket Features based on your application
const features = [
  {
    icon: ShoppingBag,
    title: "University Marketplace",
    description: "Buy and sell items within your verified university community with secure transactions",
    color: "from-[#006666] to-[#005555]",
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
    icon: Heart,
    title: "Smart Interests",
    description: "Advanced interest tracking system that connects you with items you want through WhatsApp",
    color: "from-[#25D366] to-[#128C7E]",
    delay: 0.3
  },
  {
    icon: Shield,
    title: "University Verified",
    description: "Email verification system ensures only verified students can access the platform",
    color: "from-[#006666] to-[#40E0D0]",
    delay: 0.4
  },
  {
    icon: Camera,
    title: "Image Recognition",
    description: "Smart image upload with multiple photo support and intelligent categorization",
    color: "from-[#FF6B35] to-[#40E0D0]",
    delay: 0.5
  },
  {
    icon: Search,
    title: "Intelligent Search",
    description: "Advanced search with category filters, price ranges, and location-based results",
    color: "from-[#006666] to-[#005555]",
    delay: 0.6
  }
];

const realFeatures = [
  {
    category: "Marketplace",
    items: [
      { icon: BookOpen, name: "Textbooks & Materials", description: "Academic books, notes, and study materials" },
      { icon: Smartphone, name: "Electronics", description: "Phones, laptops, gaming equipment" },
      { icon: Car, name: "Furniture", description: "Dorm furniture, study desks, storage solutions" },
      { icon: GraduationCap, name: "Clothing & Accessories", description: "Fashion, sports gear, university merchandise" }
    ]
  },
  {
    category: "Services",
    items: [
      { icon: GraduationCap, name: "Tutoring", description: "Academic support across all subjects" },
      { icon: Wrench, name: "Maintenance", description: "Repairs, tech support, assembly services" },
      { icon: Car, name: "Delivery", description: "Campus delivery, grocery runs, package pickup" },
      { icon: Shield, name: "Cleaning", description: "Dorm cleaning, laundry, organization services" }
    ]
  }
];

const testimonials = [
  {
    name: "Youssef El Amrani",
    role: "UM6P Engineering Student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "XMarket made it so easy to find affordable textbooks from other UM6P students. The verification system gives me complete confidence!",
    rating: 5
  },
  {
    name: "Aicha Benali", 
    role: "UM6P Business Student",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "Found amazing tutoring services through XMarket. The WhatsApp integration makes communication seamless!",
    rating: 5
  },
  {
    name: "Omar Zaid",
    role: "UM6P Computer Science", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "Love the interest tracking feature! I got notified instantly when someone posted the laptop I wanted.",
    rating: 5
  }
];

const stats = [
  { value: "5,000+", label: "UM6P Students" },
  { value: "15,000+", label: "Items Listed" },
  { value: "500+", label: "Services Offered" },
  { value: "98%", label: "User Satisfaction" }
];

const FloatingElement = ({ children, className = "", delay = 0 }: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number; 
}) => (
  <motion.div
    className={className}
    animate={{
      y: [-10, 10, -10],
      rotate: [-1, 1, -1],
    }}
    transition={{
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
      delay: delay,
    }}
  >
    {children}
  </motion.div>
);

const Sphere3D = ({ size = 100, color = "#006666", delay = 0, className = "" }) => (
  <motion.div
    className={`absolute rounded-full ${className}`}
    style={{ 
      width: size, 
      height: size,
      background: `linear-gradient(135deg, ${color}, ${color}80)`,
      boxShadow: `inset -${size/4}px -${size/4}px ${size/2}px rgba(0,0,0,0.2)`,
    }}
    animate={{
      rotateX: [0, 360],
      rotateY: [0, -360],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 20,
      ease: "linear",
      repeat: Infinity,
      delay: delay,
    }}
  />
);

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.5]);
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(useTransform(scrollY, [0, 1], [0, 1]), springConfig);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Authentication-aware navigation
  useEffect(() => {
    if (!loading && user) {
      // User is authenticated, redirect to main app
      router.push('/');
    }
  }, [user, loading, router]);

  // Token expiration check
  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        // Try to get current user to verify token
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001');
        const response = await fetch(`${apiUrl}/users/profile`, {
          credentials: 'include'
        });
        
        if (response.status === 401) {
          // Token expired or invalid, stay on landing page
          localStorage.removeItem('user-token');
          sessionStorage.removeItem('user-token');
        } else if (response.ok && !user && !loading) {
          // Valid token but user context not loaded, refresh user data
          window.location.reload();
        }
      } catch (error) {
        // Network error or server down, allow landing page to show
        // Silently handle auth check failure
      }
    };

    if (!loading) {
      checkAuthToken();
    }
  }, [loading, user]);

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleJoinRequest = () => {
    router.push('/join-request');
  };

  // Don't render landing page if user is authenticated
  if (user && !loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006666]/5 via-white to-blue-50/30 relative overflow-hidden">
      {/* Smart 3D Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sphere3D size={120} color="#006666" delay={0} className="top-20 left-10 opacity-10" />
        <Sphere3D size={80} color="#FF6B35" delay={2} className="top-40 right-20 opacity-15" />
        <Sphere3D size={100} color="#40E0D0" delay={4} className="bottom-40 left-1/4 opacity-10" />
        <Sphere3D size={60} color="#25D366" delay={6} className="bottom-20 right-1/3 opacity-20" />
        
        <FloatingElement className="absolute top-32 right-1/4" delay={1}>
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#006666] to-[#40E0D0] opacity-20 blur-xl" />
        </FloatingElement>
        <FloatingElement className="absolute bottom-32 left-1/3" delay={3}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#006666] opacity-15 blur-xl" />
        </FloatingElement>
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-50 backdrop-blur-sm border-b border-[#006666]/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#006666] to-[#40E0D0] rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#006666] to-[#005555] bg-clip-text text-transparent">
                XMarket
              </span>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-[#006666] transition-colors font-medium">
                Features
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-[#006666] transition-colors font-medium">
                About
              </Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-[#006666] transition-colors font-medium">
                Reviews
              </Link>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSignIn}
                  className="text-[#006666] hover:text-[#005555] font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-[#006666] to-[#005555] text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-20 pb-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              style={{ y: y1, opacity }}
              initial={{ opacity: 0, y: 50 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center space-x-2 bg-[#006666]/10 rounded-full px-4 py-2 mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-5 w-5 text-[#006666]" />
                <span className="text-[#006666] font-medium">UM6P Exclusive Marketplace</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="h-4 w-4 text-[#FF6B35]" />
                </motion.div>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
                Your Campus
                <br />
                <span className="bg-gradient-to-r from-[#006666] via-[#40E0D0] to-[#FF6B35] bg-clip-text text-transparent">
                  Marketplace
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Connect, trade, and discover with your university community. From textbooks to services, 
                everything you need as a student in one secure, verified platform.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.button
                onClick={handleGetStarted}
                className="group relative bg-gradient-to-r from-[#006666] to-[#005555] text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  Join XMarket
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              <motion.button
                onClick={handleSignIn}
                className="group flex items-center space-x-3 text-gray-700 hover:text-[#006666] font-semibold text-lg transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#006666]/10 transition-colors">
                  <Play className="h-5 w-5 ml-1" />
                </div>
                <span>Already a member? Sign In</span>
              </motion.button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="text-3xl md:text-4xl font-bold text-[#006666] mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-32 px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need as a
              <span className="block bg-gradient-to-r from-[#006666] to-[#FF6B35] bg-clip-text text-transparent">
                University Student
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From buying textbooks to finding tutoring services, XMarket provides all the tools 
              you need for successful campus life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: feature.delay }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#006666] transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <motion.div 
                  className="flex items-center text-[#006666] font-semibold group-hover:translate-x-2 transition-transform"
                  whileHover={{ x: 5 }}
                >
                  Learn More
                  <ChevronRight className="h-4 w-4 ml-1" />
                </motion.div>

                {/* Decorative element */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color}`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Real Features Showcase */}
          <motion.div
            className="bg-white rounded-3xl p-12 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={featuresInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                What You Can Find on XMarket
              </h3>
              <p className="text-gray-600 text-lg">Real categories from actual UM6P students</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {realFeatures.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-6">
                  <h4 className="text-2xl font-bold text-[#006666] mb-6 flex items-center">
                    {category.category === 'Marketplace' ? <ShoppingBag className="h-6 w-6 mr-3" /> : <Wrench className="h-6 w-6 mr-3" />}
                    {category.category}
                  </h4>
                  
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#006666]/10 to-[#40E0D0]/10 rounded-lg flex items-center justify-center">
                          <item.icon className="h-6 w-6 text-[#006666]" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">{item.name}</h5>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by UM6P Students
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of students who have transformed their campus experience with XMarket
            </p>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex space-x-1 mb-6">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-xl md:text-2xl text-gray-900 mb-8 font-medium leading-relaxed">
                      "{testimonials[currentTestimonial].content}"
                    </blockquote>
                    
                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 text-lg">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-[#006666] font-medium">
                          {testimonials[currentTestimonial].role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-[#006666] scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 bg-gradient-to-r from-[#006666] to-[#005555] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Sphere3D size={200} color="#40E0D0" delay={0} className="top-10 right-10" />
          <Sphere3D size={150} color="#FF6B35" delay={2} className="bottom-10 left-10" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-[#40E0D0] to-[#FF6B35] bg-clip-text text-transparent">
                Campus Experience?
              </span>
            </h2>
            
            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of UM6P students who are already saving money, finding services, 
              and building connections through XMarket.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <motion.button
                onClick={handleGetStarted}
                className="group bg-white text-[#006666] px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  Start Trading Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              <motion.button
                onClick={handleJoinRequest}
                className="group text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <span className="flex items-center">
                  Not from UM6P? Join Waitlist
                  <Users className="ml-2 h-5 w-5" />
                </span>
              </motion.button>
            </div>

            {/* Trust indicators */}
            <div className="flex justify-center items-center space-x-8 text-gray-300 text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>University Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Secure Transactions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>5,000+ Students</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#006666] to-[#40E0D0] rounded-xl flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">XMarket</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                The ultimate marketplace designed specifically for university students. 
                Connecting campus communities through secure, verified trading.
              </p>
              <div className="flex space-x-4">
                <motion.div 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#006666] transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                >
                  <Globe className="h-5 w-5" />
                </motion.div>
                <motion.div 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#006666] transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                >
                  <MessageCircle className="h-5 w-5" />
                </motion.div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#testimonials" className="hover:text-white transition-colors">Reviews</Link></li>
                <li><button onClick={handleJoinRequest} className="hover:text-white transition-colors">Join Waitlist</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 XMarket. Built for students, by students.
              </p>
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

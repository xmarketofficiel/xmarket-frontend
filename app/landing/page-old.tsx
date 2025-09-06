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
    color: "from-[#006666] to-[#005555]"
  },
  {
    icon: Wrench,
    title: "Services Hub",
    description: "Find tutoring, cleaning, delivery, maintenance, and pet care services from fellow students",
    color: "from-[#FF6B35] to-[#E55A2B]"
  },
  {
    icon: Heart,
    title: "Smart Interests",
    description: "Advanced interest tracking system that connects you with items you want through WhatsApp",
    color: "from-[#25D366] to-[#128C7E]"
  },
  {
    icon: Shield,
    title: "University Verified",
    description: "Email verification system ensures only verified students can access the platform",
    color: "from-[#006666] to-[#40E0D0]"
  },
  {
    icon: Camera,
    title: "Image Recognition",
    description: "Smart image upload with multiple photo support and intelligent categorization",
    color: "from-[#FF6B35] to-[#40E0D0]"
  },
  {
    icon: Search,
    title: "Intelligent Search",
    description: "Advanced search with category filters, price ranges, and location-based results",
    color: "from-[#006666] to-[#005555]"
  }
];

const categories = [
  { name: "Electronics", icon: "📱", count: "340+", popular: true },
  { name: "Books & Education", icon: "📚", count: "280+", popular: true },
  { name: "Clothing & Fashion", icon: "👕", count: "220+", popular: false },
  { name: "Furniture & Decor", icon: "🪑", count: "150+", popular: false },
  { name: "Sports & Fitness", icon: "⚽", count: "95+", popular: false },
  { name: "Lab & Research", icon: "🔬", count: "75+", popular: true }
];

const testimonials = [
  {
    name: "Sarah El Amrani",
    role: "Computer Science, 3rd Year",
    content: "Found my dream laptop at half the retail price! The seller was incredibly trustworthy, and we met right at the library. XMarket has completely changed how I shop for tech.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    verified: true
  },
  {
    name: "Dr. Hassan Benali",
    role: "Engineering Faculty",
    content: "Perfect platform for selling research equipment and lab materials. The verification system gives me complete confidence in every transaction. Highly recommend!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    verified: true
  },
  {
    name: "Fatima Zahra",
    role: "Business Administration, Master's",
    content: "Saved over 2000 MAD on textbooks this semester! The community aspect makes it feel safe and reliable. Best marketplace experience I've ever had.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", 
    rating: 5,
    verified: true
  }
];

const stats = [
  { number: "2,500+", label: "Active Users", icon: "👥" },
  { number: "850+", label: "Items Available", icon: "🛍️" },
  { number: "1,200+", label: "Successful Trades", icon: "🤝" },
  { number: "98%", label: "Satisfaction Rate", icon: "⭐" }
];

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center"
          >
            <span className="text-white font-bold text-2xl">X</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            XMarket
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-purple-200"
          >
            Loading your marketplace...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Fixed Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">X</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  XMarket
                </span>
                <div className="text-xs text-purple-600 font-semibold -mt-1">
                  UM6P EXCLUSIVE
                </div>
              </div>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Features
              </a>
              <a href="#marketplace" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Categories
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Reviews
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Join Now
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-8"
              >
                <span className="text-purple-300 text-sm font-medium">🚀 Now Live for UM6P Community</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold leading-tight mb-8"
              >
                <span className="text-white">Your Campus</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Marketplace
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-xl text-purple-100 mb-10 leading-relaxed max-w-lg"
              >
                The ultimate platform for UM6P students and staff to buy, sell, and trade within our trusted academic community.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgb(168 85 247 / 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group"
                  >
                    <span className="flex items-center justify-center">
                      Start Trading Now
                      <motion.span
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-purple-400/30 text-purple-100 px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm hover:bg-purple-500/10 transition-all duration-300"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </motion.button>
              </motion.div>

              {/* Live Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-8"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-200 text-sm font-medium">2,500+ Active Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-200 text-sm font-medium">850+ Items Available</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Card */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotateY: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                  {/* Mock Interface */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-lg">Featured Items</h3>
                      <span className="text-cyan-400 text-sm font-medium">View All →</span>
                    </div>
                    
                    {[1, 2, 3].map((item, idx) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 20 }}
                        animate={heroInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                        className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                          idx === 0 ? 'from-purple-500 to-pink-500' :
                          idx === 1 ? 'from-cyan-500 to-blue-500' :
                          'from-emerald-500 to-teal-500'
                        } flex items-center justify-center`}>
                          <span className="text-white text-lg">
                            {idx === 0 ? '📱' : idx === 1 ? '📚' : '💻'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-white/10 rounded w-1/2"></div>
                        </div>
                        <div className="text-cyan-400 font-bold">
                          {idx === 0 ? '1,200 MAD' : idx === 1 ? '350 MAD' : '2,800 MAD'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, 0] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl opacity-80"
                ></motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, -5, 0] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full opacity-60"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.5 + idx * 0.1, type: "spring", stiffness: 200 }}
                  className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">XMarket?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built specifically for our academic community with features that matter to students and staff
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="marketplace" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Explore <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From textbooks to tech, find everything you need for campus life
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="relative group cursor-pointer"
              >
                <div className="bg-gray-50 hover:bg-gradient-to-br hover:from-purple-50 hover:to-cyan-50 rounded-2xl p-6 text-center border-2 border-transparent hover:border-purple-200 transition-all duration-300">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {category.count} items
                  </p>
                  
                  {category.popular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Hot
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Browse All Categories
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              What Our <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Community Says</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real stories from UM6P students and faculty members
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                {/* Stars Rating */}
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>

                <p className="text-white/90 mb-6 leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-white font-bold">
                        {testimonial.name}
                      </h4>
                      {testimonial.verified && (
                        <span className="ml-2 text-cyan-400">✓</span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Campus Trading?
              </span>
            </h2>
            
            <p className="text-xl text-purple-100 mb-12 leading-relaxed max-w-2xl mx-auto">
              Join thousands of UM6P community members who are already buying, selling, and connecting through XMarket
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-600 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/10 transition-all duration-300 group min-w-[200px]"
                >
                  <span className="flex items-center justify-center">
                    Get Started Free
                    <motion.span
                      className="ml-3 group-hover:translate-x-1 transition-transform"
                    >
                      🚀
                    </motion.span>
                  </span>
                </motion.button>
              </Link>
              
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 min-w-[200px]"
                >
                  Sign In
                </motion.button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-purple-100 text-sm mb-6"
            >
              <p className="mb-2">🔒 Secure • ⚡ Fast • 🎓 University Verified</p>
              <p>No hidden fees • No commissions • 100% Free to join</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-purple-200 text-sm mb-3">
                Not from UM6P? 
              </p>
              <Link href="/join-request">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4 font-medium transition-colors"
                >
                  Request Access to Join Our Community →
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">X</span>
                </div>
                <div>
                  <span className="text-2xl font-bold">XMarket</span>
                  <div className="text-xs text-purple-400 font-semibold">
                    UM6P EXCLUSIVE
                  </div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md mb-8">
                The trusted marketplace for Mohammed VI Polytechnic University community. 
                Connecting students and staff through secure, verified transactions.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span>📧</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span>💬</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span>📱</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['About Us', 'How It Works', 'Safety Tips', 'Support', 'Community Guidelines'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-6">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <span className="mr-3">🏫</span>
                  UM6P Campus, Benguerir
                </li>
                <li className="flex items-center">
                  <span className="mr-3">📧</span>
                  support@xmarket.um6p.ma
                </li>
                <li className="flex items-center">
                  <span className="mr-3">⏰</span>
                  24/7 Student Support
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 XMarket UM6P. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

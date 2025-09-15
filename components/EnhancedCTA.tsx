'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, TrendingUp, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CTAFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

const CTA_FEATURES: CTAFeature[] = [
  {
    icon: Users,
    title: "Connect with 10K+ Students",
    description: "Join verified students from top universities",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Shield,
    title: "100% Secure Trading",
    description: "University verification & secure transactions",
    color: "from-green-500 to-green-600"
  },
  {
    icon: TrendingUp,
    title: "Save up to 60%",
    description: "Better deals than any retail store",
    color: "from-purple-500 to-purple-600"
  }
];

interface EnhancedCTAProps {
  title?: string;
  subtitle?: string;
  primaryAction?: {
    text: string;
    href: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
  className?: string;
}

/**
 * Enhanced CTA Component - Modern call-to-action with features showcase
 * Features animated cards, gradient backgrounds, and compelling messaging
 */
export function EnhancedCTA({
  title = "Ready to Transform Your Campus Experience?",
  subtitle = "Join thousands of students already saving money and making connections",
  primaryAction = { text: "Get Started Free", href: "/signup" },
  secondaryAction = { text: "See How It Works", href: "/landing" },
  className = ""
}: EnhancedCTAProps) {
  const router = useRouter();

  return (
    <section className={`relative py-24 overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#009F9C] via-[#007B78] to-[#005A57]">
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [180, 0, 180],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-white rounded-full blur-3xl"
        />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${10 + i * 8}%`,
              top: `${20 + i * 5}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6"
          >
            <Sparkles className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold">Limited Time: Join the Revolution</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-medium">
            {subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {CTA_FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              viewport={{ once: true }}
              className="bg-white/15 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(primaryAction.href)}
            className="group bg-white text-[#009F9C] px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center"
          >
            {primaryAction.text}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-3"
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(secondaryAction.href)}
            className="group bg-transparent border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
          >
            {secondaryAction.text}
          </motion.button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-white/80 mb-6 font-medium">Trusted by students at:</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-80">
            {["🏛️ Harvard", "🎓 MIT", "📚 Stanford", "🔬 Berkeley", "🎨 NYU", "🚀 CMU"].map((uni, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="text-white font-semibold hover:scale-110 transition-all duration-300 cursor-default"
              >
                {uni}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20"
        >
          {[
            { number: "10K+", label: "Active Students" },
            { number: "50+", label: "Universities" },
            { number: "95%", label: "Satisfaction Rate" },
            { number: "$2M+", label: "Student Savings" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-white/80 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default EnhancedCTA;
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatisticCardProps {
  number: string;
  label: string;
  icon: LucideIcon;
  index: number;
}

/**
 * Animated statistic card with count-up effect
 */
export function StatisticCard({ number, label, icon: Icon, index }: StatisticCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="text-center group"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: (index * 0.1) + 0.3, type: "spring", stiffness: 100 }}
          className="text-4xl font-bold text-white mb-2"
        >
          {number}
        </motion.div>
        
        <div className="text-white/80 font-medium">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

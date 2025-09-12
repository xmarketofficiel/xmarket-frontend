import { motion } from 'framer-motion';

interface CategoryCardProps {
  name: string;
  icon: string;
  count: string;
  index: number;
}

/**
 * Category card component with hover effects
 */
export function CategoryCard({ name, icon, count, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#009F9C]/30 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="text-center">
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
        <p className="text-sm text-gray-500">{count}</p>
      </div>
    </motion.div>
  );
}

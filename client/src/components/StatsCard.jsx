// Aegis — Stats card component with glassmorphism
import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, trend, color = 'green' }) => {
  const colorMap = {
    green: 'text-green-400 bg-green-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    red: 'text-red-400 bg-red-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };

  const iconColors = colorMap[color] || colorMap.green;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card p-6 group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconColors}`}>
          {Icon && <Icon size={22} />}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
            trend > 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-3xl font-brand font-bold text-aegis-text mb-1">{value}</p>
      <p className="text-sm text-aegis-muted font-body">{label}</p>
    </motion.div>
  );
};

export default StatsCard;

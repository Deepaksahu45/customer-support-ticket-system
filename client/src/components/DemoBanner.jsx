// Aegis — Demo account banner component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Shield, Headphones, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_EMAILS = ['admin@aegis.com', 'agent@aegis.com', 'customer@aegis.com'];

const ROLE_CONFIG = {
  admin: {
    color: 'from-orange-500/20 to-orange-600/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    bg: 'bg-orange-500',
    icon: Shield,
    label: 'Admin',
    capabilities: 'Manage users, view analytics, oversee all tickets',
  },
  agent: {
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    bg: 'bg-blue-500',
    icon: Headphones,
    label: 'Agent',
    capabilities: 'Respond to tickets, manage assignments, resolve issues',
  },
  customer: {
    color: 'from-indigo-500/20 to-indigo-600/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    bg: 'bg-indigo-500',
    icon: User,
    label: 'Customer',
    capabilities: 'Create tickets, track status, chat with agents',
  },
};

const DemoBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  // Only show for demo accounts
  if (!user || !DEMO_EMAILS.includes(user.email) || dismissed) return null;

  const config = ROLE_CONFIG[user.role] || ROLE_CONFIG.customer;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`mb-4 rounded-xl bg-gradient-to-r ${config.color} border ${config.border} backdrop-blur-sm overflow-hidden`}
      >
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 rounded-lg ${config.bg}/15 flex items-center justify-center flex-shrink-0`}>
              <Icon size={16} className={config.text} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-aegis-text">
                Exploring as{' '}
                <span className={`font-semibold ${config.text}`}>{config.label}</span>
              </p>
              <p className="text-xs text-aegis-muted truncate">{config.capabilities}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${config.text} hover:bg-white/5 border ${config.border} transition-all duration-200`}
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">Switch Role</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg hover:bg-white/5 text-aegis-muted hover:text-aegis-text transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoBanner;

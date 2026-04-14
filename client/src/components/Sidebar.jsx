// Aegis — Collapsible sidebar navigation
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Ticket,
  Shield,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AegisLogo from './AegisLogo';

const Sidebar = ({ isOpen, isCollapsed, onToggleCollapse, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tickets', label: 'Tickets', icon: Ticket },
    ...(user?.role === 'admin'
      ? [{ path: '/admin', label: 'Admin Panel', icon: Shield }]
      : []),
    { path: '/pricing', label: 'Pricing', icon: CreditCard },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-aegis-surface/50 backdrop-blur-xl border-r border-aegis-border/50">
      {/* Logo section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-aegis-border/30">
        <AegisLogo
          size={isCollapsed ? 'sm' : 'md'}
          variant={isCollapsed ? 'icon' : 'full'}
        />
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-aegis-dark/50 md:hidden"
        >
          <X size={18} className="text-aegis-muted" />
        </button>
        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg hover:bg-aegis-dark/50 hidden md:block"
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-aegis-muted" />
          ) : (
            <ChevronLeft size={16} className="text-aegis-muted" />
          )}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-aegis-green/10 text-aegis-green'
                  : 'text-aegis-muted hover:text-aegis-text hover:bg-aegis-dark/50'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-aegis-green rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={20} className="flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* User info at bottom */}
      {!isCollapsed && (
        <div className="p-4 border-t border-aegis-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-aegis-green/15 border border-aegis-green/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-aegis-green">
                {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-aegis-text truncate">{user?.name}</p>
              <p className="text-xs text-aegis-muted capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-[260px] z-50 md:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 64 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:block fixed left-0 top-0 bottom-0 z-30 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
};

export default Sidebar;

// Aegis — Top navigation bar
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AegisLogo from './AegisLogo';
import { getInitials } from '../utils/helpers';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/tickets', label: 'Tickets' },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin' }] : []),
    { path: '/pricing', label: 'Pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-6 bg-aegis-dark/85 backdrop-blur-xl border-b border-aegis-border/50">
      {/* Left: Logo + Menu toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-aegis-surface transition-colors md:hidden"
        >
          <Menu size={20} className="text-aegis-muted" />
        </button>
        <div
          className="cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <AegisLogo size="md" variant="full" />
        </div>
      </div>

      {/* Center: Nav links (desktop) */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-aegis-green/10 text-aegis-green'
                  : 'text-aegis-muted hover:text-aegis-text hover:bg-aegis-surface'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>

      {/* Right: Notifications + Avatar + Logout */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-aegis-surface transition-colors relative">
          <Bell size={18} className="text-aegis-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-aegis-green rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-aegis-border/50">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-aegis-text leading-tight">{user?.name}</p>
            <p className="text-xs text-aegis-muted capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-aegis-green/15 border border-aegis-green/30 flex items-center justify-center">
            <span className="text-xs font-bold text-aegis-green">
              {getInitials(user?.name)}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-500/10 text-aegis-muted hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

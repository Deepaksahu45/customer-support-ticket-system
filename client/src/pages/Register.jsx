// Aegis — Register page with role selection (Customer + Agent)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Headphones } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AegisLogo from '../components/AegisLogo';

const ROLES = [
  {
    id: 'customer',
    label: 'Customer',
    icon: User,
    desc: 'Submit tickets and track support requests',
    accent: 'text-indigo-400',
    activeBg: 'bg-indigo-500/15',
    activeBorder: 'border-indigo-500/40',
  },
  {
    id: 'agent',
    label: 'Agent',
    icon: Headphones,
    desc: 'Respond to and resolve customer tickets',
    accent: 'text-blue-400',
    activeBg: 'bg-blue-500/15',
    activeBorder: 'border-blue-500/40',
  },
];

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = ROLES.find((r) => r.id === searchParams.get('role'))?.id || 'customer';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Update role if URL param changes
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ROLES.find((r) => r.id === roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
    if (score <= 4) return { score: 4, label: 'Strong', color: 'bg-green-400' };
    return { score: 5, label: 'Very Strong', color: 'bg-aegis-green' };
  };

  const passStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password, role: selectedRole });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeRole = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{
        background: `#071a0e`,
        backgroundImage: `
          radial-gradient(circle at 30% 20%, rgba(34,197,94,0.2), transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(34,197,94,0.12), transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(34,197,94,0.05), transparent 60%)
        `,
      }}
    >
      {/* Floating orbs */}
      <div className="absolute top-40 left-20 w-72 h-72 bg-aegis-green/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-aegis-green/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        {/* Logo + Tagline */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <AegisLogo size="lg" variant="full" />
          </div>
          <p className="text-aegis-green/70 font-brand text-sm tracking-wide">
            Create your account
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-2 mb-6">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isActive = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRole(role.id);
                  setError('');
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? `${role.activeBg} ${role.activeBorder} ${role.accent}`
                    : 'border-aegis-border/50 text-aegis-muted hover:bg-aegis-surface hover:text-aegis-text'
                }`}
              >
                <Icon size={16} />
                {role.label}
              </button>
            );
          })}
        </div>

        {/* Role description */}
        <motion.p
          key={selectedRole}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-aegis-muted text-center mb-5"
        >
          {activeRole.desc}
        </motion.p>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aegis-muted" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="aegis-input pl-11"
              required
            />
          </div>

          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aegis-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="aegis-input pl-11"
              required
            />
          </div>

          <div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aegis-muted" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className="aegis-input pl-11 pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aegis-muted hover:text-aegis-text transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password strength meter */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1 mb-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        level <= passStrength.score ? passStrength.color : 'bg-aegis-border'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-aegis-muted">
                  Password strength: <span className={passStrength.score >= 4 ? 'text-aegis-green' : 'text-aegis-muted'}>{passStrength.label}</span>
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="aegis-btn w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-aegis-dark/30 border-t-aegis-dark rounded-full animate-spin" />
            ) : (
              <>
                Create {activeRole.label} Account
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-aegis-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-aegis-green hover:text-aegis-green/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>

        {/* Back to landing */}
        <p className="mt-3 text-center">
          <Link to="/" className="text-xs text-aegis-muted hover:text-aegis-text transition-colors">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

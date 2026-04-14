// Aegis — Register page
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AegisLogo from '../components/AegisLogo';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

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
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AegisLogo size="lg" variant="full" />
          </div>
          <p className="text-aegis-green/70 font-brand text-sm tracking-wide">
            Support. Resolved. Instantly.
          </p>
        </div>

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
                Create Account
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Social login (UI only) */}
        <div className="mt-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-aegis-border/50" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-aegis-surface/70 text-xs text-aegis-muted">or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="aegis-btn-outline flex items-center justify-center gap-2 text-sm py-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#ea4335" d="M5.27 9.77A7.79 7.79 0 0 1 12 4.5c1.95 0 3.7.7 5.08 1.87L20.5 3A12 12 0 0 0 .46 9.23l4.81 3.54Z"/><path fill="#4285f4" d="M23.5 12.27c0-.88-.07-1.52-.22-2.18H12v4.06h6.6a5.58 5.58 0 0 1-2.45 3.68l3.86 3A11.86 11.86 0 0 0 23.5 12.27Z"/><path fill="#fbbc05" d="M5.27 14.23A7.56 7.56 0 0 1 4.5 12c0-.78.13-1.53.37-2.23L.06 6.23A12.09 12.09 0 0 0 0 12c0 1.93.46 3.76 1.28 5.39l3.99-3.16Z"/><path fill="#34a853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.86-3a7.24 7.24 0 0 1-4.07 1.17 7.72 7.72 0 0 1-6.73-5.03L1.28 17.4A12 12 0 0 0 12 24Z"/></svg>
              Google
            </button>
            <button className="aegis-btn-outline flex items-center justify-center gap-2 text-sm py-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z"/></svg>
              Apple
            </button>
          </div>
        </div>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-aegis-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-aegis-green hover:text-aegis-green/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

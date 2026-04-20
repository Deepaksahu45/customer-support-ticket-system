// Aegis — Landing page for portfolio visitors
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Headphones,
  User,
  ArrowRight,
  Ticket,
  MessageSquare,
  CheckCircle2,
  Zap,
  BarChart3,
  Users,
  Lock,
  Bell,
  Settings,
  Search,
  PlusCircle,
  Eye,
} from 'lucide-react';
import AegisLogo from '../components/AegisLogo';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// Demo credentials
const DEMO_ACCOUNTS = {
  customer: { email: 'customer@aegis.com', password: 'customer123' },
  agent: { email: 'agent@aegis.com', password: 'agent123' },
  admin: { email: 'admin@aegis.com', password: 'admin123' },
};

// Tech stack data
const TECH_STACK = [
  { name: 'MongoDB', color: '#47A248', icon: '🍃' },
  { name: 'Express', color: '#94a3b8', icon: '⚡' },
  { name: 'React', color: '#61DAFB', icon: '⚛️' },
  { name: 'Node.js', color: '#339933', icon: '🟢' },
  { name: 'Socket.io', color: '#94a3b8', icon: '🔌' },
  { name: 'JWT', color: '#D63AFF', icon: '🔐' },
  { name: 'Tailwind', color: '#38BDF8', icon: '🎨' },
  { name: 'Framer Motion', color: '#FF0055', icon: '✨' },
];

// How it works steps
const STEPS = [
  {
    icon: PlusCircle,
    title: 'Create a Ticket',
    desc: 'Customers submit support tickets with details about their issue, priority level, and category.',
  },
  {
    icon: MessageSquare,
    title: 'Agent Responds',
    desc: 'Support agents get assigned tickets and respond in real-time via built-in chat powered by Socket.io.',
  },
  {
    icon: CheckCircle2,
    title: 'Issue Resolved',
    desc: 'Tickets are tracked through their lifecycle — open, in-progress, resolved — with full audit trail.',
  },
];

// Role card data
const ROLE_CARDS = [
  {
    role: 'customer',
    label: 'Customer',
    icon: User,
    gradient: 'from-indigo-500/20 via-indigo-600/10 to-transparent',
    border: 'border-indigo-500/25',
    accent: 'text-indigo-400',
    accentBg: 'bg-indigo-500',
    btnClass: 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20',
    outlineClass: 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10',
    features: [
      { icon: PlusCircle, text: 'Create support tickets' },
      { icon: Eye, text: 'Track ticket status' },
      { icon: MessageSquare, text: 'Real-time chat with agents' },
      { icon: Bell, text: 'Get notified on updates' },
    ],
  },
  {
    role: 'agent',
    label: 'Agent',
    icon: Headphones,
    gradient: 'from-blue-500/20 via-blue-600/10 to-transparent',
    border: 'border-blue-500/25',
    accent: 'text-blue-400',
    accentBg: 'bg-blue-500',
    btnClass: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20',
    outlineClass: 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10',
    features: [
      { icon: Ticket, text: 'View & manage assigned tickets' },
      { icon: MessageSquare, text: 'Respond to customers live' },
      { icon: Search, text: 'Search & filter tickets' },
      { icon: CheckCircle2, text: 'Resolve & close tickets' },
    ],
  },
  {
    role: 'admin',
    label: 'Admin',
    icon: Shield,
    gradient: 'from-orange-500/20 via-orange-600/10 to-transparent',
    border: 'border-orange-500/25',
    accent: 'text-orange-400',
    accentBg: 'bg-orange-500',
    btnClass: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20',
    outlineClass: 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10',
    features: [
      { icon: Users, text: 'Manage all users & agents' },
      { icon: BarChart3, text: 'Analytics & dashboard' },
      { icon: Settings, text: 'System configuration' },
      { icon: Shield, text: 'Full access to everything' },
    ],
  },
];

const Landing = () => {
  const navigate = useNavigate();

  const handleDemoLogin = (role) => {
    const creds = DEMO_ACCOUNTS[role];
    navigate(`/login?email=${encodeURIComponent(creds.email)}&password=${encodeURIComponent(creds.password)}`);
  };

  const handleCreateAccount = (role) => {
    navigate(`/register?role=${role}`);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: '#071a0e',
        backgroundImage: `
          radial-gradient(circle at 70% 15%, rgba(34,197,94,0.18), transparent 50%),
          radial-gradient(circle at 20% 85%, rgba(34,197,94,0.12), transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(34,197,94,0.04), transparent 60%)
        `,
      }}
    >
      {/* Floating background orbs */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-aegis-green/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-10 w-[400px] h-[400px] bg-aegis-green/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-aegis-green/2 rounded-full blur-3xl" />

      {/* ===== NAVBAR ===== */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 bg-aegis-dark/60 backdrop-blur-xl border-b border-aegis-border/30"
      >
        <AegisLogo size="md" variant="full" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl text-sm font-medium text-aegis-muted hover:text-aegis-text hover:bg-aegis-surface transition-all duration-200"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="aegis-btn text-sm px-4 py-2"
          >
            Get Started
          </button>
        </div>
      </motion.nav>

      <div className="relative z-10 pt-16">
        {/* ===== HERO SECTION ===== */}
        <section className="px-6 md:px-10 pt-20 pb-16 md:pt-28 md:pb-24 max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aegis-green/10 border border-aegis-green/20">
                <Zap size={14} className="text-aegis-green" />
                <span className="text-xs font-medium text-aegis-green tracking-wide">Full-Stack MERN Application</span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl lg:text-7xl font-brand font-bold leading-tight mb-6"
            >
              <span className="text-aegis-text">Support.</span>{' '}
              <span className="text-gradient-green">Resolved.</span>{' '}
              <span className="text-aegis-text">Instantly.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-aegis-muted text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-body"
            >
              Aegis is a real-time customer support ticket system built with the MERN stack.
              Featuring role-based access, live chat via Socket.io, and a premium dark-themed UI
              — explore it live with demo accounts below.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}
                className="aegis-btn flex items-center gap-2 text-sm"
              >
                Explore Demo
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => document.getElementById('tech')?.scrollIntoView({ behavior: 'smooth' })}
                className="aegis-btn-outline flex items-center gap-2 text-sm"
              >
                View Tech Stack
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="px-6 md:px-10 py-16 md:py-24 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-3xl font-brand font-bold text-aegis-text mb-3"
            >
              How It Works
            </motion.h2>
            <motion.p variants={fadeUp} className="text-aegis-muted font-body max-w-lg mx-auto">
              A streamlined workflow from ticket creation to resolution
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className="glass-card p-6 text-center group hover:border-aegis-green/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-aegis-green/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-aegis-green/20 transition-colors duration-300">
                    <Icon size={24} className="text-aegis-green" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-aegis-surface border border-aegis-border flex items-center justify-center mx-auto mb-4">
                    <span className="text-sm font-bold text-aegis-green font-brand">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-brand font-semibold text-aegis-text mb-2">{step.title}</h3>
                  <p className="text-sm text-aegis-muted font-body leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ===== ROLE CARDS ===== */}
        <section id="roles" className="px-6 md:px-10 py-16 md:py-24 max-w-6xl mx-auto scroll-mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-3xl font-brand font-bold text-aegis-text mb-3"
            >
              Explore by Role
            </motion.h2>
            <motion.p variants={fadeUp} className="text-aegis-muted font-body max-w-lg mx-auto">
              Try Aegis from any perspective — each role has unique capabilities and views
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {ROLE_CARDS.map((card) => {
              const CardIcon = card.icon;
              const creds = DEMO_ACCOUNTS[card.role];
              return (
                <motion.div
                  key={card.role}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`glass-card overflow-hidden group`}
                >
                  {/* Card header gradient */}
                  <div className={`bg-gradient-to-br ${card.gradient} p-6 border-b ${card.border}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${card.accentBg}/15 flex items-center justify-center`}>
                        <CardIcon size={20} className={card.accent} />
                      </div>
                      <h3 className="text-xl font-brand font-bold text-aegis-text">{card.label}</h3>
                    </div>
                    {/* Credentials */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-aegis-muted">email:</span>
                        <span className={`${card.accent} select-all`}>{creds.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-aegis-muted">pass:</span>
                        <span className={`${card.accent} select-all`}>{creds.password}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <p className="text-xs font-medium text-aegis-muted uppercase tracking-wider mb-3">Capabilities</p>
                    <ul className="space-y-2.5 mb-6">
                      {card.features.map((feat, j) => {
                        const FeatIcon = feat.icon;
                        return (
                          <li key={j} className="flex items-center gap-2.5 text-sm text-aegis-text/80 font-body">
                            <FeatIcon size={14} className={`${card.accent} flex-shrink-0`} />
                            {feat.text}
                          </li>
                        );
                      })}
                    </ul>

                    {/* Action buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleDemoLogin(card.role)}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${card.btnClass}`}
                      >
                        {card.role === 'admin' ? 'Login as Admin' : `Try as ${card.label}`}
                      </button>
                      {card.role !== 'admin' && (
                        <button
                          onClick={() => handleCreateAccount(card.role)}
                          className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 active:scale-[0.98] ${card.outlineClass}`}
                        >
                          Create Your Own Account
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ===== TECH STACK ===== */}
        <section id="tech" className="px-6 md:px-10 py-16 md:py-24 max-w-6xl mx-auto scroll-mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-3xl font-brand font-bold text-aegis-text mb-3"
            >
              Built With
            </motion.h2>
            <motion.p variants={fadeUp} className="text-aegis-muted font-body max-w-lg mx-auto">
              Modern technologies powering a production-grade support platform
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="glass-card p-4 flex flex-col items-center gap-2 text-center hover:border-aegis-green/20 transition-all duration-300 cursor-default"
              >
                <span className="text-2xl">{tech.icon}</span>
                <span
                  className="text-sm font-medium font-body"
                  style={{ color: tech.color }}
                >
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section className="px-6 md:px-10 py-16 md:py-24 max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="glass-card p-8 md:p-12 border-glow">
              <h2 className="text-2xl md:text-3xl font-brand font-bold text-aegis-text mb-3">
                Ready to Explore?
              </h2>
              <p className="text-aegis-muted font-body mb-8 max-w-md mx-auto">
                Pick any role above to experience Aegis, or create your own account to see the full registration flow.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}
                  className="aegis-btn flex items-center gap-2 text-sm"
                >
                  Choose a Role
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="aegis-btn-outline flex items-center gap-2 text-sm"
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Spacer at bottom */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default Landing;

// Aegis — Pricing page
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AegisLogo from '../components/AegisLogo';

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    monthlyPrice: 9,
    annualPrice: 7,
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 5 team members',
      '100 tickets/month',
      'Email support',
      'Basic analytics',
      'Standard response time',
      'Knowledge base',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Growth',
    icon: Sparkles,
    monthlyPrice: 29,
    annualPrice: 23,
    description: 'Best for growing businesses',
    features: [
      'Up to 25 team members',
      'Unlimited tickets',
      'Priority email & chat support',
      'Advanced analytics & reports',
      'Custom workflows',
      'API access',
      'SLA management',
      'Team collaboration tools',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    monthlyPrice: 79,
    annualPrice: 63,
    description: 'For large-scale operations',
    features: [
      'Unlimited team members',
      'Unlimited tickets',
      '24/7 dedicated support',
      'Custom analytics & dashboards',
      'Advanced automation',
      'Full API access',
      'SSO & SAML',
      'On-premise deployment',
      'Custom integrations',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen py-20 px-4 relative overflow-hidden"
      style={{
        background: '#071a0e',
        backgroundImage: `
          radial-gradient(circle at 50% 20%, rgba(34,197,94,0.2), transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(34,197,94,0.1), transparent 40%),
          radial-gradient(circle at 20% 60%, rgba(34,197,94,0.08), transparent 40%)
        `,
      }}
    >
      {/* Floating orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-aegis-green/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-aegis-green/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <AegisLogo size="lg" variant="full" />
          </div>
          <h1 className="text-4xl md:text-5xl font-brand font-bold text-aegis-text mb-4">
            Select the Right <span className="text-aegis-green">Aegis</span> Plan
          </h1>
          <p className="text-lg text-aegis-muted font-body max-w-xl mx-auto mb-8">
            Transparent pricing. No hidden fees. Scale your support effortlessly.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['No hidden fees', 'Cancel anytime', '24/7 support'].map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-aegis-green/10 border border-aegis-green/20 text-xs text-aegis-green font-medium"
              >
                <Check size={12} />
                {badge}
              </span>
            ))}
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-aegis-text' : 'text-aegis-muted'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                isAnnual ? 'bg-aegis-green' : 'bg-aegis-border'
              }`}
            >
              <motion.div
                animate={{ x: isAnnual ? 28 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-aegis-text' : 'text-aegis-muted'}`}>
              Annually
              <span className="ml-1.5 text-xs text-aegis-green font-medium">Save 20%</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.name}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: plan.popular ? 1.02 : 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`glass-card p-7 flex flex-col relative ${
                  plan.popular
                    ? 'border-aegis-green/40 green-glow scale-[1.02] md:scale-105'
                    : ''
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-aegis-green text-aegis-dark text-xs font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                    plan.popular
                      ? 'bg-aegis-green/15 text-aegis-green'
                      : 'bg-aegis-surface text-aegis-muted'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-brand font-bold text-aegis-text">{plan.name}</h3>
                  <p className="text-sm text-aegis-muted mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-brand font-bold text-aegis-text">${price}</span>
                    <span className="text-aegis-muted text-sm">/mo</span>
                  </div>
                  {isAnnual && (
                    <p className="text-xs text-aegis-muted mt-1">
                      Billed annually (${price * 12}/yr)
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className="text-aegis-green flex-shrink-0 mt-0.5" />
                      <span className="text-aegis-text/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.popular
                      ? 'aegis-btn'
                      : 'aegis-btn-outline hover:border-aegis-green/50'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-aegis-muted text-sm">
            Need a custom plan?{' '}
            <button className="text-aegis-green hover:text-aegis-green/80 font-medium transition-colors">
              Contact our sales team →
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Dumbbell, Zap, Sparkles } from 'lucide-react';

interface PricingPlan {
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  icon: React.ReactNode;
  features: string[];
  ctaText: string;
  popular?: boolean;
  accentClass: string;
  buttonClass: string;
}

export default function PricingSection({ onSelectPlan }: { onSelectPlan: (plan: string) => void }) {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans: PricingPlan[] = [
    {
      name: 'Foundation',
      tagline: 'Essential 3D telemetry tracking for personal progress.',
      monthlyPrice: 0,
      annualPrice: 0,
      icon: <Dumbbell className="w-5 h-5 text-zinc-400" />,
      features: [
        'Standard 3D skeleton mapping loops',
        'Workout builder and history logging',
        'Basic muscle group telemetry',
        'Community cohort support access',
        'Standard dashboard utilities'
      ],
      ctaText: 'Start Free Trial',
      accentClass: 'border-white/5 bg-zinc-950/40 text-white',
      buttonClass: 'bg-zinc-900 border border-white/10 hover:border-white/20 text-white'
    },
    {
      name: 'Athlete Pro',
      tagline: 'Full interactive biometric analysis with real-time AI guidance.',
      monthlyPrice: 49,
      annualPrice: 39,
      icon: <Zap className="w-5 h-5 text-brand-lime" />,
      features: [
        'Unlimited 3D Biomechanical analysis',
        'Real-time EMG muscle amplitude feedback',
        'Advanced force vector projections',
        '25 Aura AI Coach consultations / mo',
        'Custom body restructuring models',
        'Priority calibration queue support'
      ],
      ctaText: 'Upgrade to Pro',
      popular: true,
      accentClass: 'border-brand-lime/30 bg-zinc-950/60 shadow-[0_0_40px_rgba(204,255,0,0.04)]',
      buttonClass: 'bg-brand-lime text-black font-black hover:bg-white transition-colors duration-200'
    },
    {
      name: 'Neural Elite',
      tagline: 'Unrestricted enterprise capabilities for trainers and coaches.',
      monthlyPrice: 99,
      annualPrice: 79,
      icon: <Sparkles className="w-5 h-5 text-brand-cyan" />,
      features: [
        'Everything in Athlete Pro tier',
        'Unlimited Aura AI Coach consultations',
        'Live skeletal synchronization support',
        'Dedicated biomechanics cohort logs',
        'Raw CSV/JSON data exporting options',
        'Custom API integration nodes'
      ],
      ctaText: 'Claim Elite Pass',
      accentClass: 'border-white/5 bg-zinc-950/40 text-white',
      buttonClass: 'bg-brand-cyan text-black font-black hover:bg-white transition-colors duration-200'
    }
  ];

  return (
    <section id="pricing" className="relative z-10 py-28 border-t border-white/5 bg-black/40">
      
      {/* Laser concentric pedestals decoration */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-lime/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.003)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase block">PLANS & PACKAGES</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
            Unlock <span className="text-brand-lime text-outline-lime">Premium Telemetry</span>
          </h2>
          <p className="text-zinc-550 text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold">
            Select the processing bandwidth matching your structural athletic training scale.
          </p>
        </div>

        {/* Toggle Controls */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-[10px] font-mono font-bold tracking-wider uppercase transition-colors duration-200 ${!isAnnual ? 'text-white' : 'text-zinc-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-zinc-900 border border-white/10 rounded-full p-1 relative flex items-center justify-start cursor-pointer hover:border-white/20 transition-colors"
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-5 h-5 rounded-full bg-brand-lime"
              style={{ x: isAnnual ? 26 : 0 }}
            />
          </button>
          <span className={`text-[10px] font-mono font-bold tracking-wider uppercase transition-colors duration-200 flex items-center gap-1.5 ${isAnnual ? 'text-brand-lime' : 'text-zinc-500'}`}>
            Yearly
            <span className="px-1.5 py-0.5 rounded-full bg-brand-lime/10 border border-brand-lime/20 text-[8px] font-extrabold text-brand-lime uppercase tracking-widest">
              SAVE 20%
            </span>
          </span>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`relative flex flex-col justify-between p-8 border rounded-3xl backdrop-blur-md transition-all duration-300 group ${plan.accentClass}`}
              >
                {/* Popular Glow Ring Effect */}
                {plan.popular && (
                  <div className="absolute inset-0 border border-brand-lime/50 rounded-3xl pointer-events-none group-hover:border-brand-lime transition-all duration-300" />
                )}

                {/* Corner outline highlight on hover */}
                {!plan.popular && (
                  <div className="absolute inset-0 border border-transparent group-hover:border-white/10 rounded-3xl pointer-events-none transition-all duration-300" />
                )}

                {/* Popular Ribbon Tag */}
                {plan.popular && (
                  <div className="absolute -top-3.5 right-6 bg-brand-lime text-black font-mono text-[8px] font-black uppercase tracking-widest py-1 px-3.5 rounded-full shadow-lg shadow-brand-lime/15">
                    RECOMMENDED PLAN
                  </div>
                )}

                {/* Header info */}
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-mono text-[9px] font-bold uppercase tracking-widest block">
                      {plan.name === 'Foundation' ? 'TIER 01 / START' : plan.name === 'Athlete Pro' ? 'TIER 02 / OPTIMAL' : 'TIER 03 / ADVANCED'}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-zinc-900/80 border border-white/5 flex items-center justify-center">
                      {plan.icon}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase tracking-wide text-white">{plan.name}</h3>
                    <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">{plan.tagline}</p>
                  </div>

                  {/* Pricing value layout */}
                  <div className="pt-2 flex items-baseline gap-1 font-mono text-left">
                    <span className="text-3xl font-black text-white">$</span>
                    <span className="text-5xl font-black text-white tracking-tighter">
                      {price}
                    </span>
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest ml-1">
                      / month
                    </span>
                  </div>

                  {isAnnual && price > 0 && (
                    <span className="text-[9px] font-mono text-zinc-500 font-bold block text-left uppercase">
                      Billed annually (${price * 12}/year)
                    </span>
                  )}
                  {!isAnnual && price > 0 && (
                    <span className="text-[9px] font-mono text-zinc-650 font-bold block text-left uppercase">
                      Billed monthly
                    </span>
                  )}
                  {price === 0 && (
                    <span className="text-[9px] font-mono text-zinc-550 font-bold block text-left uppercase">
                      Free forever limits
                    </span>
                  )}

                  {/* Divider line */}
                  <div className="w-full h-px bg-white/5 my-6" />

                  {/* Features list */}
                  <div className="space-y-4">
                    <span className="text-[8px] text-zinc-500 font-mono font-bold tracking-widest uppercase block">
                      FEATURES INCLUDED:
                    </span>
                    <ul className="space-y-3">
                      {plan.features.map((feat, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-300 font-medium leading-snug">
                          <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${plan.popular ? 'text-brand-lime' : 'text-zinc-550'}`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Call to Action */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <button
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-3.5 px-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 ${plan.buttonClass}`}
                  >
                    {plan.ctaText}
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Dumbbell, Utensils, Flag, Sparkles } from 'lucide-react';

export default function CoachDemoWidget() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Stage 0: User types/shows prompt
    // Stage 1: AI displays typing loader
    // Stage 2: AI answers with main text
    // Stage 3: Show Workout Plan card
    // Stage 4: Show Meal Plan card
    // Stage 5: Show Milestones card
    // Loop/restart every 18 seconds
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 7);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto glass-card rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-2xl relative bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
      {/* Top Header */}
      <div className="bg-zinc-50/50 dark:bg-zinc-900/40 px-6 py-4.5 flex items-center justify-between border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center shadow-xs">
            <Bot className="w-4.5 h-4.5 text-brand-lime" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Aura AI Coach</h4>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-brand-lime rounded-full" />
              <span className="text-[10px] text-zinc-500 font-mono font-semibold uppercase tracking-wider">Online & Analyzing</span>
            </div>
          </div>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-brand-lime animate-pulse" />
      </div>

      {/* Chat History Panel */}
      <div className="p-6 space-y-6 h-[480px] flex flex-col justify-end overflow-y-auto bg-gradient-to-b from-transparent to-zinc-50/30 dark:to-zinc-950/40">
        
        {/* User Message (always visible or animated from stage 0) */}
        {step >= 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 justify-end"
          >
            <div className="bg-brand-lime/10 border border-brand-lime/30 text-zinc-800 dark:text-zinc-200 text-xs font-semibold py-3 px-4.5 rounded-2xl rounded-tr-none max-w-[80%] shadow-xs">
              I want to lose 10kg in 5 months.
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-black/5 dark:border-white/5 shadow-xs shrink-0">
              <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            </div>
          </motion.div>
        )}

        {/* AI Reply Typing Indicator */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-brand-lime/15 border border-brand-lime/20 flex items-center justify-center shadow-xs shrink-0">
              <Bot className="w-4.5 h-4.5 text-brand-lime" />
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 py-3.5 px-5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-brand-lime/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-brand-lime/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-brand-lime/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}

        {/* AI Actual Response Content */}
        {step >= 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 flex-col sm:flex-row"
          >
            <div className="w-8 h-8 rounded-full bg-brand-lime/20 dark:bg-brand-lime/15 border border-brand-lime/30 dark:border-brand-lime/20 flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4.5 h-4.5 text-brand-lime" />
            </div>
            <div className="space-y-4 w-full">
              <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 text-zinc-800 dark:text-zinc-300 text-xs font-medium py-3 px-4.5 rounded-2xl rounded-tl-none leading-relaxed shadow-xs">
                Losing 10kg in 5 months is a highly realistic, healthy target (0.5kg per week). I have constructed a personalized workout, nutrition, and milestone plan:
              </div>

              {/* Grid of Dynamic Plan Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Workout Plan Card */}
                <AnimatePresence>
                  {step >= 3 && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="glass-card p-4 rounded-xl border-brand-lime/20 dark:border-brand-lime/10 bg-zinc-50/50 dark:bg-zinc-900/40 relative overflow-hidden group hover:scale-[1.02] hover:border-brand-lime/35 transition-all duration-350 shadow-xs"
                    >
                      <div className="flex items-center gap-2 mb-3 text-brand-lime">
                        <Dumbbell className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Workouts</span>
                      </div>
                      <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-3 font-medium">
                        <li>3x Weight Lifting</li>
                        <li>2x 20m HIIT Cardio</li>
                        <li>Active Recovery Days</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Meal Plan Card */}
                <AnimatePresence>
                  {step >= 4 && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="glass-card p-4 rounded-xl border-brand-cyan/20 dark:border-brand-cyan/10 bg-zinc-50/50 dark:bg-zinc-900/40 relative overflow-hidden group hover:scale-[1.02] hover:border-brand-cyan/35 transition-all duration-350 shadow-xs"
                    >
                      <div className="flex items-center gap-2 mb-3 text-brand-cyan">
                        <Utensils className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Meal Strategy</span>
                      </div>
                      <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-3 font-medium">
                        <li>1,800 kcal Limit</li>
                        <li>145g Protein daily</li>
                        <li>Moderate Carb Intake</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Milestones Card */}
                <AnimatePresence>
                  {step >= 5 && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="glass-card p-4 rounded-xl border-pink-500/20 dark:border-pink-500/10 bg-zinc-50/50 dark:bg-zinc-900/40 relative overflow-hidden group hover:scale-[1.02] hover:border-pink-500/35 transition-all duration-350 shadow-xs"
                    >
                      <div className="flex items-center gap-2 mb-3 text-pink-400">
                        <Flag className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Milestones</span>
                      </div>
                      <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-3 font-medium">
                        <li>Month 1: -2.0 kg</li>
                        <li>Month 3: -6.0 kg</li>
                        <li>Month 5: -10.0 kg</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat input footer (simulated widget UI) */}
      <div className="bg-zinc-50/50 dark:bg-zinc-950/60 p-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
        <span className="text-xs text-zinc-500 font-mono flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-lime" /> Click 'Launch' to access the real AI Coach
        </span>
        <button
          onClick={() => setStep(0)}
          className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white uppercase tracking-wider px-3 py-1.5 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-colors cursor-pointer"
        >
          Replay Demo
        </button>
      </div>
    </div>
  );
}

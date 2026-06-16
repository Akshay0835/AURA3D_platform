'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Salad, Activity, Scale, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

const features = [
  {
    id: 0,
    icon: Cpu,
    title: "AI Workout Generator",
    tagline: "PERSONALIZED REPS & SETS",
    description: "Get a highly customized program tailored to your body metrics, strength levels, and current equipment parameters.",
    accent: "text-lime-600 dark:text-brand-lime bg-brand-lime/10 border-brand-lime/30 dark:border-brand-lime/20",
    color: "#a3e635",
    bullets: ["Biometric muscle load checks", "Progressive overload trackers", "Flexible equipment adjustments"],
    mockup: (
      <div className="space-y-3.5 p-4 sm:p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-black/5 dark:border-white/5 relative overflow-hidden h-full flex flex-col justify-between text-left">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-lime/5 blur-2xl rounded-full" />
        <div className="space-y-1.5">
          <span className="text-[9px] font-mono text-lime-600 dark:text-brand-lime font-bold uppercase tracking-widest block">AI GENERATOR INTERFACE</span>
          <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">Hypertrophy Chest Split</h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Custom volume distribution loaded</p>
        </div>

        <div className="space-y-2 my-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 sm:p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-black/5 dark:border-white/5 text-xs text-zinc-700 dark:text-zinc-300">
            <span className="font-medium">1. Barbell Bench Press</span>
            <span className="font-mono text-lime-600 dark:text-brand-lime font-semibold">4 x 10 reps @ 80kg</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 sm:p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-black/5 dark:border-white/5 text-xs text-zinc-700 dark:text-zinc-300">
            <span className="font-medium">2. Incline Dumbbell flyes</span>
            <span className="font-mono text-lime-600 dark:text-brand-lime font-semibold">3 x 12 reps @ 22kg</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 sm:p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-black/5 dark:border-white/5 text-xs text-zinc-700 dark:text-zinc-300">
            <span className="font-medium">3. Dip Station (Weighted)</span>
            <span className="font-mono text-lime-600 dark:text-brand-lime font-semibold">3 x 8 reps @ +10kg</span>
          </div>
        </div>

        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5 border-t border-black/5 dark:border-white/5 pt-3">
          <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-brand-lime" /> Volume targets synced to dashboard
        </div>
      </div>
    )
  },
  {
    id: 1,
    icon: Salad,
    title: "AI Meal Planner",
    tagline: "INTELLIGENT CALORIC DEFICITS",
    description: "Input target macros and dietary limitations. Our AI engine builds recipes matched to your metabolic rate.",
    accent: "text-cyan-600 dark:text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30 dark:border-brand-cyan/20",
    color: "#06b6d4",
    bullets: ["Custom calorie deficit margins", "Protein synthesis optimization", "Automated shopping checklists"],
    mockup: (
      <div className="space-y-3.5 p-4 sm:p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-black/5 dark:border-white/5 relative overflow-hidden h-full flex flex-col justify-between text-left">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/5 blur-2xl rounded-full" />
        <div className="space-y-1.5">
          <span className="text-[9px] font-mono text-cyan-600 dark:text-brand-cyan font-bold uppercase tracking-widest block">NUTRITIONAL ALIGNMENT</span>
          <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">Daily Calorie Target: 2,200 kcal</h4>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 my-3">
          <div className="p-1.5 sm:p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-black/5 dark:border-white/5 text-center">
            <span className="text-[10px] text-zinc-500 block">Protein</span>
            <span className="text-sm font-mono font-bold text-lime-600 dark:text-brand-lime mt-1 block">150g</span>
            <span className="text-[8px] text-zinc-500 font-mono block whitespace-nowrap">(600 kcal)</span>
          </div>
          <div className="p-1.5 sm:p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-black/5 dark:border-white/5 text-center">
            <span className="text-[10px] text-zinc-500 block">Carbs</span>
            <span className="text-sm font-mono font-bold text-cyan-600 dark:text-brand-cyan mt-1 block">220g</span>
            <span className="text-[8px] text-zinc-500 font-mono block whitespace-nowrap">(880 kcal)</span>
          </div>
          <div className="p-1.5 sm:p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-black/5 dark:border-white/5 text-center">
            <span className="text-[10px] text-zinc-500 block">Fats</span>
            <span className="text-sm font-mono font-bold text-pink-650 dark:text-pink-400 mt-1 block">75g</span>
            <span className="text-[8px] text-zinc-500 font-mono block whitespace-nowrap">(675 kcal)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-zinc-650 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 p-2 rounded-lg">
            <span>Breakfast Omelette</span>
            <span>450 kcal</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-zinc-650 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 p-2 rounded-lg">
            <span>Grilled Salmon & Quinoa</span>
            <span>680 kcal</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    icon: Activity,
    title: "Workout Tracking",
    tagline: "ACTIVE METRIC RECORDING",
    description: "A gorgeous running interface mapping set completions, active workout timers, and progressive volume totals in real time.",
    accent: "text-pink-600 dark:text-pink-400 bg-pink-400/10 border-pink-400/30 dark:border-pink-400/20",
    color: "#ec4899",
    bullets: ["Live running session clocks", "Interactive sets completion", "Historical logs archiving"],
    mockup: (
      <div className="space-y-3.5 p-4 sm:p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-black/5 dark:border-white/5 relative overflow-hidden h-full flex flex-col justify-between text-left">
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-2xl rounded-full" />
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-pink-600 dark:text-pink-400 font-bold uppercase tracking-widest block">LIVE LOGGER</span>
            <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">Push Day Active</h4>
          </div>
          <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-zinc-100 dark:bg-zinc-950 rounded-lg text-lime-600 dark:text-brand-lime font-mono text-[10px] sm:text-xs font-bold border border-black/5 dark:border-brand-lime/20 animate-pulse shrink-0">
            00:42:15
          </div>
        </div>

        <div className="py-1.5">
          <div className="flex justify-between text-[10px] font-semibold text-zinc-550 dark:text-zinc-400 mb-1.5">
            <span>Progress (Sets Completed)</span>
            <span>60%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-950 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
            <div className="h-full bg-brand-lime" style={{ width: '60%' }} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-brand-lime/20 rounded-xl flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-white">Incline DB Press (Set 3)</span>
            <span className="text-[9px] sm:text-[10px] text-lime-600 dark:text-brand-lime font-bold uppercase shrink-0">CHECKED</span>
          </div>
          <div className="p-2 sm:p-3 bg-zinc-50/50 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-xl flex items-center justify-between gap-2 text-zinc-500">
            <span className="text-[11px] sm:text-xs">Tricep Extensions (Set 1)</span>
            <span className="text-[9px] sm:text-[10px] font-mono shrink-0">PENDING</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    icon: Scale,
    title: "BMI Analysis",
    tagline: "PRECISE PHYSICAL COMPOSITION",
    description: "Enter your height and weight to view metric calculations synced against historical timelines, complete with fitness category goals.",
    accent: "text-purple-600 dark:text-purple-400 bg-purple-400/10 border-purple-400/30 dark:border-purple-400/20",
    color: "#a855f7",
    bullets: ["Biometric indexes calculations", "Historical changes plots", "Tailored category recommendations"],
    mockup: (
      <div className="space-y-3.5 p-4 sm:p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-black/5 dark:border-white/5 relative overflow-hidden h-full flex flex-col justify-between text-left">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full" />
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest block">BIOMETRICS CHECK</span>
          <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">Current Weight: 78.5 kg</h4>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3 sm:p-4 rounded-xl border border-black/5 dark:border-white/5 flex items-center justify-between gap-2 my-2">
          <div>
            <span className="text-[10px] text-zinc-550 block">BMI Score</span>
            <span className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">24.2</span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-bold text-cyan-800 dark:text-zinc-900 bg-brand-cyan/20 dark:bg-brand-cyan px-2 py-0.5 rounded-full uppercase whitespace-nowrap">
            Normal range
          </span>
        </div>

        <div className="relative pt-4">
          <div className="w-full h-2 rounded-full flex overflow-hidden">
            <div className="flex-1 bg-blue-500" />
            <div className="flex-1 bg-brand-lime" />
            <div className="flex-1 bg-yellow-500" />
            <div className="flex-1 bg-red-500" />
          </div>
          {/* pointer */}
          <div className="absolute top-2.5 left-[42%] w-2 h-2 bg-white rounded-full border border-black shadow" />
        </div>
      </div>
    )
  },
  {
    id: 4,
    icon: Sparkles,
    title: "Progress Analytics",
    tagline: "COMPREHENSIVE SAAS METRICS",
    description: "Vibrant and interactive dashboards graphing active streaks, weight histories, calories burned, and target completion dates.",
    accent: "text-amber-600 dark:text-amber-400 bg-amber-400/10 border-amber-400/30 dark:border-amber-400/20",
    color: "#f59e0b",
    bullets: ["Goal tracking multipliers", "Completion rate matrices", "Predicted target dates calculations"],
    mockup: (
      <div className="space-y-3.5 p-4 sm:p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-black/5 dark:border-white/5 relative overflow-hidden h-full flex flex-col justify-between text-left">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full" />
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest block">TRAJECTORY ENGINE</span>
          <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">Goal Completion Progress</h4>
        </div>

        <div className="flex justify-between items-center gap-2 sm:gap-4 py-1.5">
          <div className="space-y-1">
            <span className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">59%</span>
            <span className="text-[10px] text-zinc-550 block">Target Achieved</span>
          </div>
          {/* Mock mini radial gauge */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-lime-600/10 border-t-lime-600 dark:border-brand-lime/10 dark:border-t-brand-lime flex items-center justify-center font-mono text-[10px] font-bold text-lime-600 dark:text-brand-lime shrink-0">
            59%
          </div>
        </div>

        <div className="border-t border-black/5 dark:border-white/5 pt-3 space-y-1 sm:space-y-1.5 text-[10px] text-zinc-650 dark:text-zinc-400">
          <div className="flex justify-between">
            <span>Starting weight:</span>
            <span>85.0 kg</span>
          </div>
          <div className="flex justify-between">
            <span>Target weight:</span>
            <span>74.0 kg</span>
          </div>
          <div className="flex justify-between text-lime-600 dark:text-brand-lime font-bold">
            <span>Est. Completion:</span>
            <span>July 28, 2026</span>
          </div>
        </div>
      </div>
    )
  }
];

export default function HorizontalScrollShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);
  const autoplayTimer = useRef<any>(null);

  // Auto-play timer implementation
  useEffect(() => {
    // Reset progress on active tab change
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Trigger next tab
          setActiveTab((curr) => (curr + 1) % features.length);
          return 0;
        }
        return prev + 2; // Increment progress (approx 2.5 seconds total duration per tab)
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="py-24 bg-zinc-50/30 dark:bg-zinc-950/20 max-w-7xl mx-auto px-6 w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left Side: Text controls list (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-lime-600 dark:text-brand-lime font-mono text-sm tracking-widest uppercase block">Feature Portfolio</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight text-left">
              Engineered for Physical Performance
            </h2>
          </div>

          <div className="space-y-3 pt-4">
            {features.map((feat) => {
              const isActive = activeTab === feat.id;
              const Icon = feat.icon;

              return (
                <button
                  key={feat.id}
                  onClick={() => {
                    setActiveTab(feat.id);
                    setProgress(0);
                  }}
                  className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-start gap-4 select-none ${isActive
                      ? 'bg-zinc-100/80 dark:bg-zinc-900/40 border-black/10 dark:border-white/10 text-zinc-900 dark:text-white'
                      : 'bg-transparent border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-black/2 hover:text-zinc-900 dark:hover:bg-white/2 dark:hover:text-zinc-200'
                    }`}
                >
                  {/* Active background indicator timer */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] bg-lime-600 dark:bg-brand-lime"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${isActive ? feat.accent : 'bg-zinc-100 dark:bg-zinc-900/50 border-black/5 dark:border-white/5'
                    }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold tracking-wide">{feat.title}</h4>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed max-w-sm mt-1"
                      >
                        {feat.description}
                      </motion.p>
                    )}
                  </div>

                  <ChevronRight className={`w-4 h-4 ml-auto self-center shrink-0 transition-transform ${isActive ? 'rotate-90 text-lime-600 dark:text-brand-lime' : 'text-zinc-600'
                    }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Animated Mockup canvas (7 Columns) */}
        <div className="lg:col-span-7 w-full h-[380px] md:h-[450px]">
          <div className="w-full h-full glass-card rounded-3xl border border-black/5 dark:border-white/5 relative overflow-hidden flex items-center justify-center p-4 sm:p-8 bg-zinc-100/50 dark:bg-zinc-950/10">

            {/* Ambient glows inside mock dashboard wrapper */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-white dark:to-zinc-950/80 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-brand-cyan/5 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-brand-lime/5 blur-3xl" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, rotateY: -30, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1, y: 0 }}
                exit={{ opacity: 0, rotateY: 30, scale: 0.96, y: -15 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                className="w-full max-w-md h-full flex flex-col justify-center"
              >
                <div className="space-y-4">
                  {/* Detailed visual wrapper */}
                  {features[activeTab].mockup}

                  {/* Highlight key highlights */}
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.08
                        }
                      }
                    }}
                    className="flex flex-wrap gap-2 justify-center"
                  >
                    {features[activeTab].bullets.map((bullet, index) => (
                      <motion.span
                        key={index}
                        variants={{
                          hidden: { opacity: 0, y: 10, scale: 0.9 },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            transition: { type: "spring", stiffness: 300, damping: 20 }
                          }
                        }}
                        className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 px-2.5 py-1 rounded-full uppercase"
                      >
                        {bullet}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}

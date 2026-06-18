'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Salad, 
  Activity, 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface FeatureItem {
  id: number;
  icon: any;
  title: string;
  tagline: string;
  description: string;
  accent: string;
  color: string;
  bullets: string[];
  mockup: React.ReactNode;
}

const features: FeatureItem[] = [
  {
    id: 0,
    icon: Cpu,
    title: "AI Workout Generator",
    tagline: "PERSONALIZED REPS & SETS",
    description: "Get a highly customized program tailored to your body metrics, strength levels, and current equipment parameters.",
    accent: "text-brand-lime border-brand-lime/20 bg-brand-lime/10",
    color: "#ccff00",
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
    accent: "text-brand-cyan border-brand-cyan/20 bg-brand-cyan/10",
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
            <span className="text-[10px] text-zinc-550 block">Protein</span>
            <span className="text-sm font-mono font-bold text-lime-600 dark:text-brand-lime mt-1 block">150g</span>
            <span className="text-[8px] text-zinc-550 font-mono block whitespace-nowrap">(600 kcal)</span>
          </div>
          <div className="p-1.5 sm:p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-black/5 dark:border-white/5 text-center">
            <span className="text-[10px] text-zinc-550 block">Carbs</span>
            <span className="text-sm font-mono font-bold text-cyan-600 dark:text-brand-cyan mt-1 block">220g</span>
            <span className="text-[8px] text-zinc-550 font-mono block whitespace-nowrap">(880 kcal)</span>
          </div>
          <div className="p-1.5 sm:p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-black/5 dark:border-white/5 text-center">
            <span className="text-[10px] text-zinc-550 block">Fats</span>
            <span className="text-sm font-mono font-bold text-pink-500 dark:text-pink-450 mt-1 block">75g</span>
            <span className="text-[8px] text-zinc-550 font-mono block whitespace-nowrap">(675 kcal)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 p-2 rounded-lg">
            <span>Breakfast Omelette</span>
            <span>450 kcal</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 p-2 rounded-lg">
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
    accent: "text-pink-400 border-pink-500/20 bg-pink-500/10",
    color: "#ec4899",
    bullets: ["Live running session clocks", "Interactive sets completion", "Historical logs archiving"],
    mockup: (
      <div className="space-y-3.5 p-4 sm:p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-black/5 dark:border-white/5 relative overflow-hidden h-full flex flex-col justify-between text-left">
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-2xl rounded-full" />
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-pink-650 dark:text-pink-400 font-bold uppercase tracking-widest block">LIVE LOGGER</span>
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
    accent: "text-purple-400 border-purple-500/20 bg-purple-500/10",
    color: "#a855f7",
    bullets: ["Biometric indexes calculations", "Historical changes plots", "Tailored category recommendations"],
    mockup: (
      <div className="space-y-3.5 p-4 sm:p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-black/5 dark:border-white/5 relative overflow-hidden h-full flex flex-col justify-between text-left">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full" />
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-purple-650 dark:text-purple-400 font-bold uppercase tracking-widest block">BIOMETRICS CHECK</span>
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
    accent: "text-amber-450 border-amber-500/20 bg-amber-500/10",
    color: "#f59e0b",
    bullets: ["Goal tracking multipliers", "Completion rate matrices", "Predicted target dates calculations"],
    mockup: (
      <div className="space-y-3.5 p-4 sm:p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-black/5 dark:border-white/5 relative overflow-hidden h-full flex flex-col justify-between text-left">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full" />
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-amber-600 dark:text-amber-450 font-bold uppercase tracking-widest block">TRAJECTORY ENGINE</span>
          <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">Goal Completion Progress</h4>
        </div>

        <div className="flex justify-between items-center gap-2 sm:gap-4 py-1.5">
          <div className="space-y-1">
            <span className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">59%</span>
            <span className="text-[10px] text-zinc-550 block">Target Achieved</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-lime-600/10 border-t-lime-600 dark:border-brand-lime/10 dark:border-t-brand-lime flex items-center justify-center font-mono text-[10px] font-bold text-lime-600 dark:text-brand-lime shrink-0">
            59%
          </div>
        </div>

        <div className="border-t border-black/5 dark:border-white/5 pt-3 space-y-1 sm:space-y-1.5 text-[10px] text-zinc-600 dark:text-zinc-400">
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
  const [windowWidth, setWindowWidth] = useState(1200);

  // Auto-play timer loop
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((curr) => (curr + 1) % features.length);
          return 0;
        }
        return prev + 1.6; // Increment progress (approx 3 seconds per tab)
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const handleNext = () => {
    setActiveTab((prev) => (prev + 1) % features.length);
  };

  const handlePrev = () => {
    setActiveTab((prev) => (prev - 1 + features.length) % features.length);
  };

  // Calculate position styles for circular 3D stacked deck
  const getCardStyles = (idx: number) => {
    let diff = idx - activeTab;
    const count = features.length;
    
    // Wrap around offsets correctly
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;

    const absDiff = Math.abs(diff);
    
    // Responsive translations
    const xOffset = isMobile ? 36 : 170;
    const zOffset = isMobile ? -45 : -90;
    
    const x = diff * xOffset;
    const z = absDiff * zOffset;
    const scale = 1 - absDiff * 0.11;
    const rotateY = -diff * (isMobile ? 12 : 22);
    const opacity = absDiff === 0 ? 1 : absDiff === 1 ? 0.65 : 0.18;
    const zIndex = 30 - absDiff * 10;
    const isActive = diff === 0;

    return {
      x,
      z,
      scale,
      rotateY,
      opacity,
      zIndex,
      isActive
    };
  };

  return (
    <div className="py-24 bg-zinc-50/30 dark:bg-zinc-950/20 max-w-7xl mx-auto px-6 w-full relative">
      <div className="space-y-12 text-center">
        
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase block">Interactive Showcase</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
            Engineered for <span className="text-brand-lime text-outline-lime">Performance</span>
          </h2>
          <p className="text-zinc-500 text-xs leading-relaxed uppercase tracking-wider font-bold">
            Explore the advanced telemetry interfaces designed to maximize physical outcomes.
          </p>
        </div>

        {/* 3D Stack Slider Wrapper */}
        <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center overflow-visible mt-8">
          
          {/* Navigation Arrows */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-12 pointer-events-none z-40">
            <button 
              onClick={handlePrev}
              className="w-11 h-11 rounded-xl bg-black/90 border border-white/5 hover:border-brand-lime flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer pointer-events-auto shadow-2xl"
              title="Previous slide"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext}
              className="w-11 h-11 rounded-xl bg-black/90 border border-white/5 hover:border-brand-lime flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer pointer-events-auto shadow-2xl"
              title="Next slide"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 3D Stack container */}
          <div 
            className="w-full max-w-md h-full relative flex items-center justify-center"
            style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
          >
            {features.map((feat) => {
              const styles = getCardStyles(feat.id);
              
              return (
                <motion.div
                  key={feat.id}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    x: styles.x,
                    z: styles.z,
                    scale: styles.scale,
                    rotateY: styles.rotateY,
                    opacity: styles.opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 18
                  }}
                  onClick={() => styles.isActive ? null : setActiveTab(feat.id)}
                  className={`absolute w-[290px] sm:w-[325px] md:w-[370px] aspect-[4/3] rounded-3xl bg-zinc-950/90 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md ${
                    styles.isActive ? 'cursor-default ring-1 ring-brand-lime/30' : 'cursor-pointer'
                  } z-${styles.zIndex}`}
                >
                  {/* Subtle color highlight in the background of active card */}
                  {styles.isActive && (
                    <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none" />
                  )}

                  <div className="w-full h-full p-2 select-none pointer-events-none">
                    {feat.mockup}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Telemetry Tabs Selector (glowing horizontal pills) */}
        <div className="flex flex-wrap gap-2.5 md:gap-3.5 justify-center max-w-3xl mx-auto pt-6 z-30 relative">
          {features.map((feat) => {
            const isActive = activeTab === feat.id;
            const Icon = feat.icon;
            
            return (
              <button
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className={`relative px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer flex items-center gap-1.5 overflow-hidden ${
                  isActive 
                    ? 'border-brand-lime bg-brand-lime/10 text-brand-lime' 
                    : 'border-white/5 bg-zinc-950/40 text-zinc-550 hover:border-white/15 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{feat.title}</span>

                {/* Pill loading progress indicator line */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-brand-lime"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Glassmorphic diagnostics HUD details console */}
        <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-3xl border border-white/5 bg-zinc-950/40 relative overflow-hidden text-center flex flex-col items-center justify-center space-y-4 backdrop-blur-md">
          {/* subtle scan lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.003)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-brand-lime animate-pulse" />
                <span className="text-brand-lime font-mono text-[10px] font-bold tracking-widest uppercase block">
                  {features[activeTab].tagline}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                {features[activeTab].title}
              </h3>
              
              <p className="text-zinc-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed font-medium">
                {features[activeTab].description}
              </p>

              {/* micro-chip bullets highlight */}
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {features[activeTab].bullets.map((bullet, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-black text-zinc-500 bg-zinc-950 border border-white/5 px-3 py-1.5 rounded-full uppercase"
                  >
                    {bullet}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

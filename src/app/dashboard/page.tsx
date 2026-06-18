'use client';

import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  Activity, 
  Flame, 
  Trophy, 
  Droplet, 
  Moon, 
  ArrowRight, 
  Zap, 
  Target, 
  Cpu, 
  HeartPulse,
  Award,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Animated ECG Heartline helper
// Animated ECG Heartline helper
function EKGHeartline() {
  return (
    <div className="w-full h-20 relative overflow-hidden bg-black/20 dark:bg-zinc-950/40 rounded-xl border border-black/5 dark:border-white/5 flex items-center justify-center p-2">
      <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ekgGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--brand-lime)" stopOpacity="0" />
            <stop offset="15%" stopColor="var(--brand-lime)" stopOpacity="1" />
            <stop offset="85%" stopColor="var(--brand-lime)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--brand-lime)" stopOpacity="0" />
          </linearGradient>
          <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Background Grid Lines */}
        <path d="M 0,20 L 300,20 M 0,40 L 300,40 M 0,60 L 300,60 M 50,0 L 50,80 M 100,0 L 100,80 M 150,0 L 150,80 M 200,0 L 200,80 M 250,0 L 250,80" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
        
        {/* ECG Wave Path */}
        <motion.path
          id="ekgPath"
          d="M 0,40 L 40,40 L 48,32 L 56,48 L 64,40 L 100,40 L 108,15 L 116,65 L 124,40 L 160,40 L 168,32 L 176,48 L 184,40 L 220,40 L 228,10 L 236,70 L 244,40 L 300,40"
          fill="none"
          stroke="url(#ekgGradient)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathOffset: 0 }}
          animate={{ pathOffset: -1 }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "linear"
          }}
        />

        {/* Traveling Laser Point */}
        <circle r="3.5" fill="var(--brand-lime)" filter="url(#laserGlow)">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M 0,40 L 40,40 L 48,32 L 56,48 L 64,40 L 100,40 L 108,15 L 116,65 L 124,40 L 160,40 L 168,32 L 176,48 L 184,40 L 220,40 L 228,10 L 236,70 L 244,40 L 300,40"
          />
        </circle>
        <circle r="1.5" fill="#ffffff">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M 0,40 L 40,40 L 48,32 L 56,48 L 64,40 L 100,40 L 108,15 L 116,65 L 124,40 L 160,40 L 168,32 L 176,48 L 184,40 L 220,40 L 228,10 L 236,70 L 244,40 L 300,40"
          />
        </circle>
      </svg>
    </div>
  );
}

// Custom Macro bar widget
interface MacroBarProps {
  name: string;
  val: string;
  color: string;
  percent: number;
}
function MacroBar({ name, val, color, percent }: MacroBarProps) {
  return (
    <div className="flex flex-col gap-1 font-mono text-[9px] text-zinc-500 dark:text-zinc-400 w-full">
      <div className="flex justify-between font-bold">
        <span>{name}</span>
        <span className="text-zinc-800 dark:text-zinc-200">{val}</span>
      </div>
      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Dual-ring telemetry dial with circular ticks and progress sweeps
interface TelemetryCalorieRingProps {
  value: number;
  goal: number;
  percent: number;
}
function TelemetryCalorieRing({ value, goal, percent }: TelemetryCalorieRingProps) {
  const r = 38;
  const strokeDash = 2 * Math.PI * r;
  const offset = strokeDash * (1 - percent / 100);
  
  return (
    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
      {/* Telemetry Ring */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <defs>
          <filter id="neonGlowRing" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-lime)" />
            <stop offset="100%" stopColor="var(--brand-cyan)" />
          </linearGradient>
        </defs>
        
        {/* Outer dotted telemetry scale */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          stroke="rgba(204,255,0,0.15)" 
          className="dark:stroke-brand-lime/15 stroke-brand-lime/20"
          strokeWidth="1.5" 
          strokeDasharray="2, 5" 
          fill="transparent" 
        />
        
        {/* Inner backing ring */}
        <circle 
          cx="50" 
          cy="50" 
          r={r} 
          stroke="rgba(0,0,0,0.05)" 
          className="dark:stroke-white/5" 
          strokeWidth="6.5" 
          fill="transparent" 
        />
        
        {/* Active progress ring */}
        <motion.circle 
          cx="50" 
          cy="50" 
          r={r} 
          stroke="url(#ringGradient)" 
          strokeWidth="6.5" 
          fill="transparent" 
          strokeDasharray={strokeDash}
          initial={{ strokeDashoffset: strokeDash }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />

        {/* Rotating sweep beacon line */}
        <circle
          cx="50"
          cy="50"
          r="43"
          stroke="var(--brand-lime)"
          className="opacity-20 animate-spin-slow"
          strokeWidth="0.8"
          fill="transparent"
          strokeDasharray="20 180"
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Rotating sweep dot */}
        {percent > 0 && (
          <g style={{ transformOrigin: '50px 50px' }}>
            <circle
              cx={50 + r * Math.cos((percent / 100) * 2 * Math.PI - Math.PI / 2)}
              cy={50 + r * Math.sin((percent / 100) * 2 * Math.PI - Math.PI / 2)}
              r="4.5"
              fill="var(--brand-lime)"
              filter="url(#neonGlowRing)"
            />
            <circle
              cx={50 + r * Math.cos((percent / 100) * 2 * Math.PI - Math.PI / 2)}
              cy={50 + r * Math.sin((percent / 100) * 2 * Math.PI - Math.PI / 2)}
              r="2"
              fill="#ffffff"
            />
          </g>
        )}
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center font-mono">
        <span className="text-2xl font-black text-zinc-900 dark:text-white leading-none">{value}</span>
        <span className="text-[8px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1.5">kcal</span>
      </div>
    </div>
  );
}

// Liquid-wave animated filling hydration gauge with dual-layered waves
function WaterVisualizer({ percent }: { percent: number }) {
  return (
    <div className="relative w-16 h-28 bg-zinc-100 dark:bg-zinc-900/60 border border-black/15 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col justify-end shrink-0 shadow-inner">
      <style>{`
        @keyframes wave-move-1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wave-move-2 {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-wave-1 {
          animation: wave-move-1 4s linear infinite;
        }
        .animate-wave-2 {
          animation: wave-move-2 6s linear infinite;
        }
      `}</style>
      
      {/* Wave container */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-cyan/90 to-brand-cyan overflow-hidden"
        initial={{ height: "0%" }}
        animate={{ height: `${percent}%` }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        {/* Layer 1 wave */}
        <div className="absolute top-0 left-0 w-[200%] h-6 -translate-y-[85%] pointer-events-none">
          <svg viewBox="0 0 120 28" className="w-full h-full fill-brand-cyan opacity-50 animate-wave-1">
            <path d="M0 15 Q 30 5, 60 15 T 120 15 T 180 15 T 240 15 L 240 28 L 0 28 Z" />
          </svg>
        </div>
        {/* Layer 2 wave (offset and slower) */}
        <div className="absolute top-0 left-0 w-[200%] h-6 -translate-y-[85%] pointer-events-none">
          <svg viewBox="0 0 120 28" className="w-full h-full fill-brand-cyan opacity-80 animate-wave-2">
            <path d="M0 15 Q 30 25, 60 15 T 120 15 T 180 15 T 240 15 L 240 28 L 0 28 Z" />
          </svg>
        </div>
      </motion.div>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-black text-zinc-850 dark:text-white mix-blend-difference">
        {percent}%
      </span>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 }
  }
} as const;

export default function DashboardOverview() {
  const { user, bmiHistory, weightHistory, addWater, addSleep, theme } = useAppStore();
  const [pulseBpm, setPulseBpm] = useState(72);

  // Simulate pulse metrics for dashboard feeling
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseBpm(() => Math.floor(70 + Math.random() * 6));
    }, 2000);
    return () => clearInterval(pulseInterval);
  }, []);

  // Get current BMI status
  const currentBmiEntry = bmiHistory[bmiHistory.length - 1];
  const bmiVal = currentBmiEntry ? currentBmiEntry.bmi : 24.2;
  const bmiClass = currentBmiEntry ? currentBmiEntry.classification : 'Normal weight';

  // Calculate calories, water, and sleep percentages
  const calPercent = Math.min(100, Math.round((user.caloriesConsumedToday / user.calorieGoal) * 100));
  const waterPercent = Math.min(100, Math.round((user.waterConsumed / user.waterGoal) * 100));
  const sleepPercent = Math.min(100, Math.round((user.sleepLogged / user.sleepGoal) * 100));

  // Dynamically calculate macros matching today's calories consumed
  const proteinVal = Math.round(user.caloriesConsumedToday * 0.09); // e.g. 148g
  const carbsVal = Math.round(user.caloriesConsumedToday * 0.125);
  const fatsVal = Math.round(user.caloriesConsumedToday * 0.042);

  // BMI indicator offset calculation
  const bmiPercent = Math.max(0, Math.min(100, ((bmiVal - 15) / 20) * 100));

  // Small inline mock sparkline for weight with gradient area fill
  const renderSparkline = () => {
    const weights = weightHistory.map(w => w.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const range = max - min || 1;
    const points = weightHistory.map((w, i) => {
      const x = (i / (weightHistory.length - 1)) * 100;
      const y = 25 - ((w.weight - min) / range) * 18; // Bound inside SVG box
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${points} 100,30 0,30`;
    const lastX = 100;
    const lastY = 25 - ((weights[weights.length - 1] - min) / range) * 18;

    return (
      <div className="relative bg-zinc-100 dark:bg-zinc-950/65 p-3 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
        <svg className="w-full h-12 mt-1" viewBox="0 0 100 30" preserveAspectRatio="none">
          <defs>
            <linearGradient id="weightGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-cyan)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--brand-cyan)" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon fill="url(#weightGlow)" points={areaPoints} />
          <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <polyline
            fill="none"
            stroke="var(--brand-cyan)"
            strokeWidth="1.5"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={lastX} cy={lastY} r="1.5" fill="var(--brand-cyan)" />
        </svg>
      </div>
    );
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Greetings Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4"
      >
        <div className="text-left">
          <div className="flex items-center gap-2 text-brand-lime font-mono text-[9px] font-bold tracking-widest uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>BIOMETRIC TELEMETRY HUD // ALEX_RIVERAS_DEVICE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mt-1">
            Welcome Back, Alex
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">All biological indices are calibrated. Diagnostic feed represents optimal threshold.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-950 text-[10px] font-mono font-bold tracking-widest text-brand-lime shadow-lg border border-brand-lime/20 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-ping" />
            <span>DIAGNOSTIC: ACTIVE</span>
          </div>
          <span className="text-[10px] font-mono font-black uppercase px-3.5 py-2.5 rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-sm backdrop-blur-xs select-none">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* AI Motivation Hologram */}
      <motion.div 
        variants={itemVariants}
        className="glass-card p-5.5 rounded-2xl border-brand-lime/10 relative overflow-hidden bg-gradient-to-r from-brand-lime/5 via-brand-cyan/5 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-border-glow shadow-md"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-lime-700 dark:text-brand-lime shrink-0 shadow-sm shadow-brand-lime/10">
            <Zap className="w-5.5 h-5.5 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75 animate-duration-1000"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-lime"></span>
              </span>
              <h4 className="text-[10px] font-extrabold text-zinc-900 dark:text-white uppercase tracking-widest font-mono">AI BIO-TELEMETRY RECOMMENDATIONS</h4>
            </div>
            <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed mt-1.5 max-w-3xl font-medium">
              "Calories balance: optimal deficit. Weight trend down 0.5kg/week. Hydration levels stabilized at 58% target. Recovery Warning: sleep recorded is 45 mins less than recovery threshold. Drink 500ml water and complete today's cardio block."
            </p>
          </div>
        </div>
        <Link 
          href="/dashboard/coach" 
          className="text-[10px] font-black text-black bg-brand-lime px-5 py-3 rounded-xl flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 shadow-md shadow-brand-lime/15 uppercase tracking-widest font-mono shrink-0"
        >
          Consult AI Coach <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* ASYMMETRICAL TELEMETRY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* CARD 1: PRIMARY BIOMETRIC TELEMETRY HUB (Spans 8 columns) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, border: '1px solid rgba(204,255,0,0.15)' }}
          className="lg:col-span-8 glass-card p-6.5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden text-left group transition-all duration-300"
        >
          {/* Cyber brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/10 dark:border-white/10 rounded-tl pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/10 dark:border-white/10 rounded-tr pointer-events-none" />

          <div className="flex items-center justify-between mb-6 border-b border-black/5 dark:border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 60 / pulseBpm, ease: "easeInOut" }}
                className="w-9 h-9 rounded-xl bg-brand-lime/10 flex items-center justify-center border border-brand-lime/20 shadow-inner"
              >
                <HeartPulse className="w-4.5 h-4.5 text-brand-lime" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">BIOLOGICAL INTENSITY</span>
                <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight font-sans">Biometrics & Metabolic Indices</span>
              </div>
            </div>
            <span className="text-[8px] font-mono text-zinc-400 dark:text-zinc-600 uppercase">NODE: SYS_BIOMETRICS_08</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left side circular gauge & macro tracking (7 columns) */}
            <div className="md:col-span-7 flex items-center gap-6">
              
              {/* Circular Gauge */}
              <TelemetryCalorieRing value={user.caloriesConsumedToday} goal={user.calorieGoal} percent={calPercent} />

              {/* Macro bars */}
              <div className="flex-1 space-y-3.5">
                <MacroBar name="PROTEIN" val={`${proteinVal}g / 160g`} color="var(--brand-lime)" percent={Math.min(100, Math.round((proteinVal/160)*100))} />
                <MacroBar name="CARBOHYDRATES" val={`${carbsVal}g / 220g`} color="var(--brand-cyan)" percent={Math.min(100, Math.round((carbsVal/220)*100))} />
                <MacroBar name="FAT" val={`${fatsVal}g / 75g`} color="#f59e0b" percent={Math.min(100, Math.round((fatsVal/75)*100))} />
              </div>

            </div>

            {/* Right side EKG Wave & pulse stats (5 columns) */}
            <div className="md:col-span-5 flex flex-col justify-between gap-4 border-t md:border-t-0 md:border-l border-black/5 dark:border-white/5 pt-4 md:pt-0 md:pl-6">
              
              <div className="flex justify-between items-center w-full">
                <div className="text-left font-mono">
                  <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">HEART RATE</span>
                  <span className="text-xl font-black text-white">{pulseBpm} <span className="text-[9px] font-medium text-zinc-500">bpm</span></span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">VO2 MAX</span>
                  <span className="text-xl font-black text-brand-lime">52.4 <span className="text-[9px] font-medium text-zinc-500">ml/kg</span></span>
                </div>
              </div>

              {/* ECG visualizer animation */}
              <EKGHeartline />
            </div>
          </div>
          
          <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-3 flex justify-between font-mono text-[9px] text-zinc-500 font-medium uppercase">
            <span>CALORIC STATUS: {calPercent}% GOAL LOADED</span>
            <span>TARGET LIMIT: {user.calorieGoal} kcal</span>
          </div>
        </motion.div>

        {/* CARD 2: ACTIVE STREAK CONSOLE (Spans 4 columns) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, border: '1px solid rgba(245,158,11,0.15)' }}
          className="lg:col-span-4 glass-card p-6.5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden text-left group transition-all duration-300"
        >
          {/* Cyber brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/10 dark:border-white/10 rounded-tl pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/10 dark:border-white/10 rounded-tr pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-center mb-5 border-b border-black/5 dark:border-white/5 pb-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">ACCOMPLISHMENTS</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 transition-colors shadow-xs">
                <Trophy className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="flex items-center gap-4.5 mb-5.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 shadow-sm animate-pulse">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="text-left font-mono">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-none">{user.streak}</span>
                  <span className="text-xs font-bold text-zinc-500 uppercase">Days</span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mt-1.5">Streak Master Level 3</p>
              </div>
            </div>

            {/* Checklist of daily bio completion */}
            <div className="space-y-2 border-t border-black/5 dark:border-white/5 pt-4">
              <div className="flex items-center gap-2.5 text-[10px] text-zinc-700 dark:text-zinc-300 font-mono">
                <CheckCircle2 className="w-4 h-4 text-brand-lime" />
                <span>TRAINING METRICS LOGGED</span>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] text-zinc-700 dark:text-zinc-300 font-mono">
                <CheckCircle2 className="w-4 h-4 text-brand-lime" />
                <span>CALORIC INTAKE UNDER GOAL</span>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-800 flex items-center justify-center shrink-0" />
                <span>HYDRATION TARGET DETECTED</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-between items-center font-mono text-[9px] text-zinc-500 font-medium uppercase border-t border-black/5 dark:border-white/5 pt-3">
            <span>NEXT STREAK RANK: 15 DAYS</span>
            <span className="text-brand-lime font-bold">92% RANK</span>
          </div>
        </motion.div>

        {/* CARD 3: BODY COMPOSITION & BMI (Spans 4 columns) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, border: '1px solid rgba(6,182,212,0.15)' }}
          className="lg:col-span-4 glass-card p-6.5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden text-left group transition-all duration-300"
        >
          {/* Cyber brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/10 dark:border-white/10 rounded-tl pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/10 dark:border-white/10 rounded-tr pointer-events-none" />

          <div>
            <div className="flex justify-between items-center mb-5 border-b border-black/5 dark:border-white/5 pb-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">BODY PROFILE</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-brand-cyan transition-colors shadow-xs">
                <Scale className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-none">{user.weight}</span>
              <span className="text-sm font-bold text-zinc-500 uppercase">kg</span>
            </div>

            <div className="text-[10px] text-zinc-650 dark:text-zinc-400 mt-2 flex items-center gap-1.5 font-mono">
              <Target className="w-4 h-4 text-brand-cyan" /> 
              <span>GOAL: {user.targetWeight}kg (-{Math.max(0, Number((user.weight - user.targetWeight).toFixed(1)))}kg to reach)</span>
            </div>

            {/* Sparkline line graph */}
            <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-4">
              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-mono font-bold uppercase tracking-wider block mb-2">10-Day Progress Trend</span>
              {renderSparkline()}
            </div>
          </div>

          <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-3 text-[9px] text-zinc-500 font-mono font-medium uppercase flex justify-between">
            <span>BMI: {bmiVal}</span>
            <span className="text-brand-cyan font-bold">{bmiClass}</span>
          </div>
        </motion.div>

        {/* CARD 4: FLUID HYDRATION LEVEL (Spans 4 columns) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, border: '1px solid rgba(6,182,212,0.15)' }}
          className="lg:col-span-4 glass-card p-6.5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden text-left group transition-all duration-300"
        >
          {/* Cyber brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/10 dark:border-white/10 rounded-tl pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/10 dark:border-white/10 rounded-tr pointer-events-none" />

          <div>
            <div className="flex justify-between items-center mb-5 border-b border-black/5 dark:border-white/5 pb-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">HYDRATION FLUID</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-brand-cyan transition-colors shadow-xs">
                <Droplet className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="text-left font-mono">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-none">{user.waterConsumed}</span>
                  <span className="text-xs font-bold text-zinc-500 uppercase">ml</span>
                </div>
                <p className="text-[9px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mt-1.5">Goal: {user.waterGoal} ml</p>
                <p className="text-[9px] text-zinc-400 mt-0.5">({Math.max(0, user.waterGoal - user.waterConsumed)} ml remaining)</p>
              </div>

              {/* Wave height level visualizer */}
              <WaterVisualizer percent={waterPercent} />
            </div>
          </div>

          {/* Quick Logging Buttons */}
          <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-4 flex gap-2.5">
            <button 
              onClick={() => addWater(250)}
              className="flex-1 text-[9px] font-extrabold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-black/5 dark:border-white/5 py-2.5 rounded-xl transition-all cursor-pointer font-mono uppercase tracking-widest shadow-xs hover:border-brand-cyan/35"
            >
              +250ml
            </button>
            <button 
              onClick={() => addWater(500)}
              className="flex-1 text-[9px] font-extrabold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-black/5 dark:border-white/5 py-2.5 rounded-xl transition-all cursor-pointer font-mono uppercase tracking-widest shadow-xs hover:border-brand-cyan/35"
            >
              +500ml
            </button>
          </div>
        </motion.div>

        {/* CARD 5: NEURAL RECOVERY SLEEP (Spans 4 columns) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, border: '1px solid rgba(139,92,246,0.15)' }}
          className="lg:col-span-4 glass-card p-6.5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden text-left group transition-all duration-300"
        >
          {/* Cyber brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/10 dark:border-white/10 rounded-tl pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/10 dark:border-white/10 rounded-tr pointer-events-none" />

          <div>
            <div className="flex justify-between items-center mb-5 border-b border-black/5 dark:border-white/5 pb-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-550 uppercase">SLEEP ANALYTICS</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-purple-500 transition-colors shadow-xs">
                <Moon className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-none">{user.sleepLogged}</span>
              <span className="text-xs font-bold text-zinc-550 uppercase">Hours</span>
            </div>
            <p className="text-[9px] text-zinc-500 dark:text-zinc-400 font-mono font-bold uppercase tracking-wider mt-1.5">Goal: {user.sleepGoal} hrs</p>

            {/* Custom Sleep Cycles visualizer */}
            <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-3 flex flex-col gap-1.5 w-full font-mono text-[9px] text-zinc-500 dark:text-zinc-400">
              <div className="flex justify-between font-bold text-[9px] text-zinc-700 dark:text-zinc-300">
                <span>SLEEP CYCLES</span>
                <span className="text-purple-400">{sleepPercent}% GOAL</span>
              </div>
              
              {/* Timeline Node sleep cycle tracker */}
              <div className="relative flex items-center justify-between mt-3 px-2 py-4 bg-black/10 dark:bg-zinc-950/40 rounded-2xl border border-black/5 dark:border-white/5">
                {/* Connecting line */}
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-zinc-200 dark:bg-zinc-850 -translate-y-1/2 z-0" />
                
                {/* Deep Sleep Node */}
                <div className="relative z-10 flex flex-col items-center gap-1 group/node">
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-700 border-2 border-white dark:border-zinc-900 shadow-md group-hover/node:scale-125 transition-transform duration-200" />
                  <span className="text-[7.5px] font-black text-zinc-800 dark:text-white">DEEP</span>
                  <span className="text-[7px] text-zinc-500">1.8h</span>
                </div>
                {/* REM Node */}
                <div className="relative z-10 flex flex-col items-center gap-1 group/node">
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-400 border-2 border-white dark:border-zinc-900 shadow-md group-hover/node:scale-125 transition-transform duration-200" />
                  <span className="text-[7.5px] font-black text-zinc-800 dark:text-white">REM</span>
                  <span className="text-[7px] text-zinc-500">1.4h</span>
                </div>
                {/* Light Node */}
                <div className="relative z-10 flex flex-col items-center gap-1 group/node">
                  <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white dark:border-zinc-900 shadow-md group-hover/node:scale-125 transition-transform duration-200" />
                  <span className="text-[7.5px] font-black text-zinc-800 dark:text-white">LIGHT</span>
                  <span className="text-[7px] text-zinc-500">3.2h</span>
                </div>
                {/* Awake Node */}
                <div className="relative z-10 flex flex-col items-center gap-1 group/node">
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-400 dark:bg-zinc-600 border-2 border-white dark:border-zinc-900 shadow-md group-hover/node:scale-125 transition-transform duration-200" />
                  <span className="text-[7.5px] font-black text-zinc-800 dark:text-white">AWAKE</span>
                  <span className="text-[7px] text-zinc-500">0.8h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Logging Buttons */}
          <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-4 flex gap-2.5">
            <button 
              onClick={() => addSleep(0.5)}
              className="flex-1 text-[9px] font-extrabold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-black/5 dark:border-white/5 py-2.5 rounded-xl transition-all cursor-pointer font-mono uppercase tracking-widest shadow-xs hover:border-purple-500/35"
            >
              +30m
            </button>
            <button 
              onClick={() => addSleep(1)}
              className="flex-1 text-[9px] font-extrabold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-black/5 dark:border-white/5 py-2.5 rounded-xl transition-all cursor-pointer font-mono uppercase tracking-widest shadow-xs hover:border-purple-500/35"
            >
              +1h
            </button>
          </div>
        </motion.div>

      </div>

      {/* QUICK LAUNCH HUB (Bottom rows) */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2"
      >
        <motion.div
          whileHover={{ y: -4, border: '1px solid rgba(204,255,0,0.1)' }}
          className="rounded-2xl overflow-hidden transition-all duration-300"
        >
          <Link 
            href="/dashboard/workout"
            className="glass-card p-6.5 block h-full border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 flex items-center justify-between group transition-all duration-300 shadow-xs hover:shadow-md text-left"
          >
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-brand-lime uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>DYNAMIC WORKOUT ENGINE</span>
              </div>
              <h5 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-wider mt-2.5">AI Program Builder</h5>
              <p className="text-[11px] text-zinc-550 dark:text-zinc-400 mt-1.5 leading-relaxed font-medium">Generate customized hypertrophy splits, strength workloads, and recovery protocols.</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-900 group-hover:bg-brand-lime group-hover:text-black flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-all border border-black/5 dark:border-white/5 shadow-sm">
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, border: '1px solid rgba(6,182,212,0.1)' }}
          className="rounded-2xl overflow-hidden transition-all duration-300"
        >
          <Link 
            href="/dashboard/nutrition"
            className="glass-card p-6.5 block h-full border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 flex items-center justify-between group transition-all duration-300 shadow-xs hover:shadow-md text-left"
          >
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-brand-cyan uppercase">
                <Activity className="w-3.5 h-3.5" />
                <span>METABOLIC MACRO CALIBRATION</span>
              </div>
              <h5 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-wider mt-2.5">AI Meal Configurator</h5>
              <p className="text-[11px] text-zinc-550 dark:text-zinc-400 mt-1.5 leading-relaxed font-medium">Construct macro-specific caloric targets, recipes, and dynamic meal structures.</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-900 group-hover:bg-brand-cyan group-hover:text-black flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-all border border-black/5 dark:border-white/5 shadow-sm">
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>
      </motion.div>

    </motion.div>
  );
}

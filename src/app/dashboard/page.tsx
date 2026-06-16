'use client';

import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { Scale, Activity, Flame, Trophy, Droplet, Moon, ArrowRight, Zap, Target } from 'lucide-react';
import Link from 'next/link';

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

  // Get current BMI status
  const currentBmiEntry = bmiHistory[bmiHistory.length - 1];
  const bmiVal = currentBmiEntry ? currentBmiEntry.bmi : 24.2;
  const bmiClass = currentBmiEntry ? currentBmiEntry.classification : 'Normal weight';

  // Calculate calories, water, and sleep percentages
  const calPercent = Math.min(100, Math.round((user.caloriesConsumedToday / user.calorieGoal) * 100));
  const waterPercent = Math.min(100, Math.round((user.waterConsumed / user.waterGoal) * 100));
  const sleepPercent = Math.min(100, Math.round((user.sleepLogged / user.sleepGoal) * 100));

  // Small inline mock sparkline for weight with gradient area fill
  const renderSparkline = () => {
    const weights = weightHistory.map(w => w.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const range = max - min || 1;
    const points = weightHistory.map((w, i) => {
      const x = (i / (weightHistory.length - 1)) * 100;
      const y = 30 - ((w.weight - min) / range) * 20; // Bound inside SVG box
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${points} 100,30 0,30`;

    return (
      <svg className="w-full h-12 mt-4" viewBox="0 0 100 30" preserveAspectRatio="none">
        <defs>
          <linearGradient id="weightGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon fill="url(#weightGlow)" points={areaPoints} />
        <polyline
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1.5"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  // BMI indicator offset calculation
  const bmiPercent = Math.max(0, Math.min(100, ((bmiVal - 15) / 20) * 100));

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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Workspace Overview</span>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white mt-1">
            Hello, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Here is your physiological status for today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase px-3 py-2 rounded-xl border border-black/5 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 shadow-sm backdrop-blur-xs select-none">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* AI Motivation banner */}
      <motion.div 
        variants={itemVariants}
        className="glass-card p-5.5 rounded-2xl border-brand-lime/10 relative overflow-hidden bg-gradient-to-r from-brand-lime/5 via-brand-cyan/5 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-border-glow shadow-md"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-lime-700 dark:text-brand-lime shrink-0 shadow-sm shadow-brand-lime/10">
            <Zap className="w-5.5 h-5.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75 animate-duration-1000"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-lime"></span>
              </span>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-mono">AI Conditioning Feed</h4>
            </div>
            <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed mt-1.5 max-w-3xl">
              "You are maintaining a perfect deficit. Active weight trend is down 0.5kg/week. Hydration levels look stable, but you logged 45 mins less sleep than your 8-hour recovery threshold. Drink 500ml water and complete today's cardio block."
            </p>
          </div>
        </div>
        <Link 
          href="/dashboard/coach" 
          className="text-[11px] font-bold text-black bg-brand-lime px-4.5 py-3 rounded-xl flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 shadow-md shadow-brand-lime/10"
        >
          Consult Coach <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Main Grid Widgets */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        
        {/* Weight Widget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: theme === 'dark' ? "0 12px 30px rgba(6, 182, 212, 0.15)" : "0 12px 30px rgba(6, 182, 212, 0.08)" }}
          className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 transition-all duration-300 group shadow-xs cursor-pointer"
        >
          <div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">Body Mass</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-brand-cyan dark:group-hover:text-brand-cyan transition-colors border border-black/5 dark:border-white/5 shadow-xs">
                <Scale className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">{user.weight}</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-mono text-sm font-semibold">kg</span>
            </div>
            <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 flex items-center gap-1.5 font-medium">
              <Target className="w-3.5 h-3.5 text-brand-cyan" /> 
              <span>Goal: {user.targetWeight}kg (-{Math.max(0, Number((user.weight - user.targetWeight).toFixed(1)))}kg remaining)</span>
            </div>
          </div>
          {/* Trend graph display */}
          <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-3">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-550 font-mono font-semibold">10-Day Progress Trend</span>
            {renderSparkline()}
          </div>
        </motion.div>

        {/* BMI Widget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: theme === 'dark' ? "0 12px 30px rgba(6, 182, 212, 0.15)" : "0 12px 30px rgba(6, 182, 212, 0.08)" }}
          className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 transition-all duration-300 group shadow-xs cursor-pointer"
        >
          <div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">BMI Index</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-brand-cyan dark:group-hover:text-brand-cyan transition-colors border border-black/5 dark:border-white/5 shadow-xs">
                <Activity className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">{bmiVal}</span>
              </div>
              <span className="inline-block text-[10px] font-extrabold text-black bg-brand-cyan px-2.5 py-1 rounded-lg uppercase font-mono tracking-wider shadow-xs">
                {bmiClass}
              </span>
            </div>
            {/* Horizontal Scale indicator */}
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-900 rounded-full relative mt-6 overflow-visible border border-black/5 dark:border-white/5">
              <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 via-orange-400 to-rose-500 opacity-80" />
              <div 
                className="absolute -top-1 w-3.5 h-3.5 bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-white rounded-full shadow-md transition-all duration-500"
                style={{ left: `calc(${bmiPercent}% - 7px)` }}
              />
            </div>
            <div className="flex justify-between text-[8px] text-zinc-400 dark:text-zinc-500 mt-2.5 font-mono font-bold uppercase tracking-wider">
              <span>15.0</span>
              <span>21.7 (Norm)</span>
              <span>28.0</span>
              <span>35.0</span>
            </div>
          </div>
          <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-3 text-[10px] text-zinc-400 dark:text-zinc-550 font-mono font-medium">
            Based on current height: {user.height}cm
          </div>
        </motion.div>

        {/* Calories Balance Widget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: theme === 'dark' ? "0 12px 30px rgba(163, 230, 53, 0.15)" : "0 12px 30px rgba(163, 230, 53, 0.08)" }}
          className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 transition-all duration-300 group shadow-xs cursor-pointer"
        >
          <div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">Caloric Intake</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-brand-lime dark:group-hover:text-brand-lime transition-colors border border-black/5 dark:border-white/5 shadow-xs">
                <Flame className="w-4.5 h-4.5" />
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{user.caloriesConsumedToday}</span>
                  <span className="text-zinc-400 text-xs">/ {user.calorieGoal} kcal</span>
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                  {Math.max(0, user.calorieGoal - user.caloriesConsumedToday)} kcal remaining
                </div>
              </div>
              
              <div className="relative w-15 h-15 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="30" cy="30" r="25" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" strokeWidth="4" fill="transparent" />
                  <circle 
                    cx="30" 
                    cy="30" 
                    r="25" 
                    stroke="var(--brand-lime)" 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 25}
                    strokeDashoffset={2 * Math.PI * 25 * (1 - calPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <Flame className="w-4 h-4 text-brand-lime absolute animate-pulse" />
              </div>
            </div>
          </div>
          <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-3 text-[10px] text-zinc-400 dark:text-zinc-550 flex justify-between font-mono font-medium">
            <span>Overall: {calPercent}%</span>
            <span>Target Deficit: -500 kcal</span>
          </div>
        </motion.div>

        {/* Active Streak Widget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: theme === 'dark' ? "0 12px 30px rgba(245, 158, 11, 0.15)" : "0 12px 30px rgba(245, 158, 11, 0.08)" }}
          className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 transition-all duration-300 group shadow-xs cursor-pointer animate-pulse-lime"
        >
          <div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">Active Streak</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-550 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-500 transition-colors border border-black/5 dark:border-white/5 shadow-xs">
                <Trophy className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-500 shrink-0 shadow-sm animate-bounce-slow">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">{user.streak}</span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-mono text-sm font-semibold">Days</span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Level 3 Streak Master</p>
              </div>
            </div>
          </div>
          <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-3 text-[10px] text-zinc-400 dark:text-zinc-550 flex justify-between items-center font-mono font-medium">
            <span>Next Goal: 15 Days</span>
            <span className="text-brand-lime font-bold">92% rank</span>
          </div>
        </motion.div>

        {/* Water Intake Widget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: theme === 'dark' ? "0 12px 30px rgba(6, 182, 212, 0.15)" : "0 12px 30px rgba(6, 182, 212, 0.08)" }}
          className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 transition-all duration-300 group shadow-xs cursor-pointer animate-pulse-cyan"
        >
          <div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">Water Intake</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-brand-cyan dark:group-hover:text-brand-cyan transition-colors border border-black/5 dark:border-white/5 shadow-xs">
                <Droplet className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{user.waterConsumed}</span>
                  <span className="text-zinc-400 text-xs">/ {user.waterGoal} ml</span>
                </div>
                <div className="text-[10px] text-zinc-550 dark:text-zinc-400 font-medium">
                  {Math.max(0, user.waterGoal - user.waterConsumed)} ml remaining
                </div>
              </div>
              
              <div className="relative w-15 h-15 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="30" cy="30" r="25" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" strokeWidth="4" fill="transparent" />
                  <circle 
                    cx="30" 
                    cy="30" 
                    r="25" 
                    stroke="#06b6d4" 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 25}
                    strokeDashoffset={2 * Math.PI * 25 * (1 - waterPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <Droplet className="w-4 h-4 text-brand-cyan absolute animate-bounce" />
              </div>
            </div>
          </div>
          {/* Quick Logging Buttons */}
          <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-3 flex gap-2.5">
            <button 
              onClick={() => addWater(250)}
              className="flex-1 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-black/5 dark:border-white/5 py-2 rounded-xl transition-all cursor-pointer font-mono"
            >
              +250ml
            </button>
            <button 
              onClick={() => addWater(500)}
              className="flex-1 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-black/5 dark:border-white/5 py-2 rounded-xl transition-all cursor-pointer font-mono"
            >
              +500ml
            </button>
          </div>
        </motion.div>

        {/* Sleep Hours Widget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: theme === 'dark' ? "0 12px 30px rgba(139, 92, 246, 0.15)" : "0 12px 30px rgba(139, 92, 246, 0.08)" }}
          className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 transition-all duration-300 group shadow-xs cursor-pointer"
        >
          <div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">Sleep Tracker</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-purple-500 dark:group-hover:text-purple-500 transition-colors border border-black/5 dark:border-white/5 shadow-xs">
                <Moon className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{user.sleepLogged}</span>
                  <span className="text-zinc-400 text-xs">/ {user.sleepGoal} hrs</span>
                </div>
                <div className="text-[10px] text-zinc-550 dark:text-zinc-400 font-medium">
                  {Math.max(0, user.sleepGoal - user.sleepLogged).toFixed(1)} hrs remaining
                </div>
              </div>
              
              <div className="relative w-15 h-15 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="30" cy="30" r="25" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" strokeWidth="4" fill="transparent" />
                  <circle 
                    cx="30" 
                    cy="30" 
                    r="25" 
                    stroke="#8b5cf6" 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 25}
                    strokeDashoffset={2 * Math.PI * 25 * (1 - sleepPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <Moon className="w-4 h-4 text-purple-400 absolute" />
              </div>
            </div>
          </div>
          {/* Quick Logging Buttons */}
          <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-3 flex gap-2.5">
            <button 
              onClick={() => addSleep(0.5)}
              className="flex-1 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-black/5 dark:border-white/5 py-2 rounded-xl transition-all cursor-pointer font-mono"
            >
              +30m
            </button>
            <button 
              onClick={() => addSleep(1)}
              className="flex-1 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-black/5 dark:border-white/5 py-2 rounded-xl transition-all cursor-pointer font-mono"
            >
              +1h
            </button>
          </div>
        </motion.div>

      </motion.div>

      {/* Quick Launch Actions */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2"
      >
        <motion.div
          whileHover={{ y: -4, boxShadow: theme === 'dark' ? "0 12px 30px rgba(163, 230, 53, 0.12)" : "0 12px 30px rgba(163, 230, 53, 0.06)" }}
          className="rounded-2xl overflow-hidden"
        >
          <Link 
            href="/dashboard/workout"
            className="glass-card p-6 block h-full border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 flex items-center justify-between group transition-all duration-300 shadow-xs hover:shadow-md"
          >
            <div>
              <h5 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">Dynamic Program Builder</h5>
              <p className="text-[11px] text-zinc-550 dark:text-zinc-400 mt-1.5 leading-relaxed">Generate custom splits and training volumes tailored by AI models.</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-900 group-hover:bg-brand-lime group-hover:text-black flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-all border border-black/5 dark:border-white/5 shadow-sm">
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, boxShadow: theme === 'dark' ? "0 12px 30px rgba(6, 182, 212, 0.12)" : "0 12px 30px rgba(6, 182, 212, 0.06)" }}
          className="rounded-2xl overflow-hidden"
        >
          <Link 
            href="/dashboard/nutrition"
            className="glass-card p-6 block h-full border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 flex items-center justify-between group transition-all duration-300 shadow-xs hover:shadow-md"
          >
            <div>
              <h5 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">AI Meal Configurator</h5>
              <p className="text-[11px] text-zinc-555 dark:text-zinc-400 mt-1.5 leading-relaxed">Craft target metabolic profiles and compile macro-specific recipes.</p>
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

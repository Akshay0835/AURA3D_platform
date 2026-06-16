'use client';

import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Moon, Flame, Trophy, Play, ArrowRight, RefreshCw, X } from 'lucide-react';
import Link from 'next/link';

interface InsightsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function InsightsPanel({ isOpen = false, onClose }: InsightsPanelProps) {
  const { user, activeRoutine, liveWorkoutTimer, addWater, resetWater, addSleep } = useAppStore();

  const waterPercent = Math.min(100, Math.round((user.waterConsumed / user.waterGoal) * 100));
  const sleepPercent = Math.min(100, Math.round((user.sleepLogged / user.sleepGoal) * 100));
  
  // Calculate total protein/carbs/fats logged today from food entries
  const foodEntries = useAppStore((state) => state.foodEntries);
  const totalProtein = foodEntries.reduce((acc, f) => acc + f.protein, 0);
  const totalCarbs = foodEntries.reduce((acc, f) => acc + f.carbs, 0);
  const totalFats = foodEntries.reduce((acc, f) => acc + f.fats, 0);

  // Targets based on 2200 kcal calorie goal
  const proteinGoal = 150; // g
  const carbsGoal = 220; // g
  const fatsGoal = 75; // g

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      <aside className={`glass-card flex flex-col gap-6 h-screen fixed inset-y-0 right-0 xl:sticky top-0 transition-all duration-300 z-50 xl:z-20 border-l border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950/90 xl:bg-white/30 xl:dark:bg-zinc-950/30 p-6 overflow-y-auto w-80 ${
        isOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
      }`}>
        
        {/* Title */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-wide">Daily Insights</h3>
            <p className="text-xs text-zinc-500 font-medium">Real-time metabolic overview</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-black/5 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white xl:hidden"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      {/* Active Workout Tracker Status */}
      <AnimatePresence>
        {activeRoutine && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 rounded-2xl bg-brand-lime/10 border border-brand-lime/30 relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 w-2 h-2 bg-brand-lime rounded-full animate-ping" />
            <span className="text-[10px] font-mono font-bold text-brand-lime uppercase tracking-wider block mb-1">Active Routine</span>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">{activeRoutine.name}</h4>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs font-mono font-semibold text-zinc-650 dark:text-zinc-300">Timer: {formatTimer(liveWorkoutTimer)}</span>
              <Link 
                href="/dashboard/workout"
                className="text-[10px] font-bold text-black bg-brand-lime px-2.5 py-1 rounded-lg flex items-center gap-1 hover:opacity-90"
              >
                Resume <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calorie Burn Widget */}
      <div className="glass-card p-4.5 rounded-2xl flex items-center justify-between relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Energy Burned</span>
          <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{user.caloriesBurnedToday} kcal</h4>
          <span className="text-[10px] text-zinc-550 dark:text-zinc-400 font-medium block">Goal: {user.caloriesBurnedGoal} kcal</span>
        </div>
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="28" cy="28" r="23" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" strokeWidth="4.5" fill="transparent" />
            <circle 
              cx="28" 
              cy="28" 
              r="23" 
              stroke="#a3e635" 
              strokeWidth="4.5" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 23}
              strokeDashoffset={2 * Math.PI * 23 * (1 - Math.min(1, user.caloriesBurnedToday / user.caloriesBurnedGoal))}
              strokeLinecap="round"
            />
          </svg>
          <Flame className="w-4 h-4 text-brand-lime absolute" />
        </div>
      </div>

      {/* Water Intake Widget */}
      <div className="glass-card p-4.5 rounded-2xl space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Hydration Log</span>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">{user.waterConsumed} ml</h4>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium block">Target: {user.waterGoal} ml ({waterPercent}%)</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={resetWater}
              className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 text-zinc-500 hover:text-black dark:hover:text-white"
              title="Reset"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Droplet className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
          <motion.div 
            className="h-full bg-blue-500" 
            animate={{ width: `${waterPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addWater(250)}
            className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-black/5 dark:border-white/5 py-2 rounded-lg text-center transition-colors font-mono"
          >
            + 250ml
          </button>
          <button
            onClick={() => addWater(500)}
            className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-black/5 dark:border-white/5 py-2 rounded-lg text-center transition-colors font-mono"
          >
            + 500ml
          </button>
        </div>
      </div>

      {/* Sleep Tracker Widget */}
      <div className="glass-card p-4.5 rounded-2xl space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Rest & Recovery</span>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">{user.sleepLogged.toFixed(1)} hrs</h4>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium block">Target: {user.sleepGoal} hrs ({sleepPercent}%)</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Moon className="w-4 h-4 text-purple-400" />
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
          <motion.div 
            className="h-full bg-purple-500" 
            animate={{ width: `${sleepPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addSleep(0.5)}
            className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-black/5 dark:border-white/5 py-2 rounded-lg text-center transition-colors font-mono"
          >
            + 30 mins
          </button>
          <button
            onClick={() => addSleep(1.0)}
            className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-black/5 dark:border-white/5 py-2 rounded-lg text-center transition-colors font-mono"
          >
            + 1 hour
          </button>
        </div>
      </div>

      {/* Macro Split Summary */}
      <div className="glass-card p-4.5 rounded-2xl space-y-4">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block font-semibold">Today's Macro Ratios</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium block font-mono">Log meals to hit targets</span>
        </div>

        <div className="space-y-3">
          {/* Protein */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium text-zinc-700 dark:text-zinc-300 font-mono">
              <span className="text-brand-lime">Protein</span>
              <span>{totalProtein}g / {proteinGoal}g</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-lime" 
                style={{ width: `${Math.min(100, (totalProtein / proteinGoal) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium text-zinc-700 dark:text-zinc-300 font-mono">
              <span className="text-brand-cyan">Carbs</span>
              <span>{totalCarbs}g / {carbsGoal}g</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-cyan" 
                style={{ width: `${Math.min(100, (totalCarbs / carbsGoal) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Fats */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium text-zinc-700 dark:text-zinc-300 font-mono">
              <span className="text-pink-400">Fats</span>
              <span>{totalFats}g / {fatsGoal}g</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-400" 
                style={{ width: `${Math.min(100, (totalFats / fatsGoal) * 100)}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badges Achievements */}
      <div className="glass-card p-4.5 rounded-2xl flex items-center gap-3 border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-950/20 mt-auto">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>
        <div className="overflow-hidden">
          <h6 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Active Streak Master</h6>
          <p className="text-[10px] text-zinc-550 dark:text-zinc-500">14 days and counting!</p>
        </div>
      </div>
      </aside>
    </>
  );
}

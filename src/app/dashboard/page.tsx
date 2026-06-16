'use client';

import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { Scale, Activity, Flame, Trophy, Droplet, Moon, ArrowRight, Zap, Target } from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const { user, bmiHistory, weightHistory } = useAppStore();

  // Get current BMI status
  const currentBmiEntry = bmiHistory[bmiHistory.length - 1];
  const bmiVal = currentBmiEntry ? currentBmiEntry.bmi : 24.2;
  const bmiClass = currentBmiEntry ? currentBmiEntry.classification : 'Normal weight';

  // Calculate calories balance
  const calPercent = Math.min(100, Math.round((user.caloriesConsumedToday / user.calorieGoal) * 100));
  const waterPercent = Math.min(100, Math.round((user.waterConsumed / user.waterGoal) * 100));
  const sleepPercent = Math.min(100, Math.round((user.sleepLogged / user.sleepGoal) * 100));

  // Small inline mock sparkline for weight
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

    return (
      <svg className="w-full h-10 mt-3" viewBox="0 0 100 30">
        <polyline
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Greetings Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Workspace Overview</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">
            Hello, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Here is your physiological status for today.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-zinc-550 dark:text-zinc-500 font-bold uppercase px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5 bg-zinc-100/50 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* AI Motivation banner */}
      <div className="glass-card p-5 rounded-2xl border-brand-lime/10 relative overflow-hidden bg-gradient-to-r from-brand-lime/5 via-brand-cyan/5 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-lime-700 dark:text-brand-lime shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">AI Conditioning Analysis</h4>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed mt-1 max-w-2xl">
              "You are maintaining a perfect deficit. Active weight trend is down 0.5kg/week. Hydration levels look stable, but you logged 45 mins less sleep than your 8-hour recovery threshold. Drink 500ml water and complete today's cardio block."
            </p>
          </div>
        </div>
        <Link 
          href="/dashboard/coach" 
          className="text-xs font-bold text-black bg-brand-lime px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:opacity-95 shrink-0"
        >
          Consult Coach <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Grid Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Weight Widget */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all group">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">Body Mass</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors border border-black/5 dark:border-white/5">
                <Scale className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{user.weight}</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-mono text-sm">kg</span>
            </div>
            <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-brand-cyan" /> Goal: {user.targetWeight}kg (-{Math.max(0, Number((user.weight - user.targetWeight).toFixed(1)))}kg remaining)
            </div>
          </div>
          {/* Trend graph display */}
          <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-2">
            <span className="text-[10px] text-zinc-500 font-mono">10-Day Trend</span>
            {renderSparkline()}
          </div>
        </div>

        {/* BMI Widget */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all group">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">BMI Index</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors border border-black/5 dark:border-white/5">
                <Activity className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{bmiVal}</span>
            </div>
            <span className="inline-block mt-2.5 text-[10px] font-bold text-zinc-900 bg-brand-cyan px-2.5 py-0.5 rounded-full uppercase font-mono">
              {bmiClass}
            </span>
          </div>
          <div className="mt-6 border-t border-black/5 dark:border-white/5 pt-3 text-[11px] text-zinc-500 font-mono">
            Based on height: {user.height}cm
          </div>
        </div>

        {/* Calories Balance Widget */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all group">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">Caloric Intake</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors border border-black/5 dark:border-white/5">
                <Flame className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{user.caloriesConsumedToday}</span>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm">/ {user.calorieGoal} kcal</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-3.5 border border-black/5 dark:border-white/5">
              <div className="bg-brand-lime h-full animate-theme-load" style={{ width: `${calPercent}%` }} />
            </div>
          </div>
          <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-3 text-[11px] text-zinc-500 flex justify-between font-mono">
            <span>Progress: {calPercent}%</span>
            <span>Target deficit: -500 kcal</span>
          </div>
        </div>

        {/* Active Streak Widget */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all group">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">Active Streak</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors border border-black/5 dark:border-white/5">
                <Trophy className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{user.streak}</span>
              <span className="text-zinc-550 dark:text-zinc-400 font-mono text-sm">Days</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2">Maintain training consistency to retain this streak status.</p>
          </div>
          <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-3 text-[11px] text-zinc-500 flex justify-between items-center font-mono">
            <span>Next Goal: 15 Days</span>
            <span className="text-lime-700 dark:text-brand-lime font-bold">92% rank</span>
          </div>
        </div>

        {/* Water Intake Widget */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all group">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">Water Intake</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors border border-black/5 dark:border-white/5">
                <Droplet className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{user.waterConsumed}</span>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm">/ {user.waterGoal} ml</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-3.5 border border-black/5 dark:border-white/5">
              <div className="bg-blue-500 h-full" style={{ width: `${waterPercent}%` }} />
            </div>
          </div>
          <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-3 text-[11px] text-zinc-500 flex justify-between font-mono">
            <span>Logged: {waterPercent}%</span>
            <span>+250ml logged 1h ago</span>
          </div>
        </div>

        {/* Sleep Hours Widget */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all group">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold font-mono tracking-wider text-zinc-500 uppercase">Sleep tracker</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors border border-black/5 dark:border-white/5">
                <Moon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{user.sleepLogged}</span>
              <span className="text-zinc-550 dark:text-zinc-400 text-sm">/ {user.sleepGoal} hrs</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-3.5 border border-black/5 dark:border-white/5">
              <div className="bg-purple-500 h-full" style={{ width: `${sleepPercent}%` }} />
            </div>
          </div>
          <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-3 text-[11px] text-zinc-500 flex justify-between font-mono">
            <span>Recovery: {sleepPercent}%</span>
            <span>Optimal sleep target</span>
          </div>
        </div>

      </div>

      {/* Quick Launch Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <Link 
          href="/dashboard/workout"
          className="glass-card p-5 rounded-2xl border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 flex items-center justify-between group transition-all"
        >
          <div>
            <h5 className="text-sm font-bold text-zinc-900 dark:text-white">Need a dynamic program?</h5>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Generate a customized routine using the AI Program builder.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 group-hover:bg-brand-lime group-hover:text-black flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-all border border-black/5 dark:border-white/5">
            <ArrowRight className="w-5 h-5 animate-theme-arrow" />
          </div>
        </Link>

        <Link 
          href="/dashboard/nutrition"
          className="glass-card p-5 rounded-2xl border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 flex items-center justify-between group transition-all"
        >
          <div>
            <h5 className="text-sm font-bold text-zinc-900 dark:text-white">Create a meal configuration?</h5>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Use AI recipe generation matching target metabolic weights.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 group-hover:bg-brand-cyan group-hover:text-black flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-all border border-black/5 dark:border-white/5">
            <ArrowRight className="w-5 h-5 animate-theme-arrow" />
          </div>
        </Link>
      </div>

    </div>
  );
}

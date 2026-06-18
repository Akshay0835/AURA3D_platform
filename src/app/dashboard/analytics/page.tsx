'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { LineChart, Calendar, Sparkles, TrendingDown, Target, Award } from 'lucide-react';

// Macro Colors
const MACRO_COLORS = ['url(#pieProteinGrad)', 'url(#pieCarbsGrad)', 'url(#pieFatsGrad)'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const HUDTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-zinc-950/85 backdrop-blur-md border border-black/10 dark:border-white/10 p-3 rounded-xl shadow-xl font-mono text-[9px] text-left">
        <p className="font-extrabold text-zinc-900 dark:text-white mb-2 uppercase tracking-widest text-[8px] border-b border-black/5 dark:border-white/5 pb-1">
          // LOG_INDEX: {label}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            const color = entry.color || entry.fill;
            // Map the linearGradient URL back to its base color for display if necessary
            let displayColor = color;
            if (typeof color === 'string' && color.includes('pieProteinGrad')) displayColor = 'var(--brand-lime)';
            if (typeof color === 'string' && color.includes('pieCarbsGrad')) displayColor = 'var(--brand-cyan)';
            if (typeof color === 'string' && color.includes('pieFatsGrad')) displayColor = '#ec4899';
            
            return (
              <div key={index} className="flex items-center gap-3.5 justify-between">
                <span className="flex items-center gap-1.5 text-zinc-550 dark:text-zinc-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: displayColor }} />
                  <span className="uppercase">{entry.name}:</span>
                </span>
                <span className="font-extrabold" style={{ color: displayColor }}>
                  {entry.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { user, weightHistory, calorieHistory, workoutHistory, theme } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [weightRange, setWeightRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Weight History Ranges Mock Data
  const weightDataDaily = weightHistory;
  const weightDataWeekly = [
    { date: 'Wk 1', weight: 83.2 },
    { date: 'Wk 2', weight: 82.5 },
    { date: 'Wk 3', weight: 81.9 },
    { date: 'Wk 4', weight: 81.0 },
    { date: 'Wk 5', weight: 80.4 },
    { date: 'Wk 6', weight: 79.8 },
    { date: 'Wk 7', weight: 79.0 },
    { date: 'Wk 8', weight: 78.5 }
  ];
  const weightDataMonthly = [
    { date: 'Jan', weight: 85.0 },
    { date: 'Feb', weight: 84.1 },
    { date: 'Mar', weight: 82.8 },
    { date: 'Apr', weight: 81.2 },
    { date: 'May', weight: 79.8 },
    { date: 'Jun', weight: 78.5 }
  ];

  const getWeightData = () => {
    if (weightRange === 'daily') return weightDataDaily;
    if (weightRange === 'monthly') return weightDataMonthly;
    return weightDataWeekly;
  };

  // Workout completion rates from history
  const workoutPerformanceData = workoutHistory.slice().reverse().map(h => ({
    name: h.name.length > 12 ? `${h.name.substring(0, 10)}...` : h.name,
    completion: h.completionRate,
    missed: 100 - h.completionRate
  }));

  // Macronutrient Pie Chart splits
  const foodEntries = useAppStore.getState().foodEntries;
  const totalProtein = foodEntries.reduce((acc, f) => acc + f.protein, 0) || 120;
  const totalCarbs = foodEntries.reduce((acc, f) => acc + f.carbs, 0) || 190;
  const totalFats = foodEntries.reduce((acc, f) => acc + f.fats, 0) || 65;

  const macroPieData = [
    { name: 'Protein', value: totalProtein },
    { name: 'Carbs', value: totalCarbs },
    { name: 'Fats', value: totalFats }
  ];

  // Calorie History Stacked Bar Data (1g Protein = 4kcal, 1g Carbs = 4kcal, 1g Fat = 9kcal)
  const stackedCalorieData = calorieHistory.map(day => ({
    date: day.date,
    Protein: Math.round(day.protein * 4),
    Carbs: Math.round(day.carbs * 4),
    Fats: Math.round(day.fats * 9)
  }));

  // Goal Progress (Radial Progress)
  // Let's assume starting weight was 85.0kg, target is 74.0kg. Current is 78.5kg.
  // Achieved loss: 85 - 78.5 = 6.5kg. Total target loss: 85 - 74 = 11kg.
  // Percentage = 6.5 / 11 = 59%
  const startWeight = 85.0;
  const targetWeight = user.targetWeight;
  const currentWeight = user.weight;
  const achievedLoss = startWeight - currentWeight;
  const totalNeededLoss = startWeight - targetWeight;
  const progressPercent = Math.round((achievedLoss / totalNeededLoss) * 100);

  const radialGoalData = [
    {
      name: 'Weight Target',
      value: progressPercent,
      fill: '#a3e635'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Deep Metrics</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">Advanced Analytics</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Verify performance splits, weights trends and target completion rates.</p>
        </div>
        
        {/* Weight Toggle options */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-1 rounded-xl shrink-0 self-start md:self-auto">
          {(['daily', 'weekly', 'monthly'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setWeightRange(range)}
              className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors ${
                weightRange === range ? 'bg-brand-lime text-black' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Charts Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. Weight Area Chart (8 Columns) */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Weight Tracking</h3>
            <span className="text-[10px] font-mono text-brand-lime font-bold uppercase">Average decline: -0.62kg/wk</span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={getWeightData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-cyan)" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="var(--brand-cyan)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="weightLineGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--brand-cyan)" />
                    <stop offset="100%" stopColor="var(--brand-lime)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke={theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={9} tickLine={false} className="font-mono" />
                <YAxis stroke="#71717a" fontSize={9} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} className="font-mono" />
                <Tooltip content={<HUDTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="url(#weightLineGlow)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#weightGlow)"
                  dot={{ fill: 'var(--brand-cyan)', stroke: theme === 'dark' ? '#18181b' : '#ffffff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--brand-lime)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Goal Progress Radial Chart (4 Columns) */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div className="pb-2 border-b border-black/5 dark:border-white/5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Goal Progress</h3>
            <span className="text-[10px] text-zinc-500 font-mono">Weight loss trajectory</span>
          </div>

          <div className="relative h-[160px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="65%" 
                outerRadius="90%" 
                barSize={12} 
                data={radialGoalData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  dataKey="value"
                  cornerRadius={99}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-none">{progressPercent}%</span>
              <p className="text-[9px] font-black text-brand-lime font-mono uppercase tracking-wider mt-1.5">// Completed</p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/5">
            <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-mono">
              <span className="flex items-center gap-1.5"><TrendingDown className="w-4 h-4 text-brand-lime" /> LOST</span>
              <span className="font-extrabold">{achievedLoss.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-mono">
              <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-brand-cyan" /> REMAINING</span>
              <span className="font-extrabold">{(currentWeight - targetWeight).toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-mono">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-pink-500" /> TARGET DATE</span>
              <span className="font-extrabold text-zinc-650 dark:text-zinc-400">July 28, 2026</span>
            </div>
          </div>
        </div>

      </div>

      {/* Second Row: Workout performance bar & stacked daily macros */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 3. Workout Performance Bar Chart (6 columns) */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-4">
          <div className="pb-2 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Workout Volume Performance</h3>
              <p className="text-[10px] text-zinc-500 font-mono">Completion rates vs missed sets</p>
            </div>
            <span className="text-[8px] font-mono text-zinc-400">SYS_WORKOUT_04</span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={workoutPerformanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="barCompletionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-lime)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--brand-lime)" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="barMissedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'} />
                    <stop offset="100%" stopColor={theme === 'dark' ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)'} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke={theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} className="font-mono" />
                <YAxis stroke="#71717a" fontSize={9} tickLine={false} className="font-mono" />
                <Tooltip content={<HUDTooltip />} />
                <Bar dataKey="completion" name="Completed sets (%)" fill="url(#barCompletionGrad)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="missed" name="Missed sets (%)" fill="url(#barMissedGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Macro Splits Donut & Stacked Calorie Chart (6 columns) */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-4">
          <div className="pb-2 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Weekly Calorie Composition</h3>
              <p className="text-[10px] text-zinc-500 font-mono">Macronutrient split & stacking (kcal)</p>
            </div>
            <span className="text-[8px] font-mono text-zinc-400">SYS_MACROS_02</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Donut chart for active macro ratios */}
            <div className="sm:col-span-5 h-[160px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <defs>
                    <linearGradient id="pieProteinGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--brand-lime)" />
                      <stop offset="100%" stopColor="#84cc16" />
                    </linearGradient>
                    <linearGradient id="pieCarbsGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--brand-cyan)" />
                      <stop offset="100%" stopColor="#0891b2" />
                    </linearGradient>
                    <linearGradient id="pieFatsGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#db2777" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={macroPieData}
                    innerRadius="62%"
                    outerRadius="80%"
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {macroPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MACRO_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip content={<HUDTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center flex flex-col items-center justify-center">
                <span className="text-[8px] text-zinc-500 font-bold font-mono uppercase tracking-wider leading-none">Today's</span>
                <p className="text-xs font-black text-zinc-900 dark:text-white font-mono mt-1 leading-none">Macros</p>
              </div>
            </div>

            {/* Stacked Bar chart for daily logs */}
            <div className="sm:col-span-7 h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={stackedCalorieData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stackProteinGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand-lime)" />
                      <stop offset="100%" stopColor="#84cc16" opacity={0.85} />
                    </linearGradient>
                    <linearGradient id="stackCarbsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand-cyan)" />
                      <stop offset="100%" stopColor="#0891b2" opacity={0.85} />
                    </linearGradient>
                    <linearGradient id="stackFatsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#db2777" opacity={0.85} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={9} tickLine={false} className="font-mono" />
                  <YAxis stroke="#71717a" fontSize={9} tickLine={false} className="font-mono" />
                  <Tooltip content={<HUDTooltip />} />
                  <Bar dataKey="Protein" stackId="a" fill="url(#stackProteinGrad)" />
                  <Bar dataKey="Carbs" stackId="a" fill="url(#stackCarbsGrad)" />
                  <Bar dataKey="Fats" stackId="a" fill="url(#stackFatsGrad)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

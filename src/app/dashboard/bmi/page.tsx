'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { Scale, ArrowRight, Activity, Calendar, FileText, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
          // DATE: {label}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            const color = entry.color || entry.fill;
            return (
              <div key={index} className="flex items-center gap-3.5 justify-between">
                <span className="flex items-center gap-1.5 text-zinc-550 dark:text-zinc-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="uppercase">{entry.name}:</span>
                </span>
                <span className="font-extrabold" style={{ color: color }}>
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

export default function BmiPage() {
  const { theme, user, bmiHistory, addBmiEntry } = useAppStore();

  const [weight, setWeight] = useState(user.weight.toString());
  const [height, setHeight] = useState(user.height.toString());
  const [calculatedEntry, setCalculatedEntry] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

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

  const currentEntry = bmiHistory[bmiHistory.length - 1] || {
    bmi: 24.2,
    classification: 'Normal weight',
    weight: 78.5,
    height: 180,
    date: '2026-06-15'
  };

  const activeBmi = calculatedEntry ? calculatedEntry.bmi : currentEntry.bmi;
  const activeClass = calculatedEntry ? calculatedEntry.classification : currentEntry.classification;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const hNum = Number(height);
    const wNum = Number(weight);
    if (hNum > 0 && wNum > 0) {
      const entry = addBmiEntry(hNum, wNum);
      setCalculatedEntry(entry);
    }
  };

  // Get dynamic tailored advice based on classification
  const getBmiAdvice = (classification: string) => {
    switch (classification) {
      case 'Underweight':
        return {
          title: "Caloric Surplus & Muscle Building Focus",
          description: "Your BMI indicates you are in the underweight category. It is recommended to maintain a clean caloric surplus of 300-500 kcal, focusing on nutrient-dense meals and progressive overload strength training to gain lean body mass.",
          color: "border-blue-500/20 text-blue-500 dark:text-blue-400 bg-blue-500/5"
        };
      case 'Normal weight':
        return {
          title: "Maintenance & Athletic Conditioning",
          description: "Great job! You are in the healthy BMI range. Focus on maintaining body composition, improving athletic performance, and consuming adequate protein (1.6-2.2g/kg of bodyweight) to sustain muscle mass.",
          color: "border-brand-lime/20 text-lime-700 dark:text-brand-lime bg-brand-lime/5"
        };
      case 'Overweight':
        return {
          title: "Staged Deficit & Resistance Training",
          description: "Your BMI shows you are in the overweight range. Focus on a moderate caloric deficit (300-500 kcal below maintenance) while performing heavy resistance workouts 3-4 times a week to preserve muscle tissue while shedding body fat.",
          color: "border-yellow-500/20 text-yellow-600 dark:text-yellow-400 bg-yellow-500/5"
        };
      default:
        return {
          title: "Metabolic Restructuring & Cardio Integration",
          description: "Your BMI classification is in the obese range. We suggest focusing on dietary restructuring (whole foods, high protein, limited processed sugar) paired with low-impact cardiovascular training (walking, cycling) to improve cardiovascular markers safely.",
          color: "border-red-500/20 text-red-650 dark:text-red-400 bg-red-500/5"
        };
    }
  };

  const advice = getBmiAdvice(activeClass);

  // Map BMI classification to visual offset percentage (Underweight 0% - Obese 100%)
  const getPointerOffset = (bmi: number) => {
    const minBmi = 15;
    const maxBmi = 35;
    const percentage = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  // Prepare chart data
  const chartData = bmiHistory.map(entry => ({
    date: entry.date,
    bmi: entry.bmi,
    weight: entry.weight
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block font-mono">Composition metrics</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">BMI Body Calculator</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Analyze weight parameters and review clinical recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Gauge (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Interactive Calculation Form */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-wide border-b border-black/5 dark:border-white/5 pb-2">Calculate Body Mass Index</h3>
            
            <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                  required
                  min="100"
                  max="250"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                  required
                  min="30"
                  max="250"
                  step="0.1"
                />
              </div>

              <button
                type="submit"
                className="bg-brand-lime text-black font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-sans"
              >
                <Activity className="w-4 h-4 text-black" /> Run Metrics
              </button>
            </form>
          </div>

          {/* Visual Scale Indicator Gauge */}
          <div className="glass-card p-6 rounded-3xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-wide">Dynamic Scale Marker</h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Clinical BMI ranges (15 - 35)</p>
            </div>

            {/* Gauge slider representation */}
            <div className="relative pt-6">
              {/* Marker pin */}
              <div 
                className="absolute top-0 flex flex-col items-center transition-all duration-500" 
                style={{ left: `${getPointerOffset(activeBmi)}%`, transform: 'translateX(-50%)' }}
              >
                <span className="text-xs font-mono font-extrabold text-zinc-800 dark:text-white bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-black/10 dark:border-white/10 shadow">
                  {activeBmi}
                </span>
                <span className="w-2 h-2 bg-zinc-100 dark:bg-zinc-900 rotate-45 border-r border-b border-black/10 dark:border-white/10 -mt-1" />
              </div>

              {/* Bar scale */}
              <div className="w-full h-4 rounded-full overflow-hidden flex border border-black/5 dark:border-white/5 mt-4">
                <div className="flex-1 bg-blue-500" title="Underweight (< 18.5)" />
                <div className="flex-1 bg-brand-lime" title="Normal weight (18.5 - 24.9)" />
                <div className="flex-1 bg-yellow-500" title="Overweight (25 - 29.9)" />
                <div className="flex-1 bg-red-500" title="Obese (>= 30)" />
              </div>

              {/* Labels */}
              <div className="flex justify-between text-[9px] font-bold text-zinc-500 font-mono pt-2">
                <span>Underweight (15)</span>
                <span>Normal (21.7)</span>
                <span>Overweight (27.5)</span>
                <span>Obese (35)</span>
              </div>
            </div>

            {/* Tailored recommendation box */}
            <div className={`p-5 rounded-2xl border ${advice.color} transition-all duration-300 space-y-2`}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">{advice.title}</h4>
              </div>
              <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
                {advice.description}
              </p>
            </div>

          </div>

        </div>

        {/* Right Column: Analytics Chart & History (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* History Chart */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Composition History</h3>
              <span className="text-[8px] font-mono text-zinc-400">SYS_BMI_TREND</span>
            </div>
            
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bmiLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--brand-cyan)" />
                      <stop offset="100%" stopColor="var(--brand-lime)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={9} tickLine={false} className="font-mono" />
                  <YAxis stroke="#71717a" fontSize={9} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} className="font-mono" />
                  <Tooltip content={<HUDTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="bmi" 
                    stroke="url(#bmiLineGrad)" 
                    strokeWidth={3} 
                    dot={{ fill: 'var(--brand-cyan)', stroke: theme === 'dark' ? '#18181b' : '#ffffff', strokeWidth: 1.5, r: 3.5 }}
                    activeDot={{ r: 5, strokeWidth: 0, fill: 'var(--brand-lime)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Past logs timeline */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <Calendar className="w-4.5 h-4.5 text-brand-cyan" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide uppercase font-mono">Biometric Feed Timeline</h3>
            </div>

            <div className="relative pl-6 space-y-5 max-h-[300px] overflow-y-auto pr-1 text-left">
              {/* Vertical timeline backbone */}
              <div className="absolute left-2.5 top-2.5 bottom-2.5 w-[1.5px] bg-zinc-200 dark:bg-zinc-800 pointer-events-none" />

              {bmiHistory.slice().reverse().map((entry) => {
                let badgeColor = 'bg-brand-lime/10 text-lime-700 dark:text-brand-lime border-brand-lime/20';
                if (entry.classification === 'Underweight') badgeColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                if (entry.classification === 'Overweight') badgeColor = 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
                if (entry.classification === 'Obese') badgeColor = 'bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20';
                
                return (
                  <div key={entry.id} className="relative group/timeline">
                    {/* Timeline node */}
                    <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover/timeline:bg-brand-cyan group-hover/timeline:scale-125 border border-white dark:border-zinc-955 transition-all shadow-xs z-10" />

                    <div className="p-3 rounded-2xl bg-zinc-100/40 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5 hover:border-brand-cyan/25 dark:hover:border-brand-cyan/20 hover:shadow-xs transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8.5px] text-zinc-550 font-mono font-bold block">{entry.date}</span>
                          <span className="text-xs font-black text-zinc-850 dark:text-zinc-200 mt-0.5 block">
                            {entry.weight} kg <span className="text-[10px] text-zinc-455 font-normal">/ {entry.height} cm</span>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-black text-brand-cyan block">BMI: {entry.bmi}</span>
                          <span className={`inline-block text-[8px] font-mono font-bold px-2 py-0.5 rounded border mt-1 uppercase ${badgeColor}`}>
                            {entry.classification}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

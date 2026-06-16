'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { Scale, ArrowRight, Activity, Calendar, FileText, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BmiPage() {
  const { theme, user, bmiHistory, addBmiEntry } = useAppStore();

  const [weight, setWeight] = useState(user.weight.toString());
  const [height, setHeight] = useState(user.height.toString());
  const [calculatedEntry, setCalculatedEntry] = useState<any>(null);

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
            <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-wide border-b border-black/5 dark:border-white/5 pb-2">Composition History</h3>
            
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#27272a' : '#e4e4e7'} vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', borderColor: theme === 'dark' ? '#27272a' : '#e4e4e7', borderRadius: '12px' }}
                    labelStyle={{ color: theme === 'dark' ? '#a1a1aa' : '#52525b', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: theme === 'dark' ? '#a3e635' : '#2563eb', fontSize: '11px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bmi" 
                    stroke={theme === 'dark' ? '#a3e635' : '#2563eb'} 
                    strokeWidth={2.5} 
                    dot={{ fill: theme === 'dark' ? '#a3e635' : '#2563eb', stroke: theme === 'dark' ? '#18181b' : '#ffffff', strokeWidth: 1.5 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Past logs list */}
          <div className="glass-card p-6 rounded-3xl space-y-3.5">
            <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <Calendar className="w-4.5 h-4.5 text-brand-cyan" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Historical Logs</h3>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {bmiHistory.slice().reverse().map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-3 rounded-xl bg-zinc-100/30 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-colors">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono font-bold block">{entry.date}</span>
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">{entry.weight}kg | {entry.height}cm</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-brand-cyan block">BMI: {entry.bmi}</span>
                    <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase font-mono">{entry.classification}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAppStore, FoodEntry } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Salad, Sparkles, HelpCircle, Utensils, Droplet, Coffee, Pizza, Cookie, Loader2 } from 'lucide-react';

export default function NutritionPage() {
  const { foodEntries, user, addFoodEntry, deleteFoodEntry, generateAIMealPlan, addWater } = useAppStore();

  // Manual Food Form States
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');

  // AI Meal Generator Form States
  const [dietPref, setDietPref] = useState('High Protein');
  const [calTarget, setCalTarget] = useState(2000);
  const [generatingMeal, setGeneratingMeal] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  // Group food entries by meal type
  const breakfastEntries = foodEntries.filter(f => f.mealType === 'Breakfast');
  const lunchEntries = foodEntries.filter(f => f.mealType === 'Lunch');
  const dinnerEntries = foodEntries.filter(f => f.mealType === 'Dinner');
  const snackEntries = foodEntries.filter(f => f.mealType === 'Snacks');

  // Calculate totals
  const totalCal = foodEntries.reduce((acc, f) => acc + f.calories, 0);
  const totalProtein = foodEntries.reduce((acc, f) => acc + f.protein, 0);
  const totalCarbs = foodEntries.reduce((acc, f) => acc + f.carbs, 0);
  const totalFats = foodEntries.reduce((acc, f) => acc + f.fats, 0);

  const calGoal = user.calorieGoal;
  const pGoal = 150;
  const cGoal = 220;
  const fGoal = 75;

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !calories) return;

    addFoodEntry({
      name: foodName,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      mealType
    });

    // Reset Form
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
  };

  const handleGenerateMealPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingMeal(true);
    setGeneratedPlan(null);
    try {
      const plan = await generateAIMealPlan(dietPref, 'Fat Loss', calTarget);
      setGeneratedPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingMeal(false);
    }
  };

  const renderFoodSection = (title: string, entries: FoodEntry[], icon: any, color: string) => {
    const Icon = icon;
    const sectionCals = entries.reduce((acc, f) => acc + f.calories, 0);
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg ${color} bg-opacity-10 border border-opacity-20 flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">{title}</h4>
          </div>
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-bold">{sectionCals} kcal</span>
        </div>

        {entries.length > 0 ? (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-100/30 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 group transition-colors"
              >
                <div>
                  <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{entry.name}</h5>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500 font-semibold font-mono">
                    <span className="text-lime-700 dark:text-brand-lime">P: {entry.protein}g</span>
                    <span>C: {entry.carbs}g</span>
                    <span className="text-pink-600 dark:text-pink-400">F: {entry.fats}g</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">{entry.calories} kcal</span>
                  <button
                    onClick={() => deleteFoodEntry(entry.id)}
                    className="p-1 hover:bg-red-500/10 hover:text-red-400 text-zinc-500 rounded transition-colors cursor-pointer"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-zinc-500 italic py-2 pl-9">No entries logged for {title.toLowerCase()}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block font-mono">Nutrition Center</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">Calorie & Macro Logs</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Record daily macronutrient splits and generate custom diets.</p>
      </div>

      {/* Grid: Macro Breakdown and Food Logging */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Macros Summary & Food Logs (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Caloric & Macro Overview Card */}
          <div className="glass-card p-6 rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col justify-center space-y-2 border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5 pb-4 md:pb-0 md:pr-6">
              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Energy Logged</span>
              <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">{totalCal}</h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Target: {calGoal} kcal ({Math.min(100, Math.round((totalCal / calGoal) * 100))}% split)</span>
            </div>

            {/* Protein Indicator */}
            <div className="space-y-2 flex flex-col justify-center">
              <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-mono">
                <span className="text-lime-700 dark:text-brand-lime font-bold">Protein</span>
                <span>{totalProtein}g / {pGoal}g</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                <div className="bg-brand-lime h-full" style={{ width: `${Math.min(100, (totalProtein / pGoal) * 100)}%` }} />
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">{(totalProtein * 4)} kcal consumed</span>
            </div>

            {/* Carbs Indicator */}
            <div className="space-y-2 flex flex-col justify-center">
              <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-mono">
                <span className="text-brand-cyan font-bold">Carbohydrates</span>
                <span>{totalCarbs}g / {cGoal}g</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                <div className="bg-brand-cyan h-full" style={{ width: `${Math.min(100, (totalCarbs / cGoal) * 100)}%` }} />
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">{(totalCarbs * 4)} kcal consumed</span>
            </div>

            {/* Fats Indicator */}
            <div className="space-y-2 flex flex-col justify-center">
              <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-mono">
                <span className="text-pink-600 dark:text-pink-400 font-bold">Fats</span>
                <span>{totalFats}g / {fGoal}g</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                <div className="bg-pink-400 h-full" style={{ width: `${Math.min(100, (totalFats / fGoal) * 100)}%` }} />
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">{(totalFats * 9)} kcal consumed</span>
            </div>
          </div>

          {/* Grouped Food Entries List */}
          <div className="glass-card p-6 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-wide border-b border-black/5 dark:border-white/5 pb-2">Food Diary</h3>
            
            {renderFoodSection("Breakfast", breakfastEntries, Coffee, "text-amber-500")}
            {renderFoodSection("Lunch", lunchEntries, Salad, "text-lime-700 dark:text-brand-lime")}
            {renderFoodSection("Dinner", dinnerEntries, Pizza, "text-brand-cyan")}
            {renderFoodSection("Snacks", snackEntries, Cookie, "text-pink-500 dark:text-pink-400")}
          </div>

        </div>

        {/* Right: Add Food Form & AI Meal Generator (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Manual Food Log Form */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Utensils className="w-4.5 h-4.5 text-lime-750 dark:text-brand-lime" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Manual Log Entry</h3>
            </div>
            
            <form onSubmit={handleAddFood} className="space-y-3">
              <div>
                <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Food Name</label>
                <input
                  type="text"
                  placeholder="e.g. Scrambled Eggs"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-850 dark:text-zinc-200 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    placeholder="250"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-850 dark:text-zinc-200 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Meal Period</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-750 dark:text-zinc-300 focus:outline-none"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    placeholder="12"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-2.5 py-2 text-xs text-zinc-850 dark:text-zinc-200 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-655"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-2.5 py-2 text-xs text-zinc-850 dark:text-zinc-200 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-655"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Fats (g)</label>
                  <input
                    type="number"
                    placeholder="8"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-2.5 py-2 text-xs text-zinc-850 dark:text-zinc-200 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-655"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-lime text-black font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1 cursor-pointer mt-3"
              >
                <Plus className="w-4 h-4 text-black" /> Log Food
              </button>
            </form>
          </div>

          {/* AI Meal Generator Widget */}
          <div className="glass-card p-6 rounded-3xl space-y-4 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-brand-cyan/5 blur-2xl rounded-full" />
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">AI Meal Generator</h3>
            </div>

            <p className="text-[11px] text-zinc-550 dark:text-zinc-400 leading-relaxed">
              Synthesize recipe suggestions based on calorie margins and diets.
            </p>

            <form onSubmit={handleGenerateMealPlan} className="space-y-3">
              <div>
                <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1 font-mono">Diet Preference</label>
                <select
                  value={dietPref}
                  onChange={(e) => setDietPref(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="High Protein">High Protein</option>
                  <option value="Ketogenic">Ketogenic (Low Carb)</option>
                  <option value="Vegan">Vegan (Plant Based)</option>
                  <option value="Balanced">Balanced Mix</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1 font-mono">Calorie Target ({calTarget} kcal)</label>
                <input
                  type="range"
                  min="1200"
                  max="3500"
                  step="100"
                  value={calTarget}
                  onChange={(e) => setCalTarget(Number(e.target.value))}
                  className="w-full accent-brand-cyan h-1 bg-zinc-200 dark:bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={generatingMeal}
                className="w-full bg-brand-cyan text-black font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {generatingMeal ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Planning recipes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Build Meal Config</span>
                  </>
                )}
              </button>
            </form>

            {/* Generated Plan Overlay / Display */}
            {generatedPlan && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-black/5 dark:border-white/5 pt-4 space-y-3.5 mt-2"
              >
                <div className="flex justify-between items-center bg-zinc-100/40 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-black/5 dark:border-white/5">
                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase font-mono block">Planned Caloric Yield</span>
                    <span className="text-xs font-mono font-bold text-brand-cyan">{generatedPlan.calories} kcal</span>
                  </div>
                  <div className="text-right text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-bold">
                    P: {generatedPlan.macros.protein}g | C: {generatedPlan.macros.carbs}g | F: {generatedPlan.macros.fats}g
                  </div>
                </div>

                <div className="space-y-2">
                  {generatedPlan.meals.map((meal: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">{meal.type}</span>
                        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">{meal.calories} kcal</span>
                      </div>
                      <p className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold mt-1 leading-normal">{meal.name}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

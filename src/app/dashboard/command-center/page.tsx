'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppStore, WorkoutRoutine, Exercise } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Flame, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  UserCheck,
  Award
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Three.js components to prevent SSR canvas hydration issues
const InteractiveHumanBody = dynamic(() => import('@/components/dashboard/interactive-human-body'), { ssr: false });
const CalorieBurnVisualizer = dynamic(() => import('@/components/dashboard/calorie-burn-visualizer'), { ssr: false });
const AIAvatarTrainer = dynamic(() => import('@/components/dashboard/ai-avatar-trainer'), { ssr: false });
const VoiceConsole = dynamic(() => import('@/components/dashboard/voice-console'), { ssr: false });

const muscleExercises: Record<string, Omit<Exercise, 'id' | 'completedSets'>[]> = {
  chest: [
    { name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 80 },
    { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 26 },
    { name: 'Cable Crossover Flys', sets: 3, reps: 12, weight: 18 },
    { name: 'Dumbbell Pull-Overs', sets: 3, reps: 12, weight: 22 }
  ],
  back: [
    { name: 'Conventional Deadlift', sets: 3, reps: 5, weight: 120 },
    { name: 'Wide-Grip Pull-ups', sets: 4, reps: 8, weight: 0 },
    { name: 'Bent-Over Barbell Rows', sets: 3, reps: 8, weight: 70 },
    { name: 'Lat Pull-downs (Wide)', sets: 4, reps: 10, weight: 60 }
  ],
  legs: [
    { name: 'Barbell Back Squats', sets: 4, reps: 8, weight: 100 },
    { name: 'Romanian Deadlifts (RDL)', sets: 3, reps: 10, weight: 80 },
    { name: 'Leg Press (45-degree)', sets: 3, reps: 10, weight: 160 },
    { name: 'Standing Calf Raises', sets: 4, reps: 15, weight: 45 }
  ],
  shoulders: [
    { name: 'Overhead Press (OHP)', sets: 3, reps: 8, weight: 45 },
    { name: 'Dumbbell Lateral Raises', sets: 4, reps: 15, weight: 10 },
    { name: 'Rear Delt Cable Flys', sets: 3, reps: 12, weight: 8 },
    { name: 'Dumbbell Shrugs (Traps)', sets: 3, reps: 12, weight: 30 }
  ],
  arms: [
    { name: 'Incline Dumbbell Curls', sets: 3, reps: 12, weight: 14 },
    { name: 'Tricep Rope Pushdowns', sets: 3, reps: 12, weight: 22 },
    { name: 'Hammer Strength Curls', sets: 3, reps: 10, weight: 16 },
    { name: 'Skull Crushers (EZ-Bar)', sets: 3, reps: 10, weight: 28 }
  ],
  abs: [
    { name: 'Hanging Leg Raises', sets: 3, reps: 12, weight: 0 },
    { name: 'Plank Holds (Static)', sets: 3, reps: 60, weight: 0 },
    { name: 'Cable Ab Crunches', sets: 3, reps: 15, weight: 32 },
    { name: 'Russian Twists (Weight)', sets: 3, reps: 20, weight: 10 }
  ]
};

export default function CommandCenterPage() {
  const { user, addRoutine, theme, updateUser } = useAppStore();

  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [facingFront, setFacingFront] = useState(true);
  const [intensity, setIntensity] = useState(55); // Calorie burn slider intensity
  
  // Voice & TTS states
  const [coachMessage, setCoachMessage] = useState(
    "Welcome, Alex. Neural link active. Speak via the mic button or click any body part to begin visual workout generation."
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Manual calorie logger states
  const [manualCalAmount, setManualCalAmount] = useState('200');
  const [successToast, setSuccessToast] = useState('');

  // Auto-generate workouts for selected muscle group
  const activeExercises = useMemo(() => {
    if (!selectedMuscle) return [];
    return muscleExercises[selectedMuscle] || [];
  }, [selectedMuscle]);

  // Voice command dispatcher
  const handleVoiceCommand = (commandType: string, value?: any) => {
    if (commandType === 'select-muscle') {
      const muscle = value as string;
      setSelectedMuscle(muscle);
      setCoachMessage(`Selected ${muscle} muscle groups. Loading targeted anatomical split routine.`);
    } else if (commandType === 'generate-workout') {
      if (!selectedMuscle) {
        setCoachMessage("Please select a muscle group first before compiling a workout routine.");
        return;
      }
      handleSaveRoutine();
    } else if (commandType === 'log-calories') {
      const amount = value as number;
      handleLogCaloriesDirectly(amount);
    } else if (commandType === 'reset') {
      setSelectedMuscle(null);
      setCoachMessage("Biometric selections cleared. Ready for standard diagnostic command.");
    }
  };

  const handleSelectMuscleDirectly = (muscle: string) => {
    setSelectedMuscle(muscle);
    setCoachMessage(`Highlighted ${muscle} muscles. Synthesizing range of motion and hypertrophy splits.`);
  };

  // Build routine object and register inside Zustand app store
  const handleSaveRoutine = () => {
    if (!selectedMuscle || activeExercises.length === 0) return;

    const formattedExercises: Exercise[] = activeExercises.map((ex, i) => ({
      id: `ex-cc-${selectedMuscle}-${i}-${Date.now()}`,
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight,
      completedSets: Array(ex.sets).fill(false)
    }));

    const newRoutine: WorkoutRoutine = {
      id: `routine-cc-${selectedMuscle}-${Date.now()}`,
      name: `Command Split: ${selectedMuscle.charAt(0).toUpperCase() + selectedMuscle.slice(1)}`,
      category: 'Strength',
      duration: 40,
      exercises: formattedExercises
    };

    addRoutine(newRoutine);
    setCoachMessage(`Workout routine added to your Workout Planner! Split name: ${newRoutine.name}.`);
    triggerToast("Routine Added to Planner!");
  };

  const handleLogCaloriesDirectly = (amount: number) => {
    updateUser({
      caloriesBurnedToday: user.caloriesBurnedToday + amount
    });
    setCoachMessage(`Logged ${amount} calories. Thermodynamic particle velocity increased.`);
    triggerToast(`Logged +${amount} kcal!`);
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const activeBurnGoalProgress = Math.min(100, Math.round((user.caloriesBurnedToday / user.caloriesBurnedGoal) * 100));

  return (
    <div className="space-y-6 text-left">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-brand-lime font-mono text-[9px] font-bold tracking-widest uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>BIO-COMPATIBLE HARDWARE INTERFACE // SYS_CMD_CENTER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mt-1">
            3D AI Fitness Command Center
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Control diagnostics, select target muscle groups visually, and interact hands-free using neural voice recognition.
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 text-[10px] font-mono font-bold tracking-widest text-brand-lime shadow-lg border border-brand-lime/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-ping" />
            <span>SPEECH: STANDBY</span>
          </div>
        </div>
      </div>

      {/* Dynamic Action Toast Notifications */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 right-6 bg-brand-lime text-black font-extrabold font-mono text-xs px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 border border-brand-lime"
          >
            <CheckCircle2 className="w-4.5 h-4.5 text-black" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* WIDGET 1: 3D ANATOMICAL BODY INTERACTION (Spans 8 columns) */}
        <div className="lg:col-span-8 glass-card p-6.5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden group min-h-[500px]">
          
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center">
                <Activity className="w-4.5 h-4.5 text-brand-lime" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">ANATOMICAL VISUALIZER</span>
                <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Interactive Muscle Map</span>
              </div>
            </div>
            
            {/* View Rotation Control Button */}
            <button
              onClick={() => setFacingFront(!facingFront)}
              className="text-[9px] font-extrabold font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-black/5 dark:border-white/5 px-3 py-2 rounded-xl flex items-center gap-1.5 uppercase transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotate Body: {facingFront ? 'FRONT' : 'BACK'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left Hand: ThreeJS Human Canvas */}
            <div className="md:col-span-7 bg-zinc-100/50 dark:bg-black/25 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden relative">
              <InteractiveHumanBody 
                selectedMuscle={selectedMuscle}
                onSelectMuscle={handleSelectMuscleDirectly}
                hoveredMuscle={hoveredMuscle}
                onHoverMuscle={setHoveredMuscle}
                facingFront={facingFront}
                theme={theme}
              />
            </div>

            {/* Right Hand: Muscle workout log generator */}
            <div className="md:col-span-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-black/5 dark:border-white/5 pt-4 md:pt-0 md:pl-6 text-left">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Anatomy Target</span>
                {selectedMuscle ? (
                  <>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-lime" />
                      {selectedMuscle} Group
                    </h3>
                    
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      Custom targeting routines formulated for progressive loading in {selectedMuscle} structures.
                    </p>

                    {/* Exercises checklist preview */}
                    <div className="mt-4 space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {activeExercises.map((ex, i) => (
                        <div key={i} className="p-3 rounded-xl bg-black/5 dark:bg-zinc-950/45 border border-black/5 dark:border-white/5 text-left font-mono text-[9px] flex justify-between items-center group/item hover:border-brand-lime/20">
                          <div>
                            <span className="font-extrabold text-zinc-900 dark:text-zinc-200 uppercase block tracking-wider">{ex.name}</span>
                            <span className="text-zinc-500 mt-0.5 block">{ex.sets} sets × {ex.reps} reps</span>
                          </div>
                          <span className="font-bold text-brand-lime bg-brand-lime/10 px-2 py-1 rounded border border-brand-lime/20 shrink-0">{ex.weight} kg</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-48 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-zinc-500 font-mono text-xs gap-3">
                    <Activity className="w-8 h-8 text-zinc-600 animate-pulse" />
                    <span>Select any body part on the visualizer to load custom biomechanical routines.</span>
                  </div>
                )}
              </div>

              {/* Action builder button */}
              {selectedMuscle && (
                <button
                  onClick={handleSaveRoutine}
                  className="w-full bg-brand-lime hover:bg-opacity-95 text-black font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider mt-4 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-brand-lime/10"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Add Split to Planner</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* WIDGET 2: SPEECH INTERACTION & AI COACH (Spans 4 columns) */}
        <div className="lg:col-span-4 grid grid-rows-2 gap-6 items-stretch">
          
          {/* Box 1: Robotic Avatar Trainer */}
          <AIAvatarTrainer 
            message={coachMessage}
            isSpeaking={isSpeaking}
            onStartSpeaking={() => setIsSpeaking(true)}
            onEndSpeaking={() => setIsSpeaking(false)}
            theme={theme}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
          />

          {/* Box 2: Voice Command Terminal console */}
          <VoiceConsole 
            onCommand={handleVoiceCommand}
            selectedMuscle={selectedMuscle}
            theme={theme}
          />
        </div>
      </div>

      {/* Dynamic 3D Calorie visualizer row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Calorie burn particle generator container (Spans 6 columns) */}
        <div className="lg:col-span-6 glass-card p-6.5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Flame className="w-4.5 h-4.5 text-orange-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">CALORIC EXPEDITION</span>
                <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">3D Calorie Burn Chamber</span>
              </div>
            </div>
            <span className="text-[8px] font-mono text-zinc-500">NODE: SYS_ENERGY_CHAMBER</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* 3D flame animation container */}
            <div className="md:col-span-6 bg-zinc-100/50 dark:bg-black/25 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden relative">
              <CalorieBurnVisualizer intensity={intensity} theme={theme} />
            </div>

            {/* Slider parameters control */}
            <div className="md:col-span-6 space-y-5 text-left font-mono">
              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Chamber Heat Intensity ({intensity}%)</label>
                <input 
                  type="range"
                  min="10"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-orange-500 h-1.5 bg-zinc-200 dark:bg-zinc-900 rounded-lg cursor-pointer"
                />
                <span className="text-[7.5px] text-zinc-500 block mt-1">Controls the speed & density of the 3D particle generator</span>
              </div>

              {/* Dialing metrics */}
              <div className="flex justify-between items-center border-t border-black/5 dark:border-white/5 pt-4">
                <div>
                  <span className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-wider block">Today's Burn</span>
                  <span className="text-xl font-black text-zinc-900 dark:text-white">{user.caloriesBurnedToday} <span className="text-[8.5px] font-medium text-zinc-400">kcal</span></span>
                </div>
                <div>
                  <span className="text-[8.5px] text-zinc-550 font-bold uppercase tracking-wider block text-right">Goal Progress</span>
                  <span className="text-xl font-black text-orange-500 block text-right">{activeBurnGoalProgress}%</span>
                </div>
              </div>

              {/* Progress gauge bar */}
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-300" style={{ width: `${activeBurnGoalProgress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick logging & biometrics logs stats (Spans 6 columns) */}
        <div className="lg:col-span-6 glass-card p-6.5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center">
                <TrendingUp className="w-4.5 h-4.5 text-brand-cyan" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">DIAGNOSTICS PROFILE</span>
                <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Active Metrics Logging</span>
              </div>
            </div>
            <span className="text-[8px] font-mono text-zinc-550">SYS: METRIC_LOGGER_FEED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Left side: Quick click burners */}
            <div className="space-y-4 flex flex-col justify-between">
              <span className="text-[9px] font-mono text-zinc-550 font-bold uppercase tracking-wider block text-left">Quick Log Expenditure</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleLogCaloriesDirectly(100)}
                  className="p-3.5 rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-mono font-bold text-xs uppercase tracking-wider transition-all hover:border-orange-500/25 cursor-pointer text-center"
                >
                  +100 kcal
                </button>
                <button
                  onClick={() => handleLogCaloriesDirectly(250)}
                  className="p-3.5 rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-mono font-bold text-xs uppercase tracking-wider transition-all hover:border-orange-500/25 cursor-pointer text-center"
                >
                  +250 kcal
                </button>
                <button
                  onClick={() => handleLogCaloriesDirectly(500)}
                  className="col-span-2 p-3.5 rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-mono font-bold text-xs uppercase tracking-wider transition-all hover:border-orange-500/25 cursor-pointer text-center"
                >
                  +500 kcal
                </button>
              </div>
            </div>

            {/* Right side: Manual digit inputs */}
            <div className="border-t md:border-t-0 md:border-l border-black/5 dark:border-white/5 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between text-left">
              <div>
                <label className="text-[9px] font-mono text-zinc-550 font-bold uppercase tracking-wider block mb-2">Input Calorie Value</label>
                <div className="relative">
                  <input
                    type="number"
                    value={manualCalAmount}
                    onChange={(e) => setManualCalAmount(e.target.value)}
                    placeholder="250"
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-3.5 py-3 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none font-mono"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-zinc-500 font-bold uppercase">kcal</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const val = parseInt(manualCalAmount, 10);
                  if (!isNaN(val) && val > 0) {
                    handleLogCaloriesDirectly(val);
                  }
                }}
                className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-mono font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider mt-4 hover:opacity-95 transition-opacity cursor-pointer text-center"
              >
                Log Burn Value
              </button>
            </div>

          </div>

          <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-3 flex justify-between font-mono text-[9px] text-zinc-550 uppercase">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-brand-lime" /> Data encryption secure</span>
            <span>Vault ID: B_EXP_CMD_09</span>
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAppStore, WorkoutRoutine } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Trash2, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Calendar, 
  Square,
  Timer,
  CheckCircle,
  Dumbbell,
  Loader2,
  Pencil
} from 'lucide-react';

// Telemetry Exercise Card with rep/set/weight counters
interface TelemetryExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight: number;
  };
  idx: number;
  routineId: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function TelemetryExerciseCard({ 
  exercise, 
  idx, 
  routineId, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp, 
  canMoveDown 
}: TelemetryExerciseCardProps) {
  const { routines, updateExerciseName, removeExerciseFromRoutine } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(exercise.name);
  const [prevName, setPrevName] = useState(exercise.name);

  if (exercise.name !== prevName) {
    setEditName(exercise.name);
    setPrevName(exercise.name);
  }

  const handleSaveName = () => {
    if (editName.trim() && editName.trim() !== exercise.name) {
      updateExerciseName(routineId, exercise.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditName(exercise.name);
      setIsEditing(false);
    }
  };

  const updateVal = (field: 'sets' | 'reps' | 'weight', change: number) => {
    const updated = routines.map((r) => {
      if (r.id === routineId) {
        const exercises = r.exercises.map((ex) => {
          if (ex.id === exercise.id) {
            const newVal = Math.max(1, (ex[field] || 0) + change);
            // If sets changed, we also need to adjust completedSets array length
            let completedSets = [...ex.completedSets];
            if (field === 'sets') {
              if (newVal > ex.sets) {
                completedSets = [...completedSets, ...Array(newVal - ex.sets).fill(false)];
              } else if (newVal < ex.sets) {
                completedSets = completedSets.slice(0, newVal);
              }
            }
            return {
              ...ex,
              [field]: newVal,
              completedSets
            };
          }
          return ex;
        });
        return { ...r, exercises };
      }
      return r;
    });
    useAppStore.setState({ routines: updated });
  };

  return (
    <div className="flex flex-col p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5 hover:border-brand-lime/20 dark:hover:border-brand-lime/20 transition-all duration-300 relative group shadow-sm gap-4">
      {/* Index marker */}
      <div className="absolute top-2 left-2 text-[8px] font-mono text-zinc-400 dark:text-zinc-500 tracking-wider">
        EX_ID_0{idx + 1}
      </div>

      {/* Row 1: Header (Name & Action Buttons) */}
      <div className="flex items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="w-7 h-7 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-mono font-black text-zinc-600 dark:text-zinc-400 border border-black/5 dark:border-white/5 shadow-inner shrink-0">
            {idx + 1}
          </span>
          <div className="text-left min-w-0 flex-1">
            {isEditing ? (
              <div className="flex items-center gap-1.5 max-w-[240px]">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleKeyDown}
                  className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wide bg-zinc-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 px-2 py-0.5 rounded focus:outline-none focus:border-brand-lime w-full font-sans"
                  autoFocus
                />
              </div>
            ) : (
              <h5 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide flex items-center gap-1.5 group/name leading-tight">
                <Dumbbell className="w-3.5 h-3.5 text-zinc-400 group-hover:rotate-45 transition-transform duration-300 shrink-0" />
                <span className="truncate block">{exercise.name}</span>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover/name:opacity-100 hover:text-brand-lime p-0.5 transition-opacity cursor-pointer shrink-0"
                  title="Rename Exercise"
                >
                  <Pencil className="w-3 h-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                </button>
              </h5>
            )}
          </div>
        </div>

        {/* Action Controls (Reorder & Delete) */}
        <div className="flex items-center gap-1 shrink-0 bg-black/5 dark:bg-zinc-955/40 p-1 rounded-xl border border-black/5 dark:border-white/5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1.5 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg disabled:opacity-20 transition-colors cursor-pointer"
            title="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1.5 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg disabled:opacity-20 transition-colors cursor-pointer"
            title="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Remove "${exercise.name}"?`)) {
                removeExerciseFromRoutine(routineId, exercise.id);
              }
            }}
            className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
            title="Delete Exercise"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: Adjustments & Info */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 border-t border-black/5 dark:border-white/5 pt-3">
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-bold uppercase tracking-wider">
          {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight} kg
        </span>

        {/* Telemetry Numeric Dial Counters */}
        <div className="flex items-center gap-3 font-mono text-[9px]">
          {/* Sets dial */}
          <div className="flex flex-col items-center gap-1 bg-black/5 dark:bg-zinc-950/60 p-1.5 rounded-xl border border-black/5 dark:border-white/10 shadow-inner">
            <span className="text-zinc-500 dark:text-zinc-400 text-[8px] uppercase tracking-wider font-bold">Sets</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => updateVal('sets', -1)}
                className="w-4.5 h-4.5 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-750 active:scale-90 select-none cursor-pointer"
              >
                -
              </button>
              <span className="w-4 text-center font-bold text-zinc-900 dark:text-white text-xs">{exercise.sets}</span>
              <button 
                type="button"
                onClick={() => updateVal('sets', 1)}
                className="w-4.5 h-4.5 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-750 active:scale-90 select-none cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Reps dial */}
          <div className="flex flex-col items-center gap-1 bg-black/5 dark:bg-zinc-950/60 p-1.5 rounded-xl border border-black/5 dark:border-white/10 shadow-inner">
            <span className="text-zinc-500 dark:text-zinc-400 text-[8px] uppercase tracking-wider font-bold">Reps</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => updateVal('reps', -1)}
                className="w-4.5 h-4.5 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-650 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-750 active:scale-90 select-none cursor-pointer"
              >
                -
              </button>
              <span className="w-4 text-center font-bold text-zinc-900 dark:text-white text-xs">{exercise.reps}</span>
              <button 
                type="button"
                onClick={() => updateVal('reps', 1)}
                className="w-4.5 h-4.5 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-650 dark:text-zinc-300 hover:bg-zinc-305 dark:hover:bg-zinc-750 active:scale-90 select-none cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Weight dial */}
          <div className="flex flex-col items-center gap-1 bg-black/5 dark:bg-zinc-950/60 p-1.5 rounded-xl border border-black/5 dark:border-white/10 shadow-inner">
            <span className="text-zinc-500 dark:text-zinc-400 text-[8px] uppercase tracking-wider font-bold">Load (kg)</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => updateVal('weight', -2.5)}
                className="w-7 h-4.5 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-[8px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-750 active:scale-90 select-none cursor-pointer"
              >
                -2.5
              </button>
              <span className="w-8 text-center font-bold text-zinc-900 dark:text-white text-xs">{exercise.weight}</span>
              <button 
                type="button"
                onClick={() => updateVal('weight', 2.5)}
                className="w-7 h-4.5 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-[8px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-750 active:scale-90 select-none cursor-pointer"
              >
                +2.5
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkoutPlannerPage() {
  const { 
    routines, 
    workoutHistory, 
    activeRoutine, 
    liveWorkoutTimer, 
    isLiveWorkoutRunning,
    startLiveWorkout, 
    pauseLiveWorkout, 
    resumeLiveWorkout,
    toggleExerciseSet, 
    completeLiveWorkout, 
    cancelLiveWorkout,
    reorderRoutineExercises,
    deleteRoutine,
    generateAIWorkout,
    addRoutine,
    addExerciseToRoutine
  } = useAppStore();

  // Selected routine to display exercises in the planner
  const [selectedRoutineId, setSelectedRoutineId] = useState(routines[0]?.id || '');
  
  // Custom Routine Form States
  const [showAddRoutineForm, setShowAddRoutineForm] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineCategory, setNewRoutineCategory] = useState<'Strength' | 'Cardio' | 'Flexibility' | 'HIIT'>('Strength');
  const [newRoutineDuration, setNewRoutineDuration] = useState(45);

  // New Exercise Form States
  const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState(10);
  const [newExWeight, setNewExWeight] = useState(20);

  // AI Generator Form States
  const [aiGoal, setAiGoal] = useState('Hypertrophy');
  const [aiExperience, setAiExperience] = useState('Intermediate');
  const [aiDays, setAiDays] = useState(4);
  const [aiEquipment, setAiEquipment] = useState('Full Gym');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatorStep, setGeneratorStep] = useState(0);

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineName.trim()) return;
    
    const newRoutine = {
      id: `routine-${Date.now()}`,
      name: newRoutineName.trim(),
      category: newRoutineCategory,
      duration: Number(newRoutineDuration) || 45,
      exercises: []
    };
    
    addRoutine(newRoutine);
    setSelectedRoutineId(newRoutine.id);
    
    // Reset Form
    setNewRoutineName('');
    setNewRoutineCategory('Strength');
    setNewRoutineDuration(45);
    setShowAddRoutineForm(false);
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim() || !selectedRoutineId) return;

    addExerciseToRoutine(
      selectedRoutineId,
      newExName.trim(),
      newExSets,
      newExReps,
      newExWeight
    );

    // Reset Form
    setNewExName('');
    setNewExSets(3);
    setNewExReps(10);
    setNewExWeight(20);
    setShowAddExerciseForm(false);
  };

  // Calendar States (Past active workout days highlight)
  // Let's get the past 30 days of June 2026
  const activeDays = new Set(workoutHistory.map(w => w.date));
  const daysInMonth = 30; // June has 30 days

  // Timer formatter
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Run multi-step loading simulation for AI routine generation
  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiGenerating(true);
    setGeneratorStep(0);

    const stepIntervals = [
      setTimeout(() => setGeneratorStep(1), 1000), // Step 1: Analyze
      setTimeout(() => setGeneratorStep(2), 2000), // Step 2: Formulate
      setTimeout(() => setGeneratorStep(3), 3000), // Step 3: Finalizing
    ];

    try {
      const routine = await generateAIWorkout(aiGoal, aiExperience, aiDays, aiEquipment);
      setSelectedRoutineId(routine.id);
    } catch (err) {
      console.error(err);
    } finally {
      stepIntervals.forEach(clearTimeout);
      setAiGenerating(false);
    }
  };

  // Selected routine helper
  const selectedRoutine = routines.find(r => r.id === selectedRoutineId);

  // Live Tracker progress calculation
  const getProgressPercentage = () => {
    if (!activeRoutine) return 0;
    let total = 0;
    let done = 0;
    activeRoutine.exercises.forEach(ex => {
      total += ex.sets;
      done += ex.completedSets.filter(Boolean).length;
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block font-mono">Training Center</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">Workout & Planner</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Build, log and generate your custom weight training program.</p>
      </div>

      {/* 1. Active Live Workout Interface */}
      <AnimatePresence>
        {activeRoutine && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-3xl border border-brand-lime/30 bg-white/80 dark:bg-zinc-950/80 relative overflow-hidden shadow-xl shadow-brand-lime/5"
          >
            {/* Background absolute glowing point */}
            <div className="absolute -right-24 -top-24 w-48 h-48 bg-brand-lime/10 blur-3xl rounded-full" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/5">
              <div>
                <span className="text-[10px] font-mono text-lime-700 dark:text-brand-lime font-bold uppercase tracking-wider block font-mono">ACTIVE SESSION RUNNING</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">{activeRoutine.name}</h3>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 px-4 py-2 rounded-xl text-zinc-800 dark:text-white font-mono text-sm">
                  <Timer className="w-4 h-4 text-lime-750 dark:text-brand-lime animate-pulse" />
                  <span>{formatTimer(liveWorkoutTimer)}</span>
                </div>
                {isLiveWorkoutRunning ? (
                  <button 
                    onClick={pauseLiveWorkout}
                    className="text-xs font-semibold text-zinc-650 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 px-3 py-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Pause
                  </button>
                ) : (
                  <button 
                    onClick={resumeLiveWorkout}
                    className="text-xs font-semibold text-black bg-brand-lime px-3 py-2 rounded-xl hover:opacity-95"
                  >
                    Resume
                  </button>
                )}
              </div>
            </div>

            {/* Completion metrics */}
            <div className="py-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <span>Routines Progress</span>
                <span className="text-lime-750 dark:text-brand-lime font-bold font-mono">{getProgressPercentage()}% Complete</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                <div className="bg-brand-lime h-full transition-all duration-300" style={{ width: `${getProgressPercentage()}%` }} />
              </div>
            </div>

            {/* Checklist of Exercises and Sets */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 my-4">
              {activeRoutine.exercises.map((ex) => (
                <div key={ex.id} className="p-4 rounded-2xl glass-card bg-zinc-100/50 dark:bg-zinc-900/40 border-black/5 dark:border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{ex.name}</h5>
                    <span className="text-[10px] text-zinc-500 font-mono font-medium">{ex.sets} sets x {ex.reps} reps ({ex.weight}kg)</span>
                  </div>
                  
                  {/* Set indicators click checkbox */}
                  <div className="flex flex-wrap gap-2.5">
                    {ex.completedSets.map((completed, setIdx) => (
                      <button
                        key={setIdx}
                        onClick={() => toggleExerciseSet(ex.id, setIdx)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all font-mono ${
                          completed 
                            ? 'bg-brand-lime/10 border-brand-lime/30 text-lime-750 dark:text-brand-lime' 
                            : 'bg-zinc-50 dark:bg-zinc-950/60 border-black/5 dark:border-white/5 text-zinc-500 hover:border-black/10 dark:hover:border-white/10 hover:text-zinc-800 dark:hover:text-zinc-300'
                        }`}
                      >
                        {completed ? <CheckCircle className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                        <span>Set {setIdx + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Finish and cancel actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-black/5 dark:border-white/5">
              <button
                onClick={completeLiveWorkout}
                className="flex-1 bg-brand-lime hover:bg-opacity-90 text-black font-bold text-sm py-3 rounded-xl text-center cursor-pointer"
              >
                Finish & Log Workout
              </button>
              <button
                onClick={cancelLiveWorkout}
                className="bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-red-650 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold text-sm px-5 py-3 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                Cancel Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid: Planner and AI Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Planner Left - Routine Organizer (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-black/5 dark:border-white/5">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-wide">Routine Manager</h3>
                <p className="text-[10px] text-zinc-500 font-medium">Select, edit or build customized training plans</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedRoutineId}
                  onChange={(e) => setSelectedRoutineId(e.target.value)}
                  className="text-xs bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2 text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>Select a routine</option>
                  {routines.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowAddRoutineForm(!showAddRoutineForm)}
                  className="text-xs bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 text-zinc-700 dark:text-zinc-300 font-semibold px-3 py-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> New Plan
                </button>
              </div>
            </div>

            {showAddRoutineForm && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateRoutine}
                className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-black/5 dark:border-white/5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Create Custom Plan</h4>
                  <button 
                    type="button" 
                    onClick={() => setShowAddRoutineForm(false)}
                    className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Plan Name</label>
                    <input
                      type="text"
                      required
                      value={newRoutineName}
                      onChange={(e) => setNewRoutineName(e.target.value)}
                      placeholder="e.g. Legs Day Heavy"
                      className="w-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-brand-lime"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Category</label>
                    <select
                      value={newRoutineCategory}
                      onChange={(e) => setNewRoutineCategory(e.target.value as WorkoutRoutine['category'])}
                      className="w-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-805 dark:text-zinc-200 focus:outline-none focus:border-brand-lime"
                    >
                      <option value="Strength">Strength</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Flexibility">Flexibility</option>
                      <option value="HIIT">HIIT</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Est. Duration (m)</label>
                    <input
                      type="number"
                      min="5"
                      max="180"
                      value={newRoutineDuration}
                      onChange={(e) => setNewRoutineDuration(Number(e.target.value))}
                      className="w-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-brand-lime"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-lime text-black font-bold text-xs py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Create Plan
                </button>
              </motion.form>
            )}

            {selectedRoutine ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block font-mono">Category</span>
                    <span className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold">{selectedRoutine.category} ({selectedRoutine.duration}m avg)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startLiveWorkout(selectedRoutine.id)}
                      disabled={!!activeRoutine}
                      className="bg-brand-lime text-black font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Live
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${selectedRoutine.name}"?`)) {
                          deleteRoutine(selectedRoutine.id);
                          setSelectedRoutineId(routines.find((r) => r.id !== selectedRoutine.id)?.id || '');
                        }
                      }}
                      className="p-2 bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 hover:border-red-500/20 text-zinc-500 dark:text-zinc-400 hover:text-red-500 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Interactive Click-Reorder Exercise list */}
                <div className="border-t border-black/5 dark:border-white/5 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block font-mono">Exercises (Reorder via controls)</span>
                    <button
                      type="button"
                      onClick={() => setShowAddExerciseForm(!showAddExerciseForm)}
                      className="text-[10px] bg-brand-lime/10 border border-brand-lime/20 text-lime-750 dark:text-brand-lime font-bold px-2.5 py-1.5 rounded-lg hover:bg-brand-lime/20 transition-all flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Exercise
                    </button>
                  </div>

                  {showAddExerciseForm && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddExercise}
                      className="mb-4 p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-black/5 dark:border-white/5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Add Exercise to {selectedRoutine.name}</h4>
                        <button 
                          type="button" 
                          onClick={() => setShowAddExerciseForm(false)}
                          className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 text-xs"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Exercise Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dumbbell Bicep Curls"
                            value={newExName}
                            onChange={(e) => setNewExName(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-brand-lime"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                          <div>
                            <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Sets</label>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={newExSets}
                              onChange={(e) => setNewExSets(Number(e.target.value))}
                              className="w-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 text-xs text-zinc-800 dark:text-white text-center focus:outline-none focus:border-brand-lime"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Reps</label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={newExReps}
                              onChange={(e) => setNewExReps(Number(e.target.value))}
                              className="w-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 text-xs text-zinc-800 dark:text-white text-center focus:outline-none focus:border-brand-lime"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Weight (kg)</label>
                            <input
                              type="number"
                              min="0"
                              max="500"
                              step="0.5"
                              value={newExWeight}
                              onChange={(e) => setNewExWeight(Number(e.target.value))}
                              className="w-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 text-xs text-zinc-800 dark:text-white text-center focus:outline-none focus:border-brand-lime"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-lime text-black font-bold text-xs py-2 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        Add Exercise
                      </button>
                    </motion.form>
                  )}

                  <div className="space-y-2.5">
                    {selectedRoutine.exercises.map((ex, idx) => (
                      <TelemetryExerciseCard
                        key={ex.id}
                        exercise={ex}
                        idx={idx}
                        routineId={selectedRoutine.id}
                        onMoveUp={() => reorderRoutineExercises(selectedRoutine.id, idx, idx - 1)}
                        onMoveDown={() => reorderRoutineExercises(selectedRoutine.id, idx, idx + 1)}
                        canMoveUp={idx > 0}
                        canMoveDown={idx < selectedRoutine.exercises.length - 1}
                      />
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-zinc-550 dark:text-zinc-500 text-xs font-mono">
                No routines available. Please configure one or use the AI Generator.
              </div>
            )}
          </div>

          {/* 2. Monthly Grid Calendar Widget */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-lime-700 dark:text-brand-lime" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Consistency Calendar</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-550 dark:text-zinc-400 font-bold uppercase">June 2026</span>
            </div>

            <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-semibold text-zinc-500 font-mono">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* Highlight active workout days */}
              {[...Array(daysInMonth)].map((_, i) => {
                const dayStr = `2026-06-${(i + 1).toString().padStart(2, '0')}`;
                const isActive = activeDays.has(dayStr);
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all relative ${
                      isActive 
                        ? 'bg-brand-lime/10 border border-brand-lime/40 text-lime-750 dark:text-brand-lime shadow shadow-brand-lime/10' 
                        : 'bg-zinc-100 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 text-zinc-500 dark:text-zinc-650'
                    }`}
                  >
                    {i + 1}
                    {isActive && (
                      <span className="absolute bottom-1 w-1 h-1 bg-brand-lime rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-4 pt-2 text-[10px] text-zinc-500 font-semibold font-mono">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-brand-lime/10 border border-brand-lime/40" /> Active Workout Days
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-zinc-100 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5" /> Rest Days
              </div>
            </div>
          </div>
        </div>

        {/* AI Generator Right - Forms inputs (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-5 relative overflow-hidden">
            {/* Top lighting details */}
            <div className="absolute -left-16 -top-16 w-32 h-32 bg-brand-cyan/5 blur-2xl rounded-full" />

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lime-750 dark:text-brand-lime" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-wide">AI Workout Generator</h3>
            </div>
            
            <p className="text-[11px] text-zinc-550 dark:text-zinc-400 leading-relaxed">
              Create a custom training loop with specific set thresholds. Our models analyze goals and generate volume target logs.
            </p>

            <form onSubmit={handleAIGenerate} className="space-y-4 pt-2">
              
              {/* Goal Selection */}
              <div>
                <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1.5 font-mono">Fitness Goal</label>
                <select
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none"
                >
                  <option value="Hypertrophy">Hypertrophy (Muscle Gain)</option>
                  <option value="Strength">Absolute Strength</option>
                  <option value="Fat Loss">Fat Loss & Conditioning</option>
                  <option value="Endurance">Cardiovascular Endurance</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1.5 font-mono">Experience Level</label>
                <select
                  value={aiExperience}
                  onChange={(e) => setAiExperience(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none"
                >
                  <option value="Beginner">Beginner (0-1 yrs)</option>
                  <option value="Intermediate">Intermediate (1-3 yrs)</option>
                  <option value="Advanced">Advanced (3+ yrs)</option>
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1.5 font-mono">Weekly Days ({aiDays})</label>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={aiDays}
                  onChange={(e) => setAiDays(Number(e.target.value))}
                  className="w-full accent-brand-lime h-1 bg-zinc-200 dark:bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Equipment */}
              <div>
                <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1.5 font-mono">Equipment Available</label>
                <select
                  value={aiEquipment}
                  onChange={(e) => setAiEquipment(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none"
                >
                  <option value="Full Gym">Full Gym Equipment</option>
                  <option value="Dumbbells Only">Dumbbells & Bench</option>
                  <option value="Bodyweight">Bodyweight / Calisthenics</option>
                </select>
              </div>

              {/* Action Button with Loading */}
              <button
                type="submit"
                disabled={aiGenerating}
                className="w-full bg-brand-lime hover:bg-opacity-95 text-black font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-4"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Synthesizing program...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Generate AI Program</span>
                  </>
                )}
              </button>

            </form>

            {/* Simulated Loading Steps Overlay */}
            <AnimatePresence>
              {aiGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/90 dark:bg-zinc-955/90 flex flex-col items-center justify-center p-6 text-center space-y-4"
                >
                  <Loader2 className="w-8 h-8 text-brand-lime animate-spin" />
                  
                  <div className="space-y-1.5 min-h-[50px]">
                    {generatorStep === 0 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-zinc-850 dark:text-zinc-200 font-semibold">
                        Analyzing biological dimensions & experience...
                      </motion.p>
                    )}
                    {generatorStep === 1 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-lime-750 dark:text-brand-lime font-bold">
                        Formulating optimal volumes for {aiGoal}...
                      </motion.p>
                    )}
                    {generatorStep === 2 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-brand-cyan font-bold">
                        Injecting {aiEquipment} specific progressions...
                      </motion.p>
                    )}
                    {generatorStep === 3 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-zinc-900 dark:text-white font-bold">
                        Structuring complete sets and routines...
                      </motion.p>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">Usually takes 3-4 seconds</p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

    </div>
  );
}

import { create } from 'zustand';

// Types
export interface UserProfile {
  name: string;
  avatar: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  targetWeight: number; // in kg
  streak: number;
  waterGoal: number; // in ml
  waterConsumed: number; // in ml
  sleepGoal: number; // in hours
  sleepLogged: number; // in hours
  calorieGoal: number;
  caloriesBurnedGoal: number;
  caloriesConsumedToday: number;
  caloriesBurnedToday: number;
  bio: string;
  gender: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
  notifications: {
    workoutReminders: boolean;
    nutritionAlerts: boolean;
    weeklyReports: boolean;
  };
  integrations: {
    appleHealth: boolean;
    googleFit: boolean;
    myFitnessPal: boolean;
  };
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number; // in kg
  completedSets: boolean[];
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  category: 'Strength' | 'Cardio' | 'Flexibility' | 'HIIT';
  duration: number; // in minutes
  exercises: Exercise[];
  isAI?: boolean;
}

export interface CompletedWorkout {
  id: string;
  name: string;
  category: string;
  duration: number;
  caloriesBurned: number;
  date: string; // YYYY-MM-DD
  completionRate: number; // percentage (0-100)
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number; // in g
  carbs: number; // in g
  fats: number; // in g
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  time: string; // HH:MM
}

export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fats: number;
}

export interface BMIHistoryEntry {
  id: string;
  weight: number;
  height: number;
  bmi: number;
  classification: string;
  date: string; // YYYY-MM-DD
}

export interface WeightHistoryEntry {
  date: string; // Mon, Tue, etc. or DD/MM
  weight: number;
}

export interface CalorieHistoryEntry {
  date: string;
  consumed: number;
  burned: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string; // HH:MM
  suggestions?: string[];
  planDetails?: {
    workout?: string[];
    meals?: string[];
    milestones?: string[];
  };
}

export interface ChatLog {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
}

export interface AppState {
  // Theme State
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // User Profile
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  addWater: (amount: number) => void;
  resetWater: () => void;
  addSleep: (amount: number) => void;

  // Workouts
  routines: WorkoutRoutine[];
  workoutHistory: CompletedWorkout[];
  activeRoutine: WorkoutRoutine | null;
  liveWorkoutTimer: number; // in seconds
  liveWorkoutIntervalId: any | null;
  isLiveWorkoutRunning: boolean;
  startLiveWorkout: (routineId: string) => void;
  pauseLiveWorkout: () => void;
  resumeLiveWorkout: () => void;
  tickLiveTimer: () => void;
  toggleExerciseSet: (exerciseId: string, setIndex: number) => void;
  completeLiveWorkout: () => void;
  cancelLiveWorkout: () => void;
  reorderRoutineExercises: (routineId: string, startIndex: number, endIndex: number) => void;
  addRoutine: (routine: WorkoutRoutine) => void;
  deleteRoutine: (id: string) => void;
  generateAIWorkout: (goal: string, experience: string, days: number, equipment: string) => Promise<WorkoutRoutine>;

  // Nutrition
  foodEntries: FoodEntry[];
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'time'>) => void;
  deleteFoodEntry: (id: string) => void;
  generateAIMealPlan: (dietPreference: string, goal: string, calorieTarget: number) => Promise<any>;

  // BMI
  bmiHistory: BMIHistoryEntry[];
  addBmiEntry: (height: number, weight: number) => BMIHistoryEntry;

  // Charts Historical Data
  weightHistory: WeightHistoryEntry[];
  calorieHistory: CalorieHistoryEntry[];

  // AI Coach Chat
  chats: ChatLog[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  sendMessage: (text: string) => void;
  addMockCoachResponse: (responseText: string, planDetails?: ChatMessage['planDetails']) => void;
}

// Helper to calculate BMI
const calculateBmiValue = (heightCm: number, weightKg: number) => {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

const getBmiClassification = (bmi: number) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

// Initial state and mock data
export const useAppStore = create<AppState>((set, get) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(newTheme);
    }
    return { theme: newTheme };
  }),
  setTheme: (theme) => set(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(theme);
    }
    return { theme };
  }),

  user: {
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    age: 28,
    height: 180,
    weight: 78.5,
    targetWeight: 74.0,
    streak: 14,
    waterGoal: 3000,
    waterConsumed: 1750,
    sleepGoal: 8,
    sleepLogged: 7.2,
    calorieGoal: 2200,
    caloriesBurnedGoal: 500,
    caloriesConsumedToday: 1650,
    caloriesBurnedToday: 420,
    bio: 'Dedicated software engineer by day, hybrid athlete by night. Focused on fat loss, muscle retention, and cardiovascular conditioning.',
    gender: 'Male',
    experienceLevel: 'Intermediate',
    activityLevel: 'Moderately Active',
    notifications: {
      workoutReminders: true,
      nutritionAlerts: true,
      weeklyReports: false,
    },
    integrations: {
      appleHealth: true,
      googleFit: false,
      myFitnessPal: true,
    }
  },

  updateUser: (updates) => set((state) => ({
    user: { ...state.user, ...updates }
  })),

  addWater: (amount) => set((state) => ({
    user: {
      ...state.user,
      waterConsumed: Math.min(state.user.waterGoal * 2, state.user.waterConsumed + amount)
    }
  })),

  resetWater: () => set((state) => ({
    user: { ...state.user, waterConsumed: 0 }
  })),

  addSleep: (amount) => set((state) => ({
    user: {
      ...state.user,
      sleepLogged: Math.max(0, Math.min(24, state.user.sleepLogged + amount))
    }
  })),

  routines: [
    {
      id: 'routine-1',
      name: 'Push Day Power',
      category: 'Strength',
      duration: 45,
      exercises: [
        { id: 'ex-1', name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 80, completedSets: [false, false, false, false] },
        { id: 'ex-2', name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 26, completedSets: [false, false, false] },
        { id: 'ex-3', name: 'Overhead Press (OHP)', sets: 3, reps: 8, weight: 45, completedSets: [false, false, false] },
        { id: 'ex-4', name: 'Tricep Rope Pushdowns', sets: 3, reps: 12, weight: 22, completedSets: [false, false, false] },
        { id: 'ex-5', name: 'Lateral Raises', sets: 4, reps: 15, weight: 10, completedSets: [false, false, false, false] }
      ]
    },
    {
      id: 'routine-2',
      name: 'Pull Hypertrophy',
      category: 'Strength',
      duration: 50,
      exercises: [
        { id: 'ex-6', name: 'Conventional Deadlift', sets: 3, reps: 5, weight: 120, completedSets: [false, false, false] },
        { id: 'ex-7', name: 'Lat Pull-downs', sets: 4, reps: 10, weight: 60, completedSets: [false, false, false, false] },
        { id: 'ex-8', name: 'Barbell Rows', sets: 3, reps: 8, weight: 70, completedSets: [false, false, false] },
        { id: 'ex-9', name: 'Incline Dumbbell Curls', sets: 3, reps: 12, weight: 14, completedSets: [false, false, false] },
        { id: 'ex-10', name: 'Face Pulls', sets: 4, reps: 15, weight: 18, completedSets: [false, false, false, false] }
      ]
    },
    {
      id: 'routine-3',
      name: 'HIIT Cardio Core',
      category: 'HIIT',
      duration: 30,
      exercises: [
        { id: 'ex-11', name: 'Kettlebell Swings', sets: 4, reps: 20, weight: 20, completedSets: [false, false, false, false] },
        { id: 'ex-12', name: 'Burpees', sets: 4, reps: 12, weight: 0, completedSets: [false, false, false, false] },
        { id: 'ex-13', name: 'Mountain Climbers', sets: 3, reps: 40, weight: 0, completedSets: [false, false, false] },
        { id: 'ex-14', name: 'Hanging Leg Raises', sets: 3, reps: 12, weight: 0, completedSets: [false, false, false] }
      ]
    }
  ],

  workoutHistory: [
    { id: 'hist-1', name: 'Push Day Power', category: 'Strength', duration: 48, caloriesBurned: 350, date: '2026-06-14', completionRate: 100 },
    { id: 'hist-2', name: 'HIIT Cardio Core', category: 'HIIT', duration: 28, caloriesBurned: 320, date: '2026-06-12', completionRate: 90 },
    { id: 'hist-3', name: 'Pull Hypertrophy', category: 'Strength', duration: 52, caloriesBurned: 410, date: '2026-06-11', completionRate: 100 },
    { id: 'hist-4', name: 'Leg Day Annihilation', category: 'Strength', duration: 60, caloriesBurned: 520, date: '2026-06-09', completionRate: 85 },
    { id: 'hist-5', name: 'Push Day Power', category: 'Strength', duration: 44, caloriesBurned: 340, date: '2026-06-08', completionRate: 100 },
    { id: 'hist-6', name: 'HIIT Cardio Core', category: 'HIIT', duration: 32, caloriesBurned: 380, date: '2026-06-07', completionRate: 100 }
  ],

  activeRoutine: null,
  liveWorkoutTimer: 0,
  liveWorkoutIntervalId: null,
  isLiveWorkoutRunning: false,

  startLiveWorkout: (routineId) => set((state) => {
    const routine = state.routines.find((r) => r.id === routineId);
    if (!routine) return {};
    
    // Reset completed sets tracker
    const clonedExercises = routine.exercises.map((ex) => ({
      ...ex,
      completedSets: Array(ex.sets).fill(false)
    }));
    
    const interval = setInterval(() => {
      get().tickLiveTimer();
    }, 1000);

    return {
      activeRoutine: { ...routine, exercises: clonedExercises },
      liveWorkoutTimer: 0,
      liveWorkoutIntervalId: interval,
      isLiveWorkoutRunning: true
    };
  }),

  pauseLiveWorkout: () => set((state) => {
    if (state.liveWorkoutIntervalId) {
      clearInterval(state.liveWorkoutIntervalId);
    }
    return { isLiveWorkoutRunning: false, liveWorkoutIntervalId: null };
  }),

  resumeLiveWorkout: () => set((state) => {
    if (state.isLiveWorkoutRunning) return {};
    const interval = setInterval(() => {
      get().tickLiveTimer();
    }, 1000);
    return { liveWorkoutIntervalId: interval, isLiveWorkoutRunning: true };
  }),

  tickLiveTimer: () => set((state) => ({
    liveWorkoutTimer: state.liveWorkoutTimer + 1
  })),

  toggleExerciseSet: (exerciseId, setIndex) => set((state) => {
    if (!state.activeRoutine) return {};
    const updatedExercises = state.activeRoutine.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const completed = [...ex.completedSets];
        completed[setIndex] = !completed[setIndex];
        return { ...ex, completedSets: completed };
      }
      return ex;
    });
    return {
      activeRoutine: { ...state.activeRoutine, exercises: updatedExercises }
    };
  }),

  completeLiveWorkout: () => set((state) => {
    if (!state.activeRoutine) return {};
    
    // Clear timer interval
    if (state.liveWorkoutIntervalId) {
      clearInterval(state.liveWorkoutIntervalId);
    }

    // Calculate completion rate
    let totalSets = 0;
    let completedSetsCount = 0;
    state.activeRoutine.exercises.forEach((ex) => {
      totalSets += ex.sets;
      completedSetsCount += ex.completedSets.filter(Boolean).length;
    });

    const completionRate = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;
    const caloriesBurned = Math.round((state.liveWorkoutTimer / 60) * 8.5); // 8.5 kcal per min approx
    
    const newHistoryEntry: CompletedWorkout = {
      id: `hist-${Date.now()}`,
      name: state.activeRoutine.name,
      category: state.activeRoutine.category,
      duration: Math.round(state.liveWorkoutTimer / 60),
      caloriesBurned,
      date: new Date().toISOString().split('T')[0],
      completionRate
    };

    return {
      workoutHistory: [newHistoryEntry, ...state.workoutHistory],
      activeRoutine: null,
      isLiveWorkoutRunning: false,
      liveWorkoutIntervalId: null,
      liveWorkoutTimer: 0,
      user: {
        ...state.user,
        streak: state.user.streak + 1,
        caloriesBurnedToday: state.user.caloriesBurnedToday + caloriesBurned
      }
    };
  }),

  cancelLiveWorkout: () => set((state) => {
    if (state.liveWorkoutIntervalId) {
      clearInterval(state.liveWorkoutIntervalId);
    }
    return {
      activeRoutine: null,
      isLiveWorkoutRunning: false,
      liveWorkoutIntervalId: null,
      liveWorkoutTimer: 0
    };
  }),

  reorderRoutineExercises: (routineId, startIndex, endIndex) => set((state) => {
    const updatedRoutines = state.routines.map((routine) => {
      if (routine.id === routineId) {
        const exercises = Array.from(routine.exercises);
        const [removed] = exercises.splice(startIndex, 1);
        exercises.splice(endIndex, 0, removed);
        return { ...routine, exercises };
      }
      return routine;
    });
    return { routines: updatedRoutines };
  }),

  addRoutine: (routine) => set((state) => ({
    routines: [...state.routines, routine]
  })),

  deleteRoutine: (id) => set((state) => ({
    routines: state.routines.filter((r) => r.id !== id)
  })),

  generateAIWorkout: (goal, experience, days, equipment) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const generatedRoutine: WorkoutRoutine = {
          id: `ai-routine-${Date.now()}`,
          name: `AI Generated ${goal} Core`,
          category: 'Strength',
          duration: 45,
          isAI: true,
          exercises: [
            { id: `ai-ex-1-${Date.now()}`, name: `DB Goblet Squats (${equipment})`, sets: 4, reps: 10, weight: 20, completedSets: [false, false, false, false] },
            { id: `ai-ex-2-${Date.now()}`, name: `Push-Ups (Chest-Focus)`, sets: 3, reps: 12, weight: 0, completedSets: [false, false, false] },
            { id: `ai-ex-3-${Date.now()}`, name: `Dumbbell Single-Arm Rows`, sets: 3, reps: 10, weight: 16, completedSets: [false, false, false] },
            { id: `ai-ex-4-${Date.now()}`, name: `Dumbbell Shoulder Press`, sets: 3, reps: 10, weight: 14, completedSets: [false, false, false] },
            { id: `ai-ex-5-${Date.now()}`, name: `Plank Hold (Core Stability)`, sets: 3, reps: 45, weight: 0, completedSets: [false, false, false] }
          ]
        };
        
        set((state) => ({
          routines: [generatedRoutine, ...state.routines]
        }));
        
        resolve(generatedRoutine);
      }, 3500); // 3.5s loading simulation
    });
  },

  foodEntries: [
    { id: 'food-1', name: 'Avocado Toast with Two Poached Eggs', calories: 420, protein: 22, carbs: 32, fats: 24, mealType: 'Breakfast', time: '08:15' },
    { id: 'food-2', name: 'Greek Yogurt with Granola & Honey', calories: 280, protein: 18, carbs: 36, fats: 6, mealType: 'Breakfast', time: '09:00' },
    { id: 'food-3', name: 'Grilled Chicken Breast, Quinoa & Broccoli', calories: 580, protein: 48, carbs: 45, fats: 14, mealType: 'Lunch', time: '13:00' },
    { id: 'food-4', name: 'Whey Protein Shake with Almond Milk', calories: 190, protein: 26, carbs: 6, fats: 4, mealType: 'Snacks', time: '16:30' },
    { id: 'food-5', name: 'Baked Salmon with Sweet Potato & Asparagus', calories: 520, protein: 38, carbs: 38, fats: 18, mealType: 'Dinner', time: '19:45' }
  ],

  addFoodEntry: (entry) => set((state) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: `food-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    const updatedEntries = [...state.foodEntries, newEntry];
    
    // Recalculate calories consumed today
    const caloriesConsumedToday = updatedEntries.reduce((total, f) => total + f.calories, 0);

    return {
      foodEntries: updatedEntries,
      user: {
        ...state.user,
        caloriesConsumedToday
      }
    };
  }),

  deleteFoodEntry: (id) => set((state) => {
    const updatedEntries = state.foodEntries.filter((f) => f.id !== id);
    const caloriesConsumedToday = updatedEntries.reduce((total, f) => total + f.calories, 0);
    return {
      foodEntries: updatedEntries,
      user: {
        ...state.user,
        caloriesConsumedToday
      }
    };
  }),

  generateAIMealPlan: (dietPreference, goal, calorieTarget) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mealPlan = {
          calories: calorieTarget,
          macros: {
            protein: Math.round((calorieTarget * 0.35) / 4),
            carbs: Math.round((calorieTarget * 0.40) / 4),
            fats: Math.round((calorieTarget * 0.25) / 9),
          },
          meals: [
            { type: 'Breakfast', name: 'Spinach & Feta Egg White Omelette with Oats', calories: Math.round(calorieTarget * 0.25) },
            { type: 'Lunch', name: 'Seared Tuna Salad with Olive Oil Dressing and Quinoa', calories: Math.round(calorieTarget * 0.35) },
            { type: 'Snack', name: 'Cottage Cheese with Berries & Handful of Almonds', calories: Math.round(calorieTarget * 0.15) },
            { type: 'Dinner', name: 'Lean Sirloin Beef Stir-fry with Brown Rice and Mixed Veggies', calories: Math.round(calorieTarget * 0.25) }
          ]
        };
        resolve(mealPlan);
      }, 3000);
    });
  },

  bmiHistory: [
    { id: 'bmi-1', weight: 81.2, height: 180, bmi: 25.1, classification: 'Overweight', date: '2026-04-15' },
    { id: 'bmi-2', weight: 80.0, height: 180, bmi: 24.7, classification: 'Normal weight', date: '2026-05-15' },
    { id: 'bmi-3', weight: 78.5, height: 180, bmi: 24.2, classification: 'Normal weight', date: '2026-06-15' }
  ],

  addBmiEntry: (height, weight) => {
    const bmiVal = calculateBmiValue(height, weight);
    const classification = getBmiClassification(bmiVal);
    const entry: BMIHistoryEntry = {
      id: `bmi-${Date.now()}`,
      weight,
      height,
      bmi: bmiVal,
      classification,
      date: new Date().toISOString().split('T')[0]
    };
    
    set((state) => ({
      bmiHistory: [...state.bmiHistory, entry],
      user: {
        ...state.user,
        weight,
        height
      }
    }));
    return entry;
  },

  weightHistory: [
    { date: 'May 1', weight: 81.5 },
    { date: 'May 5', weight: 81.2 },
    { date: 'May 10', weight: 80.9 },
    { date: 'May 15', weight: 80.6 },
    { date: 'May 20', weight: 80.4 },
    { date: 'May 25', weight: 80.0 },
    { date: 'May 30', weight: 79.8 },
    { date: 'Jun 4', weight: 79.3 },
    { date: 'Jun 9', weight: 79.0 },
    { date: 'Jun 14', weight: 78.5 }
  ],

  calorieHistory: [
    { date: 'Mon', consumed: 2150, burned: 480, protein: 140, carbs: 220, fats: 72 },
    { date: 'Tue', consumed: 1980, burned: 510, protein: 155, carbs: 180, fats: 65 },
    { date: 'Wed', consumed: 2300, burned: 350, protein: 120, carbs: 260, fats: 80 },
    { date: 'Thu', consumed: 2050, burned: 620, protein: 160, carbs: 195, fats: 68 },
    { date: 'Fri', consumed: 2100, burned: 490, protein: 145, carbs: 210, fats: 70 },
    { date: 'Sat', consumed: 2450, burned: 310, protein: 130, carbs: 280, fats: 85 },
    { date: 'Sun', consumed: 1650, burned: 420, protein: 114, carbs: 124, fats: 72 }
  ],

  chats: [
    {
      id: 'chat-1',
      title: 'Fitness Coach Session',
      date: '2026-06-15',
      messages: [
        { id: 'm1', sender: 'coach', text: 'Hello! I am your AI Coach. How can I help you transform your health today?', timestamp: '09:00' },
        { id: 'm2', sender: 'user', text: 'Hey, I want to review my workout and figure out how to drop another 3kg to reach my goal.', timestamp: '09:01' },
        { id: 'm3', sender: 'coach', text: 'You are currently at 78.5kg and doing great with a 14-day active streak! To lose another 3kg safely in 3-4 weeks, we should slightly adjust your daily calorie deficit by 200 kcal and focus on high-intensity intervals. Here is a custom action plan.', timestamp: '09:02', 
          planDetails: {
            workout: ['Add 15 min HIIT post weight session', 'Increase push day intensity'],
            meals: ['Reduce carb portions by 30g at dinner', 'Increase protein intake to 160g daily'],
            milestones: ['Target 77.0kg by June 28', 'Target 75.5kg by July 12']
          }
        }
      ]
    },
    {
      id: 'chat-2',
      title: 'Nutrition Strategy',
      date: '2026-06-13',
      messages: [
        { id: 'm4', sender: 'coach', text: 'Hi Alex! Lets refine your nutritional profile. How is your energy level during workouts?', timestamp: '14:20' },
        { id: 'm5', sender: 'user', text: 'Sometimes a bit low in the afternoon during leg workouts.', timestamp: '14:21' },
        { id: 'm6', sender: 'coach', text: 'That is likely due to low glycogen availability. I suggest consuming a complex carbohydrate source (like oatmeal or a banana) 60-90 minutes before your leg session.', timestamp: '14:23' }
      ]
    }
  ],
  activeChatId: 'chat-1',
  setActiveChatId: (id) => set({ activeChatId: id }),

  sendMessage: (text) => set((state) => {
    const activeChat = state.chats.find((c) => c.id === state.activeChatId);
    if (!activeChat) return {};

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    const updatedMessages = [...activeChat.messages, userMessage];
    const updatedChats = state.chats.map((c) => {
      if (c.id === state.activeChatId) {
        return { ...c, messages: updatedMessages };
      }
      return c;
    });

    return { chats: updatedChats };
  }),

  addMockCoachResponse: (responseText, planDetails) => set((state) => {
    const activeChat = state.chats.find((c) => c.id === state.activeChatId);
    if (!activeChat) return {};

    const coachMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'coach',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      planDetails
    };

    const updatedMessages = [...activeChat.messages, coachMessage];
    const updatedChats = state.chats.map((c) => {
      if (c.id === state.activeChatId) {
        return { ...c, messages: updatedMessages };
      }
      return c;
    });

    return { chats: updatedChats };
  })
}));


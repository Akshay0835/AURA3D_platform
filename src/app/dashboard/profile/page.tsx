'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Award, 
  Settings, 
  Clock, 
  ShieldCheck, 
  Bell, 
  Smartphone, 
  CheckCircle,
  Dumbbell,
  Utensils,
  Scale,
  Flame
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, workoutHistory, bmiHistory, foodEntries } = useAppStore();

  // Form states initialized with Zustand values
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age.toString());
  const [height, setHeight] = useState(user.height.toString());
  const [weight, setWeight] = useState(user.weight.toString());
  const [targetWeight, setTargetWeight] = useState(user.targetWeight.toString());
  const [calorieGoal, setCalorieGoal] = useState(user.calorieGoal.toString());
  const [bio, setBio] = useState(user.bio);
  
  const [wReminders, setWReminders] = useState(user.notifications.workoutReminders);
  const [nAlerts, setNAlerts] = useState(user.notifications.nutritionAlerts);
  const [wReports, setWReports] = useState(user.notifications.weeklyReports);
  
  const [appleHealth, setAppleHealth] = useState(user.integrations.appleHealth);
  const [googleFit, setGoogleFit] = useState(user.integrations.googleFit);
  const [myFitnessPal, setMyFitnessPal] = useState(user.integrations.myFitnessPal);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Combine workout history, BMI checks, and food logs into a unified timeline
  const timelineItems = [
    ...workoutHistory.map((w) => ({
      type: 'workout',
      title: `Completed ${w.name}`,
      meta: `${w.duration} mins | ${w.caloriesBurned} kcal burned | ${w.completionRate}% rate`,
      date: w.date,
      icon: Dumbbell,
      color: 'text-lime-600 dark:text-brand-lime bg-brand-lime/10 border-brand-lime/30 dark:border-brand-lime/20'
    })),
    ...bmiHistory.map((b) => ({
      type: 'bmi',
      title: `Logged BMI metrics check`,
      meta: `Weight: ${b.weight}kg | Computed BMI: ${b.bmi} (${b.classification})`,
      date: b.date,
      icon: Scale,
      color: 'text-cyan-600 dark:text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30 dark:border-brand-cyan/20'
    })),
    // Mocking past meal log milestones
    {
      type: 'meal',
      title: 'Logged Daily Macro Balance target',
      meta: 'Consumed 2,150 kcal (High Protein split logged)',
      date: '2026-06-14',
      icon: Utensils,
      color: 'text-pink-600 dark:text-pink-400 bg-pink-400/10 border-pink-400/30 dark:border-pink-400/20'
    },
    {
      type: 'milestone',
      title: 'Milestone unlocked: Consistent Champion',
      meta: 'Completed 10 consecutive active workout days!',
      date: '2026-06-10',
      icon: Award,
      color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-400/10 border-yellow-400/30 dark:border-yellow-400/20'
    }
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      age: Number(age) || 28,
      height: Number(height) || 180,
      weight: Number(weight) || 78,
      targetWeight: Number(targetWeight) || 74,
      calorieGoal: Number(calorieGoal) || 2200,
      bio,
      notifications: {
        workoutReminders: wReminders,
        nutritionAlerts: nAlerts,
        weeklyReports: wReports
      },
      integrations: {
        appleHealth,
        googleFit,
        myFitnessPal
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const badges = [
    { title: "Streak Master", desc: "14 Days training active", glow: "border-brand-lime/30 text-lime-600 dark:text-brand-lime bg-brand-lime/5" },
    { title: "Macro Wizard", desc: "Protein goals hit 5x", glow: "border-brand-cyan/30 text-cyan-600 dark:text-brand-cyan bg-brand-cyan/5" },
    { title: "Volume Beast", desc: "10,000kg load recorded", glow: "border-pink-500/30 text-pink-500 bg-pink-500/5" },
    { title: "Early Bird", desc: "Workouts completed before 9AM", glow: "border-amber-500/30 text-amber-600 dark:text-amber-500 bg-amber-500/5" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Identity management</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">Profile & Settings</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Configure biometric offsets, preferences and review historical achievements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Avatar header, Badges, Timeline (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Profile Card Header */}
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden bg-gradient-to-br from-zinc-100/60 to-zinc-200/80 dark:from-zinc-900/60 dark:to-zinc-950/80">
            {/* Background lighting flare */}
            <div className="absolute -right-24 -top-24 w-52 h-52 bg-brand-lime/10 blur-3xl rounded-full" />
            
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-20 h-20 rounded-full border-2 border-brand-lime/40 object-cover shrink-0"
              />
              <div className="text-center sm:text-left space-y-1 overflow-hidden">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-wide">{user.name}</h2>
                <span className="inline-block text-[10px] font-mono font-bold text-zinc-900 bg-brand-lime px-2.5 py-0.5 rounded-full uppercase">
                  Intermediate Athlete
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal max-w-sm pt-1 truncate sm:whitespace-normal sm:line-clamp-2">
                  {user.bio}
                </p>
              </div>
            </div>

            {/* Quick stats splits */}
            <div className="grid grid-cols-3 gap-4 border-t border-black/5 dark:border-white/5 pt-5 mt-6 text-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase block">Activity Streak</span>
                <span className="text-xl font-extrabold text-zinc-900 dark:text-white">{user.streak}d</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase block">Weight Goal</span>
                <span className="text-xl font-extrabold text-brand-cyan">{user.targetWeight}kg</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase block">Calorie limit</span>
                <span className="text-xl font-extrabold text-pink-400">{user.calorieGoal}</span>
              </div>
            </div>
          </div>

          {/* Badges Achievements */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-black/5 dark:border-white/5">
              <Award className="w-4.5 h-4.5 text-brand-lime" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Unlocked Achievements</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {badges.map((badge, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${badge.glow} flex items-center gap-3`}>
                  <div className="w-8 h-8 rounded-lg bg-zinc-200/40 dark:bg-zinc-900/60 flex items-center justify-center border border-black/5 dark:border-white/5">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{badge.title}</h5>
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Activity Timeline */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-black/5 dark:border-white/5">
              <Clock className="w-4.5 h-4.5 text-brand-cyan" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Activity History Log</h3>
            </div>

            <div className="relative border-l border-black/10 dark:border-white/10 pl-6 ml-3 space-y-6 max-h-[300px] overflow-y-auto pr-1 pt-2">
              {timelineItems.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Visual Node Pin connector */}
                  <span className={`absolute -left-[35px] top-0.5 w-6.5 h-6.5 rounded-full flex items-center justify-center border text-xs shrink-0 ${item.color}`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </span>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 font-bold block">{item.date}</span>
                    <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{item.title}</h5>
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Profile edit bio forms & configs (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Settings configurations forms */}
          <div className="glass-card p-6 rounded-3xl space-y-5 relative">
            <div className="flex items-center gap-2 pb-2 border-b border-black/5 dark:border-white/5">
              <Settings className="w-4.5 h-4.5 text-brand-lime" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Biometric & Bio Settings</h3>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              <div>
                <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Bio Description</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Age (yrs)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-xl px-2.5 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Target Weight</label>
                  <input
                    type="number"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-xl px-2.5 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-1">Daily Calories</label>
                  <input
                    type="number"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-xl px-2.5 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900"
                    required
                  />
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="border-t border-black/5 dark:border-white/5 pt-4 space-y-3">
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5" /> Notifications preferences
                </span>
                
                <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wReminders}
                      onChange={(e) => setWReminders(e.target.checked)}
                      className="rounded border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-brand-lime focus:ring-0 focus:ring-offset-0"
                    />
                    <span>Active Workout Reminders</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nAlerts}
                      onChange={(e) => setNAlerts(e.target.checked)}
                      className="rounded border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-brand-lime focus:ring-0 focus:ring-offset-0"
                    />
                    <span>Macro Calorie Warning Alerts</span>
                  </label>
                </div>
              </div>

              {/* Device API Integrations */}
              <div className="border-t border-black/5 dark:border-white/5 pt-4 space-y-3">
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> Core API Integrations
                </span>

                <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appleHealth}
                      onChange={(e) => setAppleHealth(e.target.checked)}
                      className="rounded border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-brand-lime focus:ring-0 focus:ring-offset-0"
                    />
                    <span>Sync Apple Health biometric values</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={myFitnessPal}
                      onChange={(e) => setMyFitnessPal(e.target.checked)}
                      className="rounded border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-brand-lime focus:ring-0 focus:ring-offset-0"
                    />
                    <span>Export meal logs to MyFitnessPal</span>
                  </label>
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full bg-brand-lime text-black font-semibold text-xs py-3.5 rounded-xl cursor-pointer"
              >
                Save Settings
              </button>

            </form>

            {/* Floating Saved Success alert */}
            <AnimatePresence>
              {savedSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-brand-lime/30 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-brand-lime" />
                  <span className="text-xs font-semibold text-zinc-900 dark:text-white">Biometrics updated successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

    </div>
  );
}

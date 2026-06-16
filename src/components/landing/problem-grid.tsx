'use client';

import { motion } from 'framer-motion';
import { CalendarX, UtensilsCrossed, ShieldAlert, TrendingDown } from 'lucide-react';

const problems = [
  {
    icon: CalendarX,
    title: "No Workout Consistency",
    description: "Life gets busy, routines get boring, and motivation fades. Sticking to a workout schedule feels like an uphill battle.",
    color: "from-red-500/25 to-red-500/0",
    accent: "text-red-500 dark:text-red-400 bg-red-500/10 border-red-500/20",
    hoverBorder: "hover:border-red-500/20 dark:hover:border-red-500/30",
    glowColor: "bg-red-500/10"
  },
  {
    icon: UtensilsCrossed,
    title: "Poor Nutrition Tracking",
    description: "Counting calories manually is tedious and exhausting. Guesswork leads to hitting plateaus and failing goals.",
    color: "from-orange-500/25 to-orange-500/0",
    accent: "text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
    hoverBorder: "hover:border-orange-500/20 dark:hover:border-orange-500/30",
    glowColor: "bg-orange-500/10"
  },
  {
    icon: ShieldAlert,
    title: "No Personal Guidance",
    description: "Generic workouts don't fit your body's unique metrics. Hiring quality trainers and nutritionists is extremely expensive.",
    color: "from-amber-500/25 to-amber-500/0",
    accent: "text-amber-550 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    hoverBorder: "hover:border-amber-500/20 dark:hover:border-amber-500/30",
    glowColor: "bg-amber-500/10"
  },
  {
    icon: TrendingDown,
    title: "No Progress Visibility",
    description: "Without structured analytics, you're flying blind. It is impossible to see if your hard work is actually translating into results.",
    color: "from-pink-500/25 to-pink-500/0",
    accent: "text-pink-500 dark:text-pink-400 bg-pink-500/10 border-pink-500/20",
    hoverBorder: "hover:border-pink-500/20 dark:hover:border-pink-500/30",
    glowColor: "bg-pink-500/10"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
} as const;

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 16
    }
  }
} as const;


export default function ProblemGrid() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto"
    >
      {problems.map((prob, i) => (
        <motion.div
          key={i}
          variants={cardVariants}
          className={`glass-card p-8 rounded-2xl relative overflow-hidden group border-black/5 dark:border-white/5 ${prob.hoverBorder} hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
        >
          {/* Accent lighting glow */}
          <div className={`absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br ${prob.color} blur-2xl rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500`} />
          <div className={`absolute -left-12 -bottom-12 w-24 h-24 ${prob.glowColor} blur-2xl rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500`} />
          
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-350 group-hover:scale-110 group-hover:rotate-3 shadow-xs ${prob.accent}`}>
            <prob.icon className="w-6 h-6 animate-pulse-slow" />
          </div>

          <h3 className="text-lg font-bold mb-3 tracking-wide text-zinc-900 dark:text-zinc-100">{prob.title}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed font-medium">{prob.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

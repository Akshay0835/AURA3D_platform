'use client';

import { motion } from 'framer-motion';
import { CalendarX, UtensilsCrossed, ShieldAlert, TrendingDown } from 'lucide-react';

const problems = [
  {
    icon: CalendarX,
    title: "No Workout Consistency",
    description: "Life gets busy, routines get boring, and motivation fades. Sticking to a workout schedule feels like an uphill battle.",
    color: "from-red-500/20 to-red-500/5",
    accent: "text-red-400"
  },
  {
    icon: UtensilsCrossed,
    title: "Poor Nutrition Tracking",
    description: "Counting calories manually is tedious and exhausting. Guesswork leads to hitting plateaus and failing goals.",
    color: "from-orange-500/20 to-orange-500/5",
    accent: "text-orange-400"
  },
  {
    icon: ShieldAlert,
    title: "No Personal Guidance",
    description: "Generic workouts don't fit your body's unique metrics. Hiring quality trainers and nutritionists is extremely expensive.",
    color: "from-yellow-500/20 to-yellow-500/5",
    accent: "text-yellow-400"
  },
  {
    icon: TrendingDown,
    title: "No Progress Visibility",
    description: "Without structured analytics, you're flying blind. It is impossible to see if your hard work is actually translating into results.",
    color: "from-pink-500/20 to-pink-500/5",
    accent: "text-pink-400"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
} as const;

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  }
} as const;


export default function ProblemGrid() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto"
    >
      {problems.map((prob, i) => (
        <motion.div
          key={i}
          variants={cardVariants}
          className="glass-card p-8 rounded-2xl relative overflow-hidden group border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/20 transition-all duration-300"
        >
          {/* Accent lighting glow */}
          <div className={`absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br ${prob.color} blur-2xl rounded-full opacity-60 group-hover:scale-150 transition-all duration-500`} />
          
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/40 border border-black/5 dark:border-white/5 mb-6 ${prob.accent}`}>
            <prob.icon className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-semibold mb-3 tracking-wide text-zinc-900 dark:text-zinc-100">{prob.title}</h3>
          <p className="text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">{prob.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { Dumbbell, ArrowRight, ShieldCheck, Star, Sparkles, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import HeroCanvas from '@/components/landing/hero-canvas';
import ProblemGrid from '@/components/landing/problem-grid';
import HorizontalScrollShowcase from '@/components/landing/horizontal-scroll';
import CoachDemoWidget from '@/components/landing/coach-demo';
import { useAppStore } from '@/store/useAppStore';


// Section 5: Stat Counter Component using Framer Motion's high-performance ticker
function StatCounter({ value, suffix = "", duration = 1.5 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  
  // Format the raw count value to locale string
  const rounded = useTransform(count, (latest) => {
    return Math.floor(latest).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: duration,
        ease: "easeOut",
      });
      return () => controls.stop();
    }
  }, [isInView, count, value, duration]);

  return (
    <span ref={ref} className="font-mono tabular-nums text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );

}



// Section 6: Testimonials
const testimonials = [
  {
    quote: "Aura3D has completely replaced my personal trainer. The AI Coach adjusted my calorie deficits when I hit a weight plateau, and I dropped 4kg in a month.",
    author: "Marcus Vance",
    role: "Marathon Runner & Architect",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    rating: 5
  },
  {
    quote: "The 3D interactive interfaces and the drag-and-drop workout builders feel extremely premium. It is like using Linear or Vercel but for physical fitness.",
    author: "Elena Rostova",
    role: "Fullstack Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 5
  },
  {
    quote: "I was skeptical about AI Meal Generators, but the macro breakdowns and recipe recommendations are delicious, precise, and extremely easy to cook.",
    author: "David Chen",
    role: "Crossfit Athlete",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    rating: 5
  }
];

export default function LandingPage() {
  const router = useRouter();
  const theme = useAppStore((state) => state.theme);
  const limeColor = theme === 'dark' ? '#a3e635' : '#65a30d';
  const cyanColor = theme === 'dark' ? '#06b6d4' : '#0284c7';
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'annually'>('monthly');

  // Dashboard Launch Calibration States
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [launchStep, setLaunchStep] = useState('');
  const [targetPath, setTargetPath] = useState('/dashboard');

  const launchSequence = (path: string) => {
    setIsLaunching(true);
    setLaunchProgress(0);
    setLaunchStep("Calibrating biometric telemetry...");
    setTargetPath(path);
  };

  useEffect(() => {
    if (!isLaunching) return;

    let currentProgress = 0;
    const steps = [
      { threshold: 25, label: "Calibrating biometric telemetry..." },
      { threshold: 50, label: "Syncing training & macro indices..." },
      { threshold: 75, label: "Booting neural AI coaching nodes..." },
      { threshold: 95, label: "Decrypting secure wellness vaults..." },
      { threshold: 100, label: "Calibration complete. Launching..." }
    ];

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4; // increment randomly
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setLaunchProgress(100);
        setLaunchStep("Calibration complete. Launching...");
        setTimeout(() => {
          router.push(targetPath);
          setIsLaunching(false);
        }, 400); // Hold at 100% briefly for sensory closure
      } else {
        setLaunchProgress(currentProgress);
        const activeStep = steps.find(s => currentProgress < s.threshold);
        if (activeStep) {
          setLaunchStep(activeStep.label);
        }
      }
    }, 70);

    return () => clearInterval(interval);
  }, [isLaunching, targetPath, router]);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 overflow-x-hidden selection:bg-brand-lime selection:text-black transition-colors duration-300">
      {/* Background Glowing Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-lime/5 rounded-full blur-3xl pointer-events-none opacity-60 dark:opacity-100" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none opacity-60 dark:opacity-100" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none opacity-60 dark:opacity-100" />

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card bg-white/40 dark:bg-zinc-950/40 border-b border-black/5 dark:border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-lime flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold tracking-wider text-xl bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              AURA<span className="text-brand-lime font-light">3D</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <a href="#problems" className="hover:text-black dark:hover:text-white transition-colors">Challenges</a>
            <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">Features</a>
            <a href="#coach" className="hover:text-black dark:hover:text-white transition-colors">AI Coach</a>
            <a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">Pricing</a>
          </nav>

          <button 
            onClick={() => launchSequence('/dashboard')}
            className="relative group overflow-hidden bg-brand-lime text-black font-semibold text-xs px-3 sm:px-5 py-2.5 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
          >
            <span className="relative z-10 flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
              Launch<span className="hidden sm:inline"> Dashboard</span> <ArrowRight className="w-4 h-4" />
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </div>
      </header>

      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 space-y-6 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lime/10 border border-brand-lime/20 text-brand-lime text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Fitness Engine
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-zinc-900 dark:text-white">
            Transform Your Body With <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-brand-lime via-brand-cyan to-pink-500 bg-clip-text text-transparent">
              AI-Powered Fitness
            </span> <br />
            Intelligence.
          </h1>

          <p className="text-zinc-650 dark:text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
            Stop guessing macros and wasting hours on stagnant routines. Aura3D uses spatial 3D trackers, predictive biomechanics, and active AI logs to craft hyper-personalized workout schedules.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button 
              onClick={() => launchSequence('/dashboard')}
              className="bg-zinc-950 text-white hover:bg-zinc-900 dark:bg-white dark:text-black dark:hover:bg-zinc-100 font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-black/5 dark:shadow-white/5 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Start Your Fitness Journey <ArrowRight className="w-4.5 h-4.5" />
            </button>

            <button 
              onClick={() => launchSequence('/dashboard/coach')}
              className="glass-card bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer text-zinc-800 dark:text-zinc-200"
            >
              Try AI Coach
            </button>
          </div>

          <div className="flex items-center gap-8 pt-8 border-t border-black/5 dark:border-white/5 max-w-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-cyan" />
              <span className="text-xs text-zinc-650 dark:text-zinc-500 font-medium">HIPAA Compliant Data</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-cyan" />
              <span className="text-xs text-zinc-650 dark:text-zinc-500 font-medium">No Credit Card Needed</span>
            </div>
          </div>
        </motion.div>

        {/* 3D Canvas Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 relative w-full"
        >
          <div className="relative z-10 glass-card bg-zinc-950/10 dark:bg-zinc-900/10 rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl">
            <HeroCanvas />
          </div>
          {/* Subtle surrounding decorative frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-lime/10 to-brand-cyan/10 rounded-3xl blur opacity-30 pointer-events-none" />
        </motion.div>
      </section>

      {/* SECTION 2: PROBLEM STATEMENT */}
      <section id="problems" className="py-24 border-t border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-4">
          <span className="text-brand-cyan font-mono text-sm tracking-widest uppercase">The Roadblocks</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Why 92% of Fitness Programs Fail
          </h2>
          <p className="text-zinc-650 dark:text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Without tailored structures, feedback mechanisms, and progress visualization, building healthy habits is nearly impossible.
          </p>
        </div>
        <ProblemGrid />
      </section>

      {/* SECTION 3: FEATURE SHOWCASE (HORIZONTAL SCROLL) */}
      <section id="features" className="border-t border-black/5 dark:border-white/5">
        <HorizontalScrollShowcase />
      </section>

      {/* SECTION 4: AI COACH DEMO CANVAS */}
      <section id="coach" className="py-24 border-t border-black/5 dark:border-white/5 bg-zinc-50/70 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-4">
          <span className="text-pink-500 font-mono text-sm tracking-widest uppercase">AI Agent Interaction</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Consult the AI Fitness Intelligence
          </h2>
          <p className="text-zinc-650 dark:text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Experience real-time interactive counseling. Simply detail your weight targets or workout obstacles, and witness customized routines build.
          </p>
        </div>
        <div className="px-6">
          <CoachDemoWidget />
        </div>
      </section>

      {/* SECTION 5: STATISTICS COUNTERS */}
      <section className="py-20 bg-zinc-100/40 dark:bg-zinc-900/40 border-t border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <StatCounter value={500000} suffix="+" />
            <p className="text-sm font-semibold tracking-widest text-brand-lime uppercase font-mono">Workouts Completed</p>
            <p className="text-xs text-zinc-655 dark:text-zinc-500">Tracked with spatial data logs</p>
          </div>
          <div className="space-y-2">
            <StatCounter value={1000000} suffix="M+" />
            <p className="text-sm font-semibold tracking-widest text-brand-cyan uppercase font-mono">Calories Consumed</p>
            <p className="text-xs text-zinc-655 dark:text-zinc-500">Logged via verified food databases</p>
          </div>
          <div className="space-y-2">
            <StatCounter value={100000} suffix="+" />
            <p className="text-sm font-semibold tracking-widest text-pink-500 uppercase font-mono">AI Plans Created</p>
            <p className="text-xs text-zinc-655 dark:text-zinc-500">Customized by neural coaching nodes</p>
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS CAROUSEL */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 space-y-2">
          <span className="text-brand-lime font-mono text-sm tracking-widest uppercase font-semibold">User Endorsements</span>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">Loved by Builders and Athletes</h2>
        </div>

        <div className="relative glass-card p-8 md:p-12 rounded-3xl border-black/5 dark:border-white/10 bg-zinc-100/30 dark:bg-zinc-900/30 overflow-hidden">
          <div className="absolute top-6 left-6 text-zinc-200 dark:text-zinc-800 text-7xl font-serif select-none pointer-events-none">“</div>
          
          <div className="min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                <p className="text-zinc-800 dark:text-zinc-200 text-lg md:text-xl font-medium leading-relaxed italic">
                  {testimonials[activeTestimonial].quote}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={testimonials[activeTestimonial].avatar} 
                    alt={testimonials[activeTestimonial].author} 
                    className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 object-cover"
                  />
                  <div className="text-left">
                    <h5 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{testimonials[activeTestimonial].author}</h5>
                    <p className="text-zinc-500 text-xs">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-1">
              {[...Array(testimonials.length)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? "bg-brand-lime w-6" : "bg-zinc-700"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={prevTestimonial} 
                className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-zinc-400" />
              </button>
              <button 
                onClick={nextTestimonial} 
                className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: INTERACTIVE PRICING TABLE */}
      <section id="pricing" className="py-24 border-t border-black/5 dark:border-white/5 bg-zinc-50/30 dark:bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-4">
          <span className="text-brand-cyan font-mono text-sm tracking-widest uppercase">Pricing Matrix</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Invest in Your Physical Intelligence
          </h2>
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-sm ${pricingPeriod === 'monthly' ? 'text-zinc-800 dark:text-white font-medium' : 'text-zinc-500'}`}>Monthly</span>
            <button
              onClick={() => setPricingPeriod(pricingPeriod === 'monthly' ? 'annually' : 'monthly')}
              className="w-12 h-6.5 rounded-full bg-zinc-200 dark:bg-zinc-800 p-1 flex items-center transition-colors relative"
            >
              <motion.div
                layout
                className="w-4.5 h-4.5 rounded-full bg-brand-lime"
                animate={{ x: pricingPeriod === 'monthly' ? 0 : 20 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm ${pricingPeriod === 'annually' ? 'text-brand-lime font-medium' : 'text-zinc-500'} flex items-center gap-1.5`}>
              Annually <span className="text-[10px] bg-brand-lime/10 border border-brand-lime/30 text-brand-lime font-bold px-1.5 py-0.5 rounded">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="glass-card p-8 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-between hover:border-black/10 dark:hover:border-white/10 transition-all duration-300">
            <div>
              <span className="text-zinc-500 text-xs font-bold uppercase font-mono tracking-wider">Base Tier</span>
              <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">Aura Free</h4>
              <p className="text-zinc-555 dark:text-zinc-400 text-xs mt-3">Essential physical tracking tools for building basic consistency.</p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">$0</span>
                <span className="text-zinc-500 text-xs font-medium">/ month</span>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>Manual Workout Planner</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>Breakfast & Dinner Food logs</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>Standard BMI Calculator</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-400 dark:text-zinc-500 line-through">
                  <span>AI Workout & Meal Generation</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-400 dark:text-zinc-500 line-through">
                  <span>Immersive AI Coach chat sessions</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={() => launchSequence('/dashboard')}
              className="w-full text-center bg-zinc-950 dark:bg-zinc-900 border border-black/5 dark:border-white/5 hover:bg-zinc-900 dark:hover:bg-zinc-800 text-white font-semibold py-3.5 rounded-2xl text-sm transition-colors mt-8 block cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Pro Tier */}
          <div className="glass-card p-8 rounded-3xl border-brand-lime/20 relative flex flex-col justify-between shadow-xl shadow-brand-lime/5 transform md:scale-[1.03] bg-zinc-100/60 dark:bg-zinc-900/30">
            <div className="absolute top-4 right-4 bg-brand-lime text-black text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">
              Popular Choice
            </div>
            <div>
              <span className="text-brand-lime text-xs font-bold uppercase font-mono tracking-wider">Premium Tier</span>
              <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">Aura Pro</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-3">Advanced AI intelligence and spatial charts to optimize metabolic changes.</p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                  {pricingPeriod === 'monthly' ? '$14' : '$11'}
                </span>
                <span className="text-zinc-500 text-xs font-medium">/ month</span>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>All Free logs & builders</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span className="font-medium text-zinc-900 dark:text-white">AI Workout Generator</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span className="font-medium text-zinc-900 dark:text-white">AI Meal Planner & Macros</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>Interactive BMI Gauge & History</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>Full Recharts Analytics Dashboard</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={() => launchSequence('/dashboard')}
              className="w-full text-center bg-brand-lime text-black font-semibold py-3.5 rounded-2xl text-sm hover:opacity-95 transition-opacity mt-8 block cursor-pointer"
            >
              Subscribe Now
            </button>
          </div>

          {/* Elite Tier */}
          <div className="glass-card p-8 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-between hover:border-black/10 dark:hover:border-white/10 transition-all duration-300">
            <div>
              <span className="text-zinc-500 text-xs font-bold uppercase font-mono tracking-wider">Performance Tier</span>
              <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">Aura Elite</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-3">24/7 unlimited access to virtual conditioning intelligence and physical logs.</p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                  {pricingPeriod === 'monthly' ? '$29' : '$23'}
                </span>
                <span className="text-zinc-500 text-xs font-medium">/ month</span>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>All Pro Features included</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span className="font-medium text-zinc-900 dark:text-white">24/7 Voice AI Coach Integration</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>Custom Marathon & Conditioning Programs</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>Apple Health & Google Fit APIs</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={() => launchSequence('/dashboard')}
              className="w-full text-center bg-zinc-950 dark:bg-zinc-900 border border-black/5 dark:border-white/5 hover:bg-zinc-900 dark:hover:bg-zinc-800 text-white font-semibold py-3.5 rounded-2xl text-sm transition-colors mt-8 block cursor-pointer"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8: MULTI-COLUMN SAAS FOOTER */}
      <footer className="border-t border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-12">
          {/* Logo Brand column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-lime flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold tracking-wider text-xl bg-gradient-to-r from-zinc-900 to-zinc-650 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                AURA<span className="text-brand-lime font-light">3D</span>
              </span>
            </div>
            <p className="text-zinc-550 dark:text-zinc-505 text-xs leading-relaxed max-w-sm">
              Next-generation spatial logs and neural coaching models, engineered for rapid body composition shifts. Start your transition today.
            </p>
            <p className="text-[10px] text-zinc-650 dark:text-zinc-600 font-mono">© 2026 Aura3D Inc. All rights reserved.</p>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 font-mono">App Solutions</h5>
            <ul className="text-xs text-zinc-500 space-y-2.5">
              <li><Link href="/dashboard/workout" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Workout Builder</Link></li>
              <li><Link href="/dashboard/nutrition" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Meal Generator</Link></li>
              <li><Link href="/dashboard/bmi" className="hover:text-zinc-900 dark:hover:text-white transition-colors">BMI Analytics</Link></li>
              <li><Link href="/dashboard/coach" className="hover:text-zinc-900 dark:hover:text-white transition-colors">AI Conditioning Coach</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 font-mono">Platform Info</h5>
            <ul className="text-xs text-zinc-500 space-y-2.5">
              <li><Link href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Core Features</Link></li>
              <li><Link href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing Matrix</Link></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Security Infrastructure</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Developer API</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 font-mono">Regulatory</h5>
            <ul className="text-xs text-zinc-500 space-y-2.5">
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Charter</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">HIPAA Compliance</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">GDPR Controls</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Immersive Transition Animation Overlay */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl text-center px-6"
          >
            {/* Spinning Holographic SVG Dial */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-8">
              {/* Outer ring */}
              <motion.svg 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-full h-full absolute"
              >
                <circle cx="64" cy="64" r="54" stroke={theme === 'dark' ? 'rgba(163,230,53,0.1)' : 'rgba(101,163,13,0.1)'} strokeWidth="2.5" fill="transparent" />
                <circle cx="64" cy="64" r="54" stroke={limeColor} strokeWidth="2.5" fill="transparent" strokeDasharray="339" strokeDashoffset="240" strokeLinecap="round" />
              </motion.svg>
              {/* Mid ring */}
              <motion.svg 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-24 h-24 absolute"
              >
                <circle cx="48" cy="48" r="38" stroke={theme === 'dark' ? 'rgba(6,182,212,0.1)' : 'rgba(2,132,199,0.1)'} strokeWidth="2" fill="transparent" />
                <circle cx="48" cy="48" r="38" stroke={cyanColor} strokeWidth="2" fill="transparent" strokeDasharray="238" strokeDashoffset="150" strokeLinecap="round" />
              </motion.svg>
              {/* Inner pulsing core */}
              <motion.div 
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shadow-lg shadow-pink-500/10"
              >
                <Dumbbell className="w-5 h-5 text-pink-500 dark:text-pink-400" />
              </motion.div>
            </div>

            {/* Glowing Telemetry Labels */}
            <div className="space-y-3 mb-6">
              <motion.span 
                key={launchStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${theme === 'dark' ? 'text-brand-lime' : 'text-lime-700'}`}
              >
                {launchStep}
              </motion.span>
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">System Calibration In Progress</h3>
            </div>

            {/* Progress bar container */}
            <div className="space-y-2">
              <div className="w-64 h-1.5 bg-zinc-200 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-full overflow-hidden relative font-mono">
                <motion.div 
                  className="h-full bg-gradient-to-r from-brand-lime via-brand-cyan to-pink-500"
                  style={{ width: `${launchProgress}%` }}
                />
              </div>
              <span className="text-xs font-mono text-zinc-500 font-bold">{launchProgress}% Complete</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

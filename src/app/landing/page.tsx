'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { 
  Dumbbell, 
  ArrowRight, 
  Star, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Activity, 
  Zap, 
  Flame, 
  UserCheck, 
  Award,
  ChevronDown,
  Mail,
  HeartPulse
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import InteractiveBackground from '@/components/landing/interactive-bg';
import HorizontalScrollShowcase from '@/components/landing/horizontal-scroll';
import ProblemGrid from '@/components/landing/problem-grid';
import CoachDemoWidget from '@/components/landing/coach-demo';
import BiomechanicalMotionLab from '@/components/landing/biomechanical-motion-lab';
import PricingSection from '@/components/landing/pricing';

const revealVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } 
  }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const heroCardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 1, delay: 0.1, ease: "easeOut" as const }
  }
} as const;

const heroImageVariants = {
  hidden: { scale: 1, y: 0, z: 0 },
  visible: { 
    scale: 1.12, 
    y: -24, 
    z: 30,
    transition: { type: "spring", stiffness: 40, damping: 12, delay: 0.3 }
  }
} as const;

const aboutCardVariants = {
  hidden: { opacity: 0, x: 80, scale: 0.9 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 40, damping: 12 }
  }
} as const;

const aboutImageVariants = {
  hidden: { scale: 1, y: 0 },
  visible: { 
    scale: 1.10, 
    y: -16,
    transition: { type: "spring", stiffness: 40, damping: 12, delay: 0.25 }
  }
} as const;

const successCardVariants = {
  hidden: { opacity: 0, x: -80, rotate: -3, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0, 
    rotate: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 40, damping: 12 }
  }
} as const;

const successImageVariants = {
  hidden: { scale: 1, y: 0 },
  visible: { 
    scale: 1.10, 
    y: -16,
    transition: { type: "spring", stiffness: 40, damping: 12, delay: 0.25 }
  }
} as const;

function TiltCard({ children, className, style, ...props }: { children: React.ReactNode; className?: string; style?: any; [key: string]: any }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, (latestY) => {
    return -latestY * 0.05; // tilt responsiveness
  });
  const rotateY = useTransform(x, (latestX) => {
    return latestX * 0.05;
  });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const theme = useAppStore((state) => state.theme);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeSetsUsApart, setActiveSetsUsApart] = useState(1); // Default to Strength Build
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'annually'>('monthly');

  // Scroll-linked Background Image transitions
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to background opacities (subtle: max 0.22 opacity)
  const bgOpacity1 = useTransform(scrollYProgress, [0, 0.20, 0.30], [0.22, 0.22, 0]);
  const bgOpacity2 = useTransform(scrollYProgress, [0.20, 0.30, 0.45, 0.55], [0, 0.22, 0.22, 0]);
  const bgOpacity3 = useTransform(scrollYProgress, [0.45, 0.55, 0.70, 0.80], [0, 0.22, 0.22, 0]);
  const bgOpacity4 = useTransform(scrollYProgress, [0.70, 0.80, 1.00], [0, 0.22, 0.22]);

  // Subtle vertical parallax shifts for the background images
  const bgY1 = useTransform(scrollYProgress, [0, 1], ["0px", "-120px"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["60px", "-60px"]);
  const bgY3 = useTransform(scrollYProgress, [0, 1], ["120px", "0px"]);
  const bgY4 = useTransform(scrollYProgress, [0, 1], ["180px", "60px"]);

  // 3D Parallax State for Hero Model
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // Max 12 degrees of tilt to keep it subtle and elegant
    const rX = -(y / box.height) * 12;
    const rY = (x / box.width) * 12;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleHeroMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Dashboard Launch Sequence
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
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setLaunchProgress(100);
        setLaunchStep("Calibration complete. Launching...");
        setTimeout(() => {
          router.push(targetPath);
          setIsLaunching(false);
        }, 400);
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

  // Brand logos for continuous marquee
  const brandLogos = [
    { name: "UNDER ARMOUR", symbol: "⚡" },
    { name: "GATORADE", symbol: "🗲" },
    { name: "ADIDAS", symbol: "❖" },
    { name: "PUMA", symbol: "🐆" },
    { name: "THE NORTH FACE", symbol: "▲" },
    { name: "NIKE", symbol: "✓" }
  ];

  // What Sets Us Apart Cards
  const setsUsApartCards = [
    {
      id: 0,
      title: "Cardio Training",
      subtitle: "Heart Rate Target Zones",
      description: "Increase vascular efficiency and optimize cardiac output through scientific VO2 Max interval tracking.",
      icon: <Activity className="w-6 h-6 text-brand-lime" />
    },
    {
      id: 1,
      title: "Strength Build",
      subtitle: "Hypertrophy Programming",
      description: "Focus on mechanical tension, progressive overload, and high-intensity workout sets to stimulate myofibrillar growth.",
      icon: <Zap className="w-6 h-6 text-black dark:text-black" /> // Invert color for active card
    },
    {
      id: 2,
      title: "Fat Loss",
      subtitle: "Caloric Deficit Maximizer",
      description: "Calculate optimal metabolic rate indices and construct meal programs for sustained lipolysis without muscle loss.",
      icon: <Flame className="w-6 h-6 text-brand-lime" />
    },
    {
      id: 3,
      title: "HIIT Workouts",
      subtitle: "EPOC Energy Afterburn",
      description: "Trigger excess post-exercise oxygen consumption using tactical work-to-rest structural pacing protocols.",
      icon: <Award className="w-6 h-6 text-brand-lime" />
    }
  ];

  // Exercise Grid Cards (Section: Train Smarter)
  const exercises = [
    {
      title: "Barbells Strength",
      category: "POWER",
      img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Kettlebell Masterclass",
      category: "STRENGTH",
      img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Cardio Power Rush",
      category: "ENDURANCE",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Hypertrophy",
      category: "GROWTH",
      img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Rope Climbing",
      category: "FUNCTIONAL",
      img: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "TRX Suspension",
      category: "CORE",
      img: "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?auto=format&fit=crop&w=500&q=80"
    }
  ];

  // Trainers Profiles
  const trainers = [
    {
      name: "Ethan Hunter",
      role: "Master Strength Coach",
      description: "Former bodybuilding champion focusing on progressive biomechanical overload and power metrics.",
      img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Sarah Jenkins",
      role: "Metabolic Nutritionist",
      description: "Specializing in athletic calorie calibration, macronutrient breakdowns, and sustainable health strategies.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Logan Mercer",
      role: "Functional Mobility Expert",
      description: "Expert in active recovery schemes, yoga protocols, joint longevity, and dynamic core stabilization.",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
    }
  ];

  // Testimonials Carousel
  const testimonials = [
    {
      quote: "AURA 3D completely revolutionized my physique. The structural guidance is unmatched. The workouts and nutritional pacing helped me drop body fat from 18% to 9% in just 12 weeks.",
      author: "Marcus Vance",
      role: "Competitive Athlete & Architect",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    },
    {
      quote: "The interface is extremely premium. The micro-animations and clean grids feel amazing to interact with. It's like a high-performance workspace but engineered for physical evolution.",
      author: "Elena Rostova",
      role: "Software Developer",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
    },
    {
      quote: "I was skeptical about automated tracking systems, but the biometric indicators, trainer charts, and continuous feedback loop kept me completely dialed in. Highly recommended.",
      author: "David Chen",
      role: "Crossfit Practitioner",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-brand-lime selection:text-black font-sans">
      
      {/* Interactive 3D Cursor Spotlight & Telemetry Background Grid */}
      <InteractiveBackground />

      {/* Scroll-Responsive Bodybuilder Background Image Transitions */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Layer 1: Front flexing pose (Hero Section - Centered) */}
        <motion.div 
          style={{ opacity: bgOpacity1, y: bgY1 }}
          className="absolute inset-0 w-full h-full flex items-center justify-center grayscale contrast-[1.4] brightness-[0.95] saturate-0 mix-blend-screen"
        >
          <img src="/bodybuilder_hero_new.png" alt="bodybuilder pose 1" className="w-full h-[85vh] object-contain" />
        </motion.div>
        
        {/* Layer 2: Front double-bicep flex (Problems/About Section - Left Aligned) */}
        <motion.div 
          style={{ opacity: bgOpacity2, y: bgY2 }}
          className="absolute inset-y-0 left-0 w-full lg:w-1/2 h-full flex items-center justify-center grayscale contrast-[1.4] brightness-[0.95] saturate-0 mix-blend-screen"
        >
          <img src="/bodybuilder_flexing_new.png" alt="bodybuilder pose 2" className="w-full h-[85vh] object-contain" />
        </motion.div>
        
        {/* Layer 3: Back double-bicep flex (Showcase/Services Section - Centered) */}
        <motion.div 
          style={{ opacity: bgOpacity3, y: bgY3 }}
          className="absolute inset-0 w-full h-full flex items-center justify-center grayscale contrast-[1.4] brightness-[0.95] saturate-0 mix-blend-screen"
        >
          <img src="/bodybuilder_back_pose_new.png" alt="bodybuilder pose 3" className="w-full h-[85vh] object-contain" />
        </motion.div>

        {/* Layer 4: Side chest flex (Coaching/Testimonials Section - Right Aligned) */}
        <motion.div 
          style={{ opacity: bgOpacity4, y: bgY4 }}
          className="absolute inset-y-0 right-0 w-full lg:w-1/2 h-full flex items-center justify-center grayscale contrast-[1.4] brightness-[0.95] saturate-0 mix-blend-screen"
        >
          <img src="/bodybuilder_side_flex_new.png" alt="bodybuilder pose 4" className="w-full h-[85vh] object-contain" />
        </motion.div>

        {/* Ambient bottom fade overlay to keep background unified */}
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>
      
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.012)_1.2px,transparent_1.2px),linear-gradient(90deg,rgba(204,255,0,0.012)_1.2px,transparent_1.2px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Decorative ambient glowing radial circles */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-lime/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-lime/5 rounded-full blur-[150px] pointer-events-none opacity-40" />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-brand-lime/5 rounded-full blur-[120px] pointer-events-none opacity-50" />

      {/* HEADER / NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => launchSequence('/dashboard')}>
            <div className="w-9 h-9 rounded-lg bg-brand-lime flex items-center justify-center shadow-lg shadow-brand-lime/25">
              <Dumbbell className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <span className="font-black tracking-tighter text-2xl font-sans uppercase">
              AURA <span className="text-brand-lime">3D</span>
            </span>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <a href="#" className="text-brand-lime hover:text-white transition-colors duration-200">Home</a>
            <a href="#about" className="hover:text-white transition-colors duration-200">About</a>
            <a href="#services" className="hover:text-white transition-colors duration-200">Services</a>
            <a href="#trainers" className="hover:text-white transition-colors duration-200">Trainers</a>
            <a href="#testimonials" className="hover:text-white transition-colors duration-200">Testimonials</a>
          </nav>

          {/* Call to Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => launchSequence('/dashboard')}
              className="hidden sm:inline-block px-5 py-2.5 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors duration-200"
            >
              BE A MEMBER
            </button>
            <motion.button 
              onClick={() => launchSequence('/dashboard')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-brand-lime text-black font-extrabold text-xs px-6 py-3 rounded-lg shadow-lg shadow-brand-lime/20 cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
            >
              Join Now <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen pt-36 pb-20 flex flex-col items-center justify-center px-6">
        
        {/* Left Side Vertical Rotated Text */}
        <div className="hidden xl:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col gap-12 font-black text-xs uppercase tracking-[0.6em] text-zinc-700 select-none">
          <span className="vertical-rl">D</span>
          <span className="vertical-rl">R</span>
          <span className="vertical-rl">E</span>
          <span className="vertical-rl">A</span>
          <span className="vertical-rl">M</span>
        </div>

        {/* Right Side Vertical Rotated Text */}
        <div className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-12 font-black text-xs uppercase tracking-[0.6em] text-zinc-700 select-none">
          <span className="vertical-rl">M</span>
          <span className="vertical-rl">E</span>
          <span className="vertical-rl">E</span>
          <span className="vertical-rl">T</span>
        </div>

        <div className="max-w-6xl w-full text-center flex flex-col items-center">
          
          {/* Main Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4 max-w-4xl"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              Sculpt <span className="text-outline-white">Your Body</span>, <br />
              <span className="text-brand-lime text-outline-lime font-black">Elevate Your Spirit</span>
            </h1>
          </motion.div>

          {/* Center Fitness Model & Floating Badges Container */}
          <div className="relative mt-20 md:mt-28 w-full max-w-2xl flex justify-center items-center">
            
            {/* Ambient Backlight Glow behind Model */}
            <div className="absolute inset-0 bg-brand-lime/20 rounded-full blur-[80px] pointer-events-none scale-75 -z-10" />

            {/* Main Athlete Model Image (3D Pop-Out Card) */}
            <motion.div
              variants={heroCardVariants}
              initial="hidden"
              animate="visible"
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transformStyle: "preserve-3d",
                transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="group relative w-80 sm:w-96 md:w-[420px] aspect-[4/5] bg-zinc-950 border border-white/10 rounded-3xl overflow-visible shadow-2xl transition-all duration-300 hover:border-brand-lime/30 hover:shadow-brand-lime/5 cursor-pointer"
            >
              {/* Vignette Background layer inside container */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden bg-black z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.08)_0%,transparent_70%)]" />
              </div>

              {/* 3D Pop-Out Bodybuilder Image */}
              <motion.img 
                src="/bodybuilder_flexing.png"
                alt="Muscular Bodybuilder Athlete"
                variants={heroImageVariants}
                className="absolute inset-0 w-full h-full object-cover rounded-3xl grayscale contrast-[1.3] brightness-95 saturate-0 origin-bottom z-10 mix-blend-screen"
                style={{
                  transformStyle: "preserve-3d"
                }}
              />

              {/* Bottom vignette gradient blending model into dark background */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-20 rounded-b-3xl pointer-events-none" />
            </motion.div>

            {/* FLOATING BADGE 1: Top-Left (FITNESS 1.5M) */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute top-12 left-0 sm:-left-10 z-20 pointer-events-none"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-xl pointer-events-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center border border-brand-lime/20">
                  <HeartPulse className="w-5 h-5 text-brand-lime" />
                </div>
                <div className="text-left font-mono">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">FITNESS</p>
                  <p className="text-sm font-black text-white">1.5M+</p>
                </div>
              </motion.div>
            </motion.div>

            {/* FLOATING BADGE 2: Top-Right (WORKOUTS 70+) */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-16 right-0 sm:-right-10 z-20 pointer-events-none"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.2 }}
                className="bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-xl pointer-events-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center border border-brand-lime/20">
                  <Zap className="w-5 h-5 text-brand-lime" />
                </div>
                <div className="text-left font-mono">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">WORKOUTS</p>
                  <p className="text-sm font-black text-white">70+</p>
                </div>
              </motion.div>
            </motion.div>

            {/* FLOATING BADGE 3: Bottom-Left (RATING 4.8) */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute bottom-28 left-0 sm:-left-6 z-20 pointer-events-none"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.4 }}
                className="bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-xl pointer-events-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center border border-brand-lime/20">
                  <Star className="w-5 h-5 text-brand-lime fill-brand-lime" />
                </div>
                <div className="text-left font-mono">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">RATING</p>
                  <p className="text-sm font-black text-white">4.8</p>
                </div>
              </motion.div>
            </motion.div>

            {/* FLOATING BADGE 4: Bottom-Right (COACH 120+) */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-20 right-0 sm:-right-6 z-20 pointer-events-none"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.6 }}
                className="bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-xl pointer-events-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center border border-brand-lime/20">
                  <UserCheck className="w-5 h-5 text-brand-lime" />
                </div>
                <div className="text-left font-mono">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">COACHES</p>
                  <p className="text-sm font-black text-white">120+</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Stacked Profiles & Callout (Bottom-Left Under Image) */}
            <div className="absolute -bottom-8 left-4 flex items-center gap-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="avatar" />
              </div>
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 font-mono uppercase">12k+ Happy Members</span>
            </div>

            {/* Quick Action Button (Bottom-Right Under Image) */}
            <div className="absolute -bottom-10 right-4">
              <motion.button 
                onClick={() => launchSequence('/dashboard')}
                whileHover={{ scale: 1.05 }}
                className="bg-brand-lime text-black font-black text-xs px-5 py-3 rounded-lg shadow-lg shadow-brand-lime/20 flex items-center gap-2 uppercase tracking-widest"
              >
                Join Now <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

          </div>

        </div>
      </section>

      {/* BRANDS ROW - INFINITE SLIDER */}
      <section className="relative z-10 py-12 border-y border-white/5 bg-zinc-950 overflow-hidden">
        <div className="flex gap-16 relative w-full overflow-hidden whitespace-nowrap">
          <div className="flex gap-16 animate-infinite-scroll min-w-full justify-around">
            {brandLogos.map((brand, idx) => (
              <div key={idx} className="flex items-center gap-3 text-zinc-500 font-black text-sm tracking-widest">
                <span className="text-brand-lime">{brand.symbol}</span>
                <span>{brand.name}</span>
              </div>
            ))}
          </div>
          {/* Duplicate loop for seamless scroll */}
          <div className="flex gap-16 animate-infinite-scroll min-w-full justify-around" aria-hidden="true">
            {brandLogos.map((brand, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-3 text-zinc-500 font-black text-sm tracking-widest">
                <span className="text-brand-lime">{brand.symbol}</span>
                <span>{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMS SECTION - FRUSTRATIONS WITH GENERIC FITNESS */}
      <section className="py-24 border-b border-white/5 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-16">
          <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">The Fitness Obstacle</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Frustrated With <span className="text-brand-lime text-outline-lime">Generic Training?</span>
          </h2>
          <p className="text-zinc-550 text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold">
            Traditional approaches are inefficient, outdated, and lack real-time physiological analytics.
          </p>
        </div>
        <ProblemGrid />
      </section>

      {/* ABOUT / FEATURE LIST SECTION ("Inspired to Inspire Your Best Self") */}
      <section id="about" className="relative z-10 py-28 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left features column */}
        <motion.div 
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ type: "spring", stiffness: 45, damping: 12 }}
          className="lg:col-span-6 space-y-8 text-left"
        >
          <div className="space-y-3">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">Inspired to</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95]">
              Inspire Your <br />
              <span className="text-brand-lime text-outline-lime">Best Self</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm max-w-lg leading-relaxed font-medium">
            AURA 3D merges state-of-the-art training architectures with active biometrics monitoring. We eliminate all guesswork so you reach high-performance outcomes fast.
          </p>

          {/* Grid of features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {[
              "Custom Guidance",
              "Expert Trainers",
              "Progress Tracking",
              "Flexible Scheduling",
              "Community Support",
              "Nutritional Advice"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-brand-lime/10 flex items-center justify-center border border-brand-lime/20 shrink-0">
                  <Check className="w-3.5 h-3.5 text-brand-lime stroke-[3]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-200">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right image column (3D Pop-Out Side Flex Bodybuilder) */}
        <motion.div 
          variants={aboutCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="lg:col-span-6 relative flex justify-center"
        >
          <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-visible border border-white/5 bg-zinc-950 shadow-2xl group cursor-pointer">
            {/* Vignette background layer */}
            <div className="absolute inset-0 bg-black rounded-2xl overflow-hidden z-0" />
            
            <motion.img 
              src="/bodybuilder_side_flex.png"
              alt="Monochrome Athlete Training"
              variants={aboutImageVariants}
              className="absolute inset-0 w-full h-full object-cover rounded-2xl grayscale contrast-[1.3] brightness-95 saturate-0 origin-bottom z-10 mix-blend-screen"
            />
            {/* Overlay border */}
            <div className="absolute inset-0 border border-brand-lime/10 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          {/* Subtle accent corner element */}
          <div className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 border-brand-lime rounded-tr-xl pointer-events-none" />
          <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-brand-lime rounded-bl-xl pointer-events-none" />
        </motion.div>
      </section>

      {/* FEATURE PORTFOLIO - HORIZONTAL SCROLL SHOWCASE */}
      <section className="relative z-10 py-24 border-y border-white/5 bg-zinc-950/20">
        <HorizontalScrollShowcase />
      </section>

      {/* DISCOVER WHAT SETS US APART */}
      <section id="services" className="relative z-10 py-24 border-t border-white/5 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">Discover</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              What Sets <span className="text-brand-lime text-outline-lime">Us Apart</span>
            </h2>
            <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold">
              Custom conditioning programs structured for dynamic physical evolution.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {setsUsApartCards.map((card) => {
              const isActive = activeSetsUsApart === card.id;
              return (
                <TiltCard
                  key={card.id}
                  onClick={() => setActiveSetsUsApart(card.id)}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: card.id * 0.08, ease: "easeOut" }}
                  whileHover={{ scale: 1.02 }}
                  className={`cursor-pointer rounded-2xl p-8 flex flex-col justify-between min-h-[280px] border transition-all duration-300 ${
                    isActive 
                      ? "bg-brand-lime text-black border-brand-lime shadow-xl shadow-brand-lime/10" 
                      : "bg-zinc-950/80 text-white border-white/5 hover:border-brand-lime/20"
                  }`}
                >
                  <div className="space-y-4" style={{ transformStyle: "preserve-3d" }}>
                    <div 
                      style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isActive ? "bg-black/10" : "bg-brand-lime/10"
                      }`}
                    >
                      {card.icon}
                    </div>
                    <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
                      <h3 className="text-lg font-black uppercase tracking-wide">{card.title}</h3>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${
                        isActive ? "text-black/60" : "text-brand-lime"
                      }`}>{card.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4" style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }}>
                    <p className={`text-xs leading-relaxed ${
                      isActive ? "text-black/80" : "text-zinc-400"
                    }`}>{card.description}</p>
                    
                    <button className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                      isActive ? "text-black" : "text-brand-lime"
                    }`}>
                      Join us <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </TiltCard>
              );
            })}
          </div>

          {/* Page Indicators */}
          <div className="flex justify-center items-center gap-2 mt-10">
            {setsUsApartCards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSetsUsApart(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSetsUsApart === i ? "w-8 bg-brand-lime" : "w-1.5 bg-zinc-700"
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* BIOMECHANICAL MOTION LAB SECTION */}
      <section className="relative z-10 py-24 border-t border-white/5 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">WebGL Biometrics</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
              Biomechanical <span className="text-brand-lime text-outline-lime">Motion Lab</span>
            </h2>
            <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold">
              Real-time kinetic simulation of joint torque, muscle load, and range of motion.
            </p>
          </div>
          <BiomechanicalMotionLab />
        </div>
      </section>

      {/* EXERCISE GRID: "Train Smarter Unleash Your Potential" */}
      <section className="relative z-10 py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-20">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">Train Smarter</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Unleash Your <span className="text-brand-lime text-outline-lime">Potential</span>
            </h2>
            <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold">
              Engineered routines designed to shock muscle fibers and accelerate calorie burn.
            </p>
          </div>

          {/* 6-Card Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exercises.map((ex, idx) => (
              <TiltCard
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.08, ease: "easeOut" }}
                whileHover={{ scale: 1.03 }}
                className="group relative rounded-2xl overflow-hidden bg-zinc-950 border border-white/5 aspect-[4/3] flex flex-col justify-end p-6 cursor-pointer"
              >
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={ex.img} 
                    alt={ex.title} 
                    className="w-full h-full object-cover grayscale contrast-125 brightness-[0.7] group-hover:scale-105 group-hover:brightness-[0.85] transition-all duration-500 saturate-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>

                {/* Corner Diagonal Neon Cut-out Badge */}
                <div 
                  style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}
                  className="absolute top-0 right-0 z-10 bg-brand-lime text-black text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-bl-xl"
                >
                  {ex.category}
                </div>

                {/* Text Content */}
                <div 
                  style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
                  className="relative z-10 text-left space-y-1"
                >
                  <h4 className="text-lg font-black uppercase tracking-wide group-hover:text-brand-lime transition-colors">{ex.title}</h4>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block font-mono">AURA 3D Syllabus</span>
                </div>

                {/* Corner outline highlight on hover */}
                <div className="absolute inset-0 border border-transparent group-hover:border-brand-lime/25 rounded-2xl pointer-events-none transition-all duration-300" />
              </TiltCard>
            ))}
          </div>

        </div>
      </section>

      {/* DASHBOARDS: Experience Fitness Like Never Before */}
      <section className="relative z-10 py-24 border-t border-white/5 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-20">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">Experience</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Fitness Like <span className="text-brand-lime text-outline-lime">Never Before</span>
            </h2>
            <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold">
              Immersive virtual monitoring interfaces keeping you completely aligned with goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Card 1: Endurance Revolution */}
            <TiltCard 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ type: "spring", stiffness: 45, damping: 12 }}
              whileHover={{ scale: 1.02 }}
              className="bg-zinc-950 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden"
            >
              <div className="flex-1 space-y-6 text-left" style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }}>
                <div>
                  <span className="text-brand-lime font-mono text-[10px] font-bold uppercase tracking-widest">Endurance Focus</span>
                  <h3 className="text-2xl font-black uppercase tracking-wide mt-1 text-white">Endurance Revolution</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Boost your cellular mitochondrial threshold and overall aerobic resilience index using pacing telemetry.
                </p>
                <button 
                  onClick={() => launchSequence('/dashboard')}
                  className="bg-brand-lime text-black font-extrabold text-[10px] px-5 py-2.5 rounded-lg flex items-center gap-1.5 uppercase tracking-wider"
                >
                  Try now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Graphic container */}
              <div className="flex-1 w-full relative flex justify-center items-center" style={{ transformStyle: "preserve-3d" }}>
                <div 
                  style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
                  className="w-56 aspect-square rounded-2xl overflow-hidden border border-white/10 grayscale saturate-0"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80" 
                    alt="Endurance training" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Heart Rate Metric */}
                <div 
                  style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }}
                  className="absolute -bottom-4 right-2 bg-zinc-900 border border-white/10 rounded-xl p-3 flex items-center gap-2 shadow-2xl font-mono text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold block">Heart Rate</span>
                    <span className="text-xs font-black text-white">138 bpm</span>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Card 2: Smart Pace */}
            <TiltCard 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ type: "spring", stiffness: 45, damping: 12 }}
              whileHover={{ scale: 1.02 }}
              className="bg-zinc-950 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden"
            >
              <div className="flex-1 space-y-6 text-left" style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }}>
                <div>
                  <span className="text-brand-lime font-mono text-[10px] font-bold uppercase tracking-widest">Macro Telemetry</span>
                  <h3 className="text-2xl font-black uppercase tracking-wide mt-1 text-white">Smart Pace</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Track energetic intake indices in real-time, syncing custom training loads with optimal protein synthesizers.
                </p>
                <button 
                  onClick={() => launchSequence('/dashboard')}
                  className="bg-brand-lime text-black font-extrabold text-[10px] px-5 py-2.5 rounded-lg flex items-center gap-1.5 uppercase tracking-wider"
                >
                  Try now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Graphic container */}
              <div className="flex-1 w-full relative flex justify-center items-center" style={{ transformStyle: "preserve-3d" }}>
                <div 
                  style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
                  className="w-56 aspect-square rounded-2xl overflow-hidden border border-white/10 grayscale saturate-0"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80" 
                    alt="Smart pacing" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Ring / Dial Metric */}
                <div 
                  style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }}
                  className="absolute -bottom-4 left-2 bg-zinc-900 border border-white/10 rounded-xl p-3 flex items-center gap-2 shadow-2xl font-mono text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-lime/10 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-brand-lime" />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold block">Burn Rate</span>
                    <span className="text-xs font-black text-white">412 kcal</span>
                  </div>
                </div>
              </div>
            </TiltCard>

          </div>

        </div>
      </section>

      {/* NEURAL AI COACHING CONSOLE SECTION */}
      <section className="py-24 border-t border-white/5 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-16">
          <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">Neural Biometrics</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Aura AI <span className="text-brand-lime text-outline-lime">Coach Console</span>
          </h2>
          <p className="text-zinc-550 text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold">
            Simulate a real-time metabolic and conditioning telemetry consult directly in your browser.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <CoachDemoWidget />
        </div>
      </section>

      {/* TRAINERS: Your Fitness Goals, Their Expertise */}
      <section id="trainers" className="relative z-10 py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-24">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase font-semibold">Your Fitness</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Goals, <span className="text-brand-lime text-outline-lime">Their Expertise</span>
            </h2>
            <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold">
              Our professional training cohort is dedicated to your complete body restructuring.
            </p>
          </div>

          {/* 3 Trainers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {trainers.map((tr, idx) => (
              <TiltCard
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden text-left flex flex-col justify-between p-6 relative group"
              >
                
                {/* Glowing radial background inside card on hover */}
                <div className="absolute -inset-1 bg-gradient-to-t from-brand-lime/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-6">
                  {/* Monochrome Portrait */}
                  <div 
                    style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
                    className="w-full aspect-[4/5] rounded-xl overflow-hidden relative border border-white/5 grayscale saturate-0"
                  >
                    <img 
                      src={tr.img} 
                      alt={tr.name} 
                      className="w-full h-full object-cover object-top contrast-125"
                    />
                    {/* Dark gradient mapping overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="space-y-1 relative z-10" style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}>
                    <h3 className="text-xl font-black uppercase tracking-wide text-white group-hover:text-brand-lime transition-colors">{tr.name}</h3>
                    <p className="text-[10px] font-black text-brand-lime uppercase tracking-widest font-mono">{tr.role}</p>
                  </div>
                </div>

                <div 
                  style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }}
                  className="mt-4 pt-4 border-t border-white/5 text-xs text-zinc-400 leading-relaxed font-medium relative z-10"
                >
                  {tr.description}
                </div>

              </TiltCard>
            ))}
          </div>

          {/* Slashes indicator below */}
          <div className="flex justify-center items-center gap-1 mt-12 text-zinc-700 font-bold select-none">
            <span className="text-brand-lime text-sm">/</span>
            <span className="text-brand-lime text-sm">/</span>
            <span className="text-zinc-650 text-sm">/</span>
          </div>

        </div>
      </section>

      {/* SUCCESS STORIES: Testimonial Carousel */}
      <section id="testimonials" className="relative z-10 py-24 border-t border-white/5 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-20">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">Your Success</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Stories, <span className="text-brand-lime text-outline-lime">Our Inspiration</span>
            </h2>
            <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold">
              Check out how our members completed transitions and optimized their metabolics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Transformation Picture (3D Pop-Out Back Flex Bodybuilder) */}
            <motion.div 
              variants={successCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-visible border border-white/5 bg-zinc-950 shadow-2xl group cursor-pointer">
                {/* Vignette background */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden bg-black z-0" />
                
                <motion.img 
                  src="/bodybuilder_back_pose.png" 
                  alt="Athlete flex" 
                  variants={successImageVariants}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl grayscale contrast-[1.3] brightness-95 saturate-0 origin-bottom z-10 mix-blend-screen"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent z-20 rounded-b-2xl pointer-events-none" />
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 border-brand-lime rounded-tr-xl pointer-events-none z-20" />
              <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-brand-lime rounded-bl-xl pointer-events-none z-20" />
            </motion.div>

            {/* Right Testimonial slider */}
            <motion.div 
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ type: "spring", stiffness: 45, damping: 12 }}
              className="lg:col-span-7 flex flex-col justify-between min-h-[300px] text-left space-y-8"
            >
              
              <div className="min-h-[160px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <p className="text-xl md:text-2xl font-bold leading-relaxed text-zinc-200 italic font-sans">
                      "{testimonials[activeTestimonial].quote}"
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <img 
                        src={testimonials[activeTestimonial].img} 
                        alt={testimonials[activeTestimonial].author} 
                        className="w-11 h-11 rounded-full border border-white/10 object-cover grayscale"
                      />
                      <div>
                        <h5 className="font-extrabold text-white text-sm uppercase tracking-wider">{testimonials[activeTestimonial].author}</h5>
                        <p className="text-[10px] text-brand-lime font-bold uppercase tracking-widest font-mono">{testimonials[activeTestimonial].role}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Controller buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                {/* Dots */}
                <div className="flex gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeTestimonial === idx ? "w-8 bg-brand-lime" : "w-1.5 bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center hover:bg-zinc-900 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-zinc-400 hover:text-white" />
                  </button>
                  <button 
                    onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                    className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center hover:bg-zinc-900 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-zinc-400 hover:text-white" />
                  </button>
                </div>
              </div>

            </motion.div>

          </div>

        </div>
      </section>

      {/* PRICING SECTION: Unlock Premium Telemetry */}
      <PricingSection onSelectPlan={() => launchSequence('/dashboard')} />

      {/* CTA SECTION: Connect Engage Transform */}
      <section className="relative z-10 py-24 max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-brand-lime rounded-[32px] p-8 sm:p-12 md:p-16 text-center space-y-6 relative overflow-hidden flex flex-col items-center justify-center"
        >
          {/* Subtle design pattern background on CTA banner */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1.5px,transparent_1.5px)] bg-[size:16px_16px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none relative z-10">
            Connect Engage Transform
          </h2>
          <p className="text-black/80 font-bold uppercase tracking-wider text-xs max-w-md mx-auto leading-relaxed relative z-10">
            Subscribe to our biometrics newsletter for structural body transformation indices.
          </p>

          {/* Form container */}
          <div className="w-full max-w-md bg-black rounded-2xl p-2 flex flex-col gap-2 md:flex-row md:items-center md:gap-0 md:p-1.5 border border-white/5 relative z-10 mt-4">
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="w-full md:flex-1 bg-transparent px-4 py-3 md:py-0 text-xs font-bold uppercase tracking-wider text-white placeholder-zinc-550 border border-white/10 md:border-none rounded-xl md:rounded-none outline-hidden focus:ring-0 text-center md:text-left"
            />
            <button 
              onClick={() => launchSequence('/dashboard')}
              className="w-full md:w-auto bg-brand-lime text-black font-black text-xs px-6 py-3.5 md:py-3 rounded-xl hover:bg-white transition-colors duration-200 uppercase tracking-widest shrink-0 cursor-pointer"
            >
              Join Now
            </button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 bg-zinc-950 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 text-left">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => launchSequence('/dashboard')}>
              <div className="w-9 h-9 rounded-lg bg-brand-lime flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <span className="font-black tracking-tighter text-2xl uppercase text-white">
                AURA <span className="text-brand-lime">3D</span>
              </span>
            </div>
            
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs font-semibold uppercase tracking-wider">
              Next-generation spatial logs and athletic condition tracking models, engineered for dynamic body adjustments.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter/X" className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            <p className="text-[10px] text-zinc-600 font-bold font-mono">© 2026 AURA 3D Inc. All rights reserved.</p>
          </div>

          {/* Quick links col 1 */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-xs font-black uppercase tracking-widest text-zinc-300 font-mono">Platform Options</h5>
            <ul className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 space-y-3.5">
              <li><Link href="/dashboard/workout" className="hover:text-white transition-colors">Workout Builder</Link></li>
              <li><Link href="/dashboard/nutrition" className="hover:text-white transition-colors">Macro Planner</Link></li>
              <li><Link href="/dashboard/bmi" className="hover:text-white transition-colors">Biometric Logs</Link></li>
              <li><Link href="/dashboard/coach" className="hover:text-white transition-colors">AI Coach Console</Link></li>
            </ul>
          </div>

          {/* Quick links col 2 */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-xs font-black uppercase tracking-widest text-zinc-300 font-mono">Explore</h5>
            <ul className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 space-y-3.5">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Our Services</a></li>
              <li><a href="#trainers" className="hover:text-white transition-colors">Expert Cohort</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support Portal</a></li>
            </ul>
          </div>

          {/* Contact details */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-xs font-black uppercase tracking-widest text-zinc-300 font-mono">Get in Touch</h5>
            <ul className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 space-y-3.5">
              <li className="text-zinc-400">INFO@AURA3D.COM</li>
              <li className="text-zinc-450">1-800-AURA-3D</li>
              <li className="text-zinc-500">SAN FRANCISCO, CA</li>
            </ul>
          </div>

        </div>
      </footer>

      {/* DASHBOARD LAUNCH SEQUENCE OVERLAY */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl text-center px-6"
          >
            {/* Spinning Holographic Dial */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-8">
              {/* Outer ring */}
              <motion.svg 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-full h-full absolute"
              >
                <circle cx="64" cy="64" r="54" stroke="rgba(204,255,0,0.1)" strokeWidth="2.5" fill="transparent" />
                <circle cx="64" cy="64" r="54" stroke="#ccff00" strokeWidth="2.5" fill="transparent" strokeDasharray="339" strokeDashoffset="240" strokeLinecap="round" />
              </motion.svg>
              {/* Mid ring */}
              <motion.svg 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-24 h-24 absolute"
              >
                <circle cx="48" cy="48" r="38" stroke="rgba(204,255,0,0.05)" strokeWidth="2" fill="transparent" />
                <circle cx="48" cy="48" r="38" stroke="#ccff00" strokeWidth="2" fill="transparent" strokeDasharray="238" strokeDashoffset="150" strokeLinecap="round" />
              </motion.svg>
              {/* Inner core */}
              <motion.div 
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-10 h-10 rounded-full bg-brand-lime/20 border border-brand-lime/40 flex items-center justify-center shadow-lg shadow-brand-lime/10"
              >
                <Dumbbell className="w-5 h-5 text-brand-lime" />
              </motion.div>
            </div>

            {/* Glowing Telemetry Labels */}
            <div className="space-y-3 mb-6">
              <motion.span 
                key={launchStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-mono font-bold uppercase tracking-widest block text-brand-lime"
              >
                {launchStep}
              </motion.span>
              <h3 className="text-xl font-bold tracking-tight text-white uppercase">System Calibration In Progress</h3>
            </div>

            {/* Progress bar container */}
            <div className="space-y-2">
              <div className="w-64 h-1.5 bg-zinc-900 border border-white/5 rounded-full overflow-hidden relative">
                <motion.div 
                  className="h-full bg-brand-lime"
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

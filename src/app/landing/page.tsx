'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useScroll } from 'framer-motion';

const MotionImage = motion.create(Image);
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
  HeartPulse,
  Fingerprint,
  Cpu
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import ProblemGrid from '@/components/landing/problem-grid';
import dynamic from 'next/dynamic';

const FitnessHero3D = dynamic(() => import('@/components/landing/fitness-hero-3d'), { ssr: false });
const HorizontalScrollShowcase = dynamic(() => import('@/components/landing/horizontal-scroll'), { ssr: false });
const CoachDemoWidget = dynamic(() => import('@/components/landing/coach-demo'), { ssr: false });
const BiomechanicalMotionLab = dynamic(() => import('@/components/landing/biomechanical-motion-lab'), { ssr: false });
const PricingSection = dynamic(() => import('@/components/landing/pricing'), { ssr: false });


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
  const theme = 'dark';
  const storeTheme = useAppStore((state) => state.theme);

  useEffect(() => {
    // Force dark mode on root document element (html) when landing page is mounted
    // This keeps the landing page neon-lime even if dashboard is set to light theme
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');

    return () => {
      // Restore actual store theme when leaving landing page
      root.classList.remove('light', 'dark');
      root.classList.add(storeTheme);
    };
  }, [storeTheme]);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeSetsUsApart, setActiveSetsUsApart] = useState(1); // Default to Strength Build
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'annually'>('monthly');

  // Navbar States & scroll tracking
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [activeLink, setActiveLink] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleScroll();
    handleResize();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  // Scroll-linked Background Image transitions
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to background opacities (subtle: max 0.22 opacity)
  const bgOpacity1 = useTransform(scrollYProgress, [0, 0.20, 0.30], [0.12, 0.12, 0]);
  const bgOpacity2 = useTransform(scrollYProgress, [0.20, 0.30, 0.45, 0.55], [0, 0.22, 0.22, 0]);
  const bgOpacity3 = useTransform(scrollYProgress, [0.45, 0.55, 0.70, 0.80], [0, 0.22, 0.22, 0]);
  const bgOpacity4 = useTransform(scrollYProgress, [0.70, 0.80, 1.00], [0, 0.22, 0.22]);

  // Subtle vertical parallax shifts for the background images
  const bgY1 = useTransform(scrollYProgress, [0, 1], ["0px", "-120px"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["60px", "-60px"]);
  const bgY3 = useTransform(scrollYProgress, [0, 1], ["120px", "0px"]);
  const bgY4 = useTransform(scrollYProgress, [0, 1], ["180px", "60px"]);

  // Scroll-linked background 3D canvas opacity (fades out as you scroll past hero)
  const bgCanvasOpacity = useTransform(
    scrollYProgress,
    [0, 0.12],
    [theme === 'dark' ? 0.85 : 0.65, 0]
  );

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
      icon: Activity
    },
    {
      id: 1,
      title: "Strength Build",
      subtitle: "Hypertrophy Programming",
      description: "Focus on mechanical tension, progressive overload, and high-intensity workout sets to stimulate myofibrillar growth.",
      icon: Zap
    },
    {
      id: 2,
      title: "Fat Loss",
      subtitle: "Caloric Deficit Maximizer",
      description: "Calculate optimal metabolic rate indices and construct meal programs for sustained lipolysis without muscle loss.",
      icon: Flame
    },
    {
      id: 3,
      title: "HIIT Workouts",
      subtitle: "EPOC Energy Afterburn",
      description: "Trigger excess post-exercise oxygen consumption using tactical work-to-rest structural pacing protocols.",
      icon: Award
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
      name: "Vikram Malhotra",
      role: "Master Strength Coach",
      description: "Former Indian national bodybuilding champion focusing on progressive biomechanical overload and power metrics.",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Priya Nair",
      role: "Metabolic Nutritionist",
      description: "Specializing in athletic calorie calibration, macronutrient breakdowns, and sustainable Indian dietary health strategies.",
      img: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Arjun Rao",
      role: "Functional Mobility Expert",
      description: "Expert in active recovery schemes, traditional yoga protocols, joint longevity, and dynamic core stabilization.",
      img: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&w=400&q=80"
    }
  ];

  // Testimonials Carousel
  const testimonials = [
    {
      quote: "AURA 3D completely revolutionized my physique. The structural guidance is unmatched. The workouts and nutritional pacing helped me drop body fat from 18% to 9% in just 12 weeks.",
      author: "Rahul Mehta",
      role: "Competitive Athlete & Architect",
      img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80"
    },
    {
      quote: "The interface is extremely premium. The micro-animations and clean grids feel amazing to interact with. It's like a high-performance workspace but engineered for physical evolution.",
      author: "Anjali Desai",
      role: "Software Developer",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
    },
    {
      quote: "I was skeptical about automated tracking systems, but the biometric indicators, trainer charts, and continuous feedback loop kept me completely dialed in. Highly recommended.",
      author: "Kabir Singh",
      role: "Crossfit Practitioner",
      img: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&w=120&q=80"
    }
  ];

  return (
    <div className={`relative min-h-screen overflow-x-hidden selection:bg-brand-lime selection:text-black font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'
    }`}>

      {/* Futuristic Background Ambient Glow Blobs */}
      <div className="absolute top-24 left-10 w-[350px] h-[350px] bg-brand-lime/10 dark:bg-brand-lime/8 rounded-full blur-[120px] pointer-events-none animate-blob z-0 hidden md:block" />
      <div className="absolute top-[400px] right-20 w-[400px] h-[400px] bg-brand-cyan/10 dark:bg-brand-cyan/8 rounded-full blur-[120px] pointer-events-none animate-blob-reverse z-0 hidden md:block" />
      <div className="absolute top-[1600px] left-1/3 w-[500px] h-[350px] bg-purple-500/5 dark:bg-purple-900/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[3200px] right-1/4 w-[450px] h-[450px] bg-brand-lime/5 dark:bg-brand-lime/4 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* 3D Fitness Ecosystem Space Background Canvas */}
      <motion.div 
        style={{ opacity: bgCanvasOpacity }}
        className="fixed inset-0 z-0 w-full h-full pointer-events-none select-none"
      >
        <FitnessHero3D />
      </motion.div>

      {/* HEADER / NAVBAR */}
      <motion.header 
        animate={{
          top: (isMobile && isMobileMenuOpen) ? "12px" : (isScrolled ? "12px" : "24px"),
          width: (isMobile && isMobileMenuOpen) ? "92%" : (isScrolled ? "88%" : "92%"),
          maxWidth: (isMobile && isMobileMenuOpen) ? "980px" : (isScrolled ? "980px" : "1120px"),
          height: (isMobile && isMobileMenuOpen) 
            ? "auto" 
            : (isScrolled ? "58px" : "70px")
        }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className={`fixed left-1/2 -translate-x-1/2 z-50 flex flex-col justify-center rounded-2xl border overflow-hidden transition-all duration-300 ${
          theme === 'dark'
            ? (isScrolled || isMobileMenuOpen
              ? "bg-black/80 border-white/10 backdrop-blur-xl shadow-lg shadow-brand-lime/5 text-white" 
              : "bg-black/45 border-white/5 backdrop-blur-md shadow-2xl text-white")
            : (isScrolled || isMobileMenuOpen
              ? "bg-white/90 border-zinc-200 backdrop-blur-xl shadow-lg text-zinc-900" 
              : "bg-white/70 border-zinc-200/80 backdrop-blur-md shadow-xl text-zinc-900")
        }`}
      >
        <div className="w-full flex items-center justify-between h-[58px] md:h-full px-6">
          
          {/* Logo */}
          <motion.div 
            onClick={() => {
              launchSequence('/dashboard');
              setIsMobileMenuOpen(false);
            }}
            whileHover="hover"
            className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
          >
            <motion.div 
              variants={{
                hover: { 
                  scale: 1.05,
                  rotate: [0, -10, 15, -10, 5, 0],
                  transition: { duration: 0.5 }
                }
              }}
              className="w-9 h-9 rounded-lg bg-brand-lime flex items-center justify-center shadow-lg shadow-brand-lime/25 relative overflow-hidden"
            >
              <Dumbbell className="w-5 h-5 text-black stroke-[2.5]" />
            </motion.div>
            
            <div className="flex flex-col items-start leading-none">
              <span className="font-black tracking-tighter text-2xl font-sans uppercase">
                AURA <span className="text-brand-lime">3D</span>
              </span>
              <span className="text-[7px] font-mono tracking-widest text-brand-lime/80 font-bold -mt-0.5 animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-lime inline-block" />
                TELEMETRY ACTIVE
              </span>
            </div>
          </motion.div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 relative">
            {navLinks.map((link, idx) => {
              const isActive = activeLink === idx;
              return (
                <a
                  key={idx}
                  href={link.href}
                  onClick={() => setActiveLink(idx)}
                  onMouseEnter={() => setHoveredLink(idx)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative px-4 py-2 rounded-full transition-colors duration-300 z-10 ${
                    isActive 
                      ? (theme === 'dark' ? 'text-brand-lime font-black' : 'text-lime-700 font-extrabold') 
                      : (theme === 'dark' ? 'hover:text-white text-zinc-400' : 'hover:text-black text-zinc-600')
                  }`}
                >
                  {link.name}
                  {hoveredLink === idx && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className={`absolute inset-0 rounded-full -z-10 border ${
                        theme === 'dark' ? 'bg-white/10 border-white/5' : 'bg-black/5 border-black/5'
                      }`}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Call to Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => launchSequence('/dashboard')}
              className={`px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-white/10 text-zinc-300 hover:bg-white/5 hover:border-white/20 hover:text-white'
                  : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300 hover:text-black'
              }`}
            >
              BE A MEMBER
            </button>
            <motion.button 
              onClick={() => launchSequence('/dashboard')}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0px 0px 15px rgba(204,255,0,0.5)"
              }}
              whileTap={{ scale: 0.97 }}
              className="group bg-brand-lime text-black font-extrabold text-xs px-6 py-3 rounded-xl cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
            >
              Join Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-250" />
            </motion.button>
          </div>

          {/* Hamburger (Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl border transition-all duration-200 ${
              theme === 'dark'
                ? 'border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white'
                : 'border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-black'
            }`}
            aria-label="Toggle Menu"
          >
            <div className="w-5 h-5 relative flex items-center justify-center">
              <span className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45" : "-translate-y-1.5"
              }`} />
              <span className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`} />
              <span className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45" : "translate-y-1.5"
              }`} />
            </div>
          </button>

        </div>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`md:hidden border-t px-6 py-6 space-y-6 backdrop-blur-2xl overflow-hidden ${
                theme === 'dark' ? 'border-white/5 bg-black/90' : 'border-zinc-200 bg-white/95'
              }`}
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, idx) => (
                  <motion.a
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx}
                    href={link.href}
                    onClick={() => {
                      setActiveLink(idx);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-sm font-bold uppercase tracking-widest block transition-colors ${
                      activeLink === idx 
                        ? (theme === 'dark' ? 'text-brand-lime font-black' : 'text-lime-700 font-extrabold') 
                        : (theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black')
                    }`}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
              
              <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                <button 
                  onClick={() => {
                    launchSequence('/dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all text-center ${
                    theme === 'dark'
                      ? 'border-white/10 text-zinc-300 hover:bg-white/5'
                      : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  BE A MEMBER
                </button>
                <button 
                  onClick={() => {
                    launchSequence('/dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-brand-lime text-black font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-lg shadow-brand-lime/20"
                >
                  Join Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.header>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen pt-44 pb-32 flex flex-col items-center justify-center px-6 max-w-7xl mx-auto">

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column - Headline, Subheading, CTAs & Metrics */}
          <div className="lg:col-span-8 text-left space-y-8 flex flex-col justify-center">
            
            {/* Glowing Telemetry Header Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-[10px] font-mono font-bold tracking-widest text-brand-lime w-fit backdrop-blur-md shadow-[0_0_15px_rgba(204,255,0,0.05)] ${
                theme === 'dark' ? 'bg-zinc-950/60 border-brand-lime/25' : 'bg-white/80 border-brand-lime/30 shadow-xs'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-brand-lime animate-ping" />
              <span>✦ AI-POWERED BIOMECHANICAL SYSTEM</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 className={`font-display text-6xl sm:text-7xl xl:text-8xl font-black uppercase tracking-tight leading-[0.9] ${
                theme === 'dark' ? 'text-white' : 'text-zinc-900'
              }`}>
                SCULPT YOUR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime via-emerald-400 to-brand-cyan">
                  BIOMETRIC SHAPE
                </span> <br />
                REDEFINE <span className="text-brand-lime text-outline-lime">LIMITS</span>
              </h1>
              
              <p className={`text-sm md:text-base max-w-xl leading-relaxed font-medium ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                Leverage live biomechanical telemetry, real-time physiological tracking, and artificial intelligence to unlock your peak performance. Welcome to the future of physical evolution.
              </p>
            </motion.div>

            {/* Call To Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.button 
                onClick={() => launchSequence('/dashboard')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-brand-lime text-black font-black text-xs px-7 py-4 rounded-xl shadow-lg shadow-brand-lime/20 cursor-pointer flex items-center gap-2 uppercase tracking-widest border border-brand-lime hover:bg-transparent hover:text-brand-lime transition-all duration-300"
              >
                Join the Evolution <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <a 
                href="#services"
                className={`px-6 py-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'border-white/10 text-zinc-300 hover:bg-white/5 hover:border-white/20 hover:text-white'
                    : 'border-zinc-200 text-zinc-750 hover:bg-zinc-100 hover:border-zinc-300 hover:text-black'
                }`}
              >
                Explore Motion Lab
              </a>
            </motion.div>

            {/* Mini Dashboard Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t max-w-2xl ${
                theme === 'dark' ? 'border-white/5' : 'border-zinc-200'
              }`}
            >
              {[
                { label: 'HAPPY MEMBERS', val: '12K+', icon: <Fingerprint className="w-4.5 h-4.5 text-brand-lime" /> },
                { label: 'WORKOUTS', val: '70+', icon: <Zap className="w-4.5 h-4.5 text-brand-lime" /> },
                { label: 'FITNESS HOURS', val: '1.5M+', icon: <Activity className="w-4.5 h-4.5 text-brand-lime" /> },
                { label: 'ELITE COACHES', val: '120+', icon: <UserCheck className="w-4.5 h-4.5 text-brand-lime" /> }
              ].map((stat, i) => (
                <div key={i} className={`p-5 rounded-2xl border backdrop-blur-md text-left flex flex-col justify-between min-h-[96px] group transition-all duration-300 hover:border-brand-lime/30 hover:-translate-y-0.5 ${
                  theme === 'dark'
                    ? 'bg-zinc-950/30 border-white/5 text-white hover:bg-zinc-900/40'
                    : 'bg-white/70 border-zinc-200 text-zinc-900 shadow-xs hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[9px] font-mono font-bold tracking-wider ${
                      theme === 'dark' ? 'text-zinc-550' : 'text-zinc-550'
                    }`}>{stat.label}</span>
                    {stat.icon}
                  </div>
                  <span className={`text-xl font-black tracking-tight mt-2 ${
                    theme === 'dark' ? 'text-white' : 'text-zinc-900'
                  }`}>{stat.val}</span>
                </div>
              ))}
            </motion.div>

          </div>
          
        </div>
      </section>

      {/* BRANDS ROW - INFINITE SLIDER */}
      <section className={`relative z-10 py-16 border-y overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/5 bg-zinc-950' : 'border-zinc-200 bg-white shadow-xs'
      }`}>
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
      <section className={`py-36 border-b relative z-10 transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/5 bg-black' : 'border-zinc-200 bg-zinc-100/30'
      }`}>
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-16 relative">
          <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">The Fitness Obstacle</span>
          <h2 className={`font-display text-4xl md:text-5xl font-black uppercase tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          }`}>
            FRUSTRATED WITH <span className="text-brand-lime text-outline-lime">GENERIC TRAINING?</span>
          </h2>
          <p className={`text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold ${
            theme === 'dark' ? 'text-zinc-550' : 'text-zinc-600'
          }`}>
            Traditional approaches are inefficient, outdated, and lack real-time physiological analytics.
          </p>
        </div>
        <ProblemGrid />
      </section>

      {/* ABOUT / FEATURE LIST SECTION ("Inspired to Inspire Your Best Self") */}
      <section id="about" className="relative z-10 py-36 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
        
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
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95]">
              INSPIRE YOUR <br />
              <span className="text-brand-lime text-outline-lime">BEST SELF</span>
            </h2>
          </div>
          <p className={`text-sm max-w-lg leading-relaxed font-medium ${
            theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
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
                <span className={`text-xs font-bold uppercase tracking-widest ${
                  theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'
                }`}>{feature}</span>
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
          <div className={`relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-visible border shadow-2xl group cursor-pointer ${
            theme === 'dark' ? 'border-white/5 bg-zinc-950' : 'border-zinc-200 bg-white'
          }`}>


            {/* Vignette background layer */}
            <div className={`absolute inset-0 rounded-2xl overflow-hidden z-0 ${
              theme === 'dark' ? 'bg-black' : 'bg-zinc-100'
            }`} />
            
            <motion.img 
              src="/bodybuilder_side_flex.jpg"
              alt="Monochrome Athlete Training"
              width={800}
              height={800}
              loading="lazy"
              variants={aboutImageVariants}
              className={`absolute inset-0 w-full h-full object-cover rounded-2xl grayscale contrast-[1.3] saturate-0 origin-bottom z-10 transition-all duration-300 ${
                theme === 'dark' ? 'brightness-95 mix-blend-screen' : 'invert brightness-[1.05] mix-blend-multiply opacity-80'
              }`}
            />
            {/* Overlay border */}
            <div className="absolute inset-0 border border-brand-lime/10 rounded-2xl pointer-events-none" />
            <div className={`absolute inset-0 bg-gradient-to-t to-transparent ${
              theme === 'dark' ? 'from-black/20' : 'from-zinc-200/40'
            }`} />
          </div>
          {/* Subtle accent corner element */}
          <div className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 border-brand-lime rounded-tr-xl pointer-events-none" />
          <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-brand-lime rounded-bl-xl pointer-events-none" />
        </motion.div>
      </section>

      {/* FEATURE PORTFOLIO - HORIZONTAL SCROLL SHOWCASE */}
      <section className={`relative z-10 py-36 border-y transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/5 bg-zinc-950/20' : 'border-zinc-200 bg-zinc-100/20'
      }`}>
        <HorizontalScrollShowcase />
      </section>

      {/* DISCOVER WHAT SETS US APART */}
      <section id="services" className={`relative z-10 py-36 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/5 bg-zinc-950/40' : 'border-zinc-200 bg-zinc-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">Discover</span>
            <h2 className={`font-display text-4xl md:text-5xl font-black uppercase tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>
              WHAT SETS <span className="text-brand-lime text-outline-lime">US APART</span>
            </h2>
            <p className={`text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold ${
              theme === 'dark' ? 'text-zinc-550' : 'text-zinc-600'
            }`}>
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
                      ? (theme === 'dark'
                        ? "bg-brand-lime text-black border-brand-lime shadow-xl shadow-brand-lime/10" 
                        : "bg-brand-lime text-white border-brand-lime shadow-xl shadow-brand-lime/20")
                      : (theme === 'dark'
                        ? "bg-zinc-950/80 text-white border-white/5 hover:border-brand-lime/20"
                        : "bg-white text-zinc-900 border-zinc-200 hover:border-brand-lime/30 shadow-xs")
                  }`}
                >
                  <div className="space-y-4" style={{ transformStyle: "preserve-3d" }}>
                    <div 
                      style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        isActive 
                          ? (theme === 'dark' ? "bg-black/10" : "bg-white/20")
                          : "bg-brand-lime/10"
                      }`}
                    >
                      <card.icon className={`w-6 h-6 transition-colors duration-300 ${isActive ? (theme === 'dark' ? "text-black" : "text-white") : "text-brand-lime"}`} />
                    </div>
                    <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
                      <h3 className="text-lg font-black uppercase tracking-wide">{card.title}</h3>
                      <p className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                        isActive 
                          ? (theme === 'dark' ? "text-black/60" : "text-white/70")
                          : (theme === 'dark' ? "text-brand-lime" : "text-brand-lime font-extrabold")
                      }`}>{card.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4" style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }}>
                    <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                      isActive 
                        ? (theme === 'dark' ? "text-black/80" : "text-white/90")
                        : (theme === 'dark' ? "text-zinc-400" : "text-zinc-600")
                    }`}>{card.description}</p>
                    
                    <button className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors duration-300 ${
                      isActive 
                        ? (theme === 'dark' ? "text-black" : "text-white")
                        : (theme === 'dark' ? "text-brand-lime" : "text-brand-lime font-extrabold")
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
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSetsUsApart === i ? "w-8 bg-brand-lime" : (theme === 'dark' ? "w-1.5 bg-zinc-700" : "w-1.5 bg-zinc-300")
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* BIOMECHANICAL MOTION LAB SECTION */}
      <section className={`relative z-10 py-36 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/5 bg-zinc-950/20' : 'border-zinc-200 bg-zinc-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">WebGL Biometrics</span>
            <h2 className={`font-display text-4xl md:text-5xl font-black uppercase tracking-tight transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>
              BIOMECHANICAL <span className="text-brand-lime text-outline-lime">MOTION LAB</span>
            </h2>
            <p className={`text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'
            }`}>
              Real-time kinetic simulation of joint torque, muscle load, and range of motion.
            </p>
          </div>
          <BiomechanicalMotionLab />
        </div>
      </section>

      {/* EXERCISE GRID: "Train Smarter Unleash Your Potential" */}
      <section className={`relative z-10 py-36 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/5' : 'border-zinc-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-20">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase font-semibold">Train Smarter</span>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight">
              UNLEASH YOUR <span className="text-brand-lime text-outline-lime">POTENTIAL</span>
            </h2>
            <p className={`text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-550' : 'text-zinc-600'
            }`}>
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
                className={`group relative rounded-2xl overflow-hidden border aspect-[4/3] flex flex-col justify-end p-6 cursor-pointer transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={ex.img} 
                    alt={ex.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover grayscale contrast-125 brightness-[0.7] group-hover:scale-105 group-hover:brightness-[0.85] transition-all duration-500 saturate-0"
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
                  <h4 className="text-lg font-black uppercase tracking-wide text-white group-hover:text-brand-lime transition-colors">{ex.title}</h4>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">AURA 3D Syllabus</span>
                </div>

                {/* Corner outline highlight on hover */}
                <div className="absolute inset-0 border border-transparent group-hover:border-brand-lime/25 rounded-2xl pointer-events-none transition-all duration-300" />
              </TiltCard>
            ))}
          </div>

        </div>
      </section>

      {/* DASHBOARDS: Experience Fitness Like Never Before */}
      <section className={`relative z-10 py-36 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/5 bg-zinc-950/30' : 'border-zinc-200 bg-zinc-50/30'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-20">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">Experience</span>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight">
              FITNESS LIKE <span className="text-brand-lime text-outline-lime">NEVER BEFORE</span>
            </h2>
            <p className={`text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'
            }`}>
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
              className={`border rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden transition-colors duration-300 ${
                theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200 shadow-xs'
              }`}
            >
              <div className="flex-1 space-y-6 text-left" style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }}>
                <div>
                  <span className="text-brand-lime font-mono text-[10px] font-bold uppercase tracking-widest">Endurance Focus</span>
                  <h3 className={`text-2xl font-black uppercase tracking-wide mt-1 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-zinc-900'
                  }`}>Endurance Revolution</h3>
                </div>
                <p className={`text-xs leading-relaxed font-medium transition-colors duration-300 ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  Boost your cellular mitochondrial threshold and overall aerobic resilience index using pacing telemetry.
                </p>
                <button 
                  onClick={() => launchSequence('/dashboard')}
                  className={`bg-brand-lime font-extrabold text-[10px] px-5 py-2.5 rounded-lg flex items-center gap-1.5 uppercase tracking-wider transition-colors duration-300 ${
                    theme === 'dark' ? 'text-black' : 'text-white'
                  }`}
                >
                  Try now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Graphic container */}
              <div className="flex-1 w-full relative flex justify-center items-center" style={{ transformStyle: "preserve-3d" }}>
                {/* HUD Overlay label */}
                <div className="absolute top-4 left-4 z-20 px-2 py-0.5 rounded bg-black/85 border border-red-500/30 font-mono text-[7px] font-bold text-red-400 tracking-widest uppercase hidden sm:block">
                  live telemetry // zone_03
                </div>
                
                <div 
                  style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
                  className={`w-56 aspect-square rounded-2xl overflow-hidden border grayscale saturate-0 transition-colors duration-300 relative ${
                    theme === 'dark' ? 'border-white/10' : 'border-zinc-200'
                  }`}
                >
                  <Image 
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80" 
                    alt="Endurance training" 
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </div>

                {/* Floating Heart Rate Metric */}
                <div 
                  style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }}
                  className={`absolute -bottom-4 right-2 border rounded-xl p-3 flex items-center gap-2 shadow-2xl font-mono text-left transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                  </div>
                  <div>
                    <span className={`text-[9px] uppercase tracking-widest font-bold block transition-colors duration-300 ${
                      theme === 'dark' ? 'text-zinc-550' : 'text-zinc-400'
                    }`}>Heart Rate</span>
                    <span className={`text-xs font-black transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-zinc-900'
                    }`}>138 bpm</span>
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
              className={`border rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden transition-colors duration-300 ${
                theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200 shadow-xs'
              }`}
            >
              <div className="flex-1 space-y-6 text-left" style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }}>
                <div>
                  <span className="text-brand-lime font-mono text-[10px] font-bold uppercase tracking-widest">Macro Telemetry</span>
                  <h3 className={`text-2xl font-black uppercase tracking-wide mt-1 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-zinc-900'
                  }`}>Smart Pace</h3>
                </div>
                <p className={`text-xs leading-relaxed font-medium transition-colors duration-300 ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  Track energetic intake indices in real-time, syncing custom training loads with optimal protein synthesizers.
                </p>
                <button 
                  onClick={() => launchSequence('/dashboard')}
                  className={`bg-brand-lime font-extrabold text-[10px] px-5 py-2.5 rounded-lg flex items-center gap-1.5 uppercase tracking-wider transition-colors duration-300 ${
                    theme === 'dark' ? 'text-black' : 'text-white'
                  }`}
                >
                  Try now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Graphic container */}
              <div className="flex-1 w-full relative flex justify-center items-center" style={{ transformStyle: "preserve-3d" }}>
                {/* HUD Overlay label */}
                <div className="absolute top-4 left-4 z-20 px-2 py-0.5 rounded bg-black/85 border border-brand-lime/30 font-mono text-[7px] font-bold text-brand-lime tracking-widest uppercase hidden sm:block">
                  caloric engine // active
                </div>

                <div 
                  style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
                  className={`w-56 aspect-square rounded-2xl overflow-hidden border grayscale saturate-0 transition-colors duration-300 relative ${
                    theme === 'dark' ? 'border-white/10' : 'border-zinc-200'
                  }`}
                >
                  <Image 
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80" 
                    alt="Smart pacing" 
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </div>

                {/* Floating Ring / Dial Metric */}
                <div 
                  style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }}
                  className={`absolute -bottom-4 left-2 border rounded-xl p-3 flex items-center gap-2 shadow-2xl font-mono text-left transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-lime/10 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-brand-lime" />
                  </div>
                  <div>
                    <span className={`text-[9px] uppercase tracking-widest font-bold block transition-colors duration-300 ${
                      theme === 'dark' ? 'text-zinc-550' : 'text-zinc-400'
                    }`}>Burn Rate</span>
                    <span className={`text-xs font-black transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-zinc-900'
                    }`}>412 kcal</span>
                  </div>
                </div>
              </div>
            </TiltCard>

          </div>

        </div>
      </section>

      {/* NEURAL AI COACHING CONSOLE SECTION */}
      <section className={`py-36 border-t relative z-10 transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/5 bg-black' : 'border-zinc-200 bg-zinc-50/20'
      }`}>
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-16">
          <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">Neural Biometrics</span>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight">
            AURA AI <span className="text-brand-lime text-outline-lime">COACH CONSOLE</span>
          </h2>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <CoachDemoWidget />
        </div>
      </section>

      {/* TRAINERS: Your Fitness Goals, Their Expertise */}
      <section id="trainers" className={`relative z-10 py-36 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/5' : 'border-zinc-200 bg-zinc-50/20'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-24">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase font-semibold">Your Fitness</span>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight">
              GOALS, <span className="text-brand-lime text-outline-lime">THEIR EXPERTISE</span>
            </h2>
            <p className={`text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-550' : 'text-zinc-600'
            }`}>
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
                className={`border rounded-2xl overflow-hidden text-left flex flex-col justify-between p-6 relative group transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-zinc-950 border-white/5 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-xs'
                }`}
              >
                
                {/* Glowing radial background inside card on hover */}
                <div className="absolute -inset-1 bg-gradient-to-t from-brand-lime/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-6">
                  {/* Monochrome Portrait */}
                  <div 
                    style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
                    className={`w-full aspect-[4/5] rounded-xl overflow-hidden relative border grayscale saturate-0 transition-colors duration-300 ${
                      theme === 'dark' ? 'border-white/5' : 'border-zinc-200'
                    }`}
                  >
                    <Image 
                      src={tr.img} 
                      alt={tr.name} 
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top contrast-125"
                    />
                    {/* Dark gradient mapping overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t to-transparent ${
                      theme === 'dark' ? 'from-black/60' : 'from-zinc-900/10'
                    }`} />
                  </div>

                  <div className="space-y-1 relative z-10" style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}>
                    <div className="font-mono text-[7px] text-zinc-500 tracking-wider">COACH_ID: TR_{idx + 1} // TELEMETRY_ON</div>
                    <h3 className={`text-xl font-black uppercase tracking-wide group-hover:text-brand-lime transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-zinc-900'
                    }`}>{tr.name}</h3>
                    <p className="text-[10px] font-black text-brand-lime uppercase tracking-widest font-mono">{tr.role}</p>
                  </div>
                </div>

                <div 
                  style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }}
                  className={`mt-4 pt-4 border-t text-xs leading-relaxed font-medium relative z-10 transition-colors duration-300 ${
                    theme === 'dark' ? 'border-white/5 text-zinc-400' : 'border-zinc-200 text-zinc-600'
                  }`}
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
            <span className={`text-sm ${theme === 'dark' ? 'text-zinc-700' : 'text-zinc-300'}`}>/</span>
          </div>

        </div>
      </section>

      {/* SUCCESS STORIES: Testimonial Carousel */}
      <section id="testimonials" className={`relative z-10 py-36 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/5 bg-zinc-950/30' : 'border-zinc-200 bg-zinc-50/30'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-20">
            <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">Your Success</span>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight">
              STORIES, <span className="text-brand-lime text-outline-lime">OUR INSPIRATION</span>
            </h2>
            <p className={`text-xs max-w-md mx-auto leading-relaxed uppercase tracking-wider font-bold transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-550' : 'text-zinc-655'
            }`}>
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
              <div className={`relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-visible border shadow-2xl group cursor-pointer transition-colors duration-300 ${
                theme === 'dark' ? 'border-white/5 bg-zinc-950' : 'border-zinc-200 bg-white'
              }`}>


                {/* Vignette background */}
                <div className={`absolute inset-0 rounded-2xl overflow-hidden z-0 transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-black' : 'bg-zinc-100'
                }`} />
                
                <MotionImage 
                  src="/bodybuilder_back_pose.jpg" 
                  alt="Athlete flex" 
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  loading="lazy"
                  variants={successImageVariants}
                  className={`absolute inset-0 w-full h-full object-cover rounded-2xl grayscale contrast-[1.3] saturate-0 origin-bottom z-10 transition-all duration-300 ${
                    theme === 'dark' ? 'brightness-95 mix-blend-screen' : 'invert brightness-[1.05] mix-blend-multiply opacity-80'
                  }`}
                />
                <div className={`absolute inset-x-0 bottom-0 h-24 z-20 rounded-b-2xl pointer-events-none bg-gradient-to-t ${
                  theme === 'dark' ? 'from-black to-transparent' : 'from-zinc-100/30 to-transparent'
                }`} />
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
                    <p className={`text-xl md:text-2xl font-bold leading-relaxed italic font-sans transition-colors duration-300 ${
                      theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'
                    }`}>
                      "{testimonials[activeTestimonial].quote}"
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <Image 
                        src={testimonials[activeTestimonial].img} 
                        alt={testimonials[activeTestimonial].author} 
                        width={44}
                        height={44}
                        className={`rounded-full border object-cover grayscale transition-colors duration-300 ${
                          theme === 'dark' ? 'border-white/10' : 'border-zinc-200'
                        }`}
                      />
                      <div>
                        <h5 className={`font-extrabold text-sm uppercase tracking-wider transition-colors duration-300 ${
                          theme === 'dark' ? 'text-white' : 'text-zinc-900'
                        }`}>{testimonials[activeTestimonial].author}</h5>
                        <p className="text-[10px] text-brand-lime font-bold uppercase tracking-widest font-mono">{testimonials[activeTestimonial].role}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Controller buttons */}
              <div className={`flex justify-between items-center pt-8 border-t transition-colors duration-300 ${
                theme === 'dark' ? 'border-white/5' : 'border-zinc-200'
              }`}>
                {/* Dots */}
                <div className="flex gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeTestimonial === idx ? "w-8 bg-brand-lime" : (theme === 'dark' ? "w-1.5 bg-zinc-700" : "w-1.5 bg-zinc-300")
                      }`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    aria-label="Previous slide"
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-350 ${
                      theme === 'dark' ? 'bg-zinc-950 border-white/10 hover:bg-zinc-900' : 'bg-white border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <ChevronLeft className={`w-5 h-5 transition-colors ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-660 hover:text-zinc-900'}`} />
                  </button>
                  <button 
                    onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                    aria-label="Next slide"
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-350 ${
                      theme === 'dark' ? 'bg-zinc-950 border-white/10 hover:bg-zinc-900' : 'bg-white border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <ChevronRight className={`w-5 h-5 transition-colors ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-660 hover:text-zinc-900'}`} />
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
      <section className="relative z-10 py-32 max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-brand-lime rounded-[32px] p-8 sm:p-12 md:p-16 text-center space-y-6 relative overflow-hidden flex flex-col items-center justify-center"
        >
          {/* Subtle design pattern background on CTA banner */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1.5px,transparent_1.5px)] bg-[size:16px_16px] pointer-events-none" />

          <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-black leading-none relative z-10">
            CONNECT ENGAGE TRANSFORM
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
      <section className="w-full relative z-10 overflow-hidden">
      </section>
      <footer className={`relative z-10 border-t py-20 px-6 transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/5 bg-zinc-950' : 'border-zinc-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 text-left">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => launchSequence('/dashboard')}>
              <div className="w-9 h-9 rounded-lg bg-brand-lime flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <span className={`font-black tracking-tighter text-2xl uppercase transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-zinc-900'
              }`}>
                AURA <span className="text-brand-lime">3D</span>
              </span>
            </div>
            
            <p className={`text-xs leading-relaxed max-w-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-700'
            }`}>
              Next-generation spatial logs and athletic condition tracking models, engineered for dynamic body adjustments.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              <a 
                href="#" 
                aria-label="Facebook" 
                className={`w-8 h-8 rounded-lg border flex items-center justify-center text-zinc-500 transition-all ${
                  theme === 'dark' ? 'border-white/10 hover:text-white hover:border-white/20' : 'border-zinc-200 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a 
                href="#" 
                aria-label="Instagram" 
                className={`w-8 h-8 rounded-lg border flex items-center justify-center text-zinc-500 transition-all ${
                  theme === 'dark' ? 'border-white/10 hover:text-white hover:border-white/20' : 'border-zinc-200 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="#" 
                aria-label="Twitter/X" 
                className={`w-8 h-8 rounded-lg border flex items-center justify-center text-zinc-500 transition-all ${
                  theme === 'dark' ? 'border-white/10 hover:text-white hover:border-white/20' : 'border-zinc-200 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            <p className={`text-[10px] font-bold font-mono transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-700' : 'text-zinc-500'
            }`}>© 2026 AURA 3D Inc. All rights reserved.</p>


          </div>

          {/* Quick links col 1 */}
          <div className="md:col-span-3 space-y-4">
            <h5 className={`text-xs font-black uppercase tracking-widest font-mono transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>Platform Options</h5>
            <ul className={`text-[11px] font-bold uppercase tracking-wider space-y-3.5 transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'
            }`}>
              <li><Link href="/dashboard/workout" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-zinc-900'}`}>Workout Builder</Link></li>
              <li><Link href="/dashboard/nutrition" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-zinc-900'}`}>Macro Planner</Link></li>
              <li><Link href="/dashboard/bmi" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-zinc-900'}`}>Biometric Logs</Link></li>
              <li><Link href="/dashboard/coach" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-zinc-900'}`}>AI Coach Console</Link></li>
            </ul>
          </div>

          {/* Quick links col 2 */}
          <div className="md:col-span-2 space-y-4">
            <h5 className={`text-xs font-black uppercase tracking-widest font-mono transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>Explore</h5>
            <ul className={`text-[11px] font-bold uppercase tracking-wider space-y-3.5 transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'
            }`}>
              <li><a href="#about" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-zinc-900'}`}>About Us</a></li>
              <li><a href="#services" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-zinc-900'}`}>Our Services</a></li>
              <li><a href="#trainers" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-zinc-900'}`}>Expert Cohort</a></li>
              <li><a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-zinc-900'}`}>Support Portal</a></li>
            </ul>
          </div>

          {/* Contact details */}
          <div className="md:col-span-2 space-y-4">
            <h5 className={`text-xs font-black uppercase tracking-widest font-mono transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>Get in Touch</h5>
            <ul className={`text-[11px] font-bold uppercase tracking-wider space-y-3.5 transition-colors duration-300 ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'
            }`}>
              <li className={`transition-colors duration-300 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-700'}`}>INFO@AURA3D.COM</li>
              <li className={`transition-colors duration-300 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-700'}`}>1-800-AURA-3D</li>
              <li className={`transition-colors duration-300 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-700'}`}>SAN FRANCISCO, CA</li>
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

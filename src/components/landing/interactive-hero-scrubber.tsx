'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, 
  Zap, 
  Star, 
  UserCheck, 
  Cpu, 
  Activity 
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function InteractiveHeroScrubber() {
  const theme = 'dark';
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Parallax Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [scanPercent, setScanPercent] = useState(50);

  // Live telemetry metrics simulator
  const [simulatedMetrics, setSimulatedMetrics] = useState({
    fps: 60,
    temp: 36.6,
    signalStrength: 98.4,
    emgLoad: 42,
  });

  // Update telemetry stats continuously for high-tech feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedMetrics((prev) => ({
        fps: +(60 + (Math.random() * 0.4 - 0.2)).toFixed(1),
        temp: +(36.5 + Math.random() * 0.3).toFixed(1),
        signalStrength: +(98 + Math.random() * 1.5).toFixed(1),
        emgLoad: Math.floor(40 + Math.random() * 30),
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate 3D tilt (max 15 degrees for strong 3D feel)
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rX = -((y - midY) / rect.height) * 15;
    const rY = ((x - midX) / rect.width) * 15;
    setTilt({ x: rX, y: rY });

    // Calculate shine gradient center
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    setShine({ x: shineX, y: shineY });

    // Dynamic scan offset percentage tracking mouse
    const percent = Math.round((x / rect.width) * 100);
    setScanPercent(percent);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="relative w-full max-w-lg aspect-[4/5] mx-auto select-none">
      
      {/* Decorative Outer Cyber-Frame corner brackets */}
      <div className="absolute -top-4 -left-4 w-6 h-6 border-t-2 border-l-2 border-brand-lime/30 rounded-tl" />
      <div className="absolute -top-4 -right-4 w-6 h-6 border-t-2 border-r-2 border-brand-lime/30 rounded-tr" />
      <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b-2 border-l-2 border-brand-lime/30 rounded-bl" />
      <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b-2 border-r-2 border-brand-lime/30 rounded-br" />

      {/* Floating telemetry text around the card */}
      <div className="absolute -top-6 left-0 text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
        <Cpu className="w-3 h-3 text-brand-lime" />
        <span>BIOMECHANICAL SCANNER: ACTIVE [FPS: {simulatedMetrics.fps}]</span>
      </div>

      <div className="absolute -bottom-6 left-0 right-0 text-[9px] font-mono text-zinc-500 uppercase flex justify-between">
        <span>SCAN OFFSET: {scanPercent}%</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-ping" />
          SIGNAL STRENGTH: {simulatedMetrics.signalStrength}%
        </span>
      </div>

      {/* Main 3D Card Wrapper */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        className={`group relative w-full h-full border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-brand-lime/45 hover:shadow-[0_0_50px_rgba(204,255,0,0.06)] cursor-pointer ${
          theme === 'dark' ? 'bg-zinc-950/10 border-white/10 backdrop-blur-[1px]' : 'bg-white/10 border-zinc-200 backdrop-blur-[1px]'
        }`}
      >
        
        {/* LAYER 1: Visual vignette and mesh grid background inside card (Depth: -40px) */}
        <div 
          style={{ transform: "translateZ(-40px)", transformStyle: "preserve-3d" }}
          className="absolute inset-0 z-0 transition-colors duration-300 bg-transparent"
        >
          <div className={`absolute inset-0 ${
            theme === 'dark' 
              ? 'bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.07)_0%,transparent_70%)]' 
              : 'bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.15)_0%,transparent_70%)]'
          }`} />
          <div className={`absolute inset-0 bg-[size:24px_24px] pointer-events-none ${
            theme === 'dark'
              ? 'bg-[linear-gradient(rgba(204,255,0,0.015)_1.2px,transparent_1.2px),linear-gradient(90deg,rgba(204,255,0,0.015)_1.2px,transparent_1.2px)]'
              : 'bg-[linear-gradient(rgba(204,255,0,0.03)_1.2px,transparent_1.2px),linear-gradient(90deg,rgba(204,255,0,0.03)_1.2px,transparent_1.2px)]'
          }`} />
        </div>

        {/* LAYER 2: Rotational circular HUD radars (Depth: -20px) */}
        <div 
          style={{ transform: "translateZ(-20px)", transformStyle: "preserve-3d" }}
          className="absolute inset-0 pointer-events-none z-5 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity duration-300"
        >
          <div className={`w-64 h-64 border border-dashed rounded-full flex items-center justify-center animate-spin-slow ${
            theme === 'dark' ? 'border-white/10' : 'border-black/10'
          }`}>
            <div className={`w-52 h-52 border border-dotted rounded-full ${
              theme === 'dark' ? 'border-white/5' : 'border-black/5'
            }`} />
          </div>
        </div>

        {/* LAYER 4: Biomechanical scanning laser line (Depth: 20px) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: ['0%', '100%', '0%'] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{ transform: "translateZ(20px)" }}
              className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-lime to-transparent shadow-[0_0_12px_rgba(204,255,0,0.8)] z-25 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* LAYER 5: Local Telemetry Scanning Target Reticles (Depth: 35px) */}
        <div 
          style={{ transform: "translateZ(35px)", transformStyle: "preserve-3d" }}
          className="absolute inset-0 pointer-events-none z-30 select-none opacity-60 group-hover:opacity-90 transition-opacity duration-300"
        >
          {/* Target Reticle near Left Arm */}
          <div className="absolute top-[28%] left-[22%] flex flex-col items-start gap-1">
            <div className="w-5 h-5 border-t-2 border-l-2 border-brand-lime rounded-tl-sm animate-pulse" />
            <span className="font-mono text-[7px] font-black tracking-widest text-brand-lime uppercase">L-EMG: {simulatedMetrics.emgLoad}%</span>
          </div>

          {/* Target Reticle near Core/Abs */}
          <div className="absolute top-[52%] left-[45%] flex flex-col items-center gap-1">
            <div className="w-6 h-6 border-t-2 border-r-2 border-l-2 border-brand-lime/60 rounded-t-sm animate-pulse" style={{ animationDelay: '0.4s' }} />
            <span className="font-mono text-[7px] font-black tracking-widest text-brand-lime uppercase">CORE_LOAD: HIGH</span>
          </div>

          {/* Target Reticle near Right Leg */}
          <div className="absolute top-[75%] right-[22%] flex flex-col items-end gap-1">
            <div className="w-5 h-5 border-b-2 border-r-2 border-brand-lime rounded-br-sm animate-pulse" style={{ animationDelay: '0.8s' }} />
            <span className="font-mono text-[7px] font-black tracking-widest text-brand-lime uppercase">R-TENSION: SYNC</span>
          </div>

          {/* Top-Right Telemetry coordinates */}
          <div className="absolute top-4 right-4 text-right font-mono text-[8px] text-zinc-500">
            <div>SYS_CAL: AUTO_99.8%</div>
            <div>SECTOR: T-BICEP_DEV</div>
            <div>TELEMETRY: LIVE</div>
          </div>
        </div>

        {/* LAYER 6: Holographic glass light reflection overlay (Depth: 45px) */}
        <div 
          className="absolute inset-0 z-25 pointer-events-none opacity-20 transition-opacity duration-300 group-hover:opacity-40"
          style={{
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            transform: "translateZ(45px)",
            mixBlendMode: "overlay"
          }}
        />

        {/* Bottom Vignette for card boundary fade */}
        <div className={`absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t to-transparent z-20 pointer-events-none ${
          theme === 'dark' ? 'from-black/45 via-black/35' : 'from-white/45 via-white/35'
        }`} />

        {/* ---------------- FLOATING BADGES AT DEPTH (Z: 60px) ---------------- */}
        
        {/* Floating Profile Stack (Bottom Left) */}
        <div 
          className="absolute bottom-5 left-5 z-30 flex items-center gap-2.5"
          style={{ transform: "translateZ(60px)" }}
        >
          <div className="flex -space-x-2.5">
            <Image className="rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="avatar" width={34} height={34} />
            <Image className="rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="avatar" width={34} height={34} />
            <Image className="rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="avatar" width={34} height={34} />
          </div>
          <div className="flex flex-col text-left font-mono">
            <span className={`text-[10px] font-black tracking-widest uppercase ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>12K+ ACTIVE MEMBERS</span>
            <span className="text-[8px] font-bold text-zinc-500 uppercase">TELEMETRY SYNCED</span>
          </div>
        </div>

        {/* Scanning status banner (Bottom Right) */}
        <div 
          className="absolute bottom-5 right-5 z-30 font-mono flex flex-col items-end"
          style={{ transform: "translateZ(65px)" }}
        >
          <div className="text-[9px] font-black text-brand-lime uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-brand-lime" />
            <span>EMG: {simulatedMetrics.emgLoad}%</span>
          </div>
          <span className="text-[7px] font-bold text-zinc-500 uppercase">TARGET LOCK: ON</span>
        </div>

      </div>

      {/* Floating Badges outside the card frame (Depth: 75px) */}
      <div className="hidden lg:block" style={{ transformStyle: "preserve-3d" }}>
        
        {/* Floating Badge 1: Top-Left */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
          style={{ transform: "translateZ(75px)" }}
          className={`absolute -top-6 -left-16 z-30 p-3 border rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-xl transition-colors duration-300 ${
            theme === 'dark' ? 'bg-zinc-950/80 border-white/10 text-white' : 'bg-white/90 border-zinc-200 text-zinc-900 shadow-md'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-brand-lime/10 flex items-center justify-center border border-brand-lime/20 shadow-inner">
            <HeartPulse className="w-4.5 h-4.5 text-brand-lime" />
          </div>
          <div className="text-left font-mono">
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">FITNESS</p>
            <p className={`text-xs font-black uppercase ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>1.5M+ HRs</p>
          </div>
        </motion.div>

        {/* Floating Badge 2: Top-Right */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.3 }}
          style={{ transform: "translateZ(75px)" }}
          className={`absolute top-16 -right-16 z-30 p-3 border rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-xl transition-colors duration-300 ${
            theme === 'dark' ? 'bg-zinc-950/80 border-white/10 text-white' : 'bg-white/90 border-zinc-200 text-zinc-900 shadow-md'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-brand-lime/10 flex items-center justify-center border border-brand-lime/20 shadow-inner">
            <Zap className="w-4.5 h-4.5 text-brand-lime" />
          </div>
          <div className="text-left font-mono">
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">WORKOUTS</p>
            <p className={`text-xs font-black uppercase ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>70+ ACTIVE</p>
          </div>
        </motion.div>

        {/* Floating Badge 3: Mid-Left */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.6 }}
          style={{ transform: "translateZ(75px)" }}
          className={`absolute top-48 -left-20 z-30 p-3 border rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-xl transition-colors duration-300 ${
            theme === 'dark' ? 'bg-zinc-950/80 border-white/10 text-white' : 'bg-white/90 border-zinc-200 text-zinc-900 shadow-md'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-brand-lime/10 flex items-center justify-center border border-brand-lime/20 shadow-inner">
            <Star className="w-4.5 h-4.5 text-brand-lime fill-brand-lime" />
          </div>
          <div className="text-left font-mono">
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">RATING</p>
            <p className={`text-xs font-black uppercase ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>4.8 / 5.0</p>
          </div>
        </motion.div>

        {/* Floating Badge 4: Bottom-Right */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4.0, ease: "easeInOut", delay: 0.9 }}
          style={{ transform: "translateZ(75px)" }}
          className={`absolute bottom-12 -right-14 z-30 p-3 border rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-xl transition-colors duration-300 ${
            theme === 'dark' ? 'bg-zinc-950/80 border-white/10 text-white' : 'bg-white/90 border-zinc-200 text-zinc-900 shadow-md'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-brand-lime/10 flex items-center justify-center border border-brand-lime/20 shadow-inner">
            <UserCheck className="w-4.5 h-4.5 text-brand-lime" />
          </div>
          <div className="text-left font-mono">
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">COACHES</p>
            <p className={`text-xs font-black uppercase ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>120+ ELITE</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

export default function InteractiveBackground() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out coordinate tracking using springs
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    setMounted(true);
    // Initialize in the center of the viewport
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Construct the radial mask templates
  const maskImage = useMotionTemplate`radial-gradient(350px circle at ${springX}px ${springY}px, black, transparent)`;
  const backgroundSpotlight = useMotionTemplate`radial-gradient(450px circle at ${springX}px ${springY}px, rgba(163, 230, 53, 0.09) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 100%)`;

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Background ambient cursor spotlight */}
      <motion.div
        className="absolute inset-0 opacity-100 dark:opacity-80 mix-blend-screen dark:mix-blend-normal pointer-events-none"
        style={{
          background: backgroundSpotlight,
        }}
      />

      {/* Dotted/Grid Reveal Overlay */}
      <motion.div
        style={{ WebkitMaskImage: maskImage, maskImage }}
        className="absolute inset-0 glow-grid-overlay opacity-80 dark:opacity-50 pointer-events-none"
      />

      {/* Stylized Floating Telemetry Vectors */}
      {/* Telemetry Ring 1 */}
      <div className="absolute top-[18%] right-[10%] w-[320px] h-[320px] rounded-full border border-dashed border-brand-lime/10 dark:border-brand-lime/5 animate-rotate-slow pointer-events-none flex items-center justify-center">
        <div className="w-[300px] h-[300px] rounded-full border border-dotted border-brand-cyan/15 dark:border-brand-cyan/5 flex items-center justify-center">
          <div className="w-[8px] h-[8px] bg-brand-lime/20 dark:bg-brand-lime/10 rounded-full" />
        </div>
        <div className="absolute top-0 w-2 h-2 bg-brand-cyan/30 dark:bg-brand-cyan/10 rounded-full" />
        <div className="absolute bottom-0 w-2 h-2 bg-brand-lime/30 dark:bg-brand-lime/10 rounded-full" />
      </div>

      {/* Telemetry Node 2 */}
      <div className="absolute bottom-[15%] left-[8%] w-[220px] h-[220px] animate-float-slow pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-15 dark:opacity-5 text-brand-cyan">
          {/* Hexagon wireframe coordinate */}
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
        </svg>
      </div>

      {/* Telemetry Node 3 */}
      <div className="absolute top-[45%] left-[40%] w-[400px] h-[400px] rounded-full border border-zinc-200/5 dark:border-white/2 animate-rotate-slow pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '40s' }}>
        <div className="absolute left-0 top-[50%] w-4 h-[1px] bg-zinc-400/20 dark:bg-white/5" />
        <div className="absolute right-0 top-[50%] w-4 h-[1px] bg-zinc-400/20 dark:bg-white/5" />
        <div className="absolute top-0 left-[50%] w-[1px] h-4 bg-zinc-400/20 dark:bg-white/5" />
        <div className="absolute bottom-0 left-[50%] w-[1px] h-4 bg-zinc-400/20 dark:bg-white/5" />
      </div>
    </div>
  );
}

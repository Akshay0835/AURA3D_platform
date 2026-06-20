'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { 
  Dumbbell, 
  LayoutDashboard, 
  Flame, 
  Salad, 
  Scale, 
  LineChart, 
  Bot, 
  User, 
  Sun, 
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Command Center', path: '/dashboard/command-center', icon: Cpu },
  { name: 'Workout Planner', path: '/dashboard/workout', icon: Flame },
  { name: 'Nutrition Log', path: '/dashboard/nutrition', icon: Salad },
  { name: 'BMI Calculator', path: '/dashboard/bmi', icon: Scale },
  { name: 'Analytics Engine', path: '/dashboard/analytics', icon: LineChart },
  { name: 'AI Coach Chat', path: '/dashboard/coach', icon: Bot },
  { name: 'Profile & Settings', path: '/dashboard/profile', icon: User },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme, user } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`glass-card bg-white/30 dark:bg-zinc-950/30 border-r border-black/5 dark:border-white/5 flex flex-col justify-between h-screen fixed inset-y-0 left-0 md:sticky top-0 transition-all duration-300 z-50 md:z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
      <div>
        {/* Top Header */}
        <div className="h-16 flex items-center justify-between px-4.5 border-b border-black/5 dark:border-white/5">
          <Link href="/landing" className="flex items-center gap-2 overflow-hidden select-none">
            <div className="w-8 h-8 rounded-lg bg-brand-lime flex items-center justify-center shrink-0">
              <Dumbbell className="w-5 h-5 text-black" />
            </div>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold tracking-wider text-base bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent shrink-0"
              >
                AURA<span className="text-brand-lime font-light">3D</span>
              </motion.span>
            )}
          </Link>

          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-lg border border-black/5 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => onClose?.()}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative overflow-hidden ${
                  isActive 
                    ? 'text-black font-semibold' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-100'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-brand-lime -z-10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                
                <item.icon className={`w-5 h-5 shrink-0 relative z-10 transition-colors ${isActive ? 'text-black' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-zinc-100'}`} />
                {!collapsed && <span className="relative z-10">{item.name}</span>}
                
                {/* Visual hover bubble effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-4">
        {/* User Card */}
        <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center' : ''}`}>
          <Image 
            src={user.avatar} 
            alt={user.name} 
            width={36}
            height={36}
            className="rounded-full border border-black/10 dark:border-white/10 object-cover shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <h5 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">{user.name}</h5>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-brand-lime rounded-full" />
                <span className="text-[10px] font-medium text-brand-lime font-mono">Streak: {user.streak}d</span>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Theme & Log Out */}
        <div className={`flex items-center gap-2 ${collapsed ? 'flex-col' : 'justify-between'}`}>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl border border-black/5 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          
          {!collapsed && (
            <Link 
              href="/landing"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-650 dark:hover:text-red-400 font-semibold px-2.5 py-2 hover:bg-red-500/5 dark:hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Link>
          )}
        </div>
      </div>
    </aside>
    </>
  );
}

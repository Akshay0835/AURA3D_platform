'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import InsightsPanel from '@/components/dashboard/insights-panel';
import { Menu, Dumbbell, Zap } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-theme relative">
      {/* Navigation sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Central content container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile/Tablet Top Header (Hidden on desktop >= xl) */}
        <header className="h-16 flex items-center justify-between px-4 bg-white/40 dark:bg-zinc-950/40 border-b border-black/5 dark:border-white/5 backdrop-blur-md xl:hidden shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg border border-black/5 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 ml-2">
              <div className="w-7 h-7 rounded-lg bg-brand-lime flex items-center justify-center">
                <Dumbbell className="w-4.5 h-4.5 text-black" />
              </div>
              <span className="font-bold tracking-wider text-sm bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                AURA<span className="text-brand-lime font-light">3D</span>
              </span>
            </div>
          </div>

          {/* Toggle Button for Daily Insights Panel */}
          <button
            onClick={() => setIsInsightsOpen(true)}
            className="p-2 rounded-lg border border-black/5 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center gap-1.5 text-xs font-bold transition-colors"
          >
            <Zap className="w-4 h-4 text-brand-lime" />
            <span>Daily Insights</span>
          </button>
        </header>

        {/* Scrollable central content dashboard panel */}
        <main className="flex-1 h-full overflow-y-auto px-4 sm:px-6 md:px-8 py-6 relative">
          <div className="max-w-6xl mx-auto w-full pb-12">
            {children}
          </div>
        </main>
      </div>
      
      {/* Floating Insights Toggle for desktop/tablet when closed */}
      {!isInsightsOpen && (
        <button
          onClick={() => setIsInsightsOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xl rounded-l-xl py-4.5 px-2 flex flex-col items-center gap-2 border border-r-0 border-black/10 dark:border-white/10 hover:pl-3.5 transition-all cursor-pointer group animate-border-glow hover:animate-none hidden sm:flex"
          title="Open Daily Insights"
        >
          <Zap className="w-4 h-4 text-brand-lime dark:text-lime-600 animate-pulse group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-extrabold tracking-widest font-mono [writing-mode:vertical-lr] select-none text-zinc-300 dark:text-zinc-700">
            METRICS
          </span>
        </button>
      )}

      {/* Right widgets insights panel */}
      <InsightsPanel isOpen={isInsightsOpen} onClose={() => setIsInsightsOpen(false)} />
    </div>
  );
}

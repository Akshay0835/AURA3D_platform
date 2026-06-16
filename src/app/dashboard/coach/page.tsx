'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore, ChatMessage } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  Plus, 
  Dumbbell, 
  Utensils, 
  Flag,
  Loader2
} from 'lucide-react';

export default function CoachChatPage() {
  const { chats, activeChatId, setActiveChatId, sendMessage, addMockCoachResponse } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Microphone recording simulation state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPulse, setRecordingPulse] = useState<number[]>([]);

  // Local state for streaming response simulation
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [streamingPlan, setStreamingPlan] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isTyping, streamingText]);

  // Audio wave visualizer loop
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingPulse(Array.from({ length: 8 }, () => Math.random() * 40 + 10));
      }, 150);
    } else {
      setRecordingPulse([]);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Send user message
    sendMessage(text);
    setInputText('');

    // Trigger AI response sequence
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      // Determine what details to mock based on prompt contents
      let responseText = "Understood. I've analyzed your parameters and updated your targets. Here is a custom tactical layout:";
      let planDetails: ChatMessage['planDetails'] = {
        workout: ['3x 20m high-intensity intervals', 'Progressive overload on Bench & Squats'],
        meals: ['Consume 160g protein', 'Limit snacks to 200 kcal max'],
        milestones: ['Drop to 77.5kg by June 30', 'Re-evaluate macros in 14 days']
      };

      if (text.toLowerCase().includes('marathon')) {
        responseText = "Structuring a premium marathon conditioning schedule. We will balance long aerobic runs with high-volume structural leg development:";
        planDetails = {
          workout: ['1x Weekly Long Run (starting 10km)', '2x Strength training focusing on single-leg stability'],
          meals: ['Increase carbs to 280g on long-run days', 'Adequate electrolyte hydration log (4000ml)'],
          milestones: ['Complete 15km run by Week 4', 'Pace target: 5:30/km average']
        };
      } else if (text.toLowerCase().includes('workout') || text.toLowerCase().includes('review')) {
        responseText = "Reviewing your active routines. Your volume split is highly effective, but we need to optimize rest intervals to sustain metabolic output:";
        planDetails = {
          workout: ['Keep push sets to 4, but reduce reps to 8-10', 'Incorporate core rotations at the end of pull days'],
          meals: ['High-glycogen pre-workout snack (30g carbs)', 'BCAA recovery drink post-workout'],
          milestones: ['Increase bench weight to 82.5kg', 'Complete 100% of sets logged next week']
        };
      }

      // Start character-by-character streaming text simulation
      setStreamingMessageId(`stream-${Date.now()}`);
      setStreamingText('');
      setStreamingPlan(planDetails);

      let index = 0;
      const chars = responseText.split('');
      
      const streamTimer = setInterval(() => {
        if (index < chars.length) {
          setStreamingText((prev) => prev + chars[index]);
          index++;
        } else {
          clearInterval(streamTimer);
          // Commit stream response into Zustand store
          addMockCoachResponse(responseText, planDetails);
          setStreamingMessageId(null);
          setStreamingText('');
          setStreamingPlan(null);
        }
      }, 20); // 20ms per character

    }, 1800); // 1.8s thinking delay
  };

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      // Populate transcription mock
      setInputText("Create a marathon conditioning plan matching a 2200 calorie goal.");
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex gap-6 relative overflow-hidden">
      
      {/* 1. Sidebar Logs History (Left) */}
      <div className="w-64 glass-card rounded-3xl p-5 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-black/5 dark:border-white/5">
            <MessageSquare className="w-4.5 h-4.5 text-brand-lime" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Sessions Logs</h3>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[400px]">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full text-left p-3 rounded-2xl flex flex-col gap-1 transition-all ${
                  chat.id === activeChatId 
                    ? 'bg-brand-lime/10 border border-brand-lime/30 text-zinc-900 dark:text-white' 
                    : 'bg-transparent border border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <span className="text-xs font-bold truncate">{chat.title}</span>
                <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {chat.date}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => alert("Creating a new blank chat session is coming soon!")}
          className="w-full bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 text-zinc-900 dark:text-white font-semibold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> New Session
        </button>
      </div>

      {/* 2. Main Chat Area (Right) */}
      <div className="flex-1 glass-card rounded-3xl overflow-hidden flex flex-col justify-between border border-black/5 dark:border-white/5 relative">
        
        {/* Chat Header */}
        <div className="bg-zinc-100/40 dark:bg-zinc-900/40 px-6 py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-brand-lime" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Aura AI Conditioning Coach</h4>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-brand-lime rounded-full animate-ping" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono">Neural Node Active</span>
              </div>
            </div>
          </div>

          {/* Micro interaction Mic */}
          <button
            onClick={handleMicClick}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-red-500 border-red-500/20 text-white animate-pulse' 
                : 'bg-zinc-100 dark:bg-zinc-900 border-black/5 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
            title={isRecording ? "Stop Recording" : "Voice Input"}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {/* Message Log Thread */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gradient-to-b from-transparent to-zinc-100/10 dark:to-zinc-950/20">
          
          {activeChat.messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-zinc-100 dark:bg-zinc-900 border-black/5 dark:border-white/5' 
                  : 'bg-brand-lime/10 border-brand-lime/20'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" /> : <Bot className="w-4 h-4 text-brand-lime" />}
              </div>
              
              <div className="space-y-3.5 w-full">
                <div className={`text-xs py-3 px-4.5 rounded-2xl leading-relaxed font-medium ${
                  msg.sender === 'user'
                    ? 'bg-brand-lime/10 border border-brand-lime/30 dark:border-brand-lime/20 text-zinc-800 dark:text-zinc-100 rounded-tr-none'
                    : 'bg-zinc-100/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 text-zinc-700 dark:text-zinc-300 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>

                {/* Sub cards details */}
                {msg.planDetails && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="glass-card p-3.5 rounded-xl border border-brand-lime/25 dark:border-brand-lime/15">
                      <div className="flex items-center gap-1.5 mb-2 text-brand-lime font-mono text-[9px] font-bold uppercase">
                        <Dumbbell className="w-3.5 h-3.5" /> Workouts
                      </div>
                      <ul className="text-[10px] text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-2.5">
                        {msg.planDetails.workout?.map((w, idx) => <li key={idx}>{w}</li>)}
                      </ul>
                    </div>
                    <div className="glass-card p-3.5 rounded-xl border border-brand-cyan/25 dark:border-brand-cyan/15">
                      <div className="flex items-center gap-1.5 mb-2 text-brand-cyan font-mono text-[9px] font-bold uppercase">
                        <Utensils className="w-3.5 h-3.5" /> Nutrition
                      </div>
                      <ul className="text-[10px] text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-2.5">
                        {msg.planDetails.meals?.map((m, idx) => <li key={idx}>{m}</li>)}
                      </ul>
                    </div>
                    <div className="glass-card p-3.5 rounded-xl border border-pink-500/25 dark:border-pink-500/15">
                      <div className="flex items-center gap-1.5 mb-2 text-pink-500 dark:text-pink-400 font-mono text-[9px] font-bold uppercase">
                        <Flag className="w-3.5 h-3.5" /> Milestones
                      </div>
                      <ul className="text-[10px] text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-2.5">
                        {msg.planDetails.milestones?.map((mil, idx) => <li key={idx}>{mil}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Render Streaming Simulation Message */}
          {streamingMessageId && (
            <div className="flex items-start gap-3.5 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-brand-lime/10 border-brand-lime/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-brand-lime" />
              </div>
              <div className="space-y-3.5 w-full">
                <div className="text-xs py-3 px-4.5 rounded-2xl leading-relaxed font-medium bg-zinc-100/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 text-zinc-700 dark:text-zinc-300 rounded-tl-none">
                  {streamingText}
                </div>
                {/* Streaming custom cards */}
                {streamingPlan && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
                    <div className="glass-card p-3.5 rounded-xl border border-brand-lime/25 dark:border-brand-lime/15">
                      <div className="flex items-center gap-1.5 mb-2 text-brand-lime font-mono text-[9px] font-bold uppercase">
                        <Dumbbell className="w-3.5 h-3.5" /> Workouts
                      </div>
                      <ul className="text-[10px] text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-2.5">
                        {streamingPlan.workout?.map((w: string, idx: number) => <li key={idx}>{w}</li>)}
                      </ul>
                    </div>
                    <div className="glass-card p-3.5 rounded-xl border border-brand-cyan/25 dark:border-brand-cyan/15">
                      <div className="flex items-center gap-1.5 mb-2 text-brand-cyan font-mono text-[9px] font-bold uppercase">
                        <Utensils className="w-3.5 h-3.5" /> Nutrition
                      </div>
                      <ul className="text-[10px] text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-2.5">
                        {streamingPlan.meals?.map((m: string, idx: number) => <li key={idx}>{m}</li>)}
                      </ul>
                    </div>
                    <div className="glass-card p-3.5 rounded-xl border border-pink-500/25 dark:border-pink-500/15">
                      <div className="flex items-center gap-1.5 mb-2 text-pink-500 dark:text-pink-400 font-mono text-[9px] font-bold uppercase">
                        <Flag className="w-3.5 h-3.5" /> Milestones
                      </div>
                      <ul className="text-[10px] text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-2.5">
                        {streamingPlan.milestones?.map((mil: string, idx: number) => <li key={idx}>{mil}</li>)}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Typing thinking indicator bubble */}
          {isTyping && (
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-brand-lime" />
              </div>
              <div className="bg-zinc-100/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 py-3 px-4.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-brand-lime/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-brand-lime/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-brand-lime/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Recording pulse visualizer display */}
        <AnimatePresence>
          {isRecording && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border-t border-red-500/20 px-6 py-4 flex items-center justify-between"
            >
              <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Transcribing Voice Feed...
              </span>
              <div className="flex items-center gap-1 h-6 shrink-0">
                {recordingPulse.map((val, idx) => (
                  <div 
                    key={idx} 
                    className="w-1 bg-red-400 rounded-full transition-all duration-150" 
                    style={{ height: `${val}%` }} 
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input box & Quick triggers */}
        <div className="bg-zinc-100/20 dark:bg-zinc-950/60 p-4.5 border-t border-black/5 dark:border-white/5 space-y-3">
          
          {/* Quick Prompts options */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSend("Review my workout routines and suggest intensity variations.")}
              className="text-[10px] font-bold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
            >
              <Dumbbell className="w-3.5 h-3.5 text-brand-lime" /> Review Workouts
            </button>
            
            <button
              onClick={() => handleSend("Create a marathon conditioning plan matching a 2200 calorie goal.")}
              className="text-[10px] font-bold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
            >
              <Flag className="w-3.5 h-3.5 text-pink-400" /> Create marathon plan
            </button>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }} 
            className="flex items-center gap-3 relative"
          >
            <input
              type="text"
              placeholder="Ask coach for nutritional offsets or calorie goals..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-2xl pl-4 pr-12 py-3.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-brand-lime/30 focus:bg-white dark:focus:bg-zinc-900"
              disabled={isTyping || !!streamingMessageId}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping || !!streamingMessageId}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-brand-lime hover:opacity-95 flex items-center justify-center text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}

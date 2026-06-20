'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Terminal, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceConsoleProps {
  onCommand: (commandType: string, value?: any) => void;
  selectedMuscle: string | null;
  theme: 'dark' | 'light';
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export default function VoiceConsole({ onCommand, selectedMuscle, theme }: VoiceConsoleProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'AURA_VOICE: Neural parser online.',
    'AURA_VOICE: Standby. Ready for biometric commands.'
  ]);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check speech support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setConsoleLogs(prev => [...prev, 'AURA_VOICE_ERROR: Web SpeechRecognition not supported in this browser.']);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setConsoleLogs(prev => [...prev, 'SYS_MIC: Recording audio feed...']);
    };

    rec.onend = () => {
      setIsListening(false);
      setConsoleLogs(prev => [...prev, 'SYS_MIC: Audio feed closed.']);
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setConsoleLogs(prev => [...prev, `SYS_MIC_ERROR: ${event.error}`]);
    };

    rec.onresult = (event: SpeechRecognitionEvent) => {
      const resultText = event.results[0][0].transcript || '';
      setTranscript(resultText);
      setConsoleLogs(prev => [...prev, `AUDIO_INPUT: "${resultText}"`]);
      processVoiceCommand(resultText);
    };

    recognitionRef.current = rec;
  }, []);

  // Forgiving voice parsing matching user requests and common mishearings
  const processVoiceCommand = (text: string) => {
    const query = text.toLowerCase().trim();
    
    // 1. Muscle Group Selection Matches (forgiving and phonetic)
    if (
      query.includes('chest') || 
      query.includes('chess') || 
      query.includes('chase') || 
      query.includes('chester')
    ) {
      onCommand('select-muscle', 'chest');
      setConsoleLogs(prev => [...prev, 'EXE: Selecting chest muscle group nodes...']);
      return;
    }
    
    if (
      query.includes('back') || 
      query.includes('bag') || 
      query.includes('beck') || 
      query.includes('spine')
    ) {
      onCommand('select-muscle', 'back');
      setConsoleLogs(prev => [...prev, 'EXE: Selecting back muscle group nodes...']);
      return;
    }
    
    if (
      query.includes('legs') || 
      query.includes('leg') || 
      query.includes('thigh') || 
      query.includes('thighs') || 
      query.includes('calf') || 
      query.includes('calves') ||
      query.includes('quad') ||
      query.includes('quads') ||
      query.includes('hamstring') ||
      query.includes('hamstrings') ||
      query.includes('lake') || 
      query.includes('like')
    ) {
      onCommand('select-muscle', 'legs');
      setConsoleLogs(prev => [...prev, 'EXE: Selecting legs muscle group nodes...']);
      return;
    }
    
    if (
      query.includes('shoulder') || 
      query.includes('shoulders') || 
      query.includes('soldier') || 
      query.includes('soldiers') || 
      query.includes('trap') ||
      query.includes('traps')
    ) {
      onCommand('select-muscle', 'shoulders');
      setConsoleLogs(prev => [...prev, 'EXE: Selecting shoulders muscle group nodes...']);
      return;
    }
    
    if (
      query.includes('arm') || 
      query.includes('arms') || 
      query.includes('bicep') || 
      query.includes('tricep') || 
      query.includes('biceps') ||
      query.includes('triceps') ||
      query.includes('forearm') || 
      query.includes('forearms') || 
      query.includes('art') ||
      query.includes('alms')
    ) {
      onCommand('select-muscle', 'arms');
      setConsoleLogs(prev => [...prev, 'EXE: Selecting arms muscle group nodes...']);
      return;
    }
    
    if (
      query.includes('abs') || 
      query.includes('core') || 
      query.includes('abdominal') || 
      query.includes('ab') ||
      query.includes('app') ||
      query.includes('apps')
    ) {
      onCommand('select-muscle', 'abs');
      setConsoleLogs(prev => [...prev, 'EXE: Selecting core abdominal nodes...']);
      return;
    }

    // 2. Generate Workouts Matches
    if (
      query.includes('generate') || 
      query.includes('create') || 
      query.includes('build') || 
      query.includes('make') || 
      query.includes('routine') || 
      query.includes('workout') ||
      query.includes('planner')
    ) {
      onCommand('generate-workout');
      setConsoleLogs(prev => [...prev, 'EXE: Compiling workout split logs...']);
      return;
    }

    // 3. Calorie Logging Matches (Digit matching + common textual representations)
    if (
      query.includes('log') || 
      query.includes('add') || 
      query.includes('burn') || 
      query.includes('expend') ||
      query.includes('track')
    ) {
      let amount = 0;
      if (query.includes('one hundred') || query.includes('100')) amount = 100;
      else if (query.includes('two hundred') || query.includes('200')) amount = 200;
      else if (query.includes('three hundred') || query.includes('300')) amount = 300;
      else if (query.includes('four hundred') || query.includes('400')) amount = 400;
      else if (query.includes('five hundred') || query.includes('500')) amount = 500;
      else {
        const numbers = query.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          amount = parseInt(numbers[0], 10);
        }
      }
      
      if (amount > 0) {
        onCommand('log-calories', amount);
        setConsoleLogs(prev => [...prev, `EXE: Registering ${amount} kcal expenditure...`]);
        return;
      }
    }

    // 4. Reset Command Matches
    if (
      query.includes('reset') || 
      query.includes('clear') || 
      query.includes('remove') ||
      query.includes('delete')
    ) {
      onCommand('reset');
      setConsoleLogs(prev => [...prev, 'EXE: Resetting active parameters.']);
      return;
    }

    // Fallback unrecognized command log
    setConsoleLogs(prev => [...prev, 'AURA_VOICE: Unrecognized command. Match failed.']);
  };

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-zinc-950 text-zinc-200 border border-white/5 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between h-full font-mono shadow-xl text-left">
      {/* Decorative corners */}
      <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-white/20" />

      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-lime" />
          <span className="text-[10px] font-bold tracking-wider text-brand-lime">VOICE PARSING CONSOLE</span>
        </div>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
        </div>
      </div>

      {/* Terminal logs list */}
      <div className="flex-1 bg-black/40 border border-white/5 p-3.5 rounded-2xl min-h-[140px] max-h-[180px] overflow-y-auto space-y-1.5 text-[10px] text-zinc-450 custom-scrollbar mb-4">
        {consoleLogs.map((log, i) => (
          <div 
            key={i} 
            className={`${
              log.includes('EXE:') 
                ? 'text-brand-lime' 
                : log.includes('ERROR:') 
                  ? 'text-red-400' 
                  : log.includes('AUDIO_INPUT:') 
                    ? 'text-brand-cyan' 
                    : 'text-zinc-400'
            }`}
          >
            {log}
          </div>
        ))}
      </div>

      {/* Micro Voice Wave Indicator */}
      <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/5">
        
        {/* Toggle Listening Mic Button */}
        <button
          onClick={toggleListening}
          disabled={!speechSupported}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 relative group cursor-pointer shrink-0 ${
            isListening
              ? 'bg-red-500/10 border-red-500 text-red-400 shadow-lg shadow-red-500/10'
              : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-brand-lime hover:text-brand-lime'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
          title={isListening ? "Stop listening" : "Click to Speak"}
        >
          {isListening ? (
            <>
              <Mic className="w-5.5 h-5.5 animate-pulse" />
              {/* Glowing ring ripples */}
              <span className="absolute inset-0 rounded-2xl border border-red-500 animate-ping opacity-60 pointer-events-none" />
            </>
          ) : (
            <Mic className="w-5.5 h-5.5" />
          )}
        </button>

        {/* Dynamic speech info or suggestions feed */}
        <div className="flex-1 text-left">
          {isListening ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Listening...
              </span>
            </div>
          ) : (
            <div className="space-y-0.5">
              <span className="text-[8.5px] text-zinc-550 font-bold uppercase tracking-wider block">SUPPORTED COMMANDS</span>
              <span className="text-[9px] text-zinc-450 block truncate">"Select chest" • "Generate workout" • "Log 350 calories"</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

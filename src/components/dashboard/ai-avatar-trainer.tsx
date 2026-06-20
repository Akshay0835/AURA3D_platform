'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Bot, Volume2, VolumeX } from 'lucide-react';

interface AIAvatarTrainerProps {
  message: string;
  isSpeaking: boolean;
  onStartSpeaking: () => void;
  onEndSpeaking: () => void;
  theme: 'dark' | 'light';
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
}

function FloatingBot({ isSpeaking, theme }: { isSpeaking: boolean; theme: 'dark' | 'light' }) {
  const botRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const orbWireRef = useRef<THREE.Mesh>(null);
  const eyeRef = useRef<THREE.Mesh>(null);
  
  // Satellites references
  const sat1Ref = useRef<THREE.Mesh>(null);
  const sat2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    // 1. Floating breathing motion
    if (botRef.current) {
      botRef.current.position.y = Math.sin(elapsed * 1.6) * 0.08;
      botRef.current.rotation.y = elapsed * 0.35;
    }
    
    // 2. Local orb micro-rotations
    if (orbRef.current) {
      orbRef.current.rotation.x = Math.sin(elapsed * 0.8) * 0.08;
      orbRef.current.rotation.z = Math.cos(elapsed * 1.2) * 0.08;
    }
    if (orbWireRef.current) {
      orbWireRef.current.rotation.x = Math.sin(elapsed * 0.8) * 0.08;
      orbWireRef.current.rotation.z = Math.cos(elapsed * 1.2) * 0.08;
    }

    // 3. Eye ring pulsing
    if (eyeRef.current) {
      // Pulse much faster if speaking
      const pulseSpeed = isSpeaking ? 16 : 4;
      const baseEmissive = isSpeaking ? 2.5 : 1.2;
      const intensity = baseEmissive + Math.sin(elapsed * pulseSpeed) * 0.6;
      (eyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }

    // 4. Orbiting satellite telemetry nodes
    if (sat1Ref.current) {
      sat1Ref.current.position.x = 0.5 * Math.cos(elapsed * 2.2);
      sat1Ref.current.position.z = 0.5 * Math.sin(elapsed * 2.2);
      sat1Ref.current.position.y = 0.15 * Math.cos(elapsed * 1.1);
    }
    if (sat2Ref.current) {
      sat2Ref.current.position.x = 0.55 * Math.cos(elapsed * -1.8 + Math.PI);
      sat2Ref.current.position.z = 0.55 * Math.sin(elapsed * -1.8 + Math.PI);
      sat2Ref.current.position.y = 0.2 * Math.sin(elapsed * 1.4);
    }
  });

  const satColor = theme === 'dark' ? '#06b6d4' : '#0ea5e9';
  const botColor = theme === 'dark' ? '#3f3f46' : '#e4e4e7';
  const eyeColor = isSpeaking ? '#ec4899' : '#ccff00'; // pink glow while speaking, lime while idle

  return (
    <group ref={botRef}>
      {/* Bot Central Frame Core */}
      <mesh ref={orbRef}>
        <dodecahedronGeometry args={[0.24, 1]} />
        <meshStandardMaterial 
          color={botColor}
          emissive={theme === 'dark' ? '#27272a' : '#eaeaea'}
          emissiveIntensity={0.6}
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* Futuristic Wireframe Shell Overlay */}
      <mesh ref={orbWireRef}>
        <dodecahedronGeometry args={[0.245, 1]} />
        <meshBasicMaterial 
          color={isSpeaking ? '#ec4899' : '#06b6d4'} 
          wireframe 
          transparent 
          opacity={0.45} 
        />
      </mesh>

      {/* Cyber Visor Eye Ring */}
      <mesh ref={eyeRef} position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.20, 0.026, 8, 24]} />
        <meshStandardMaterial 
          color={eyeColor}
          emissive={eyeColor}
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Glowing Inner Pupil Core */}
      <mesh position={[0, 0, 0.12]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={eyeColor} />
      </mesh>
      
      {/* Outer sensor bracket (Hologram look) */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.34, 0.008, 6, 32]} />
        <meshBasicMaterial color={theme === 'dark' ? '#ccff00' : '#84cc16'} transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.32, 0.006, 6, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
      </mesh>

      {/* Satellite 1 Orbit Path Tracker Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.002, 8, 48]} />
        <meshBasicMaterial color={satColor} transparent opacity={0.15} />
      </mesh>

      {/* Satellite 2 Orbit Path Tracker Ring */}
      <mesh rotation={[Math.PI / 2.5, 0.4, 0]}>
        <torusGeometry args={[0.55, 0.0015, 8, 48]} />
        <meshBasicMaterial color="#ff7a00" transparent opacity={0.12} />
      </mesh>

      {/* Orbiting Satellite 1 */}
      <mesh ref={sat1Ref}>
        <octahedronGeometry args={[0.045]} />
        <meshStandardMaterial 
          color={satColor} 
          emissive={satColor} 
          emissiveIntensity={1.5}
          roughness={0.1} 
          metalness={0.9} 
        />
      </mesh>

      {/* Orbiting Satellite 2 */}
      <mesh ref={sat2Ref}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial 
          color="#ff7a00" 
          emissive="#ff7a00" 
          emissiveIntensity={1.2}
          roughness={0.2} 
        />
      </mesh>
    </group>
  );
}

export default function AIAvatarTrainer({
  message,
  isSpeaking,
  onStartSpeaking,
  onEndSpeaking,
  theme,
  voiceEnabled,
  setVoiceEnabled
}: AIAvatarTrainerProps) {
  
  // Trigger speech synthesis when message updates and voice option is checked
  useEffect(() => {
    if (!message || typeof window === 'undefined' || !voiceEnabled) return;

    const synth = window.speechSynthesis;
    if (!synth) return;

    // Interrupt previous speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    
    // Select a pleasant English voice if loaded
    const voices = synth.getVoices();
    const premiumVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
    );
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    utterance.rate = 1.05; // slightly fast and crisp
    utterance.pitch = 1.0;
    
    utterance.onstart = () => {
      onStartSpeaking();
    };

    utterance.onend = () => {
      onEndSpeaking();
    };

    utterance.onerror = () => {
      onEndSpeaking();
    };

    synth.speak(utterance);

    return () => {
      synth.cancel();
    };
  }, [message, voiceEnabled]);

  return (
    <div className="flex flex-col items-center p-4 bg-white/40 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5 rounded-3xl relative overflow-hidden h-full justify-between shadow-sm">
      {/* 3D Canvas Bot Frame */}
      <div className="w-full h-40 relative">
        <Canvas camera={{ position: [0, 0, 1.15], fov: 45 }}>
          <ambientLight intensity={theme === 'dark' ? 0.75 : 0.95} />
          <directionalLight position={[1, 2, 2]} intensity={1.8} />
          <directionalLight position={[-1, -1, 1]} intensity={0.6} color="#06b6d4" />
          
          <FloatingBot isSpeaking={isSpeaking} theme={theme} />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minPolarAngle={Math.PI / 2 - 0.2}
          />
        </Canvas>

        {/* Floating Voice Switch */}
        <button
          onClick={() => {
            if (voiceEnabled) {
              window.speechSynthesis?.cancel();
              onEndSpeaking();
            }
            setVoiceEnabled(!voiceEnabled);
          }}
          className={`absolute top-2 right-2 p-2 rounded-xl border transition-all duration-300 shadow-sm cursor-pointer ${
            voiceEnabled 
              ? 'bg-brand-lime/10 border-brand-lime/30 text-lime-750 dark:text-brand-lime' 
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-black/5 dark:border-white/5 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
          title={voiceEnabled ? "Mute Coach Voice" : "Enable Coach Voice"}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Technical branding */}
        <div className="absolute top-2 left-2 pointer-events-none font-mono text-[8px] text-zinc-450 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5 text-brand-lime" />
          <span>AURA_COACH_V4</span>
        </div>
      </div>

      {/* Message Balloon */}
      <div className="w-full bg-zinc-50/60 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 p-4 rounded-2xl text-left relative mt-2 flex-1 flex flex-col justify-center">
        {/* Balloon notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[6px] w-3 h-3 bg-zinc-50 dark:bg-zinc-950 border-t border-l border-black/5 dark:border-white/5 rotate-45" />
        
        <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}

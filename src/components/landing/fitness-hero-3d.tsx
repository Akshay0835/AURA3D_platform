'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html, useGLTF, useAnimations } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Flame, HeartPulse, Droplet, Dumbbell, Activity } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

// Rigged Humanoid Model performing realistic running kinetics
function AnimatedHumanoid({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  
  // Load both Ybot (male mesh) and Xbot (animated female source)
  const { scene: ybotScene } = useGLTF('/Ybot.glb');
  const { scene: xbotScene, animations: rawAnimations } = useGLTF('/Xbot.glb');

  // Retarget animations from Xbot skeleton to Ybot skeleton programmatically
  const animations = useMemo(() => {
    if (!rawAnimations || rawAnimations.length === 0) return [];
    
    let targetMesh: THREE.SkinnedMesh | null = null;
    let sourceMesh: THREE.SkinnedMesh | null = null;
    
    ybotScene.traverse((child) => {
      if ((child as any).isSkinnedMesh) {
        targetMesh = child as THREE.SkinnedMesh;
      }
    });
    
    xbotScene.traverse((child) => {
      if ((child as any).isSkinnedMesh) {
        sourceMesh = child as THREE.SkinnedMesh;
      }
    });
    
    if (!targetMesh || !sourceMesh) {
      console.warn('Retargeting skipped: SkinnedMesh not found in Ybot or Xbot');
      return rawAnimations;
    }
    
    return rawAnimations.map((clip) => {
      try {
        const targetBones = targetMesh!.skeleton?.bones || [];
        const hipBone = targetBones.find(b => b.name.includes('Hips'));
        const hipName = hipBone ? hipBone.name : 'mixamorigHips';
        
        const retargeted = SkeletonUtils.retargetClip(targetMesh!, sourceMesh!, clip, {
          preserveHipPosition: true,
          hip: hipName
        });
        
        // Rename tracks from ".bones[mixamorigBoneName].property" to "mixamorig:BoneName.property"
        // This allows AnimationMixer to bind to bones as normal child nodes in the group hierarchy
        retargeted.tracks.forEach((track) => {
          const match = track.name.match(/\.bones\[([^\]]+)\]\.(.+)/);
          if (match) {
            const sanitizedBoneName = match[1]; // e.g. "mixamorigHips"
            const property = match[2]; // e.g. "quaternion" or "position"
            
            // Match the sanitized bone name with the original name from targetMesh skeleton (which contains colons)
            const originalBone = targetBones.find(b => b.name.replace(/:/g, '') === sanitizedBoneName);
            if (originalBone) {
              track.name = `${originalBone.name}.${property}`; // e.g. "mixamorig:Hips.quaternion"
            } else {
              track.name = `${sanitizedBoneName}.${property}`;
            }
          }
        });
        
        return retargeted;
      } catch (err) {
        console.error('Error retargeting animation clip:', err);
        return clip;
      }
    });
  }, [ybotScene, xbotScene, rawAnimations]);

  const { actions } = useAnimations(animations, group);

  // Apply custom solid clay sculpture material to all parts of the mannequin mesh
  useMemo(() => {
    ybotScene.traverse((child) => {
      if ((child as any).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material = new THREE.MeshStandardMaterial({
          color: '#f4f4f5', // Plaster/clay white color (zinc-100)
          roughness: 0.55,  // Slightly polished clay texture to catch muscular highlights
          metalness: 0.0,   // Non-metallic organic plaster sculpture texture
          transparent: false,
          wireframe: false,
        });
      }
    });
  }, [ybotScene]);

  useEffect(() => {
    // Mixamo animation clips can be named 'run', 'Walk', or other strings case-insensitively
    const keys = Object.keys(actions);
    const runKey = keys.find(k => k.toLowerCase().includes('run')) || keys[0];
    const runAction = runKey ? actions[runKey] : null;
    
    if (runAction) {
      runAction.reset().fadeIn(0.5).play();
    }
    return () => {
      if (runAction) runAction.fadeOut(0.5);
    };
  }, [actions]);

  // Slowly rotate the skeleton on Y axis so the user can see anatomical details from all angles (turntable showcase)
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.PI + 0.5 + elapsed * 0.15;
    }
  });

  return (
    <group ref={group} dispose={null} scale={1.15} position={[0, -0.8, 0]} rotation={[0, Math.PI + 0.5, 0]}>
      <primitive object={ybotScene} />
    </group>
  );
}

// Helper to generate a knurling normal bump texture dynamically
function useKnurlTexture() {
  return useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Gray background (neutral height for bump mapping)
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 128, 64);
      
      // Draw crosshatch grid lines
      ctx.strokeStyle = '#c0c0c0';
      ctx.lineWidth = 1.0;
      for (let i = -128; i < 128; i += 6) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 64, 64);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(i + 128, 0);
        ctx.lineTo(i, 64);
        ctx.stroke();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 1);
    return texture;
  }, []);
}

// Dumbbell rendering primitives (realistic hexagonal plates and knurled steel handle)
function DumbbellMesh({ color }: { color: string }) {
  const knurlTexture = useKnurlTexture();
  
  return (
    <group>
      {/* Knurled Handle - Silver steel cylinder with knurling bump mapping */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.024, 0.024, 0.44, 16]} />
        <meshStandardMaterial 
          color="#a1a1aa" 
          metalness={0.95} 
          roughness={0.12} 
          bumpMap={knurlTexture || undefined} 
          bumpScale={0.003} 
        />
      </mesh>
      
      {/* Left Hex Weight Body */}
      <mesh position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, 0.09, 6]} />
        <meshStandardMaterial color="#18181b" roughness={0.65} metalness={0.2} />
      </mesh>
      {/* Left Inner Collar - Steel ring */}
      <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Left Outer Cap & Logo Accent (Glowing Neon Plate) */}
      <mesh position={[-0.222, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.10, 0.10, 0.01, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Right Hex Weight Body */}
      <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, 0.09, 6]} />
        <meshStandardMaterial color="#18181b" roughness={0.65} metalness={0.2} />
      </mesh>
      {/* Right Inner Collar - Steel ring */}
      <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Right Outer Cap & Logo Accent (Glowing Neon Plate) */}
      <mesh position={[0.222, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.10, 0.10, 0.01, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Protein Shaker rendering primitives (translucent cup with fluid, lid, loop, and wire ball)
function ProteinShakerMesh({ color }: { color: string }) {
  return (
    <group>
      {/* Translucent Cup Body (MeshPhysicalMaterial with transmission) */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.11, 0.09, 0.38, 24]} />
        <meshPhysicalMaterial 
          color="#f1f5f9"
          roughness={0.15}
          transmission={0.65}
          thickness={0.18}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Fluid Inside (glowing cyber fluid cylinder) */}
      <mesh position={[0, -0.11, 0]}>
        <cylinderGeometry args={[0.10, 0.082, 0.24, 24]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.35} 
          transparent 
          opacity={0.75} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* ML measurement gauge marks (3 lines printed vertically) */}
      <group position={[0, 0, 0.102]}>
        <mesh position={[0, -0.16, 0]}>
          <boxGeometry args={[0.02, 0.003, 0.002]} />
          <meshBasicMaterial color="#d4d4d8" />
        </mesh>
        <mesh position={[0, -0.10, 0]}>
          <boxGeometry args={[0.02, 0.003, 0.002]} />
          <meshBasicMaterial color="#d4d4d8" />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[0.02, 0.003, 0.002]} />
          <meshBasicMaterial color="#d4d4d8" />
        </mesh>
      </group>

      {/* Matte Black Plastic Screw Lid Base */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.118, 0.118, 0.04, 24]} />
        <meshStandardMaterial color="#27272a" roughness={0.35} metalness={0.4} />
      </mesh>
      
      {/* Slanted Shaker Lid Upper Dome */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.118, 0.09, 0.05, 24]} />
        <meshStandardMaterial color="#18181b" roughness={0.35} metalness={0.4} />
      </mesh>

      {/* Drinking Spout - Offset to the front-right */}
      <mesh position={[0.05, 0.22, 0.03]}>
        <cylinderGeometry args={[0.025, 0.025, 0.04, 16]} />
        <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Colored Loop Carrying Handle on the lid */}
      <mesh position={[-0.04, 0.22, -0.04]} rotation={[0.4, 0.6, 0.3]}>
        <torusGeometry args={[0.045, 0.012, 10, 24, Math.PI * 1.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.2} />
      </mesh>

      {/* Wire Mixing Whisk Ball resting at the base of the bottle */}
      <mesh position={[0.02, -0.21, 0.01]} rotation={[0.5, 0.2, 0.8]}>
        <torusKnotGeometry args={[0.05, 0.009, 32, 4, 3, 5]} />
        <meshStandardMaterial color="#f4f4f5" metalness={0.95} roughness={0.05} />
      </mesh>
    </group>
  );
}

// Animated concentric track loop with trailing lasers and gauge scale marks
function TrackWithLaser({ radius, color, speed = 1.0 }: { radius: number; color: string; speed?: number }) {
  // Consolidate refs into a single useRef hook to maintain hook signature stability across hot-reloads
  const trackRefs = useRef<{
    dots: (THREE.Mesh | null)[];
    trackGroup: THREE.Group | null;
  }>({
    dots: [],
    trackGroup: null
  });
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    
    // Rotate ticks slowly in reverse direction for mechanical dial alignment telemetry
    if (trackRefs.current.trackGroup) {
      trackRefs.current.trackGroup.rotation.y = -t * 0.035;
    }
    
    // Lead laser particle
    if (trackRefs.current.dots[0]) {
      trackRefs.current.dots[0].position.x = radius * Math.cos(t);
      trackRefs.current.dots[0].position.z = radius * Math.sin(t);
    }
    // Middle trailing laser particle
    if (trackRefs.current.dots[1]) {
      const t2 = t - 0.08;
      trackRefs.current.dots[1].position.x = radius * Math.cos(t2);
      trackRefs.current.dots[1].position.z = radius * Math.sin(t2);
    }
    // Tail trailing laser particle
    if (trackRefs.current.dots[2]) {
      const t3 = t - 0.16;
      trackRefs.current.dots[2].position.x = radius * Math.cos(t3);
      trackRefs.current.dots[2].position.z = radius * Math.sin(t3);
    }
  });

  // Procedurally generate 32 indicator scale ticks rotated in a circle
  const tickElements = useMemo(() => {
    const numTicks = 32;
    const ticks = [];
    for (let i = 0; i < numTicks; i++) {
      const angle = (i / numTicks) * Math.PI * 2;
      ticks.push(
        <mesh 
          key={i} 
          position={[radius * Math.cos(angle), -0.8, radius * Math.sin(angle)]} 
          rotation={[0, -angle, 0]}
        >
          <boxGeometry args={[0.024, 0.003, 0.006]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} />
        </mesh>
      );
    }
    return ticks;
  }, [radius, color]);

  return (
    <group>
      <group ref={(el) => { trackRefs.current.trackGroup = el; }}>
        {/* Primary Track ring loop */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
          <ringGeometry args={[radius - 0.006, radius + 0.006, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.16} />
        </mesh>

        {/* Secondary concentric inner offset loop */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
          <ringGeometry args={[radius - 0.035, radius - 0.033, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.06} />
        </mesh>

        {/* Gauge ticks */}
        {tickElements}
      </group>

      {/* Trailing Laser Particles (Streak effect) */}
      {/* 1. Lead Dot */}
      <mesh ref={(el) => { trackRefs.current.dots[0] = el; }} position={[radius, -0.8, 0]}>
        <sphereGeometry args={[0.040, 10, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.0} />
      </mesh>
      {/* 2. Middle Dot */}
      <mesh ref={(el) => { trackRefs.current.dots[1] = el; }} position={[radius, -0.8, 0]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} transparent opacity={0.6} />
      </mesh>
      {/* 3. Tail Dot */}
      <mesh ref={(el) => { trackRefs.current.dots[2] = el; }} position={[radius, -0.8, 0]}>
        <sphereGeometry args={[0.016, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Animated Dumbbell bobbing, spinning, and orbiting concentric tracks
function AnimatedDumbbell({ 
  orbitRadius, 
  orbitSpeed, 
  baseHeight, 
  color, 
  theme, 
  startOffset = 0, 
  labelType,
  bobSpeed = 0.5,
  bobAmp = 0.12
}: { 
  orbitRadius: number; 
  orbitSpeed: number; 
  baseHeight: number; 
  color: string; 
  theme: string; 
  startOffset?: number; 
  labelType?: string;
  bobSpeed?: number;
  bobAmp?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + startOffset;
    const angle = t * orbitSpeed;
    if (ref.current) {
      ref.current.position.x = orbitRadius * Math.cos(angle);
      ref.current.position.z = orbitRadius * Math.sin(angle);
      ref.current.position.y = baseHeight + Math.sin(t * bobSpeed) * bobAmp;
      
      ref.current.rotation.x = t * 0.2;
      ref.current.rotation.y = t * 0.15;
      ref.current.rotation.z = t * 0.08;
    }
  });

  return (
    <group ref={ref}>
      <DumbbellMesh color={color} />
      {labelType === 'calories' && (
        <Html position={[0, 0.35, 0]} center distanceFactor={6.5}>
          <div className={`px-2.5 py-1.5 rounded-xl border backdrop-blur-md font-mono text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap shadow-xl transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-zinc-950/80 border-brand-lime/20 text-brand-lime shadow-brand-lime/5' 
              : 'bg-white/80 border-zinc-200 text-zinc-900 shadow-zinc-200/40'
          }`}>
            <Flame className="w-3.5 h-3.5 animate-pulse text-brand-lime" />
            <span>CALORIES: 750 kcal</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// Animated Protein Shaker tilting, bobbing, and orbiting
function AnimatedShaker({ 
  orbitRadius, 
  orbitSpeed, 
  baseHeight, 
  color, 
  startOffset = 0,
  bobSpeed = 0.6,
  bobAmp = 0.08
}: { 
  orbitRadius: number; 
  orbitSpeed: number; 
  baseHeight: number; 
  color: string; 
  startOffset?: number;
  bobSpeed?: number;
  bobAmp?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + startOffset;
    const angle = t * orbitSpeed;
    if (ref.current) {
      ref.current.position.x = orbitRadius * Math.cos(angle);
      ref.current.position.z = orbitRadius * Math.sin(angle);
      ref.current.position.y = baseHeight + Math.cos(t * bobSpeed) * bobAmp;
      
      ref.current.rotation.x = Math.sin(t * 0.5) * 0.04;
      ref.current.rotation.y = t * 0.18;
      ref.current.rotation.z = Math.cos(t * 0.4) * 0.02;
    }
  });

  return (
    <group ref={ref}>
      <ProteinShakerMesh color={color} />
    </group>
  );
}

// Segmented visualizer column component for AnimatedCharts
function VisualizerColumn({ x, activeCount, color, secColor }: { x: number; activeCount: number; color: string; secColor: string }) {
  const segments = [];
  const baseHeight = -0.15;
  const gap = 0.065; // vertical gap between segments
  
  for (let i = 0; i < 5; i++) {
    const isLit = i < activeCount;
    // Blend color from prime color to secondary color as we go up
    const segmentColor = i >= 3 ? secColor : color;
    
    segments.push(
      <mesh key={i} position={[x, baseHeight + i * gap, 0]}>
        <boxGeometry args={[0.045, 0.04, 0.045]} />
        <meshStandardMaterial 
          color={isLit ? segmentColor : '#27272a'} 
          emissive={isLit ? segmentColor : '#000000'} 
          emissiveIntensity={isLit ? 0.9 : 0.0} 
          transparent 
          opacity={isLit ? 0.8 : 0.25} 
          roughness={isLit ? 0.15 : 0.6} 
          metalness={isLit ? 0.8 : 0.1} 
        />
      </mesh>
    );
  }
  return <group>{segments}</group>;
}

// Upgraded Animated 3D Holographic Telemetry Segmented Spectrum Chart
function AnimatedCharts({ position, color, secColor, theme }: { position: [number, number, number]; color: string; secColor: string; theme: string }) {
  const ref = useRef<THREE.Group>(null);
  // 5 visualizer columns. Store counts of lit segments (0 to 5)
  const [activeCounts, setActiveCounts] = useState([2, 4, 1, 3, 2]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth organic microgravity drift and rotation sway (slowed down for premium feel)
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(t * 0.2) * 0.06;
      ref.current.position.z = position[2] + Math.cos(t * 0.15) * 0.06;
      ref.current.position.y = position[1] + Math.sin(t * 0.3) * 0.05;
      
      ref.current.rotation.y = Math.sin(t * 0.1) * 0.08 - 0.25;
      ref.current.rotation.x = Math.cos(t * 0.12) * 0.05;
    }

    // Dynamically calculate segment counts using sine waves (slowed down for smooth transitions)
    setActiveCounts([
      Math.floor(2.5 + Math.sin(t * 0.8) * 2.2),
      Math.floor(2.5 + Math.cos(t * 0.55) * 2.2),
      Math.floor(2.5 + Math.sin(t * 1.1) * 1.8),
      Math.floor(2.5 + Math.cos(t * 0.75) * 2.2),
      Math.floor(2.5 + Math.sin(t * 0.9) * 2.0)
    ]);
  });

  return (
    <group ref={ref} position={position}>
      {/* Futuristic Translucent Dark Grid Backing Board */}
      <mesh position={[0, -0.02, -0.04]}>
        <boxGeometry args={[0.62, 0.38, 0.015]} />
        <meshPhysicalMaterial 
          color="#09090b" 
          roughness={0.25} 
          transmission={0.4} 
          thickness={0.05}
          transparent 
          opacity={0.7} 
        />
      </mesh>

      {/* Grid Border frame */}
      <mesh position={[0, -0.02, -0.04]}>
        <boxGeometry args={[0.63, 0.39, 0.02]} />
        <meshStandardMaterial 
          color="#3f3f46" 
          wireframe
          transparent 
          opacity={0.3} 
        />
      </mesh>

      {/* Horizontal glowing metric threshold limit line (target threshold) */}
      <mesh position={[0, 0.08, -0.03]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.56, 0.004, 0.004]} />
        <meshBasicMaterial color={secColor} transparent opacity={0.65} />
      </mesh>

      {/* 5 Segmented Columns */}
      <VisualizerColumn x={-0.20} activeCount={activeCounts[0]} color={color} secColor={secColor} />
      <VisualizerColumn x={-0.10} activeCount={activeCounts[1]} color={color} secColor={secColor} />
      <VisualizerColumn x={0} activeCount={activeCounts[2]} color={color} secColor={secColor} />
      <VisualizerColumn x={0.10} activeCount={activeCounts[3]} color={color} secColor={secColor} />
      <VisualizerColumn x={0.20} activeCount={activeCounts[4]} color={color} secColor={secColor} />

      {/* HTML Telemetry Tag: Hydration */}
      <Html position={[0, 0.35, 0]} center distanceFactor={6.5}>
        <div className={`px-2.5 py-1.5 rounded-xl border backdrop-blur-md font-mono text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap shadow-xl transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-zinc-950/80 border-brand-cyan/20 text-brand-cyan shadow-brand-cyan/5' 
            : 'bg-white/80 border-zinc-200 text-zinc-900 shadow-zinc-200/40'
        }`}>
          <Droplet className="w-3.5 h-3.5 animate-pulse text-brand-cyan" />
          <span>HYDRATION: 1250 ml</span>
        </div>
      </Html>
    </group>
  );
}

// Auto-rotating parent loop
function RotatingEcosystem({ theme, isMobile }: { theme: 'dark' | 'light'; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const colorPrime = theme === 'dark' ? '#ccff00' : '#0ea5e9';
  const colorSecond = theme === 'dark' ? '#06b6d4' : '#6366f1';
  
  // Custom vibrant contrast colors for dumbbells (electric orange and cyber pink)
  const colorDumbbell1 = theme === 'dark' ? '#ff7a00' : '#ea580c';
  const colorDumbbell2 = theme === 'dark' ? '#ec4899' : '#db2777';

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Elegant base rotation to coordinate system (slowed down for high-end aesthetic)
      groupRef.current.rotation.y = elapsed * 0.005;
      // Extremely gentle overall vertical breathing motion
      groupRef.current.position.y = Math.sin(elapsed * 0.12) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={isMobile ? [0, -0.25, -0.3] : [0.85, -0.1, 0]}>
      {/* Concentric Running Tracks with circular traveling lasers (slowed down) */}
      <TrackWithLaser radius={2.4} color={colorPrime} speed={0.4} />
      <TrackWithLaser radius={2.7} color={colorSecond} speed={0.25} />
      <TrackWithLaser radius={3.0} color={colorPrime} speed={0.3} />

      {/* Centered running mannequin skeleton */}
      <AnimatedHumanoid color={colorPrime} />

      {/* Floating spinning dumbbell (Inner track orbit, clockwise, slowed) */}
      <AnimatedDumbbell 
        orbitRadius={2.2} 
        orbitSpeed={0.08} 
        baseHeight={0.35} 
        color={colorDumbbell1} 
        theme={theme} 
        startOffset={0.0} 
        labelType="calories" 
      />

      {/* Floating spinning dumbbell (Outer track orbit, counter-clockwise, slowed) */}
      <AnimatedDumbbell 
        orbitRadius={2.85} 
        orbitSpeed={-0.06} 
        baseHeight={-0.15} 
        color={colorDumbbell2} 
        theme={theme} 
        startOffset={3.2} 
      />

      {/* Floating spinning dumbbell 3 (Middle track orbit, counter-clockwise, slowed) */}
      <AnimatedDumbbell 
        orbitRadius={2.55} 
        orbitSpeed={-0.05} 
        baseHeight={0.5} 
        color={colorDumbbell1} 
        theme={theme} 
        startOffset={Math.PI} 
      />

      {/* Floating spinning dumbbell 4 (Outer track orbit, clockwise, slowed) */}
      <AnimatedDumbbell 
        orbitRadius={3.0} 
        orbitSpeed={0.04} 
        baseHeight={-0.35} 
        color={colorDumbbell2} 
        theme={theme} 
        startOffset={1.0} 
      />

      {/* Floating spinning dumbbell 5 (Inner-Middle track orbit, clockwise, slowed) */}
      <AnimatedDumbbell 
        orbitRadius={2.35} 
        orbitSpeed={0.07} 
        baseHeight={-0.25} 
        color={colorDumbbell1} 
        theme={theme} 
        startOffset={2.0} 
      />

      {/* Floating spinning dumbbell 6 (Middle-Outer track orbit, counter-clockwise, slowed) */}
      <AnimatedDumbbell 
        orbitRadius={2.7} 
        orbitSpeed={-0.045} 
        baseHeight={0.15} 
        color={colorDumbbell2} 
        theme={theme} 
        startOffset={4.5} 
      />

      {/* Floating shaker bottle 1 (Middle track orbit, clockwise, slowed) */}
      <AnimatedShaker 
        orbitRadius={2.55} 
        orbitSpeed={0.05} 
        baseHeight={0.1} 
        color={colorPrime} 
        startOffset={1.6} 
      />

      {/* Floating shaker bottle 2 (Inner track orbit, counter-clockwise, slowed) */}
      <AnimatedShaker 
        orbitRadius={2.2} 
        orbitSpeed={-0.08} 
        baseHeight={-0.1} 
        color={colorSecond} 
        startOffset={2.5} 
      />

      {/* Floating shaker bottle 3 (Outer track orbit, clockwise, slowed) */}
      <AnimatedShaker 
        orbitRadius={2.85} 
        orbitSpeed={0.06} 
        baseHeight={0.25} 
        color={colorPrime} 
        startOffset={4.8} 
      />

      {/* Floating shaker bottle 4 (Extra outer track orbit, counter-clockwise, slowed) */}
      <AnimatedShaker 
        orbitRadius={3.15} 
        orbitSpeed={-0.035} 
        baseHeight={0.4} 
        color={colorSecond} 
        startOffset={0.8} 
      />

      {/* Floating shaker bottle 5 (Inner-Middle track orbit, clockwise, slowed) */}
      <AnimatedShaker 
        orbitRadius={2.45} 
        orbitSpeed={0.055} 
        baseHeight={-0.4} 
        color={colorPrime} 
        startOffset={5.5} 
      />

      {/* Floating bar charts (Front-Right, stationary floating area) */}
      <group scale={isMobile ? 0.75 : 1.0}>
        <AnimatedCharts position={isMobile ? [0, -0.85, 0.25] : [1.5, -0.3, 0.7]} color={colorPrime} secColor={colorSecond} theme={theme} />
      </group>

      {/* Center Heart Rate Floating Badge */}
      <group position={[0, 1.4, 0]}>
        <Html center distanceFactor={6.5}>
          <div className={`px-2.5 py-1.5 rounded-xl border backdrop-blur-md font-mono text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap shadow-xl transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-zinc-950/80 border-pink-500/25 text-pink-400 shadow-pink-500/5' 
              : 'bg-white/80 border-zinc-200 text-zinc-900 shadow-zinc-200/40'
          }`}>
            <HeartPulse className="w-3.5 h-3.5 animate-pulse text-pink-500" />
            <span>HEART RATE: 132 BPM</span>
          </div>
        </Html>
      </group>
    </group>
  );
}

// Camera Mouse Parallax Rig component
function CameraRig({ isMobile }: { isMobile: boolean }) {
  useFrame((state) => {
    // state.pointer has values from -1 to 1 depending on cursor position
    const targetX = state.pointer.x * 0.75;
    const targetY = state.pointer.y * 0.45 + 0.4; // base elevation height of 0.4
    
    // Smoothly interpolate camera translation towards target cursor coordinates
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.045);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.045);
    
    const targetLookAtX = isMobile ? 0.0 : 0.4;
    const targetLookAtY = isMobile ? 0.0 : 0.2;
    state.camera.lookAt(targetLookAtX, targetLookAtY, 0); // frame the centered or offset focal point of the scene
  });
  return null;
}

export default function FitnessHero3D() {
  const theme = useAppStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-radial-[circle_at_center,rgba(9,9,11,0.5)_0%,rgba(0,0,0,1)_100%]' 
          : 'bg-radial-[circle_at_center,rgba(244,244,245,0.4)_0%,rgba(250,250,250,1)_100%]'
      }`} />

      <Canvas 
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [0, 0.4, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={theme === 'dark' ? 0.35 : 0.75} />
        
        {/* White Studio Key Light for realistic muscle shadows & highlights, matching clay sculpture */}
        <directionalLight 
          position={[3, 4, 3]} 
          intensity={theme === 'dark' ? 2.8 : 1.8} 
          color="#ffffff" 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
        />
        
        <pointLight position={[2, 3, 2]} intensity={theme === 'dark' ? 1.2 : 0.6} color={theme === 'dark' ? '#ccff00' : '#0ea5e9'} />
        <pointLight position={[-2, -2, -2]} intensity={theme === 'dark' ? 0.8 : 0.3} color={theme === 'dark' ? '#06b6d4' : '#6366f1'} />
        
        <RotatingEcosystem theme={theme} isMobile={isMobile} />
        <CameraRig isMobile={isMobile} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/Ybot.glb');
useGLTF.preload('/Xbot.glb');

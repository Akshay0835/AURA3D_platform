'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';

function Scene({ theme }: { theme: 'dark' | 'light' }) {
  const groupRef = useRef<THREE.Group>(null);
  const rungsRefs = useRef<(THREE.Group | null)[]>([]);
  
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const trail1Ref = useRef<THREE.Points>(null);
  const trail2Ref = useRef<THREE.Points>(null);
  const ecgRef = useRef<THREE.Points>(null);
  
  const colors = useMemo(() => ({
    lime: theme === 'dark' ? '#a3e635' : '#84cc16',
    limeEmissive: theme === 'dark' ? '#84cc16' : '#a3e635',
    cyan: theme === 'dark' ? '#06b6d4' : '#0ea5e9',
    cyanEmissive: theme === 'dark' ? '#0891b2' : '#38bdf8',
    pink: theme === 'dark' ? '#ec4899' : '#f43f5e',
    rung: theme === 'dark' ? '#3f3f46' : '#d4d4d8',
    bg1: theme === 'dark' ? '#ffffff' : '#a1a1aa',
    bg2: theme === 'dark' ? '#a3e635' : '#93c5fd',
  }), [theme]);
  
  // Track mouse coordinates for interactive parallax
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Pre-allocate coordinate buffers for dynamic R3F particle updates
  const trail1Positions = useMemo(() => new Float32Array(150 * 3), []);
  const trail2Positions = useMemo(() => new Float32Array(150 * 3), []);
  const ecgPositions = useMemo(() => new Float32Array(150 * 3), []);

  // Ambient background calorie tracker nodes (static but beautiful depth points)
  const pointsPositions1 = useMemo(() => {
    const positions = new Float32Array(300);
    for (let i = 0; i < 300; i++) {
      positions[i] = (Math.random() - 0.5) * 14;
    }
    return positions;
  }, []);

  const pointsPositions2 = useMemo(() => {
    const positions = new Float32Array(150);
    for (let i = 0; i < 150; i++) {
      positions[i] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pulseSpeed = 2.0;
    const pulseY = -2.8 + ((time * pulseSpeed) % 5.6);
    
    // Smooth 3D tilt and organic sways of the entire bio-telemetry structure
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.04;
      
      // Interpolate mouse movements to rotate the scene
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.45, 0.04);
      // Gentle pendulum sway on the Z axis combined with mouse sway
      const pendulumSway = Math.sin(time * 0.6) * 0.06;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z, 
        -mouse.x * 0.45 + pendulumSway, 
        0.04
      );
      
      // Translate the entire structure slightly towards the mouse pointer for tactile response
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.x * 0.7, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, Math.sin(time * 0.6) * 0.15 + mouse.y * 0.7, 0.05);
    }
    
    // Rotate DNA rungs locally and apply peristaltic expansion as the heartbeat passes
    for (let i = 0; i < 12; i++) {
      const rung = rungsRefs.current[i];
      if (rung) {
        const tRatio = i / 11;
        const y = -2.4 + tRatio * 4.8;
        
        rung.rotation.y = -(tRatio * Math.PI * 3.5 + time * 0.9);
        
        // Calculate peristaltic expansion as the heartbeat wave passes this rung's Y-coordinate
        const dist = Math.abs(y - pulseY);
        // Gaussian expansion curve: up to 26% bulge within 0.5 units of distance
        const expansion = 1.0 + Math.exp(-Math.pow(dist / 0.5, 2)) * 0.26;
        rung.scale.set(expansion, 1, expansion);
      }
    }

    // Generate glowing particle trails that wrap the DNA helix nodes and bulge in sync
    if (trail1Ref.current && trail1Ref.current.geometry.attributes.position) {
      const positions = trail1Ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 150; i++) {
        const tRatio = i / 149;
        const y = -2.8 + tRatio * 5.6;
        const theta = tRatio * Math.PI * 3.5 + time * 0.9;
        
        const dist = Math.abs(y - pulseY);
        const expansion = 1.0 + Math.exp(-Math.pow(dist / 0.5, 2)) * 0.26;
        
        positions[i * 3] = Math.cos(theta) * 1.1 * expansion + Math.sin(time * 4 + i) * 0.04;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(theta) * 1.1 * expansion + Math.cos(time * 4 + i) * 0.04;
      }
      trail1Ref.current.geometry.attributes.position.needsUpdate = true;
    }

    if (trail2Ref.current && trail2Ref.current.geometry.attributes.position) {
      const positions = trail2Ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 150; i++) {
        const tRatio = i / 149;
        const y = -2.8 + tRatio * 5.6;
        const theta = tRatio * Math.PI * 3.5 + time * 0.9;
        
        const dist = Math.abs(y - pulseY);
        const expansion = 1.0 + Math.exp(-Math.pow(dist / 0.5, 2)) * 0.26;
        
        positions[i * 3] = -Math.cos(theta) * 1.1 * expansion + Math.sin(time * 4 + i + 5) * 0.04;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = -Math.sin(theta) * 1.1 * expansion + Math.cos(time * 4 + i + 5) * 0.04;
      }
      trail2Ref.current.geometry.attributes.position.needsUpdate = true;
    }

    // Dynamic ECG Heartbeat pulse propagation traveling up the central vertical line
    if (ecgRef.current && ecgRef.current.geometry.attributes.position) {
      const positions = ecgRef.current.geometry.attributes.position.array as Float32Array;

      for (let k = 0; k < 150; k++) {
        const tRatio = k / 149;
        const y = -2.8 + tRatio * 5.6;
        const dist = Math.abs(y - pulseY);
        
        let x = 0;
        let z = 0;

        // If the pulse wave is passing this point, calculate QRS heartbeat deflection
        if (dist < 0.7) {
          const w = (y - pulseY) / 0.7; // normalized distance in [-1, 1]
          
          if (w > -0.7 && w < -0.3) {
            // T wave (dome)
            x = Math.sin((w + 0.7) / 0.4 * Math.PI) * 0.16;
          } else if (w > -0.25 && w < 0.25) {
            // QRS complex (high amplitude deflection)
            const phase = w / 0.25; // range [-1, 1]
            x = -Math.sin(phase * Math.PI * 1.5) * Math.cos(phase * Math.PI * 0.5) * 1.25;
            z = -Math.sin(phase * Math.PI * 1.5) * Math.cos(phase * Math.PI * 0.5) * 0.42;
          }

          // High frequency energy spark explosion right at the peak
          if (dist < 0.12) {
            x += (Math.random() - 0.5) * 0.18;
            z += (Math.random() - 0.5) * 0.18;
          }
        }

        // Ambient micro-electrical trace noise
        x += (Math.random() - 0.5) * 0.012;
        z += (Math.random() - 0.5) * 0.012;

        positions[k * 3] = x;
        positions[k * 3 + 1] = y;
        positions[k * 3 + 2] = z;
      }
      ecgRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const scale = windowWidth < 768 ? 0.72 : 0.95;

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* 3D DNA Rungs & Base pair Spheres */}
      {Array.from({ length: 12 }, (_, i) => {
        const tRatio = i / 11;
        const y = -2.4 + tRatio * 4.8;
        return (
          <group
            key={i}
            position={[0, y, 0]}
            ref={(el) => {
              rungsRefs.current[i] = el;
            }}
          >
            {/* Horizontal Rung Bar */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 2.2, 16]} />
              <meshStandardMaterial 
                color={colors.rung} 
                metalness={theme === 'dark' ? 0.9 : 0.1} 
                roughness={theme === 'dark' ? 0.2 : 0.8} 
                transparent 
                opacity={theme === 'dark' ? 0.4 : 0.15} 
              />
            </mesh>

            {/* Neon Lime Base Pair (Nutrition indicator) */}
            <mesh position={[1.1, 0, 0]}>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial 
                color={colors.lime} 
                emissive={colors.limeEmissive} 
                emissiveIntensity={theme === 'dark' ? 1.4 : 0.3} 
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>

            {/* Electric Cyan Base Pair (Training/Activity indicator) */}
            <mesh position={[-1.1, 0, 0]}>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial 
                color={colors.cyan} 
                emissive={colors.cyanEmissive} 
                emissiveIntensity={theme === 'dark' ? 1.4 : 0.3} 
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
          </group>
        );
      })}

      {/* Helix 1 Particle Trail (Lime) */}
      <points ref={trail1Ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trail1Positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial 
          color={colors.lime} 
          size={theme === 'dark' ? 0.065 : 0.055} 
          sizeAttenuation 
          transparent 
          opacity={theme === 'dark' ? 0.7 : 0.5} 
        />
      </points>

      {/* Helix 2 Particle Trail (Cyan) */}
      <points ref={trail2Ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trail2Positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial 
          color={colors.cyan} 
          size={theme === 'dark' ? 0.065 : 0.055} 
          sizeAttenuation 
          transparent 
          opacity={theme === 'dark' ? 0.7 : 0.5} 
        />
      </points>

      {/* Central ECG Heartbeat wave (Pink) */}
      <points ref={ecgRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[ecgPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial 
          color={colors.pink} 
          size={theme === 'dark' ? 0.08 : 0.06} 
          sizeAttenuation 
          transparent 
          opacity={theme === 'dark' ? 0.95 : 0.65} 
        />
      </points>

      {/* Calorie background particle clouds */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pointsPositions1, 3]}
          />
        </bufferGeometry>
        <pointsMaterial color={colors.bg1} size={theme === 'dark' ? 0.035 : 0.025} sizeAttenuation transparent opacity={theme === 'dark' ? 0.5 : 0.2} />
      </points>
      
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pointsPositions2, 3]}
          />
        </bufferGeometry>
        <pointsMaterial color={colors.bg2} size={theme === 'dark' ? 0.045 : 0.035} sizeAttenuation transparent opacity={theme === 'dark' ? 0.7 : 0.25} />
      </points>
    </group>
  );
}

export default function HeroCanvas({ className = "w-full h-[350px] md:h-[500px] xl:h-[600px]" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[350px]">
        <div className="w-12 h-12 border-2 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <Canvas camera={{ position: [0, 0, 7.0], fov: 45 }}>
        <ambientLight intensity={theme === 'dark' ? 0.5 : 0.85} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color={theme === 'dark' ? '#06b6d4' : '#e2e8f0'} />
        <directionalLight position={[0, 5, 0]} intensity={1.0} color={theme === 'dark' ? '#a3e635' : '#f8fafc'} />
        <Scene theme={theme} />
      </Canvas>
      {/* Visual glowing overlay for premium finish */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-white dark:to-zinc-950 pointer-events-none" />
    </div>
  );
}

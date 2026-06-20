'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CalorieBurnVisualizerProps {
  intensity: number; // 0 to 100 (percentage of calorie burn intensity target)
  theme: 'dark' | 'light';
}

// Particle item representation
interface ParticleData {
  pos: THREE.Vector3;
  speed: number;
  scale: number;
  life: number;
  maxLife: number;
  horizontalPhase: number;
  horizontalSpeed: number;
}

function CalorieParticles({ intensity, theme }: CalorieBurnVisualizerProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Set up particles count (reduced on mobile for performance optimization)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 30 : 80;
  
  const particles = useMemo(() => {
    const list: ParticleData[] = [];
    const baseRadius = 0.45;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * baseRadius;
      
      list.push({
        pos: new THREE.Vector3(
          Math.cos(theta) * r,
          (Math.random() - 0.5) * 1.5, // initial Y height
          Math.sin(theta) * r
        ),
        speed: 0.8 + Math.random() * 1.2,
        scale: 0.02 + Math.random() * 0.05,
        life: Math.random(),
        maxLife: 1.5 + Math.random() * 1.5,
        horizontalPhase: Math.random() * Math.PI * 2,
        horizontalSpeed: 1 + Math.random() * 3
      });
    }
    return list;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Color palette for fire elements (Yellow -> Orange -> Red -> Purple -> Black)
  const colors = useMemo(() => {
    return {
      yellow: new THREE.Color('#ffea00'),
      orange: new THREE.Color('#ff7a00'),
      red: new THREE.Color('#ec4899'), // hot pink/red
      purple: new THREE.Color('#8b5cf6'),
      dark: new THREE.Color('#18181b')
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Scale rise speed by intensity input (minimum speed of 0.25 to keep it alive)
    const multiplier = 0.25 + (intensity / 100) * 1.75;
    
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      
      // Update lifetime
      p.life += delta * multiplier;
      
      // Rise motion
      p.pos.y += delta * 0.45 * p.speed * multiplier;
      
      // Organic sway horizontal drift
      p.horizontalPhase += delta * p.horizontalSpeed;
      p.pos.x += Math.sin(p.horizontalPhase) * 0.003;
      p.pos.z += Math.cos(p.horizontalPhase) * 0.003;
      
      // Reset particle if lifetime ends or it goes too high
      if (p.life >= p.maxLife || p.pos.y > 0.95) {
        p.life = 0;
        p.pos.y = -0.95; // start at the bottom of the cylinder
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.38;
        p.pos.x = Math.cos(theta) * r;
        p.pos.z = Math.sin(theta) * r;
      }
      
      // Calculate age percentage (0 to 1)
      const ageRatio = p.life / p.maxLife;
      
      // Scale down near the top to simulate flame dissipation
      const scaleMult = Math.sin(ageRatio * Math.PI);
      const currentScale = p.scale * scaleMult * (0.8 + (intensity / 100) * 0.6);
      
      dummy.position.copy(p.pos);
      dummy.scale.set(currentScale, currentScale, currentScale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Dynamic color interpolation representing thermodynamic cooling
      let color: THREE.Color;
      if (ageRatio < 0.2) {
        color = colors.yellow.clone().lerp(colors.orange, ageRatio / 0.2);
      } else if (ageRatio < 0.5) {
        color = colors.orange.clone().lerp(colors.red, (ageRatio - 0.2) / 0.3);
      } else if (ageRatio < 0.8) {
        color = colors.red.clone().lerp(colors.purple, (ageRatio - 0.5) / 0.3);
      } else {
        color = colors.purple.clone().lerp(colors.dark, (ageRatio - 0.8) / 0.2);
      }
      
      meshRef.current.setColorAt(i, color);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial 
        emissive="#ff7a00"
        emissiveIntensity={1.8}
        roughness={0.1}
        metalness={0.9}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
}

export default function CalorieBurnVisualizer({
  intensity,
  theme
}: CalorieBurnVisualizerProps) {
  
  return (
    <div className="w-full h-full relative min-h-[220px] md:min-h-[280px]">
      <Canvas camera={{ position: [0, 0, 2.6], fov: 45 }}>
        <ambientLight intensity={theme === 'dark' ? 0.35 : 0.7} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[0, -5, 0]} intensity={1.0} color="#ff7a00" />
        
        {/* Glowing concentric tracks base */}
        <mesh position={[0, -0.96, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.58, 32]} />
          <meshBasicMaterial color="#ff7a00" transparent opacity={0.25} />
        </mesh>
        
        {/* Glass Outer Cylinder */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 1.9, 32, 1, true]} />
          <meshPhysicalMaterial 
            color={theme === 'dark' ? '#18181b' : '#f4f4f5'}
            roughness={0.15}
            transmission={0.8}
            thickness={0.08}
            transparent
            opacity={theme === 'dark' ? 0.3 : 0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Glowing energy core grid inside */}
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.54, 0.54, 0.02, 16]} />
          <meshStandardMaterial color="#18181b" metalness={0.95} roughness={0.1} />
        </mesh>

        <CalorieParticles intensity={intensity} theme={theme} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 2 - 0.3}
        />
      </Canvas>
    </div>
  );
}

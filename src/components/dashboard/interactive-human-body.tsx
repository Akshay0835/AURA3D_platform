'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveHumanBodyProps {
  selectedMuscle: string | null;
  onSelectMuscle: (muscle: string) => void;
  hoveredMuscle: string | null;
  onHoverMuscle: (muscle: string | null) => void;
  facingFront: boolean;
  theme: 'dark' | 'light';
}

interface BodyPartProps {
  muscle: string;
  geometry: React.ReactNode;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  selectedMuscle: string | null;
  hoveredMuscle: string | null;
  onSelect: (muscle: string) => void;
  onHover: (muscle: string | null) => void;
  theme: 'dark' | 'light';
}

function BodyPart({
  muscle,
  geometry,
  position,
  rotation,
  scale,
  selectedMuscle,
  hoveredMuscle,
  onSelect,
  onHover,
  theme
}: BodyPartProps) {
  const isSelected = selectedMuscle === muscle;
  const isHovered = hoveredMuscle === muscle;

  // Emissive highlight coloring depending on theme and active state
  const color = useMemo(() => {
    if (isSelected) return '#ccff00'; // Aura Neon Lime
    if (isHovered) return '#06b6d4'; // Cyber Cyan
    return theme === 'dark' ? '#52525b' : '#d4d4d8'; // zinc-600 or zinc-300
  }, [isSelected, isHovered, theme]);

  const emissive = useMemo(() => {
    if (isSelected) return '#ccff00';
    if (isHovered) return '#06b6d4';
    return theme === 'dark' ? '#27272a' : '#eaeaea';
  }, [isSelected, isHovered, theme]);

  const emissiveIntensity = isSelected ? 2.5 : isHovered ? 1.2 : 0.45;

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(muscle);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(muscle);
      }}
    >
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.5}
        metalness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function HumanoidScene({
  selectedMuscle,
  onSelectMuscle,
  hoveredMuscle,
  onHoverMuscle,
  facingFront,
  theme
}: Omit<InteractiveHumanBodyProps, 'className'>) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Smoothly rotate body model based on view selection (0 rad is front, PI rad is back)
      const targetY = facingFront ? 0 : Math.PI;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetY,
        0.08
      );
    }
  });

  // Base grid colors
  const gridColor = theme === 'dark' ? '#27272a' : '#e4e4e7';
  const gridAccentColor = theme === 'dark' ? '#ccff00' : '#84cc16';

  return (
    <group>
      {/* Visual cyber ground grid */}
      <gridHelper
        args={[10, 10, gridAccentColor, gridColor]}
        position={[0, -1.0, 0]}
        material-opacity={theme === 'dark' ? 0.22 : 0.4}
        material-transparent={true}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 0]}>
        <ringGeometry args={[0.7, 0.75, 32]} />
        <meshBasicMaterial color={gridAccentColor} transparent opacity={0.35} />
      </mesh>

      <group ref={groupRef} position={[0, -0.2, 0]}>
        {/* Head (Neck/Traps/Shoulders support) */}
        <BodyPart
          muscle="shoulders"
          position={[0, 0.75, 0]}
          geometry={<sphereGeometry args={[0.11, 16, 16]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />

        {/* Neck */}
        <mesh position={[0, 0.61, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.08, 12]} />
          <meshStandardMaterial color={theme === 'dark' ? '#52525b' : '#d4d4d8'} metalness={0.1} roughness={0.5} />
        </mesh>

        {/* --- FRONT MUSCLES --- */}
        {/* Chest (Split into left/right pectoral muscles) */}
        <BodyPart
          muscle="chest"
          position={[-0.08, 0.43, 0.07]}
          geometry={<boxGeometry args={[0.075, 0.12, 0.04]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />
        <BodyPart
          muscle="chest"
          position={[0.08, 0.43, 0.07]}
          geometry={<boxGeometry args={[0.075, 0.12, 0.04]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />

        {/* Abs / Core */}
        <BodyPart
          muscle="abs"
          position={[0, 0.23, 0.065]}
          geometry={<boxGeometry args={[0.13, 0.18, 0.05]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />

        {/* --- BACK MUSCLES --- */}
        {/* Latissimus Dorsi (Lats / Upper Back) */}
        <BodyPart
          muscle="back"
          position={[-0.09, 0.38, -0.06]}
          geometry={<boxGeometry args={[0.09, 0.22, 0.04]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />
        <BodyPart
          muscle="back"
          position={[0.09, 0.38, -0.06]}
          geometry={<boxGeometry args={[0.09, 0.22, 0.04]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />

        {/* Lower Back (Spinal Erectors) */}
        <BodyPart
          muscle="back"
          position={[0, 0.18, -0.06]}
          geometry={<boxGeometry args={[0.1, 0.12, 0.04]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />

        {/* --- SHOULDERS & ARMS --- */}
        {/* Left Shoulder (Deltoid) */}
        <BodyPart
          muscle="shoulders"
          position={[-0.19, 0.48, 0]}
          geometry={<sphereGeometry args={[0.055, 12, 12]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />
        {/* Right Shoulder (Deltoid) */}
        <BodyPart
          muscle="shoulders"
          position={[0.19, 0.48, 0]}
          geometry={<sphereGeometry args={[0.055, 12, 12]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />

        {/* Left Upper Arm (Biceps / Triceps) */}
        <BodyPart
          muscle="arms"
          position={[-0.23, 0.32, 0.01]}
          geometry={<cylinderGeometry args={[0.038, 0.034, 0.22, 12]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />
        {/* Right Upper Arm (Biceps / Triceps) */}
        <BodyPart
          muscle="arms"
          position={[0.23, 0.32, 0.01]}
          geometry={<cylinderGeometry args={[0.038, 0.034, 0.22, 12]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />

        {/* Left Forearm */}
        <BodyPart
          muscle="arms"
          position={[-0.25, 0.11, 0.02]}
          geometry={<cylinderGeometry args={[0.03, 0.025, 0.18, 12]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />
        {/* Right Forearm */}
        <BodyPart
          muscle="arms"
          position={[0.25, 0.11, 0.02]}
          geometry={<cylinderGeometry args={[0.03, 0.025, 0.18, 12]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />

        {/* Pelvis & Glutes */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.21, 0.12, 0.14]} />
          <meshStandardMaterial color={theme === 'dark' ? '#52525b' : '#d4d4d8'} metalness={0.1} roughness={0.5} />
        </mesh>
        
        {/* Glute Max Back Overlay */}
        <BodyPart
          muscle="legs"
          position={[0, 0.01, -0.065]}
          geometry={<boxGeometry args={[0.19, 0.09, 0.03]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />

        {/* --- LEGS --- */}
        {/* Left Thigh (Quads/Hamstrings) */}
        <BodyPart
          muscle="legs"
          position={[-0.09, -0.22, 0]}
          geometry={<cylinderGeometry args={[0.055, 0.045, 0.38, 16]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />
        {/* Right Thigh (Quads/Hamstrings) */}
        <BodyPart
          muscle="legs"
          position={[0.09, -0.22, 0]}
          geometry={<cylinderGeometry args={[0.055, 0.045, 0.38, 16]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />

        {/* Left Calf / Shin */}
        <BodyPart
          muscle="legs"
          position={[-0.09, -0.58, 0]}
          geometry={<cylinderGeometry args={[0.042, 0.028, 0.32, 12]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />
        {/* Right Calf / Shin */}
        <BodyPart
          muscle="legs"
          position={[0.09, -0.58, 0]}
          geometry={<cylinderGeometry args={[0.042, 0.028, 0.32, 12]} />}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          theme={theme}
        />
      </group>
    </group>
  );
}

export default function InteractiveHumanBody({
  selectedMuscle,
  onSelectMuscle,
  hoveredMuscle,
  onHoverMuscle,
  facingFront,
  theme
}: InteractiveHumanBodyProps) {
  return (
    <div className="w-full h-full relative min-h-[380px] md:min-h-[480px]">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <ambientLight intensity={theme === 'dark' ? 0.75 : 0.95} />
        <directionalLight position={[2, 3, 2]} intensity={1.8} />
        <directionalLight position={[-2, 1, 2]} intensity={0.8} color="#06b6d4" />
        <pointLight position={[0, -2, -1]} intensity={0.4} />
        
        <HumanoidScene
          selectedMuscle={selectedMuscle}
          onSelectMuscle={onSelectMuscle}
          hoveredMuscle={hoveredMuscle}
          onHoverMuscle={onHoverMuscle}
          facingFront={facingFront}
          theme={theme}
        />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={1.5}
          maxDistance={4.0}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>

      {/* Muscle Tag HTML HUD overlay */}
      {(hoveredMuscle || selectedMuscle) && (
        <div className="absolute top-4 left-4 pointer-events-none z-20">
          <div className="bg-zinc-950/90 border border-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2 font-mono text-[10px] text-white shadow-2xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-brand-lime animate-ping" />
            <span className="text-zinc-400">ACTIVE REGION:</span>
            <span className="font-black text-brand-lime uppercase tracking-widest">
              {hoveredMuscle || selectedMuscle}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

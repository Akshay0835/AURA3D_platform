'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Zap, 
  Activity, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  Thermometer,
  Gauge
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

// Types of exercises supported
type ExerciseType = 'squat' | 'deadlift' | 'curl' | 'press';

const EXERCISE_VIDEOS: Record<ExerciseType, string> = {
  squat: 'https://player.vimeo.com/external/459389137.sd.mp4?s=8943867b9365541c402127ef672585f67a216b2f&profile_id=165&oauth2_token_id=57447761',
  deadlift: 'https://player.vimeo.com/external/498305988.sd.mp4?s=d010777e48b8b0e51be58a74e532b6b0b5cc4502&profile_id=165&oauth2_token_id=57447761',
  curl: 'https://player.vimeo.com/external/459389146.sd.mp4?s=d9980d2a843af3915bc674d8122c83d6a695d7b3&profile_id=165&oauth2_token_id=57447761',
  press: 'https://player.vimeo.com/external/369284242.sd.mp4?s=bc631ab8a0d4c82b92113f382a9394625b06497f&profile_id=165&oauth2_token_id=57447761'
};

interface JointStrain {
  knee: number;
  spine: number;
  elbow: number;
  shoulder: number;
}

// Simple cylinder bone rendering helper (quaternion rotation between two points)
function Bone({ from, to, color, thickness = 0.02 }: { from: THREE.Vector3; to: THREE.Vector3; color: string; thickness?: number }) {
  const direction = useMemo(() => new THREE.Vector3().subVectors(to, from), [from, to]);
  const length = useMemo(() => direction.length(), [direction]);
  const midpoint = useMemo(() => new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5), [from, to]);
  
  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const dirNorm = direction.clone().normalize();
    return new THREE.Quaternion().setFromUnitVectors(up, dirNorm);
  }, [direction]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[thickness, thickness, length, 8]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.6}
        transparent 
        opacity={0.7} 
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

// Force Vector arrow representation
function ForceVector({ position, direction, color, visible }: { position: THREE.Vector3; direction: THREE.Vector3; color: string; visible: boolean }) {
  if (!visible) return null;
  const length = 0.5;
  const arrowDir = direction.clone().normalize();
  
  // Midpoint of the vector line
  const start = position;
  const end = position.clone().add(arrowDir.clone().multiplyScalar(length));
  
  return (
    <group>
      <Bone from={start} to={end} color={color} thickness={0.015} />
      {/* Arrow head cone */}
      <mesh position={end} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrowDir)}>
        <coneGeometry args={[0.045, 0.12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// Animated 3D skeleton inside the Canvas
function SkeletonScene({ 
  exercise, 
  time, 
  isPlaying,
  useHeatmap, 
  showVectors, 
  hoveredJoint, 
  setHoveredJoint,
  setSelectedJoint,
  selectedJoint
}: { 
  exercise: ExerciseType; 
  time: number; 
  isPlaying: boolean;
  useHeatmap: boolean; 
  showVectors: boolean; 
  hoveredJoint: string | null; 
  setHoveredJoint: (name: string | null) => void;
  setSelectedJoint: (name: string | null) => void;
  selectedJoint: string | null;
}) {
  const [localTime, setLocalTime] = useState(time);

  // Sync localTime with parent time on reset or exercise change
  useEffect(() => {
    setLocalTime(time);
  }, [exercise]);

  useEffect(() => {
    // Force sync if the clock diverges significantly (e.g. on reset or manual pause/play sync)
    if (Math.abs(localTime - time) > 0.15) {
      setLocalTime(time);
    }
  }, [time]);

  useFrame((state, delta) => {
    if (isPlaying) {
      setLocalTime((prev) => prev + delta);
    }
  });
  
  // Calculate all coordinates on the render tick
  const speed = 2.0;
  const phase = Math.sin(localTime * speed) * 0.5 + 0.5; // 0 to 1 cycle

  // Joints positions calculation based on the exercise
  const j = useMemo(() => {
    // Default base postures
    const footL = new THREE.Vector3(-0.6, -1.8, 0);
    const footR = new THREE.Vector3(0.6, -1.8, 0);
    
    let pelvis = new THREE.Vector3(0, -0.6, 0);
    let chest = new THREE.Vector3(0, 0.2, 0);
    let head = new THREE.Vector3(0, 0.6, 0);
    
    let kneeL = new THREE.Vector3(-0.4, -1.2, 0);
    let kneeR = new THREE.Vector3(0.4, -1.2, 0);
    
    let shoulderL = new THREE.Vector3(-0.45, 0.2, 0);
    let shoulderR = new THREE.Vector3(0.45, 0.2, 0);
    
    let elbowL = new THREE.Vector3(-0.48, -0.2, 0.05);
    let elbowR = new THREE.Vector3(0.48, -0.2, 0.05);
    
    let handL = new THREE.Vector3(-0.48, -0.6, 0.1);
    let handR = new THREE.Vector3(0.48, -0.6, 0.1);

    let barbellPos = new THREE.Vector3(0, 999, 0); // hidden by default
    let barbellWeightL = new THREE.Vector3(0, 999, 0);
    let barbellWeightR = new THREE.Vector3(0, 999, 0);
    
    let kneeAngle = 180;
    let elbowAngle = 180;
    let spineAngle = 0;
    let shoulderAngle = 0;

    if (exercise === 'squat') {
      const pelvisY = -0.6 - (1.0 - phase) * 0.75;
      const pelvisZ = -(1.0 - phase) * 0.22;
      pelvis.set(0, pelvisY, pelvisZ);
      
      const kneeY = (pelvisY + footL.y) / 2;
      const kneeZ = (pelvisZ + footL.y) / 2 + (1.0 - phase) * 0.65;
      kneeL.set(-0.35 - (1.0 - phase) * 0.12, kneeY, kneeZ);
      kneeR.set(0.35 + (1.0 - phase) * 0.12, kneeY, kneeZ);
      
      const tilt = (1.0 - phase) * 0.35;
      const chestY = pelvisY + Math.cos(tilt) * 0.8;
      const chestZ = pelvisZ + Math.sin(tilt) * 0.8;
      chest.set(0, chestY, chestZ);
      head.set(0, chestY + Math.cos(tilt) * 0.4, chestZ + Math.sin(tilt) * 0.4);
      
      shoulderL.set(-0.45, chestY, chestZ);
      shoulderR.set(0.45, chestY, chestZ);
      
      // Barbell on back
      barbellPos.set(0, chestY, chestZ - 0.12);
      barbellWeightL.set(-1.3, chestY, chestZ - 0.12);
      barbellWeightR.set(1.3, chestY, chestZ - 0.12);
      
      // Hands holding bar
      handL.set(-0.55, chestY - 0.1, chestZ - 0.1);
      handR.set(0.55, chestY - 0.1, chestZ - 0.1);
      
      elbowL.set(-0.5, chestY - 0.4, chestZ - 0.08);
      elbowR.set(0.5, chestY - 0.4, chestZ - 0.08);

      kneeAngle = Math.round(90 + phase * 90);
      elbowAngle = 92;
      spineAngle = Math.round(tilt * (180 / Math.PI));
      shoulderAngle = 45;
      
    } else if (exercise === 'deadlift') {
      const pelvisY = -0.5 - (1.0 - phase) * 0.42;
      const pelvisZ = -(1.0 - phase) * 0.65;
      pelvis.set(0, pelvisY, pelvisZ);
      
      const kneeY = (pelvisY + footL.y) / 2;
      const kneeZ = (pelvisZ + footL.z) / 2 + (1.0 - phase) * 0.22;
      kneeL.set(-0.3, kneeY, kneeZ);
      kneeR.set(0.3, kneeY, kneeZ);
      
      const tilt = (1.0 - phase) * 0.9;
      const chestY = pelvisY + Math.cos(tilt) * 0.8;
      const chestZ = pelvisZ + Math.sin(tilt) * 0.8;
      chest.set(0, chestY, chestZ);
      head.set(0, chestY + Math.cos(tilt - 0.2) * 0.4, chestZ + Math.sin(tilt - 0.2) * 0.4);
      
      shoulderL.set(-0.45, chestY, chestZ);
      shoulderR.set(0.45, chestY, chestZ);
      
      // Arms hanging straight down
      const armLength = 0.65;
      const handY = chestY - armLength;
      handL.set(-0.42, handY, chestZ);
      handR.set(0.42, handY, chestZ);
      
      elbowL.set(-0.435, (chestY + handY) / 2, chestZ);
      elbowR.set(0.435, (chestY + handY) / 2, chestZ);
      
      barbellPos.set(0, handY, chestZ);
      barbellWeightL.set(-1.3, handY, chestZ);
      barbellWeightR.set(1.3, handY, chestZ);

      kneeAngle = Math.round(110 + phase * 70);
      elbowAngle = 180;
      spineAngle = Math.round(tilt * (180 / Math.PI));
      shoulderAngle = Math.round((1.0 - phase) * 35);
      
    } else if (exercise === 'curl') {
      // Standing static
      kneeL.set(-0.35, -1.2, 0);
      kneeR.set(0.35, -1.2, 0);
      
      elbowL.set(-0.46, -0.2, 0.05);
      elbowR.set(0.46, -0.2, 0.05);
      
      const curlAngle = phase * 2.2 + 0.2; // 0.2 rad to 2.4 rad
      const forearmLength = 0.42;
      const handY = elbowL.y + Math.sin(curlAngle - Math.PI/2) * forearmLength;
      const handZ = elbowL.z + Math.cos(curlAngle - Math.PI/2) * forearmLength;
      
      handL.set(-0.46, handY, handZ);
      handR.set(0.46, handY, handZ);

      kneeAngle = 178;
      elbowAngle = Math.round(180 - (phase * 135));
      spineAngle = 0;
      shoulderAngle = 10;
      
    } else if (exercise === 'press') {
      // Standing static legs
      kneeL.set(-0.35, -1.2, 0);
      kneeR.set(0.35, -1.2, 0);
      
      const barbellY = 0.25 + phase * 1.15;
      const barbellZ = 0.12;
      
      barbellPos.set(0, barbellY, barbellZ);
      barbellWeightL.set(-1.3, barbellY, barbellZ);
      barbellWeightR.set(1.3, barbellY, barbellZ);
      
      handL.set(-0.45, barbellY, barbellZ);
      handR.set(0.45, barbellY, barbellZ);
      
      // Elbows flare out when bar is low, tuck when bar is high
      const elbowX = 0.45 + (1.0 - phase) * 0.22;
      const elbowY = 0.2 - (1.0 - phase) * 0.25;
      const elbowZ = 0.08 + (1.0 - phase) * 0.1;
      
      elbowL.set(-elbowX, elbowY, elbowZ);
      elbowR.set(elbowX, elbowY, elbowZ);

      kneeAngle = 178;
      elbowAngle = Math.round(75 + phase * 105);
      spineAngle = Math.round((1.0 - phase) * 5); // slight extension back at bottom
      shoulderAngle = Math.round(phase * 160);
    }

    return {
      footL, footR, pelvis, chest, head, kneeL, kneeR,
      shoulderL, shoulderR, elbowL, elbowR, handL, handR,
      barbellPos, barbellWeightL, barbellWeightR,
      kneeAngle, elbowAngle, spineAngle, shoulderAngle
    };
  }, [exercise, phase]);

  // Joint Strain calculation function
  const getJointStrain = (name: string): number => {
    switch (name) {
      case 'knee':
        if (exercise === 'squat') return (1.0 - phase) * 0.95;
        if (exercise === 'deadlift') return (1.0 - phase) * 0.45;
        return 0.05;
      case 'spine':
        if (exercise === 'deadlift') return (1.0 - phase) * 0.98;
        if (exercise === 'squat') return (1.0 - phase) * 0.65;
        if (exercise === 'press') return (1.0 - phase) * 0.25;
        return 0.08;
      case 'elbow':
        if (exercise === 'curl') return 0.1 + Math.sin(phase * Math.PI) * 0.85;
        if (exercise === 'press') return 0.2 + (1.0 - phase) * 0.6;
        if (exercise === 'deadlift') return 0.25;
        return 0.05;
      case 'shoulder':
        if (exercise === 'press') return 0.3 + (1.0 - phase) * 0.65;
        if (exercise === 'deadlift') return 0.35;
        if (exercise === 'squat') return 0.2;
        return 0.08;
      default:
        return 0.1;
    }
  };

  const getJointColor = (name: string): string => {
    if (!useHeatmap) return '#a3e635'; // uniform brand-lime
    const strain = getJointStrain(name);
    if (strain < 0.2) return '#06b6d4'; // cool cyan
    if (strain < 0.5) return '#a3e635'; // glowing lime
    if (strain < 0.8) return '#eab308'; // load yellow
    return '#ef4444'; // stress red
  };

  const getJointLabel = (name: string): string => {
    if (name === 'knee') return `${j.kneeAngle}°`;
    if (name === 'elbow') return `${j.elbowAngle}°`;
    if (name === 'spine') return `${j.spineAngle}°`;
    if (name === 'shoulder') return `${j.shoulderAngle}°`;
    return '';
  };

  const hipsL = useMemo(() => new THREE.Vector3(-0.2, j.pelvis.y, j.pelvis.z), [j.pelvis]);
  const hipsR = useMemo(() => new THREE.Vector3(0.2, j.pelvis.y, j.pelvis.z), [j.pelvis]);

  return (
    <group>
      {/* 3D Grid helper at base */}
      <gridHelper args={[20, 20, '#a3e635', '#27272a']} position={[0, -1.81, 0]} material-opacity={0.2} material-transparent={true} />
      
      {/* Laser concentric pedestals */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.82, 0]}>
        <ringGeometry args={[1.3, 1.34, 64]} />
        <meshBasicMaterial color="#a3e635" side={THREE.DoubleSide} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.82, 0]}>
        <ringGeometry args={[0, 1.3, 32]} />
        <meshBasicMaterial color="#a3e635" side={THREE.DoubleSide} transparent opacity={0.03} />
      </mesh>

      {/* Cyber Bounding Box */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[3.2, 3.4, 2.6]} />
        <meshBasicMaterial color="#a3e635" wireframe transparent opacity={0.02} />
      </mesh>

      {/* Bones structure (Lines connecting joints) */}
      <Bone from={j.pelvis} to={hipsL} color="#27272a" thickness={0.015} />
      <Bone from={j.pelvis} to={hipsR} color="#27272a" thickness={0.015} />
      
      {/* Leg Left */}
      <Bone from={hipsL} to={j.kneeL} color={getJointColor('knee')} />
      <Bone from={j.kneeL} to={j.footL} color={getJointColor('knee')} />
      
      {/* Leg Right */}
      <Bone from={hipsR} to={j.kneeR} color={getJointColor('knee')} />
      <Bone from={j.kneeR} to={j.footR} color={getJointColor('knee')} />

      {/* Spine / Torso */}
      <Bone from={j.pelvis} to={j.chest} color={getJointColor('spine')} thickness={0.035} />
      <Bone from={j.chest} to={j.head} color={getJointColor('spine')} thickness={0.025} />
      
      {/* Shoulders */}
      <Bone from={j.chest} to={j.shoulderL} color="#27272a" thickness={0.015} />
      <Bone from={j.chest} to={j.shoulderR} color="#27272a" thickness={0.015} />

      {/* Arm Left */}
      <Bone from={j.shoulderL} to={j.elbowL} color={getJointColor('shoulder')} />
      <Bone from={j.elbowL} to={j.handL} color={getJointColor('elbow')} />

      {/* Arm Right */}
      <Bone from={j.shoulderR} to={j.elbowR} color={getJointColor('shoulder')} />
      <Bone from={j.elbowR} to={j.handR} color={getJointColor('elbow')} />

      {/* RENDER BARBELL (Squat, Deadlift, Press) */}
      {exercise !== 'curl' && (
        <group>
          {/* Shaft */}
          <Bone from={j.barbellWeightL} to={j.barbellWeightR} color="#71717a" thickness={0.025} />
          {/* Left Weights */}
          <mesh position={j.barbellWeightL} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 12]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={j.barbellWeightL.clone().add(new THREE.Vector3(-0.08, 0, 0))} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 12]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Right Weights */}
          <mesh position={j.barbellWeightR} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 12]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={j.barbellWeightR.clone().add(new THREE.Vector3(0.08, 0, 0))} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 12]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* RENDER DUMBBELLS FOR BICEP CURL */}
      {exercise === 'curl' && (
        <group>
          {/* Left Dumbbell */}
          <group position={j.handL}>
            <mesh rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
              <meshBasicMaterial color="#a1a1aa" />
            </mesh>
            <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
              <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
              <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
          {/* Right Dumbbell */}
          <group position={j.handR}>
            <mesh rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
              <meshBasicMaterial color="#a1a1aa" />
            </mesh>
            <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
              <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
              <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        </group>
      )}

      {/* JOINT MESHES & HOVER HTML TOOLTIPS */}
      {[
        { pos: j.pelvis, name: 'spine', key: 'pelvis' },
        { pos: j.chest, name: 'spine', key: 'chest' },
        { pos: j.head, name: 'spine', key: 'head' },
        { pos: j.kneeL, name: 'knee', key: 'kneeL' },
        { pos: j.kneeR, name: 'knee', key: 'kneeR' },
        { pos: j.elbowL, name: 'elbow', key: 'elbowL' },
        { pos: j.elbowR, name: 'elbow', key: 'elbowR' },
        { pos: j.shoulderL, name: 'shoulder', key: 'shoulderL' },
        { pos: j.shoulderR, name: 'shoulder', key: 'shoulderR' },
        { pos: j.handL, name: 'elbow', key: 'handL' },
        { pos: j.handR, name: 'elbow', key: 'handR' },
        { pos: j.footL, name: 'knee', key: 'footL' },
        { pos: j.footR, name: 'knee', key: 'footR' },
      ].map((joint) => {
        const isHovered = hoveredJoint === joint.key;
        const isSelected = selectedJoint === joint.key;
        const color = getJointColor(joint.name);
        
        return (
          <mesh
            key={joint.key}
            position={joint.pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredJoint(joint.key);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredJoint(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedJoint(joint.key);
            }}
          >
            <sphereGeometry args={[isHovered || isSelected ? 0.088 : 0.062, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered || isSelected ? 2.2 : 0.7}
              metalness={0.9}
              roughness={0.1}
            />
            
            {/* 3D projected label tag */}
            {(isHovered || isSelected) && (
              <Html distanceFactor={4.5} position={[0, 0.16, 0]} center>
                <div className="bg-zinc-950/95 border border-white/10 px-2 py-1 rounded shadow-2xl flex items-center gap-1.5 font-mono text-[9px] text-white select-none whitespace-nowrap backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-ping" />
                  <span className="font-bold text-brand-lime uppercase">{joint.key.replace('L', ' (L)').replace('R', ' (R)')}:</span>
                  <span>{getJointLabel(joint.name) || 'OK'}</span>
                </div>
              </Html>
            )}
          </mesh>
        );
      })}

      {/* FORCE LOAD VECTORS OVERLAYS */}
      <ForceVector 
        position={j.kneeL} 
        direction={new THREE.Vector3(0, 1, 0.4 * (1.0 - phase))} 
        color="#ec4899" 
        visible={showVectors && (exercise === 'squat' || exercise === 'deadlift')} 
      />
      <ForceVector 
        position={j.kneeR} 
        direction={new THREE.Vector3(0, 1, 0.4 * (1.0 - phase))} 
        color="#ec4899" 
        visible={showVectors && (exercise === 'squat' || exercise === 'deadlift')} 
      />
      <ForceVector 
        position={j.chest} 
        direction={new THREE.Vector3(0, -1, 0.2 * (1.0 - phase))} 
        color="#06b6d4" 
        visible={showVectors && (exercise === 'deadlift' || exercise === 'squat')} 
      />
      <ForceVector 
        position={j.handL} 
        direction={new THREE.Vector3(0, exercise === 'press' ? 1.2 * phase : -1, 0.2 * Math.sin(phase * Math.PI))} 
        color="#ec4899" 
        visible={showVectors} 
      />
      <ForceVector 
        position={j.handR} 
        direction={new THREE.Vector3(0, exercise === 'press' ? 1.2 * phase : -1, 0.2 * Math.sin(phase * Math.PI))} 
        color="#ec4899" 
        visible={showVectors} 
      />
    </group>
  );
}

export default function BiomechanicalMotionLab() {
  const theme = useAppStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);
  const [exercise, setExercise] = useState<ExerciseType>('squat');
  
  // Custom interactive toggles
  const [useHeatmap, setUseHeatmap] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [time, setTime] = useState(0);
  const [hoveredJoint, setHoveredJoint] = useState<string | null>(null);
  const [selectedJoint, setSelectedJoint] = useState<string | null>(null);
  
  // Telemetry outputs simulation
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Biomechanical Analysis Engine initialized.',
    '[OK] Telemetry nodes calibration complete.',
    '[INFO] Hover nodes to read angular degrees in real-time.'
  ]);

  // Frame timing loops (Throttled parent React DOM clock to 14fps)
  useEffect(() => {
    setMounted(true);
    if (!isPlaying) return;
    
    let lastTime = performance.now();
    const intervalId = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setTime((prev) => prev + delta);
    }, 70); // ~14fps throttle
    
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  // Dynamic system diagnostics log generator
  useEffect(() => {
    const logInterval = setInterval(() => {
      const messages = {
        squat: [
          `[INFO] Squat depth tracking at ${Math.round(40 + Math.random()*20)}% range of motion.`,
          `[OK] Knee valgus index is within safe structural bounds.`,
          `[WARN] Lumbar flexion shear load peaking at ${Math.round(280 + Math.random()*80)}N.`,
          `[INFO] Concentric phase force distribution: 51% Left / 49% Right.`
        ],
        deadlift: [
          `[INFO] Hinge index stable. Core brace efficiency: 94%.`,
          `[OK] Barbell path path-vertical alignment is optimal.`,
          `[WARN] Spinal shear stress peaking in lumbar segment.`,
          `[INFO] Posterior chain load sharing ratio: Glutes 42%, Hamstrings 38%, Back 20%.`
        ],
        curl: [
          `[INFO] Concentric elbow flexion velocity: ${Math.round(1.5 + Math.random()*2)} rad/s.`,
          `[OK] Shoulder joint static stabilization holding.`,
          `[INFO] Bicep brachii EMG amplitude peaking.`,
          `[OK] Mechanical leverage curve optimized at 90° flexion.`
        ],
        press: [
          `[INFO] Overhead extension lock-out force active.`,
          `[OK] Scapular rotation tracker calibrated.`,
          `[WARN] Shoulder impingement metric: Low Risk.`,
          `[INFO] Core activation index: 68% stabilizing torque.`
        ]
      };
      
      const currentLogs = messages[exercise];
      const randomMsg = currentLogs[Math.floor(Math.random() * currentLogs.length)];
      
      setLogs((prev) => {
        const next = [...prev, randomMsg];
        if (next.length > 5) return next.slice(next.length - 5);
        return next;
      });
    }, 3200);

    return () => clearInterval(logInterval);
  }, [exercise]);

  // Sync EMG metrics computations based on time loop for React UI sidebar
  const metrics = useMemo(() => {
    const speed = 2.0;
    const phase = Math.sin(time * speed) * 0.5 + 0.5; // 0 to 1
    
    // Joint angles
    let kneeAngle = 180;
    let elbowAngle = 180;
    let spineAngle = 0;
    let shoulderAngle = 0;
    
    // EMG muscle activations
    let quads = 10;
    let glutes = 10;
    let hamstrings = 10;
    let biceps = 10;
    let back = 10;
    let shoulders = 10;

    if (exercise === 'squat') {
      kneeAngle = Math.round(90 + phase * 90);
      elbowAngle = 92;
      spineAngle = Math.round((1.0 - phase) * 20);
      shoulderAngle = 45;
      
      quads = Math.round(25 + (1.0 - phase) * 70);
      glutes = Math.round(20 + (1.0 - phase) * 75);
      hamstrings = Math.round(15 + (1.0 - phase) * 55);
      back = Math.round(30 + (1.0 - phase) * 40);
    } else if (exercise === 'deadlift') {
      kneeAngle = Math.round(110 + phase * 70);
      elbowAngle = 178;
      spineAngle = Math.round((1.0 - phase) * 52);
      shoulderAngle = Math.round((1.0 - phase) * 35);
      
      hamstrings = Math.round(30 + (1.0 - phase) * 65);
      glutes = Math.round(25 + (1.0 - phase) * 70);
      back = Math.round(35 + (1.0 - phase) * 60);
      quads = Math.round(10 + (1.0 - phase) * 40);
    } else if (exercise === 'curl') {
      kneeAngle = 178;
      elbowAngle = Math.round(180 - (phase * 135));
      spineAngle = 0;
      shoulderAngle = 10;
      
      biceps = Math.round(5 + phase * 90);
      back = Math.round(15 + (1.0 - phase) * 10);
      shoulders = Math.round(10 + phase * 15);
    } else if (exercise === 'press') {
      kneeAngle = 178;
      elbowAngle = Math.round(75 + phase * 105);
      spineAngle = Math.round((1.0 - phase) * 5);
      shoulderAngle = Math.round(phase * 160);
      
      shoulders = Math.round(15 + phase * 80);
      back = Math.round(20 + phase * 45);
      quads = Math.round(12);
      glutes = Math.round(15);
    }

    return {
      kneeAngle, elbowAngle, spineAngle, shoulderAngle,
      quads, glutes, hamstrings, biceps, back, shoulders,
      phase: Math.round(phase * 100)
    };
  }, [exercise, time]);

  if (!mounted) {
    return (
      <div className={`w-full min-h-[500px] flex items-center justify-center border rounded-3xl ${
        theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="w-10 h-10 border-2 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
      
      {/* 3D WebGL Canvas Panel (Left Side - 8 Columns) */}
      <div className={`lg:col-span-8 border rounded-3xl min-h-[450px] lg:min-h-[580px] relative overflow-hidden flex flex-col justify-between p-4 group transition-colors duration-300 ${
        theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        
        {/* Tech grid layout decoration overlay */}
        <div className={`absolute inset-0 bg-[size:24px_24px] pointer-events-none ${
          theme === 'dark'
            ? 'bg-[linear-gradient(rgba(204,255,0,0.006)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.006)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(rgba(204,255,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.015)_1px,transparent_1px)]'
        }`} />
        
        {/* Floating Top Header Badges */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center pointer-events-none z-25">
          <div className={`border px-3 py-1.5 rounded-xl font-mono text-[9px] flex items-center gap-2 backdrop-blur-md ${
            theme === 'dark' ? 'bg-black/80 border-white/10 text-zinc-400' : 'bg-zinc-100/90 border-zinc-300 text-zinc-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-brand-lime animate-pulse' : 'bg-zinc-600'}`} />
            <span>CALIBRATION STATUS: {isPlaying ? 'STREAMING' : 'PAUSED'}</span>
          </div>
          
          <div className={`border px-3 py-1.5 rounded-xl font-mono text-[9px] flex items-center gap-2 backdrop-blur-md ${
            theme === 'dark' ? 'bg-black/80 border-white/10 text-zinc-400' : 'bg-zinc-100/90 border-zinc-300 text-zinc-700'
          }`}>
            <Activity className="w-3.5 h-3.5 text-brand-lime" />
            <span>CORE CLOCK: {time.toFixed(2)}s</span>
          </div>
        </div>

        {/* 3D Core Canvas */}
        <div className="w-full flex-1 relative min-h-[380px] flex items-center justify-center">
          {/* Looping video of a real athlete doing exercise */}
          <video
            key={exercise}
            src={EXERCISE_VIDEOS[exercise]}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute w-[85%] h-[85%] object-contain grayscale contrast-[1.3] brightness-[0.8] pointer-events-none rounded-2xl z-0 transition-opacity duration-300 ${
              theme === 'dark' ? 'mix-blend-screen opacity-35' : 'mix-blend-multiply opacity-25'
            }`}
          />

          <div className="absolute inset-0 z-10">
            <Canvas camera={{ position: [0, 0.4, 4.4], fov: 50 }}>
              <ambientLight intensity={0.65} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
              <pointLight position={[-10, 5, -10]} intensity={0.5} color="#06b6d4" />
              <directionalLight position={[0, 4, 0]} intensity={0.8} color="#a3e635" />
              
              <SkeletonScene 
                exercise={exercise}
                time={time}
                isPlaying={isPlaying}
                useHeatmap={useHeatmap}
                showVectors={showVectors}
                hoveredJoint={hoveredJoint}
                setHoveredJoint={setHoveredJoint}
                selectedJoint={selectedJoint}
                setSelectedJoint={setSelectedJoint}
              />
              
              <OrbitControls 
                enableZoom={true} 
                enablePan={false}
                minDistance={3.0}
                maxDistance={6.5}
                maxPolarAngle={Math.PI / 2 + 0.05} // lock camera above floor grid
              />
            </Canvas>
          </div>

          {/* Absolute Bottom Canvas Labels */}
          <div className="absolute bottom-4 left-4 pointer-events-none font-mono text-[9px] text-zinc-550 flex flex-col gap-0.5 z-20">
            <span>GRID: WebGL coordinates system</span>
            <span>ZOOM: Drag to orbit / Pinch to zoom</span>
          </div>
        </div>

        {/* Interactive Playback Controller Overlay */}
        <div className={`border-t pt-4 flex items-center justify-between z-20 ${
          theme === 'dark' ? 'border-white/5' : 'border-zinc-300'
        }`}>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
              className={`w-9 h-9 rounded-xl border hover:border-brand-lime flex items-center justify-center transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
              }`}
              title={isPlaying ? 'Pause simulation' : 'Play simulation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-brand-lime" />}
            </button>
            <button
              onClick={() => setTime(0)}
              aria-label="Reset simulation clock"
              className={`w-9 h-9 rounded-xl border hover:border-brand-lime flex items-center justify-center transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
              }`}
              title="Reset simulation clock"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setUseHeatmap(!useHeatmap)}
              aria-label={useHeatmap ? "Disable Heatmap Mode" : "Enable Heatmap Mode"}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                useHeatmap 
                  ? 'bg-brand-lime border-brand-lime text-black font-extrabold' 
                  : (theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-800')
              }`}
              title={useHeatmap ? "Disable Heatmap Mode" : "Enable Heatmap Mode"}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowVectors(!showVectors)}
              className={`px-3 py-1.5 rounded-xl border font-mono text-[9px] flex items-center gap-1.5 transition-all cursor-pointer ${
                showVectors 
                  ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan font-bold' 
                  : (theme === 'dark' ? 'bg-zinc-900 border-white/10 text-zinc-500' : 'bg-zinc-100 border-zinc-300 text-zinc-500')
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>FORCE VECTORS</span>
            </button>
          </div>
        </div>

      </div>

      {/* Diagnostics Controls Console Sidebar (Right Side - 4 Columns) */}
      <div className={`lg:col-span-4 border rounded-3xl p-6 flex flex-col justify-between backdrop-blur-md select-none text-left transition-colors duration-300 ${
        theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        
        <div className="space-y-6">
          
          {/* Header titles */}
          <div className="space-y-1">
            <span className="text-[10px] text-brand-lime font-mono tracking-widest font-bold uppercase block">METRICS ENGINE v1.2</span>
            <h3 className={`text-xl font-black uppercase tracking-wide ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>Biokinetic Analyst</h3>
          </div>

          {/* Exercise select buttons list */}
          <div className="space-y-2">
            <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">EXECUTION PATTERN</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'squat', name: 'SQUATS' },
                { id: 'deadlift', name: 'DEADLIFT' },
                { id: 'curl', name: 'BICEP CURL' },
                { id: 'press', name: 'SHOULDER PRESS' }
              ].map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setExercise(ex.id as ExerciseType);
                    setSelectedJoint(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl border font-mono text-[10px] text-center transition-all cursor-pointer ${
                    exercise === ex.id
                      ? 'bg-brand-lime border-brand-lime text-black font-extrabold shadow-lg shadow-brand-lime/15'
                      : (theme === 'dark'
                        ? 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:border-white/15'
                        : 'bg-zinc-100/60 border-zinc-200 text-zinc-600 hover:border-zinc-300')
                  }`}
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active muscle telemetry progress meters */}
          <div className="space-y-3.5">
            <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">EMG AMPLITUDE ANALYSIS</span>
            
            <div className="space-y-2.5">
              {/* Muscle activations layout based on exercise */}
              {[
                { name: 'Quadriceps', active: exercise === 'squat' || exercise === 'deadlift', val: metrics.quads, accent: 'bg-brand-lime' },
                { name: 'Gluteus Maximus', active: exercise === 'squat' || exercise === 'deadlift', val: metrics.glutes, accent: 'bg-brand-lime' },
                { name: 'Hamstrings', active: exercise === 'squat' || exercise === 'deadlift', val: metrics.hamstrings, accent: 'bg-brand-lime' },
                { name: 'Biceps Brachii', active: exercise === 'curl', val: metrics.biceps, accent: 'bg-brand-cyan' },
                { name: 'Erector Spinae', active: exercise !== 'curl', val: metrics.back, accent: 'bg-brand-lime' },
                { name: 'Deltoids', active: exercise === 'press' || exercise === 'curl', val: metrics.shoulders, accent: 'bg-brand-cyan' },
              ].map((muscle, index) => {
                if (!muscle.active) return null;
                return (
                  <div key={index} className="space-y-1">
                    <div className={`flex justify-between text-[10px] font-medium ${
                      theme === 'dark' ? 'text-zinc-400' : 'text-zinc-700'
                    }`}>
                      <span>{muscle.name}</span>
                      <span className="font-mono">{muscle.val}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden border ${
                      theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-zinc-200 border-zinc-300'
                    }`}>
                      <div 
                        className={`h-full ${muscle.accent}`} 
                        style={{ width: `${muscle.val}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Joint Metrics breakdown details */}
          <div className={`border rounded-2xl p-4.5 space-y-3 ${
            theme === 'dark' ? 'bg-zinc-900/40 border-white/5' : 'bg-zinc-100/50 border-zinc-200'
          }`}>
            <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">JOINT TELEMETRY READOUTS</span>
            
            <div className="grid grid-cols-2 gap-3.5 font-mono text-[10px]">
              <div>
                <span className="text-zinc-500 block uppercase text-[8px]">Spine tilt</span>
                <span className={`font-black ${
                  metrics.spineAngle > 40 
                    ? 'text-red-500' 
                    : (theme === 'dark' ? 'text-white' : 'text-zinc-800')
                }`}>
                  {metrics.spineAngle}°
                </span>
              </div>
              
              <div>
                <span className="text-zinc-500 block uppercase text-[8px]">Knee Angle</span>
                <span className={`font-black ${
                  metrics.kneeAngle < 110 && exercise === 'squat' 
                    ? 'text-orange-400' 
                    : (theme === 'dark' ? 'text-white' : 'text-zinc-800')
                }`}>
                  {metrics.kneeAngle}°
                </span>
              </div>

              <div>
                <span className="text-zinc-500 block uppercase text-[8px]">Elbow flexion</span>
                <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
                  {metrics.elbowAngle}°
                </span>
              </div>

              <div>
                <span className="text-zinc-500 block uppercase text-[8px]">REP PHASE</span>
                <span className="font-black text-brand-lime">
                  {metrics.phase}%
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Real-time Diagnostics Terminal Log */}
        <div className={`mt-6 pt-4 border-t space-y-2 w-full ${
          theme === 'dark' ? 'border-white/5' : 'border-zinc-200'
        }`}>
          <span className="text-[9px] text-zinc-550 font-mono font-bold uppercase tracking-wider block flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-brand-lime" />
            DIAGNOSTICS LIVE CONSOLE
          </span>
          
          <div className={`border rounded-xl p-3 h-28 overflow-y-auto font-mono text-[9px] space-y-1.5 scrollbar-thin ${
            theme === 'dark' ? 'bg-black border-white/5 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
          }`}>
            <AnimatePresence>
              {logs.map((log, idx) => {
                let colorClass = theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600';
                if (log.includes('[SYSTEM]')) colorClass = 'text-brand-cyan font-bold';
                else if (log.includes('[OK]')) colorClass = 'text-brand-lime';
                else if (log.includes('[WARN]')) colorClass = 'text-red-400 font-bold';
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`leading-normal ${colorClass}`}
                  >
                    {log}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}

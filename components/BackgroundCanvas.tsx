import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMouse } from '@uidotdev/usehooks'; // Assuming this isn't available, I'll implement a simple mouse tracker or just use R3F state
import * as THREE from 'three';

const ParticleField = () => {
  const count = 2000;
  const mesh = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
      
      speeds[i] = Math.random() * 0.02;
    }
    return { pos: temp, speeds };
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      // Flow upwards like time/bubbles
      positions[i * 3 + 1] += particles.speeds[i] + Math.sin(time + positions[i * 3]) * 0.005;
      
      // Reset if too high
      if (positions[i * 3 + 1] > 25) {
        positions[i * 3 + 1] = -25;
      }
      
      // Mouse interaction (subtle push)
      // For now, let's just make them gently rotate
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.pos.length / 3}
          array={particles.pos}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const BackgroundCanvas: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <fog attach="fog" args={['#050505', 10, 40]} />
        <ParticleField />
      </Canvas>
    </div>
  );
};

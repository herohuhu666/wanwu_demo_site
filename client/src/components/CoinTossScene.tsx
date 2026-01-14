import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ThreeDCoin } from './ThreeDCoin';
import * as THREE from 'three';

interface CoinTossSceneProps {
  isShaking: boolean;
  onShakeEnd: (results: number[]) => void; // 0 for Yin (Tail), 1 for Yang (Head)
}

export default function CoinTossScene({ isShaking, onShakeEnd }: CoinTossSceneProps) {
  const [coins, setCoins] = useState([
    { 
      position: [0, 1, 0] as [number, number, number], 
      rotation: [Math.PI / 2, 0, 0] as [number, number, number],
      velocity: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5] as [number, number, number],
      angularVelocity: [Math.random(), Math.random(), Math.random()] as [number, number, number]
    },
    { 
      position: [-1.5, -1, 0] as [number, number, number], 
      rotation: [Math.PI / 2, 0, 0] as [number, number, number],
      velocity: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5] as [number, number, number],
      angularVelocity: [Math.random(), Math.random(), Math.random()] as [number, number, number]
    },
    { 
      position: [1.5, -1, 0] as [number, number, number], 
      rotation: [Math.PI / 2, 0, 0] as [number, number, number],
      velocity: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5] as [number, number, number],
      angularVelocity: [Math.random(), Math.random(), Math.random()] as [number, number, number]
    }
  ]);

  useEffect(() => {
    if (isShaking) {
      // Randomize velocities when shaking starts
      setCoins(prev => prev.map(coin => ({
        ...coin,
        velocity: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
        angularVelocity: [Math.random() * 5, Math.random() * 5, Math.random() * 5]
      })));
    } else {
      // Determine final positions when shaking stops
      const results = coins.map(() => Math.random() > 0.5 ? 1 : 0);
      
      // Animate to final resting state
      // Head (Yang): Z-axis up (rotation x = 0)
      // Tail (Yin): Z-axis down (rotation x = PI)
      // Note: Our cylinder is rotated X=90deg by default geometry, so:
      // Face up: Rotation X = 0
      // Face down: Rotation X = PI
      
      const finalCoins = coins.map((coin, index) => {
        const isHead = results[index] === 1;
        return {
          ...coin,
          position: [
            index === 0 ? 0 : index === 1 ? -1.2 : 1.2, // Spread out horizontally
            index === 0 ? 1 : -1, // Triangle formation
            0
          ] as [number, number, number],
          rotation: [
            isHead ? 0 : Math.PI, 
            Math.random() * Math.PI * 2, // Random Z rotation
            0
          ] as [number, number, number],
          velocity: [0, 0, 0] as [number, number, number],
          angularVelocity: [0, 0, 0] as [number, number, number]
        };
      });
      
      setCoins(finalCoins);
      onShakeEnd(results);
    }
  }, [isShaking]);

  return (
    <div className="w-full h-64 relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          {coins.map((coin, index) => (
            <ThreeDCoin 
              key={index}
              position={coin.position}
              rotation={coin.rotation}
              isShaking={isShaking}
              velocity={coin.velocity}
              angularVelocity={coin.angularVelocity}
            />
          ))}
        </Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

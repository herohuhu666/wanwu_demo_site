import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Coin Component
function Coin({ position, rotation, texture, visible }: { position: [number, number, number], rotation: [number, number, number], texture: THREE.Texture, visible: boolean }) {
  if (!visible) return null;
  
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
      <meshStandardMaterial map={texture} metalness={0.8} roughness={0.4} color="#FFD700" />
    </mesh>
  );
}

// Turtle Shell Component (represented as a 3D plane with texture for now)
function TurtleShell({ isShaking, onShakeEnd, texture }: { isShaking: boolean, onShakeEnd: () => void, texture: THREE.Texture }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shakeTime = useRef(0);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    if (isShaking) {
      shakeTime.current += delta * 20;
      // Violent shake
      meshRef.current.rotation.z = Math.sin(shakeTime.current) * 0.3;
      meshRef.current.rotation.x = Math.cos(shakeTime.current * 1.5) * 0.2;
      meshRef.current.position.x = Math.sin(shakeTime.current * 2) * 0.2;
      meshRef.current.position.y = Math.cos(shakeTime.current * 2.5) * 0.2;
    } else {
      // Reset smoothly
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
    }
  });

  return (
    <mesh ref={meshRef} scale={[3, 3, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Main Scene Component
function Scene({ isShaking, onFinish }: { isShaking: boolean, onFinish: () => void }) {
  const shellTexture = useTexture('/images/turtle_shell.png');
  const coinTexture = useTexture('/images/coin_texture.png');
  
  const [coinsVisible, setCoinsVisible] = useState(false);
  const [coinPositions, setCoinPositions] = useState<[number, number, number][]>([
    [-0.5, -2, 0],
    [0, -2.5, 0],
    [0.5, -2, 0]
  ]);
  const [coinRotations, setCoinRotations] = useState<[number, number, number][]>([
    [Math.PI / 2, 0, 0],
    [Math.PI / 2, 0, 0],
    [Math.PI / 2, 0, 0]
  ]);

  useEffect(() => {
    if (!isShaking && coinsVisible) {
      // Reset for next time
      setCoinsVisible(false);
    }
    
    if (isShaking) {
      // Hide coins while shaking
      setCoinsVisible(false);
      
      // Schedule coin drop after shaking stops (simulated by parent passing isShaking=false)
      // Actually, the parent controls isShaking. We need to detect when isShaking goes from true to false.
    }
  }, [isShaking]);

  // Detect shake end
  const prevShaking = useRef(isShaking);
  useEffect(() => {
    if (prevShaking.current && !isShaking) {
      // Shake just ended, drop coins
      setCoinsVisible(true);
      
      // Randomize coin results (visual only, logic is in parent)
      const newRotations = coinRotations.map(() => [
        Math.PI / 2 + (Math.random() > 0.5 ? 0 : Math.PI), // Flip
        Math.random() * Math.PI * 2, // Rotate
        0
      ] as [number, number, number]);
      setCoinRotations(newRotations);

      // Randomize positions slightly
      const newPositions = coinPositions.map(pos => [
        pos[0] + (Math.random() - 0.5) * 0.5,
        pos[1] + (Math.random() - 0.5) * 0.5,
        pos[2]
      ] as [number, number, number]);
      setCoinPositions(newPositions);

      // Notify parent animation finished after a delay
      setTimeout(onFinish, 2000);
    }
    prevShaking.current = isShaking;
  }, [isShaking]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="sunset" />

      <TurtleShell isShaking={isShaking} onShakeEnd={() => {}} texture={shellTexture} />
      
      {coinsVisible && coinPositions.map((pos, i) => (
        <Coin 
          key={i} 
          position={pos} 
          rotation={coinRotations[i]} 
          texture={coinTexture} 
          visible={true} 
        />
      ))}
    </>
  );
}

export default function RitualCanvas({ isShaking, onFinish }: { isShaking: boolean, onFinish: () => void }) {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      <Canvas gl={{ alpha: true, antialias: true }}>
        <Scene isShaking={isShaking} onFinish={onFinish} />
      </Canvas>
    </div>
  );
}

import { useRef, useState, useEffect, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Simple Error Boundary for 3D context
class ThreeErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode, fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("3D Scene Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

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

// Turtle Shell Component
function TurtleShell({ isShaking, texture }: { isShaking: boolean, texture: THREE.Texture }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shakeTime = useRef(0);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    if (isShaking) {
      shakeTime.current += delta * 20;
      // Violent shake
      meshRef.current.rotation.z = Math.sin(shakeTime.current * 15) * 0.5;
      meshRef.current.rotation.x = Math.cos(shakeTime.current * 12) * 0.3;
      meshRef.current.position.x = Math.sin(shakeTime.current * 20) * 0.3;
      meshRef.current.position.y = Math.cos(shakeTime.current * 18) * 0.3;
    } else {
      // Reset smoothly
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
    }
  });

  return (
    <mesh ref={meshRef} scale={[3.5, 3.5, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Main Scene Component
function Scene({ isShaking, onFinish }: { isShaking: boolean, onFinish: () => void }) {
  // Preload textures to avoid suspense issues during render if possible, 
  // but useTexture inside component is standard.
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

  // Detect shake end
  const prevShaking = useRef(isShaking);
  useEffect(() => {
    if (prevShaking.current && !isShaking) {
      // Shake just ended, drop coins
      setCoinsVisible(true);
      
      // Randomize coin results
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
    } else if (isShaking) {
      setCoinsVisible(false);
    }
    prevShaking.current = isShaking;
  }, [isShaking]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="sunset" />

      <TurtleShell isShaking={isShaking} texture={shellTexture} />
      
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
      <ThreeErrorBoundary fallback={<div className="w-full h-full flex items-center justify-center text-white/50">3D View Unavailable</div>}>
        <Canvas gl={{ alpha: true, antialias: true }}>
          <Scene isShaking={isShaking} onFinish={onFinish} />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}

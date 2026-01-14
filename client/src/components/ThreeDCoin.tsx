import { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface ThreeDCoinProps {
  position: [number, number, number];
  rotation: [number, number, number];
  isShaking: boolean;
  velocity: [number, number, number];
  angularVelocity: [number, number, number];
}

export function ThreeDCoin({ position, rotation, isShaking, velocity, angularVelocity }: ThreeDCoinProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, '/images/coin_texture.png');

  // Create a cylinder geometry for the coin
  // Radius: 1, Height (thickness): 0.1, RadialSegments: 32
  const geometry = new THREE.CylinderGeometry(1, 1, 0.1, 32);
  
  // Rotate geometry so the flat side faces Z axis by default
  geometry.rotateX(Math.PI / 2);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
      meshRef.current.rotation.set(...rotation);
    }
  }, [position, rotation]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isShaking) {
      // Apply velocity and angular velocity
      meshRef.current.position.x += velocity[0] * delta * 5;
      meshRef.current.position.y += velocity[1] * delta * 5;
      meshRef.current.position.z += velocity[2] * delta * 5;

      meshRef.current.rotation.x += angularVelocity[0] * delta * 5;
      meshRef.current.rotation.y += angularVelocity[1] * delta * 5;
      meshRef.current.rotation.z += angularVelocity[2] * delta * 5;

      // Boundary checks to keep coins in view
      if (meshRef.current.position.x > 2 || meshRef.current.position.x < -2) velocity[0] *= -1;
      if (meshRef.current.position.y > 3 || meshRef.current.position.y < -3) velocity[1] *= -1;
      if (meshRef.current.position.z > 2 || meshRef.current.position.z < -2) velocity[2] *= -1;
    } else {
      // Smoothly return to resting position or settle
      // For now, we rely on the parent to set the final position/rotation
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <cylinderGeometry args={[1, 1, 0.1, 32]} />
      <meshStandardMaterial 
        map={texture} 
        transparent={true}
        metalness={0.8}
        roughness={0.3}
        color="#FFD700"
      />
    </mesh>
  );
}

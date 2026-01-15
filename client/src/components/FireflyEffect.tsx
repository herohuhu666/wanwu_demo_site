import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export function FireflyEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firefliesRef = useRef<Firefly[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Initialize fireflies
    const count = 30; // Number of "other users"
    firefliesRef.current = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1, // 1-3px
      opacity: Math.random() * 0.5 + 0.2,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    // Animation loop
    const animate = (time: number) => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      firefliesRef.current.forEach(fly => {
        // Move
        fly.x += fly.speedX;
        fly.y += fly.speedY;

        // Wrap around screen
        if (fly.x < 0) fly.x = canvas.width;
        if (fly.x > canvas.width) fly.x = 0;
        if (fly.y < 0) fly.y = canvas.height;
        if (fly.y > canvas.height) fly.y = 0;

        // Pulse opacity
        const pulse = Math.sin(time * 0.002 * fly.pulseSpeed + fly.pulseOffset);
        const currentOpacity = fly.opacity + pulse * 0.2;

        // Draw
        ctx.beginPath();
        ctx.arc(fly.x, fly.y, fly.size, 0, Math.PI * 2);
        
        // Glow effect
        const gradient = ctx.createRadialGradient(fly.x, fly.y, 0, fly.x, fly.y, fly.size * 4);
        gradient.addColorStop(0, `rgba(255, 215, 0, ${Math.max(0, currentOpacity)})`); // Gold center
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)'); // Transparent edge
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

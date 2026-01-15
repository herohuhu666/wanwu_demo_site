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
    // Increased count and size for better visibility
    const count = 60; // Increased from 30 to 60
    firefliesRef.current = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 2, // Increased from 1-3px to 2-5px
      opacity: Math.random() * 0.6 + 0.4, // Increased base opacity
      speedX: (Math.random() - 0.5) * 0.3, // Slightly faster movement
      speedY: (Math.random() - 0.5) * 0.3,
      pulseSpeed: Math.random() * 0.03 + 0.02,
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
        if (fly.x < -20) fly.x = canvas.width + 20;
        if (fly.x > canvas.width + 20) fly.x = -20;
        if (fly.y < -20) fly.y = canvas.height + 20;
        if (fly.y > canvas.height + 20) fly.y = -20;

        // Pulse opacity
        const pulse = Math.sin(time * 0.002 * fly.pulseSpeed + fly.pulseOffset);
        const currentOpacity = fly.opacity + pulse * 0.3;

        // Draw
        ctx.beginPath();
        // Draw larger glow area
        const gradient = ctx.createRadialGradient(fly.x, fly.y, 0, fly.x, fly.y, fly.size * 6);
        gradient.addColorStop(0, `rgba(255, 215, 0, ${Math.max(0, currentOpacity)})`); // Gold center
        gradient.addColorStop(0.4, `rgba(255, 165, 0, ${Math.max(0, currentOpacity * 0.5)})`); // Orange mid
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)'); // Transparent edge
        
        ctx.fillStyle = gradient;
        ctx.arc(fly.x, fly.y, fly.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw core for sharpness
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 200, ${Math.max(0, currentOpacity)})`;
        ctx.arc(fly.x, fly.y, fly.size * 0.5, 0, Math.PI * 2);
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
      className="absolute inset-0 pointer-events-none z-10" 
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

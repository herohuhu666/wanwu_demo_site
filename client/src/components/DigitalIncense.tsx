import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DigitalIncenseProps {
  progress: number; // 0 to 1, where 1 is fully burnt
}

export function DigitalIncense({ progress }: DigitalIncenseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{x: number, y: number, vx: number, vy: number, life: number, size: number}[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set resolution
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Incense Stick Base
      const stickX = width / 2;
      const stickHeight = height * 0.6;
      const stickY = height * 0.8;
      
      // Draw unburnt part
      const currentHeight = stickHeight * (1 - progress);
      const burnY = stickY - currentHeight;

      // Draw stick
      ctx.beginPath();
      ctx.moveTo(stickX, stickY);
      ctx.lineTo(stickX, burnY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#8B4513'; // Brown
      ctx.stroke();

      // Draw burnt ash (bottom part)
      if (progress > 0) {
        ctx.beginPath();
        ctx.moveTo(stickX, stickY);
        ctx.lineTo(stickX, stickY - (stickHeight * progress)); // This logic is slightly off visually, let's simplify:
        // Actually, the stick just gets shorter. The bottom is fixed.
      }

      // Draw glowing tip
      if (progress < 1) {
        const glowSize = 2 + Math.random() * 2;
        const gradient = ctx.createRadialGradient(stickX, burnY, 0, stickX, burnY, glowSize);
        gradient.addColorStop(0, '#FF4500'); // Orange Red
        gradient.addColorStop(0.5, '#FFD700'); // Gold
        gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(stickX, burnY, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Generate Smoke Particles
        if (Math.random() > 0.3) {
          particlesRef.current.push({
            x: stickX,
            y: burnY - 2,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.5 - Math.random() * 0.5,
            life: 1.0,
            size: 1 + Math.random() * 2
          });
        }
      }

      // Update and Draw Smoke
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;
        p.size += 0.05;
        
        // Perlin-like noise movement (simplified)
        p.vx += (Math.sin(p.y * 0.05 + frameRef.current * 0.02) * 0.02);

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(200, 200, 200, ${p.life * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current++;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [progress]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
      {/* Base Holder */}
      <div className="absolute bottom-[15%] w-8 h-2 bg-[#3a3a3a] rounded-full shadow-lg" />
    </div>
  );
}

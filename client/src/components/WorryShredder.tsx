import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, Wind } from 'lucide-react';
import { toast } from 'sonner';

interface WorryShredderProps {
  onClose: () => void;
}

export function WorryShredder({ onClose }: WorryShredderProps) {
  const [worry, setWorry] = useState("");
  const [isShredding, setIsShredding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleShred = () => {
    if (!worry.trim()) return;
    setIsShredding(true);

    // Particle Animation Logic
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Setup canvas
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        ctx.scale(dpr, dpr);

        // Create particles from text (simulation)
        const particles: {x: number, y: number, vx: number, vy: number, alpha: number}[] = [];
        for (let i = 0; i < 200; i++) {
          particles.push({
            x: canvas.clientWidth / 2,
            y: canvas.clientHeight / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            alpha: 1
          });
        }

        const animate = () => {
          ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
          let activeParticles = 0;

          particles.forEach(p => {
            if (p.alpha > 0) {
              p.x += p.vx;
              p.y += p.vy;
              p.alpha -= 0.02;
              activeParticles++;

              ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
              ctx.fillRect(p.x, p.y, 2, 2);
            }
          });

          if (activeParticles > 0) {
            requestAnimationFrame(animate);
          } else {
            setIsCompleted(true);
            toast.success("烦恼已随风而散");
          }
        };
        animate();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
      >
        <X className="w-8 h-8" />
      </button>

      {!isCompleted ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md flex flex-col items-center"
        >
          <div className="mb-8 text-center">
            <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
              <Trash2 className="w-8 h-8 text-white/60" />
            </div>
            <h2 className="text-2xl font-kai text-white tracking-[0.2em] mb-2">烦恼粉碎机</h2>
            <p className="text-xs text-white/40 tracking-widest">写下即放下</p>
          </div>

          <div className="w-full relative mb-8">
            {!isShredding ? (
              <textarea
                value={worry}
                onChange={(e) => setWorry(e.target.value)}
                placeholder="在此写下你的焦虑、恐惧或烦恼..."
                className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder-white/20 resize-none focus:outline-none focus:border-white/30 transition-colors text-center leading-loose font-kai"
              />
            ) : (
              <canvas 
                ref={canvasRef}
                className="w-full h-48 rounded-2xl"
              />
            )}
          </div>

          {!isShredding && (
            <button
              onClick={handleShred}
              disabled={!worry.trim()}
              className="px-12 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full tracking-[0.3em] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
            >
              放下
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFD700]/20">
            <Wind className="w-10 h-10 text-[#FFD700]" />
          </div>
          <h3 className="text-xl text-white font-kai tracking-widest mb-4">本来无一物，何处惹尘埃</h3>
          <p className="text-sm text-white/60 mb-12 tracking-wider">烦恼已散，心如明镜</p>
          
          <button
            onClick={onClose}
            className="px-8 py-3 border border-white/20 rounded-full text-white/60 hover:text-white hover:border-white/40 transition-colors tracking-widest text-sm"
          >
            回归当下
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

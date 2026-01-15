import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { X } from 'lucide-react';

interface CyberWoodenFishProps {
  onClose: () => void;
}

export function CyberWoodenFish({ onClose }: CyberWoodenFishProps) {
  const { addMerit } = useUser();
  const [count, setCount] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [meritPopups, setMeritPopups] = useState<{ id: number; x: number; y: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/wooden_fish.wav');
  }, []);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid double tap on some devices
    // e.preventDefault(); 

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    // Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Add merit logic (capped to avoid spamming too much merit, but for fun let's give 1 per tap)
    addMerit(1, 'wooden_fish', '电子木鱼');
    setCount(prev => prev + 1);

    // Visual effects
    const id = Date.now();
    setRipples(prev => [...prev, { id, x: clientX, y: clientY }]);
    setMeritPopups(prev => [...prev, { id, x: clientX, y: clientY - 50 }]);

    // Cleanup
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
      setMeritPopups(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors z-50"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Counter */}
      <div className="absolute top-20 text-center z-10 pointer-events-none">
        <p className="text-white/40 text-xs tracking-[0.5em] uppercase mb-2">Merit Accumulation</p>
        <p className="text-6xl font-variant-numeric text-[#FFD700] font-light tracking-widest drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
          {count}
        </p>
      </div>

      {/* Wooden Fish Visual */}
      <div 
        className="relative w-64 h-64 cursor-pointer z-20"
        onClick={handleTap}
      >
        {/* The "Fish" - Abstract Representation */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="w-full h-full rounded-full bg-[#1C1C1C] border border-[#FFD700]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-hidden group"
        >
          {/* Inner texture */}
          <div className="absolute inset-0 bg-[url('/images/wood_texture.png')] opacity-20 mix-blend-overlay" />
          
          {/* Center Symbol */}
          <div className="text-[#FFD700]/80 text-4xl font-serif select-none pointer-events-none">
            功德
          </div>
          
          {/* Glow on hover */}
          <div className="absolute inset-0 bg-[#FFD700]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
      </div>

      {/* Ripples */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ width: 0, height: 0, opacity: 0.8, x: ripple.x, y: ripple.y }}
            animate={{ 
              width: 500, 
              height: 500, 
              opacity: 0,
              x: ripple.x - 250, // Center the ripple
              y: ripple.y - 250 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed rounded-full border border-[#FFD700]/30 pointer-events-none z-10"
          />
        ))}
      </AnimatePresence>

      {/* Merit Popups */}
      <AnimatePresence>
        {meritPopups.map(popup => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 1, y: popup.y, x: popup.x }}
            animate={{ opacity: 0, y: popup.y - 100 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed text-[#FFD700] font-kai text-xl pointer-events-none z-30 font-bold tracking-widest"
            style={{ transform: 'translateX(-50%)' }} // Center text horizontally
          >
            功德 +1
          </motion.div>
        ))}
      </AnimatePresence>

      <p className="absolute bottom-12 text-white/20 text-xs tracking-widest pointer-events-none">
        点击敲击 · 积攒功德
      </p>
    </motion.div>
  );
}

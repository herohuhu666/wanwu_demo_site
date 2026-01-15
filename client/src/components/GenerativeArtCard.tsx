import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface GenerativeArtCardProps {
  state: 'steady' | 'advance' | 'retreat';
  seed: string; // Use question or timestamp as seed
  title?: string;
}

export function GenerativeArtCard({ state, seed, title = "心境映照" }: GenerativeArtCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Seeded random function
    let seedValue = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = () => {
      const x = Math.sin(seedValue++) * 10000;
      return x - Math.floor(x);
    };

    // Color Palettes based on state
    const palettes = {
      steady: ['#E0D6C8', '#8B7E66', '#4A4A4A', '#1C1C1C'], // Earth/Metal (Calm)
      advance: ['#FFD700', '#FF4500', '#8B0000', '#2F1B1B'], // Fire/Gold (Active)
      retreat: ['#87CEEB', '#4682B4', '#191970', '#000000'], // Water/Deep (Introspective)
    };
    
    const colors = palettes[state];

    // Clear canvas
    ctx.fillStyle = colors[3]; // Darkest background
    ctx.fillRect(0, 0, width, height);

    // Draw Abstract Flow
    const particles = 50;
    
    ctx.globalCompositeOperation = 'screen'; // Additive blending for glowing effect

    for (let i = 0; i < particles; i++) {
      const x = random() * width;
      const y = random() * height;
      const size = random() * 100 + 50;
      const color = colors[Math.floor(random() * 3)]; // Pick from first 3 colors

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `${color}88`); // Semi-transparent
      gradient.addColorStop(1, `${color}00`); // Transparent

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add some "Structure" lines
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = `${colors[0]}44`;
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.moveTo(random() * width, 0);
      ctx.bezierCurveTo(
        random() * width, random() * height,
        random() * width, random() * height,
        random() * width, height
      );
    }
    ctx.stroke();

    // Add Noise/Texture
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

  }, [state, seed]);

  const handleSave = () => {
    toast.success("心境画卷已保存至相册");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm text-white/80 font-kai tracking-widest">{title}</h3>
        <div className="flex gap-2">
          <button onClick={handleSave} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Download className="w-4 h-4 text-white/60" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Share2 className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>
      
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-inner bg-black/20">
        <canvas 
          ref={canvasRef}
          className="w-full h-full object-cover"
        />
        
        {/* Watermark */}
        <div className="absolute bottom-3 right-3 opacity-50">
          <p className="text-[10px] text-white font-serif tracking-widest">万物 WANWU</p>
        </div>
      </div>
      
      <p className="mt-3 text-[10px] text-white/40 text-center tracking-wider">
        此画由心而生，独一无二
      </p>
    </motion.div>
  );
}

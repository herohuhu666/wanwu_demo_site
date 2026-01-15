import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, Wind, CloudRain, Flame, Mountain, Waves, Clock } from "lucide-react";
import { useUser } from "../contexts/UserContext";

const SOUND_THEMES = [
  { id: "wood", name: "林间风声", icon: Wind, color: "#4ADE80", desc: "疏肝理气，提升创造力" },
  { id: "fire", name: "炉火纯青", icon: Flame, color: "#F87171", desc: "振奋精神，激发行动力" },
  { id: "earth", name: "山谷回响", icon: Mountain, color: "#FBBF24", desc: "厚德载物，增强稳定性" },
  { id: "metal", name: "金石之音", icon: Volume2, color: "#94A3B8", desc: "收敛心神，提升专注度" },
  { id: "water", name: "深海潜流", icon: Waves, color: "#60A5FA", desc: "滋养智慧，深度思考" },
];

export default function FocusSoundscapes() {
  const { addMerit } = useUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTheme, setActiveTheme] = useState(SOUND_THEMES[3]); // Default: Metal (Focus)
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Audio ref (mock)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setIsPlaying(false);
      addMerit(5, "guardian", "完成一次专注修行");
      // Play completion chime (mock)
      alert("专注修行完成，功德+5");
      setTimeLeft(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setIsTimerActive(false);
      // audioRef.current?.pause();
    } else {
      setIsPlaying(true);
      setIsTimerActive(true);
      // audioRef.current?.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-20 transition-colors duration-1000 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${activeTheme.color}, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-kai text-white tracking-widest flex items-center gap-2">
              <activeTheme.icon className="w-5 h-5" style={{ color: activeTheme.color }} />
              专注声景
            </h2>
            <p className="text-xs text-white/40 mt-1">{activeTheme.desc}</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-black/20 border border-white/10 flex items-center gap-2">
            <Clock className="w-3 h-3 text-white/60" />
            <span className="text-xs font-mono text-white/80">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="flex justify-between mb-8 px-2">
          {SOUND_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme)}
              className={`flex flex-col items-center gap-2 transition-all ${
                activeTheme.id === theme.id ? "opacity-100 scale-110" : "opacity-40 hover:opacity-80"
              }`}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors"
                style={{ 
                  borderColor: activeTheme.id === theme.id ? theme.color : "rgba(255,255,255,0.1)",
                  backgroundColor: activeTheme.id === theme.id ? `${theme.color}20` : "transparent"
                }}
              >
                <theme.icon className="w-5 h-5" style={{ color: activeTheme.id === theme.id ? theme.color : "white" }} />
              </div>
              <span className="text-[10px] text-white tracking-wider">{theme.name.slice(0, 2)}</span>
            </button>
          ))}
        </div>

        {/* Main Control */}
        <div className="flex justify-center">
          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 group relative"
          >
            {isPlaying && (
              <span className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-50" />
            )}
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white fill-white" />
            ) : (
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

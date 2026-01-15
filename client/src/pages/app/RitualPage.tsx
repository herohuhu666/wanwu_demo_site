import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Lock, Zap, Hand, Volume2, VolumeX } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { getHexagram } from "@/lib/knowledge_base";
import RitualCanvas from "@/components/RitualCanvas";
import { AudioAnchor } from "@/components/AudioAnchor";

// Yao type: 0 for Yin, 1 for Yang
type Yao = 0 | 1;

export default function RitualPage() {
  const { isMember, addRitualRecord, updateEnergyState, coreStructure } = useUser();
  const [mode, setMode] = useState<'manual' | 'auto' | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [yaos, setYaos] = useState<Yao[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [result, setResult] = useState<null | {
    gua: string;
    name: string;
    desc: string;
    wisdom: string;
    structure: string;
    tag: string;
    yaos: Yao[];
    element: string;
    lines?: string[];
  }>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/sounds/coins_rattle.mp3");
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playSound = () => {
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleManualShake = () => {
    if (isShaking || yaos.length >= 6) return;
    
    // Switch to 3D mode immediately
    setShow3D(true);
    setIsShaking(true);
    playSound();
    
    // Simulate shaking duration
    setTimeout(() => {
      setIsShaking(false);
      stopSound();
      // The 3D component will detect isShaking change and call onFinish after animation
    }, 2000);
  };

  const handle3DFinish = () => {
    console.log("3D Finish Triggered");
    // Weighted Yao Generation based on Energy
    let yangProb = 0.5;
    if (coreStructure?.currentEnergy) {
      const e = coreStructure.currentEnergy;
      const total = e.wood + e.fire + e.earth + e.metal + e.water;
      if (total > 0) {
        // Yang elements: Wood, Fire, Metal (Active/Hard)
        // Yin elements: Water, Earth (Passive/Soft)
        const yangScore = e.wood + e.fire + e.metal;
        yangProb = yangScore / total;
        // Clamp probability to keep it somewhat random (0.2 - 0.8)
        yangProb = Math.max(0.2, Math.min(0.8, yangProb));
      }
    }

    const newYao: Yao = Math.random() < yangProb ? 1 : 0;
    const newYaos: Yao[] = [...yaos, newYao];
    setYaos(newYaos);

    if (newYaos.length === 6) {
      generateResult(newYaos);
      
      // Update Energy State
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 22 || hour < 5) {
        updateEnergyState('ritual_late');
      } else {
        updateEnergyState('ritual_frequent');
      }

      // Hide 3D after a short delay to show result
      setTimeout(() => setShow3D(false), 1000);
    } else {
      // Keep 3D visible for next shake? Or hide it?
      // Requirement says: "After coins land... show result panel... then hide 3D"
      // Since we need 6 shakes, we should probably keep 3D or revert to 2D between shakes?
      // The requirement says "Ritual End: ... automatically unload or hide 3D Canvas, restore to Idle State"
      // This implies 3D might be transient per shake or persist until full hexagram.
      // Let's keep it simple: Hide 3D after each shake result is processed to return to "Idle" state for next shake.
      setTimeout(() => setShow3D(false), 2000);
    }
  };

  const handleAutoShake = () => {
    if (isShaking) return;
    setShow3D(true);
    setIsShaking(true);
    playSound();
    
    // Simulate quick generation
    setTimeout(() => {
      stopSound();
      setIsShaking(false);
      // handle3DFinish will be called by RitualCanvas
    }, 2500);
  };

  const generateResult = (finalYaos: Yao[]) => {
    // Convert yaos to binary string (bottom to top)
    const binary = finalYaos.join('');
    const hexagram = getHexagram(binary);
    
    if (!hexagram) {
      toast.error("卦象生成失败，请重试");
      return;
    }

    const newResult = {
      gua: finalYaos.map(y => y === 1 ? '—' : '--').reverse().join('\n'),
      name: hexagram.name,
      desc: hexagram.judgment,
      wisdom: `象曰：${hexagram.image}\n\n${hexagram.keywords?.join(' · ') || ''}`,
      structure: `五行属性：${hexagram.element === 'metal' ? '金' : hexagram.element === 'wood' ? '木' : hexagram.element === 'water' ? '水' : hexagram.element === 'fire' ? '火' : '土'}`,
      tag: hexagram.keywords?.[0] || '吉',
      yaos: finalYaos,
      element: hexagram.element,
      lines: hexagram.lines // Add lines for member deep analysis
    };

    setResult(newResult);
    
    // Save to archive
    addRitualRecord({
      hexagramId: hexagram.id,
      hexagramName: hexagram.name,
      yaos: finalYaos,
      question: "每日一卦",
      note: newResult.desc
    });
  };

  const resetRitual = () => {
    setYaos([]);
    setResult(null);
    setMode(null);
    setShow3D(false);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-white/90 bg-black">
      {/* 背景图片 (Persistent Layer) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/qiankun_bg.png" 
          alt="Qiankun Background" 
          className="w-full h-full object-cover opacity-60"
        />
        {/* 渐变遮罩，确保文字可读性 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      {/* 听觉锚点：古刹琴音 */}
      <AudioAnchor src="/sounds/temple_drone.mp3" volume={0.15} />

      {/* 3D Canvas Layer (Conditional) */}
      <AnimatePresence>
        {show3D && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10"
          >
            <Suspense fallback={<div className="absolute inset-0 z-50 flex items-center justify-center text-white/50">Loading 3D Assets...</div>}>
              <RitualCanvas isShaking={isShaking} onFinish={handle3DFinish} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-24 overflow-y-auto scrollbar-hide pointer-events-none">
        {/* Enable pointer events for interactive elements */}
        
        {/* 顶部栏 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-start pointer-events-auto"
        >
          <div>
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2 font-kai text-white drop-shadow-lg">乾坤</h1>
            <p className="text-xs text-white/60 tracking-[0.3em] uppercase drop-shadow-md">Ritual</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-white/60" />}
            </button>
            {(yaos.length > 0 || mode) && !result && (
              <button 
                onClick={resetRitual}
                className="p-2 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <RefreshCw className="w-4 h-4 text-white/60" />
              </button>
            )}
          </div>
        </motion.div>

        {/* 核心交互区 */}
        <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto">
          <AnimatePresence mode="wait">
            {!mode ? (
              // 模式选择
              <motion.div
                key="mode-select"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col gap-6 w-full max-w-xs"
              >
                <button
                  onClick={() => setMode('manual')}
                  className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 hover:border-[#FFD700]/30 transition-all backdrop-blur-sm shadow-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-kai tracking-widest text-white/90">手动六摇</span>
                    <Hand className="w-5 h-5 text-[#FFD700] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-white/60 tracking-wide">诚心正意，手摇六次成卦</p>
                </button>

                <button
                  onClick={() => {
                    setMode('auto');
                    handleAutoShake();
                  }}
                  className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 hover:border-[#FFD700]/30 transition-all backdrop-blur-sm shadow-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-kai tracking-widest text-white/90">一键起卦</span>
                    <Zap className="w-5 h-5 text-[#FFD700] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-white/60 tracking-wide">灵机一动，快速感应成卦</p>
                </button>
              </motion.div>
            ) : !result ? (
              // 起卦过程
              <motion.div
                key="shaking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center w-full"
              >
                {/* 爻象展示区 */}
                <div className="h-48 flex flex-col-reverse justify-center gap-3 mb-8 w-32">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-3 w-full rounded-sm transition-all duration-500 ${
                        i < yaos.length 
                          ? 'bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.3)]' 
                          : 'bg-white/5 border border-white/5'
                      }`}
                    >
                      {i < yaos.length && yaos[i] === 0 && (
                        <div className="w-8 h-full bg-black/80 mx-auto border-x border-black/80" /> // Yin Yao gap
                      )}
                    </div>
                  ))}
                </div>

                {/* 2D 触发器 (Idle State) - Only visible when NOT in 3D mode */}
                {!show3D && mode === 'manual' && (
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* 龟壳主体 (2D Static) */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleManualShake}
                      className="relative w-64 h-64 cursor-pointer transition-transform"
                    >
                      <img 
                        src="/images/turtle_shell.png" 
                        alt="Turtle Shell" 
                        className="w-full h-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                      />
                      
                      {/* 提示文字 */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.span 
                          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/90 tracking-widest border border-white/10 shadow-lg"
                        >
                          点击摇卦
                        </motion.span>
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {/* Placeholder for layout stability when 3D is active */}
                {show3D && <div className="w-64 h-64" />}
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-white tracking-[0.3em] font-medium mb-2 drop-shadow-md">
                    {isShaking ? "感应天地..." : mode === 'auto' ? "正在起卦..." : `第 ${yaos.length + 1} 摇`}
                  </p>
                  <p className="text-[10px] text-white/60 tracking-widest">
                    {yaos.length < 6 ? "诚心正意，静候卦成" : "卦象已成"}
                  </p>
                </div>
              </motion.div>
            ) : (
              // 结果展示
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full overflow-y-auto pb-20"
              >
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl text-center relative overflow-hidden">
                  {/* 装饰纹理 */}
                  <div className="absolute inset-0 opacity-10 bg-[url('/images/paper_texture.jpg')]" />

                  <div className="relative z-10">
                    <div className="mb-6">
                      {/* 极简卦象图 */}
                      <div className="w-16 mx-auto mb-4 flex flex-col-reverse gap-1">
                        {result.yaos.map((y, i) => (
                          <div key={i} className="h-1.5 w-full bg-[#FFD700] rounded-sm relative shadow-[0_0_5px_rgba(255,215,0,0.3)]">
                             {y === 0 && <div className="absolute left-1/2 -translate-x-1/2 w-4 h-full bg-black/80" />}
                          </div>
                        ))}
                      </div>
                      <h2 className="text-2xl font-medium tracking-[0.3em] text-white font-kai">{result.name}</h2>
                      <div className="mt-2 inline-block px-3 py-1 rounded-full border border-[#FFD700]/30 text-[10px] text-[#FFD700] tracking-widest">
                        {result.tag}
                      </div>
                    </div>

                    <div className="w-8 h-[1px] bg-white/10 mx-auto mb-6" />

                    <div className="space-y-8 text-left">
                      <div>
                        <p className="text-xs text-white/60 tracking-widest mb-2 uppercase flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#FFD700]" /> 卦辞
                        </p>
                        <p className="text-white/90 text-sm leading-loose tracking-wide font-kai">
                          {result.desc}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-white/60 tracking-widest mb-2 uppercase flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#FFD700]" /> 象曰
                        </p>
                        <p className="text-white/80 text-sm leading-loose tracking-wide font-light text-justify">
                          {result.wisdom}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-white/60 tracking-widest mb-2 uppercase flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#FFD700]" /> 结构
                        </p>
                        <p className="text-white/80 text-sm leading-loose tracking-wide font-light">
                          {result.structure}
                        </p>
                      </div>

                      {/* 会员深度解析 (Member Deep Analysis) */}
                      {isMember && result.lines && (
                        <div className="pt-6 border-t border-white/10">
                          <p className="text-xs text-[#FFD700]/80 tracking-widest mb-4 uppercase flex items-center gap-2">
                            <Lock className="w-3 h-3" /> 深度爻辞解析 (会员)
                          </p>
                          <div className="space-y-4">
                            {result.lines.map((line, idx) => (
                              <div key={idx} className="text-xs text-white/70 leading-relaxed">
                                <span className="text-[#FFD700]/60 mr-2">[{idx + 1}爻]</span>
                                {line}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {!isMember && (
                        <div className="pt-6 border-t border-white/10 text-center">
                          <p className="text-xs text-white/40 mb-2">解锁深度爻辞解析与趋势分析</p>
                          <button className="text-xs text-[#FFD700] border border-[#FFD700]/30 px-4 py-1 rounded-full hover:bg-[#FFD700]/10 transition-colors">
                            升级会员
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

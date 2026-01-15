import { useState, useRef, useEffect, Suspense } from "react";
import { RefreshCw, Lock, Zap, Hand, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { getHexagram } from "@/lib/knowledge_base";
import RitualCanvas from "@/components/RitualCanvas";
import { AudioAnchor } from "@/components/AudioAnchor";
import { trpc } from "@/lib/trpc";

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
    explanation?: string;
  }>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

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
    
    setIsShaking(true);
    playSound();
    
    // Simulate shaking duration
    setTimeout(() => {
      setIsShaking(false);
      stopSound();
      
      // Generate yao
      let yangProb = 0.5;
      if (coreStructure?.currentEnergy) {
        const e = coreStructure.currentEnergy;
        const total = e.wood + e.fire + e.earth + e.metal + e.water;
        if (total > 0) {
          const yangScore = e.wood + e.fire + e.metal;
          yangProb = yangScore / total;
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
      }
    }, 1500);
  };

  const handleAutoShake = async () => {
    if (isShaking) return;
    setMode('auto');
    setIsShaking(true);
    playSound();
    
    // Generate all 6 yaos automatically
    const newYaos: Yao[] = [];
    
    for (let i = 0; i < 6; i++) {
      // Calculate weighted probability based on energy
      let yangProb = 0.5;
      if (coreStructure?.currentEnergy) {
        const e = coreStructure.currentEnergy;
        const total = e.wood + e.fire + e.earth + e.metal + e.water;
        if (total > 0) {
          const yangScore = e.wood + e.fire + e.metal;
          yangProb = yangScore / total;
          yangProb = Math.max(0.2, Math.min(0.8, yangProb));
        }
      }
      
      const yao: Yao = Math.random() < yangProb ? 1 : 0;
      newYaos.push(yao);
      setYaos([...newYaos]);
      
      // Wait 300ms between each yao generation
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    stopSound();
    setIsShaking(false);
    
    // Generate result
    await generateResult(newYaos);
    
    // Update energy state
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 22 || hour < 5) {
      updateEnergyState('ritual_late');
    } else {
      updateEnergyState('ritual_frequent');
    }
  };

  const generateResult = async (finalYaos: Yao[]) => {
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
      lines: hexagram.lines
    };

    setResult(newResult);
    
    // If member, fetch AI explanation
    if (isMember) {
      setIsLoadingExplanation(true);
      try {
        const utils = trpc.useUtils();
        const response = await utils.client.qwen.explainHexagram.mutate({
          hexagramName: hexagram.name,
          judgment: hexagram.judgment,
          image: hexagram.image,
          isMember: true,
        });
        if (response.success) {
          setResult(prev => prev ? { ...prev, explanation: response.explanation } : null);
        }
      } catch (error) {
        console.error("Failed to fetch explanation:", error);
      } finally {
        setIsLoadingExplanation(false);
      }
    }
    
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
      {/* 背景图片 */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/qiankun_bg.png" 
          alt="Qiankun Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      {/* 听觉锚点 */}
      <AudioAnchor src="/sounds/temple_drone.mp3" volume={0.15} />

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-24 overflow-y-auto scrollbar-hide pointer-events-none">
        {/* 顶部栏 */}
        <div className="mb-8 flex justify-between items-start pointer-events-auto">
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
        </div>

        {/* 核心交互区 */}
        <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto">
          {!mode ? (
            // 模式选择
            <div className="flex flex-col gap-6 w-full max-w-xs">
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
            </div>
          ) : !result ? (
            // 起卦过程
            <div className="flex flex-col items-center w-full">
              {/* 爻象展示区 */}
              <div className="h-48 flex flex-col-reverse justify-center gap-3 mb-8 w-32">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-3 w-full rounded-sm transition-all duration-300 ${
                      i < yaos.length 
                        ? 'bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.3)]' 
                        : 'bg-white/5 border border-white/5'
                    }`}
                  >
                    {i < yaos.length && yaos[i] === 0 && (
                      <div className="w-8 h-full bg-black/80 mx-auto border-x border-black/80" />
                    )}
                  </div>
                ))}
              </div>

              {/* 手动模式的点击区域 */}
              {mode === 'manual' && (
                <div
                  onClick={!isShaking ? handleManualShake : undefined}
                  className={`relative w-64 h-32 cursor-pointer flex items-center justify-center rounded-lg border-2 border-dashed border-white/20 hover:border-white/40 transition-colors ${
                    isShaking ? 'opacity-50' : ''
                  }`}
                >
                  <div className="text-center">
                    <p className="text-sm text-white/80 tracking-[0.2em] font-kai">
                      {isShaking ? "感应中..." : "点击摇卦"}
                    </p>
                  </div>
                </div>
              )}
              
              {/* 自动模式占位符 */}
              {mode === 'auto' && <div className="w-64 h-32" />}
              
              <div className="mt-8 text-center">
                <p className="text-sm text-white tracking-[0.3em] font-medium mb-2 drop-shadow-md">
                  {isShaking ? "感应天地..." : mode === 'auto' ? "正在起卦..." : `第 ${yaos.length + 1} 摇`}
                </p>
                <p className="text-[10px] text-white/60 tracking-widest">
                  {yaos.length < 6 ? "诚心正意，静候卦成" : "卦象已成"}
                </p>
              </div>
            </div>
          ) : (
            // 结果展示
            <div className="w-full h-full overflow-y-auto pb-20">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl text-center relative overflow-hidden">
                {/* 装饰纹理 */}
                <div className="absolute inset-0 opacity-10 bg-[url('/images/paper_texture.jpg')]" />

                <div className="relative z-10">
                  <div className="mb-6">
                    {/* 卦象图 */}
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

                  {/* 卦辞 */}
                  <div className="mb-6 text-left">
                    <p className="text-xs text-white/60 tracking-widest uppercase mb-2">卦辞</p>
                    <p className="text-sm text-white/80 leading-relaxed font-serif">{result.desc}</p>
                  </div>

                  {/* 象曰 */}
                  <div className="mb-6 text-left">
                    <p className="text-xs text-white/60 tracking-widest uppercase mb-2">象曰</p>
                    <p className="text-sm text-white/80 leading-relaxed font-serif whitespace-pre-wrap">{result.wisdom}</p>
                  </div>

                  {/* 五行属性 */}
                  <div className="mb-6 text-left">
                    <p className="text-xs text-white/60 tracking-widest uppercase mb-2">五行</p>
                    <p className="text-sm text-white/80 font-serif">{result.structure}</p>
                  </div>

                  {/* 会员通俗解释 */}
                  {isMember && (
                    <div className="mb-6 pt-6 border-t border-white/10 text-left">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-white/60 tracking-widest uppercase">会员深度解读</p>
                        {isLoadingExplanation && <Loader2 className="w-4 h-4 text-[#FFD700] animate-spin" />}
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed font-serif">
                        {result.explanation || "生成中..."}
                      </p>
                    </div>
                  )}

                  {/* 会员深度解读 */}
                  {isMember && result.lines && result.lines.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10 text-left">
                      <p className="text-xs text-white/60 tracking-widest uppercase mb-3">爻辞解析</p>
                      <div className="space-y-3">
                        {result.lines.map((line, i) => (
                          <div key={i} className="text-xs text-white/70 leading-relaxed">
                            <span className="text-[#FFD700]">第{i + 1}爻：</span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="mt-8 flex gap-3 justify-center">
                    <button
                      onClick={resetRitual}
                      className="px-6 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-sm text-white/80 tracking-wide"
                    >
                      重新起卦
                    </button>
                  </div>

                  {/* 合规说明 */}
                  <p className="text-[10px] text-white/40 mt-6 tracking-wide">
                    本内容为传统文化趣味参考，不构成决策依据
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

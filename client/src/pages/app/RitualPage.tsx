import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, ChevronRight, RefreshCw, Lock, Zap, Hand, Briefcase, Heart, Users } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

// Yao type: 0 for Yin, 1 for Yang
type Yao = 0 | 1;

// Mock Hexagram Data
const HEXAGRAMS: Record<string, { name: string; desc: string; wisdom: string; structure: string; tag: '吉' | '平' | '慎' }> = {
  "111111": {
    name: "乾为天",
    desc: "天行健，君子以自强不息。",
    wisdom: "当下运势如日中天，能量充盈。宜积极进取，确立宏大目标并付诸行动。但需注意亢龙有悔，切忌骄傲自满，应保持谦逊，方能长久。",
    structure: "初九：潜龙勿用（时机未到，韬光养晦）\n九二：见龙在田（初露锋芒，利见大人）\n九三：君子终日乾乾（夕惕若厉，无咎）\n九四：或跃在渊（进退自如，审时度势）\n九五：飞龙在天（大展宏图，如日中天）\n上九：亢龙有悔（盈不可久，知进知退）",
    tag: "吉"
  },
  "000000": {
    name: "坤为地",
    desc: "地势坤，君子以厚德载物。",
    wisdom: "当下宜静不宜动，宜守不宜攻。应效法大地之德，包容万物，顺势而为。寻找强有力的合作伙伴或领导者，辅助其成就大业，亦是成就自己。",
    structure: "初六：履霜，坚冰至（见微知著，防微杜渐）\n六二：直方大，不习无不利（顺应自然，无往不利）\n六三：含章可贞（才华内敛，待时而动）\n六四：括囊，无咎无誉（谨言慎行，明哲保身）\n六五：黄裳，元吉（中正柔顺，大吉大利）\n上六：龙战于野，其血玄黄（阴阳相争，两败俱伤）",
    tag: "平"
  }
  // In a real app, this would cover all 64 hexagrams
};

export default function RitualPage() {
  const { isMember } = useUser();
  const [mode, setMode] = useState<'manual' | 'auto' | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [yaos, setYaos] = useState<Yao[]>([]);
  const [result, setResult] = useState<null | {
    gua: string;
    name: string;
    desc: string;
    wisdom: string;
    structure: string;
    tag: '吉' | '平' | '慎';
    yaos: Yao[];
  }>(null);

  const handleManualShake = () => {
    if (isShaking || yaos.length >= 6) return;
    
    setIsShaking(true);
    
    // Simulate shaking duration
    setTimeout(() => {
      setIsShaking(false);
      const newYao: Yao = Math.random() > 0.5 ? 1 : 0;
      const newYaos: Yao[] = [...yaos, newYao];
      setYaos(newYaos);

      if (newYaos.length === 6) {
        generateResult(newYaos);
      }
    }, 1500);
  };

  const handleAutoShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    
    // Simulate quick generation
    setTimeout(() => {
      const newYaos: Yao[] = Array.from({ length: 6 }, () => Math.random() > 0.5 ? 1 : 0);
      setYaos(newYaos);
      setIsShaking(false);
      generateResult(newYaos);
    }, 2000);
  };

  const generateResult = (finalYaos: Yao[]) => {
    const key = finalYaos.join('');
    // Fallback for demo if hexagram not in mock map
    const data = HEXAGRAMS[key] || HEXAGRAMS["111111"]; 
    
    const newResult = {
      gua: finalYaos.map(y => y === 1 ? '—' : '--').reverse().join('\n'), // Visual representation logic simplified
      name: data.name,
      desc: data.desc,
      wisdom: data.wisdom,
      structure: data.structure,
      tag: data.tag,
      yaos: finalYaos
    };

    setResult(newResult);
    
    // Save to archive (Mock for now, will be implemented in Member phase)
    console.log('Saved to archive:', data.name);
  };

  const resetRitual = () => {
    setYaos([]);
    setResult(null);
    setMode(null);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-[#2C2C2C] bg-[#FAF9F6]">
      {/* 背景纹理 */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" 
           style={{ backgroundImage: 'url(/images/paper_texture.jpg)' }} />
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('/images/bagua_bg.png')] bg-no-repeat bg-center bg-contain" />
      
      {/* 顶部遮罩 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FAF9F6] to-transparent z-10" />

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 顶部栏 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2 font-kai">乾坤</h1>
            <p className="text-xs text-[#8C8478] tracking-[0.3em] uppercase">Ritual</p>
          </div>
          {(yaos.length > 0 || mode) && !result && (
            <button 
              onClick={resetRitual}
              className="p-2 rounded-full hover:bg-[#2C2C2C]/5 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[#8C8478]" />
            </button>
          )}
        </motion.div>

        {/* 核心交互区 */}
        <div className="flex-1 flex flex-col items-center justify-center">
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
                  className="group relative overflow-hidden bg-[#FAF9F6] border border-[#789262]/30 rounded-2xl p-6 text-left hover:border-[#789262] transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-kai tracking-widest text-[#2C2C2C]">手动六摇</span>
                    <Hand className="w-5 h-5 text-[#789262] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-[#8C8478] tracking-wide">诚心正意，手摇六次成卦</p>
                </button>

                <button
                  onClick={() => {
                    setMode('auto');
                    handleAutoShake();
                  }}
                  className="group relative overflow-hidden bg-[#FAF9F6] border border-[#789262]/30 rounded-2xl p-6 text-left hover:border-[#789262] transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-kai tracking-widest text-[#2C2C2C]">一键起卦</span>
                    <Zap className="w-5 h-5 text-[#789262] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-[#8C8478] tracking-wide">灵机一动，快速感应成卦</p>
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
                          ? 'bg-[#2C2C2C] shadow-sm' 
                          : 'bg-[#2C2C2C]/5 border border-[#2C2C2C]/10'
                      }`}
                    >
                      {i < yaos.length && yaos[i] === 0 && (
                        <div className="w-8 h-full bg-[#FAF9F6] mx-auto border-x border-[#FAF9F6]" /> // Yin Yao gap
                      )}
                    </div>
                  ))}
                </div>

                {mode === 'manual' && (
                  <motion.div
                    animate={isShaking ? {
                      x: [-5, 5, -5, 5, 0],
                      rotate: [-2, 2, -2, 2, 0],
                    } : {}}
                    transition={{ duration: 0.5, repeat: isShaking ? Infinity : 0 }}
                    onClick={handleManualShake}
                    className="w-32 h-32 bg-[#FAF9F6] rounded-full border border-[#789262]/30 flex items-center justify-center cursor-pointer hover:bg-[#789262]/5 transition-colors shadow-lg shadow-[#789262]/10"
                  >
                    <Hexagon className="w-10 h-10 text-[#2C2C2C] opacity-80" strokeWidth={1} />
                  </motion.div>
                )}
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-[#2C2C2C] tracking-[0.3em] font-medium mb-2">
                    {isShaking ? "感应天地..." : mode === 'auto' ? "正在起卦..." : `第 ${yaos.length + 1} 摇`}
                  </p>
                  <p className="text-[10px] text-[#8C8478] tracking-widest">
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
                <div className="bg-[#FAF9F6] rounded-3xl p-8 border border-[#789262]/20 shadow-xl text-center relative overflow-hidden">
                  {/* 装饰纹理 */}
                  <div className="absolute inset-0 opacity-10 bg-[url('/images/paper_texture.jpg')]" />

                  <div className="relative z-10">
                    <div className="mb-6">
                      {/* 极简卦象图 */}
                      <div className="w-16 mx-auto mb-4 flex flex-col-reverse gap-1">
                        {result.yaos.map((y, i) => (
                          <div key={i} className="h-1.5 w-full bg-[#2C2C2C] rounded-sm relative">
                             {y === 0 && <div className="absolute left-1/2 -translate-x-1/2 w-4 h-full bg-[#FAF9F6]" />}
                          </div>
                        ))}
                      </div>
                      <h2 className="text-2xl font-medium tracking-[0.3em] text-[#2C2C2C] font-kai">{result.name}</h2>
                      <div className="mt-2 inline-block px-3 py-1 rounded-full border border-[#789262]/30 text-[10px] text-[#789262] tracking-widest">
                        {result.tag}
                      </div>
                    </div>

                    <div className="w-8 h-[1px] bg-[#2C2C2C]/10 mx-auto mb-6" />

                    <div className="space-y-8 text-left">
                      <div>
                        <p className="text-xs text-[#8C8478] tracking-widest mb-2 uppercase flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#789262]" /> 卦辞
                        </p>
                        <p className="text-[#2C2C2C] text-sm leading-loose tracking-wide font-kai">
                          {result.desc}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-[#8C8478] tracking-widest mb-2 uppercase flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#789262]" /> 建议
                        </p>
                        <p className="text-[#2C2C2C]/80 text-sm leading-loose tracking-wide font-light text-justify">
                          {result.wisdom}
                        </p>
                      </div>

                      {/* 会员专属结构分析 */}
                      <div className={`rounded-xl border ${isMember ? 'border-[#789262]/20 bg-[#789262]/5' : 'border-[#2C2C2C]/10 bg-[#2C2C2C]/5'} p-5 relative overflow-hidden`}>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs text-[#8C8478] tracking-widest uppercase flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#789262]" /> 深层结构
                          </p>
                          {!isMember && <Lock className="w-4 h-4 text-[#2C2C2C]/40" />}
                        </div>

                        {isMember ? (
                          <div className="space-y-4">
                            <div className="flex gap-2 items-start">
                              <Briefcase className="w-3 h-3 text-[#789262] mt-1 shrink-0" />
                              <p className="text-xs text-[#2C2C2C]/70 leading-relaxed">
                                <span className="text-[#2C2C2C] font-medium">事业：</span>
                                卦象显示上升通道已打开，但需注意根基是否稳固。初爻与上爻呼应，暗示善始善终的重要性。
                              </p>
                            </div>
                            <div className="flex gap-2 items-start">
                              <Heart className="w-3 h-3 text-[#789262] mt-1 shrink-0" />
                              <p className="text-xs text-[#2C2C2C]/70 leading-relaxed">
                                <span className="text-[#2C2C2C] font-medium">情感：</span>
                                刚柔并济方为道。若过于强势（纯阳），恐伤和气；若过于退让（纯阴），恐失自我。
                              </p>
                            </div>
                            <div className="flex gap-2 items-start">
                              <Users className="w-3 h-3 text-[#789262] mt-1 shrink-0" />
                              <p className="text-xs text-[#2C2C2C]/70 leading-relaxed">
                                <span className="text-[#2C2C2C] font-medium">人际：</span>
                                此时宜广结善缘，利用“九二见龙在田”之势，寻找贵人相助。
                              </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-[#789262]/10">
                              <p className="text-xs text-[#2C2C2C]/60 whitespace-pre-line leading-relaxed font-mono">
                                {result.structure}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-xs text-[#2C2C2C]/60 mb-3">解锁六爻详解与多维运势分析</p>
                            <button className="px-4 py-1.5 bg-[#2C2C2C] text-[#FAF9F6] text-[10px] tracking-widest rounded-full">
                              开通会员
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#2C2C2C]/5">
                      <p className="text-[10px] text-[#8C8478] tracking-wider mb-4 scale-90 origin-center">
                        * 本内容为传统文化趣味参考，不构成决策依据
                      </p>
                      <button 
                        onClick={resetRitual}
                        className="text-[#2C2C2C] text-xs tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center justify-center gap-2 mx-auto"
                      >
                        再次起卦 <ChevronRight className="w-3 h-3" />
                      </button>
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

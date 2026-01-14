import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, ChevronRight, RefreshCw, Lock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

// Yao type: 0 for Yin, 1 for Yang
type Yao = 0 | 1;

export default function RitualPage() {
  const { isMember } = useUser();
  const [isShaking, setIsShaking] = useState(false);
  const [yaos, setYaos] = useState<Yao[]>([]);
  const [result, setResult] = useState<null | {
    gua: string;
    name: string;
    desc: string;
    wisdom: string;
    structure?: string; // Member only
  }>(null);

  const handleShake = () => {
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

  const generateResult = (finalYaos: Yao[]) => {
    // Mock result generation based on yaos
    setTimeout(() => {
      const baseResult = {
        gua: "䷀", 
        name: "乾为天", 
        desc: "天行健，君子以自强不息。",
        wisdom: "当下运势如日中天，能量充盈。宜积极进取，确立宏大目标并付诸行动。但需注意亢龙有悔，切忌骄傲自满，应保持谦逊，方能长久。"
      };

      if (isMember) {
        setResult({
          ...baseResult,
          structure: "【结构分析】\n初九：潜龙勿用。\n九二：见龙在田。\n九三：君子终日乾乾。\n九四：或跃在渊。\n九五：飞龙在天。\n上九：亢龙有悔。\n\n此卦六爻皆阳，纯阳刚健，象征万物生发之始。结构上呈现出一种不断上升、进取的态势，但也隐含着盛极而衰的风险。"
        });
      } else {
        setResult(baseResult);
      }
    }, 500);
  };

  const resetRitual = () => {
    setYaos([]);
    setResult(null);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-[#4A4036]">
      {/* 背景图 */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/zen_bg.png)' }}
      />
      
      {/* 顶部遮罩 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#E8E2D2]/80 to-transparent z-10" />

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-8">
        
        {/* 顶部栏 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2">乾坤</h1>
            <p className="text-xs text-[#8C8478] tracking-[0.3em] uppercase">Ritual</p>
          </div>
          {yaos.length > 0 && !result && (
            <button 
              onClick={resetRitual}
              className="p-2 rounded-full hover:bg-[#4A4036]/5 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[#8C8478]" />
            </button>
          )}
        </motion.div>

        {/* 核心交互区 */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="shake"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center w-full"
              >
                {/* 爻象展示区 */}
                <div className="h-48 flex flex-col-reverse justify-center gap-3 mb-8 w-32">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-3 w-full rounded-sm transition-all duration-500 ${
                        i < yaos.length 
                          ? 'bg-[#4A4036] shadow-sm' 
                          : 'bg-[#4A4036]/5 border border-[#4A4036]/10'
                      }`}
                    >
                      {i < yaos.length && yaos[i] === 0 && (
                        <div className="w-4 h-full bg-[#F9F9F7] mx-auto" /> // Yin Yao gap
                      )}
                    </div>
                  ))}
                </div>

                <motion.div
                  animate={isShaking ? {
                    x: [-5, 5, -5, 5, 0],
                    rotate: [-2, 2, -2, 2, 0],
                  } : {}}
                  transition={{ duration: 0.5, repeat: isShaking ? Infinity : 0 }}
                  onClick={handleShake}
                  className="w-40 h-40 bg-[#F5E6C8]/10 backdrop-blur-md rounded-full border border-[#FFF8E7]/30 flex items-center justify-center cursor-pointer hover:bg-[#F5E6C8]/20 transition-colors shadow-[0_8px_32px_rgba(74,64,54,0.05)]"
                >
                  <Hexagon className="w-12 h-12 text-[#4A4036] opacity-80" strokeWidth={1} />
                </motion.div>
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-[#4A4036] tracking-[0.3em] font-medium mb-2">
                    {isShaking ? "感应天地..." : yaos.length === 0 ? "点击起卦" : `第 ${yaos.length + 1} 爻`}
                  </p>
                  <p className="text-[10px] text-[#8C8478] tracking-widest">
                    {yaos.length < 6 ? "诚心正意，共需六摇" : "卦象已成"}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full overflow-y-auto pb-20"
              >
                <div className="bg-[#F5E6C8]/10 backdrop-blur-md rounded-3xl p-8 border border-[#FFF8E7]/30 shadow-[0_16px_48px_rgba(74,64,54,0.08)] text-center relative overflow-hidden">
                  {/* 装饰纹理 */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4A4036]/20 to-transparent opacity-30" />

                  <div className="mb-6">
                    <span className="text-6xl font-light text-[#4A4036] block mb-4">{result.gua}</span>
                    <h2 className="text-2xl font-medium tracking-[0.3em] text-[#4A4036]">{result.name}</h2>
                  </div>

                  <div className="w-8 h-[1px] bg-[#4A4036]/10 mx-auto mb-6" />

                  <div className="space-y-6 text-left">
                    <div>
                      <p className="text-xs text-[#8C8478] tracking-widest mb-2 uppercase">The Image</p>
                      <p className="text-[#4A4036] text-sm leading-loose tracking-wide font-medium">
                        {result.desc}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-[#8C8478] tracking-widest mb-2 uppercase">Wisdom</p>
                      <p className="text-[#4A4036]/80 text-sm leading-loose tracking-wide font-light">
                        {result.wisdom}
                      </p>
                    </div>

                    {/* 会员专属结构分析 */}
                    {isMember ? (
                      <div className="bg-[#4A4036]/5 p-4 rounded-xl">
                        <p className="text-xs text-[#8C8478] tracking-widest mb-2 uppercase flex items-center gap-2">
                          Structure <Lock className="w-3 h-3 opacity-0" /> {/* Hidden lock for alignment */}
                        </p>
                        <p className="text-[#4A4036]/80 text-xs leading-loose tracking-wide whitespace-pre-line">
                          {result.structure}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-[#4A4036]/5 p-4 rounded-xl flex items-center justify-between">
                        <span className="text-xs text-[#8C8478] tracking-widest">解锁深层结构分析</span>
                        <Lock className="w-4 h-4 text-[#4A4036]/40" />
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#4A4036]/5">
                    <p className="text-[10px] text-[#8C8478] tracking-wider mb-4">
                      * 此结果仅供决策参考，非宿命定论
                    </p>
                    <button 
                      onClick={resetRitual}
                      className="text-[#4A4036] text-xs tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center justify-center gap-2 mx-auto"
                    >
                      再次起卦 <ChevronRight className="w-3 h-3" />
                    </button>
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

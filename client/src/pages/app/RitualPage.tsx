import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, ChevronRight } from "lucide-react";

export default function RitualPage() {
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<null | {
    gua: string;
    name: string;
    desc: string;
  }>(null);

  const handleShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    setResult(null);

    // Simulate shaking duration
    setTimeout(() => {
      setIsShaking(false);
      const results = [
        { gua: "䷀", name: "乾为天", desc: "天行健，君子以自强不息。当下运势如日中天，宜积极进取，大展宏图。然亢龙有悔，切忌骄躁。" },
        { gua: "䷁", name: "坤为地", desc: "地势坤，君子以厚德载物。宜顺势而为，包容万物。静待时机，不可急躁冒进。" },
        { gua: "䷾", name: "水火既济", desc: "初吉终乱。事情已成，需防微杜渐。守成不易，当思患预防。" },
        { gua: "䷿", name: "火水未济", desc: "君子以慎辨物居方。新的开始，审视方向。虽未成功，但充满希望。" },
      ];
      setResult(results[Math.floor(Math.random() * results.length)]);
    }, 2000);
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
          className="mb-12"
        >
          <h1 className="text-3xl tracking-[0.2em] font-medium mb-2">乾坤</h1>
          <p className="text-xs text-[#8C8478] tracking-[0.3em] uppercase">Ritual</p>
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
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={isShaking ? {
                    x: [-5, 5, -5, 5, 0],
                    rotate: [-2, 2, -2, 2, 0],
                  } : {}}
                  transition={{ duration: 0.5, repeat: isShaking ? Infinity : 0 }}
                  onClick={handleShake}
                  className="w-48 h-48 bg-[#F5E6C8]/10 backdrop-blur-md rounded-full border border-[#FFF8E7]/30 flex items-center justify-center cursor-pointer hover:bg-[#F5E6C8]/20 transition-colors shadow-[0_8px_32px_rgba(74,64,54,0.05)]"
                >
                  <Hexagon className="w-16 h-16 text-[#4A4036] opacity-80" strokeWidth={1} />
                </motion.div>
                <p className="mt-8 text-sm text-[#8C8478] tracking-[0.3em]">
                  {isShaking ? "感应天地..." : "点击起卦"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="bg-[#F5E6C8]/10 backdrop-blur-md rounded-3xl p-8 border border-[#FFF8E7]/30 shadow-[0_16px_48px_rgba(74,64,54,0.08)] text-center relative overflow-hidden">
                  {/* 装饰纹理 */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4A4036]/20 to-transparent opacity-30" />

                  <div className="mb-6">
                    <span className="text-6xl font-light text-[#4A4036] block mb-4">{result.gua}</span>
                    <h2 className="text-2xl font-medium tracking-[0.3em] text-[#4A4036]">{result.name}</h2>
                  </div>

                  <div className="w-8 h-[1px] bg-[#4A4036]/10 mx-auto mb-6" />

                  <p className="text-[#4A4036]/90 text-base leading-loose tracking-wide font-light mb-8">
                    {result.desc}
                  </p>

                  <button 
                    onClick={() => setResult(null)}
                    className="text-[#8C8478] text-xs tracking-[0.2em] hover:text-[#4A4036] transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    再次起卦 <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

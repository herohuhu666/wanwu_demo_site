import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function RitualPage() {
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<null | {
    name: string;
    symbol: string;
    wisdom: string;
  }>(null);

  const handleShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    setResult(null);

    // 模拟摇卦过程
    setTimeout(() => {
      setIsShaking(false);
      // Mock 随机结果
      const results = [
        { name: '乾为天', symbol: '☰\n☰', wisdom: '天行健，君子以自强不息。\n行动指南：保持进取，当下即是最佳时机。' },
        { name: '坤为地', symbol: '☷\n☷', wisdom: '地势坤，君子以厚德载物。\n行动指南：包容接纳，以静制动，等待时机。' },
        { name: '水火既济', symbol: '☵\n☲', wisdom: '初吉终乱。\n行动指南：事情已成，需防微杜渐，守成不易。' },
        { name: '火水未济', symbol: '☲\n☵', wisdom: '君子以慎辨物居方。\n行动指南：新的开始，审视方向，重新出发。' },
      ];
      setResult(results[Math.floor(Math.random() * results.length)]);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#f9f9f7] relative">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center p-6 pt-12">
        <div className="flex flex-col">
          <span className="text-xs text-stone-500 tracking-widest uppercase">Ritual</span>
          <h1 className="text-2xl font-serif text-stone-800">乾坤</h1>
        </div>
      </div>

      {/* 核心交互区 */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-10">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="shaker"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <motion.div
                className="w-48 h-48 rounded-full bg-stone-900 shadow-2xl flex items-center justify-center cursor-pointer relative overflow-hidden group"
                onClick={handleShake}
                animate={isShaking ? {
                  x: [-5, 5, -5, 5, 0],
                  y: [-5, 5, -5, 5, 0],
                  rotate: [-2, 2, -2, 2, 0]
                } : {}}
                transition={{ duration: 0.5, repeat: isShaking ? Infinity : 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-black opacity-80" />
                <div className="relative z-10 text-center">
                  <span className="text-stone-400 text-sm tracking-[0.3em] uppercase block mb-2">
                    {isShaking ? "Sensing..." : "Ritual"}
                  </span>
                  <span className="text-white font-serif text-2xl tracking-widest">
                    {isShaking ? "诚心感应" : "点击摇卦"}
                  </span>
                </div>
              </motion.div>
              <p className="mt-8 text-stone-400 text-sm tracking-widest">
                {isShaking ? "正在感应天地..." : "心诚则灵"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center w-full px-8"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl font-serif text-stone-800 leading-none mb-6 text-center"
              >
                <span className="block">{result.symbol.split('\n')[0]}</span>
                <span className="block mt-1">{result.symbol.split('\n')[1]}</span>
              </motion.div>
              
              <h2 className="text-3xl font-serif text-stone-800 mb-8">{result.name}</h2>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 w-full">
                <p className="text-stone-600 leading-relaxed text-center font-serif">
                  {result.wisdom}
                </p>
              </div>

              <Button 
                variant="ghost" 
                className="mt-8 text-stone-400 hover:text-stone-600 gap-2"
                onClick={() => setResult(null)}
              >
                <RefreshCw className="w-4 h-4" />
                再次问卜
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Lock, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function GuardianPage() {
  const [isLit, setIsLit] = useState(false);
  const [days, setDays] = useState(12);
  const [timeLeft, setTimeLeft] = useState("23:59:59");

  // 模拟倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59);
      const diff = end.getTime() - now.getTime();
      
      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
      
      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLightUp = () => {
    if (!isLit) {
      setIsLit(true);
      setDays(d => d + 1);
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-[#f9f9f7]">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center p-6 pt-12">
        <div className="flex flex-col">
          <span className="text-xs text-stone-500 tracking-widest uppercase">Guardian</span>
          <h1 className="text-2xl font-serif text-stone-800">守望</h1>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-stone-600 hover:bg-stone-200/50 rounded-full">
                <Sun className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#f9f9f7] border-none shadow-xl max-w-[320px]">
              <DialogHeader>
                <DialogTitle className="font-serif text-center text-xl">能量天气</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">今日五行</span>
                  <span className="font-medium text-blue-600">水旺木相</span>
                </div>
                <div className="h-2 bg-stone-200 rounded-full overflow-hidden flex">
                  <div className="w-[40%] bg-blue-400" />
                  <div className="w-[30%] bg-green-400" />
                  <div className="w-[10%] bg-red-400" />
                  <div className="w-[10%] bg-yellow-400" />
                  <div className="w-[10%] bg-stone-400" />
                </div>
                <div className="bg-white/50 p-4 rounded-lg border border-stone-100">
                  <p className="text-sm text-stone-600 leading-relaxed">
                    <span className="font-bold text-stone-800 block mb-1">今日建议</span>
                    宜静思，宜阅读，宜内观。<br/>
                    忌冲动决策，忌远行，忌争执。
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" className="text-stone-600 hover:bg-stone-200/50 rounded-full">
            <Lock className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 核心交互区 */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-10">
        <motion.div 
          className="relative cursor-pointer"
          onClick={handleLightUp}
          whileTap={{ scale: 0.95 }}
        >
          {/* 呼吸光环 */}
          <AnimatePresence>
            {isLit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-amber-200/30 rounded-full blur-2xl"
              />
            )}
          </AnimatePresence>

          {/* 命灯主体 */}
          <div className={`w-48 h-48 rounded-full border border-stone-200 flex items-center justify-center relative transition-all duration-1000 ${isLit ? 'bg-gradient-to-b from-amber-50 to-white shadow-[0_0_40px_rgba(251,191,36,0.2)]' : 'bg-white shadow-sm'}`}>
            <div className={`w-40 h-40 rounded-full border border-stone-100 flex flex-col items-center justify-center transition-all duration-1000 ${isLit ? 'opacity-100' : 'opacity-60'}`}>
              {isLit ? (
                <>
                  <span className="text-3xl font-serif text-amber-600 mb-1">长明</span>
                  <span className="text-xs text-amber-800/60 tracking-widest">已守护 {days} 天</span>
                </>
              ) : (
                <>
                  <span className="text-3xl font-serif text-stone-400 mb-1">点亮</span>
                  <span className="text-xs text-stone-400 tracking-widest">命灯将熄</span>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center space-y-1">
          <p className="text-xs text-stone-400 uppercase tracking-widest">Remaining Time</p>
          <p className="text-xl font-mono text-stone-600">{timeLeft}</p>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="p-6 pb-8 text-center">
        <p className="text-xs text-stone-400">
          {isLit ? "命灯已点亮，遗泽锦囊处于安全状态" : "若 72 小时未点亮，将触发遗泽锦囊"}
        </p>
      </div>
    </div>
  );
}

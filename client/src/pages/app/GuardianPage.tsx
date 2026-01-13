import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Shield } from "lucide-react";
import { toast } from "sonner";

export default function GuardianPage() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(259200); // 72 hours
  const [showWeather, setShowWeather] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleIgnite = () => {
    setIsActive(true);
    setTimeLeft(259200);
    toast.success("命灯已点亮，平安信号已发送");
    setTimeout(() => setIsActive(false), 2000); // Reset animation state
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
        <div className="flex justify-between items-start mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2">守望</h1>
            <p className="text-xs text-[#8C8478] tracking-[0.3em] uppercase">Guardian</p>
          </motion.div>
          
          <button 
            onClick={() => setShowWeather(true)}
            className="p-3 rounded-full bg-[#F5E6C8]/20 backdrop-blur-sm border border-[#FFF8E7]/30 text-[#4A4036] hover:bg-[#F5E6C8]/40 transition-colors"
          >
            <Sun className="w-5 h-5" />
          </button>
        </div>

        {/* 命灯核心区 */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* 呼吸光环 */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-64 h-64 rounded-full bg-gradient-to-b from-[#F5E6C8] to-transparent blur-3xl opacity-40"
          />

          {/* 交互按钮 */}
          <button
            onClick={handleIgnite}
            className="relative w-48 h-48 rounded-full flex items-center justify-center group transition-transform duration-500 active:scale-95"
          >
            {/* 按钮背景 */}
            <div className="absolute inset-0 rounded-full bg-[#F5E6C8]/10 backdrop-blur-md border border-[#FFF8E7]/40 shadow-[0_8px_32px_rgba(74,64,54,0.05)]" />
            
            {/* 内圈装饰 */}
            <div className="absolute inset-2 rounded-full border border-[#4A4036]/5" />
            
            <div className="relative z-10 text-center">
              <h2 className={`text-2xl font-medium tracking-[0.2em] mb-2 transition-colors duration-500 ${isActive ? 'text-[#4A4036]' : 'text-[#4A4036]/80'}`}>
                {isActive ? "已点亮" : "点亮"}
              </h2>
              <p className="text-[10px] text-[#8C8478] tracking-[0.2em] uppercase">
                {isActive ? "Ignited" : "Ignite"}
              </p>
            </div>
          </button>

          {/* 倒计时 */}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-[#8C8478] tracking-[0.3em] uppercase mb-3">Remaining Time</p>
            <p className="text-3xl font-variant-numeric tabular-nums tracking-widest font-light text-[#4A4036]">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-auto text-center">
          <p className="text-xs text-[#8C8478]/80 tracking-wider flex items-center justify-center gap-2">
            <Shield className="w-3 h-3" />
            若 72 小时未点亮，将触发遗泽锦囊
          </p>
        </div>
      </div>

      {/* 能量天气弹窗 */}
      <AnimatePresence>
        {showWeather && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#E8E2D2]/60 backdrop-blur-md flex items-center justify-center p-8"
            onClick={() => setShowWeather(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full bg-[#F9F9F7] rounded-3xl p-8 shadow-2xl border border-[#FFF8E7] relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Sun className="w-32 h-32 text-[#4A4036]" />
              </div>
              
              <h3 className="text-xl font-medium tracking-[0.2em] text-[#4A4036] mb-8">能量天气</h3>
              
              <div className="space-y-6">
                {[
                  { label: "木", value: 80, desc: "生机勃勃，宜创新" },
                  { label: "火", value: 40, desc: "稍显沉寂，忌冲动" },
                  { label: "土", value: 60, desc: "平稳厚重，宜守成" },
                  { label: "金", value: 30, desc: "锐气不足，忌争执" },
                  { label: "水", value: 90, desc: "智慧涌动，宜思考" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="w-8 text-lg font-serif text-[#4A4036]">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-[#4A4036]/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-[#4A4036]/60 rounded-full"
                      />
                    </div>
                    <span className="text-xs text-[#8C8478] tracking-wider w-24 text-right">{item.desc}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowWeather(false)}
                className="mt-8 w-full py-4 text-xs tracking-[0.2em] text-[#8C8478] hover:text-[#4A4036] transition-colors border-t border-[#4A4036]/10"
              >
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Shield, Sparkles, Activity, Moon, Battery, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { useUser, DailyState, EnergyLevel, SleepQuality } from "@/contexts/UserContext";

// Zen Quotes
const ZEN_QUOTES = [
  "心安则路顺",
  "静而后能安",
  "万物皆有时",
  "行至水穷处",
  "坐看云起时"
];

export default function GuardianPage() {
  const { dailyRecord, submitDailyRecord, addMerit } = useUser();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(259200); // 72 hours
  const [showZenQuote, setShowZenQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [showLegacyCapsule, setShowLegacyCapsule] = useState(false);
  const [legacyContent, setLegacyContent] = useState("");
  
  // Daily Mainline State
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [selectedState, setSelectedState] = useState<DailyState>('steady');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('fair');

  // Mock: Check if within 08:30 - 24:00
  const isLightUpTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    return currentTime >= 8 * 60 + 30 && currentTime <= 24 * 60;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          if (!showLegacyCapsule) {
            triggerLegacyCapsule();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerLegacyCapsule = () => {
    const contents = ["专属自省提示", "轻卦象箴言", "补签卡×1"];
    const randomContent = contents[Math.floor(Math.random() * contents.length)];
    setLegacyContent(randomContent);
    setShowLegacyCapsule(true);
    // Add legacy capsule to user history (mock)
    localStorage.setItem('wanwu_legacy_capsule_' + Date.now(), randomContent);
  };

  const handleLegacyClaim = () => {
    addMerit(28);
    // Add 1 free insight (mock logic handled in UserContext or backend)
    toast.success("已领取遗泽锦囊：功德+28，灵犀问询+1");
    setShowLegacyCapsule(false);
    setTimeLeft(259200); // Reset timer
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleIgniteClick = () => {
    if (!isLightUpTime()) {
      toast.error("每日 08:30 - 24:00 方可点亮");
      return;
    }
    setCurrentQuote(ZEN_QUOTES[Math.floor(Math.random() * ZEN_QUOTES.length)]);
    setShowZenQuote(true);
  };

  const confirmIgnite = () => {
    setShowZenQuote(false);
    setIsActive(true);
    setTimeLeft(259200);
    addMerit(2);
    
    if (!dailyRecord?.completed) {
      setShowDailyCheckIn(true);
    } else {
      toast.success("命灯已点亮，功德+2");
      setTimeout(() => setIsActive(false), 2000);
    }
  };

  const handleDailySubmit = () => {
    submitDailyRecord(selectedState, energyLevel, sleepQuality);
    setShowDailyCheckIn(false);
    toast.success("今日状态已记录");
    setTimeout(() => setIsActive(false), 2000);
  };

  // Calculate progress bars (mock: 1 day filled per light up, max 3)
  const progress = Math.min(3, Math.ceil((259200 - timeLeft) / 86400)); 

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-[#2C2C2C] bg-[#FAF9F6]">
      {/* 背景纹理 */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" 
           style={{ backgroundImage: 'url(/images/paper_texture.jpg)' }} />
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('/images/bamboo_bg.png')] bg-no-repeat bg-right-bottom bg-contain" />
      
      {/* 顶部遮罩 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FAF9F6] to-transparent z-10" />

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 顶部栏 */}
        <div className="flex justify-between items-start mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2 font-kai">守望</h1>
            <p className="text-xs text-[#8C8478] tracking-[0.3em] uppercase">Guardian</p>
          </motion.div>
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
            className="absolute w-64 h-64 rounded-full bg-gradient-to-b from-[#789262]/20 to-transparent blur-3xl opacity-40"
          />

          {/* 交互按钮 */}
          <button
            onClick={handleIgniteClick}
            className="relative w-48 h-48 rounded-full flex items-center justify-center group transition-transform duration-500 active:scale-95"
          >
            {/* 按钮背景 */}
            <div className="absolute inset-0 rounded-full bg-[#FAF9F6]/50 backdrop-blur-md border border-[#789262]/20 shadow-[0_8px_32px_rgba(120,146,98,0.1)]" />
            
            {/* 内圈装饰 */}
            <div className="absolute inset-2 rounded-full border border-[#2C2C2C]/5" />
            
            <div className="relative z-10 text-center">
              <div className="mb-2">
                {/* 简化灯笼图标 */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#789262" strokeWidth="1.5" className="mx-auto opacity-80">
                  <path d="M12 2v20M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h2 className={`text-xl font-medium tracking-[0.2em] mb-1 transition-colors duration-500 ${isActive ? 'text-[#789262]' : 'text-[#2C2C2C]'}`}>
                {isActive ? "已点亮" : "点亮"}
              </h2>
              <p className="text-[10px] text-[#8C8478] tracking-[0.2em] uppercase">
                {isActive ? "Ignited" : "Ignite"}
              </p>
            </div>
          </button>

          {/* 倒计时与进度条 */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-[10px] text-[#8C8478] tracking-[0.3em] uppercase mb-2">Remaining Time</p>
              <p className="text-3xl font-variant-numeric tabular-nums tracking-widest font-light text-[#2C2C2C]">
                {formatTime(timeLeft)}
              </p>
            </div>
            
            {/* 3格进度条 */}
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`w-8 h-1.5 rounded-full transition-colors duration-500 ${
                    i <= progress ? 'bg-[#789262]' : 'bg-[#2C2C2C]/10'
                  }`}
                />
              ))}
            </div>
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

      {/* 禅语弹窗 */}
      <AnimatePresence>
        {showZenQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#2C2C2C]/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-xs bg-[#FAF9F6] rounded-2xl p-8 border border-[#789262]/30 shadow-xl text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 bg-[url('/images/paper_texture.jpg')]" />
              
              <h3 className="text-2xl text-[#2C2C2C] font-thin tracking-[0.2em] mb-8 font-shoujin">
                {currentQuote}
              </h3>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmIgnite();
                }}
                className="px-8 py-2 bg-[#2C2C2C] text-[#FAF9F6] text-sm tracking-widest rounded-full hover:bg-[#2C2C2C]/90 transition-colors relative z-50 cursor-pointer"
              >
                确认
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 遗泽锦囊弹窗 */}
      <AnimatePresence>
        {showLegacyCapsule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#2C2C2C]/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-sm bg-[#FAF9F6] rounded-2xl p-0 overflow-hidden shadow-2xl border border-[#789262]/30"
            >
              {/* 锦囊头部 */}
              <div className="bg-[#2C2C2C] p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern_cloud.png')]" />
                <h3 className="text-xl text-[#FAF9F6] tracking-[0.3em] font-kai relative z-10">遗泽锦囊</h3>
                <p className="text-[10px] text-[#FAF9F6]/60 tracking-widest mt-2 relative z-10">Legacy Capsule</p>
              </div>

              {/* 锦囊内容 */}
              <div className="p-8 text-center">
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-[#789262]">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm tracking-widest">固定权益</span>
                  </div>
                  <p className="text-lg text-[#2C2C2C] font-medium">功德 +28</p>
                  <p className="text-sm text-[#2C2C2C]/80">灵犀问询 +1</p>
                </div>

                <div className="w-full h-[1px] bg-[#2C2C2C]/10 my-6" />

                <div className="mb-8">
                  <div className="flex items-center justify-center gap-2 text-[#8C8478] mb-2">
                    <span className="text-xs tracking-widest">随机机缘</span>
                  </div>
                  <div className="bg-[#789262]/10 py-3 px-4 rounded-lg border border-[#789262]/20">
                    <p className="text-[#2C2C2C] tracking-widest font-kai">{legacyContent}</p>
                  </div>
                </div>

                <button
                  onClick={handleLegacyClaim}
                  className="w-full py-3 bg-[#789262] text-[#FAF9F6] text-sm tracking-[0.2em] rounded-xl hover:bg-[#789262]/90 transition-colors shadow-lg shadow-[#789262]/20"
                >
                  收入囊中
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 每日主线流程弹窗 (保持原有逻辑，仅微调样式) */}
      <AnimatePresence>
        {showDailyCheckIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-medium tracking-[0.2em] text-[#2C2C2C] mb-2 font-kai">今日已在</h3>
                <p className="text-xs text-[#8C8478] tracking-widest">Daily Check-in</p>
              </div>

              <div className="space-y-8">
                {/* 1. 状态选择 */}
                <div className="space-y-3">
                  <p className="text-sm text-[#2C2C2C] tracking-widest text-center">今日状态</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(['steady', 'advance', 'retreat'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedState(s)}
                        className={`py-3 rounded-xl text-xs tracking-widest transition-all border ${
                          selectedState === s
                            ? 'bg-[#2C2C2C] text-[#FAF9F6] border-[#2C2C2C]'
                            : 'bg-transparent text-[#2C2C2C] border-[#2C2C2C]/20 hover:border-[#2C2C2C]'
                        }`}
                      >
                        {s === 'steady' ? '稳（守）' : s === 'advance' ? '进（行）' : '收（省）'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. 状态感知 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Battery className="w-4 h-4 text-[#2C2C2C]/60" />
                        <span className="text-xs text-[#2C2C2C] tracking-widest">精力感受</span>
                      </div>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as const).map((l) => (
                          <button
                            key={l}
                            onClick={() => setEnergyLevel(l)}
                            className={`w-8 h-8 rounded-full text-[10px] flex items-center justify-center transition-all border ${
                              energyLevel === l
                                ? 'bg-[#2C2C2C] text-[#FAF9F6] border-[#2C2C2C]'
                                : 'bg-transparent text-[#2C2C2C] border-[#2C2C2C]/20'
                            }`}
                          >
                            {l === 'low' ? '低' : l === 'medium' ? '中' : '高'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-[#2C2C2C]/60" />
                        <span className="text-xs text-[#2C2C2C] tracking-widest">睡眠感受</span>
                      </div>
                      <div className="flex gap-2">
                        {(['poor', 'fair', 'good'] as const).map((q) => (
                          <button
                            key={q}
                            onClick={() => setSleepQuality(q)}
                            className={`w-8 h-8 rounded-full text-[10px] flex items-center justify-center transition-all border ${
                              sleepQuality === q
                                ? 'bg-[#2C2C2C] text-[#FAF9F6] border-[#2C2C2C]'
                                : 'bg-transparent text-[#2C2C2C] border-[#2C2C2C]/20'
                            }`}
                          >
                            {q === 'poor' ? '差' : q === 'fair' ? '平' : '好'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDailySubmit}
                  className="w-full py-4 bg-[#789262] text-[#FAF9F6] rounded-xl text-sm tracking-[0.2em] hover:bg-[#789262]/90 transition-colors shadow-lg shadow-[#789262]/20"
                >
                  确认记录
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Shield, Sparkles, Activity, Moon, Battery, AlertTriangle, CheckCircle2, X, Flame, Timer } from "lucide-react";
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

  // Meditation State
  const [showMeditation, setShowMeditation] = useState(false);
  const [meditationTime, setMeditationTime] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);

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

  // Meditation Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMeditating) {
      interval = setInterval(() => {
        setMeditationTime(prev => {
          if (prev >= 900) { // 15 minutes (one incense stick)
            clearInterval(interval);
            setIsMeditating(false);
            addMerit(5);
            toast.success("一柱香时间已到，功德+5");
            return 900;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMeditating]);

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

  const formatMeditationTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-white/90 bg-black">
      {/* 背景图片 */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/guardian_bg_cropped.png" 
          alt="Guardian Background" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* 渐变遮罩，确保文字可读性 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>
      
      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 顶部栏 */}
        <div className="flex justify-between items-start mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2 font-kai text-white">守望</h1>
            <p className="text-xs text-white/60 tracking-[0.3em] uppercase">Guardian</p>
          </motion.div>

          <button 
            onClick={() => setShowMeditation(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <Flame className="w-5 h-5 text-[#E0D6C8]" />
          </button>
        </div>

        {/* 命灯核心区 */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* 呼吸光环 - 调整颜色以匹配背景 */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-64 h-64 rounded-full bg-gradient-to-b from-[#FFD700]/20 to-transparent blur-3xl opacity-30"
          />

          {/* 交互按钮 */}
          <button
            onClick={handleIgniteClick}
            className="relative w-48 h-48 rounded-full flex items-center justify-center group transition-transform duration-500 active:scale-95"
          >
            {/* 按钮背景 - 更通透的磨砂感 */}
            <div className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" />
            
            {/* 内圈装饰 */}
            <div className="absolute inset-2 rounded-full border border-white/10" />
            
            <div className="relative z-10 text-center">
              <div className="mb-2">
                {/* 简化灯笼图标 */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E0D6C8" strokeWidth="1.5" className="mx-auto opacity-90">
                  <path d="M12 2v20M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h2 className={`text-xl font-medium tracking-[0.2em] mb-1 transition-colors duration-500 ${isActive ? 'text-[#FFD700]' : 'text-white'}`}>
                {isActive ? "已点亮" : "点亮"}
              </h2>
              <p className="text-[10px] text-white/60 tracking-[0.2em] uppercase">
                {isActive ? "Ignited" : "Ignite"}
              </p>
            </div>
          </button>

          {/* 倒计时与进度条 */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-[10px] text-white/60 tracking-[0.3em] uppercase mb-2">Remaining Time</p>
              <p className="text-3xl font-variant-numeric tabular-nums tracking-widest font-light text-white">
                {formatTime(timeLeft)}
              </p>
            </div>
            
            {/* 3格进度条 */}
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`w-8 h-1.5 rounded-full transition-colors duration-500 ${
                    i <= progress ? 'bg-[#E0D6C8]' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-auto text-center">
          <p className="text-xs text-white/50 tracking-wider flex items-center justify-center gap-2">
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
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-xs bg-[#1C1C1C] rounded-2xl p-8 border border-white/10 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-5 bg-[url('/images/paper_texture.jpg')]" />
              
              <h3 className="text-2xl text-white font-thin tracking-[0.2em] mb-8 font-shoujin">
                {currentQuote}
              </h3>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmIgnite();
                }}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-sm tracking-[0.2em] rounded-lg transition-colors border border-white/5"
              >
                心安
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 每日状态记录弹窗 */}
      <AnimatePresence>
        {showDailyCheckIn && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 bg-[#1C1C1C] flex flex-col"
          >
            <div className="flex-1 px-8 pt-12 pb-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-medium tracking-[0.2em] text-white font-kai">今日状态</h2>
                <button 
                  onClick={() => setShowDailyCheckIn(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/60"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* 状态选择 */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-sm text-white/60 tracking-[0.2em] mb-4">心境</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'anxious', label: '焦虑', icon: AlertTriangle },
                      { id: 'steady', label: '平稳', icon: Activity },
                      { id: 'joyful', label: '喜悦', icon: Sparkles },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedState(item.id as DailyState)}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                          selectedState === item.id
                            ? 'bg-white/10 border-[#E0D6C8] text-[#E0D6C8]'
                            : 'border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-xs tracking-widest">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm text-white/60 tracking-[0.2em] mb-4">能量</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'low', label: '低', icon: Battery },
                      { id: 'medium', label: '中', icon: Battery },
                      { id: 'high', label: '高', icon: Battery },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setEnergyLevel(item.id as EnergyLevel)}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                          energyLevel === item.id
                            ? 'bg-white/10 border-[#E0D6C8] text-[#E0D6C8]'
                            : 'border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-xs tracking-widest">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm text-white/60 tracking-[0.2em] mb-4">睡眠</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'poor', label: '差', icon: Moon },
                      { id: 'fair', label: '一般', icon: Moon },
                      { id: 'good', label: '好', icon: Moon },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSleepQuality(item.id as SleepQuality)}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                          sleepQuality === item.id
                            ? 'bg-white/10 border-[#E0D6C8] text-[#E0D6C8]'
                            : 'border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-xs tracking-widest">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="p-8 border-t border-white/10 bg-[#1C1C1C]">
              <button
                onClick={handleDailySubmit}
                className="w-full py-4 bg-[#E0D6C8] text-[#1C1C1C] rounded-xl font-medium tracking-[0.2em] hover:bg-[#D0C6B8] transition-colors"
              >
                记录此刻
              </button>
            </div>
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
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-xs bg-[#1C1C1C] rounded-2xl p-8 border border-white/10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#E0D6C8]" />
              </div>
              <h3 className="text-xl font-medium tracking-[0.2em] mb-4 text-white">遗泽锦囊</h3>
              <p className="text-sm text-white/60 mb-8 leading-relaxed">
                检测到您已超过72小时未点亮命灯。
                <br />
                系统已为您自动触发保护机制。
              </p>
              
              <div className="bg-white/5 p-4 rounded-lg mb-8 border border-white/5">
                <p className="text-[#E0D6C8] font-kai text-lg">{legacyContent}</p>
              </div>

              <button
                onClick={handleLegacyClaim}
                className="w-full py-3 bg-[#E0D6C8] text-[#1C1C1C] rounded-lg tracking-[0.2em] hover:bg-[#D0C6B8] transition-colors"
              >
                领取庇护
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 一柱香冥想弹窗 */}
      <AnimatePresence>
        {showMeditation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => {
                setShowMeditation(false);
                setIsMeditating(false);
              }}
              className="absolute top-8 right-8 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-kai text-white tracking-[0.3em] mb-4">一柱香</h2>
              <p className="text-xs text-white/40 tracking-[0.2em] uppercase">Meditation</p>
            </div>

            {/* 香炉动画 */}
            <div className="relative w-24 h-64 mb-12 flex justify-center items-end">
              {/* 香身 */}
              <div className="w-1 h-48 bg-gradient-to-t from-[#8B4513] to-[#D2691E] relative rounded-t-sm">
                {/* 燃烧点 */}
                <motion.div 
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full blur-[1px]"
                />
                {/* 烟雾 */}
                <motion.div
                  animate={{ 
                    y: [-10, -30, -50],
                    x: [0, 5, -5, 0],
                    opacity: [0.4, 0.2, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-12 bg-gray-400/30 blur-md rounded-full"
                />
              </div>
              {/* 香炉底座 */}
              <div className="absolute bottom-0 w-16 h-8 bg-[#2C2C2C] rounded-b-xl border-t border-white/10" />
            </div>

            <div className="text-center">
              <div className="text-4xl font-light text-white tracking-widest mb-8 font-variant-numeric tabular-nums">
                {formatMeditationTime(meditationTime)}
              </div>
              
              {!isMeditating ? (
                <button
                  onClick={() => setIsMeditating(true)}
                  className="px-12 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full tracking-[0.2em] transition-all border border-white/10"
                >
                  开始静心
                </button>
              ) : (
                <p className="text-white/40 tracking-[0.2em] text-sm animate-pulse">
                  静心凝神...
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  const { dailyRecord, submitDailyRecord, addMerit, guardianCheckIn, lastGuardianTime, updateEnergyState } = useUser();
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

  // Initialize state based on UserContext
  useEffect(() => {
    if (lastGuardianTime) {
      const now = Date.now();
      const elapsed = Math.floor((now - lastGuardianTime) / 1000);
      const remaining = Math.max(0, 259200 - elapsed);
      setTimeLeft(remaining);
      
      // Check if checked in today
      const lastDate = new Date(lastGuardianTime).toDateString();
      const today = new Date().toDateString();
      if (lastDate === today) {
        setIsActive(true);
      }
    }
  }, [lastGuardianTime]);

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
          if (!showLegacyCapsule && !isActive) { // Only trigger if not active (expired)
            triggerLegacyCapsule();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showLegacyCapsule, isActive]);

  // Meditation Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMeditating) {
      interval = setInterval(() => {
        setMeditationTime(prev => {
          if (prev >= 900) { // 15 minutes (one incense stick)
            clearInterval(interval);
            setIsMeditating(false);
            addMerit(5, 'pray', '一柱香时间');
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
    addMerit(28, 'guardian', '遗泽锦囊');
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
    if (isActive) {
      toast.info("今日已点亮");
      return;
    }

    if (!isLightUpTime()) {
      toast.error("每日 08:30 - 24:00 方可点亮");
      return;
    }
    setCurrentQuote(ZEN_QUOTES[Math.floor(Math.random() * ZEN_QUOTES.length)]);
    setShowZenQuote(true);
  };

  const confirmIgnite = () => {
    const result = guardianCheckIn();
    
    if (result.success) {
      // Update Energy State based on time
      const now = new Date();
      const hour = now.getHours();
      if (hour < 10) {
        updateEnergyState('guardian_early');
      } else {
        updateEnergyState('guardian_late');
      }

      setShowZenQuote(false);
      setIsActive(true);
      setTimeLeft(259200);
      
      if (!dailyRecord?.completed) {
        setShowDailyCheckIn(true);
      } else {
        toast.success(result.message);
        // setTimeout(() => setIsActive(false), 2000); // Don't turn off active state immediately
      }
    } else {
      toast.error(result.message);
      setShowZenQuote(false);
    }
  };

  const handleDailySubmit = () => {
    submitDailyRecord(selectedState, energyLevel, sleepQuality);
    setShowDailyCheckIn(false);
    toast.success("今日状态已记录");
  };

  // Calculate progress bars (mock: 1 day filled per light up, max 3)
  const progress = Math.min(3, Math.ceil((259200 - timeLeft) / 86400)); 

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-white/90 bg-black">
      {/* 动态背景视频 */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/videos/candle_loop.mp4" type="video/mp4" />
        </video>
        {/* 动态光影遮罩 */}
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 mix-blend-multiply"
        />
        {/* 额外的暗角遮罩 */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90" />
      </div>
      
      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 顶部栏 */}
        <div className="flex justify-between items-start mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2 font-kai text-white drop-shadow-lg">守望</h1>
            <p className="text-xs text-white/60 tracking-[0.3em] uppercase drop-shadow-md">Guardian</p>
          </motion.div>

          <button 
            onClick={() => setShowMeditation(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/5"
          >
            <Flame className="w-5 h-5 text-[#E0D6C8]" />
          </button>
        </div>

        {/* 命灯核心区 */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* 呼吸光环 - 模拟烛光范围 */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-80 h-80 rounded-full bg-[#FFD700] blur-[100px] mix-blend-screen pointer-events-none"
          />

          {/* 交互按钮 */}
          <button
            onClick={handleIgniteClick}
            className="relative w-48 h-48 rounded-full flex items-center justify-center group transition-transform duration-500 active:scale-95"
          >
            {/* 按钮背景 - 极简透明，让视频透出来 */}
            <div className="absolute inset-0 rounded-full border border-white/10 shadow-[0_0_30px_rgba(255,215,0,0.1)] group-hover:shadow-[0_0_50px_rgba(255,215,0,0.2)] transition-shadow duration-500" />
            
            <div className="relative z-10 text-center drop-shadow-lg">
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
              <p className="text-[10px] text-white/60 tracking-[0.3em] uppercase mb-2 drop-shadow-md">Remaining Time</p>
              <p className="text-3xl font-variant-numeric tabular-nums tracking-widest font-light text-white drop-shadow-lg">
                {formatTime(timeLeft)}
              </p>
            </div>
            
            {/* 3格进度条 */}
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`w-8 h-1.5 rounded-full transition-colors duration-500 backdrop-blur-sm ${
                    i <= progress ? 'bg-[#E0D6C8] shadow-[0_0_10px_rgba(224,214,200,0.5)]' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-auto text-center">
          <p className="text-xs text-white/50 tracking-wider flex items-center justify-center gap-2 drop-shadow-md">
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
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center max-w-xs"
            >
              <div className="mb-8">
                <Flame className="w-12 h-12 text-[#FFD700] mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-kai text-white tracking-[0.2em] leading-relaxed mb-4">
                  {currentQuote}
                </h2>
                <div className="w-8 h-[1px] bg-white/20 mx-auto" />
              </div>
              
              <button
                onClick={confirmIgnite}
                className="px-8 py-3 bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] rounded-full text-sm tracking-[0.2em] hover:bg-[#FFD700]/20 transition-colors"
              >
                确认点亮
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
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-xs bg-[#1C1C1C] rounded-3xl p-8 border border-white/10 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Shield className="w-8 h-8 text-white/60" />
              </div>
              
              <h2 className="text-xl text-white font-medium tracking-widest font-kai mb-2">遗泽锦囊</h2>
              <p className="text-xs text-white/60 mb-8">守护中断，锦囊开启</p>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
                <p className="text-lg font-kai text-[#FFD700] mb-2">{legacyContent}</p>
                <p className="text-[10px] text-white/40">已自动存入档案</p>
              </div>

              <button
                onClick={handleLegacyClaim}
                className="w-full py-3 bg-white text-black rounded-xl font-medium tracking-widest hover:bg-gray-200 transition-colors"
              >
                领取并重置
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 每日状态记录弹窗 */}
      <AnimatePresence>
        {showDailyCheckIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-xs bg-[#1C1C1C] rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <h2 className="text-lg text-white font-medium tracking-widest font-kai mb-6 text-center">今日状态</h2>
              
              <div className="space-y-6">
                {/* 状态选择 */}
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest">State</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['steady', 'advance', 'retreat'] as DailyState[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedState(s)}
                        className={`py-2 rounded-lg text-xs border transition-colors ${
                          selectedState === s 
                            ? 'bg-[#FFD700]/20 border-[#FFD700] text-[#FFD700]' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {s === 'steady' ? '平稳' : s === 'advance' ? '进取' : '收敛'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 能量水平 */}
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest">Energy</label>
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-1 border border-white/10">
                    {(['low', 'medium', 'high'] as EnergyLevel[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => setEnergyLevel(l)}
                        className={`flex-1 py-1.5 rounded-md text-xs transition-all ${
                          energyLevel === l 
                            ? 'bg-white/20 text-white shadow-sm' 
                            : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        {l === 'low' ? '低' : l === 'medium' ? '中' : '高'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 睡眠质量 */}
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest">Sleep</label>
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-1 border border-white/10">
                    {(['poor', 'fair', 'good'] as SleepQuality[]).map((q) => (
                      <button
                        key={q}
                        onClick={() => setSleepQuality(q)}
                        className={`flex-1 py-1.5 rounded-md text-xs transition-all ${
                          sleepQuality === q 
                            ? 'bg-white/20 text-white shadow-sm' 
                            : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        {q === 'poor' ? '差' : q === 'fair' ? '一般' : '好'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleDailySubmit}
                  className="w-full py-3 bg-[#FFD700] text-black rounded-xl font-medium tracking-widest hover:bg-[#E5C100] transition-colors mt-2"
                >
                  确认记录
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 冥想计时器 */}
      <AnimatePresence>
        {showMeditation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8"
          >
            <button 
              onClick={() => {
                setShowMeditation(false);
                setIsMeditating(false);
                setMeditationTime(0);
              }}
              className="absolute top-8 right-8 p-2 text-white/40 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-12">
              <h2 className="text-2xl font-kai text-white tracking-[0.3em] mb-2">一柱香</h2>
              <p className="text-xs text-white/40 tracking-widest">Meditation</p>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center mb-12">
              {/* 进度圆环 */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="#E0D6C8"
                  strokeWidth="2"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - meditationTime / 900)}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              
              <div className="text-center">
                <div className="text-4xl font-light text-white tabular-nums tracking-widest mb-2">
                  {formatMeditationTime(meditationTime)}
                </div>
                <div className="text-xs text-white/40 tracking-widest">
                  / 15:00
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMeditating(!isMeditating)}
              className={`px-12 py-4 rounded-full text-sm tracking-[0.2em] transition-all ${
                isMeditating 
                  ? 'bg-white/10 text-white border border-white/20' 
                  : 'bg-[#E0D6C8] text-black hover:bg-white'
              }`}
            >
              {isMeditating ? "暂停" : "开始"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Shield, Sparkles, Activity, Moon, Battery, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useUser, DailyState, EnergyLevel, SleepQuality } from "@/contexts/UserContext";

export default function GuardianPage() {
  const { dailyRecord, submitDailyRecord } = useUser();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(259200); // 72 hours
  const [showWeather, setShowWeather] = useState(false);
  const [showFortune, setShowFortune] = useState(false);
  
  // Daily Mainline State
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [selectedState, setSelectedState] = useState<DailyState>('steady');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('fair');

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
    if (!dailyRecord?.completed) {
      setShowDailyCheckIn(true);
    } else {
      toast.success("命灯已点亮，平安信号已发送");
      setTimeout(() => setIsActive(false), 2000);
    }
  };

  const handleDailySubmit = () => {
    submitDailyRecord(selectedState, energyLevel, sleepQuality);
    setShowDailyCheckIn(false);
    toast.success("今日状态已记录");
    setTimeout(() => setIsActive(false), 2000);
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
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 顶部栏 */}
        <div className="flex justify-between items-start mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2">守望</h1>
            <p className="text-xs text-[#8C8478] tracking-[0.3em] uppercase">Guardian</p>
          </motion.div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFortune(true)}
              className="p-3 rounded-full bg-[#F5E6C8]/20 backdrop-blur-sm border border-[#FFF8E7]/30 text-[#4A4036] hover:bg-[#F5E6C8]/40 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowWeather(true)}
              className="p-3 rounded-full bg-[#F5E6C8]/20 backdrop-blur-sm border border-[#FFF8E7]/30 text-[#4A4036] hover:bg-[#F5E6C8]/40 transition-colors"
            >
              <Sun className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 今日提醒卡 (仅当已签到时显示) */}
        <AnimatePresence>
          {dailyRecord?.completed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 bg-[#F5E6C8]/10 backdrop-blur-md rounded-xl p-4 border border-[#FFF8E7]/30 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-[#4A4036]/60 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#4A4036] font-medium tracking-wide mb-1">今日提醒</p>
                <p className="text-xs text-[#4A4036]/80 leading-relaxed">
                  今日状态：{dailyRecord.state === 'advance' ? '进（行）' : dailyRecord.state === 'retreat' ? '收（省）' : '稳（守）'}。
                  {dailyRecord.state === 'advance' ? '宜积极进取，把握良机。' : dailyRecord.state === 'retreat' ? '宜韬光养晦，内观自省。' : '宜稳扎稳打，步步为营。'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

      {/* 每日主线流程弹窗 */}
      <AnimatePresence>
        {showDailyCheckIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#E8E2D2]/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-medium tracking-[0.2em] text-[#4A4036] mb-2">今日已在</h3>
                <p className="text-xs text-[#8C8478] tracking-widest">Daily Check-in</p>
              </div>

              <div className="space-y-8">
                {/* 1. 状态选择 */}
                <div className="space-y-3">
                  <p className="text-sm text-[#4A4036] tracking-widest text-center">今日状态</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(['steady', 'advance', 'retreat'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedState(s)}
                        className={`py-3 rounded-xl text-xs tracking-widest transition-all ${
                          selectedState === s
                            ? 'bg-[#4A4036] text-[#F9F9F7]'
                            : 'bg-[#F9F9F7]/50 text-[#4A4036] hover:bg-[#F9F9F7]'
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
                        <Battery className="w-4 h-4 text-[#4A4036]/60" />
                        <span className="text-xs text-[#4A4036] tracking-widest">精力感受</span>
                      </div>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as const).map((l) => (
                          <button
                            key={l}
                            onClick={() => setEnergyLevel(l)}
                            className={`w-8 h-8 rounded-full text-[10px] flex items-center justify-center transition-all ${
                              energyLevel === l
                                ? 'bg-[#4A4036] text-[#F9F9F7]'
                                : 'bg-[#F9F9F7]/50 text-[#4A4036]'
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
                        <Moon className="w-4 h-4 text-[#4A4036]/60" />
                        <span className="text-xs text-[#4A4036] tracking-widest">睡眠感受</span>
                      </div>
                      <div className="flex gap-2">
                        {(['poor', 'fair', 'good'] as const).map((q) => (
                          <button
                            key={q}
                            onClick={() => setSleepQuality(q)}
                            className={`w-8 h-8 rounded-full text-[10px] flex items-center justify-center transition-all ${
                              sleepQuality === q
                                ? 'bg-[#4A4036] text-[#F9F9F7]'
                                : 'bg-[#F9F9F7]/50 text-[#4A4036]'
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
                  className="w-full py-4 bg-[#4A4036] text-[#F9F9F7] rounded-xl text-sm tracking-[0.3em] hover:bg-[#4A4036]/90 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  确认记录
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 能量天气弹窗 (保持原有逻辑) */}
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

      {/* 今日运势弹窗 (保持原有逻辑) */}
      <AnimatePresence>
        {showFortune && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#E8E2D2]/60 backdrop-blur-md flex items-center justify-center p-8"
            onClick={() => setShowFortune(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full bg-[#F9F9F7] rounded-3xl p-8 shadow-2xl border border-[#FFF8E7] relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Sparkles className="w-32 h-32 text-[#4A4036]" />
              </div>
              
              <h3 className="text-xl font-medium tracking-[0.2em] text-[#4A4036] mb-6">今日运势</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-[#4A4036]/10 pb-4">
                  <div>
                    <p className="text-xs text-[#8C8478] tracking-widest mb-1">宜</p>
                    <p className="text-lg text-[#4A4036] tracking-widest">静思 读书 祈福</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#8C8478] tracking-widest mb-1">忌</p>
                    <p className="text-lg text-[#4A4036] tracking-widest">争执 远行 动土</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#4A4036]/5 p-4 rounded-xl">
                    <p className="text-xs text-[#8C8478] tracking-widest mb-1">幸运色</p>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#D4C4B7]"></div>
                      <span className="text-sm text-[#4A4036]">云岩灰</span>
                    </div>
                  </div>
                  <div className="bg-[#4A4036]/5 p-4 rounded-xl">
                    <p className="text-xs text-[#8C8478] tracking-widest mb-1">吉神方位</p>
                    <span className="text-sm text-[#4A4036]">正南方</span>
                  </div>
                </div>

                <div className="bg-[#F5E6C8]/20 p-6 rounded-xl border border-[#FFF8E7]/50">
                  <p className="text-xs text-[#8C8478] tracking-[0.3em] uppercase mb-3 text-center">Daily Zen</p>
                  <p className="text-sm text-[#4A4036] leading-loose tracking-wide text-center font-light">
                    "心如止水，乱则不明。今日宜内观自省，于喧嚣中寻得一份宁静。"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowFortune(false)}
                className="mt-8 w-full py-4 text-xs tracking-[0.2em] text-[#8C8478] hover:text-[#4A4036] transition-colors border-t border-[#4A4036]/10"
              >
                收起
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

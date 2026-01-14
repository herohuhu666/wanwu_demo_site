import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronRight, Lock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

export default function LingxiPage() {
  const { dailyRecord, profile, isMember } = useUser();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | {
    symbol: string;
    gua: string;
    interpretation: string;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);

  const handleAsk = () => {
    if (!input.trim()) return;
    
    // Check daily limit for non-members
    if (!isMember && dailyCount >= 3) {
      toast.error("今日灵犀次数已尽，请明日再来或升级会员");
      return;
    }

    setIsLoading(true);
    
    // Mock Logic: Generate response based on Daily State & Profile
    setTimeout(() => {
      const state = dailyRecord?.state || 'steady';
      let interpretation = "";
      let symbol = "";
      let gua = "";

      // Logic based on Daily State
      if (state === 'advance') {
        symbol = "风起云涌";
        gua = "乾为天";
        interpretation = `鉴于今日势头为“进”，且${profile.name ? `阁下(${profile.name})` : '阁下'}精力充沛。当下之象，如顺水行舟。宜积极进取，把握良机。细节之中藏有转机，大胆尝试，方能洞察先机。`;
      } else if (state === 'retreat') {
        symbol = "山雨欲来";
        gua = "艮为山";
        interpretation = `鉴于今日势头为“收”，${profile.name ? `阁下(${profile.name})` : '阁下'}宜静不宜动。当下之象，如山止于前。宜韬光养晦，内观自省。暂避锋芒，积蓄力量，待时而动。`;
      } else {
        symbol = "平湖秋月";
        gua = "坤为地";
        interpretation = `鉴于今日势头为“稳”，${profile.name ? `阁下(${profile.name})` : '阁下'}心境平和。当下之象，如大地承载万物。宜稳扎稳打，步步为营。不急不躁，顺其自然，方得始终。`;
      }

      // Append profile influence if available
      if (profile.birthCity) {
        interpretation += ` 考虑到阁下生于${profile.birthCity}，此地风土亦助长此势。`;
      }

      setResult({
        symbol,
        gua,
        interpretation
      });
      setIsLoading(false);
      setDailyCount(prev => prev + 1);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif">
      {/* 背景图 */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/zen_bg.png)' }}
      />
      
      {/* 顶部遮罩，保证状态栏清晰 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#E8E2D2]/80 to-transparent z-10" />

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 标题区 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl text-[#4A4036] tracking-[0.2em] font-medium mb-2">灵犀</h1>
          <p className="text-xs text-[#8C8478] tracking-[0.3em] uppercase">Insight</p>
        </motion.div>

        {/* 交互区 */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="bg-[#F5E6C8]/20 backdrop-blur-[2px] rounded-2xl p-6 border border-[#FFF8E7]/30 shadow-[0_8px_32px_rgba(74,64,54,0.05)]">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入当下所见之细节..."
                  className="w-full bg-transparent border-none resize-none text-[#4A4036] placeholder-[#8C8478]/60 text-lg leading-relaxed focus:ring-0 min-h-[120px] text-center"
                />
                
                <div className="mt-6 flex flex-col items-center gap-3">
                  <button
                    onClick={handleAsk}
                    disabled={!input.trim() || isLoading}
                    className="group relative px-8 py-3 overflow-hidden rounded-full transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-[#4A4036] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                    <div className="relative flex items-center gap-3 text-[#4A4036]">
                      <span className="text-sm tracking-[0.2em] font-medium">
                        {isLoading ? "感应中..." : "叩问"}
                      </span>
                      {!isLoading && <Send className="w-3 h-3 opacity-60" />}
                    </div>
                  </button>
                  
                  {!isMember && (
                    <p className="text-[10px] text-[#8C8478]/60 tracking-wider flex items-center gap-1">
                      今日剩余次数: {3 - dailyCount} <Lock className="w-3 h-3" />
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col"
            >
              {/* 结果卡片 */}
              <div className="flex-1 bg-[#F5E6C8]/10 backdrop-blur-sm rounded-3xl p-8 border border-[#FFF8E7]/20 shadow-[0_16px_48px_rgba(74,64,54,0.08)] flex flex-col items-center text-center relative overflow-hidden">
                
                {/* 装饰纹理 */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4A4036]/20 to-transparent opacity-30" />

                <div className="mt-4 mb-8">
                  <span className="text-xs text-[#8C8478] tracking-[0.4em] block mb-2">取象</span>
                  <h2 className="text-2xl text-[#4A4036] font-bold tracking-widest">{result.symbol}</h2>
                </div>

                <div className="w-12 h-[1px] bg-[#4A4036]/10 mb-8" />

                <div className="mb-8">
                  <span className="text-xs text-[#8C8478] tracking-[0.4em] block mb-2">卦象</span>
                  <h3 className="text-xl text-[#4A4036] font-medium tracking-widest">{result.gua}</h3>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[#4A4036]/90 text-base leading-loose tracking-wide font-light">
                    {result.interpretation}
                  </p>
                </div>

                <button 
                  onClick={() => { setResult(null); setInput(""); }}
                  className="mt-8 text-[#8C8478] text-xs tracking-[0.2em] hover:text-[#4A4036] transition-colors flex items-center gap-2"
                >
                  再次叩问 <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

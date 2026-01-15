import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Plus, TrendingUp, Lock, ShieldCheck, Calendar, Hand, BookOpen, PenTool, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

type LogType = 'check_in' | 'pray' | 'altruism' | 'reflection' | 'consume' | 'first_ritual' | 'first_insight' | 'guardian';

interface Log {
  id: string;
  type: LogType;
  content: string;
  value: number;
  time: string;
}

const LOG_TYPES: { type: LogType; label: string; value: number; icon: any; color: string; desc: string }[] = [
  { type: 'check_in', label: '签到', value: 1, icon: Calendar, color: 'bg-[#789262]', desc: '每日守望，心安路顺' },
  { type: 'pray', label: '祈福', value: 5, icon: Heart, color: 'bg-[#E0C38C]', desc: '善念回向，广结善缘' },
  { type: 'altruism', label: '利他', value: 10, icon: Hand, color: 'bg-[#8C8478]', desc: '赠人玫瑰，手有余香' },
  { type: 'reflection', label: '自省', value: 5, icon: BookOpen, color: 'bg-[#2C2C2C]', desc: '静思己过，日进有功' },
  // System types (not for manual add)
  { type: 'consume', label: '兑换', value: -50, icon: Sparkles, color: 'bg-white/10', desc: '功德兑换' },
  { type: 'first_ritual', label: '初卦', value: 3, icon: Sparkles, color: 'bg-[#FFD700]', desc: '初次立命' },
  { type: 'first_insight', label: '初灵', value: 3, icon: Sparkles, color: 'bg-[#FFD700]', desc: '初次灵犀' },
  { type: 'guardian', label: '守望', value: 2, icon: ShieldCheck, color: 'bg-[#789262]', desc: '守望点亮' },
];

export default function MeritPage() {
  const { merit, addMerit, isMember, meritHistory } = useUser();
  // Map meritHistory to logs format for display
  const logs = meritHistory.map(h => ({
    id: h.id,
    type: h.type as LogType,
    content: h.desc,
    value: h.amount,
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));
  const [activeAction, setActiveAction] = useState<LogType | null>(null);
  const [input, setInput] = useState("");
  const [showTrend, setShowTrend] = useState(false);

  const handleAddLog = () => {
    if (!activeAction) return;
    
    // For check-in, no input needed
    if (activeAction === 'check_in') {
      // Logic handled in Guardian page usually, but allowed here for demo
    } else if (!input.trim()) {
      toast.error("请填写内容");
      return;
    }

    const typeConfig = LOG_TYPES.find(t => t.type === activeAction)!;
    addMerit(typeConfig.value, activeAction, input || typeConfig.label);
    setInput("");
    setActiveAction(null);
    toast.success(`功德 +${typeConfig.value}`);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-white/90 bg-black">
      {/* 背景图片 */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/merit_bg.png" 
          alt="Merit Background" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* 渐变遮罩，确保文字可读性 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-6 pt-20 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 顶部栏 */}
        <div className="flex justify-between items-start mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2 font-kai text-white">功德</h1>
            <p className="text-xs text-white/60 tracking-[0.3em] uppercase">Merit</p>
          </motion.div>
          
          <div className="flex gap-3">
            <button className="p-3 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
              <ShoppingBag className="w-5 h-5 opacity-70" />
            </button>
          </div>
        </div>

        {/* 功德值展示 */}
        <div className="text-center mb-10 relative">
          <motion.div 
            key={merit}
            initial={{ scale: 1.2, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-light text-[#FFD700] tabular-nums font-kai drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            {merit}
          </motion.div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <ShieldCheck className="w-3 h-3 text-[#FFD700]" />
            <p className="text-xs text-[#FFD700] uppercase tracking-[0.3em]">Trust Indicator</p>
          </div>
          <p className="text-[10px] text-white/40 mt-2 tracking-wider">
            功德即信任，信任即力量
          </p>
        </div>

        {/* 四大行为入口 (Only manual types) */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {LOG_TYPES.filter(t => ['check_in', 'pray', 'altruism', 'reflection'].includes(t.type)).map((item) => (
            <Dialog key={item.type}>
              <DialogTrigger asChild>
                <button 
                  onClick={() => {
                    setActiveAction(item.type);
                    setInput("");
                  }}
                  className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 hover:border-[#FFD700]/30 transition-all backdrop-blur-sm"
                >
                  <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-3 text-[#FFD700]`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-kai text-white/90">{item.label}</span>
                    <span className="text-xs font-medium text-[#FFD700]">+{item.value}</span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#1C1C1C] border border-white/10 shadow-2xl max-w-[320px] rounded-3xl text-white">
                <DialogHeader>
                  <DialogTitle className="font-kai text-center text-xl text-white tracking-widest mb-2">{item.label}</DialogTitle>
                  <p className="text-center text-xs text-white/60 tracking-wide">{item.desc}</p>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {item.type !== 'check_in' && (
                    <div className="relative">
                      <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={item.type === 'pray' ? "回向给谁？愿望为何？" : item.type === 'altruism' ? "今日行何善事？" : "今日有何过失？"} 
                        className="bg-white/5 border-none text-white placeholder:text-white/30 h-12 px-4 rounded-xl focus-visible:ring-1 focus-visible:ring-[#FFD700]/50" 
                      />
                      <PenTool className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    </div>
                  )}
                  <Button 
                    onClick={handleAddLog}
                    className="w-full bg-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700]/30 tracking-widest h-12 rounded-xl text-sm font-medium border border-[#FFD700]/20"
                  >
                    确认记录
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* 趋势分析入口 (会员功能) */}
        <div className="mb-6">
          <button
            onClick={() => setShowTrend(!showTrend)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white tracking-wider">功德明细</p>
                <p className="text-xs text-white/60 tracking-wide">善行积累趋势</p>
              </div>
            </div>
            {isMember ? (
              <div className="text-xs text-white/80 tracking-widest">查看详情</div>
            ) : (
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-white/40" />
                <span className="text-[10px] text-white/40">会员</span>
              </div>
            )}
          </button>

          {/* 趋势分析展开内容 */}
          <AnimatePresence>
            {showTrend && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-4 rounded-xl bg-white/5 border border-white/10 text-center backdrop-blur-sm">
                  {isMember ? (
                    <div className="space-y-4">
                      {/* Mock Chart */}
                      <div className="h-32 w-full flex items-end justify-between px-2 gap-1">
                        {[30, 45, 35, 60, 50, 70, 65].map((h, i) => (
                          <div key={i} className="w-full bg-white/10 rounded-t-sm relative group">
                            <div 
                              className="absolute bottom-0 left-0 right-0 bg-[#FFD700] rounded-t-sm transition-all duration-500 opacity-80"
                              style={{ height: `${h}%` }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-white/40 px-1">
                        <span>Mon</span><span>Sun</span>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed text-left mt-2">
                        <span className="font-medium text-[#FFD700]">周报：</span>本周善行积累稳步上升，"利他"行为占比最高，建议继续保持。
                      </p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <p className="text-sm text-white mb-2 tracking-widest font-kai">会员专属功能</p>
                      <p className="text-xs text-white/60 mb-4 leading-relaxed">
                        升级会员解锁 7天/14天 趋势分析<br/>
                        及多维状态对照图表
                      </p>
                      <Button size="sm" className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/20 tracking-widest rounded-full px-6 hover:bg-[#FFD700]/30">立即升级</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 记录列表 */}
        <div className="flex-1 bg-white/5 backdrop-blur-md rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col border-t border-white/10">
          <div className="p-6 pb-2 flex justify-between items-center">
            <h3 className="text-xs font-medium text-white/60 uppercase tracking-[0.2em]">History</h3>
            {!isMember && (
              <span className="text-[10px] text-white/40 flex items-center gap-1">
                仅展示近3天 <Lock className="w-3 h-3" />
              </span>
            )}
          </div>
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-20">
              <AnimatePresence initial={false}>
                {logs.map(log => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-white/10 text-[#FFD700]`}>
                        {(() => {
                          const typeConfig = LOG_TYPES.find(t => t.type === log.type);
                          const Icon = typeConfig?.icon;
                          return Icon ? <Icon className="w-4 h-4" /> : (typeConfig?.label[0] || '?');
                        })()}
                      </div>
                      <div>
                        <p className="text-white/90 text-sm font-medium tracking-wide">{log.content}</p>
                        <p className="text-xs text-white/40 tracking-wider">{log.time}</p>
                      </div>
                    </div>
                    <span className={`font-medium text-sm ${log.value > 0 ? 'text-[#FFD700]' : 'text-white/60'}`}>
                      {log.value > 0 ? '+' : ''}{log.value}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {!isMember && logs.length > 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-white/40 mb-2">更多历史记录仅会员可见</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

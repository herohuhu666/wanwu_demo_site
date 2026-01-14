import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Plus, TrendingUp, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

type LogType = 'check-in' | 'pray' | 'altruism' | 'reflect';

interface Log {
  id: string;
  type: LogType;
  content: string;
  value: number;
  time: string;
}

const LOG_TYPES: { type: LogType; label: string; value: number; color: string }[] = [
  { type: 'check-in', label: '签到', value: 1, color: 'bg-[#4A4036]/10 text-[#4A4036]' },
  { type: 'pray', label: '祈福', value: 5, color: 'bg-[#F5E6C8] text-[#4A4036]' },
  { type: 'altruism', label: '利他', value: 10, color: 'bg-[#D4C4B7] text-[#F9F9F7]' },
  { type: 'reflect', label: '自省', value: 5, color: 'bg-[#4A4036] text-[#F9F9F7]' },
];

export default function MeritPage() {
  const { merit, addMerit, isMember } = useUser();
  const [logs, setLogs] = useState<Log[]>([
    { id: '1', type: 'check-in', content: '每日守望', value: 1, time: '08:30' },
    { id: '2', type: 'altruism', content: '帮邻居收快递', value: 10, time: 'Yesterday' },
  ]);
  const [selectedType, setSelectedType] = useState<LogType>('altruism');
  const [input, setInput] = useState("");
  const [showTrend, setShowTrend] = useState(false);

  const handleAddLog = () => {
    if (!input.trim()) return;
    const typeConfig = LOG_TYPES.find(t => t.type === selectedType)!;
    const newLog: Log = {
      id: Date.now().toString(),
      type: selectedType,
      content: input,
      value: typeConfig.value,
      time: 'Just now'
    };
    setLogs([newLog, ...logs]);
    addMerit(typeConfig.value);
    setInput("");
    toast.success("信任值 + " + typeConfig.value);
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
      <div className="relative z-20 flex-1 flex flex-col px-6 pt-20 pb-8">
        
        {/* 顶部栏 */}
        <div className="flex justify-between items-start mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2">功德</h1>
            <p className="text-xs text-[#8C8478] tracking-[0.3em] uppercase">Merit</p>
          </motion.div>
          
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-3 rounded-full bg-[#F5E6C8]/20 backdrop-blur-sm border border-[#FFF8E7]/30 text-[#4A4036] hover:bg-[#F5E6C8]/40 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#F9F9F7] border border-[#FFF8E7] shadow-2xl max-w-[320px]">
                <DialogHeader>
                  <DialogTitle className="font-serif text-center text-xl text-[#4A4036] tracking-widest">功德回向</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="回向给谁？(如：母亲)" className="bg-white/50 border-[#4A4036]/10" />
                  <Input placeholder="回向语 (如：愿身体健康)" className="bg-white/50 border-[#4A4036]/10" />
                  <Button className="w-full bg-[#4A4036] text-[#F9F9F7] hover:bg-[#4A4036]/90 tracking-widest">确认回向</Button>
                </div>
              </DialogContent>
            </Dialog>

            <button className="p-3 rounded-full bg-[#F5E6C8]/20 backdrop-blur-sm border border-[#FFF8E7]/30 text-[#4A4036] hover:bg-[#F5E6C8]/40 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 功德值展示 */}
        <div className="text-center mb-8">
          <motion.div 
            key={merit}
            initial={{ scale: 1.2, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-light text-[#4A4036] tabular-nums"
          >
            {merit}
          </motion.div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <ShieldCheck className="w-3 h-3 text-[#8C8478]" />
            <p className="text-xs text-[#8C8478] uppercase tracking-[0.3em]">Trust Indicator</p>
          </div>
          <p className="text-[10px] text-[#8C8478]/60 mt-2 tracking-wider">
            功德即信任，信任即力量
          </p>
        </div>

        {/* 趋势分析入口 (会员功能) */}
        <div className="mb-6">
          <button
            onClick={() => setShowTrend(!showTrend)}
            className="w-full p-4 rounded-xl bg-[#F5E6C8]/10 backdrop-blur-md border border-[#FFF8E7]/30 flex items-center justify-between group hover:bg-[#F5E6C8]/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#4A4036]/5 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#4A4036]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-[#4A4036] tracking-wider">趋势分析</p>
                <p className="text-xs text-[#8C8478] tracking-wide">节奏 × 态势 × 健康</p>
              </div>
            </div>
            {isMember ? (
              <div className="text-xs text-[#4A4036] tracking-widest">查看详情</div>
            ) : (
              <Lock className="w-4 h-4 text-[#8C8478]/60" />
            )}
          </button>

          {/* 趋势分析展开内容 (模拟) */}
          <AnimatePresence>
            {showTrend && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-4 rounded-xl bg-[#F9F9F7]/50 border border-[#4A4036]/5 text-center">
                  {isMember ? (
                    <div className="space-y-4">
                      <div className="h-32 bg-[#4A4036]/5 rounded-lg flex items-center justify-center">
                        <p className="text-xs text-[#8C8478]">趋势图表占位符</p>
                      </div>
                      <p className="text-xs text-[#4A4036] leading-relaxed">
                        本周节奏平稳，精力充沛。建议保持当前的作息规律，适度增加内观时间。
                      </p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <p className="text-sm text-[#4A4036] mb-2 tracking-widest">会员专属功能</p>
                      <p className="text-xs text-[#8C8478] mb-4 leading-relaxed">
                        升级会员解锁 7天/14天 趋势分析<br/>
                        及多维状态对照图表
                      </p>
                      <Button size="sm" className="bg-[#4A4036] text-[#F9F9F7] tracking-widest">立即升级</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 记录输入区 */}
        <div className="mb-6">
          <div className="bg-[#F9F9F7]/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-[#FFF8E7]">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {LOG_TYPES.map(t => (
                <button
                  key={t.type}
                  onClick={() => setSelectedType(t.type)}
                  className={`px-4 py-2 rounded-full text-xs tracking-wider whitespace-nowrap transition-all ${
                    selectedType === t.type 
                      ? t.color + ' shadow-md'
                      : 'bg-[#4A4036]/5 text-[#8C8478] hover:bg-[#4A4036]/10'
                  }`}
                >
                  {t.label} +{t.value}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="记录当下的善念..."
                className="border-none bg-[#4A4036]/5 focus-visible:ring-0 text-[#4A4036] placeholder:text-[#8C8478]/60"
                onKeyDown={(e) => e.key === 'Enter' && handleAddLog()}
              />
              <Button size="icon" className="bg-[#4A4036] hover:bg-[#4A4036]/90 shrink-0 rounded-xl" onClick={handleAddLog}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 记录列表 */}
        <div className="flex-1 bg-[#F9F9F7]/80 backdrop-blur-sm rounded-t-3xl shadow-[0_-4px_20px_rgba(74,64,54,0.05)] overflow-hidden flex flex-col border-t border-[#FFF8E7]">
          <div className="p-6 pb-2 flex justify-between items-center">
            <h3 className="text-xs font-medium text-[#8C8478] uppercase tracking-[0.2em]">History</h3>
            {!isMember && (
              <span className="text-[10px] text-[#8C8478]/60 flex items-center gap-1">
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
                    className="flex items-center justify-between py-3 border-b border-[#4A4036]/5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        LOG_TYPES.find(t => t.type === log.type)?.color.replace('text-[#F9F9F7]', 'text-[#4A4036]/80').replace('bg-[#4A4036]', 'bg-[#4A4036]/20')
                      }`}>
                        {LOG_TYPES.find(t => t.type === log.type)?.label[0]}
                      </div>
                      <div>
                        <p className="text-[#4A4036] text-sm font-medium tracking-wide">{log.content}</p>
                        <p className="text-xs text-[#8C8478] tracking-wider">{log.time}</p>
                      </div>
                    </div>
                    <span className="text-[#4A4036]/60 font-medium text-sm">+{log.value}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {!isMember && logs.length > 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-[#8C8478]/60 mb-2">更多历史记录仅会员可见</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

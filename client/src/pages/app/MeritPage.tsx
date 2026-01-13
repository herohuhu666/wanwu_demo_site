import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type LogType = 'check-in' | 'pray' | 'altruism' | 'reflect';

interface Log {
  id: string;
  type: LogType;
  content: string;
  value: number;
  time: string;
}

const LOG_TYPES: { type: LogType; label: string; value: number; color: string }[] = [
  { type: 'check-in', label: '签到', value: 1, color: 'bg-blue-100 text-blue-600' },
  { type: 'pray', label: '祈福', value: 5, color: 'bg-amber-100 text-amber-600' },
  { type: 'altruism', label: '利他', value: 10, color: 'bg-green-100 text-green-600' },
  { type: 'reflect', label: '自省', value: 5, color: 'bg-purple-100 text-purple-600' },
];

export default function MeritPage() {
  const [merit, setMerit] = useState(108);
  const [logs, setLogs] = useState<Log[]>([
    { id: '1', type: 'check-in', content: '每日守望', value: 1, time: '08:30' },
    { id: '2', type: 'altruism', content: '帮邻居收快递', value: 10, time: 'Yesterday' },
  ]);
  const [selectedType, setSelectedType] = useState<LogType>('altruism');
  const [input, setInput] = useState("");

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
    setMerit(m => m + typeConfig.value);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col bg-[#f9f9f7] relative">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center p-6 pt-12">
        <div className="flex flex-col">
          <span className="text-xs text-stone-500 tracking-widest uppercase">Merit</span>
          <h1 className="text-2xl font-serif text-stone-800">功德</h1>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-stone-600 hover:bg-stone-200/50 rounded-full">
                <Heart className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#f9f9f7] border-none shadow-xl max-w-[320px]">
              <DialogHeader>
                <DialogTitle className="font-serif text-center text-xl">功德回向</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="回向给谁？(如：母亲)" className="bg-white" />
                <Input placeholder="回向语 (如：愿身体健康)" className="bg-white" />
                <Button className="w-full bg-stone-800 text-white hover:bg-stone-700">确认回向</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" className="text-stone-600 hover:bg-stone-200/50 rounded-full">
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 功德值展示 */}
      <div className="px-6 pb-6 text-center">
        <motion.div 
          key={merit}
          initial={{ scale: 1.2, color: "#d97706" }}
          animate={{ scale: 1, color: "#1c1917" }}
          className="text-6xl font-serif font-bold text-stone-900"
        >
          {merit}
        </motion.div>
        <p className="text-xs text-stone-400 uppercase tracking-widest mt-2">Total Merit</p>
      </div>

      {/* 记录输入区 */}
      <div className="px-6 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {LOG_TYPES.map(t => (
              <button
                key={t.type}
                onClick={() => setSelectedType(t.type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedType === t.type 
                    ? 'bg-stone-800 text-white' 
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
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
              className="border-none bg-stone-50 focus-visible:ring-0"
              onKeyDown={(e) => e.key === 'Enter' && handleAddLog()}
            />
            <Button size="icon" className="bg-stone-800 hover:bg-stone-700 shrink-0" onClick={handleAddLog}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 记录列表 */}
      <div className="flex-1 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        <div className="p-6 pb-2">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">History</h3>
        </div>
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-20">
            <AnimatePresence initial={false}>
              {logs.map(log => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${LOG_TYPES.find(t => t.type === log.type)?.color}`}>
                      {LOG_TYPES.find(t => t.type === log.type)?.label[0]}
                    </div>
                    <div>
                      <p className="text-stone-800 text-sm font-medium">{log.content}</p>
                      <p className="text-xs text-stone-400">{log.time}</p>
                    </div>
                  </div>
                  <span className="text-amber-600 font-bold text-sm">+{log.value}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

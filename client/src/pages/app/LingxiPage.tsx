import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function LingxiPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    image: string;
    hexagram: string;
    judgment: string;
    karma?: string;
    action?: string;
    risk?: string;
  }>(null);
  const [isMember, setIsMember] = useState(false); // 模拟会员状态

  const handleAsk = () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setResult({
        image: "离火之象",
        hexagram: "火天大有",
        judgment: "日丽中天，遍照万物。所求之事，如日中天，顺势而为即可。",
        // 会员专属内容
        karma: "因往日积累善缘，得今日之果。非一时之运，乃长久之功。",
        action: "1. 保持谦逊，忌骄躁。\n2. 适宜公开展示成果。\n3. 可尝试跨界合作。",
        risk: "盛极必衰，需防微杜渐。注意与周围人的关系平衡。"
      });
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#f9f9f7] relative">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center p-6 pt-12">
        <div className="flex flex-col">
          <span className="text-xs text-stone-500 tracking-widest uppercase">Insight</span>
          <h1 className="text-2xl font-serif text-stone-800">灵犀</h1>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="member-mode" className="text-xs text-stone-400">模拟会员</Label>
          <Switch id="member-mode" checked={isMember} onCheckedChange={setIsMember} />
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 px-6 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          {!result && !loading ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col justify-center"
            >
              <p className="text-stone-500 text-center mb-8 font-serif italic text-lg">
                "万物皆有象，<br/>在此刻，你看到了什么？"
              </p>
              <div className="relative">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入当下观察到的一个细节..."
                  className="bg-white border-stone-200 h-14 pl-4 pr-12 rounded-xl shadow-sm focus-visible:ring-stone-400 text-base"
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                />
                <Button 
                  size="icon"
                  className="absolute right-2 top-2 h-10 w-10 rounded-lg bg-stone-800 hover:bg-stone-700"
                  onClick={handleAsk}
                  disabled={!input.trim()}
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </Button>
              </div>
              <p className="text-xs text-center text-stone-400 mt-4">
                今日剩余次数: <span className="font-mono">3/3</span>
              </p>
            </motion.div>
          ) : loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin mb-4" />
              <p className="text-stone-500 text-sm tracking-widest uppercase">Divining...</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 py-4"
            >
              {/* 基础结果卡片 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Result</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-stone-400 block mb-1">取象</span>
                    <p className="font-serif text-lg text-stone-800">{result?.image}</p>
                  </div>
                  <div className="h-px bg-stone-100" />
                  <div>
                    <span className="text-xs text-stone-400 block mb-1">起卦</span>
                    <p className="font-serif text-lg text-stone-800">{result?.hexagram}</p>
                  </div>
                  <div className="h-px bg-stone-100" />
                  <div>
                    <span className="text-xs text-stone-400 block mb-1">断事</span>
                    <p className="text-stone-600 leading-relaxed">{result?.judgment}</p>
                  </div>
                </div>
              </div>

              {/* 会员专属卡片 */}
              {isMember ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-stone-900 p-6 rounded-2xl shadow-lg text-stone-300"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pro Insight</span>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs text-stone-500 block mb-1">因果推演</span>
                      <p className="text-sm leading-relaxed text-stone-200">{result?.karma}</p>
                    </div>
                    <div>
                      <span className="text-xs text-stone-500 block mb-1">行动清单</span>
                      <p className="text-sm leading-relaxed text-stone-200 whitespace-pre-line">{result?.action}</p>
                    </div>
                    <div>
                      <span className="text-xs text-stone-500 block mb-1">风险边界</span>
                      <p className="text-sm leading-relaxed text-stone-200">{result?.risk}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200 border-dashed flex flex-col items-center text-center">
                  <Lock className="w-8 h-8 text-stone-300 mb-3" />
                  <h3 className="font-serif text-stone-600 mb-1">深度洞察</h3>
                  <p className="text-xs text-stone-400 mb-4">升级会员解锁因果推演、行动清单与风险边界</p>
                  <Button variant="outline" size="sm" onClick={() => setIsMember(true)}>
                    模拟升级会员
                  </Button>
                </div>
              )}

              <Button 
                variant="ghost" 
                className="w-full text-stone-400 hover:text-stone-600"
                onClick={() => { setResult(null); setInput(""); }}
              >
                再次提问
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const QUOTES = [
  "保持专注，好事在路上。",
  "每一个不曾起舞的日子，都是对生命的辜负。",
  "万物皆有裂痕，那是光照进来的地方。",
  "种一棵树最好的时间是十年前，其次是现在。",
  "生活不是等待风暴过去，而是学会在雨中跳舞。",
  "你若盛开，清风自来。",
  "心有猛虎，细嗅蔷薇。",
  "知足且上进，温柔而坚定。"
];

export default function LingxiPage() {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);
  const [count, setCount] = useState(5);

  const handleGetInspiration = () => {
    if (count <= 0) {
      toast.info("今天的次数已用完，明天再来");
      return;
    }

    setLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setQuote(randomQuote);
      setCount(prev => prev - 1);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="h-full flex flex-col items-center p-6 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-wanwu-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-wanwu-purple/5 rounded-full blur-3xl pointer-events-none" />

      <h2 className="text-2xl font-serif font-medium mb-8 mt-4 text-primary z-10">每日灵犀</h2>

      <div className="flex-1 w-full flex flex-col items-center justify-center z-10">
        {quote ? (
          <div className="w-full aspect-[3/4] max-h-[400px] bg-wanwu-purple/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative animate-in fade-in slide-in-from-bottom-4 duration-700 border border-wanwu-purple/20 shadow-lg shadow-wanwu-purple/5">
            <Sparkles className="w-8 h-8 text-wanwu-purple mb-6 opacity-50" />
            <p className="text-xl font-serif leading-relaxed text-gray-800">
              "{quote}"
            </p>
            <div className="absolute bottom-4 text-xs text-wanwu-purple/60 font-medium tracking-widest uppercase">
              Wanwu Inspiration
            </div>
          </div>
        ) : (
          <div className="w-40 h-40 rounded-full bg-wanwu-purple/10 flex items-center justify-center mb-6 animate-pulse">
            <Lightbulb className="w-16 h-16 text-wanwu-purple" />
          </div>
        )}
        
        {!quote && (
          <p className="text-gray-500 text-center max-w-[200px]">
            点击下方按钮<br/>获取今日份的灵感与指引
          </p>
        )}
      </div>

      <div className="w-full mt-8 z-10">
        <p className="text-center text-sm text-gray-400 mb-4">
          今天还可用 <span className="font-bold text-wanwu-purple">{count}</span> 次
        </p>
        
        <Button 
          onClick={handleGetInspiration}
          disabled={loading}
          className={cn(
            "w-full bg-wanwu-purple hover:bg-wanwu-purple/90 text-white rounded-full h-12 text-base transition-all duration-300 shadow-lg shadow-wanwu-purple/20",
            loading && "opacity-80"
          )}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "获取灵感"
          )}
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronRight, Lock, MessageCircle, Mic, History, X, Sparkles, Trash2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { AudioAnchor } from "@/components/AudioAnchor";
import { GenerativeArtCard } from "@/components/GenerativeArtCard";
import { WorryShredder } from "@/components/WorryShredder";
import { trpc } from "@/lib/trpc";

// Categories
const CATEGORIES = [
  { id: 'career', label: '事业', icon: '💼' },
  { id: 'relationship', label: '人际', icon: '🤝' },
  { id: 'health', label: '健康', icon: '🌿' },
  { id: 'emotion', label: '情绪', icon: '💭' },
  { id: 'life', label: '生活', icon: '🏠' },
  { id: 'random', label: '随心', icon: '✨' },
];

export default function LingxiPage() {
  const { 
    dailyRecord, 
    profile, 
    isMember, 
    insightCount, 
    merit, 
    consumeMerit, 
    addInsightRecord,
    checkInsightAvailability,
    insightHistory
  } = useUser();

  const [step, setStep] = useState<'category' | 'input' | 'result'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | {
    answer: string;
    isDeep: boolean;
    question: string;
    timestamp: number;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showWorryShredder, setShowWorryShredder] = useState(false);

  // tRPC mutation for Qwen API
  const qwenChatMutation = trpc.qwen.chat.useMutation();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('input');
  };

  const handleAsk = async () => {
    if (!input.trim()) return;
    
    const availability = checkInsightAvailability();
    
    if (!availability.available) {
      toast.error("今日免费次数已尽，且功德不足兑换");
      return;
    }

    if (availability.reason === 'merit') {
      if (!confirm("今日免费次数已尽，是否消耗 50 功德进行问询？")) return;
      consumeMerit(50, '灵犀问询');
    }

    setIsLoading(true);
    
    try {
      const state = dailyRecord?.state || 'steady';
      const isDeep = isMember;
      
      // Build system prompt based on user state and category
      const categoryLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label || '随心';
      let systemPrompt = `你是"万物"App 中的"灵犀"智慧导师，擅长以东方哲学和禅意语言提供人生指引。
你的回答风格应该：
1. 简洁克制，不超过150字
2. 使用诗意、禅意的语言，避免说教
3. 提供启发性的思考角度，而非直接的答案
4. 根据用户当前状态（${state === 'advance' ? '进（行）' : state === 'retreat' ? '收（省）' : '稳（守）'}）调整建议
5. 问询分类：${categoryLabel}

当前用户状态：${state === 'advance' ? '势头向上，能量充沛' : state === 'retreat' ? '势头收敛，能量内藏' : '势头平稳，能量均衡'}`;

      if (isDeep && profile.birthCity) {
        systemPrompt += `\n用户出生地：${profile.birthCity}`;
      }

      // Call Qwen API via tRPC
      const response = await qwenChatMutation.mutateAsync({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input }
        ],
        temperature: 0.8,
        max_tokens: 300
      });

      let answer = response.success ? response.message : "抱歉，灵犀暂时无法回应。请稍后再试。";

      // Add deep analysis for members
      if (isDeep && response.success) {
        answer += "\n\n【深度解读】\n";
        answer += `当前状态：${state === 'advance' ? '进（行）' : state === 'retreat' ? '收（省）' : '稳（守）'}\n`;
        
        if (state === 'advance') {
          answer += `势头向上，能量充沛。${profile.nickname || '阁下'}可大胆尝试，但需注意节奏，避免急躁。`;
        } else if (state === 'retreat') {
          answer += `势头收敛，能量内藏。${profile.nickname || '阁下'}宜静不宜动，韬光养晦是上策。`;
        } else {
          answer += `势头平稳，能量均衡。${profile.nickname || '阁下'}适合巩固根基，徐徐图之。`;
        }
        
        if (profile.birthCity) {
          answer += `\n\n地气加持：${profile.birthCity}的水土养育了你的直觉，请相信第一反应。`;
        }
      }

      const newRecord = {
        question: input,
        category: (CATEGORIES.find(c => c.id === selectedCategory)?.id || 'random') as any,
        answer,
        isDeep,
        timestamp: Date.now()
      };

      addInsightRecord(newRecord);
      
      setResult(newRecord);
      setStep('result');
    } catch (error) {
      console.error("[Lingxi Error]", error);
      toast.error("灵犀感应失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('category');
    setSelectedCategory("");
    setInput("");
    setResult(null);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-white/90 bg-black">
      {/* 背景图片 */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/lingxi_bg.png" 
          alt="Lingxi Background" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* 渐变遮罩，确保文字可读性 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* 听觉锚点：雨打芭蕉 */}
      <AudioAnchor src="/sounds/rain_banana.mp3" volume={0.15} />

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-6 pt-16 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 顶部栏 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl text-white font-medium tracking-[0.2em]">灵犀</h1>
            <p className="text-[10px] text-white/60 tracking-[0.3em] uppercase mt-1">Insight</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowWorryShredder(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <Trash2 className="w-5 h-5 text-white/60" />
            </button>
            <button 
              onClick={() => setShowHistory(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <History className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* 步骤1: 选择分类 */}
          {step === 'category' && (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="text-center mb-12">
                <div className="w-16 h-16 mx-auto bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFD700]/20">
                  <MessageCircle className="w-8 h-8 text-[#FFD700]" />
                </div>
                <h2 className="text-xl text-white tracking-widest font-light">心有所惑，叩问灵犀</h2>
                <p className="text-xs text-white/60 mt-3 tracking-wider">请选择问询方向</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FFD700]/30 transition-all group flex flex-col items-center gap-2 backdrop-blur-sm"
                  >
                    <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all">{cat.icon}</span>
                    <span className="text-sm text-white/80 tracking-widest group-hover:text-[#FFD700]">{cat.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 步骤2: 输入问题 */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <button 
                onClick={() => setStep('category')}
                className="self-start mb-6 text-xs text-white/60 flex items-center gap-1 hover:text-white"
              >
                <ChevronRight className="w-3 h-3 rotate-180" /> 返回分类
              </button>

              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#FFD700]/30 rounded-t-2xl" />
                  
                  <div className="text-center mb-6">
                    <span className="text-xs text-[#FFD700] tracking-widest border border-[#FFD700]/30 px-3 py-1 rounded-full">
                      {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                    </span>
                  </div>

                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="请描述您的困惑..."
                    className="w-full bg-transparent border-none resize-none text-white placeholder-white/30 text-base leading-relaxed focus:ring-0 min-h-[150px] text-center font-sans"
                  />

                  <div className="mt-8 flex flex-col items-center gap-4">
                    <button
                      onClick={handleAsk}
                      disabled={!input.trim() || isLoading}
                      className="w-full py-3 bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/20 rounded-xl flex items-center justify-center gap-2 hover:bg-[#FFD700]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="text-sm tracking-widest">感应中...</span>
                      ) : (
                        <>
                          <span className="text-sm tracking-widest">发起问询</span>
                          <Send className="w-3 h-3" />
                        </>
                      )}
                    </button>

                    {!isMember && (
                      <div className="flex items-center gap-4 text-[10px] text-white/40">
                        <span className="flex items-center gap-1">
                          今日免费: {Math.max(0, 3 - insightCount)}/3
                        </span>
                        <span className="w-[1px] h-3 bg-white/10" />
                        <span className="flex items-center gap-1">
                          功德兑换: 50/次
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 步骤3: 结果展示 */}
          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col"
            >
              <div className={`flex-1 flex flex-col rounded-2xl p-6 border shadow-lg relative ${
                isMember ? 'bg-white/10 border-[#FFD700]/30 backdrop-blur-md' : 'bg-white/5 border-white/10 backdrop-blur-md'
              }`}>
                {/* 装饰 */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24 text-[#FFD700]" />
                </div>

                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] text-xs font-serif">
                      灵
                    </div>
                    <span className="text-xs text-white/60 tracking-widest">灵犀指引</span>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/90 text-lg leading-loose font-kai whitespace-pre-wrap">
                      {result.answer}
                    </p>
                  </div>

                  {/* 心境生成画 */}
                  <GenerativeArtCard 
                    state={dailyRecord?.state || 'steady'} 
                    seed={result.question + result.timestamp}
                    question={result.question}
                  />

                  {!isMember && (
                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                      <p className="text-xs text-white/40 mb-2">解锁无限问询与深度解读</p>
                      <button className="text-xs text-[#FFD700] border border-[#FFD700]/30 px-4 py-1 rounded-full hover:bg-[#FFD700]/10 transition-colors">
                        升级会员
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={reset}
                    className="px-6 py-2 bg-white/5 rounded-full text-sm text-white/60 hover:bg-white/10 transition-colors"
                  >
                    再次问询
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 烦恼粉碎机 */}
        <AnimatePresence>
          {showWorryShredder && <WorryShredder onClose={() => setShowWorryShredder(false)} />}
        </AnimatePresence>

        {/* 历史记录弹窗 */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg text-white font-medium tracking-widest">问询记录</h3>
                <button onClick={() => setShowHistory(false)}>
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4">
                {insightHistory.length === 0 ? (
                  <div className="text-center text-white/40 py-12 text-sm">暂无记录</div>
                ) : (
                  insightHistory.map((record, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-[#FFD700] border border-[#FFD700]/30 px-2 py-0.5 rounded-full">
                          {CATEGORIES.find(c => c.id === record.category)?.label}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {new Date(record.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 mb-2 font-medium">{record.question}</p>
                      <p className="text-xs text-white/60 line-clamp-2">{record.answer}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

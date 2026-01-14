import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronRight, Lock, MessageCircle, Mic, History, X, Sparkles } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

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
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('input');
  };

  const handleAsk = () => {
    if (!input.trim()) return;
    
    const availability = checkInsightAvailability();
    
    if (!availability.available) {
      toast.error("今日免费次数已尽，且功德不足兑换");
      return;
    }

    if (availability.reason === 'merit') {
      if (!confirm("今日免费次数已尽，是否消耗 50 功德进行问询？")) return;
      consumeMerit(50);
    }

    setIsLoading(true);
    
    // Mock Logic: Generate response
    setTimeout(() => {
      const state = dailyRecord?.state || 'steady';
      let answer = "";
      const isDeep = isMember;

      // 风格化回答库 (提示/映照/收敛/行动)
      const answerStyles = {
        hint: [
          "风起于青萍之末。细微之处，藏着转机。留意身边的变化，顺势而为。",
          "当局者迷。试着跳出当前的视角，以旁观者的心态重新审视。",
        ],
        reflect: [
          "心如止水，鉴常明。当下困惑，皆因心动。试着放下执念，退一步海阔天空。",
          "外境是内心的投射。你所抗拒的，往往是你需要接纳的。",
        ],
        converge: [
          "静坐常思己过，闲谈莫论人非。内求诸己，外顺天时。",
          "多言数穷，不如守中。与其向外驰求，不如向内安顿。",
        ],
        action: [
          "知行合一。不要停留在思考层面，迈出第一步，路自然会显现。",
          "君子以自强不息。既然认定了方向，就坚定地走下去。",
        ]
      };

      // 根据功德值决定回答清晰度 (模拟“诚则灵”)
      // 功德越高，回答越倾向于具体的“行动”或深刻的“映照”
      // 功德较低，回答倾向于模糊的“提示”或保守的“收敛”
      let style: 'hint' | 'reflect' | 'converge' | 'action' = 'hint';
      if (merit > 100) style = Math.random() > 0.5 ? 'action' : 'reflect';
      else if (merit > 50) style = Math.random() > 0.5 ? 'reflect' : 'converge';
      else style = Math.random() > 0.5 ? 'hint' : 'converge';

      const selectedPool = answerStyles[style];
      answer = selectedPool[Math.floor(Math.random() * selectedPool.length)];

      // Deep answer logic for members (结构化解读)
      if (isDeep) {
        answer += "\n\n【深度解读】\n";
        answer += `当前状态：${state === 'advance' ? '进（行）' : state === 'retreat' ? '收（省）' : '稳（守）'}\n`;
        
        if (state === 'advance') {
          answer += `势头向上，能量充沛。${profile.name || '阁下'}可大胆尝试，但需注意节奏，避免急躁。`;
        } else if (state === 'retreat') {
          answer += `势头收敛，能量内藏。${profile.name || '阁下'}宜静不宜动，韬光养晦是上策。`;
        } else {
          answer += `势头平稳，能量均衡。${profile.name || '阁下'}适合巩固根基，徐徐图之。`;
        }
        
        if (profile.birthCity) {
          answer += `\n\n地气加持：${profile.birthCity}的水土养育了你的直觉，请相信第一反应。`;
        }
      }

      const newRecord = {
        question: input,
        category: CATEGORIES.find(c => c.id === selectedCategory)?.label || '随心',
        answer,
        isDeep
      };

      addInsightRecord(newRecord);
      
      setResult(newRecord);
      setIsLoading(false);
      setStep('result');
    }, 2000);
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

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-6 pt-16 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 顶部栏 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl text-white font-medium tracking-[0.2em]">灵犀</h1>
            <p className="text-[10px] text-white/60 tracking-[0.3em] uppercase mt-1">Insight</p>
          </div>
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            <History className="w-5 h-5 text-white/60" />
          </button>
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
              <div className={`flex-1 rounded-3xl p-8 border relative overflow-hidden flex flex-col ${
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
                    <p className="text-white/90 text-base leading-loose font-light whitespace-pre-wrap text-justify">
                      {result.answer}
                    </p>
                  </div>
                </div>

                {isMember && (
                  <div className="mt-8 pt-6 border-t border-[#2C2C2C]/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#789262]">
                      <Mic className="w-4 h-4" />
                      <span className="text-xs tracking-widest">语音解读</span>
                    </div>
                    <span className="text-[10px] text-[#8C8478] bg-[#2C2C2C]/5 px-2 py-1 rounded">会员专属</span>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <p className="text-[10px] text-[#8C8478]/60 mb-4">
                    * 本内容为传统文化趣味参考，不构成决策依据
                  </p>
                  <button 
                    onClick={reset}
                    className="text-[#2C2C2C] text-xs tracking-[0.2em] hover:text-[#789262] transition-colors flex items-center justify-center gap-2"
                  >
                    再次叩问 <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 历史记录弹窗 */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="absolute inset-0 z-50 bg-[#FAF9F6] flex flex-col"
          >
            <div className="p-6 border-b border-[#2C2C2C]/5 flex justify-between items-center bg-[#FAF9F6]/90 backdrop-blur-sm">
              <h3 className="text-lg text-[#2C2C2C] tracking-widest font-medium">灵犀记录</h3>
              <button onClick={() => setShowHistory(false)} className="p-2">
                <X className="w-5 h-5 text-[#2C2C2C]/60" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {insightHistory.length === 0 ? (
                <div className="text-center py-12 text-[#8C8478]">
                  <p className="text-sm tracking-widest">暂无记录</p>
                </div>
              ) : (
                insightHistory.map((record) => (
                  <div key={record.id} className={`p-4 rounded-xl border ${
                    record.isDeep ? 'bg-gradient-to-br from-[#FAF9F6] to-[#789262]/5 border-[#789262]/20' : 'bg-[#FAF9F6] border-[#2C2C2C]/10'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-[#789262] border border-[#789262]/30 px-2 py-0.5 rounded-full">
                        {record.category}
                      </span>
                      <span className="text-[10px] text-[#8C8478]">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-[#2C2C2C] font-medium mb-2 line-clamp-1">{record.question}</p>
                    <p className="text-xs text-[#8C8478] line-clamp-2 leading-relaxed">{record.answer}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

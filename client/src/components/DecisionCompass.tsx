import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, ArrowRight, AlertTriangle, Lightbulb, Target, Sparkles, X } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { getHexagram } from "../lib/knowledge_base";

interface DecisionResult {
  hexagram: any;
  analysis: {
    situation: string;
    risk: string;
    action: string;
    verdict: string;
  };
}

export default function DecisionCompass() {
  const { addRitualRecord, consumeMerit } = useUser();
  const [question, setQuestion] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnalyze = async () => {
    if (!question.trim()) return;
    
    // 扣除功德
    const success = consumeMerit(5, "decision_compass");
    if (!success) {
      alert("功德不足，请先积累功德");
      return;
    }

    setIsAnalyzing(true);

    // 模拟 AI 分析过程
    setTimeout(() => {
      // 随机生成卦象
      const hexId = Math.floor(Math.random() * 64) + 1;
      const hexData = getHexagram(hexId);

      // 模拟 AI 生成的结构化报告
      const mockAnalysis = {
        situation: "当前局势如迷雾行舟，看似平静实则暗流涌动。你的直觉是对的，但时机尚未完全成熟。",
        risk: "最大的风险在于急于求成。如果现在贸然行动，可能会因为信息不对称而陷入被动。",
        action: "建议采取'守势'。先收集更多信息，观察对手或环境的变化。等待下一个节气（约7天后）再做决定。",
        verdict: "暂缓行动，静待良机"
      };

      const newResult = {
        hexagram: hexData,
        analysis: mockAnalysis
      };

      setResult(newResult);
      addRitualRecord({
        hexagramId: hexId,
        hexagramName: hexData.name,
        question: question,
        note: mockAnalysis.verdict,
        yaos: [] // 决策罗盘不需要记录具体爻辞
      });
      
      setIsAnalyzing(false);
      setShowResult(true);
    }, 3000);
  };

  const reset = () => {
    setQuestion("");
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 flex items-center justify-center border border-[#FFD700]/20">
                  <Hexagon className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h2 className="text-xl font-kai text-white tracking-widest">决策罗盘</h2>
                  <p className="text-xs text-white/40">AI 辅助决策系统</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 mb-2 block tracking-wider">您当下的困惑</label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="例如：是否应该接受这份新工作？"
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 transition-colors resize-none placeholder:text-white/20"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!question.trim() || isAnalyzing}
                  className={`w-full py-4 rounded-xl font-medium tracking-widest flex items-center justify-center gap-2 transition-all ${
                    isAnalyzing
                      ? "bg-white/10 text-white/40 cursor-wait"
                      : "bg-[#FFD700] text-black hover:bg-[#E5C100] shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      推演局势中...
                    </>
                  ) : (
                    <>
                      开始推演
                      <span className="text-[10px] opacity-60 ml-1">(-5 功德)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1C1C1C] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* 结果头部 */}
            <div className="bg-gradient-to-br from-[#FFD700]/20 to-transparent p-8 relative">
              <button 
                onClick={reset}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <div className="text-xs text-[#FFD700]/60 tracking-[0.2em] mb-2 uppercase">Verdict</div>
                <h2 className="text-2xl font-kai text-white mb-4">{result?.analysis.verdict}</h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/20 border border-white/10 backdrop-blur-sm">
                  <Hexagon className="w-3 h-3 text-[#FFD700]" />
                  <span className="text-xs text-[#FFD700] font-kai">{result?.hexagram.name}卦 · {result?.hexagram.nature}</span>
                </div>
              </div>
            </div>

            {/* 结构化报告 */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest">
                  <Target className="w-3 h-3" />
                  Current Situation
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {result?.analysis.situation}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#FF4D4D]/60 uppercase tracking-widest">
                  <AlertTriangle className="w-3 h-3" />
                  Potential Risk
                </div>
                <p className="text-sm text-white/80 leading-relaxed border-l-2 border-[#FF4D4D]/30 pl-3">
                  {result?.analysis.risk}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#FFD700]/60 uppercase tracking-widest">
                  <Lightbulb className="w-3 h-3" />
                  Action Plan
                </div>
                <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                  {result?.analysis.action}
                </p>
              </div>

              <button
                onClick={reset}
                className="w-full py-3 mt-4 border border-white/10 rounded-xl text-xs text-white/40 hover:bg-white/5 hover:text-white transition-colors tracking-widest"
              >
                发起新的推演
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

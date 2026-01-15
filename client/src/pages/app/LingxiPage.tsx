import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronRight, Lock, MessageCircle, Mic, History, X, Sparkles, Trash2, Camera, Upload, User, Eye } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { AudioAnchor } from "@/components/AudioAnchor";
import { GenerativeArtCard } from "@/components/GenerativeArtCard";
import { WorryShredder } from "@/components/WorryShredder";
import { trpc } from "@/lib/trpc";


// Categories for "所念" (what to ask about)
const CATEGORIES = [
  { id: 'career', label: '事业', icon: '💼' },
  { id: 'relationship', label: '人际', icon: '🤝' },
  { id: 'health', label: '健康', icon: '🌿' },
  { id: 'emotion', label: '情感', icon: '💭' },
  { id: 'life', label: '生活', icon: '🏠' },
  { id: 'random', label: '随心', icon: '✨' },
];

// Categories for "看人识人"
const PERSON_CATEGORIES = [
  { id: 'personality', label: '性格', icon: '🎭' },
  { id: 'strength', label: '优势', icon: '💪' },
  { id: 'challenge', label: '挑战', icon: '🌊' },
  { id: 'relationship', label: '人际', icon: '🤝' },
  { id: 'growth', label: '成长', icon: '🌱' },
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

  // Mode: 'choose' (select看物/看人) -> 'see' (describe object) -> 'ask' -> 'result'
  // Or: 'choose' -> 'person' (upload photo) -> 'person-ask' -> 'result'
  const [mode, setMode] = useState<'choose' | 'see' | 'ask' | 'person' | 'person-ask' | 'result'>('choose');
  const [currentMode, setCurrentMode] = useState<'object' | 'person' | null>(null); // Track which mode we're in
  const [seenThing, setSeenThing] = useState(""); // What user sees (for object mode)
  const [personImage, setPersonImage] = useState<string | null>(null); // Image URL for person mode
  const [personImageFile, setPersonImageFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // What user wants to ask
  const [result, setResult] = useState<null | {
    answer: string;
    isDeep: boolean;
    question: string;
    seenThing?: string;
    timestamp: number;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showWorryShredder, setShowWorryShredder] = useState(false);
  const [showDeepReading, setShowDeepReading] = useState(false);
  const [deepReadingContent, setDeepReadingContent] = useState("");

  // File input refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // tRPC mutation for Qwen API
  const qwenChatMutation = trpc.qwen.chat.useMutation();
  const qwenVisionMutation = trpc.qwen.vision.useMutation();

  // Handle mode selection
  const handleModeSelect = (selectedMode: 'object' | 'person') => {
    setCurrentMode(selectedMode);
    if (selectedMode === 'object') {
      setMode('see');
    } else {
      setMode('person');
    }
  };

  // Handle camera/file upload for person mode
  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onload = (event) => {
      setPersonImage(event.target?.result as string);
      setPersonImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handlePersonImageSubmit = () => {
    if (!personImage) {
      toast.error("请上传对方的照片");
      return;
    }
    setMode('person-ask');
  };

  // Step 1: User describes what they see (object mode)
  const handleSeenThingSubmit = () => {
    if (!seenThing.trim()) {
      toast.error("请描述你所见的事物");
      return;
    }
    setMode('ask');
  };

  // Step 2: User selects what to ask about
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (currentMode === 'object') {
      handleAsk(categoryId);
    } else {
      handlePersonAsk(categoryId);
    }
  };

  // Generate insight for object mode
  const handleAsk = async (categoryId: string) => {
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
      
      const categoryLabel = CATEGORIES.find(c => c.id === categoryId)?.label || '随心';
      let systemPrompt = `你是"万物"App 中的"灵犀"智慧导师，擅长以东方哲学和禅意语言提供人生指引。
用户所见：${seenThing}
用户所念（问询类型）：${categoryLabel}

你的回答风格应该：
1. 简洁克制，不超过150字
2. 使用诗意、禅意的语言，避免说教
3. 根据用户所见的事物和所念的问题，提供启发性的思考角度
4. 根据用户当前状态（${state === 'advance' ? '进（行）' : state === 'retreat' ? '收（省）' : '稳（守）'}）调整建议
5. 将所见事物与所念问题相联系，提供"所见即所得，所念即回响"的启示`;

      if (isDeep && profile.birthCity) {
        systemPrompt += `\n用户出生地：${profile.birthCity}`;
      }

      const response = await qwenChatMutation.mutateAsync({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `基于我所见的"${seenThing}"和我所念的"${categoryLabel}"，请给我智慧指引。` }
        ],
        temperature: 0.8,
        max_tokens: 300
      });

      const answer = response.message;
      
      // Generate deep reading for members
      let deepContent = "";
      if (isDeep) {
        try {
          const deepResponse = await qwenChatMutation.mutateAsync({
            messages: [
              { role: "system", content: "你是一个贴心的朋友，用大白话直接回复用户的问题。简洁、亲切、实用。" },
              { role: "user", content: `我看到了"${seenThing}"，我想问关于"${categoryLabel}"的事。你直接告诉我应该怎么办吧。` }
            ],
            temperature: 0.8,
            max_tokens: 300
          });
          deepContent = deepResponse.message;
        } catch (error) {
          deepContent = "深度解读暂时无法生成，请稍后再试";
        }
      }
      
      const newResult = {
        answer,
        isDeep,
        question: `所见：${seenThing} | 所念：${categoryLabel}`,
        seenThing,
        timestamp: Date.now()
      };
      
      setResult(newResult);
      setDeepReadingContent(deepContent);
      setShowDeepReading(false);
      setMode('result');
      addInsightRecord({
        answer,
        isDeep,
        category: categoryId as 'career' | 'relationship' | 'health' | 'emotion' | 'life' | 'random',
        question: `所见：${seenThing} | 所念：${categoryLabel}`
      });
      
    } catch (error) {
      console.error("Error calling Qwen API:", error);
      toast.error("灵犀暂时失语，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate insight for person mode (看人识人)
  const handlePersonAsk = async (categoryId: string) => {
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
      if (!personImage) {
        toast.error("图片丢失，请重新上传");
        return;
      }

      const categoryLabel = PERSON_CATEGORIES.find(c => c.id === categoryId)?.label || '性格';
      
      // Call Qwen Vision API to analyze the person
      const visionResponse = await qwenVisionMutation.mutateAsync({
        imageUrl: personImage,
        prompt: `请根据这张照片，从"${categoryLabel}"的角度分析这个人可能面临的问题、特点或建议。用大白话、简洁的语言回答，不超过150字。`
      });

      const answer = visionResponse.message;
      
      // Generate deep reading for members
      let deepContent = "";
      if (isMember) {
        try {
          const deepResponse = await qwenVisionMutation.mutateAsync({
            imageUrl: personImage,
            prompt: `请根据这张照片，从"${categoryLabel}"的角度给出更深层的分析和建议。用大白话、亲切的语言，给出实用的建议，不超过300字。`
          });
          deepContent = deepResponse.message;
        } catch (error) {
          deepContent = "深度解读暂时无法生成，请稍后再试";
        }
      }
      
      const newResult = {
        answer,
        isDeep: isMember,
        question: `看人识人 - ${categoryLabel}`,
        timestamp: Date.now()
      };
      
      setResult(newResult);
      setDeepReadingContent(deepContent);
      setShowDeepReading(false);
      setMode('result');
      addInsightRecord({
        answer,
        isDeep: isMember,
        category: 'random',
        question: `看人识人 - ${categoryLabel}`
      });
      
    } catch (error) {
      console.error("Error calling Qwen Vision API:", error);
      toast.error("灵犀暂时失语，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMode('choose');
    setCurrentMode(null);
    setSeenThing("");
    setPersonImage(null);
    setPersonImageFile(null);
    setSelectedCategory("");
    setResult(null);
    setShowDeepReading(false);
    setDeepReadingContent("");
  };

  return (
    <div className="h-full flex flex-col bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/lingxi_bg.png" 
          alt="Lingxi Background" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Audio Anchor */}
      <AudioAnchor src="/sounds/rain_banana.mp3" volume={0.15} />

      {/* Content Area */}
      <div className="relative z-20 flex-1 flex flex-col px-6 pt-16 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* Top Bar */}
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
          {/* Mode Selection */}
          {mode === 'choose' && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="text-center mb-12">
                <div className="w-16 h-16 mx-auto bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFD700]/20">
                  <Sparkles className="w-8 h-8 text-[#FFD700]" />
                </div>
                <h2 className="text-xl text-white tracking-widest font-light">所见即所得，所念即回响</h2>
                <p className="text-xs text-white/60 mt-3 tracking-wider">选择你的问询方式</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleModeSelect('object')}
                  className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FFD700]/30 transition-all backdrop-blur-sm flex items-center gap-4"
                >
                  <Eye className="w-8 h-8 text-[#FFD700]" />
                  <div className="text-left">
                    <p className="text-sm text-white font-medium">看物识事</p>
                    <p className="text-xs text-white/60">描述所见事物，获得智慧指引</p>
                  </div>
                </button>

                <button
                  onClick={() => handleModeSelect('person')}
                  className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FFD700]/30 transition-all backdrop-blur-sm flex items-center gap-4"
                >
                  <User className="w-8 h-8 text-[#FFD700]" />
                  <div className="text-left">
                    <p className="text-sm text-white font-medium">看人识人</p>
                    <p className="text-xs text-white/60">上传照片，了解对方特点</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Object Mode: Step 1 - Describe what you see */}
          {mode === 'see' && (
            <motion.div
              key="see"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <button 
                onClick={() => setMode('choose')}
                className="self-start mb-6 text-xs text-white/60 flex items-center gap-1 hover:text-white"
              >
                <ChevronRight className="w-3 h-3 rotate-180" /> 返回
              </button>

              <div className="text-center mb-12">
                <div className="w-16 h-16 mx-auto bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFD700]/20">
                  <Eye className="w-8 h-8 text-[#FFD700]" />
                </div>
                <h2 className="text-xl text-white tracking-widest font-light">看物识事</h2>
                <p className="text-xs text-white/60 mt-3 tracking-wider">请描述你所见的事物</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
                <textarea
                  value={seenThing}
                  onChange={(e) => setSeenThing(e.target.value)}
                  placeholder="你看到了什么？一朵花、一块石头、一杯茶...描述你所见的事物"
                  className="w-full h-32 bg-transparent text-white placeholder-white/40 text-sm leading-relaxed focus:outline-none resize-none"
                />
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSeenThingSubmit}
                    disabled={!seenThing.trim() || isLoading}
                    className="flex-1 bg-[#FFD700] text-black font-medium py-3 rounded-lg hover:bg-[#FFD700]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? "处理中..." : "下一步"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Person Mode: Step 1 - Upload photo */}
          {mode === 'person' && (
            <motion.div
              key="person"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <button 
                onClick={() => setMode('choose')}
                className="self-start mb-6 text-xs text-white/60 flex items-center gap-1 hover:text-white"
              >
                <ChevronRight className="w-3 h-3 rotate-180" /> 返回
              </button>

              <div className="text-center mb-12">
                <div className="w-16 h-16 mx-auto bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFD700]/20">
                  <User className="w-8 h-8 text-[#FFD700]" />
                </div>
                <h2 className="text-xl text-white tracking-widest font-light">看人识人</h2>
                <p className="text-xs text-white/60 mt-3 tracking-wider">请上传对方的照片</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg">
                {personImage ? (
                  <div className="mb-6">
                    <img src={personImage} alt="Person" className="w-full h-48 object-cover rounded-lg mb-4" />
                    <button
                      onClick={() => {
                        setPersonImage(null);
                        setPersonImageFile(null);
                        if (cameraInputRef.current) cameraInputRef.current.value = '';
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="w-full text-xs text-white/60 hover:text-white transition-colors"
                    >
                      更换照片
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="text-sm">拍照</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <span className="text-sm">上传</span>
                    </button>
                  </div>
                )}

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageCapture}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageCapture}
                  className="hidden"
                />

                <button
                  onClick={handlePersonImageSubmit}
                  disabled={!personImage || isLoading}
                  className="w-full bg-[#FFD700] text-black font-medium py-3 rounded-lg hover:bg-[#FFD700]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "处理中..." : "下一步"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Ask Category - Object Mode */}
          {mode === 'ask' && currentMode === 'object' && (
            <motion.div
              key="ask"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <button 
                onClick={() => setMode('see')}
                className="self-start mb-6 text-xs text-white/60 flex items-center gap-1 hover:text-white"
              >
                <ChevronRight className="w-3 h-3 rotate-180" /> 返回
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFD700]/20">
                  <MessageCircle className="w-8 h-8 text-[#FFD700]" />
                </div>
                <h2 className="text-lg text-white tracking-widest font-light">所见：{seenThing}</h2>
                <p className="text-xs text-white/60 mt-3 tracking-wider">请选择你所念的问询方向</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    disabled={isLoading}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FFD700]/30 transition-all group flex flex-col items-center gap-2 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all">{cat.icon}</span>
                    <span className="text-sm text-white/80 tracking-widest group-hover:text-[#FFD700]">{cat.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Ask Category - Person Mode */}
          {mode === 'person-ask' && currentMode === 'person' && (
            <motion.div
              key="person-ask"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <button 
                onClick={() => setMode('person')}
                className="self-start mb-6 text-xs text-white/60 flex items-center gap-1 hover:text-white"
              >
                <ChevronRight className="w-3 h-3 rotate-180" /> 返回
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFD700]/20">
                  <MessageCircle className="w-8 h-8 text-[#FFD700]" />
                </div>
                <p className="text-xs text-white/60 mt-3 tracking-wider">请选择你想了解对方的方面</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {PERSON_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    disabled={isLoading}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FFD700]/30 transition-all group flex flex-col items-center gap-2 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all">{cat.icon}</span>
                    <span className="text-sm text-white/80 tracking-widest group-hover:text-[#FFD700]">{cat.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Result */}
          {mode === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col justify-center"
            >
              <button 
                onClick={() => setMode(currentMode === 'object' ? 'ask' : 'person-ask')}
                className="self-start mb-6 text-xs text-white/60 flex items-center gap-1 hover:text-white"
              >
                <ChevronRight className="w-3 h-3 rotate-180" /> 返回
              </button>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg">
                <div className="text-center mb-8">
                  <Sparkles className="w-8 h-8 text-[#FFD700] mx-auto mb-4" />
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-white/90 leading-relaxed text-sm">
                      {result.answer}
                    </p>
                  </div>

                  {result.isDeep && (
                    <button
                      onClick={() => setShowDeepReading(!showDeepReading)}
                      className="w-full bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4 hover:bg-[#FFD700]/10 transition-colors text-left"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-[#FFD700] tracking-widest">会员深度解读</p>
                        <ChevronRight className={`w-4 h-4 text-[#FFD700] transition-transform ${showDeepReading ? 'rotate-90' : ''}`} />
                      </div>
                      {showDeepReading && deepReadingContent && (
                        <p className="text-xs text-white/70 mt-3 leading-relaxed">{deepReadingContent}</p>
                      )}
                    </button>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-white/10 text-white font-medium py-3 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      再次问询
                    </button>
                    <button
                      onClick={() => {
                        handleReset();
                        setShowHistory(true);
                      }}
                      className="flex-1 bg-[#FFD700] text-black font-medium py-3 rounded-lg hover:bg-[#FFD700]/90 transition-colors"
                    >
                      查看历史
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-black/90 border-t border-white/10 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg text-white tracking-widest">问询历史</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-white/10 rounded-full"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                {insightHistory && insightHistory.length > 0 ? (
                  insightHistory.map((record, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-xs text-[#FFD700] mb-2">{record.question}</p>
                      <p className="text-xs text-white/70">{record.answer}</p>
                      <p className="text-xs text-white/40 mt-2">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-white/60 py-8">暂无问询历史</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Worry Shredder */}
      {showWorryShredder && (
        <WorryShredder onClose={() => setShowWorryShredder(false)} />
      )}
    </div>
  );
}

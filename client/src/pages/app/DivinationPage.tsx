import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { AudioAnchor } from '@/components/AudioAnchor';

type Step = 'select' | 'describe' | 'preview' | 'result';

interface DivinationResult {
  imageUrl: string;
  analysis: string;
  timestamp: number;
}

export default function DivinationPage({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState<Step>('select');
  const [imageData, setImageData] = useState<string | null>(null);
  const [eventDescription, setEventDescription] = useState('');
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const divinationMutation = trpc.qwen.divination.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageData(event.target?.result as string);
      setStep('describe');
    };
    reader.readAsDataURL(file);
  };

  const handleDescriptionSubmit = () => {
    if (!eventDescription.trim()) {
      toast.error('请描述你想要分析的事件');
      return;
    }
    setStep('preview');
  };

  const handleAnalyze = async () => {
    if (!imageData || !eventDescription.trim()) return;

    setIsAnalyzing(true);

    try {
      const response = await divinationMutation.mutateAsync({
        imageData,
        eventDescription,
      });

      if (response.success && response.analysis) {
        setResult({
          imageUrl: response.imageUrl,
          analysis: response.analysis,
          timestamp: Date.now(),
        });
        setStep('result');
      } else {
        toast.error('分析失败，请稍后再试');
      }
    } catch (error) {
      console.error('[Divination Error]', error);
      toast.error('分析失败，请稍后再试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setStep('select');
    setImageData(null);
    setEventDescription('');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-white/90 bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-900 via-stone-800 to-black" />
      
      {/* Audio Anchor */}
      <AudioAnchor src="/sounds/rain_banana.mp3" volume={0.1} />

      {/* Content */}
      <div className="relative z-20 flex-1 flex flex-col px-6 pt-16 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white/60" />
              </button>
            )}
            <div>
              <h1 className="text-2xl text-white font-medium tracking-[0.2em]">指物寻物</h1>
              <p className="text-[10px] text-white/60 tracking-[0.3em] uppercase mt-1">Qimen Divination</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Image */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="text-center mb-12">
                <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
                  <Sparkles className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="text-xl text-white tracking-widest font-light">指物寻物</h2>
                <p className="text-xs text-white/60 mt-3 tracking-wider leading-relaxed">
                  拍摄或选择一张图片<br />
                  结合五行九宫奇门遁甲<br />
                  为你分析事件吉凶与失物方位
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full py-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/30 transition-all group flex flex-col items-center gap-3 backdrop-blur-sm"
                >
                  <Camera className="w-10 h-10 text-white/60 group-hover:text-amber-500 transition-colors" />
                  <span className="text-sm text-white/80 tracking-widest group-hover:text-amber-500">拍摄照片</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/30 transition-all group flex flex-col items-center gap-3 backdrop-blur-sm"
                >
                  <Upload className="w-10 h-10 text-white/60 group-hover:text-amber-500 transition-colors" />
                  <span className="text-sm text-white/80 tracking-widest group-hover:text-amber-500">从相册选择</span>
                </button>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.div>
          )}

          {/* Step 2: Describe Event */}
          {step === 'describe' && (
            <motion.div
              key="describe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl text-white tracking-widest font-light">描述事件</h2>
                <p className="text-xs text-white/60 mt-3 tracking-wider">
                  请简要描述你想要分析的事件或问题
                </p>
              </div>

              {imageData && (
                <div className="relative w-full aspect-square max-w-sm mx-auto rounded-xl overflow-hidden mb-6 border border-white/10">
                  <img src={imageData} alt="Selected" className="w-full h-full object-cover" />
                </div>
              )}

              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="例如：我想知道这次合作是否顺利..."
                className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-white/90 placeholder-white/40 resize-none focus:outline-none focus:border-amber-500/50 transition-colors font-sans"
                maxLength={200}
              />

              <div className="flex items-center justify-between mt-2 mb-6">
                <span className="text-xs text-white/40">{eventDescription.length}/200</span>
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 transition-colors"
                >
                  重新选择
                </button>
                <button
                  onClick={handleDescriptionSubmit}
                  disabled={!eventDescription.trim()}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-white/10 disabled:text-white/40 rounded-xl text-white font-medium transition-colors"
                >
                  下一步
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl text-white tracking-widest font-light">确认信息</h2>
                <p className="text-xs text-white/60 mt-3 tracking-wider">
                  请确认图片和事件描述无误
                </p>
              </div>

              {imageData && (
                <div className="relative w-full aspect-square max-w-sm mx-auto rounded-xl overflow-hidden mb-4 border border-white/10">
                  <img src={imageData} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-white/80 leading-relaxed font-sans">{eventDescription}</p>
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => setStep('describe')}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 transition-colors"
                >
                  修改
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>分析中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>开始分析</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Result */}
          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col rounded-2xl p-6 border border-amber-500/30 bg-white/10 backdrop-blur-md shadow-lg relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24 text-amber-500" />
                </div>

                <div className="relative z-10 flex-1">
                  {/* Image */}
                  <div className="w-full aspect-square rounded-xl overflow-hidden border border-white/10 mb-6">
                    <img 
                      src={imageData || result.imageUrl} 
                      alt="Analyzed object" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Event Description */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                    <p className="text-xs text-white/60 mb-2 tracking-widest">事件描述</p>
                    <p className="text-sm text-white/80 font-sans">{eventDescription}</p>
                  </div>

                  {/* Analysis Result */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 text-xs">
                      断
                    </div>
                    <span className="text-xs text-white/60 tracking-widest">奇门断事</span>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/90 text-base leading-loose whitespace-pre-wrap font-sans">
                      {result.analysis}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-white/5 rounded-full text-sm text-white/60 hover:bg-white/10 transition-colors"
                  >
                    再次探寻
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

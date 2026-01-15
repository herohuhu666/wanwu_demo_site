import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { AudioAnchor } from "@/components/AudioAnchor";

interface RecognitionResult {
  imageUrl: string;
  interpretation: string;
  timestamp: number;
}

export default function ZhiwuPage({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState<'select' | 'preview' | 'result'>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const visionMutation = trpc.qwen.vision.useMutation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("图片大小不能超过 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSelectedImage(dataUrl);
      setStep('preview');
    };
    reader.readAsDataURL(file);
  };

  const handleRecognize = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    
    try {
      const response = await visionMutation.mutateAsync({
        imageData: selectedImage,
      });

      if (response.success) {
        setResult({
          imageUrl: response.imageUrl,
          interpretation: response.interpretation,
          timestamp: Date.now(),
        });
        setStep('result');
      } else {
        toast.error(response.interpretation || "识别失败，请重试");
      }
    } catch (error) {
      console.error("[Zhiwu Recognition Error]", error);
      toast.error("识别失败，请稍后再试");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setStep('select');
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-white/90 bg-black">
      {/* 背景 */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-900 via-stone-800 to-black" />
      
      {/* 听觉锚点 */}
      <AudioAnchor src="/sounds/rain_banana.mp3" volume={0.1} />

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-6 pt-16 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 顶部栏 */}
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
              <p className="text-[10px] text-white/60 tracking-[0.3em] uppercase mt-1">Object Insight</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* 步骤1: 选择图片方式 */}
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
                <h2 className="text-xl text-white tracking-widest font-light">万物皆有灵</h2>
                <p className="text-xs text-white/60 mt-3 tracking-wider">拍摄或选择一张照片，探寻其中智慧</p>
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

              {/* Hidden file inputs */}
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

          {/* 步骤2: 预览并确认 */}
          {step === 'preview' && selectedImage && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-white/10 mb-8">
                  <img 
                    src={selectedImage} 
                    alt="Selected" 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-4 w-full max-w-sm">
                  <button
                    onClick={reset}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-white/5 rounded-xl text-white/60 hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    重新选择
                  </button>
                  <button
                    onClick={handleRecognize}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-500/30 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm tracking-widest">识别中...</span>
                      </>
                    ) : (
                      <span className="text-sm tracking-widest">开始识别</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 步骤3: 显示结果 */}
          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col rounded-2xl p-6 border border-amber-500/30 bg-white/10 backdrop-blur-md shadow-lg relative">
                {/* 装饰 */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24 text-amber-500" />
                </div>

                <div className="relative z-10 flex-1">
                  {/* 图片 */}
                  <div className="w-full aspect-square rounded-xl overflow-hidden border border-white/10 mb-6">
                    <img 
                      src={selectedImage || result.imageUrl} 
                      alt="Recognized object" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 解读 */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 text-xs font-serif">
                      悟
                    </div>
                    <span className="text-xs text-white/60 tracking-widest">智慧解读</span>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/90 text-lg leading-loose font-kai whitespace-pre-wrap">
                      {result.interpretation}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={reset}
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

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface GenerativeArtCardProps {
  state: 'steady' | 'advance' | 'retreat';
  seed: string; // Use question or timestamp as seed
  question: string; // The actual question text for AI generation
  title?: string;
}

export function GenerativeArtCard({ state, seed, question, title = "心境映照" }: GenerativeArtCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateImageMutation = trpc.qwen.generateHeartImage.useMutation();

  const handleGenerate = async () => {
    if (hasGenerated) return; // Only generate once per question
    
    setIsGenerating(true);
    
    try {
      const response = await generateImageMutation.mutateAsync({
        question,
        state,
      });

      if (response.success && response.imageUrl) {
        setImageUrl(response.imageUrl);
        setHasGenerated(true);
        toast.success("心境画卷已生成");
      } else {
        toast.error("生成失败，请稍后再试");
      }
    } catch (error) {
      console.error("[Generate Heart Image Error]", error);
      toast.error("生成失败，请稍后再试");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!imageUrl) return;
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `wanwu-heart-mirror-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("心境画卷已保存");
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '万物 - 心境映照',
          text: '我的心境画卷',
          url: imageUrl,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(imageUrl);
      toast.success("链接已复制到剪贴板");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm text-white/80 font-kai tracking-widest">{title}</h3>
        {imageUrl && (
          <div className="flex gap-2">
            <button onClick={handleSave} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Download className="w-4 h-4 text-white/60" />
            </button>
            <button onClick={handleShare} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Share2 className="w-4 h-4 text-white/60" />
            </button>
          </div>
        )}
      </div>
      
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-inner bg-black/20">
        {!imageUrl && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <button
              onClick={handleGenerate}
              className="flex flex-col items-center gap-3 p-6 hover:bg-white/5 rounded-2xl transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-amber-500" />
              </div>
              <span className="text-sm text-white/80 tracking-widest">生成心境画卷</span>
              <span className="text-xs text-white/40">AI 将为你创作独特的艺术作品</span>
            </button>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
            <span className="text-sm text-white/80 tracking-widest">正在生成画卷...</span>
            <span className="text-xs text-white/40 mt-2">这可能需要 10-20 秒</span>
          </div>
        )}

        {imageUrl && (
          <>
            <img 
              src={imageUrl} 
              alt="Heart Mirror Art" 
              className="w-full h-full object-cover"
            />
            
            {/* Watermark */}
            <div className="absolute bottom-3 right-3 opacity-50">
              <p className="text-[10px] text-white font-serif tracking-widest">万物 WANWU</p>
            </div>
          </>
        )}
      </div>
      
      <p className="mt-3 text-[10px] text-white/40 text-center tracking-wider">
        {imageUrl ? "此画由心而生，独一无二" : "点击生成专属于你的心境画卷"}
      </p>
    </motion.div>
  );
}

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Camera, Upload, X, ChevronDown, ChevronUp } from "lucide-react";
import { Streamdown } from "streamdown";


export default function LingxiPage() {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [detailedResponse, setDetailedResponse] = useState<string | null>(null);
  const [showDetailed, setShowDetailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // tRPC mutation for asking Lingxi
  const askLingxiMutation = trpc.qwen.chat.useMutation();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAskLingxi = async () => {
    if (!question.trim() && !imageFile) {
      alert("请输入问题或上传图片");
      return;
    }

    setIsLoading(true);
    setResponse(null);
    setDetailedResponse(null);
    setShowDetailed(false);

    try {
      // Get simple version (for all users)
      const simplePrompt = `用户提出了一个问题："${question || "请从玄学角度分析这张图片"}"

请从五行、八卦、易学的角度进行简洁分析，给出启发性的建议。保持回答简洁有力，不超过100字。`;

      const simpleResult = await askLingxiMutation.mutateAsync({
        messages: [
          { role: "user", content: simplePrompt },
        ],
      });

      if (simpleResult.success) {
        setResponse(simpleResult.message);
      } else {
        setResponse("抱歉，灵犀暂时无法回应。请稍后再试。");
        setIsLoading(false);
        return;
      }

      // Get detailed version for members
      if (user?.role === "admin") {
        const detailedPrompt = `用户提出了一个问题："${question || "请从玄学角度分析这张图片"}"

请从五行、八卦、易学的角度进行深度分析，提供详细、通俗易懂的解读，包括：
1. 五行属性分析
2. 八卦含义
3. 当前时机判断
4. 具体行动建议

回答要通俗易懂，避免使用过于专业的术语。`;

        const detailedResult = await askLingxiMutation.mutateAsync({
          messages: [
            { role: "user", content: detailedPrompt },
          ],
        });

        if (detailedResult.success) {
          setDetailedResponse(detailedResult.message);
        }
      }
    } catch (error) {
      console.error("Error asking Lingxi:", error);
      setResponse("出现错误，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-cover bg-center p-4 pb-20" style={{
      backgroundImage: 'url("/images/lingxi_bg_new.png")',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header */}
      <div className="mb-6 text-center sticky top-0 bg-black/40 backdrop-blur-sm py-2 z-10 rounded-lg">
        <h1 className="text-3xl font-serif font-bold text-amber-100 mb-2">灵犀</h1>
        <p className="text-amber-100/60 text-sm">所见即所得，所念即回响</p>
      </div>

      {/* Input Section */}
      <Card className="bg-black/50 border-amber-900/40 mb-6 flex-shrink-0 backdrop-blur-sm">
        <div className="p-6 space-y-4">
          {/* Question Input */}
          <div>
            <label className="text-amber-100 text-sm mb-2 block">您的问题</label>
            <Textarea
              placeholder="输入您想咨询的问题或描述..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-slate-700/50 border-amber-900/20 text-amber-50 placeholder-amber-100/30 resize-none"
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-amber-100 text-sm mb-2 block">上传图片（可选）</label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-40 object-cover rounded border border-amber-900/30"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 border border-amber-900/20 rounded cursor-pointer hover:bg-slate-700/70 transition">
                  <Camera size={18} className="text-amber-100" />
                  <span className="text-amber-100 text-sm">拍照</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 border border-amber-900/20 rounded cursor-pointer hover:bg-slate-700/70 transition">
                  <Upload size={18} className="text-amber-100" />
                  <span className="text-amber-100 text-sm">上传</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleAskLingxi}
            disabled={isLoading || (!question.trim() && !imageFile)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                灵犀思考中...
              </>
            ) : (
              "问灵犀"
            )}
          </Button>
        </div>
      </Card>

      {/* Response Section */}
      {response && (
        <div className="space-y-4">
          {/* Simple Version (Always shown) */}
          <Card className="bg-black/50 border-amber-900/40 flex-shrink-0 backdrop-blur-sm">
            <div className="p-6 space-y-4">
              <h3 className="text-amber-100 font-serif text-lg">灵犀回应</h3>

              {/* Simple Version Content */}
              <div className="text-amber-50/80">
                <Streamdown>{response}</Streamdown>
              </div>

              {/* Compliance Notice */}
              <p className="text-amber-100/40 text-xs text-center">
                本内容为传统文化趣味参考，不构成决策依据
              </p>
            </div>
          </Card>

          {/* Detailed Version Toggle (For Members) */}
          {user?.role === "admin" && detailedResponse && (
            <Card className="bg-black/50 border-amber-900/40 flex-shrink-0 backdrop-blur-sm">
              <div className="p-6 space-y-4">
                {/* Toggle Button */}
                <button
                  onClick={() => setShowDetailed(!showDetailed)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-amber-900/20 hover:bg-amber-900/30 rounded-lg transition border border-amber-900/40"
                >
                  <span className="text-amber-100 font-semibold">会员深度解读</span>
                  {showDetailed ? (
                    <ChevronUp className="w-5 h-5 text-amber-100" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-amber-100" />
                  )}
                </button>

                {/* Detailed Version Content */}
                {showDetailed && (
                  <div className="text-amber-50/80 max-h-96 overflow-y-auto">
                    <Streamdown>{detailedResponse}</Streamdown>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

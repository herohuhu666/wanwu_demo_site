import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Check, Crown, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MemberPage() {
  const [isMember, setIsMember] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsMember(checked);
    if (checked) {
      toast.success("已启用会员");
    } else {
      toast.info("已取消会员");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-serif font-medium text-center">会员中心</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Status Card */}
        <div 
          className={cn(
            "w-full aspect-[1.8] rounded-2xl p-6 flex flex-col justify-between mb-8 transition-all duration-500 relative overflow-hidden",
            isMember 
              ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-lg shadow-amber-500/30" 
              : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500"
          )}
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
          
          <div className="flex justify-between items-start z-10">
            <div>
              <h3 className={cn("text-lg font-bold mb-1", isMember ? "text-white" : "text-gray-700")}>
                {isMember ? "尊贵会员" : "免费用户"}
              </h3>
              <p className={cn("text-xs", isMember ? "text-white/80" : "text-gray-500")}>
                {isMember ? "有效期至 2027-01-01" : "升级解锁更多功能"}
              </p>
            </div>
            <Crown className={cn("w-8 h-8", isMember ? "text-white" : "text-gray-400")} />
          </div>

          <div className="z-10">
            <p className={cn("text-sm font-medium", isMember ? "text-white/90" : "text-gray-500")}>
              {isMember ? "已享受所有高级权益" : "当前仅可使用基础功能"}
            </p>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-4">功能权益对比</h3>
          <div className="space-y-3">
            {[
              { name: "每日签到", free: true, pro: true },
              { name: "每日灵犀", free: true, pro: true },
              { name: "状态记录", free: true, pro: true },
              { name: "数据分析", free: false, pro: true },
              { name: "导出报告", free: false, pro: true },
              { name: "云端同步", free: false, pro: true },
            ].map((feature, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{feature.name}</span>
                <div className="flex items-center gap-8 w-24 justify-end">
                  <div className="w-6 flex justify-center">
                    {feature.free ? (
                      <Check className="w-4 h-4 text-gray-400" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <div className="w-6 flex justify-center">
                    {feature.pro ? (
                      <Check className="w-4 h-4 text-amber-500" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Toggle */}
        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-gray-900">模拟订阅状态</p>
            <p className="text-xs text-gray-500">仅用于演示会员功能</p>
          </div>
          <Switch 
            checked={isMember} 
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-amber-500"
          />
        </div>

        {!isMember && (
          <Button 
            onClick={() => handleToggle(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-full h-12 text-base shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            立即升级会员
          </Button>
        )}
      </div>
    </div>
  );
}

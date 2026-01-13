import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Check, X, Shield, Zap, Cloud, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function MemberPage() {
  const [isMember, setIsMember] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsMember(checked);
    if (checked) {
      toast.success("已启用会员权益");
    } else {
      toast.info("已恢复普通身份");
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f9f9f7] relative">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center p-6 pt-12">
        <div className="flex flex-col">
          <span className="text-xs text-stone-500 tracking-widest uppercase">Profile</span>
          <h1 className="text-2xl font-serif text-stone-800">我的</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20">
        {/* 会员卡片 */}
        <motion.div 
          layout
          className={`w-full aspect-[1.8] rounded-2xl p-6 flex flex-col justify-between mb-8 relative overflow-hidden transition-colors duration-500 ${
            isMember ? 'bg-stone-900 text-stone-100' : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          <div className="flex justify-between items-start z-10">
            <div>
              <h3 className="text-lg font-serif mb-1">
                {isMember ? "万物会员" : "普通用户"}
              </h3>
              <p className={`text-xs tracking-wide ${isMember ? 'text-stone-400' : 'text-stone-400'}`}>
                {isMember ? "Pro Membership" : "Basic Plan"}
              </p>
            </div>
            <Crown className={`w-6 h-6 ${isMember ? 'text-amber-400' : 'text-stone-300'}`} />
          </div>

          <div className="z-10">
            <p className={`text-sm font-medium ${isMember ? 'text-stone-300' : 'text-stone-500'}`}>
              {isMember ? "已解锁所有高级权益" : "升级以解锁完整体验"}
            </p>
          </div>

          {/* 装饰背景 */}
          {isMember && (
            <div className="absolute -right-4 -bottom-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
          )}
        </motion.div>

        {/* 模拟开关 */}
        <div className="bg-white p-4 rounded-xl border border-stone-100 flex items-center justify-between mb-8 shadow-sm">
          <div>
            <p className="text-sm font-medium text-stone-800">模拟订阅状态</p>
            <p className="text-xs text-stone-400">仅用于演示会员功能</p>
          </div>
          <Switch 
            checked={isMember} 
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-stone-800"
          />
        </div>

        {/* 权益列表 */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Privileges</h3>
          
          <div className="space-y-4">
            {[
              { icon: Shield, title: "守望 · 遗泽锦囊", desc: "紧急联系人与加密遗言", free: false },
              { icon: Zap, title: "灵犀 · 深度洞察", desc: "因果推演与行动清单", free: false },
              { icon: Cloud, title: "功德 · 云端同步", desc: "多设备数据实时备份", free: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isMember ? 'bg-stone-100 text-stone-800' : 'bg-stone-50 text-stone-300'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${isMember ? 'text-stone-800' : 'text-stone-400'}`}>{item.title}</h4>
                  <p className="text-xs text-stone-400">{item.desc}</p>
                </div>
                {isMember ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-stone-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

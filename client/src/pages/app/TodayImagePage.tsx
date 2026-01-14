import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Lock, ChevronRight, Wind, Zap, Droplets, Mountain, Flame } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { calculateBaseHexagram, calculateDailyHexagram, calculateElements, getDailyAdvice, WuXing } from "@/lib/numerology";
import { toast } from "sonner";

interface TodayImagePageProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export default function TodayImagePage({ onBack, onNavigate }: TodayImagePageProps) {
  const { profile, isMember } = useUser();
  const [baseHex, setBaseHex] = useState<any>(null);
  const [dailyHex, setDailyHex] = useState<any>(null);
  const [elements, setElements] = useState<Record<WuXing, number> | null>(null);
  const [advice, setAdvice] = useState<{ recommend: string; avoid: string } | null>(null);

  useEffect(() => {
    if (profile.name && profile.birthDate) {
      const base = calculateBaseHexagram(profile);
      const daily = calculateDailyHexagram(profile);
      const elems = calculateElements(profile);
      const adv = getDailyAdvice(daily.id);

      setBaseHex(base);
      setDailyHex(daily);
      setElements(elems);
      setAdvice(adv);
    }
  }, [profile]);

  if (!baseHex || !dailyHex || !elements) return null;

  const ElementBar = ({ type, value, icon: Icon, color }: { type: string; value: number; icon: any; color: string }) => (
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${color} bg-opacity-10`}>
        <Icon className={`w-3 h-3 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex-1 h-1.5 bg-[#2C2C2C]/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
      <span className="text-[10px] text-[#8C8478] w-6 text-right">{value}</span>
    </div>
  );

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-[#2C2C2C] bg-[#FAF9F6]">
      {/* 背景纹理 */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" 
           style={{ backgroundImage: 'url(/images/paper_texture.jpg)' }} />
      
      {/* 顶部栏 */}
      <div className="relative z-20 px-6 pt-6 pb-4 flex justify-between items-center">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-[#2C2C2C]/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#2C2C2C]" />
        </button>
        <h1 className="text-lg font-medium tracking-[0.2em] font-kai">今日之象</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-[#2C2C2C]/5 transition-colors">
          <Share2 className="w-5 h-5 text-[#2C2C2C]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-24">
        {/* 今日卦象卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FAF9F6] rounded-2xl p-6 border border-[#789262]/20 shadow-sm mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <div className="text-8xl font-serif text-[#789262]">{dailyHex.name[0]}</div>
          </div>
          
          <div className="relative z-10 text-center py-4">
            <p className="text-xs text-[#8C8478] tracking-widest mb-2">今日状态卦</p>
            <h2 className="text-3xl font-medium text-[#2C2C2C] font-kai mb-4">{dailyHex.name}</h2>
            <p className="text-sm text-[#2C2C2C]/80 leading-relaxed font-kai">{dailyHex.nature}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#2C2C2C]/5 pt-4">
            <div className="text-center border-r border-[#2C2C2C]/5">
              <p className="text-[10px] text-[#8C8478] mb-1">宜</p>
              <p className="text-lg text-[#789262] font-medium font-kai">{advice?.recommend}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[#8C8478] mb-1">慎</p>
              <p className="text-lg text-[#C15C5C] font-medium font-kai">{advice?.avoid}</p>
            </div>
          </div>
        </motion.div>

        {/* 五行能量分布 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#FAF9F6] rounded-2xl p-6 border border-[#2C2C2C]/5 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium tracking-widest font-kai">五行偏向</h3>
            <span className="text-[10px] text-[#8C8478]">0-100 相对强度</span>
          </div>
          
          <ElementBar type="木" value={elements.wood} icon={Wind} color="bg-emerald-600" />
          <ElementBar type="火" value={elements.fire} icon={Flame} color="bg-rose-500" />
          <ElementBar type="土" value={elements.earth} icon={Mountain} color="bg-amber-600" />
          <ElementBar type="金" value={elements.metal} icon={Zap} color="bg-slate-400" />
          <ElementBar type="水" value={elements.water} icon={Droplets} color="bg-sky-600" />
        </motion.div>

        {/* 本命卦 (折叠/小卡片) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#2C2C2C] rounded-xl p-4 text-[#FAF9F6] flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-[10px] text-[#FAF9F6]/60 tracking-widest mb-1">本命卦 (终身)</p>
            <p className="text-lg font-medium font-kai">{baseHex.name}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FAF9F6]/10 flex items-center justify-center border border-[#FAF9F6]/20">
            <span className="font-serif text-lg">{baseHex.name[0]}</span>
          </div>
        </motion.div>

        {/* 会员深度解读 */}
        <div className="relative">
          {!isMember && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF9F6]/80 to-[#FAF9F6] z-10 flex flex-col items-center justify-end pb-4">
              <div className="flex items-center gap-2 text-[#2C2C2C] mb-2">
                <Lock className="w-4 h-4" />
                <span className="text-xs tracking-widest">会员解锁深度解读</span>
              </div>
              <button 
                onClick={() => onNavigate('member')}
                className="px-6 py-2 bg-[#2C2C2C] text-[#FAF9F6] text-xs tracking-widest rounded-full hover:bg-[#2C2C2C]/90 transition-colors"
              >
                立即升级
              </button>
            </div>
          )}
          
          <div className={`space-y-4 ${!isMember ? 'blur-sm select-none' : ''}`}>
            <h3 className="text-sm font-medium tracking-widest font-kai mb-2">深度解读</h3>
            <p className="text-xs text-[#2C2C2C]/80 leading-relaxed">
              {dailyHex.nature} 此卦象显示今日气机流转顺畅，适合{advice?.recommend}。
              五行之中{Object.entries(elements).sort(([,a], [,b]) => b-a)[0][0] === 'wood' ? '木' : '火'}气较旺，
              建议保持内心平和，顺势而为。
            </p>
            <p className="text-xs text-[#2C2C2C]/80 leading-relaxed">
              注意：凡事过犹不及，虽有吉兆，亦需{advice?.avoid}。
            </p>
          </div>
        </div>

        {/* 底部合规声明 */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-[#8C8478]/60 scale-90">
            * 本内容为传统文化趣味参考，不构成决策依据
          </p>
        </div>
      </div>

      {/* 底部行动按钮 */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6] to-transparent z-30">
        <button 
          onClick={() => onNavigate('guardian')}
          className="w-full py-4 bg-[#789262] text-[#FAF9F6] rounded-xl text-sm tracking-[0.2em] hover:bg-[#789262]/90 transition-colors shadow-lg shadow-[#789262]/20 flex items-center justify-center gap-2"
        >
          <span>开始今日修行</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

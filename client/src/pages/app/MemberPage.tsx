import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, Lock, User, Calendar, MapPin, ChevronRight, LogOut, Sparkles, ArrowRight, Book, Hexagon, Heart, TrendingUp, X, BookOpen, Shield } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { LifeParameters } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import FiveElementsChart from "@/components/FiveElementsChart";


interface MemberPageProps {
  onNavigate?: (tab: string) => void;
}

export default function MemberPage({ onNavigate }: MemberPageProps) {
  const { isLoggedIn, isMember, profile, coreStructure, login, logout, toggleMember, archives } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const [tempProfile, setTempProfile] = useState<LifeParameters>({
    nickname: "",
    birthDate: "",
    birthTime: "",
    birthCity: ""
  });

  const handleToggleMember = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    if (isMember) {
      toggleMember();
      toast.success("已取消订阅");
    } else {
      setShowUpgrade(true);
    }
  };

  const confirmUpgrade = () => {
    toggleMember();
    setShowUpgrade(false);
    toast.success("欢迎加入万物会员");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(tempProfile);
    setShowLogin(false);
    
    // 自动跳转到今日之象
    if (onNavigate) {
      onNavigate("today_image");
      toast.success("资料已完善，正在生成今日之象...");
    } else {
      setShowConfirmation(true);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("已退出登录");
  };

  const handleStartDaily = () => {
    setShowConfirmation(false);
    if (onNavigate) {
      onNavigate("guardian");
    }
  };

  const getSeasonEnergy = (dateStr: string) => {
    if (!dateStr) return "气机潜藏";
    const month = new Date(dateStr).getMonth() + 1;
    if (month >= 3 && month <= 5) return "生于春日，木气生发";
    if (month >= 6 && month <= 8) return "生于夏日，火气旺盛";
    if (month >= 9 && month <= 11) return "生于秋日，金气收敛";
    return "生于冬日，水气潜藏";
  };

  // Filter archives by type
  const ritualArchives = (archives as any[]).filter(a => a.type === 'ritual');
  const insightArchives = (archives as any[]).filter(a => a.type === 'insight');
  const legacyArchives = (archives as any[]).filter(a => a.type === 'legacy');

  // Mock legacy archives if not in context yet (UserContext update needed for real legacy tracking)
  const mockLegacyArchives = Object.keys(localStorage).filter(k => k.startsWith('wanwu_legacy_capsule_')).map(k => ({
    id: k,
    type: 'legacy',
    title: '遗泽锦囊',
    content: localStorage.getItem(k) || '',
    timestamp: parseInt(k.split('_').pop() || '0')
  }));

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-white/90 bg-black">
      {/* 背景图片 */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/member_bg.png" 
          alt="Member Background" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* 渐变遮罩，确保文字可读性 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 顶部栏 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2 font-kai text-white">我的</h1>
            <p className="text-xs text-white/60 tracking-[0.3em] uppercase">Profile</p>
          </div>
          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4 text-white/60" />
            </button>
          )}
        </motion.div>

        {/* 用户卡片 / 登录入口 */}
        <div 
          onClick={() => !isLoggedIn && setShowLogin(true)}
          className="relative h-32 rounded-2xl overflow-hidden mb-8 group cursor-pointer"
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 transition-colors group-hover:bg-white/10 shadow-lg" />
          
          <div className="relative z-10 h-full p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-8 h-8 text-white/80" />
            </div>
            
            <div className="flex-1">
              {isLoggedIn ? (
                <>
                  <h2 className="text-xl font-medium tracking-widest text-white mb-1 font-kai">{profile.nickname || "悟道者"}</h2>
                  <p className="text-xs text-white/60 tracking-wider flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {profile.birthCity || "未知之地"}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-medium tracking-widest text-white mb-1 font-kai">点击登录/注册</h2>
                  <p className="text-xs text-white/60 tracking-wider">建立个人基础结构</p>
                </>
              )}
            </div>
            
            {!isLoggedIn && <ChevronRight className="w-5 h-5 text-white/40" />}
          </div>
        </div>

        {/* 命理结构 (User Core Structure) */}
        {isLoggedIn && coreStructure && (
          <div className="mb-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Hexagon className="w-32 h-32 text-white" />
            </div>
            
            <h3 className="text-sm font-medium text-white/80 tracking-[0.2em] mb-6 font-kai flex items-center gap-2">
              <span className="w-1 h-4 bg-[#FFD700] rounded-full" />
              命理结构
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {/* 命卦 */}
              <div className="space-y-1">
                <p className="text-[10px] text-white/40 tracking-widest uppercase">Life Hexagram</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl text-[#FFD700] font-kai">{coreStructure.lifeHexagramName}</span>
                  <span className="text-xs text-white/60">卦</span>
                </div>
              </div>

              {/* 修行主轴 */}
              <div className="space-y-1">
                <p className="text-[10px] text-white/40 tracking-widest uppercase">Cultivation</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl text-white font-kai">{coreStructure.cultivationAxis}</span>
                </div>
              </div>

              {/* 气质类型 */}
              <div className="space-y-1">
                <p className="text-[10px] text-white/40 tracking-widest uppercase">Temperament</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl text-white font-kai">{coreStructure.temperament}</span>
                </div>
              </div>

              {/* 五行倾向 (简略) */}
              <div className="space-y-1 col-span-2">
                <p className="text-[10px] text-white/40 tracking-widest uppercase mb-2">Energy State</p>
                <FiveElementsChart data={coreStructure.currentEnergy || coreStructure.elements} />
              </div>
            </div>
          </div>
        )}



        {/* 功能入口区 (登录后可见) */}
        {isLoggedIn && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => onNavigate && onNavigate('today_image')}
              className="relative overflow-hidden rounded-2xl p-5 text-left group shadow-lg bg-gradient-to-br from-[#FFD700]/20 to-transparent border border-[#FFD700]/20 backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <Sparkles className="w-12 h-12 text-[#FFD700]" />
              </div>
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                </div>
                <h3 className="text-lg font-kai tracking-widest text-[#FFD700] mb-1">今日之象</h3>
                <p className="text-[10px] text-[#FFD700]/60 tracking-wider">每日运势 · 五行指引</p>
              </div>
            </button>

            <button 
              onClick={() => onNavigate && onNavigate('library')}
              className="relative overflow-hidden rounded-2xl p-5 text-left group shadow-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-kai tracking-widest text-white mb-1">万物藏经</h3>
                <p className="text-[10px] text-white/60 tracking-wider">六十四卦 · 智慧全集</p>
              </div>
            </button>
          </div>
        )}

        {/* 档案归集 (Archives) */}
        {isLoggedIn && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/80 tracking-[0.2em] mb-4 font-kai">档案归集</h3>
            <div className="grid grid-cols-3 gap-3">
              {/* 卦象记录 */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <Hexagon className="w-6 h-6 text-white/60 mb-2" />
                    <span className="text-xs text-white/80 tracking-wider">卦象记录</span>
                    <span className="text-[10px] text-white/40 mt-1">{ritualArchives.length} 条</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#1C1C1C] border border-white/10 shadow-2xl max-w-[320px] rounded-3xl text-white h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="font-kai text-center text-xl text-white tracking-widest">卦象记录</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-1 px-4">
                    <div className="space-y-4 py-4">
                      {ritualArchives.length === 0 ? (
                        <div className="text-center text-white/40 py-8 text-xs">暂无记录</div>
                      ) : (
                        ritualArchives.map((a, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-kai text-[#FFD700]">{a.hexagramName}</span>
                              <span className="text-[10px] text-white/40">{new Date(a.date || 0).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-white/60 line-clamp-2">{a.note || a.question}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              {/* 灵犀记录 */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <Heart className="w-6 h-6 text-white/60 mb-2" />
                    <span className="text-xs text-white/80 tracking-wider">灵犀记录</span>
                    <span className="text-[10px] text-white/40 mt-1">{insightArchives.length} 条</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#1C1C1C] border border-white/10 shadow-2xl max-w-[320px] rounded-3xl text-white h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="font-kai text-center text-xl text-white tracking-widest">灵犀记录</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-1 px-4">
                    <div className="space-y-4 py-4">
                      {insightArchives.length === 0 ? (
                        <div className="text-center text-white/40 py-8 text-xs">暂无记录</div>
                      ) : (
                        insightArchives.map((a, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-[#FFD700] border border-[#FFD700]/30 px-2 py-0.5 rounded-full">问询</span>
                              <span className="text-[10px] text-white/40">{new Date(a.timestamp || 0).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-white/80 mb-2 font-medium">{a.question}</p>
                            <p className="text-xs text-white/60 line-clamp-3">{a.answer}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              {/* 遗泽锦囊 */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <Shield className="w-6 h-6 text-white/60 mb-2" />
                    <span className="text-xs text-white/80 tracking-wider">遗泽锦囊</span>
                    <span className="text-[10px] text-white/40 mt-1">{mockLegacyArchives.length} 个</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#1C1C1C] border border-white/10 shadow-2xl max-w-[320px] rounded-3xl text-white h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="font-kai text-center text-xl text-white tracking-widest">遗泽锦囊</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-1 px-4">
                    <div className="space-y-4 py-4">
                      {mockLegacyArchives.length === 0 ? (
                        <div className="text-center text-white/40 py-8 text-xs">暂无锦囊</div>
                      ) : (
                        mockLegacyArchives.map((a, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-kai text-[#FFD700]">{a.title}</span>
                              <span className="text-[10px] text-white/40">{new Date(a.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-white/60">{a.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* 会员订阅卡片 - Always Visible */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl p-6 border border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/10 to-transparent backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-kai tracking-widest text-[#FFD700] flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  万物会员
                </h3>
                <p className="text-xs text-[#FFD700]/60 mt-1 tracking-wider">
                  {isMember ? "已解锁全部特权" : "解锁更深层的生命指引"}
                </p>
              </div>
              {isMember && (
                <span className="px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-medium border border-[#FFD700]/20">
                  已订阅
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {[
                "无限次灵犀问询",
                "深度卦象爻辞解析",
                "完整功德趋势分析",
                "永久保存历史记录"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                  <Check className="w-3 h-3 text-[#FFD700]" />
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={handleToggleMember}
              className={`w-full py-3 rounded-xl text-sm font-medium tracking-widest transition-all ${
                isMember 
                  ? "bg-white/5 text-white/60 hover:bg-white/10" 
                  : "bg-[#FFD700] text-black hover:bg-[#E5C100] shadow-[0_0_20px_rgba(255,215,0,0.3)]"
              }`}
            >
              {isMember ? "管理订阅" : "立即升级"}
            </button>
          </div>
        </div>
      </div>

      {/* 登录弹窗 */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-xs bg-[#1C1C1C] rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                  <User className="w-8 h-8 text-white/80" />
                </div>
                <h2 className="text-xl text-white font-medium tracking-widest font-kai">完善资料</h2>
                <p className="text-xs text-white/40 mt-2">建立您的数字生命档案</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest ml-1">Nickname</label>
                  <input
                    type="text"
                    required
                    value={tempProfile.nickname}
                    onChange={e => setTempProfile({...tempProfile, nickname: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                    placeholder="您的称呼"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest ml-1">Date</label>
                    <input
                      type="date"
                      required
                      value={tempProfile.birthDate}
                      onChange={e => setTempProfile({...tempProfile, birthDate: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest ml-1">Time</label>
                    <input
                      type="time"
                      required
                      value={tempProfile.birthTime}
                      onChange={e => setTempProfile({...tempProfile, birthTime: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest ml-1">City</label>
                  <input
                    type="text"
                    required
                    value={tempProfile.birthCity}
                    onChange={e => setTempProfile({...tempProfile, birthCity: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                    placeholder="出生城市 (用于定气)"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#FFD700] text-black rounded-xl font-medium tracking-widest hover:bg-[#E5C100] transition-colors mt-4 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                >
                  开启旅程
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 升级确认弹窗 */}
      <AnimatePresence>
        {showUpgrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-xs bg-[#1C1C1C] rounded-3xl p-8 border border-[#FFD700]/30 shadow-2xl text-center relative overflow-hidden"
            >
              <button 
                onClick={() => setShowUpgrade(false)}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6 border border-[#FFD700]/20">
                <Crown className="w-8 h-8 text-[#FFD700]" />
              </div>
              
              <h2 className="text-xl text-white font-medium tracking-widest font-kai mb-2">升级会员</h2>
              <p className="text-xs text-white/60 mb-8">解锁全部高级功能</p>

              <div className="space-y-4 mb-8 text-left bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">月度会员</span>
                  <span className="text-lg font-medium text-[#FFD700]">¥ 18.00</span>
                </div>
                <div className="h-[1px] bg-white/10" />
                <p className="text-[10px] text-white/40">
                  * 模拟支付，点击确认直接开通
                </p>
              </div>

              <button
                onClick={confirmUpgrade}
                className="w-full py-3 bg-[#FFD700] text-black rounded-xl font-medium tracking-widest hover:bg-[#E5C100] transition-colors shadow-[0_0_20px_rgba(255,215,0,0.2)]"
              >
                确认支付
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

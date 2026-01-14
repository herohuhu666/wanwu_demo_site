import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, Lock, User, Calendar, MapPin, ChevronRight, LogOut, Sparkles, ArrowRight, Book, Hexagon, Heart, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useUser, UserProfile } from "@/contexts/UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MemberPageProps {
  onNavigate?: (tab: string) => void;
}

export default function MemberPage({ onNavigate }: MemberPageProps) {
  const { isLoggedIn, isMember, profile, login, logout, toggleMember, archives } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthCity: ""
  });

  const handleToggleMember = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    toggleMember();
    toast.success(isMember ? "已取消订阅" : "欢迎加入万物会员");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(tempProfile);
    setShowLogin(false);
    setShowConfirmation(true);
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

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-[#2C2C2C] bg-[#FAF9F6]">
      {/* 背景纹理 */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" 
           style={{ backgroundImage: 'url(/images/paper_texture.jpg)' }} />
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('/images/zen_bg.png')] bg-no-repeat bg-center bg-cover" />
      
      {/* 顶部遮罩 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FAF9F6] to-transparent z-10" />

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-24 overflow-y-auto scrollbar-hide">
        
        {/* 顶部栏 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2 font-kai">我的</h1>
            <p className="text-xs text-[#8C8478] tracking-[0.3em] uppercase">Profile</p>
          </div>
          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-[#2C2C2C]/5 transition-colors"
            >
              <LogOut className="w-4 h-4 text-[#8C8478]" />
            </button>
          )}
        </motion.div>

        {/* 用户卡片 / 登录入口 */}
        <div 
          onClick={() => !isLoggedIn && setShowLogin(true)}
          className="relative h-32 rounded-2xl overflow-hidden mb-8 group cursor-pointer"
        >
          <div className="absolute inset-0 bg-[#FAF9F6] border border-[#789262]/20 transition-colors group-hover:border-[#789262]/40 shadow-sm" />
          
          <div className="relative z-10 h-full p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#2C2C2C]/5 flex items-center justify-center border border-[#2C2C2C]/10">
              <User className="w-8 h-8 text-[#2C2C2C]/60" />
            </div>
            
            <div className="flex-1">
              {isLoggedIn ? (
                <>
                  <h2 className="text-xl font-medium tracking-widest text-[#2C2C2C] mb-1 font-kai">{profile.name || "悟道者"}</h2>
                  <p className="text-xs text-[#8C8478] tracking-wider flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {profile.birthCity || "未知之地"}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-medium tracking-widest text-[#2C2C2C] mb-1 font-kai">点击登录/注册</h2>
                  <p className="text-xs text-[#8C8478] tracking-wider">建立个人基础结构</p>
                </>
              )}
            </div>
            
            {!isLoggedIn && <ChevronRight className="w-5 h-5 text-[#2C2C2C]/40" />}
          </div>
        </div>

        {/* 档案归集 (Archives) */}
        {isLoggedIn && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-[#2C2C2C] tracking-[0.2em] mb-4 font-kai">档案归集</h3>
            <div className="grid grid-cols-3 gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAF9F6] border border-[#789262]/10 hover:bg-[#789262]/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#789262]/10 flex items-center justify-center mb-2 text-[#789262]">
                      <Book className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#2C2C2C] tracking-widest">灵犀</span>
                    <span className="text-[10px] text-[#8C8478] mt-1">{archives.filter(a => a.type === 'insight').length} 条</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#FAF9F6] border border-[#789262]/20 max-w-[320px] max-h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="font-kai text-center text-xl text-[#2C2C2C] tracking-widest">灵犀档案</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4 py-4">
                      {archives.filter(a => a.type === 'insight').length > 0 ? (
                        archives.filter(a => a.type === 'insight').map((a: any, i: number) => (
                          <div key={i} className="p-4 rounded-xl bg-[#2C2C2C]/5 border border-[#2C2C2C]/10">
                            <p className="text-sm font-medium text-[#2C2C2C] mb-2">{a.title}</p>
                            <p className="text-xs text-[#8C8478] line-clamp-3">{a.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-[#8C8478] py-8">暂无记录</p>
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAF9F6] border border-[#789262]/10 hover:bg-[#789262]/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#789262]/10 flex items-center justify-center mb-2 text-[#789262]">
                      <Hexagon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#2C2C2C] tracking-widest">乾坤</span>
                    <span className="text-[10px] text-[#8C8478] mt-1">{archives.filter(a => a.type === 'ritual').length} 条</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#FAF9F6] border border-[#789262]/20 max-w-[320px] max-h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="font-kai text-center text-xl text-[#2C2C2C] tracking-widest">乾坤档案</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4 py-4">
                      {archives.filter(a => a.type === 'ritual').length > 0 ? (
                        archives.filter(a => a.type === 'ritual').map((a: any, i: number) => (
                          <div key={i} className="p-4 rounded-xl bg-[#2C2C2C]/5 border border-[#2C2C2C]/10">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm font-medium text-[#2C2C2C]">{a.title}</p>
                              <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#789262]/30 text-[#789262]">{a.tags?.[0]}</span>
                            </div>
                            <p className="text-xs text-[#8C8478] line-clamp-3">{a.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-[#8C8478] py-8">暂无记录</p>
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAF9F6] border border-[#789262]/10 hover:bg-[#789262]/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#789262]/10 flex items-center justify-center mb-2 text-[#789262]">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#2C2C2C] tracking-widest">遗泽</span>
                    <span className="text-[10px] text-[#8C8478] mt-1">{archives.filter(a => a.type === 'gift').length} 条</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#FAF9F6] border border-[#789262]/20 max-w-[320px] max-h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="font-kai text-center text-xl text-[#2C2C2C] tracking-widest">遗泽锦囊</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4 py-4">
                      {archives.filter(a => a.type === 'gift').length > 0 ? (
                        archives.filter(a => a.type === 'gift').map((a: any, i: number) => (
                          <div key={i} className="p-4 rounded-xl bg-[#2C2C2C]/5 border border-[#2C2C2C]/10">
                            <p className="text-sm font-medium text-[#2C2C2C] mb-2">{a.title}</p>
                            <p className="text-xs text-[#8C8478]">{a.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-[#8C8478] py-8">暂无记录</p>
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* 会员卡片 */}
        <div className="relative h-48 rounded-3xl overflow-hidden mb-8 group shadow-lg">
          <div className={`absolute inset-0 transition-colors duration-500 ${isMember ? 'bg-[#2C2C2C]' : 'bg-[#FAF9F6] border border-[#789262]/20'}`} />
          
          {/* 装饰纹理 */}
          <div className="absolute inset-0 opacity-10 bg-[url('/images/paper_texture.jpg')] mix-blend-overlay" />
          
          <div className="relative z-10 h-full p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h2 className={`text-xl tracking-[0.2em] font-medium mb-2 font-kai ${isMember ? 'text-[#FAF9F6]' : 'text-[#2C2C2C]'}`}>
                  {isMember ? "万物会员" : "普通用户"}
                </h2>
                <p className={`text-xs tracking-wider ${isMember ? 'text-[#FAF9F6]/60' : 'text-[#8C8478]'}`}>
                  {isMember ? "已解锁深度洞察" : "升级解锁完整体验"}
                </p>
              </div>
              <Crown className={`w-6 h-6 ${isMember ? 'text-[#E0C38C]' : 'text-[#2C2C2C]/40'}`} />
            </div>

            <button
              onClick={handleToggleMember}
              className={`w-full py-3 rounded-xl text-xs tracking-[0.2em] transition-colors ${
                isMember 
                  ? 'bg-[#FAF9F6]/10 text-[#FAF9F6] hover:bg-[#FAF9F6]/20' 
                  : 'bg-[#2C2C2C] text-[#FAF9F6] hover:bg-[#2C2C2C]/90'
              }`}
            >
              {isMember ? "管理订阅" : "立即升级"}
            </button>
          </div>
        </div>

        {/* 权益列表 */}
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <h3 className="text-sm font-medium text-[#2C2C2C] tracking-[0.2em] mb-6 font-kai">会员权益</h3>
          <div className="space-y-4">
            {[
              { title: "深度 · 态势对照", desc: "节奏 × 态势 × 健康 多维分析", locked: !isMember },
              { title: "趋势 · 周期洞察", desc: "7天 / 14天 状态趋势总结", locked: !isMember },
              { title: "灵犀 · 无限问询", desc: "解除每日提问次数限制", locked: !isMember },
              { title: "乾坤 · 完整解读", desc: "解锁卦象深层智慧语义", locked: !isMember },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-[#FAF9F6] border border-[#789262]/10"
              >
                <div>
                  <h4 className="text-sm font-medium text-[#2C2C2C] tracking-wider mb-1">{item.title}</h4>
                  <p className="text-xs text-[#2C2C2C]/60 tracking-wide">{item.desc}</p>
                </div>
                {item.locked ? (
                  <Lock className="w-4 h-4 text-[#8C8478]/40" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#789262]/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#789262]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 登录/注册弹窗 */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#FAF9F6]/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-medium tracking-[0.2em] text-[#2C2C2C] mb-2 font-kai">人生参数</h3>
                <p className="text-xs text-[#8C8478] tracking-widest">Life Parameters</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-[#2C2C2C] tracking-widest block">称呼 (必填)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C2C2C]/40" />
                    <input 
                      type="text" 
                      required
                      value={tempProfile.name}
                      onChange={e => setTempProfile({...tempProfile, name: e.target.value})}
                      className="w-full bg-[#FAF9F6] border border-[#2C2C2C]/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#789262]/30"
                      placeholder="如何称呼您"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-[#2C2C2C] tracking-widest block">出生日期</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C2C2C]/40" />
                      <input 
                        type="date" 
                        value={tempProfile.birthDate}
                        onChange={e => setTempProfile({...tempProfile, birthDate: e.target.value})}
                        className="w-full bg-[#FAF9F6] border border-[#2C2C2C]/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#789262]/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#2C2C2C] tracking-widest block">出生时间</label>
                    <input 
                      type="time" 
                      value={tempProfile.birthTime}
                      onChange={e => setTempProfile({...tempProfile, birthTime: e.target.value})}
                      className="w-full bg-[#FAF9F6] border border-[#2C2C2C]/10 rounded-xl py-3 px-4 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#789262]/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#2C2C2C] tracking-widest block">出生地 (城市级)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C2C2C]/40" />
                    <input 
                      type="text" 
                      value={tempProfile.birthCity}
                      onChange={e => setTempProfile({...tempProfile, birthCity: e.target.value})}
                      className="w-full bg-[#FAF9F6] border border-[#2C2C2C]/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#789262]/30"
                      placeholder="例如：北京"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="flex-1 py-3 rounded-xl border border-[#2C2C2C]/10 text-[#2C2C2C] text-xs tracking-[0.2em] hover:bg-[#2C2C2C]/5 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#2C2C2C] text-[#FAF9F6] text-xs tracking-[0.2em] hover:bg-[#2C2C2C]/90 transition-colors"
                  >
                    确认
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 结构确认弹窗 */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#FAF9F6] flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-xs w-full"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#789262]/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#789262]" />
              </div>
              
              <h2 className="text-2xl font-medium text-[#2C2C2C] mb-2 tracking-[0.2em] font-kai">结构已立</h2>
              <p className="text-xs text-[#8C8478] tracking-widest mb-8">Structure Established</p>

              <div className="bg-[#FAF9F6] border border-[#789262]/20 rounded-2xl p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#789262]/30 to-transparent" />
                <p className="text-sm text-[#2C2C2C] leading-loose font-kai">
                  {profile.name}，<br/>
                  {getSeasonEnergy(profile.birthDate)}。<br/>
                  <span className="text-[#8C8478] text-xs mt-2 block">
                    万物已为您建立个人能量场域
                  </span>
                </p>
              </div>

              <button 
                onClick={handleStartDaily}
                className="w-full py-4 rounded-xl bg-[#2C2C2C] text-[#FAF9F6] text-xs tracking-[0.3em] hover:bg-[#2C2C2C]/90 transition-all flex items-center justify-center gap-2 group"
              >
                开启今日修行 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

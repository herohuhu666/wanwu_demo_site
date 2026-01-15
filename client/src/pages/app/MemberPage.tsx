import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Crown, Settings, ChevronRight, Star, Moon, Sun, Wind, Cloud, Droplets, Flame, X, Check, Hexagon, Heart, Shield, LogOut } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// 模拟历史数据
const mockRitualArchives = [
  { date: "2024-01-15", hexagramName: "大有", question: "近期事业发展方向", note: "火在天上，顺天依时，大有可为。" },
  { date: "2024-01-12", hexagramName: "谦", question: "人际关系处理", note: "地中有山，谦谦君子，卑以自牧。" },
  { date: "2024-01-08", hexagramName: "复", question: "是否应该跳槽", note: "雷在地中，复，其见天地之心乎。" },
];

const mockInsightArchives = [
  { timestamp: "2024-01-14T10:30:00", question: "感到很迷茫，不知道意义何在", answer: "迷茫是觉醒的前奏。就像大雾弥漫时，正是阳光即将穿透的前夜。试着关注当下的呼吸，意义不在远方，而在每一次的一呼一吸之间。" },
  { timestamp: "2024-01-10T22:15:00", question: "如何面对失去", answer: "失去是另一种形式的获得。落叶归根，是为了滋养明春的新芽。允许悲伤流淌，但不要让它淹没你内心的光。" },
];

const mockLegacyArchives = [
  { timestamp: "2023-12-25", title: "冬至锦囊", content: "一阳初生，万物待发。此时最宜静养，护持心中微弱的阳气。" },
  { timestamp: "2023-11-08", title: "立冬锦囊", content: "水始冰，地始冻。收藏之时，不宜远行，宜温补，宜读书。" },
];

export default function MemberPage() {
  const { profile, login, logout, isMember, toggleMember } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [tempProfile, setTempProfile] = useState({
    nickname: "",
    birthDate: "",
    birthTime: "",
    birthCity: ""
  });

  // 模拟数据源
  const ritualArchives = profile ? mockRitualArchives : [];
  const insightArchives = profile ? mockInsightArchives : [];

  const isLoggedIn = !!profile.nickname;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      nickname: tempProfile.nickname,
      birthDate: tempProfile.birthDate,
      birthTime: tempProfile.birthTime,
      birthCity: tempProfile.birthCity
    });
    setShowLogin(false);
  };

  const handleToggleMember = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    if (isMember) {
      // 如果已经是会员，显示管理弹窗（这里简化为直接取消）
      toggleMember();
    } else {
      setShowUpgrade(true);
    }
  };

  const confirmUpgrade = () => {
    toggleMember();
    setShowUpgrade(false);
  };

  return (
    <div className="h-full bg-[#0A0A0A] text-white relative overflow-y-auto scrollbar-hide">
      {/* 背景光效 */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#1C1C1C] to-transparent pointer-events-none" />
      
      <div className="relative z-10 px-6 pt-12 pb-24">
        {/* 头部用户信息 */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative group">
              {isLoggedIn ? (
                <div className="w-full h-full bg-gradient-to-br from-[#FFD700]/20 to-transparent flex items-center justify-center text-2xl font-kai text-[#FFD700]">
                  {profile.nickname[0]}
                </div>
              ) : (
                <User className="w-8 h-8 text-white/40 group-hover:text-white/60 transition-colors" />
              )}
              {isMember && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center border-2 border-[#0A0A0A]">
                  <Crown className="w-3 h-3 text-black" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-kai tracking-widest text-white mb-1">
                {isLoggedIn ? profile.nickname : "未登录"}
              </h1>
              <p className="text-xs text-white/40 tracking-wider flex items-center gap-2">
                {isLoggedIn ? (
                  <>
                    <span>{profile.birthDate}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{profile.birthCity}</span>
                  </>
                ) : (
                  <button onClick={() => setShowLogin(true)} className="hover:text-[#FFD700] transition-colors">
                    点击建立档案
                  </button>
                )}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
                <Settings className="w-6 h-6 text-white/40" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1C1C1C] border-white/10 text-white">
              {isLoggedIn && (
                <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-400 focus:bg-white/5 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              )}
              {!isLoggedIn && (
                <DropdownMenuItem onClick={() => setShowLogin(true)} className="focus:bg-white/5 cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  登录/注册
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 核心数据概览 (Stats) */}
        {isLoggedIn && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Star className="w-12 h-12 text-white" />
              </div>
              <div className="text-xs text-white/40 mb-1 tracking-wider">累计功德</div>
              <div className="text-2xl font-medium text-white font-mono">1,248</div>
              <div className="text-[10px] text-[#FFD700]/60 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                今日 +12
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wind className="w-12 h-12 text-white" />
              </div>
              <div className="text-xs text-white/40 mb-1 tracking-wider">专注时长</div>
              <div className="text-2xl font-medium text-white font-mono">42<span className="text-sm ml-1 text-white/40">h</span></div>
              <div className="text-[10px] text-white/40 mt-2">
                超越 85% 道友
              </div>
            </div>
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

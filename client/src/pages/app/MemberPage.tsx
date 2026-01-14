import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, Lock, User, Calendar, MapPin, ChevronRight, LogOut } from "lucide-react";
import { toast } from "sonner";

// Mock User Data
interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
}

export default function MemberPage() {
  const [isMember, setIsMember] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthCity: ""
  });

  const toggleMember = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    setIsMember(!isMember);
    toast.success(isMember ? "已取消订阅" : "欢迎加入万物会员");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLogin(false);
    toast.success("登录成功");
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-[#4A4036]">
      {/* 背景图 */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/zen_bg.png)' }}
      />
      
      {/* 顶部遮罩 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#E8E2D2]/80 to-transparent z-10" />

      {/* 内容区域 */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-20 pb-8">
        
        {/* 顶部栏 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl tracking-[0.2em] font-medium mb-2">我的</h1>
            <p className="text-xs text-[#8C8478] tracking-[0.3em] uppercase">Profile</p>
          </div>
          {isLoggedIn && (
            <button 
              onClick={() => {
                setIsLoggedIn(false);
                setIsMember(false);
                toast.success("已退出登录");
              }}
              className="p-2 rounded-full hover:bg-[#4A4036]/5 transition-colors"
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
          <div className="absolute inset-0 bg-[#F5E6C8]/20 backdrop-blur-md border border-[#FFF8E7]/30 transition-colors group-hover:bg-[#F5E6C8]/30" />
          
          <div className="relative z-10 h-full p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#4A4036]/5 flex items-center justify-center border border-[#4A4036]/10">
              <User className="w-8 h-8 text-[#4A4036]/60" />
            </div>
            
            <div className="flex-1">
              {isLoggedIn ? (
                <>
                  <h2 className="text-xl font-medium tracking-widest text-[#4A4036] mb-1">{profile.name || "悟道者"}</h2>
                  <p className="text-xs text-[#8C8478] tracking-wider flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {profile.birthCity || "未知之地"}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-medium tracking-widest text-[#4A4036] mb-1">点击登录/注册</h2>
                  <p className="text-xs text-[#8C8478] tracking-wider">建立个人基础结构</p>
                </>
              )}
            </div>
            
            {!isLoggedIn && <ChevronRight className="w-5 h-5 text-[#4A4036]/40" />}
          </div>
        </div>

        {/* 会员卡片 */}
        <div className="relative h-48 rounded-3xl overflow-hidden mb-8 group">
          <div className={`absolute inset-0 transition-colors duration-500 ${isMember ? 'bg-[#4A4036]' : 'bg-[#F5E6C8]/20 backdrop-blur-md border border-[#FFF8E7]/30'}`} />
          
          {/* 装饰纹理 */}
          <div className="absolute inset-0 opacity-10 bg-[url('/images/paper_texture.jpg')] mix-blend-overlay" />
          
          <div className="relative z-10 h-full p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h2 className={`text-xl tracking-[0.2em] font-medium mb-2 ${isMember ? 'text-[#F9F9F7]' : 'text-[#4A4036]'}`}>
                  {isMember ? "万物会员" : "普通用户"}
                </h2>
                <p className={`text-xs tracking-wider ${isMember ? 'text-[#F9F9F7]/60' : 'text-[#8C8478]'}`}>
                  {isMember ? "已解锁深度洞察" : "升级解锁完整体验"}
                </p>
              </div>
              <Crown className={`w-6 h-6 ${isMember ? 'text-[#F5E6C8]' : 'text-[#4A4036]/40'}`} />
            </div>

            <button
              onClick={toggleMember}
              className={`w-full py-3 rounded-xl text-xs tracking-[0.2em] transition-colors ${
                isMember 
                  ? 'bg-[#F9F9F7]/10 text-[#F9F9F7] hover:bg-[#F9F9F7]/20' 
                  : 'bg-[#4A4036] text-[#F9F9F7] hover:bg-[#4A4036]/90'
              }`}
            >
              {isMember ? "管理订阅" : "立即升级"}
            </button>
          </div>
        </div>

        {/* 权益列表 */}
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <h3 className="text-sm font-medium text-[#4A4036] tracking-[0.2em] mb-6">会员权益</h3>
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
                className="flex items-center justify-between p-4 rounded-xl bg-[#F5E6C8]/5 backdrop-blur-sm border border-[#FFF8E7]/20"
              >
                <div>
                  <h4 className="text-sm font-medium text-[#4A4036] tracking-wider mb-1">{item.title}</h4>
                  <p className="text-xs text-[#4A4036]/60 tracking-wide">{item.desc}</p>
                </div>
                {item.locked ? (
                  <Lock className="w-4 h-4 text-[#8C8478]/40" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#4A4036]/5 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#4A4036]" />
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
            className="absolute inset-0 z-50 bg-[#E8E2D2]/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-medium tracking-[0.2em] text-[#4A4036] mb-2">人生参数</h3>
                <p className="text-xs text-[#8C8478] tracking-widest">Life Parameters</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-[#4A4036] tracking-widest block">称呼 (必填)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4036]/40" />
                    <input 
                      type="text" 
                      required
                      value={profile.name}
                      onChange={e => setProfile({...profile, name: e.target.value})}
                      className="w-full bg-[#F9F9F7]/50 border border-[#4A4036]/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#4A4036] focus:outline-none focus:border-[#4A4036]/30"
                      placeholder="如何称呼您"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-[#4A4036] tracking-widest block">出生日期</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4036]/40" />
                      <input 
                        type="date" 
                        value={profile.birthDate}
                        onChange={e => setProfile({...profile, birthDate: e.target.value})}
                        className="w-full bg-[#F9F9F7]/50 border border-[#4A4036]/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#4A4036] focus:outline-none focus:border-[#4A4036]/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#4A4036] tracking-widest block">出生时间</label>
                    <input 
                      type="time" 
                      value={profile.birthTime}
                      onChange={e => setProfile({...profile, birthTime: e.target.value})}
                      className="w-full bg-[#F9F9F7]/50 border border-[#4A4036]/10 rounded-xl py-3 px-4 text-sm text-[#4A4036] focus:outline-none focus:border-[#4A4036]/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#4A4036] tracking-widest block">出生地 (城市级)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4036]/40" />
                    <input 
                      type="text" 
                      value={profile.birthCity}
                      onChange={e => setProfile({...profile, birthCity: e.target.value})}
                      className="w-full bg-[#F9F9F7]/50 border border-[#4A4036]/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#4A4036] focus:outline-none focus:border-[#4A4036]/30"
                      placeholder="例如：北京"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-[#8C8478] text-center leading-relaxed">
                  * 信息仅用于生成个人基础结构，不做其他用途。<br/>
                  出生时间如不确定可留空。
                </p>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="flex-1 py-3 text-[#4A4036] text-xs tracking-widest hover:bg-[#4A4036]/5 rounded-xl transition-colors"
                  >
                    稍后补充
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#4A4036] text-[#F9F9F7] rounded-xl text-xs tracking-widest hover:bg-[#4A4036]/90 transition-colors"
                  >
                    确认开启
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

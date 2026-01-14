import { useState } from "react";
import { MobileSimulator } from "@/components/MobileSimulator";
import BottomNav from "@/components/BottomNav";
import GuardianPage from "./app/GuardianPage";
import LingxiPage from "./app/LingxiPage";
import RitualPage from "./app/RitualPage";
import MeritPage from "./app/MeritPage";
import MemberPage from "./app/MemberPage";
import TodayImagePage from "./app/TodayImagePage";
import LibraryPage from "./app/LibraryPage";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState("guardian");

  const renderGuide = () => {
    switch (activeTab) {
      case "guardian":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-800">守望 (Guardian)</h3>
            <p className="text-stone-600 leading-relaxed">
              点击中央的命灯，向系统发送平安信号。
              <br/><br/>
              <span className="font-bold">演示要点：</span>
              <br/>1. 命灯呼吸光效与倒计时。
              <br/>2. 点击右上角太阳图标查看“能量天气”。
              <br/>3. 解释“72小时未点亮触发遗泽锦囊”的安全逻辑。
            </p>
          </div>
        );
      case "insight":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-800">灵犀 (Insight)</h3>
            <p className="text-stone-600 leading-relaxed">
              输入当下观察到的细节，获取 AI 的即时指引。
              <br/><br/>
              <span className="font-bold">演示要点：</span>
              <br/>1. 体验“外应速断”的三段式反馈。
              <br/>2. 开启右上角“模拟会员”，展示分级反馈差异。
              <br/>3. 强调“军师”角色的价值。
            </p>
          </div>
        );
      case "ritual":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-800">乾坤 (Ritual)</h3>
            <p className="text-stone-600 leading-relaxed">
              点击黑色圆环进行摇卦，体验数字化的仪式感。
              <br/><br/>
              <span className="font-bold">演示要点：</span>
              <br/>1. 摇卦过程中的震动与动画。
              <br/>2. 卦象生成后的“智慧语义”解读。
              <br/>3. 说明未来将接入 3D 引擎以增强沉浸感。
            </p>
          </div>
        );
      case "merit":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-800">功德 (Merit)</h3>
            <p className="text-stone-600 leading-relaxed">
              记录善行，积累功德，建立内心的秩序。
              <br/><br/>
              <span className="font-bold">演示要点：</span>
              <br/>1. 尝试记录不同类型的功德（如利他）。
              <br/>2. 点击右上角爱心图标体验“回向”功能。
              <br/>3. 解释功德值作为“精神资产”的意义。
            </p>
          </div>
        );
      case "member":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-800">我的 (Me)</h3>
            <p className="text-stone-600 leading-relaxed">
              管理会员状态与个人设置。
              <br/><br/>
              <span className="font-bold">演示要点：</span>
              <br/>1. 展示会员权益对比。
              <br/>2. 模拟订阅流程。
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* 左侧：手机模拟器 */}
        <div className="flex justify-center lg:justify-end w-full h-full">
          <MobileSimulator>
            <div className="h-full flex flex-col bg-white overflow-hidden">
              <div className="flex-1 overflow-hidden relative">
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'guardian' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  <GuardianPage />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'insight' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  <LingxiPage />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'ritual' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  <RitualPage />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'merit' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  <MeritPage />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'member' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  <MemberPage onNavigate={setActiveTab} />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'today_image' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  <TodayImagePage onBack={() => setActiveTab('member')} onNavigate={setActiveTab} />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'library' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  <LibraryPage onBack={() => setActiveTab('member')} />
                </div>
              </div>
              <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </MobileSimulator>
        </div>

        {/* 右侧：动态引导 */}
        <div className="hidden lg:block max-w-md">
          <div className="mb-8">
            <img src="/images/app_icon.png" alt="Wanwu Logo" className="w-16 h-16 rounded-2xl shadow-lg mb-6" />
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">万物 Wanwu</h1>
            <p className="text-stone-500 text-lg">见万物，见众生，见自己。</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-full -mr-8 -mt-8 z-0" />
              <div className="relative z-10">
                {renderGuide()}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex gap-4 text-sm text-stone-400">
            <p>Interactive Demo V1.5</p>
            <span>•</span>
            <p>Press F11 for Fullscreen</p>
          </div>
        </div>
      </div>
    </div>
  );
}

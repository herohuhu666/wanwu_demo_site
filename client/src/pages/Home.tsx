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
  const [activeTab, setActiveTab] = useState("today_image");
  const [showIntro, setShowIntro] = useState(true);

  const renderGuide = () => {
    switch (activeTab) {
      case "today_image":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-800">天 (Sky)</h3>
            <p className="text-stone-600 leading-relaxed">
              观天象，知时节。每日能量仪表盘。
              <br/><br/>
              <span className="font-bold">演示要点：</span>
              <br/>1. 二十四节气感知与候应文案。
              <br/>2. 今日五行能量状态展示。
              <br/>3. 每日修行智慧一言。
            </p>
          </div>
        );
      case "ritual":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-800">地 (Earth)</h3>
            <p className="text-stone-600 leading-relaxed">
              法地仪，定吉凶。行动与决策的工具。
              <br/><br/>
              <span className="font-bold">演示要点：</span>
              <br/>1. 六爻卜卦的数字化仪式感。
              <br/>2. 震动反馈与沉浸式动画。
              <br/>3. 智慧语义解读卦象。
            </p>
          </div>
        );
      case "insight":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-800">人 (Human)</h3>
            <p className="text-stone-600 leading-relaxed">
              通人心，解疑惑。思考与内省的空间。
              <br/><br/>
              <span className="font-bold">演示要点：</span>
              <br/>1. AI 深度问答解析。
              <br/>2. 心境生成画作（Generative Art）。
              <br/>3. 烦恼粉碎机（情绪释放）。
            </p>
          </div>
        );
      case "guardian":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-800">神 (Spirit)</h3>
            <p className="text-stone-600 leading-relaxed">
              守心神，见众生。冥想与连接的圣地。
              <br/><br/>
              <span className="font-bold">演示要点：</span>
              <br/>1. 一柱心香/命灯视觉冥想。
              <br/>2. 万家灯火（萤火虫模式）共修体验。
              <br/>3. 72小时平安信号机制。
            </p>
          </div>
        );
      case "member":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-800">我 (Self)</h3>
            <p className="text-stone-600 leading-relaxed">
              归本我，藏智慧。沉淀与回顾。
              <br/><br/>
              <span className="font-bold">演示要点：</span>
              <br/>1. 个人命理结构档案。
              <br/>2. 万物藏经（知识库）。
              <br/>3. 灵犀手账与历史回顾。
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
            <div className="h-full flex flex-col bg-white overflow-hidden relative">
              {/* Video Intro Overlay */}
              <AnimatePresence>
                {showIntro && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-[100] bg-black flex items-center justify-center"
                  >
                    <video
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      onEnded={() => setShowIntro(false)}
                      onClick={() => setShowIntro(false)} // Allow skipping on click
                    >
                      <source src="/videos/intro.mp4" type="video/mp4" />
                    </video>
                    
                    {/* Skip Button (Optional, for better UX) */}
                    <button 
                      onClick={() => setShowIntro(false)}
                      className="absolute bottom-8 right-8 text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors z-10"
                    >
                      Skip
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1 overflow-hidden relative">
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'guardian' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <GuardianPage />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'insight' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <LingxiPage />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'ritual' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <RitualPage />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'merit' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <MeritPage />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'member' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <MemberPage onNavigate={setActiveTab} />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'today_image' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <TodayImagePage onBack={() => setActiveTab('member')} onNavigate={setActiveTab} />
                </div>
                <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'library' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
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

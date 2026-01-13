import { BottomNav } from "@/components/BottomNav";
import { MobileSimulator } from "@/components/MobileSimulator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Github } from "lucide-react";
import { useState } from "react";
import CheckInPage from "./app/CheckInPage";
import LingxiPage from "./app/LingxiPage";
import MemberPage from "./app/MemberPage";
import StatusPage from "./app/StatusPage";

export default function Home() {
  const [activeTab, setActiveTab] = useState("checkin");

  // No renderContent needed anymore

  const getGuideText = () => {
    switch (activeTab) {
      case "checkin":
        return {
          title: "极简签到",
          desc: "无压力的习惯养成。点击签到按钮，感受色彩的变化与成就感的累积。本地存储确保数据隐私。",
          highlight: "尝试点击签到按钮"
        };
      case "lingxi":
        return {
          title: "每日灵犀",
          desc: "每天 5 次灵感获取机会，创造稀缺感。Mock 数据展示了未来可能接入的 AI 推荐系统。",
          highlight: "点击获取灵感，观察次数变化"
        };
      case "status":
        return {
          title: "状态记录",
          desc: "三态记录（好/一般/差）+ 备注。颜色编码让情绪趋势一目了然。支持历史记录回溯。",
          highlight: "选择状态并保存一条记录"
        };
      case "member":
        return {
          title: "会员体系",
          desc: "清晰的商业模式展示。通过模拟开关体验免费与会员用户的界面差异。",
          highlight: "切换订阅开关查看变化"
        };
      default:
        return { title: "", desc: "", highlight: "" };
    }
  };

  const guide = getGuideText();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navbar */}
      <nav className="w-full py-6 px-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <img src="/images/app_icon.png" alt="Wanwu Logo" className="w-10 h-10 rounded-xl shadow-sm" />
          <span className="text-xl font-serif font-bold tracking-tight">Wanwu</span>
        </div>
        <a 
          href="https://github.com/herohuhu666/wanwu-app" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
        >
          <Github className="w-5 h-5" />
          <span>GitHub</span>
        </a>
      </nav>

      <main className="flex-1 container mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 py-12 relative z-10">
        
        {/* Left Side: Simulator */}
        <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Decorative Elements */}
          <div className="absolute -left-20 top-20 w-40 h-40 bg-wanwu-green/10 rounded-full blur-3xl" />
          <div className="absolute -right-20 bottom-20 w-40 h-40 bg-wanwu-orange/10 rounded-full blur-3xl" />
          
          <MobileSimulator className="shadow-2xl shadow-black/20">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden relative bg-white">
                <div className={cn("w-full h-full", activeTab === "checkin" ? "block" : "hidden")}>
                  <CheckInPage />
                </div>
                <div className={cn("w-full h-full", activeTab === "lingxi" ? "block" : "hidden")}>
                  <LingxiPage />
                </div>
                <div className={cn("w-full h-full", activeTab === "status" ? "block" : "hidden")}>
                  <StatusPage />
                </div>
                <div className={cn("w-full h-full", activeTab === "member" ? "block" : "hidden")}>
                  <MemberPage />
                </div>
              </div>
              <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </MobileSimulator>
        </div>

        {/* Right Side: Guide & Info */}
        <div className="max-w-md text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Interactive Demo
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-medium leading-tight mb-6">
              数字禅意<br/>
              <span className="text-gray-400">记录万物</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              万物 App 是一个极简的生活记录工具。
              <br/>
              没有复杂的社交，没有焦虑的推送。
              <br/>
              只有你，和当下的状态。
            </p>
          </div>

          {/* Dynamic Guide Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 p-6 rounded-2xl shadow-sm transition-all duration-500">
            <h3 className="text-xl font-serif font-medium mb-2 text-primary transition-all duration-300">
              {guide.title}
            </h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed transition-all duration-300 min-h-[3rem]">
              {guide.desc}
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-wanwu-purple bg-wanwu-purple/5 px-4 py-3 rounded-lg">
              <ArrowRight className="w-4 h-4 animate-bounce-x" />
              {guide.highlight}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 h-12 text-base shadow-lg shadow-black/10 transition-transform hover:scale-105 active:scale-95">
              下载 iOS 演示版
            </Button>
            <Button variant="outline" className="rounded-full px-8 h-12 text-base border-gray-300 hover:bg-gray-50 transition-transform hover:scale-105 active:scale-95">
              查看技术文档
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm text-gray-400 z-10">
        <p>© 2026 Wanwu App. Designed with Zen.</p>
      </footer>
    </div>
  );
}

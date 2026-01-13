import { cn } from "@/lib/utils";
import { Calendar, Crown, Lightbulb, PenTool } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "checkin", label: "签到", icon: Calendar },
    { id: "lingxi", label: "灵犀", icon: Lightbulb },
    { id: "status", label: "状态", icon: PenTool },
    { id: "member", label: "会员", icon: Crown },
  ];

  return (
    <div className="h-16 bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors duration-200"
          >
            <Icon
              className={cn(
                "w-6 h-6 transition-all duration-200",
                isActive ? "text-black scale-110" : "text-gray-400"
              )}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className={cn(
                "text-[10px] font-medium transition-colors duration-200",
                isActive ? "text-black" : "text-gray-400"
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

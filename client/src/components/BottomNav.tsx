import { Sun, Eye, Hexagon, BookOpen, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'today_image', icon: Sun, label: '观象' },
    { id: 'ritual', icon: Hexagon, label: '积善' },
    { id: 'insight', icon: Eye, label: '问心' },
    { id: 'guardian', icon: BookOpen, label: '入定' },
    { id: 'member', icon: User, label: '本我' },
  ];

  return (
    <div className="h-20 bg-white border-t border-stone-100 flex items-center justify-around px-2 pb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
              isActive ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
            <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

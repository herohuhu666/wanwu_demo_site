import { useEffect, useState } from "react";
import { Compass, Sprout, Sparkles, Flame, Fingerprint } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // alpha is the compass heading in degrees (0-360)
        // We invert it so the compass points 'north' relative to the device
        setHeading(360 - event.alpha);
      }
    };

    // Check if DeviceOrientationEvent is supported
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const tabs = [
    { id: 'today_image', icon: Compass, label: '观象' },
    { id: 'guardian', icon: Flame, label: '守望' },
    { id: 'ritual', icon: Sprout, label: '乾坤' },
    { id: 'insight', icon: Sparkles, label: '问心' },
    { id: 'member', icon: Fingerprint, label: '本我' },
  ];

  return (
    <div className="h-20 bg-white border-t border-stone-100 flex items-center justify-around px-2 pb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isCompass = tab.id === 'today_image';
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
              isActive ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <div 
              style={isCompass ? { 
                transform: `rotate(${heading}deg)`,
                transition: 'transform 0.3s ease-out'
              } : undefined}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
            </div>
            <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

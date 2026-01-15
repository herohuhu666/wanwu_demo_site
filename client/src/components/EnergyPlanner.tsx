import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Activity, Zap, Droplets, Flame, Mountain, Wind } from "lucide-react";
import { WuXing } from "@/lib/numerology";

interface DailyEnergy {
  date: string;
  dayName: string;
  energyLevel: number; // 0-100
  dominantElement: WuXing;
  recommendation: string;
  avoid: string;
}

export default function EnergyPlanner() {
  const [forecast, setForecast] = useState<DailyEnergy[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(0);

  useEffect(() => {
    // Simulate 7-day forecast generation based on "cosmic energy"
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const today = new Date();
    const generatedForecast: DailyEnergy[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Pseudo-random energy generation seeded by date (in real app, use numerology algo)
      const seed = date.getDate() + date.getMonth();
      const energyLevel = 40 + (seed * 7) % 60; 
      
      const elements: WuXing[] = ['wood', 'fire', 'earth', 'metal', 'water'];
      const dominantElement = elements[seed % 5];
      
      let rec = "", avo = "";
      switch(dominantElement) {
        case 'wood': rec = "创意、规划、生长"; avo = "争执、砍伐"; break;
        case 'fire': rec = "演讲、社交、行动"; avo = "冲动、熬夜"; break;
        case 'earth': rec = "复盘、静坐、包容"; avo = "变动、搬迁"; break;
        case 'metal': rec = "决策、清理、决断"; avo = "纠结、拖延"; break;
        case 'water': rec = "思考、独处、滋养"; avo = "泛滥、沉溺"; break;
      }

      generatedForecast.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        dayName: i === 0 ? '今日' : days[date.getDay()],
        energyLevel,
        dominantElement,
        recommendation: rec,
        avoid: avo
      });
    }
    setForecast(generatedForecast);
  }, []);

  if (forecast.length === 0) return null;

  const getElementColor = (el: WuXing) => {
    switch(el) {
      case 'wood': return 'text-emerald-600 bg-emerald-600';
      case 'fire': return 'text-rose-500 bg-rose-500';
      case 'earth': return 'text-amber-600 bg-amber-600';
      case 'metal': return 'text-slate-500 bg-slate-500';
      case 'water': return 'text-sky-600 bg-sky-600';
    }
  };

  const getElementIcon = (el: WuXing) => {
    switch(el) {
      case 'wood': return Wind;
      case 'fire': return Flame;
      case 'earth': return Mountain;
      case 'metal': return Zap;
      case 'water': return Droplets;
    }
  };

  const currentDay = forecast[selectedDay];
  const CurrentIcon = getElementIcon(currentDay.dominantElement);
  const currentColorClass = getElementColor(currentDay.dominantElement);
  const textColor = currentColorClass.split(' ')[0];
  const bgColor = currentColorClass.split(' ')[1];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-stone-400" />
          <h3 className="font-serif font-bold text-stone-800">能量日程表</h3>
        </div>
        <span className="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-full">未来7天趋势</span>
      </div>

      {/* Energy Waveform Visualization */}
      <div className="h-32 flex items-end justify-between gap-2 mb-8 relative">
        {/* Background Grid */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="w-full h-px bg-stone-100 border-t border-dashed border-stone-200"></div>
          <div className="w-full h-px bg-stone-100 border-t border-dashed border-stone-200"></div>
          <div className="w-full h-px bg-stone-100 border-t border-dashed border-stone-200"></div>
        </div>

        {forecast.map((day, index) => {
          const isSelected = selectedDay === index;
          const elColor = getElementColor(day.dominantElement).split(' ')[1];
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center gap-2 flex-1 cursor-pointer group"
              onClick={() => setSelectedDay(index)}
            >
              <div className="relative w-full flex justify-center h-24 items-end">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${day.energyLevel}%` }}
                  className={`w-2 rounded-t-full transition-all duration-300 ${isSelected ? elColor : 'bg-stone-200 group-hover:bg-stone-300'}`}
                />
                {isSelected && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${elColor}`}
                  />
                )}
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-medium ${isSelected ? 'text-stone-800' : 'text-stone-400'}`}>{day.dayName}</p>
                <p className="text-[9px] text-stone-300 scale-90">{day.date}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Detail Card */}
      <motion.div 
        key={selectedDay}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-stone-50 rounded-xl p-5 border border-stone-100"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${bgColor}`}>
                {currentDay.dominantElement === 'wood' ? '木旺' : 
                 currentDay.dominantElement === 'fire' ? '火旺' :
                 currentDay.dominantElement === 'earth' ? '土旺' :
                 currentDay.dominantElement === 'metal' ? '金旺' : '水旺'}
              </span>
              <span className="text-xs text-stone-500">能量指数 {currentDay.energyLevel}</span>
            </div>
            <h4 className="font-serif text-lg text-stone-800">
              {currentDay.dayName} · {currentDay.recommendation.split('、')[0]}日
            </h4>
          </div>
          <div className={`p-2 rounded-full bg-white shadow-sm ${textColor}`}>
            <CurrentIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">宜 Recommend</p>
            <p className="text-sm text-stone-700 font-medium">{currentDay.recommendation}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">忌 Avoid</p>
            <p className="text-sm text-stone-500">{currentDay.avoid}</p>
          </div>
        </div>

        <button className="w-full mt-4 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-500 hover:bg-stone-100 transition-colors flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>添加到系统日历</span>
        </button>
      </motion.div>
    </div>
  );
}

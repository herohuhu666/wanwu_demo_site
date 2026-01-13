import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckInPage() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [days, setDays] = useState(0);

  const handleCheckIn = () => {
    if (isCheckedIn) {
      toast.info("今天已签到过了");
      return;
    }
    
    setIsCheckedIn(true);
    setDays(prev => prev + 1);
    toast.success("签到成功");
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-white">
      <h2 className="text-2xl font-serif font-medium mb-12 text-primary">每日签到</h2>
      
      <div 
        className={cn(
          "w-40 h-40 rounded-full flex items-center justify-center mb-8 transition-all duration-700 ease-out cursor-pointer",
          isCheckedIn 
            ? "bg-wanwu-green shadow-[0_0_30px_rgba(74,124,89,0.3)] scale-105" 
            : "bg-gray-100 hover:bg-gray-200"
        )}
        onClick={!isCheckedIn ? handleCheckIn : undefined}
      >
        {isCheckedIn ? (
          <Check className="w-20 h-20 text-white animate-in zoom-in duration-500" />
        ) : (
          <div className="w-20 h-20 rounded-full border-4 border-gray-300" />
        )}
      </div>

      <p className="text-lg font-medium mb-2">
        {isCheckedIn ? "今天已签到" : "今天未签到"}
      </p>
      
      <p className="text-sm text-gray-500 mb-12">
        累计签到 <span className="font-bold text-black">{days}</span> 天
      </p>

      {!isCheckedIn && (
        <Button 
          onClick={handleCheckIn}
          className="w-full max-w-[200px] bg-black hover:bg-gray-800 text-white rounded-full h-12 text-base transition-all duration-300 hover:scale-105 active:scale-95"
        >
          签到
        </Button>
      )}
    </div>
  );
}

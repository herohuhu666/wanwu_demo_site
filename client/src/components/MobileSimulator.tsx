import { cn } from "@/lib/utils";
import { Battery, Signal, Wifi } from "lucide-react";
import React from "react";

interface MobileSimulatorProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileSimulator({ children, className }: MobileSimulatorProps) {
  return (
    <div className={cn("mobile-frame", className)}>
      <div className="mobile-notch"></div>
      <div className="mobile-screen flex flex-col">
        {/* Status Bar */}
        <div className="h-12 w-full bg-white flex items-center justify-between px-6 pt-2 z-10 select-none">
          <span className="text-xs font-medium text-black">9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-black" />
            <Wifi className="w-3.5 h-3.5 text-black" />
            <Battery className="w-4 h-4 text-black" />
          </div>
        </div>
        
        {/* App Content */}
        <div className="flex-1 overflow-hidden relative bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

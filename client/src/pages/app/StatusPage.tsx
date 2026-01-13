import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

type StatusType = "好" | "一般" | "差";

interface Log {
  id: string;
  status: StatusType;
  note: string;
  timestamp: Date;
}

const STATUS_COLORS = {
  "好": "bg-wanwu-green border-wanwu-green text-white",
  "一般": "bg-wanwu-orange border-wanwu-orange text-white",
  "差": "bg-wanwu-red border-wanwu-red text-white",
};

const STATUS_COLORS_OUTLINE = {
  "好": "text-wanwu-green border-wanwu-green hover:bg-wanwu-green/5",
  "一般": "text-wanwu-orange border-wanwu-orange hover:bg-wanwu-orange/5",
  "差": "text-wanwu-red border-wanwu-red hover:bg-wanwu-red/5",
};

export default function StatusPage() {
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("好");
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState<Log[]>([]);

  const handleSave = () => {
    if (!note.trim()) {
      toast.error("请输入备注");
      return;
    }

    const newLog: Log = {
      id: Date.now().toString(),
      status: selectedStatus,
      note,
      timestamp: new Date(),
    };

    setLogs([newLog, ...logs]);
    setNote("");
    setSelectedStatus("好");
    toast.success("记录已保存");
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-serif font-medium text-center">状态记录</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">状态</label>
              <div className="flex gap-2">
                {(["好", "一般", "差"] as StatusType[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                      selectedStatus === status
                        ? STATUS_COLORS[status]
                        : STATUS_COLORS_OUTLINE[status]
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">备注</label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="输入今天的感受或想法"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>

            <Button 
              onClick={handleSave}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              保存
            </Button>
          </div>

          {/* History Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3 ml-1">
              历史记录 ({logs.length})
            </h3>
            
            {logs.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                暂无记录
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div 
                    key={log.id}
                    className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-300"
                    style={{ borderLeftWidth: '4px', borderLeftColor: log.status === '好' ? '#4a7c59' : log.status === '一般' ? '#d48c46' : '#c05746' }}
                  >
                    <div className="flex justify-between items-center">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded text-white",
                        log.status === '好' ? 'bg-wanwu-green' : log.status === '一般' ? 'bg-wanwu-orange' : 'bg-wanwu-red'
                      )}>
                        {log.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {format(log.timestamp, "MM-dd HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{log.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

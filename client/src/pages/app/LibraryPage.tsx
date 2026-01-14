import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, ChevronLeft } from "lucide-react";
import { HEXAGRAMS } from "@/lib/hexagrams_data";
import { Link } from "wouter";

interface LibraryPageProps {
  onBack?: () => void;
}

export default function LibraryPage({ onBack }: LibraryPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHexagram, setSelectedHexagram] = useState<number | null>(null);

  const filteredHexagrams = HEXAGRAMS.filter(h => 
    h.name.includes(searchTerm) || 
    h.nature.includes(searchTerm) ||
    h.keywords.some(k => k.includes(searchTerm))
  );

  const currentHexagram = selectedHexagram ? HEXAGRAMS.find(h => h.id === selectedHexagram) : null;

  return (
    <div className="h-full flex flex-col relative overflow-hidden font-serif text-[#2C2C2C] bg-[#FAF9F6]">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" 
           style={{ backgroundImage: 'url(/images/paper_texture.jpg)' }} />
      
      {/* Header */}
      <div className="relative z-20 px-6 pt-12 pb-4 bg-gradient-to-b from-[#FAF9F6] to-[#FAF9F6]/90 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <button 
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-[#2C2C2C]/5 flex items-center justify-center hover:bg-[#2C2C2C]/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#2C2C2C]" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-medium tracking-[0.2em] font-kai">藏经阁</h1>
              <p className="text-[10px] text-[#8C8478] tracking-[0.3em] uppercase mt-1">Library</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#2C2C2C]/5 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#2C2C2C]/60" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8478]" />
          <input 
            type="text"
            placeholder="搜索卦名 / 关键词..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/50 border border-[#2C2C2C]/10 rounded-full py-3 pl-12 pr-4 text-sm tracking-wide focus:outline-none focus:border-[#789262]/50 transition-colors placeholder:text-[#8C8478]/50"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10 scrollbar-hide">
        <AnimatePresence mode="wait">
          {selectedHexagram && currentHexagram ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="min-h-full"
            >
              <button 
                onClick={() => setSelectedHexagram(null)}
                className="flex items-center gap-1 text-xs text-[#8C8478] mb-6 hover:text-[#2C2C2C] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> 返回列表
              </button>

              <div className="bg-white/60 rounded-3xl p-8 border border-[#2C2C2C]/5 shadow-sm">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4 font-serif text-[#2C2C2C]">{currentHexagram.symbol}</div>
                  <h2 className="text-3xl font-kai tracking-[0.2em] mb-2">{currentHexagram.name}</h2>
                  <p className="text-sm text-[#8C8478] tracking-widest">{currentHexagram.nature}</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-bold text-[#789262] tracking-widest uppercase mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#789262] rounded-full"/> 卦辞
                    </h3>
                    <p className="text-sm leading-loose text-[#2C2C2C]/90 font-kai text-justify">
                      {currentHexagram.judgment}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#789262] tracking-widest uppercase mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#789262] rounded-full"/> 象曰
                    </h3>
                    <p className="text-sm leading-loose text-[#2C2C2C]/80 text-justify">
                      {currentHexagram.image}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#2C2C2C]/5">
                    <div className="flex flex-wrap gap-2">
                      {currentHexagram.keywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-[#2C2C2C]/5 rounded-full text-[10px] tracking-wider text-[#2C2C2C]/70">
                          {kw}
                        </span>
                      ))}
                      <span className="px-3 py-1 bg-[#789262]/10 rounded-full text-[10px] tracking-wider text-[#789262]">
                        五行：{currentHexagram.element === 'metal' ? '金' : 
                               currentHexagram.element === 'wood' ? '木' : 
                               currentHexagram.element === 'water' ? '水' : 
                               currentHexagram.element === 'fire' ? '火' : '土'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {filteredHexagrams.map((hex) => (
                <motion.button
                  key={hex.id}
                  onClick={() => setSelectedHexagram(hex.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/60 p-4 rounded-2xl border border-[#2C2C2C]/5 hover:border-[#789262]/30 transition-colors text-left group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl text-[#2C2C2C]/80 group-hover:text-[#2C2C2C] transition-colors">{hex.symbol}</span>
                    <span className="text-[10px] text-[#8C8478] border border-[#8C8478]/20 px-1.5 py-0.5 rounded-full">
                      {hex.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-kai tracking-widest text-[#2C2C2C] mb-1">{hex.name}</h3>
                  <p className="text-[10px] text-[#8C8478] truncate">{hex.nature}</p>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}



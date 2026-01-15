import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LifeParameters, 
  UserCoreStructure, 
  FirstHexagram, 
  MeritRecord, 
  InsightRecord
} from '@/lib/types';
import { HEXAGRAM_KNOWLEDGE_BASE, getHexagram } from '@/lib/knowledge_base';

// Types
export type DailyState = 'steady' | 'advance' | 'retreat'; // 稳 | 进 | 收
export type EnergyLevel = 'low' | 'medium' | 'high';
export type SleepQuality = 'poor' | 'fair' | 'good';

export interface RitualRecord {
  id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  isDeep: boolean;
}

interface UserContextType {
  isLoggedIn: boolean;
  isMember: boolean;
  profile: LifeParameters;
  coreStructure: UserCoreStructure | null;
  firstHexagram: FirstHexagram | null;
  merit: number;
  meritHistory: MeritRecord[];
  dailyRecord: any | null;
  insightCount: number; // 今日已用免费次数
  insightHistory: InsightRecord[];
  ritualHistory: RitualRecord[];
  archives: any[];
  lastGuardianTime: number | null; // Timestamp of last guardian check-in
  
  login: (profile: LifeParameters) => void;
  logout: () => void;
  toggleMember: () => void;
  addMerit: (amount: number, type: MeritRecord['type'], desc: string) => void;
  consumeMerit: (amount: number, desc: string) => boolean;
  submitDailyRecord: (state: DailyState, energy: EnergyLevel, sleep: SleepQuality) => void;
  addInsightRecord: (record: Omit<InsightRecord, 'id' | 'timestamp'>) => void;
  addRitualRecord: (record: Omit<RitualRecord, 'id' | 'date'>) => void;
  checkInsightAvailability: () => { available: boolean; reason: 'free' | 'merit' | 'member' | 'none' };
  guardianCheckIn: () => { success: boolean; reward: number; message: string };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper to generate deterministic hash
const simpleHash = (str: string | undefined | null): number => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [profile, setProfile] = useState<LifeParameters>({
    nickname: "",
    birthDate: "",
    birthTime: "",
    birthCity: ""
  });
  const [coreStructure, setCoreStructure] = useState<UserCoreStructure | null>(null);
  const [firstHexagram, setFirstHexagram] = useState<FirstHexagram | null>(null);
  
  const [merit, setMerit] = useState(108);
  const [meritHistory, setMeritHistory] = useState<MeritRecord[]>([]);
  
  const [dailyRecord, setDailyRecord] = useState<any | null>(null);
  const [insightCount, setInsightCount] = useState(0);
  const [insightHistory, setInsightHistory] = useState<InsightRecord[]>([]);
  const [ritualHistory, setRitualHistory] = useState<RitualRecord[]>([]);
  const [lastGuardianTime, setLastGuardianTime] = useState<number | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('wanwu_profile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setIsLoggedIn(true);
      
      // Regenerate core structure if missing but profile exists
      const savedCore = localStorage.getItem('wanwu_core_structure');
      if (savedCore) {
        setCoreStructure(JSON.parse(savedCore));
      } else {
        generateCoreEngine(parsedProfile);
      }

      const savedFirstHex = localStorage.getItem('wanwu_first_hexagram');
      if (savedFirstHex) {
        setFirstHexagram(JSON.parse(savedFirstHex));
      }
    }
    
    const savedMerit = localStorage.getItem('wanwu_merit');
    if (savedMerit) setMerit(parseInt(savedMerit));

    const savedMeritHistory = localStorage.getItem('wanwu_merit_history');
    if (savedMeritHistory) setMeritHistory(JSON.parse(savedMeritHistory));

    const savedLastGuardian = localStorage.getItem('wanwu_last_guardian');
    if (savedLastGuardian) setLastGuardianTime(parseInt(savedLastGuardian));

    const today = new Date().toDateString();
    const savedInsightCount = localStorage.getItem('wanwu_insight_count_' + today);
    if (savedInsightCount) setInsightCount(parseInt(savedInsightCount));

    const savedInsightHistory = localStorage.getItem('wanwu_insight_history');
    if (savedInsightHistory) setInsightHistory(JSON.parse(savedInsightHistory));

    const savedRitualHistory = localStorage.getItem('wanwu_ritual_history');
    if (savedRitualHistory) setRitualHistory(JSON.parse(savedRitualHistory));
    
    const savedMember = localStorage.getItem('wanwu_is_member');
    if (savedMember) setIsMember(JSON.parse(savedMember));
  }, []);

  // Core Engine Logic
  const generateCoreEngine = (p: LifeParameters) => {
    const seed = simpleHash(p.nickname || '') + simpleHash(p.birthDate || '') + simpleHash(p.birthCity || '');
    
    // 1. Generate Core Structure
    const lifeHexagramId = (seed % 9) + 1; // 1-9
    const hexNames = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤', '中'];
    const lifeHexagramName = hexNames[lifeHexagramId - 1];
    
    const elements = {
      wood: (seed % 40) + 10,
      fire: ((seed >> 2) % 40) + 10,
      earth: ((seed >> 4) % 40) + 10,
      metal: ((seed >> 6) % 40) + 10,
      water: 0
    };
    elements.water = Math.max(0, 100 - (elements.wood + elements.fire + elements.earth + elements.metal));

    const cultivationTypes = ['守心', '稳行', '自省', '顺势', '精进', '清明'] as const;
    const cultivationAxis = cultivationTypes[seed % 6];

    const temperamentTypes = ['偏动', '偏静', '偏稳', '偏刚', '偏柔'] as const;
    const temperament = temperamentTypes[seed % 5];

    const newCore: UserCoreStructure = {
      lifeHexagram: lifeHexagramId,
      lifeHexagramName,
      elements,
      cultivationAxis,
      temperament
    };
    setCoreStructure(newCore);
    localStorage.setItem('wanwu_core_structure', JSON.stringify(newCore));

    // 2. Generate First Hexagram (Only if not exists)
    if (!localStorage.getItem('wanwu_first_hexagram')) {
      const hexId = (seed % 64) + 1;
      const statusSeed = seed % 3;
      const status = statusSeed === 0 ? '平' : statusSeed === 1 ? '吉' : '慎';
      
      // Get data from Knowledge Base
      const kbData = getHexagram(hexId);
      
      const newFirstHex: FirstHexagram = {
        id: hexId,
        name: kbData.name,
        status: status, // Override KB status with user-specific seed status for variety? Or stick to KB?
                        // Requirement says: 状态 = seed % 3. So we use calculated status.
        advice: status === '吉' ? kbData.advice.ji : status === '平' ? kbData.advice.ping : kbData.advice.shen,
        action: kbData.action
      };
      setFirstHexagram(newFirstHex);
      localStorage.setItem('wanwu_first_hexagram', JSON.stringify(newFirstHex));
      
      // Award merit for first generation
      addMerit(3, 'first_ritual', '初次立命');
    }
  };

  // Actions
  const login = (newProfile: LifeParameters) => {
    setProfile(newProfile);
    setIsLoggedIn(true);
    localStorage.setItem('wanwu_profile', JSON.stringify(newProfile));
    generateCoreEngine(newProfile);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setProfile({ nickname: "", birthDate: "", birthTime: "", birthCity: "" });
    setCoreStructure(null);
    setFirstHexagram(null);
    localStorage.removeItem('wanwu_profile');
    localStorage.removeItem('wanwu_core_structure');
    // We keep first hexagram in storage to persist "Once per user" logic if they relogin with same details?
    // For simplicity, we clear it on logout to allow demo reset.
    localStorage.removeItem('wanwu_first_hexagram');
  };

  const toggleMember = () => {
    const newState = !isMember;
    setIsMember(newState);
    localStorage.setItem('wanwu_is_member', JSON.stringify(newState));
  };

  const addMerit = (amount: number, type: MeritRecord['type'], desc: string) => {
    setMerit(prev => {
      const newVal = prev + amount;
      localStorage.setItem('wanwu_merit', newVal.toString());
      return newVal;
    });
    
    const newRecord: MeritRecord = {
      id: Date.now().toString(),
      type,
      amount,
      timestamp: Date.now(),
      desc
    };
    setMeritHistory(prev => {
      const newHistory = [newRecord, ...prev];
      localStorage.setItem('wanwu_merit_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const consumeMerit = (amount: number, desc: string) => {
    if (merit >= amount) {
      setMerit(prev => {
        const newVal = prev - amount;
        localStorage.setItem('wanwu_merit', newVal.toString());
        return newVal;
      });
      
      const newRecord: MeritRecord = {
        id: Date.now().toString(),
        type: 'consume',
        amount: -amount,
        timestamp: Date.now(),
        desc
      };
      setMeritHistory(prev => {
        const newHistory = [newRecord, ...prev];
        localStorage.setItem('wanwu_merit_history', JSON.stringify(newHistory));
        return newHistory;
      });
      return true;
    }
    return false;
  };

  const submitDailyRecord = (state: DailyState, energy: EnergyLevel, sleep: SleepQuality) => {
    const record = {
      date: new Date().toDateString(),
      state,
      energy,
      sleep,
      completed: true
    };
    setDailyRecord(record);
    localStorage.setItem('wanwu_daily_' + new Date().toDateString(), JSON.stringify(record));
    addMerit(5, 'reflection', '每日自省');
  };

  const addInsightRecord = (recordData: Omit<InsightRecord, 'id' | 'timestamp'>) => {
    const newRecord: InsightRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...recordData
    };
    
    const newHistory = [newRecord, ...insightHistory];
    setInsightHistory(newHistory);
    localStorage.setItem('wanwu_insight_history', JSON.stringify(newHistory));

    // Update daily count if not member
    if (!isMember) {
      const newCount = insightCount + 1;
      setInsightCount(newCount);
      localStorage.setItem('wanwu_insight_count_' + new Date().toDateString(), newCount.toString());
    }
    
    // First insight reward
    if (insightHistory.length === 0) {
      addMerit(3, 'first_insight', '初次灵犀');
    }
  };

  const addRitualRecord = (recordData: Omit<RitualRecord, 'id' | 'date'>) => {
    const newRecord: RitualRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...recordData
    };
    
    const newHistory = [newRecord, ...ritualHistory];
    setRitualHistory(newHistory);
    localStorage.setItem('wanwu_ritual_history', JSON.stringify(newHistory));
  };

  const checkInsightAvailability = (): { available: boolean; reason: 'free' | 'merit' | 'member' | 'none' } => {
    if (isMember) return { available: true, reason: 'member' };
    if (insightCount < 3) return { available: true, reason: 'free' };
    if (merit >= 50) return { available: true, reason: 'merit' };
    return { available: false, reason: 'none' };
  };

  const guardianCheckIn = (): { success: boolean; reward: number; message: string } => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const timeVal = hour * 60 + minutes;
    
    // 08:30 = 8*60 + 30 = 510
    if (timeVal < 510) {
      return { success: false, reward: 0, message: "未到点亮时间 (08:30 - 24:00)" };
    }

    // Check if already checked in today
    if (lastGuardianTime) {
      const lastDate = new Date(lastGuardianTime).toDateString();
      if (lastDate === now.toDateString()) {
        return { success: false, reward: 0, message: "今日已点亮" };
      }
    }

    // Success
    setLastGuardianTime(Date.now());
    localStorage.setItem('wanwu_last_guardian', Date.now().toString());
    addMerit(2, 'guardian', '守望点亮');
    
    return { success: true, reward: 2, message: "点亮成功，功德+2" };
  };

  return (
    <UserContext.Provider value={{
      isLoggedIn,
      isMember,
      profile,
      coreStructure,
      firstHexagram,
      merit,
      meritHistory,
      dailyRecord,
      insightCount,
      insightHistory,
      ritualHistory,
      archives: [
        ...insightHistory.map(h => ({ ...h, type: 'insight', title: h.question, content: h.answer })),
        ...ritualHistory.map(h => ({ ...h, type: 'ritual', title: h.title, content: h.content })),
      ],
      lastGuardianTime,
      login,
      logout,
      toggleMember,
      addMerit,
      consumeMerit,
      submitDailyRecord,
      addInsightRecord,
      addRitualRecord,
      checkInsightAvailability,
      guardianCheckIn
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

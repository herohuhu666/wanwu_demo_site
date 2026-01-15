import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LifeParameters, 
  UserCoreStructure, 
  FirstHexagram, 
  MeritRecord, 
  InsightRecord,
  ElementType,
  RitualRecord
} from '@/lib/types';
import { HEXAGRAM_KNOWLEDGE_BASE, getHexagram } from '@/lib/knowledge_base';

// Types
export type DailyState = 'steady' | 'advance' | 'retreat'; // 稳 | 进 | 收
export type EnergyLevel = 'low' | 'medium' | 'high';
export type SleepQuality = 'poor' | 'fair' | 'good';

interface UserContextType {
  isLoggedIn: boolean;
  isMember: boolean;
  profile: LifeParameters;
  coreStructure: UserCoreStructure | null;
  firstHexagram: FirstHexagram | null;
  merit: number;
  meritHistory: MeritRecord[];
  dailyRecord: any | null;
  insightCount: number;
  insightHistory: InsightRecord[];
  ritualHistory: RitualRecord[];
  archives: (RitualRecord | InsightRecord)[];
  lastGuardianTime: number | null;
  
  login: (params: LifeParameters) => void;
  logout: () => void;
  toggleMember: () => void;
  addMerit: (amount: number, type: MeritRecord['type'], desc: string) => void;
  consumeMerit: (amount: number, desc: string) => boolean;
  submitDailyRecord: (state: DailyState, energy: EnergyLevel, sleep: SleepQuality) => void;
  addInsightRecord: (record: Omit<InsightRecord, 'id' | 'timestamp'>) => void;
  addRitualRecord: (record: Omit<RitualRecord, 'id' | 'date'>) => void;
  checkInsightAvailability: () => { available: boolean; reason: 'free' | 'merit' | 'member' | 'none' };
  guardianCheckIn: () => { success: boolean; reward: number; message: string };
  updateEnergyState: (action: 'guardian_early' | 'guardian_late' | 'ritual_late' | 'ritual_frequent' | 'merit_gain') => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper to generate deterministic hash
const simpleHash = (str: string): number => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export function UserProvider({ children }: { children: React.ReactNode }) {
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
        const parsedCore = JSON.parse(savedCore);
        // Migration: Ensure currentEnergy exists
        if (!parsedCore.currentEnergy && parsedCore.elements) {
          parsedCore.currentEnergy = { ...parsedCore.elements };
        }
        setCoreStructure(parsedCore);
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
    if (!p.nickname || !p.birthDate || !p.birthCity) return;

    const seed = simpleHash(p.nickname) + simpleHash(p.birthDate) + simpleHash(p.birthCity);
    
    // 1. Generate Core Structure
    const lifeHexagramId = (seed % 9) + 1; // 1-9
    const hexNames = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤', '中'];
    const lifeHexagramName = hexNames[lifeHexagramId - 1];
    
    const elements = {
      wood: (seed % 40) + 10,
      fire: ((seed >> 2) % 40) + 10,
      earth: ((seed >> 4) % 40) + 10,
      metal: ((seed >> 6) % 40) + 10,
      water: ((seed >> 8) % 40) + 10,
    };
    
    // Normalize to 100%
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    (Object.keys(elements) as ElementType[]).forEach(key => {
      elements[key] = Math.round((elements[key] / total) * 100);
    });

    const cultivationTypes = ['守心', '稳行', '自省', '顺势', '精进', '清明'] as const;
    const cultivationAxis = cultivationTypes[seed % 6];

    const temperamentTypes = ['偏动', '偏静', '偏稳', '偏刚', '偏柔'] as const;
    const temperament = temperamentTypes[seed % 5];

    const newCore: UserCoreStructure = {
      lifeHexagram: lifeHexagramId,
      lifeHexagramName,
      elements,
      currentEnergy: { ...elements },
      cultivationAxis,
      temperament
    };
    setCoreStructure(newCore);
    localStorage.setItem('wanwu_core_structure', JSON.stringify(newCore));

    // 2. Generate First Hexagram (Only once)
    const firstHexId = (seed % 64) + 1;
    const statusTypes = ['平', '吉', '慎'] as const;
    const status = statusTypes[seed % 3];
    
    // Get data from knowledge base
    // HEXAGRAM_KNOWLEDGE_BASE is a Record<number, HexagramData>
    const hexData = HEXAGRAM_KNOWLEDGE_BASE[firstHexId] || HEXAGRAM_KNOWLEDGE_BASE[1];
    
    const newFirstHex: FirstHexagram = {
      id: firstHexId,
      name: hexData.name,
      status: status,
      advice: hexData.judgment,
      action: hexData.action
    };
    setFirstHexagram(newFirstHex);
    localStorage.setItem('wanwu_first_hexagram', JSON.stringify(newFirstHex));
    
    // Initial Merit
    addMerit(3, 'first_ritual', '初次结缘');
  };

  const login = (params: LifeParameters) => {
    setProfile(params);
    setIsLoggedIn(true);
    localStorage.setItem('wanwu_profile', JSON.stringify(params));
    generateCoreEngine(params);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setProfile({ nickname: "", birthDate: "", birthTime: "", birthCity: "" });
    setCoreStructure(null);
    setFirstHexagram(null);
    localStorage.removeItem('wanwu_profile');
    localStorage.removeItem('wanwu_core_structure');
    localStorage.removeItem('wanwu_first_hexagram');
    localStorage.removeItem('wanwu_is_member');
  };

  const toggleMember = () => {
    const newState = !isMember;
    setIsMember(newState);
    localStorage.setItem('wanwu_is_member', JSON.stringify(newState));
  };

  const addMerit = (amount: number, type: MeritRecord['type'], desc: string) => {
    const newMerit = merit + amount;
    setMerit(newMerit);
    localStorage.setItem('wanwu_merit', newMerit.toString());

    const newRecord: MeritRecord = {
      id: Date.now().toString(),
      type,
      amount,
      timestamp: Date.now(),
      desc
    };
    const newHistory = [newRecord, ...meritHistory];
    setMeritHistory(newHistory);
    localStorage.setItem('wanwu_merit_history', JSON.stringify(newHistory));
    
    // Energy feedback
    updateEnergyState('merit_gain');
  };

  const consumeMerit = (amount: number, desc: string) => {
    if (merit < amount) return false;
    
    const newMerit = merit - amount;
    setMerit(newMerit);
    localStorage.setItem('wanwu_merit', newMerit.toString());

    const newRecord: MeritRecord = {
      id: Date.now().toString(),
      type: 'consume',
      amount: -amount,
      timestamp: Date.now(),
      desc
    };
    const newHistory = [newRecord, ...meritHistory];
    setMeritHistory(newHistory);
    localStorage.setItem('wanwu_merit_history', JSON.stringify(newHistory));
    return true;
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
    addMerit(5, 'reflection', '每日自省');
  };

  const addInsightRecord = (record: Omit<InsightRecord, 'id' | 'timestamp'>) => {
    const newRecord: InsightRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    const newHistory = [newRecord, ...insightHistory];
    setInsightHistory(newHistory);
    localStorage.setItem('wanwu_insight_history', JSON.stringify(newHistory));
    
    // Update daily count
    const today = new Date().toDateString();
    const newCount = insightCount + 1;
    setInsightCount(newCount);
    localStorage.setItem('wanwu_insight_count_' + today, newCount.toString());
  };

  const addRitualRecord = (record: Omit<RitualRecord, 'id' | 'date'>) => {
    const newRecord: RitualRecord = {
      ...record,
      id: Date.now().toString(),
      date: Date.now()
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

  const guardianCheckIn = () => {
    const now = Date.now();
    const today = new Date().toDateString();
    
    if (lastGuardianTime) {
      const lastDate = new Date(lastGuardianTime).toDateString();
      if (lastDate === today) {
        return { success: false, reward: 0, message: "今日已点亮" };
      }
    }

    setLastGuardianTime(now);
    localStorage.setItem('wanwu_last_guardian', now.toString());
    addMerit(2, 'guardian', '守望点亮');
    
    return { success: true, reward: 2, message: "点亮成功，功德+2" };
  };

  const updateEnergyState = (action: 'guardian_early' | 'guardian_late' | 'ritual_late' | 'ritual_frequent' | 'merit_gain') => {
    if (!coreStructure) return;

    setCoreStructure(prev => {
      if (!prev) return null;
      const newEnergy = { ...prev.currentEnergy };

      // Energy Logic
      switch (action) {
        case 'guardian_early': // Morning check-in: Boost Wood (Growth) & Fire (Yang)
          newEnergy.wood = Math.min(100, newEnergy.wood + 2);
          newEnergy.fire = Math.min(100, newEnergy.fire + 1);
          break;
        case 'guardian_late': // Late check-in: Stabilize Earth
          newEnergy.earth = Math.min(100, newEnergy.earth + 1);
          break;
        case 'ritual_late': // Late night ritual: Boost Water (Introspection)
          newEnergy.water = Math.min(100, newEnergy.water + 2);
          break;
        case 'ritual_frequent': // Frequent ritual: Boost Metal (Anxiety/Rigidity)
          newEnergy.metal = Math.min(100, newEnergy.metal + 2);
          break;
        case 'merit_gain': // Good deeds: Balance all, Boost Earth
          newEnergy.earth = Math.min(100, newEnergy.earth + 2);
          // Decay extremes slightly
          (Object.keys(newEnergy) as ElementType[]).forEach(key => {
            if (newEnergy[key] > 60) newEnergy[key] -= 1;
          });
          break;
      }

      const newCore = { ...prev, currentEnergy: newEnergy };
      localStorage.setItem('wanwu_core_structure', JSON.stringify(newCore));
      return newCore;
    });
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
      archives: [...ritualHistory.map(r => ({...r, type: 'ritual'})), ...insightHistory.map(i => ({...i, type: 'insight'}))] as any,
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
      guardianCheckIn,
      updateEnergyState
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

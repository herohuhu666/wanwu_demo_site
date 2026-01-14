import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type DailyState = 'steady' | 'advance' | 'retreat'; // 稳 | 进 | 收
export type EnergyLevel = 'low' | 'medium' | 'high';
export type SleepQuality = 'poor' | 'fair' | 'good';

export interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
}

export interface DailyRecord {
  date: string;
  state: DailyState;
  energy: EnergyLevel;
  sleep: SleepQuality;
  completed: boolean;
}

export interface InsightRecord {
  id: string;
  date: string;
  question: string;
  category: string;
  answer: string;
  isDeep: boolean; // 是否为深度解读
}

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
  profile: UserProfile;
  merit: number;
  dailyRecord: DailyRecord | null;
  insightCount: number; // 今日已用免费次数
  insightHistory: InsightRecord[];
  ritualHistory: RitualRecord[];
  archives: any[]; // Combined history for convenience
  
  login: (profile: UserProfile) => void;
  logout: () => void;
  toggleMember: () => void;
  addMerit: (amount: number) => void;
  consumeMerit: (amount: number) => boolean;
  submitDailyRecord: (state: DailyState, energy: EnergyLevel, sleep: SleepQuality) => void;
  addInsightRecord: (record: Omit<InsightRecord, 'id' | 'date'>) => void;
  addRitualRecord: (record: Omit<RitualRecord, 'id' | 'date'>) => void;
  checkInsightAvailability: () => { available: boolean; reason: 'free' | 'merit' | 'member' | 'none' };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthCity: ""
  });
  const [merit, setMerit] = useState(108);
  const [dailyRecord, setDailyRecord] = useState<DailyRecord | null>(null);
  const [insightCount, setInsightCount] = useState(0);
  const [insightHistory, setInsightHistory] = useState<InsightRecord[]>([]);
  const [ritualHistory, setRitualHistory] = useState<RitualRecord[]>([]);

  // Mock: Load from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('wanwu_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setIsLoggedIn(true);
    }
    
    const today = new Date().toDateString();
    const savedDaily = localStorage.getItem('wanwu_daily_' + today);
    if (savedDaily) {
      setDailyRecord(JSON.parse(savedDaily));
    }

    const savedInsightCount = localStorage.getItem('wanwu_insight_count_' + today);
    if (savedInsightCount) {
      setInsightCount(parseInt(savedInsightCount));
    }

    const savedHistory = localStorage.getItem('wanwu_insight_history');
    if (savedHistory) {
      setInsightHistory(JSON.parse(savedHistory));
    }

    const savedRitualHistory = localStorage.getItem('wanwu_ritual_history');
    if (savedRitualHistory) {
      setRitualHistory(JSON.parse(savedRitualHistory));
    }
  }, []);

  // Actions
  const login = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsLoggedIn(true);
    localStorage.setItem('wanwu_profile', JSON.stringify(newProfile));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setProfile({ name: "", birthDate: "", birthTime: "", birthCity: "" });
    localStorage.removeItem('wanwu_profile');
  };

  const toggleMember = () => {
    setIsMember(prev => !prev);
  };

  const addMerit = (amount: number) => {
    setMerit(prev => prev + amount);
  };

  const consumeMerit = (amount: number) => {
    if (merit >= amount) {
      setMerit(prev => prev - amount);
      return true;
    }
    return false;
  };

  const submitDailyRecord = (state: DailyState, energy: EnergyLevel, sleep: SleepQuality) => {
    const record: DailyRecord = {
      date: new Date().toDateString(),
      state,
      energy,
      sleep,
      completed: true
    };
    setDailyRecord(record);
    localStorage.setItem('wanwu_daily_' + new Date().toDateString(), JSON.stringify(record));
    addMerit(2); // Daily check-in merit
  };

  const addInsightRecord = (recordData: Omit<InsightRecord, 'id' | 'date'>) => {
    const newRecord: InsightRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
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

  return (
    <UserContext.Provider value={{
      isLoggedIn,
      isMember,
      profile,
      merit,
      dailyRecord,
      insightCount,
      insightHistory,
      ritualHistory,
      archives: [
        ...insightHistory.map(h => ({ ...h, type: 'insight', title: h.question, content: h.answer })),
        ...ritualHistory.map(h => ({ ...h, type: 'ritual', title: h.title, content: h.content })),
        // Add gift history if implemented later
      ],
      login,
      logout,
      toggleMember,
      addMerit,
      consumeMerit,
      submitDailyRecord,
      addInsightRecord,
      addRitualRecord,
      checkInsightAvailability
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

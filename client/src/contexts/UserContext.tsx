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

interface UserContextType {
  isLoggedIn: boolean;
  isMember: boolean;
  profile: UserProfile;
  merit: number;
  dailyRecord: DailyRecord | null;
  
  login: (profile: UserProfile) => void;
  logout: () => void;
  toggleMember: () => void;
  addMerit: (amount: number) => void;
  submitDailyRecord: (state: DailyState, energy: EnergyLevel, sleep: SleepQuality) => void;
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

  // Mock: Load from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('wanwu_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setIsLoggedIn(true);
    }
    
    const savedDaily = localStorage.getItem('wanwu_daily_' + new Date().toDateString());
    if (savedDaily) {
      setDailyRecord(JSON.parse(savedDaily));
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
    addMerit(1); // Daily check-in merit
  };

  return (
    <UserContext.Provider value={{
      isLoggedIn,
      isMember,
      profile,
      merit,
      dailyRecord,
      login,
      logout,
      toggleMember,
      addMerit,
      submitDailyRecord
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

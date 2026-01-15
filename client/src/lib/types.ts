export type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export type CultivationType = '守心' | '稳行' | '自省' | '顺势' | '精进' | '清明';

export type TemperamentType = '偏动' | '偏静' | '偏稳' | '偏刚' | '偏柔';

export type HexagramStatus = '吉' | '平' | '慎';

export interface LifeParameters {
  nickname: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  birthCity: string;
}

export interface UserCoreStructure {
  lifeHexagram: number; // 1-9 (Bagua + Center)
  lifeHexagramName: string; // 乾 / 兑 / 离 / 震 / 巽 / 坎 / 艮 / 坤 / 中
  elements: Record<ElementType, number>; // Base Percentage (Static)
  currentEnergy: Record<ElementType, number>; // Dynamic Energy State (0-100)
  cultivationAxis: CultivationType;
  temperament: TemperamentType;
}

export interface FirstHexagram {
  id: number; // 1-64
  name: string;
  status: HexagramStatus;
  advice: string; // <= 28 chars
  action: string; // 1 item
}

export interface HexagramData {
  id: number;
  name: string;
  nature: string; // e.g. 天行健
  judgment: string; // 卦意一句话
  status: HexagramStatus;
  advice: {
    ji: string;
    ping: string;
    shen: string;
  };
  recommendations: string[]; // 宜 2-4 items
  taboos: string[]; // 忌 2-4 items
  action: string; // 今日修行动作 1 item
  element: ElementType;
  image: string;
  keywords: string[];
  lines: string[];
}

export interface MeritRecord {
  id: string;
  type: 'check_in' | 'guardian' | 'pray' | 'altruism' | 'reflection' | 'first_ritual' | 'first_insight' | 'consume' | 'wooden_fish';
  amount: number;
  timestamp: number;
  desc: string;
}

export interface InsightRecord {
  id: string;
  category: 'career' | 'relationship' | 'health' | 'emotion' | 'life' | 'random';
  question: string;
  answer: string;
  timestamp: number;
  isDeep: boolean;
}

export interface RitualRecord {
  id: string;
  hexagramId: number;
  hexagramName: string;
  yaos: (0 | 1)[];
  question?: string;
  date: number;
  note?: string;
}

// 命理与卦象核心逻辑库
// 严格遵循《周易》六十四卦与八卦基础体系
// 禁止：预测结果、财运数值、绝对化判断

// 八卦基础数据
export const BAGUA = {
  qian: { name: "乾", nature: "天", element: "金" },
  kun: { name: "坤", nature: "地", element: "土" },
  zhen: { name: "震", nature: "雷", element: "木" },
  xun: { name: "巽", nature: "风", element: "木" },
  kan: { name: "坎", nature: "水", element: "水" },
  li: { name: "离", nature: "火", element: "火" },
  gen: { name: "艮", nature: "山", element: "土" },
  dui: { name: "兑", nature: "泽", element: "金" }
};

// 六十四卦部分数据（示例，实际应包含完整64卦）
// 仅包含：卦名、卦辞（精简）、象曰
export const HEXAGRAMS: Record<number, { name: string; description: string; image: string }> = {
  1: { name: "乾为天", description: "元亨利贞。", image: "天行健，君子以自强不息。" },
  2: { name: "坤为地", description: "元亨，利牝马之贞。", image: "地势坤，君子以厚德载物。" },
  3: { name: "水雷屯", description: "元亨利贞。勿用有筱往。利建侯。", image: "云雷屯，君子以经纶。" },
  4: { name: "山水蒙", description: "亨。匪我求童蒙，童蒙求我。", image: "山下出泉，蒙；君子以果行育德。" },
  5: { name: "水天需", description: "有孚，光亨，贞吉。", image: "云上于天，需；君子以饮食宴乐。" },
  6: { name: "天水讼", description: "有孚，窒惕，中吉，终凶。", image: "天与水违行，讼；君子以作事谋始。" },
  // ... 更多卦象需按需补充，此处为演示核心逻辑
  63: { name: "水火既济", description: "亨小，利贞。初吉终乱。", image: "水在火上，既济；君子以思患而豫防之。" },
  64: { name: "火水未济", description: "亨。小狐汔济，濡其尾，无筱利。", image: "火在水上，未济；君子以慎辨物居方。" }
};

// 五行基础
export type WuXing = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

import { LifeParameters } from './types';

export interface DestinyResult {
  baseHexagram: { id: number; name: string; nature: string }; // 本命卦
  dailyHexagram: { id: number; name: string; nature: string }; // 今日状态卦
  elements: Record<WuXing, number>; // 五行偏向 (0-100)
}

// 简单的哈希函数，用于确定性生成
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// 计算本命卦 (基于生辰)
export function calculateBaseHexagram(params: LifeParameters): { id: number; name: string; nature: string } {
  const seed = `${params.nickname}-${params.birthDate}-${params.birthTime}`;
  const hash = simpleHash(seed);
  // 映射到 1-64
  const hexagramId = (hash % 64) + 1;
  const hexagram = HEXAGRAMS[hexagramId] || HEXAGRAMS[1]; // Fallback to Qian
  
  return {
    id: hexagramId,
    name: hexagram.name,
    nature: hexagram.image
  };
}

// 计算今日状态卦 (基于本命 + 今日日期)
export function calculateDailyHexagram(params: LifeParameters): { id: number; name: string; nature: string } {
  const today = new Date().toISOString().split('T')[0];
  const seed = `${params.nickname}-${params.birthDate}-${today}`;
  const hash = simpleHash(seed);
  const hexagramId = (hash % 64) + 1;
  const hexagram = HEXAGRAMS[hexagramId] || HEXAGRAMS[2]; // Fallback to Kun
  
  return {
    id: hexagramId,
    name: hexagram.name,
    nature: hexagram.image
  };
}

// 计算五行偏向 (0-100)
export function calculateElements(params: LifeParameters): Record<WuXing, number> {
  const seed = `${params.birthDate}-${params.birthTime}`;
  const hash = simpleHash(seed);
  
  // 模拟计算，实际应基于更复杂的历法逻辑
  // 这里保证总和不一定为100，而是各自的强度
  return {
    wood: (hash % 100),
    fire: ((hash >> 2) % 100),
    earth: ((hash >> 4) % 100),
    metal: ((hash >> 6) % 100),
    water: ((hash >> 8) % 100),
  };
}

// 获取今日宜/慎 (基于今日卦象ID)
export function getDailyAdvice(hexagramId: number): { recommend: string; avoid: string } {
  // 简单映射示例，实际可扩展
  const advices = [
    { recommend: "静心", avoid: "躁动" },
    { recommend: "进取", avoid: "退缩" },
    { recommend: "沟通", avoid: "独断" },
    { recommend: "反省", avoid: "冒进" },
    { recommend: "合作", avoid: "孤立" }
  ];
  return advices[hexagramId % advices.length];
}

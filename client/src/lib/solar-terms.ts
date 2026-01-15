// 24 Solar Terms Data and Calculation Logic

export type SolarTerm = {
  name: string;
  meaning: string;
  wisdom: string; // Actionable advice for the user
};

const SOLAR_TERMS_DATA: Record<string, SolarTerm> = {
  "小寒": { name: "小寒", meaning: "Minor Cold", wisdom: "小寒宜近火，安身静体。潜龙勿用，积蓄能量。" },
  "大寒": { name: "大寒", meaning: "Major Cold", wisdom: "大寒岂无春，坚冰深处春水生。耐得住寂寞，方见繁华。" },
  "立春": { name: "立春", meaning: "Start of Spring", wisdom: "东风解冻，蛰虫始振。万物复苏之际，宜立愿，宜布施。" },
  "雨水": { name: "雨水", meaning: "Rain Water", wisdom: "好雨知时节，当春乃发生。润物细无声，宜滋养身心，温和待人。" },
  "惊蛰": { name: "惊蛰", meaning: "Awakening of Insects", wisdom: "春雷响，万物长。阳气初惊，宜以此卦唤醒沉睡的计划。" },
  "春分": { name: "春分", meaning: "Spring Equinox", wisdom: "阴阳相半，昼夜均而寒暑平。宜平衡身心，不偏不倚。" },
  "清明": { name: "清明", meaning: "Clear and Bright", wisdom: "万物生长此时，皆清洁而明净。宜扫除心尘，慎终追远。" },
  "谷雨": { name: "谷雨", meaning: "Grain Rain", wisdom: "雨生百谷，生机勃发。宜播种希望，静待花开。" },
  "立夏": { name: "立夏", meaning: "Start of Summer", wisdom: "斗指东南，维为立夏。万物至此皆长大，宜精进，宜热烈。" },
  "小满": { name: "小满", meaning: "Grain Buds", wisdom: "小得盈满，物致于此小得盈满。人生最好是小满，花未全开月未圆。" },
  "芒种": { name: "芒种", meaning: "Grain in Ear", wisdom: "时雨及芒种，四野皆插秧。一分耕耘一分收获，宜忙碌，宜充实。" },
  "夏至": { name: "夏至", meaning: "Summer Solstice", wisdom: "日北至，日长之至。阳气至极，宜静心养阴，避暑宁神。" },
  "小暑": { name: "小暑", meaning: "Minor Heat", wisdom: "倏忽温风至，因循小暑来。心静自然凉，宜纳凉，宜清淡。" },
  "大暑": { name: "大暑", meaning: "Major Heat", wisdom: "大暑三秋近，林钟九夏移。大汗淋漓后，更觉清风爽。宜排毒，宜释怀。" },
  "立秋": { name: "立秋", meaning: "Start of Autumn", wisdom: "一叶梧桐一报秋，稻花香里说丰年。繁华落尽见真淳，宜收敛，宜沉淀。" },
  "处暑": { name: "处暑", meaning: "Limit of Heat", wisdom: "离离暑云散，袅袅凉风起。天地始肃，宜冷静思考，去伪存真。" },
  "白露": { name: "白露", meaning: "White Dew", wisdom: "露从今夜白，月是故乡明。天凉好个秋，宜收敛心神，不宜冒进。" },
  "秋分": { name: "秋分", meaning: "Autumn Equinox", wisdom: "平分秋色一轮满，长伴云衢千里明。阴阳平衡，宜检视得失，不喜不悲。" },
  "寒露": { name: "寒露", meaning: "Cold Dew", wisdom: "袅袅凉风动，凄凄寒露零。寒气渐重，宜温暖身心，关爱自我。" },
  "霜降": { name: "霜降", meaning: "Frost's Descent", wisdom: "霜叶红于二月花。秋之将尽，冬之将至。宜为寒冬储备温暖。" },
  "立冬": { name: "立冬", meaning: "Start of Winter", wisdom: "冻笔新诗懒写，寒炉美酒时温。万物收藏，宜藏精纳气，休养生息。" },
  "小雪": { name: "小雪", meaning: "Minor Snow", wisdom: "晚来天欲雪，能饮一杯无？寒意初现，宜围炉夜话，温暖相伴。" },
  "大雪": { name: "大雪", meaning: "Major Snow", wisdom: "柴门闻犬吠，风雪夜归人。瑞雪兆丰年，宜静待时机，厚积薄发。" },
  "冬至": { name: "冬至", meaning: "Winter Solstice", wisdom: "天时人事日相催，冬至阳生春又来。一阳复始，宜重整旗鼓，充满希望。" },
};

// Simplified estimation for demo purposes (2024-2026 valid)
// C constant values for 21st century
const C_CONSTANTS = {
  "小寒": 5.4055, "大寒": 20.12,
  "立春": 3.87, "雨水": 18.73,
  "惊蛰": 5.63, "春分": 20.646,
  "清明": 4.81, "谷雨": 20.1,
  "立夏": 5.52, "小满": 21.04,
  "芒种": 5.678, "夏至": 21.37,
  "小暑": 7.108, "大暑": 22.83,
  "立秋": 7.5, "处暑": 23.13,
  "白露": 7.646, "秋分": 23.042,
  "寒露": 8.318, "霜降": 23.438,
  "立冬": 7.438, "小雪": 22.36,
  "大雪": 7.18, "冬至": 21.94
};

// Order of solar terms
const SOLAR_TERMS_ORDER = [
  "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨",
  "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑",
  "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
];

/**
 * Calculate the date of a solar term for a given year
 * Formula: [Y * D + C] - L
 * Y = Last 2 digits of year
 * D = 0.2422
 * L = Leap years count = INT(Y/4)
 * C = Constant for the term
 */
function getSolarTermDay(year: number, term: string): number {
  const y = year % 100;
  const d = 0.2422;
  const c = C_CONSTANTS[term as keyof typeof C_CONSTANTS];
  const l = Math.floor(y / 4);
  
  const day = Math.floor(y * d + c) - l;
  
  // Adjustments for specific years (simplified, usually +/- 1 day)
  // For a demo, this formula is accurate enough for 2024-2030
  return day;
}

export function getCurrentSolarTerm(): SolarTerm {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Find the current or last solar term
  // This is a simplified lookup. A robust one would check exact dates.
  
  // Mapping terms to approximate months
  // 小寒(1), 大寒(1), 立春(2), 雨水(2)...
  
  let currentTermName = "小寒"; // Default
  
  // Iterate through all terms to find the latest one that has passed or is today
  // We need to construct dates for all terms in this year
  
  const termDates: { name: string, date: Date }[] = [];
  
  const termMonthMap: Record<string, number> = {
    "小寒": 1, "大寒": 1,
    "立春": 2, "雨水": 2,
    "惊蛰": 3, "春分": 3,
    "清明": 4, "谷雨": 4,
    "立夏": 5, "小满": 5,
    "芒种": 6, "夏至": 6,
    "小暑": 7, "大暑": 7,
    "立秋": 8, "处暑": 8,
    "白露": 9, "秋分": 9,
    "寒露": 10, "霜降": 10,
    "立冬": 11, "小雪": 11,
    "大雪": 12, "冬至": 12
  };

  SOLAR_TERMS_ORDER.forEach(term => {
    const m = termMonthMap[term];
    const d = getSolarTermDay(year, term);
    termDates.push({ name: term, date: new Date(year, m - 1, d) });
  });

  // Sort by date
  termDates.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Find the last term that is <= now
  for (let i = termDates.length - 1; i >= 0; i--) {
    if (now >= termDates[i].date) {
      currentTermName = termDates[i].name;
      break;
    }
  }
  
  // Handle edge case: if early January before XiaoHan, it's technically Winter Solstice of previous year, 
  // but for simplicity we can just default to XiaoHan or check previous year's DongZhi.
  // For this demo, if nothing found (e.g. Jan 1-4), it defaults to "小寒" initialized above, which is close enough or we can set to "冬至".
  if (now < termDates[0].date) {
      currentTermName = "冬至";
  }

  return SOLAR_TERMS_DATA[currentTermName];
}

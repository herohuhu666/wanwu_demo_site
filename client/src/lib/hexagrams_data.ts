export interface HexagramData {
  id: number;
  name: string;
  symbol: string; // Unicode character for the hexagram
  nature: string; // Upper/Lower trigrams description (e.g., "天行健")
  judgment: string; // 卦辞
  image: string; // 象曰
  element: 'metal' | 'wood' | 'water' | 'fire' | 'earth';
  keywords: string[];
}

export const HEXAGRAMS: HexagramData[] = [
  {
    id: 1,
    name: "乾",
    symbol: "䷀",
    nature: "乾为天",
    judgment: "元，亨，利，贞。",
    image: "天行健，君子以自强不息。",
    element: "metal",
    keywords: ["刚健", "进取", "领袖", "创造"]
  },
  {
    id: 2,
    name: "坤",
    symbol: "䷁",
    nature: "坤为地",
    judgment: "元，亨，利牝马之贞。君子有攸往，先迷后得主，利西南得朋，东北丧朋。安贞，吉。",
    image: "地势坤，君子以厚德载物。",
    element: "earth",
    keywords: ["柔顺", "包容", "承载", "配合"]
  },
  {
    id: 3,
    name: "屯",
    symbol: "䷂",
    nature: "水雷屯",
    judgment: "元，亨，利，贞。勿用，有攸往，利建侯。",
    image: "云雷，屯；君子以经纶。",
    element: "water",
    keywords: ["初始", "艰难", "积聚", "萌芽"]
  },
  {
    id: 4,
    name: "蒙",
    symbol: "䷃",
    nature: "山水蒙",
    judgment: "亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。",
    image: "山下出泉，蒙；君子以果行育德。",
    element: "water",
    keywords: ["启蒙", "教育", "未知", "探索"]
  },
  {
    id: 5,
    name: "需",
    symbol: "䷄",
    nature: "水天需",
    judgment: "有孚，光亨，贞吉。利涉大川。",
    image: "云上于天，需；君子以饮食宴乐。",
    element: "water",
    keywords: ["等待", "时机", "积蓄", "耐心"]
  },
  {
    id: 6,
    name: "讼",
    symbol: "䷅",
    nature: "天水讼",
    judgment: "有孚，窒。惕中吉。终凶。利见大人，不利涉大川。",
    image: "天与水违行，讼；君子以作事谋始。",
    element: "metal",
    keywords: ["争执", "分歧", "慎始", "化解"]
  },
  {
    id: 7,
    name: "师",
    symbol: "䷆",
    nature: "地水师",
    judgment: "贞，丈人，吉无咎。",
    image: "地中有水，师；君子以容民畜众。",
    element: "water",
    keywords: ["统率", "纪律", "众志", "正道"]
  },
  {
    id: 8,
    name: "比",
    symbol: "䷇",
    nature: "水地比",
    judgment: "吉。原筮元永贞，无咎。不宁方来，后夫凶。",
    image: "地上有水，比；先王以建万国，亲诸侯。",
    element: "water",
    keywords: ["亲密", "辅佐", "合作", "和谐"]
  },
  {
    id: 9,
    name: "小畜",
    symbol: "䷈",
    nature: "风天小畜",
    judgment: "亨。密云不雨，自我西郊。",
    image: "风行天上，小畜；君子以懿文德。",
    element: "wood",
    keywords: ["积蓄", "微调", "酝酿", "文德"]
  },
  {
    id: 10,
    name: "履",
    symbol: "䷉",
    nature: "天泽履",
    judgment: "履虎尾，不咥人，亨。",
    image: "上天下泽，履；君子以辨上下，定民志。",
    element: "metal",
    keywords: ["践行", "礼仪", "谨慎", "秩序"]
  },
  {
    id: 11,
    name: "泰",
    symbol: "䷊",
    nature: "地天泰",
    judgment: "小往大来，吉亨。",
    image: "天地交，泰；后以财成天地之道，辅相天地之宜，以左右民。",
    element: "earth",
    keywords: ["通达", "安泰", "和谐", "繁荣"]
  },
  {
    id: 12,
    name: "否",
    symbol: "䷋",
    nature: "天地否",
    judgment: "否之匪人，不利君子贞，大往小来。",
    image: "天地不交，否；君子以俭德辟难，不可荣以禄。",
    element: "metal",
    keywords: ["闭塞", "困顿", "隐忍", "俭德"]
  },
  {
    id: 13,
    name: "同人",
    symbol: "䷌",
    nature: "天火同人",
    judgment: "同人于野，亨。利涉大川，利君子贞。",
    image: "天与火，同人；君子以类族辨物。",
    element: "fire",
    keywords: ["团结", "协作", "大同", "公正"]
  },
  {
    id: 14,
    name: "大有",
    symbol: "䷍",
    nature: "火天大有",
    judgment: "元亨。",
    image: "火在天上，大有；君子以遏恶扬善，顺天休命。",
    element: "fire",
    keywords: ["丰盛", "拥有", "光明", "顺应"]
  },
  {
    id: 15,
    name: "谦",
    symbol: "䷎",
    nature: "地山谦",
    judgment: "亨，君子有终。",
    image: "地中有山，谦；君子以裒多益寡，称物平施。",
    element: "earth",
    keywords: ["谦虚", "低调", "受益", "平衡"]
  },
  {
    id: 16,
    name: "豫",
    symbol: "䷏",
    nature: "雷地豫",
    judgment: "利建侯行师。",
    image: "雷出地奋，豫；先王以作乐崇德，殷荐之上帝，以配祖考。",
    element: "wood",
    keywords: ["喜悦", "安乐", "顺动", "准备"]
  },
  {
    id: 17,
    name: "随",
    symbol: "䷐",
    nature: "泽雷随",
    judgment: "元亨利贞，无咎。",
    image: "泽中有雷，随；君子以向晦入宴息。",
    element: "wood",
    keywords: ["跟随", "顺应", "调整", "休息"]
  },
  {
    id: 18,
    name: "蛊",
    symbol: "䷑",
    nature: "山风蛊",
    judgment: "元亨，利涉大川。先甲三日，后甲三日。",
    image: "山下有风，蛊；君子以振民育德。",
    element: "wood",
    keywords: ["整治", "革新", "纠错", "振作"]
  },
  {
    id: 19,
    name: "临",
    symbol: "䷒",
    nature: "地泽临",
    judgment: "元亨利贞。至于八月有凶。",
    image: "泽上有地，临；君子以教思无穷，容保民无疆。",
    element: "earth",
    keywords: ["亲临", "督导", "生长", "包容"]
  },
  {
    id: 20,
    name: "观",
    symbol: "䷓",
    nature: "风地观",
    judgment: "盥而不荐，有孚颙若。",
    image: "风行地上，观；先王以省方，观民设教。",
    element: "wood",
    keywords: ["观察", "展示", "榜样", "反省"]
  },
  {
    id: 21,
    name: "噬嗑",
    symbol: "䷔",
    nature: "火雷噬嗑",
    judgment: "亨。利用狱。",
    image: "雷电噬嗑；先王以明罚敕法。",
    element: "fire",
    keywords: ["咬合", "刑罚", "决断", "公正"]
  },
  {
    id: 22,
    name: "贲",
    symbol: "䷕",
    nature: "山火贲",
    judgment: "亨。小利有攸往。",
    image: "山下有火，贲；君子以明庶政，无敢折狱。",
    element: "fire",
    keywords: ["修饰", "文明", "礼仪", "外表"]
  },
  {
    id: 23,
    name: "剥",
    symbol: "䷖",
    nature: "山地剥",
    judgment: "不利有攸往。",
    image: "山附于地，剥；上以厚下安宅。",
    element: "earth",
    keywords: ["剥落", "衰退", "隐忍", "厚下"]
  },
  {
    id: 24,
    name: "复",
    symbol: "䷗",
    nature: "地雷复",
    judgment: "亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。",
    image: "雷在地中，复；先王以至日闭关，商旅不行，后不省方。",
    element: "wood",
    keywords: ["复兴", "回归", "循环", "生机"]
  },
  {
    id: 25,
    name: "无妄",
    symbol: "䷘",
    nature: "天雷无妄",
    judgment: "元亨利贞。其匪正有眚，不利有攸往。",
    image: "天下雷行，物与无妄；先王以茂对时，育万物。",
    element: "wood",
    keywords: ["真实", "自然", "无妄", "顺天"]
  },
  {
    id: 26,
    name: "大畜",
    symbol: "䷙",
    nature: "山天大畜",
    judgment: "利贞，不家食吉，利涉大川。",
    image: "天在山中，大畜；君子以多识前言往行，以畜其德。",
    element: "earth",
    keywords: ["积聚", "涵养", "止健", "充实"]
  },
  {
    id: 27,
    name: "颐",
    symbol: "䷚",
    nature: "山雷颐",
    judgment: "贞吉。观颐，自求口实。",
    image: "山下有雷，颐；君子以慎言语，节饮食。",
    element: "wood",
    keywords: ["养育", "颐养", "慎言", "节制"]
  },
  {
    id: 28,
    name: "大过",
    symbol: "䷛",
    nature: "泽风大过",
    judgment: "栋桡，利有攸往，亨。",
    image: "泽灭木，大过；君子以独立不惧，遁世无闷。",
    element: "wood",
    keywords: ["非常", "过度", "独立", "担当"]
  },
  {
    id: 29,
    name: "坎",
    symbol: "䷜",
    nature: "坎为水",
    judgment: "习坎，有孚，维心亨，行有尚。",
    image: "水流而不盈，行险而不失其信。君子以常德行，习教事。",
    element: "water",
    keywords: ["险阻", "磨练", "诚信", "坚持"]
  },
  {
    id: 30,
    name: "离",
    symbol: "䷝",
    nature: "离为火",
    judgment: "利贞，亨。畜牝牛，吉。",
    image: "明两作离，大人以继明照于四方。",
    element: "fire",
    keywords: ["附丽", "光明", "热情", "依赖"]
  },
  {
    id: 31,
    name: "咸",
    symbol: "䷞",
    nature: "泽山咸",
    judgment: "亨，利贞，取女吉。",
    image: "山上有泽，咸；君子以虚受人。",
    element: "metal",
    keywords: ["感应", "沟通", "虚心", "接纳"]
  },
  {
    id: 32,
    name: "恒",
    symbol: "䷟",
    nature: "雷风恒",
    judgment: "亨，无咎，利贞，利有攸往。",
    image: "雷风，恒；君子以立不易方。",
    element: "wood",
    keywords: ["恒久", "坚持", "稳定", "立场"]
  },
  {
    id: 33,
    name: "遁",
    symbol: "䷠",
    nature: "天山遁",
    judgment: "亨，小利贞。",
    image: "天下有山，遁；君子以远小人，不恶而严。",
    element: "metal",
    keywords: ["退避", "隐居", "超脱", "远害"]
  },
  {
    id: 34,
    name: "大壮",
    symbol: "䷡",
    nature: "雷天大壮",
    judgment: "利贞。",
    image: "雷在天上，大壮；君子以非礼弗履。",
    element: "wood",
    keywords: ["强盛", "壮大", "正大", "守礼"]
  },
  {
    id: 35,
    name: "晋",
    symbol: "䷢",
    nature: "火地晋",
    judgment: "康侯用锡马蕃庶，昼日三接。",
    image: "明出地上，晋；君子以自昭明德。",
    element: "fire",
    keywords: ["晋升", "前进", "光明", "昭明"]
  },
  {
    id: 36,
    name: "明夷",
    symbol: "䷣",
    nature: "地火明夷",
    judgment: "利艰贞。",
    image: "明入地中，明夷；君子以莅众，用晦而明。",
    element: "fire",
    keywords: ["受损", "晦暗", "韬光", "内明"]
  },
  {
    id: 37,
    name: "家人",
    symbol: "䷤",
    nature: "风火家人",
    judgment: "利女贞。",
    image: "风自火出，家人；君子以言有物，而行有恒。",
    element: "wood",
    keywords: ["家庭", "伦理", "责任", "关爱"]
  },
  {
    id: 38,
    name: "睽",
    symbol: "䷥",
    nature: "火泽睽",
    judgment: "小事吉。",
    image: "上火下泽，睽；君子以同而异。",
    element: "fire",
    keywords: ["乖离", "差异", "求同", "存异"]
  },
  {
    id: 39,
    name: "蹇",
    symbol: "䷦",
    nature: "水山蹇",
    judgment: "利西南，不利东北；利见大人，贞吉。",
    image: "山上有水，蹇；君子以反身修德。",
    element: "water",
    keywords: ["艰难", "险阻", "反省", "修德"]
  },
  {
    id: 40,
    name: "解",
    symbol: "䷧",
    nature: "雷水解",
    judgment: "利西南，无所往，其来复吉。有攸往，夙吉。",
    image: "雷雨作，解；君子以赦过宥罪。",
    element: "water",
    keywords: ["缓解", "解除", "宽恕", "行动"]
  },
  {
    id: 41,
    name: "损",
    symbol: "䷨",
    nature: "山泽损",
    judgment: "有孚，元吉，无咎，可贞，利有攸往。曷之用，二簋可用享。",
    image: "山下有泽，损；君子以惩忿窒欲。",
    element: "earth",
    keywords: ["减损", "投入", "修养", "克制"]
  },
  {
    id: 42,
    name: "益",
    symbol: "䷩",
    nature: "风雷益",
    judgment: "利有攸往，利涉大川。",
    image: "风雷，益；君子以见善则迁，有过则改。",
    element: "wood",
    keywords: ["增益", "助益", "迁善", "改过"]
  },
  {
    id: 43,
    name: "夬",
    symbol: "䷪",
    nature: "泽天夬",
    judgment: "扬于王庭，孚号，有厉，告自邑，不利即戎，利有攸往。",
    image: "泽上于天，夬；君子以施禄及下，居德则忌。",
    element: "metal",
    keywords: ["决断", "清除", "果断", "施恩"]
  },
  {
    id: 44,
    name: "姤",
    symbol: "䷫",
    nature: "天风姤",
    judgment: "女壮，勿用取女。",
    image: "天下有风，姤；后以施命诰四方。",
    element: "wood",
    keywords: ["相遇", "邂逅", "机遇", "发布"]
  },
  {
    id: 45,
    name: "萃",
    symbol: "䷬",
    nature: "泽地萃",
    judgment: "亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。",
    image: "泽上于地，萃；君子以除戎器，戒不虞。",
    element: "earth",
    keywords: ["聚集", "荟萃", "防备", "团结"]
  },
  {
    id: 46,
    name: "升",
    symbol: "䷭",
    nature: "地风升",
    judgment: "元亨，用见大人，勿恤，南征吉。",
    image: "地中生木，升；君子以顺德，积小以高大。",
    element: "wood",
    keywords: ["上升", "生长", "积累", "顺势"]
  },
  {
    id: 47,
    name: "困",
    symbol: "䷮",
    nature: "泽水困",
    judgment: "亨，贞，大人吉，无咎，有言不信。",
    image: "泽无水，困；君子以致命遂志。",
    element: "water",
    keywords: ["困境", "考验", "坚守", "沉默"]
  },
  {
    id: 48,
    name: "井",
    symbol: "䷯",
    nature: "水风井",
    judgment: "改邑不改井，无丧无得，往来井井。汔至，亦未繘井，羸其瓶，凶。",
    image: "木上有水，井；君子以劳民劝相。",
    element: "water",
    keywords: ["养育", "资源", "服务", "恒久"]
  },
  {
    id: 49,
    name: "革",
    symbol: "䷰",
    nature: "泽火革",
    judgment: "已日乃孚，元亨利贞，悔亡。",
    image: "泽中有火，革；君子以治历明时。",
    element: "fire",
    keywords: ["变革", "革新", "时机", "适应"]
  },
  {
    id: 50,
    name: "鼎",
    symbol: "䷱",
    nature: "火风鼎",
    judgment: "元吉，亨。",
    image: "木上有火，鼎；君子以正位凝命。",
    element: "fire",
    keywords: ["稳重", "确立", "使命", "供养"]
  },
  {
    id: 51,
    name: "震",
    symbol: "䷲",
    nature: "震为雷",
    judgment: "亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。",
    image: "洊雷，震；君子以恐惧修省。",
    element: "wood",
    keywords: ["震动", "警醒", "修省", "从容"]
  },
  {
    id: 52,
    name: "艮",
    symbol: "䷳",
    nature: "艮为山",
    judgment: "艮其背，不获其身，行其庭，不见其人，无咎。",
    image: "兼山，艮；君子以思不出其位。",
    element: "earth",
    keywords: ["停止", "静止", "安分", "稳重"]
  },
  {
    id: 53,
    name: "渐",
    symbol: "䷴",
    nature: "风山渐",
    judgment: "女归吉，利贞。",
    image: "山上有木，渐；君子以居贤德，善俗。",
    element: "wood",
    keywords: ["循序", "渐进", "稳健", "风俗"]
  },
  {
    id: 54,
    name: "归妹",
    symbol: "䷵",
    nature: "雷泽归妹",
    judgment: "征凶，无攸利。",
    image: "泽上有雷，归妹；君子以永终知敝。",
    element: "metal",
    keywords: ["归宿", "冲动", "后果", "长远"]
  },
  {
    id: 55,
    name: "丰",
    symbol: "䷶",
    nature: "雷火丰",
    judgment: "亨，王假之，勿忧，宜日中。",
    image: "雷电皆至，丰；君子以折狱致刑。",
    element: "fire",
    keywords: ["丰盛", "盛大", "明察", "果断"]
  },
  {
    id: 56,
    name: "旅",
    symbol: "䷷",
    nature: "火山旅",
    judgment: "小亨，旅贞吉。",
    image: "山上有火，旅；君子以明慎用刑，而不留狱。",
    element: "fire",
    keywords: ["旅行", "探索", "不安定", "明慎"]
  },
  {
    id: 57,
    name: "巽",
    symbol: "䷸",
    nature: "巽为风",
    judgment: "小亨，利有攸往，利见大人。",
    image: "随风，巽；君子以申命行事。",
    element: "wood",
    keywords: ["顺从", "渗透", "执行", "灵活"]
  },
  {
    id: 58,
    name: "兑",
    symbol: "䷹",
    nature: "兑为泽",
    judgment: "亨，利贞。",
    image: "丽泽，兑；君子以朋友讲习。",
    element: "metal",
    keywords: ["喜悦", "交流", "分享", "和睦"]
  },
  {
    id: 59,
    name: "涣",
    symbol: "䷺",
    nature: "风水涣",
    judgment: "亨。王假有庙，利涉大川，利贞。",
    image: "风行水上，涣；先王以享于帝立庙。",
    element: "water",
    keywords: ["涣散", "化解", "信仰", "凝聚"]
  },
  {
    id: 60,
    name: "节",
    symbol: "䷻",
    nature: "水泽节",
    judgment: "亨。苦节不可贞。",
    image: "泽上有水，节；君子以制数度，议德行。",
    element: "water",
    keywords: ["节制", "规矩", "适度", "制度"]
  },
  {
    id: 61,
    name: "中孚",
    symbol: "䷼",
    nature: "风泽中孚",
    judgment: "豚鱼吉，利涉大川，利贞。",
    image: "泽上有风，中孚；君子以议狱缓死。",
    element: "wood",
    keywords: ["诚信", "感应", "宽厚", "公正"]
  },
  {
    id: 62,
    name: "小过",
    symbol: "䷽",
    nature: "雷山小过",
    judgment: "亨，利贞。可小事，不可大事。飞鸟遗之音，不宜上宜下，大吉。",
    image: "山上有雷，小过；君子以行过乎恭，丧过乎哀，用过乎俭。",
    element: "earth",
    keywords: ["小过", "谨慎", "低调", "务实"]
  },
  {
    id: 63,
    name: "既济",
    symbol: "䷾",
    nature: "水火既济",
    judgment: "亨，小利贞，初吉终乱。",
    image: "水在火上，既济；君子以思患而预防之。",
    element: "water",
    keywords: ["完成", "完美", "防患", "守成"]
  },
  {
    id: 64,
    name: "未济",
    symbol: "䷿",
    nature: "火水未济",
    judgment: "亨，小狐汔济，濡其尾，无攸利。",
    image: "火在水上，未济；君子以慎辨物居方。",
    element: "fire",
    keywords: ["未完", "希望", "慎重", "新始"]
  }
];

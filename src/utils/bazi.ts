import { ChartProfile, Pillar, HeavenlyStem, EarthlyBranch, FiveElement, TenGod } from '@/types'
import {
  heavenlyStemElements,
  earthlyBranchElements,
  earthlyBranchHiddenStems,
  tenGodRelations
} from '@/data/constants'

// 天干数组
const heavenlyStems: HeavenlyStem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// 地支数组
const earthlyBranches: EarthlyBranch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 节气时间表（简化版，用于月柱计算）
const solarTerms = [
  { name: '立春', month: 2, dayRange: [4, 6] },
  { name: '惊蛰', month: 3, dayRange: [5, 7] },
  { name: '清明', month: 4, dayRange: [4, 6] },
  { name: '立夏', month: 5, dayRange: [5, 7] },
  { name: '芒种', month: 6, dayRange: [5, 7] },
  { name: '小暑', month: 7, dayRange: [6, 8] },
  { name: '立秋', month: 8, dayRange: [7, 9] },
  { name: '白露', month: 9, dayRange: [7, 9] },
  { name: '寒露', month: 10, dayRange: [8, 10] },
  { name: '立冬', month: 11, dayRange: [7, 9] },
  { name: '大雪', month: 12, dayRange: [6, 8] },
  { name: '小寒', month: 1, dayRange: [5, 7] }
]

// 时辰地支对应表
const timeToEarthlyBranch: { [key: string]: EarthlyBranch } = {
  '23:00-00:59': '子', '01:00-02:59': '丑', '03:00-04:59': '寅',
  '05:00-06:59': '卯', '07:00-08:59': '辰', '09:00-10:59': '巳',
  '11:00-12:59': '午', '13:00-14:59': '未', '15:00-16:59': '申',
  '17:00-18:59': '酉', '19:00-20:59': '戌', '21:00-22:59': '亥'
}

/**
 * 根据公历日期计算四柱
 */
export function calculateFourPillars(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  isHourUnknown: boolean = false
): { pillars: ChartProfile['pillars'], dayMaster: HeavenlyStem } {
  // 年柱计算（简化算法）
  const yearStemIndex = (year - 4) % 10
  const yearBranchIndex = (year - 4) % 12
  const yearPillar: Pillar = {
    heavenlyStem: heavenlyStems[yearStemIndex],
    earthlyBranch: earthlyBranches[yearBranchIndex]
  }

  // 月柱计算（根据节气，简化版）
  const monthPillar = calculateMonthPillar(year, month, day)

  // 日柱计算（简化算法，使用公历日期）
  const dayPillar = calculateDayPillar(year, month, day)

  // 时柱计算
  let hourPillar: Pillar | null = null
  if (!isHourUnknown) {
    hourPillar = calculateHourPillar(dayPillar.heavenlyStem, hour, minute)
  }

  return {
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    },
    dayMaster: dayPillar.heavenlyStem
  }
}

/**
 * 计算月柱
 */
function calculateMonthPillar(year: number, month: number, day: number): Pillar {
  // 根据节气确定月份（简化处理）
  let solarMonth = month

  // 查找当前日期对应的节气月份
  for (let i = 0; i < solarTerms.length; i++) {
    const term = solarTerms[i]
    if (month === term.month && day >= term.dayRange[0] && day <= term.dayRange[1]) {
      solarMonth = (i + 1) % 12 || 12
      break
    }
  }

  // 月干计算（根据年干和月支）
  const yearStemIndex = (year - 4) % 10
  const monthStemIndex = (yearStemIndex * 2 + solarMonth) % 10
  const monthBranchIndex = (solarMonth + 2) % 12

  return {
    heavenlyStem: heavenlyStems[monthStemIndex],
    earthlyBranch: earthlyBranches[monthBranchIndex]
  }
}

/**
 * 计算日柱
 */
function calculateDayPillar(year: number, month: number, day: number): Pillar {
  // 使用简化的公历转农历算法
  const baseDate = new Date(1900, 0, 1) // 1900年1月1日作为基准
  const targetDate = new Date(year, month - 1, day)
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))

  // 1900年1月1日是庚戌日
  const baseStemIndex = 6 // 庚
  const baseBranchIndex = 9 // 戌

  const dayStemIndex = (baseStemIndex + daysDiff) % 10
  const dayBranchIndex = (baseBranchIndex + daysDiff) % 12

  return {
    heavenlyStem: heavenlyStems[dayStemIndex],
    earthlyBranch: earthlyBranches[dayBranchIndex]
  }
}

/**
 * 计算时柱
 */
function calculateHourPillar(dayStem: HeavenlyStem, hour: number, minute: number): Pillar {
  // 根据时间确定时支
  const timeKey = findTimeKey(hour, minute)
  const hourBranch = timeToEarthlyBranch[timeKey]

  // 根据日干和时支计算时干
  const dayStemIndex = heavenlyStems.indexOf(dayStem)
  const hourBranchIndex = earthlyBranches.indexOf(hourBranch)
  const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10

  return {
    heavenlyStem: heavenlyStems[hourStemIndex],
    earthlyBranch: hourBranch
  }
}

/**
 * 根据时间查找对应的时辰
 */
function findTimeKey(hour: number, minute: number): string {
  const time = hour * 100 + minute

  if (time >= 2300 || time < 100) return '23:00-00:59'
  if (time >= 100 && time < 300) return '01:00-02:59'
  if (time >= 300 && time < 500) return '03:00-04:59'
  if (time >= 500 && time < 700) return '05:00-06:59'
  if (time >= 700 && time < 900) return '07:00-08:59'
  if (time >= 900 && time < 1100) return '09:00-10:59'
  if (time >= 1100 && time < 1300) return '11:00-12:59'
  if (time >= 1300 && time < 1500) return '13:00-14:59'
  if (time >= 1500 && time < 1700) return '15:00-16:59'
  if (time >= 1700 && time < 1900) return '17:00-18:59'
  if (time >= 1900 && time < 2100) return '19:00-20:59'
  return '21:00-22:59'
}

/**
 * 分析五行分布
 */
export function analyzeFiveElements(pillars: ChartProfile['pillars']): Record<FiveElement, number> {
  const elements: Record<FiveElement, number> = {
    '金': 0, '木': 0, '水': 0, '火': 0, '土': 0
  }

  // 统计天干五行
  Object.values(pillars).forEach(pillar => {
    if (pillar) {
      const stemElement = heavenlyStemElements[pillar.heavenlyStem]
      elements[stemElement] += 2 // 天干权重为2

      const branchElement = earthlyBranchElements[pillar.earthlyBranch]
      elements[branchElement] += 1.5 // 地支本气权重为1.5

      // 地支藏干
      const hiddenStems = earthlyBranchHiddenStems[pillar.earthlyBranch]
      hiddenStems.forEach((stem, index) => {
        const hiddenElement = heavenlyStemElements[stem]
        if (index === 0) {
          elements[hiddenElement] += 0.8 // 主气权重0.8
        } else if (index === 1) {
          elements[hiddenElement] += 0.4 // 中气权重0.4
        } else {
          elements[hiddenElement] += 0.2 // 余气权重0.2
        }
      })
    }
  })

  return elements
}

/**
 * 分析旺衰 - 增强版算法
 */
export function analyzeBalance(elements: Record<FiveElement, number>): '偏强' | '偏弱' | '中和' | '过旺' | '过弱' {
  const values = Object.values(elements)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const avg = values.reduce((a, b) => a + b, 0) / values.length

  // 计算五行力量的离散程度
  const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)

  // 计算日主同类的力量总和（需要在调用时传入日主五行）
  // 这里先简化为整体分析
  const totalStrength = values.reduce((a, b) => a + b, 0)

  // 更精确的旺衰判断
  if (max > avg * 2.0 && stdDev > avg * 0.8) {
    return '过旺' // 某一五行极度旺盛
  } else if (max > avg * 1.5 && stdDev > avg * 0.5) {
    return '偏强' // 整体偏强
  } else if (min < avg * 0.4 && stdDev > avg * 0.6) {
    return '过弱' // 某一五行极度衰弱
  } else if (min < avg * 0.7 && stdDev > avg * 0.3) {
    return '偏弱' // 整体偏弱
  } else if (stdDev < avg * 0.3) {
    return '中和' // 五行相对平衡
  }

  return '中和' // 默认平衡状态
}

/**
 * 分析十神
 */
export function analyzeTenGods(pillars: ChartProfile['pillars'], dayMaster: HeavenlyStem): Array<{ name: TenGod, weight: number, brief: string }> {
  const tenGodCounts: Record<TenGod, number> = {} as Record<TenGod, number>

  // 初始化
  const tenGodNames: TenGod[] = ['比肩', '劫财', '食神', '伤官', '正财', '偏财', '正官', '七杀', '正印', '偏印']
  tenGodNames.forEach(name => {
    tenGodCounts[name] = 0
  })

  // 统计十神出现次数
  Object.values(pillars).forEach(pillar => {
    if (pillar) {
      // 天干十神
      const stemTenGod = tenGodRelations[dayMaster][pillar.heavenlyStem]
      tenGodCounts[stemTenGod] += 3 // 天干权重为3

      // 地支藏干十神
      const hiddenStems = earthlyBranchHiddenStems[pillar.earthlyBranch]
      hiddenStems.forEach((stem, index) => {
        const hiddenTenGod = tenGodRelations[dayMaster][stem]
        if (index === 0) {
          tenGodCounts[hiddenTenGod] += 1.2 // 主气权重1.2
        } else if (index === 1) {
          tenGodCounts[hiddenTenGod] += 0.6 // 中气权重0.6
        } else {
          tenGodCounts[hiddenTenGod] += 0.3 // 余气权重0.3
        }
      })
    }
  })

  // 排序并取前3
  const sorted = Object.entries(tenGodCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, weight]) => ({
      name: name as TenGod,
      weight,
      brief: getTenGodBrief(name as TenGod)
    }))

  return sorted
}

/**
 * 获取十神简述
 */
function getTenGodBrief(tenGod: TenGod): string {
  const briefs: Record<TenGod, string> = {
    '比肩': '自尊独立，同辈竞争，合作共赢',
    '劫财': '社交活跃，他人助力，但也易有损耗',
    '食神': '才艺表达，享受生活，创意思维',
    '伤官': '创新突破，言辞犀利，反叛精神',
    '正财': '稳健理财，实务能力，诚信经营',
    '偏财': '机遇财富，投机敏锐，人际网络',
    '正官': '责任担当，循规蹈矩，社会地位',
    '七杀': '魄力决断，挑战突破，权威压力',
    '正印': '学习吸收，贵人相助，内在修养',
    '偏印': '独特见解，专业技能，非传统思维'
  }
  return briefs[tenGod] || ''
}

/**
 * 分析用神忌神（简化版）
 */
export function analyzeFavorableElements(
  elements: Record<FiveElement, number>,
  dayMaster: HeavenlyStem,
  balanceType: '过旺' | '偏强' | '中和' | '偏弱' | '过弱'
): { favorable: FiveElement[], unfavorable: FiveElement[] } {
  const dayElement = heavenlyStemElements[dayMaster]
  const favorable: FiveElement[] = []
  const unfavorable: FiveElement[] = []

  if (balanceType === '过旺' || balanceType === '偏强') {
    // 身强需要克泄耗
    const 克 = getControlElement(dayElement)
    const 泄 = getOutputElement(dayElement)
    const 耗 = getWeakenElement(dayElement)

    favorable.push(克, 泄, 耗)
    // 同类为忌
    unfavorable.push(dayElement, getSameElement(dayElement))
  } else if (balanceType === '过弱' || balanceType === '偏弱') {
    // 身弱需要生助
    const 生 = getSupportElement(dayElement)
    const 助 = dayElement

    favorable.push(生, 助)
    // 克泄耗为忌
    unfavorable.push(
      getControlElement(dayElement),
      getOutputElement(dayElement),
      getWeakenElement(dayElement)
    )
  } else {
    // 中和则根据季节（这里简化处理）
    favorable.push(dayElement, getSupportElement(dayElement))
  }

  return { favorable: [...new Set(favorable)], unfavorable: [...new Set(unfavorable)] }
}

/**
 * 五行相生关系
 */
function getSupportElement(element: FiveElement): FiveElement {
  const supportMap: Record<FiveElement, FiveElement> = {
    '木': '水',
    '火': '木',
    '土': '火',
    '金': '土',
    '水': '金'
  }
  return supportMap[element]
}

/**
 * 五行同类
 */
function getSameElement(element: FiveElement): FiveElement {
  return element // 同类就是自己
}

/**
 * 五行相克关系
 */
function getControlElement(element: FiveElement): FiveElement {
  const controlMap: Record<FiveElement, FiveElement> = {
    '木': '金',
    '火': '水',
    '土': '木',
    '金': '火',
    '水': '土'
  }
  return controlMap[element]
}

/**
 * 五行相泄关系
 */
function getOutputElement(element: FiveElement): FiveElement {
  const outputMap: Record<FiveElement, FiveElement> = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  }
  return outputMap[element]
}

/**
 * 五行相耗关系
 */
function getWeakenElement(element: FiveElement): FiveElement {
  const weakenMap: Record<FiveElement, FiveElement> = {
    '木': '土',
    '火': '金',
    '土': '水',
    '金': '木',
    '水': '火'
  }
  return weakenMap[element]
}

/**
 * 分析2026丙午流年影响 - 增强版算法
 */
export function analyzeYear2026Impact(
  chartProfile: Pick<ChartProfile, 'pillars' | 'dayMaster' | 'fiveElements' | 'balanceType'>
): {
  type: '大助' | '助力' | '消耗' | '压力' | '机会' | '挑战',
  briefReason: string,
  detailedAnalysis: string,
  strengthLevel: number // 0-100的影响强度
} {
  const { dayMaster, fiveElements, balanceType } = chartProfile
  const dayElement = heavenlyStemElements[dayMaster]

  // 2026年天干丙火，地支午火，火势极旺
  const yearElement = '火'

  // 计算命局中火的现有力量
  const fireStrength = fiveElements['火']
  const avgStrength = Object.values(fiveElements).reduce((a, b) => a + b, 0) / 5

  // 分析火对日主的生克关系
  let type: '大助' | '助力' | '消耗' | '压力' | '机会' | '挑战'
  let briefReason: string
  let detailedAnalysis: string
  let strengthLevel: number

  // 1. 火与日主相同（比肩助力）
  if (dayElement === yearElement) {
    if (balanceType === '过弱' || balanceType === '偏弱') {
      type = '大助'
      briefReason = '丙午火助身，弱逢生扶，如旱苗得雨，运势大振'
      detailedAnalysis = '您的日主属火，2026年丙午火年形成比肩助力格局。对于身弱的您来说，这是难得的帮扶之年，火势助身，自信心和行动力都显著增强，宜把握机遇大展拳脚。'
      strengthLevel = 85 + (fireStrength > avgStrength ? 5 : 0)
    } else {
      type = '助力'
      briefReason = '丙午火助身，朋友相助，合作共赢'
      detailedAnalysis = '火日主逢火年，得比肩相助，人缘佳，朋友助力明显。但需注意避免过度自信，防范朋友间的竞争关系。'
      strengthLevel = 70 + (balanceType === '过旺' ? -10 : 5)
    }
  }
  // 2. 火生日主（印星生身）
  else if (getSupportElement(dayElement) === yearElement) {
    if (balanceType === '偏弱' || balanceType === '过弱') {
      type = '大助'
      briefReason = '丙午火生身，贵人提携，学业事业双丰收'
      detailedAnalysis = '火生您的日主，形成印星生身格局。对于身弱的您来说，这是贵人年，长上、老师、长辈的提携让您如虎添翼。学习运强，适合考证、进修。'
      strengthLevel = 80 + (fireStrength < avgStrength ? 10 : 0)
    } else {
      type = '助力'
      briefReason = '丙午火生身，内在充实，修养提升'
      detailedAnalysis = '印星透干，内在充实，学习吸收能力强，思虑周全。但身强者要避免依赖心理，需主动出击。'
      strengthLevel = 65
    }
  }
  // 3. 日主生火（食伤泄秀）
  else if (getOutputElement(dayElement) === yearElement) {
    if (balanceType === '过旺' || balanceType === '偏强') {
      type = '助力'
      briefReason = '丙午火为泄，才华展现，表达创造力强'
      detailedAnalysis = '您的日主生丙午火，形成食伤泄秀格局。对于身强的您，这是发挥才华的绝佳年份，创意、表达、创作能力都处于巅峰状态。'
      strengthLevel = 75
    } else {
      type = '消耗'
      briefReason = '丙午火为泄，多付出多收获，需注意精力管理'
      detailedAnalysis = '食伤透干，今年需要大量输出精力和时间在表达、创作上。虽然能展现才华，但要注意劳逸结合，避免过度消耗。'
      strengthLevel = 60 + (balanceType === '过弱' ? -10 : 0)
    }
  }
  // 4. 火克日主（官星克身）
  else if (getControlElement(dayElement) === yearElement) {
    if (balanceType === '过旺' || balanceType === '偏强') {
      type = '机会'
      briefReason = '丙午火克身，压力转化动力，事业有成'
      detailedAnalysis = '官星透干，对于身强的您来说，这是事业年。适度的压力能让您保持警觉，把握住就能事业晋升。但要注意与领导的关系。'
      strengthLevel = 70
    } else {
      type = '压力'
      briefReason = '丙午火克身，挑战较大，需以柔克刚'
      detailedAnalysis = '官星克身，对于身弱的您来说压力较大。工作、健康方面都有挑战。建议以柔克刚，寻求贵人化解，切忌硬抗。'
      strengthLevel = 45 + (balanceType === '过弱' ? -10 : 0)
    }
  }
  // 5. 日主克火（财星被克）
  else {
    if (balanceType === '过旺' || balanceType === '偏强') {
      type = '机会'
      briefReason = '丙午火为财，财运亨通，把握商机'
      detailedAnalysis = '火为您的财星，对于身强的您这是财运年。正财偏财都有机会，但要防范破财风险，投资需谨慎。'
      strengthLevel = 75
    } else {
      type = '挑战'
      briefReason = '丙午火为财，财多身弱，需防破财'
      detailedAnalysis = '财星透干但身弱担不起财，容易出现财多身弱的局面。建议稳健理财，避免投机，寻求合作伙伴共担风险。'
      strengthLevel = 50
    }
  }

  // 根据命局中火的原始力量调整影响强度
  if (fireStrength > avgStrength * 1.5) {
    strengthLevel += 10 // 命局火旺，流年影响加倍
    detailedAnalysis += '您的命局中火本就旺盛，流年火上浇火，影响更为显著。'
  } else if (fireStrength < avgStrength * 0.5) {
    strengthLevel -= 5 // 命局火弱，适应性较强
    detailedAnalysis += '您的命局中火偏弱，对流年火的适应性较强，影响相对温和。'
  }

  // 限制强度范围
  strengthLevel = Math.max(30, Math.min(95, strengthLevel))

  return { type, briefReason, detailedAnalysis, strengthLevel }
}
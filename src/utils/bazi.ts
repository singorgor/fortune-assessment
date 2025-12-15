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
 * 分析旺衰
 */
export function analyzeBalance(elements: Record<FiveElement, number>): '偏强' | '偏弱' | '均衡' {
  const values = Object.values(elements)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const avg = values.reduce((a, b) => a + b, 0) / values.length

  // 如果最大值比平均值高出很多，则为偏强
  if (max > avg * 1.5) return '偏强'
  // 如果最小值比平均值低很多，则为偏弱
  if (min < avg * 0.7) return '偏弱'

  return '均衡'
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
  balanceType: '偏强' | '偏弱' | '均衡'
): { favorable: FiveElement[], unfavorable: FiveElement[] } {
  const dayElement = heavenlyStemElements[dayMaster]
  const favorable: FiveElement[] = []
  const unfavorable: FiveElement[] = []

  if (balanceType === '偏强') {
    // 身强需要克泄耗
    const 克 = getControlElement(dayElement)
    const 泄 = getOutputElement(dayElement)
    const 耗 = getWeakenElement(dayElement)

    favorable.push(克, 泄, 耗)
    // 同类为忌
    unfavorable.push(dayElement, getSameElement(dayElement))
  } else if (balanceType === '偏弱') {
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
    // 均衡则根据季节（这里简化处理）
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
 * 分析2026丙午流年影响
 */
export function analyzeYear2026Impact(
  chartProfile: Pick<ChartProfile, 'pillars' | 'dayMaster' | 'fiveElements' | 'balanceType'>
): { type: '助力' | '消耗' | '压力' | '机会', briefReason: string } {
  const { dayMaster, fiveElements } = chartProfile
  const dayElement = heavenlyStemElements[dayMaster]

  // 丙午都是火
  const yearElement = '火'

  // 分析火对日主的影响
  if (dayElement === yearElement) {
    return {
      type: '助力',
      briefReason: '丙午火助身，自信心增强，表现欲强，宜主动出击'
    }
  } else if (getSupportElement(dayElement) === yearElement) {
    return {
      type: '助力',
      briefReason: '丙午火生身，得贵人相助，学习进步，内外兼修'
    }
  } else if (getOutputElement(dayElement) === yearElement) {
    return {
      type: '消耗',
      briefReason: '丙午火为泄，多表达多付出，但需注意精力分配'
    }
  } else if (getControlElement(dayElement) === yearElement) {
    return {
      type: '压力',
      briefReason: '丙午火克身，面临挑战，需以柔克刚，化解压力'
    }
  } else {
    return {
      type: '机会',
      briefReason: '丙午火为财，机遇增多，但需主动把握，防范风险'
    }
  }
}
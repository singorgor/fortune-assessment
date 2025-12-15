// 天干地支类型
export type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸'
export type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

// 五行类型
export type FiveElement = '金' | '木' | '水' | '火' | '土'

// 十神类型
export type TenGod = '比肩' | '劫财' | '食神' | '伤官' | '正财' | '偏财' | '正官' | '七杀' | '正印' | '偏印'

// 四柱结构
export interface Pillar {
  heavenlyStem: HeavenlyStem
  earthlyBranch: EarthlyBranch
}

// 命盘画像
export interface ChartProfile {
  pillars: {
    year: Pillar
    month: Pillar
    day: Pillar
    hour: Pillar | null
  }
  dayMaster: HeavenlyStem
  fiveElements: Record<FiveElement, number>
  balanceType: '偏强' | '偏弱' | '均衡'
  tenGodTop3: Array<{
    name: TenGod
    weight: number
    brief: string
  }>
  favorableElements: FiveElement[]
  unfavorableElements: FiveElement[]
  year2026Impact: {
    type: '助力' | '消耗' | '压力' | '机会'
    briefReason: string
  }
  isHourUnknown: boolean
}

// 用户选择
export interface UserContext {
  useMatter: '求官' | '求财' | '婚恋' | '康宁' | '交游'
  situation: string
  strategy: '稳守' | '进取' | '先守后攻' | '先攻后守'
  taboos: string[]
  energy: string
}

// 报告结构
export interface Report {
  overall: {
    score: number
    headline: string
    keywords: string[]
    oneAdvice: string
  }
  domains: Array<{
    name: '事业' | '财运' | '婚恋' | '健康' | '人际'
    score: number
    trend: '上升' | '平稳' | '波动' | '偏压力'
    brightSpot: string
    pitfall: string
    actions: string[]
    basisLite: string
  }>
  months: Array<{
    month: number
    tag: string
    theme: string
    reminders: string[]
    goodFor: string
    methodLite: string
  }>
  basis: {
    theory: string
    rules: string
    disclaimer: string
  }
}

// 存储数据结构
export interface StoredData {
  attempt_token: string
  result_snapshot: {
    chartProfile: ChartProfile
    userContext: UserContext
    report: Report
  }
  profile_hash: string
  timestamp: number
  version: string
}
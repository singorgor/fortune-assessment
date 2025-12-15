import { ChartProfile } from '@/types'
import {
  calculateFourPillars,
  analyzeFiveElements,
  analyzeBalance,
  analyzeTenGods,
  analyzeFavorableElements,
  analyzeYear2026Impact
} from './bazi'

/**
 * 完整的命盘分析
 */
export function analyzeChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  isHourUnknown: boolean = false
): ChartProfile {
  // 计算四柱
  const { pillars, dayMaster } = calculateFourPillars(year, month, day, hour, minute, isHourUnknown)

  // 分析五行
  const fiveElements = analyzeFiveElements(pillars)

  // 分析旺衰
  const balanceType = analyzeBalance(fiveElements)

  // 分析十神
  const tenGodTop3 = analyzeTenGods(pillars, dayMaster)

  // 分析用神忌神
  const { favorable: favorableElements, unfavorable: unfavorableElements } = analyzeFavorableElements(
    fiveElements,
    dayMaster,
    balanceType
  )

  // 分析2026年影响
  const year2026Impact = analyzeYear2026Impact({
    pillars,
    dayMaster,
    fiveElements,
    balanceType
  })

  return {
    pillars,
    dayMaster,
    fiveElements,
    balanceType,
    tenGodTop3,
    favorableElements,
    unfavorableElements,
    year2026Impact,
    isHourUnknown
  }
}
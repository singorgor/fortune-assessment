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
 * 将用户时区的时间转换为本地时间（用于八字计算）
 */
function convertToLocalTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timezone: string
) {
  // 创建用户时区的日期时间
  const userDate = new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`)

  // 获取用户时区与UTC的偏移（分钟）
  const userTimezoneOffset = getTimezoneOffset(timezone)

  // 获取本地时区（运行环境）与UTC的偏移（分钟）
  const localTimezoneOffset = -new Date().getTimezoneOffset()

  // 计算时间差（分钟）
  const timeDiff = userTimezoneOffset - localTimezoneOffset

  // 调整时间
  const adjustedDate = new Date(userDate.getTime() + timeDiff * 60 * 1000)

  return {
    year: adjustedDate.getFullYear(),
    month: adjustedDate.getMonth() + 1,
    day: adjustedDate.getDate(),
    hour: adjustedDate.getHours(),
    minute: adjustedDate.getMinutes()
  }
}

/**
 * 获取指定时区与UTC的偏移（分钟）
 */
function getTimezoneOffset(timezone: string): number {
  const timezoneOffsets: { [key: string]: number } = {
    'Asia/Shanghai': 480, // GMT+8
    'Asia/Taipei': 480,
    'Asia/Hong_Kong': 480,
    'Asia/Tokyo': 540, // GMT+9
    'Asia/Seoul': 540,
    'America/New_York': -300, // GMT-5
    'America/Los_Angeles': -480, // GMT-8
    'Europe/London': 0, // GMT+0
    'Europe/Paris': 60, // GMT+1
    'Australia/Sydney': 600, // GMT+10
  }

  return timezoneOffsets[timezone] || 480 // 默认北京时间
}

/**
 * 完整的命盘分析
 */
export function analyzeChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  isHourUnknown: boolean = false,
  timezone: string = 'Asia/Shanghai'
): ChartProfile {
  // 转换为本地时间进行八字计算
  const localDate = convertToLocalTime(year, month, day, hour, minute, timezone)

  // 计算四柱
  const { pillars, dayMaster } = calculateFourPillars(
    localDate.year,
    localDate.month,
    localDate.day,
    localDate.hour,
    localDate.minute,
    isHourUnknown
  )

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
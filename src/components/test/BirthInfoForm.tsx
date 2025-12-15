'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Clock } from 'lucide-react'

interface BirthInfo {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  isHourUnknown: boolean
  timezone: string
}

interface BirthInfoFormProps {
  onSubmit: (info: BirthInfo) => void
}

export function BirthInfoForm({ onSubmit }: BirthInfoFormProps) {
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    isHourUnknown: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // 验证年份
    const currentYear = new Date().getFullYear()
    if (birthInfo.year < 1900 || birthInfo.year > currentYear) {
      newErrors.year = `请输入1900年至${currentYear}年之间的年份`
    }

    // 验证日期
    const date = new Date(birthInfo.year, birthInfo.month - 1, birthInfo.day)
    if (
      date.getFullYear() !== birthInfo.year ||
      date.getMonth() !== birthInfo.month - 1 ||
      date.getDate() !== birthInfo.day
    ) {
      newErrors.date = '请输入有效的日期'
    }

    // 验证时间（如果时辰已知）
    if (!birthInfo.isHourUnknown) {
      if (birthInfo.hour < 0 || birthInfo.hour > 23) {
        newErrors.hour = '请输入有效的小时'
      }
      if (birthInfo.minute < 0 || birthInfo.minute > 59) {
        newErrors.minute = '请输入有效的分钟'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(birthInfo)
    }
  }

  const handleHourUnknownChange = (isUnknown: boolean) => {
    setBirthInfo(prev => ({
      ...prev,
      isHourUnknown: isUnknown
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 日期选择 */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          <CalendarIcon className="inline h-4 w-4 mr-1" />
          出生日期（公历）
        </label>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <select
              value={birthInfo.year}
              onChange={(e) => setBirthInfo(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {Array.from({ length: 125 }, (_, i) => 1900 + i).map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={birthInfo.month}
              onChange={(e) => setBirthInfo(prev => ({ ...prev, month: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{month}月</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={birthInfo.day}
              onChange={(e) => setBirthInfo(prev => ({ ...prev, day: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>{day}日</option>
              ))}
            </select>
          </div>
        </div>

        {errors.date && (
          <p className="text-red-500 text-sm">{errors.date}</p>
        )}
      </div>

      {/* 时辰选择 */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          <Clock className="inline h-4 w-4 mr-1" />
          出生时间
        </label>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="hourType"
              checked={!birthInfo.isHourUnknown}
              onChange={() => handleHourUnknownChange(false)}
              className="mr-2 text-amber-600 focus:ring-amber-500"
            />
            知道具体时间
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="hourType"
              checked={birthInfo.isHourUnknown}
              onChange={() => handleHourUnknownChange(true)}
              className="mr-2 text-amber-600 focus:ring-amber-500"
            />
            不知道具体时辰
          </label>
        </div>

        {!birthInfo.isHourUnknown && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">时</label>
              <select
                value={birthInfo.hour}
                onChange={(e) => setBirthInfo(prev => ({ ...prev, hour: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                  <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
                ))}
              </select>
              {errors.hour && (
                <p className="text-red-500 text-sm">{errors.hour}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">分</label>
              <select
                value={birthInfo.minute}
                onChange={(e) => setBirthInfo(prev => ({ ...prev, minute: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                  <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                ))}
              </select>
              {errors.minute && (
                <p className="text-red-500 text-sm">{errors.minute}</p>
              )}
            </div>
          </div>
        )}

        {birthInfo.isHourUnknown && (
          <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200">
            <p className="text-sm text-amber-800">
              时辰未知可能会影响部分分析的准确度，但整体命盘格局判断仍可进行。
            </p>
          </div>
        )}
      </div>

      {/* 时区 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          时区
        </label>
        <select
          value={birthInfo.timezone}
          onChange={(e) => setBirthInfo(prev => ({ ...prev, timezone: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="Asia/Shanghai">北京时间 (GMT+8)</option>
          <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
            当前时区 ({Intl.DateTimeFormat().resolvedOptions().timeZone})
          </option>
        </select>
      </div>

      {/* 提交按钮 */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 text-white px-8"
        >
          下一步
        </Button>
      </div>
    </form>
  )
}
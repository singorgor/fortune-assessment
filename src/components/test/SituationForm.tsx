'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, HelpCircle, ArrowLeft, Check } from 'lucide-react'
import {
  useMatterOptions,
  situationOptions,
  strategyOptions,
  tabooOptions,
  energyOptions
} from '@/data/constants'

interface UserContext {
  useMatter: string
  situation: string
  strategy: string
  taboos: string[]
  energy: string
}

interface SituationFormProps {
  onSubmit: (context: UserContext) => void
  onBack: () => void
}

export function SituationForm({ onSubmit, onBack }: SituationFormProps) {
  const [context, setContext] = useState<UserContext>({
    useMatter: '',
    situation: '',
    strategy: '',
    taboos: [],
    energy: ''
  })

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!context.useMatter) {
      newErrors.useMatter = '请选择用事'
    }
    if (!context.situation) {
      newErrors.situation = '请选择具体处境'
    }
    if (!context.strategy) {
      newErrors.strategy = '请选择运势打法'
    }
    if (context.taboos.length === 0) {
      newErrors.taboos = '请至少选择一项忌事'
    }
    if (!context.energy) {
      newErrors.energy = '请选择气力时间'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmDialog(true)
    }
  }

  const handleConfirmSubmit = () => {
    onSubmit(context)
  }

  const handleTabooToggle = (taboo: string) => {
    setContext(prev => ({
      ...prev,
      taboos: prev.taboos.includes(taboo)
        ? prev.taboos.filter(t => t !== taboo)
        : [...prev.taboos, taboo].slice(0, 3) // 最多选3个
    }))
  }

  return (
    <div className="space-y-8">
      {/* Q1: 用事选择 */}
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="text-lg font-medium text-gray-700">Q1: 你本次主要问哪一类事？</span>
          <span className="ml-2 text-red-500">*</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {useMatterOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setContext(prev => ({ ...prev, useMatter: option.value, situation: '' }))
                setErrors(prev => ({ ...prev, useMatter: '' }))
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                context.useMatter === option.value
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <div className="text-lg font-semibold">{option.label}</div>
            </button>
          ))}
        </div>

        {errors.useMatter && (
          <p className="text-red-500 text-sm">{errors.useMatter}</p>
        )}
      </div>

      {/* Q2: 处境选择（联动） */}
      {context.useMatter && (
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="text-lg font-medium text-gray-700">
              Q2: 你在【{context.useMatter}】上的具体处境是哪一种？
            </span>
            <span className="ml-2 text-red-500">*</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {situationOptions[context.useMatter as keyof typeof situationOptions].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setContext(prev => ({ ...prev, situation: option }))
                  setErrors(prev => ({ ...prev, situation: '' }))
                }}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  context.situation === option
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
                }`}
              >
                <div className="text-sm font-medium">{option}</div>
              </button>
            ))}
          </div>

          {errors.situation && (
            <p className="text-red-500 text-sm">{errors.situation}</p>
          )}
        </div>
      )}

      {/* Q3: 运势打法 */}
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="text-lg font-medium text-gray-700">Q3: 你更想要今年的"运势打法"？</span>
          <span className="ml-2 text-red-500">*</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {strategyOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setContext(prev => ({ ...prev, strategy: option.value }))
                setErrors(prev => ({ ...prev, strategy: '' }))
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                context.strategy === option.value
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <div className="text-lg font-semibold">{option.label}</div>
            </button>
          ))}
        </div>

        {errors.strategy && (
          <p className="text-red-500 text-sm">{errors.strategy}</p>
        )}
      </div>

      {/* Q4: 忌事选择（多选） */}
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="text-lg font-medium text-gray-700">Q4: 你最忌哪类事象？（最多选3项）</span>
          <span className="ml-2 text-red-500">*</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tabooOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => handleTabooToggle(option)}
              className={`p-3 rounded-lg border-2 transition-all ${
                context.taboos.includes(option)
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option}</span>
                {context.taboos.includes(option) && (
                  <Check className="h-4 w-4 text-amber-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        {errors.taboos && (
          <p className="text-red-500 text-sm">{errors.taboos}</p>
        )}
      </div>

      {/* Q5: 气力时间 */}
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="text-lg font-medium text-gray-700">Q5: 你今年气力与时间大概怎样？</span>
          <span className="ml-2 text-red-500">*</span>
        </div>

        <div className="space-y-3">
          {energyOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setContext(prev => ({ ...prev, energy: option }))
                setErrors(prev => ({ ...prev, energy: '' }))
              }}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                context.energy === option
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <div className="text-sm font-medium">{option}</div>
            </button>
          ))}
        </div>

        {errors.energy && (
          <p className="text-red-500 text-sm">{errors.energy}</p>
        )}
      </div>

      {/* 提交按钮 */}
      <div className="flex justify-between pt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          上一步
        </Button>

        <Button
          type="button"
          onClick={handleSubmit}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          生成报告
        </Button>
      </div>

      {/* 确认对话框 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-amber-600 mr-2" />
              <h3 className="text-lg font-semibold">确认提交</h3>
            </div>

            <Alert className="mb-6">
              <AlertDescription>
                基于传统子平法，系统将为您生成专属的2026丙午流年运势报告。报告包含五行分析、十神特质解读、五大领域运势走向及逐月节气提示。请确认信息无误后继续。
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-3">您的选择：</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">用事：</span>{context.useMatter}</div>
                <div><span className="font-medium">处境：</span>{context.situation}</div>
                <div><span className="font-medium">打法：</span>{context.strategy}</div>
                <div><span className="font-medium">忌事：</span>{context.taboos.join('、')}</div>
                <div><span className="font-medium">气力：</span>{context.energy}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1"
              >
                返回修改
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                确认提交
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
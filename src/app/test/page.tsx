'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Clock, AlertCircle, ArrowRight } from 'lucide-react'
import { BirthInfoForm } from '@/components/test/BirthInfoForm'
import { SituationForm } from '@/components/test/SituationForm'
import { createClientStorage } from '@/lib/storage'

export default function TestPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [birthInfo, setBirthInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 移除测试限制，允许重复测试
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-eastern flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-eastern">正在检查...</p>
        </div>
      </div>
    )
  }

  const handleBirthInfoSubmit = (info: any) => {
    setBirthInfo(info)
    setStep(2)
  }

  const handleSituationSubmit = async (situationData: any) => {
    try {
      // 检查 birthInfo 是否存在
      if (!birthInfo) {
        console.error('出生信息缺失:', birthInfo)
        alert('出生信息丢失，请重新填写')
        setStep(1)
        return
      }

      console.log('准备保存数据:', { birthInfo, situationData })

      const storage = createClientStorage()

      // 保存测评数据
      await storage.saveTestResult({
        birthInfo,
        situation: situationData
      })

      console.log('数据保存成功')

      // 跳转到结果页
      router.replace('/result')
    } catch (error) {
      console.error('保存测评结果失败:', error)
      console.error('错误详情:', {
        birthInfo: birthInfo,
        situationData: situationData,
        errorMessage: error?.message,
        errorStack: error?.stack
      })
      alert(`保存失败: ${error?.message || '未知错误'}`)
    }
  }

  return (
    <div className="min-h-screen bg-eastern">
      {/* 导航栏 */}
      <nav className="border-b border-eastern/20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-eastern">运势测评</h1>
            <Badge variant="secondary">
              {step}/2
            </Badge>
          </div>
          <Progress value={step * 50} className="mt-2" />
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {step === 1 && (
          <div className="space-y-6">
            <Card className="border-eastern/30 shadow-eastern">
              <CardHeader>
                <CardTitle className="text-eastern flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  第一步：出生信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">
                  请准确填写您的出生信息，这是分析命盘的基础。
                </p>

                <BirthInfoForm onSubmit={handleBirthInfoSubmit} />

                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">隐私提示</p>
                      <p>数据仅在本地计算，不会上传到任何服务器。</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card className="border-eastern/30 shadow-eastern">
              <CardHeader>
                <CardTitle className="text-eastern flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  第二步：用事与处境
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">
                  选择您当前最关注的方面和具体处境，我们将据此提供针对性建议。
                </p>

                <SituationForm
                  onSubmit={handleSituationSubmit}
                  onBack={() => setStep(1)}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
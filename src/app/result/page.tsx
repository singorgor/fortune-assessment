'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// 日主解释函数
const getDayMasterExplanation = (dayMaster: string) => {
  const explanations: Record<string, string> = {
    '甲': '您如参天大树，性格正直坚强，有领导才能，做事积极进取。甲木之人有强烈的责任心和担当精神。',
    '乙': '您如柔韧的藤蔓植物，适应力强，善于在变化环境中成长。乙木之人性格温和，具有顽强的生命力和灵活的处事方式。',
    '丙': '您如熊熊烈火，热情开朗，充满活力和创造力。丙火之人善于表达，有很强的感染力和领导魅力。',
    '丁': '您如温和的烛光，细腻敏感，富有同情心和洞察力。丁火之人内心温暖，善于照顾他人感受。',
    '戊': '您如厚重大地，稳重踏实，有很强的包容心和责任感。戊土之人诚实可靠，是值得信赖的依靠。',
    '己': '您如田园沃土，温和滋润，有很强的 nurturing 能力。己土之人细腻体贴，善于创造和谐环境。',
    '庚': '您如锋利刀剑，果断刚毅，有很强的决断力和执行力。庚金之人讲义气，做事干脆利落。',
    '辛': '您如精美珠宝，细致优雅，有很强的审美能力和鉴赏力。辛金之人追求完美，注重品质。',
    '壬': '您如江河大海，聪慧灵活，有很强的适应能力和包容性。壬水之人思路开阔，善于变通。',
    '癸': '您如清泉雨露，纯净温柔，有很强的直觉和感悟能力。癸水之人内心丰富，善于理解他人。'
  }
  return explanations[dayMaster] || '您的命格独特，需要在具体分析中了解。'
}

// 格局解释函数
const getBalanceTypeExplanation = (balanceType: string) => {
  const explanations: Record<string, string> = {
    '偏强': '您的核心能量充沛，如同大树扎根沃土。这意味着您有足够的能力去把握机会，但要注意避免过于强势，保持谦逊。',
    '偏弱': '您的核心能量相对温和，如同需要精心呵护的花木。这意味着您更需借助外力支持，贵人运对您尤为重要。',
    '均衡': '您的核心能量平衡协调，如春风化雨般自然。这意味着您能够灵活应对各种情况，处事得当。'
  }
  return explanations[balanceType] || '您的能量状态独特，需要在具体分析中了解。'
}

// 影响解释函数
const getImpactExplanation = (dayMaster: string, impactType: string) => {
  const elementMap: Record<string, string> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  }

  const element = elementMap[dayMaster] || '木'

  const impactExplanations: Record<string, string> = {
    '助力': `${element}命遇到火年，如同植物得到阳光滋养。这是能量的增益，让您在2026年如虎添翼，要抓住机会展现才能。`,
    '消耗': `${element}生火的关系意味着您需要持续输出精力来把握2026年的机会。这并非坏事，而是提醒您要劳逸结合，及时补充能量。`,
    '压力': `火对${element}形成挑战，如同烈日考验植物。这种压力会让您成长，但需要调整心态，化压力为动力。`,
    '机会': `火年为您带来新的可能性，就像开启一扇新的大门。要保持开放的心态，勇于尝试新事物。`
  }

  return impactExplanations[impactType] || '2026年的火局将对您产生独特的影响，需要在具体实践中体会。'
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  TrendingUp,
  Calendar,
  Users,
  Heart,
  Briefcase,
  DollarSign,
  Star,
  AlertCircle,
  Info,
  Download,
  ArrowLeft
} from 'lucide-react'
import { createClientStorage } from '@/lib/storage'

export default function ResultPage() {
  const router = useRouter()
  const [resultData, setResultData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadResult = async () => {
      try {
        const storage = createClientStorage()
        const data = await storage.getResult()

        if (!data) {
          // 没有结果，跳转到测评页
          router.replace('/test')
          return
        }

        setResultData(data)
      } catch (error) {
        console.error('加载结果失败:', error)
        router.replace('/test')
      } finally {
        setIsLoading(false)
      }
    }

    loadResult()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-eastern flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-eastern">正在加载您的运势报告...</p>
        </div>
      </div>
    )
  }

  if (!resultData) {
    return null
  }

  const resultSnapshot = resultData.result_snapshot
  const chartProfile = resultSnapshot?.chartProfile
  const userContext = resultSnapshot?.userContext
  const report = resultSnapshot?.report

  // 如果没有数据，显示错误
  if (!chartProfile || !userContext || !report) {
    return (
      <div className="min-h-screen bg-eastern flex items-center justify-center">
        <div className="text-center">
          <p className="text-eastern mb-4">数据加载异常，请重新测评</p>
          <Link href="/test">
            <Button>重新测评</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case '上升': return '📈'
      case '平稳': return '➡️'
      case '波动': return '📊'
      case '偏压力': return '📉'
      default: return '➡️'
    }
  }

  const domainIcons = {
    '事业': Briefcase,
    '财运': DollarSign,
    '婚恋': Heart,
    '健康': TrendingUp,
    '人际': Users
  }

  return (
    <div className="min-h-screen bg-eastern">
      {/* 导航栏 */}
      <nav className="border-b border-eastern/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-eastern hover:text-amber-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-eastern">您的2026运势报告</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="hidden md:flex"
            >
              <Download className="mr-2 h-4 w-4" />
              保存报告
            </Button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 总运概览 */}
        <Card className="mb-8 border-eastern/30 shadow-eastern">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-eastern">
              2026丙午年总运
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              {/* 总评分 */}
              <div>
                <div className="text-6xl font-bold mb-2">
                  <span className={getScoreColor(report.overall.score)}>
                    {report.overall.score}
                  </span>
                  <span className="text-3xl text-gray-500">/100</span>
                </div>
                <div className="w-full max-w-md mx-auto mb-4">
                  <Progress value={report.overall.score} className="h-3" />
                </div>
              </div>

              {/* 年度标题 */}
              <h2 className="text-2xl font-semibold text-eastern">
                {report.overall.headline}
              </h2>

              {/* 关键词 */}
              <div className="flex flex-wrap justify-center gap-2">
                {report.overall.keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-amber-100">
                    {keyword}
                  </Badge>
                ))}
              </div>

              {/* 核心建议 */}
              <div className="max-w-2xl mx-auto p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-amber-900">{report.overall.oneAdvice}</p>
              </div>

              {/* 命盘解读 - 新增 */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200 text-left">
                <h4 className="text-lg font-medium mb-4 text-amber-900 text-center">您的2026年命盘解读</h4>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* 核心特质 */}
                  <div className="p-4 bg-white rounded-lg border border-amber-100">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">🌱</span>
                      <h5 className="font-medium text-gray-900">核心特质：{chartProfile.dayMaster}木</h5>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {getDayMasterExplanation(chartProfile.dayMaster)}
                    </p>
                  </div>

                  {/* 能量状态 */}
                  <div className="p-4 bg-white rounded-lg border border-amber-100">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">⚖️</span>
                      <h5 className="font-medium text-gray-900">能量状态：{chartProfile.balanceType}</h5>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {getBalanceTypeExplanation(chartProfile.balanceType)}
                    </p>
                  </div>

                  {/* 2026年特质 */}
                  <div className="p-4 bg-white rounded-lg border border-amber-100">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">☀️</span>
                      <h5 className="font-medium text-gray-900">2026年特质：丙午火</h5>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      2026年是阳光充沛的火年，如同盛夏的烈日。丙火代表光明与热情，午火为火的极致，
                      这一年将为您带来展现自我的机会、充沛的活力和更多的社交能量。
                    </p>
                  </div>

                  {/* 相互影响 */}
                  <div className="p-4 bg-white rounded-lg border border-amber-100">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">💡</span>
                      <h5 className="font-medium text-gray-900">相互影响：{chartProfile.year2026Impact.type}</h5>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {getImpactExplanation(chartProfile.dayMaster, chartProfile.year2026Impact.type)}
                    </p>
                  </div>
                </div>

                {/* 简化命盘概览 */}
                <div className="text-center text-sm text-gray-600 mt-4 pt-4 border-t border-amber-200">
                  <span>日主：{chartProfile.dayMaster}木</span>
                  <span className="mx-2">|</span>
                  <span>格局：{chartProfile.balanceType}</span>
                  <span className="mx-2">|</span>
                  <span>流年：丙午火</span>
                  <span className="mx-2">|</span>
                  <span>影响：{chartProfile.year2026Impact.type}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 详细内容标签页 */}
        <Tabs defaultValue="domains" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="domains">五领域</TabsTrigger>
            <TabsTrigger value="months">12个月</TabsTrigger>
            <TabsTrigger value="basis">依据与逻辑</TabsTrigger>
          </TabsList>

          {/* 五领域运势 */}
          <TabsContent value="domains" className="space-y-4">
            {report.domains.map((domain: any, index: number) => {
              const Icon = domainIcons[domain.name as keyof typeof domainIcons]
              const isKeyDomain = (
                (userContext.useMatter === '求官' && domain.name === '事业') ||
                (userContext.useMatter === '求财' && domain.name === '财运') ||
                (userContext.useMatter === '婚恋' && domain.name === '婚恋') ||
                (userContext.useMatter === '康宁' && domain.name === '健康') ||
                (userContext.useMatter === '交游' && domain.name === '人际')
              )

              return (
                <Card
                  key={index}
                  className={`border-eastern/30 shadow-eastern ${
                    isKeyDomain ? 'ring-2 ring-amber-400' : ''
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-2 text-amber-600" />
                        <span className="text-eastern">{domain.name}</span>
                        {isKeyDomain && (
                          <Badge className="ml-2 bg-amber-600">重点</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl mr-2">
                          {getTrendIcon(domain.trend)}
                        </span>
                        <span className={`text-xl font-bold ${getScoreColor(domain.score)}`}>
                          {domain.score}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-semibold text-green-800 mb-1">亮点</p>
                        <p className="text-sm text-green-700">{domain.brightSpot}</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-semibold text-red-800 mb-1">需注意</p>
                        <p className="text-sm text-red-700">{domain.pitfall}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">行动建议</p>
                      <ul className="space-y-1">
                        {domain.actions.map((action: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {isKeyDomain && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm text-amber-800">
                          <strong>依据：</strong>{domain.basisLite}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {/* 12个月运势 */}
          <TabsContent value="months">
            <div className="grid gap-4">
              {report.months.map((month: any, index: number) => (
                <Card key={index} className="border-eastern/30 shadow-eastern">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-eastern">
                        {month.month}月
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={month.tag === '吉' ? 'default' : 'secondary'}>
                          {month.tag}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <strong>主题：</strong>{month.theme}
                      </p>
                      <p className="text-gray-700">
                        <strong>宜：</strong>{month.goodFor}
                      </p>
                      <p className="text-gray-700">
                        <strong>方法：</strong>{month.methodLite}
                      </p>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">提醒：</p>
                        <ul className="space-y-1">
                          {month.reminders.map((reminder: string, i: number) => (
                            <li key={i} className="text-sm text-gray-600">
                              • {reminder}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 依据与逻辑 */}
          <TabsContent value="basis">
            <div className="space-y-6">
              <Card className="border-eastern/30 shadow-eastern">
                <CardHeader>
                  <CardTitle className="text-eastern flex items-center">
                    <Info className="mr-2 h-5 w-5" />
                    理论依据
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {report.basis.theory}
                  </pre>
                </CardContent>
              </Card>

              <Card className="border-eastern/30 shadow-eastern">
                <CardHeader>
                  <CardTitle className="text-eastern">推演规则</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {report.basis.rules}
                  </pre>
                </CardContent>
              </Card>

              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    免责声明
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {report.basis.disclaimer}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4 pb-8">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="md:hidden"
          >
            <Download className="mr-2 h-4 w-4" />
            保存报告
          </Button>
          <Link href="/method">
            <Button variant="outline">
              了解更多
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
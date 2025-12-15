'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// 日主解释函数 - 增强版，包含专业术语解释
const getDayMasterExplanation = (dayMaster: string) => {
  const explanations: Record<string, string> = {
    '甲': `您如参天大树，性格正直坚强，有领导才能，做事积极进取。甲木之人有强烈的责任心和担当精神。

命理解读：
• 什么是甲木：甲木为十天干之首，阳木之性，如参天大树，代表正直、进取、领导才能
• 为什么是您的核心特质：您的八字日柱天干为甲，甲木即为您的"日元"（命主），是整个命盘分析的核心
• 甲木玄机：甲木主仁，有生发之象，得天时地利则成栋梁之材，代表您具备担当重任的命格特质`,

    '乙': `您如柔韧的藤蔓植物，适应力强，善于在变化环境中成长。乙木之人性格温和，具有顽强的生命力和灵活的处事方式。

命理解读：
• 什么是乙木：乙木为阴木之性，如花草藤蔓，代表柔韧、变通、适应力强
• 为什么是您的核心特质：您的八字日柱天干为乙，乙木即为您的"日元"，命主之性
• 乙木玄机：乙木主曲，有盘根错节之象，虽柔弱但生命力顽强，代表您在逆境中仍能茁壮成长`,

    '丙': `您如熊熊烈火，热情开朗，充满活力和创造力。丙火之人善于表达，有很强的感染力和领导魅力。

命理解读：
• 什么是丙火：丙火为阳火之性，如太阳烈火，代表热情、表达、领导魅力
• 为什么是您的核心特质：您的八字日柱天干为丙，丙火即为您的"日元"，命主本性
• 丙火玄机：丙火主礼，有光明显达之象，得天时则光芒万丈，代表您具备照亮他人的领袖气质`,

    '丁': `您如温和的烛光，细腻敏感，富有同情心和洞察力。丁火之人内心温暖，善于照顾他人感受。

命理解读：
• 什么是丁火：丁火为阴火之性，如烛光灯火，代表细腻、温暖、洞察力
• 为什么是您的核心特质：您的八字日柱天干为丁，丁火即为您的"日元"，命主之质
• 丁火玄机：丁火主智，有幽微烛照之象，虽不耀眼但持久温暖，代表您具备洞察人心的智慧`,

    '戊': `您如厚重大地，稳重踏实，有很强的包容心和责任感。戊土之人诚实可靠，是值得信赖的依靠。

命理解读：
• 什么是戊土：戊土为阳土之性，如高山厚土，代表稳重、包容、责任心
• 为什么是您的核心特质：您的八字日柱天干为戊，戊土即为您的"日元"，命主之基
• 戊土玄机：戊土主信，有载万物之德，得水润则生机勃勃，代表您具备承载重任的品格`,

    '己': `您如田园沃土，温和滋润，有很强的 nurturing 能力。己土之人细腻体贴，善于创造和谐环境。

命理解读：
• 什么是己土：己土为阴土之性，如田园泥土，代表温和、滋润、培育能力
• 为什么是您的核心特质：您的八字日柱天干为己，己土即为您的"日元"，命主之本
• 己土玄机：己土主润，有滋生万物之能，得木助则生机盎然，代表您具备培育他人的慈爱之心`,

    '庚': `您如锋利刀剑，果断刚毅，有很强的决断力和执行力。庚金之人讲义气，做事干脆利落。

命理解读：
• 什么是庚金：庚金为阳金之性，如刀剑斧钺，代表刚毅、决断、执行力
• 为什么是您的核心特质：您的八字日柱天干为庚，庚金即为您的"日元"，命主之性
• 庚金玄机：庚金主义，有刚健决断之威，得火炼则成利器，代表您具备决断果敢的领袖之才`,

    '辛': `您如精美珠宝，细致优雅，有很强的审美能力和鉴赏力。辛金之人追求完美，注重品质。

命理解读：
• 什么是辛金：辛金为阴金之性，如珠宝首饰，代表细致、优雅、审美能力
• 为什么是您的核心特质：您的八字日柱天干为辛，辛金即为您的"日元"，命主之质
• 辛金玄机：辛金主华，有璀璨夺目之美，得土养则价值连城，代表您具备追求完美的精致品味`,

    '壬': `您如江河大海，聪慧灵活，有很强的适应能力和包容性。壬水之人思路开阔，善于变通。

命理解读：
• 什么是壬水：壬水为阳水之性，如江河大海，代表智慧、变通、包容性
• 为什么是您的核心特质：您的八字日柱天干为壬，壬水即为您的"日元"，命主之性
• 壬水玄机：壬水主智，有容纳百川之量，得土制则安澜，代表您具备海纳百川的智慧胸襟`,

    '癸': `您如清泉雨露，纯净温柔，有很强的直觉和感悟能力。癸水之人内心丰富，善于理解他人。

命理解读：
• 什么是癸水：癸水为阴水之性，如清泉雨露，代表纯净、温柔、直觉力
• 为什么是您的核心特质：您的八字日柱天干为癸，癸水即为您的"日元"，命主之本
• 癸水玄机：癸水主慈，有润泽万物之德，得火照则晶莹剔透，代表您具备感化他人的慈悲心性`
  }
  return explanations[dayMaster] || '您的命格独特，需要在具体分析中了解。'
}

// 格局解释函数 - 增强版，包含专业术语解释
const getBalanceTypeExplanation = (balanceType: string) => {
  const explanations: Record<string, string> = {
    '偏强': `您的核心能量充沛，如同大树扎根沃土。这意味着您有足够的能力去把握机会，但要注意避免过于强势，保持谦逊。

命理解读：
• 什么是身强格局：您的八字日主得令、得势、得地，五行力量偏强，形成身强的命格
• 为什么形成此格局：您的生辰八字中，帮扶日主的五行力量较多，克制日主的力量相对较弱
• 身强玄机：身强者宜泄宜克，需要通过食伤泄秀或官杀制衡来达到命局平衡，代表您天生具备较强的把握机遇能力`,

    '偏弱': `您的核心能量相对温和，如同需要精心呵护的花木。这意味着您更需借助外力支持，贵人运对您尤为重要。

命理解读：
• 什么是身弱格局：您的八字日主失令、失势、失地，五行力量偏弱，形成身弱的命格
• 为什么形成此格局：您的生辰八字中，克制日主的五行力量较多，帮扶日主的力量相对不足
• 身弱玄机：身弱者宜帮扶，需要通过印星生扶或比劫相助来增强命局，代表您需要借助外力方能成就大业`,

    '均衡': `您的核心能量平衡协调，如春风化雨般自然。这意味着您能够灵活应对各种情况，处事得当。

命理解读：
• 什么是中和格局：您的八字日主力量适中，五行配置相对均衡，形成中和的理想命格
• 为什么形成此格局：您的生辰八字中，帮扶与克制日主的力量相对平衡，五行流转有情
• 中和玄机：中和者为贵，无需特别调候就能适应环境变化，代表您具备处事得当的天然智慧`
  }
  return explanations[balanceType] || '您的能量状态独特，需要在具体分析中了解。'
}

// 影响解释函数 - 增强版，包含流年神煞和十神关系
const getImpactExplanation = (dayMaster: string, impactType: string) => {
  const elementMap: Record<string, string> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  }

  const tenGodMap: Record<string, string> = {
    '甲': '丙火为伤官', '乙': '丙火为食神',
    '丙': '丙火为比肩', '丁': '丙火为劫财',
    '戊': '丙火为偏印', '己': '丙火为正印',
    '庚': '丙火为七杀', '辛': '丙火为正官',
    '壬': '丙火为偏财', '癸': '丙火为正财'
  }

  const element = elementMap[dayMaster] || '木'
  const tenGodRelation = tenGodMap[dayMaster] || '丙火为伤官'

  const impactExplanations: Record<string, string> = {
    '助力': `${element}命遇到丙午火年，${tenGodRelation}，形成食伤泄秀或比肩助力的格局。

命理解读：
• 流年天机：2026年丙午火与您的日主形成相生关系，如同植物得到阳光滋养
• 十神玄机：${tenGodRelation}，代表此年利于发挥才华、展现能力
• 运势推演：这是流年用神到位的表现，让您在2026年如虎添翼，要抓住机会展现才能`,

    '消耗': `${element}命遇到丙午火年，${tenGodRelation}，形成身弱泄气的格局。

命理解读：
• 流年天机：2026年丙午火需要您的日主来生，形成能量输出的关系
• 十神玄机：${tenGodRelation}，代表此年需要您持续输出精力来把握机会
• 运势推演：这并非坏事，而是提醒您要劳逸结合，及时补充能量，做好时间管理`,

    '压力': `${element}命遇到丙午火年，${tenGodRelation}，形成官杀克身或财星耗身的格局。

命理解读：
• 流年天机：2026年丙午火对您的日主形成挑战，如同烈日考验植物
• 十神玄机：${tenGodRelation}，代表此年会有压力但也是成长的机会
• 运势推演：这种压力会让您成长，但需要调整心态，化压力为动力，注意调节身心`,

    '机会': `${element}命遇到丙午火年，${tenGodRelation}，形成新的运势格局。

命理解读：
• 流年天机：2026年丙午火为您带来新的可能性，如同开启一扇新的大门
• 十神玄机：${tenGodRelation}，代表此年会有新的机遇和挑战出现
• 运势推演：要保持开放的心态，勇于尝试新事物，把握流年带来的转机`
  }

  return impactExplanations[impactType] || '2026年的火局将对您产生独特的影响，需要在具体实践中体会。'
}

// 领域运势专业解读函数
const getDomainExplanation = (domainName: string, dayMaster: string, balanceType: string) => {
  const domainExplanations: Record<string, string> = {
    '财运': `丙午火年对您财运的影响深远，需要从正财偏财两方面来分析。

命理解读：
• 财星天机：火于您的命局为${dayMaster === '壬' || dayMaster === '癸' ? '财星透干' : '食伤生财'}，此年财运显现
• 流年财运：2026年适合${balanceType === '偏强' ? '投资理财、扩大经营' : '稳中求进、积累资本'}
• 财神方位：东南方、正南方为您的财位，可多活动于这些方位
• 催财法门：佩戴红玛瑙、石榴石等火属性助财饰品`,

    '事业': `丙午流年为您的事业发展带来新的转机，官印配合方能成就大业。

命理解读：
• 官星天机：火于您的命局为${dayMaster === '庚' || dayMaster === '辛' ? '官星当值' : '食伤制杀'}，利事业发展
• 流年官运：2026年适合${balanceType === '偏强' ? '担当重任、晋升掌权' : '稳扎稳打、积累资历'}
• 贵人方位：正南方、西北方为贵人位，多接触属马、属羊之人
• 旺运法门：多着红色、紫色衣物，增强火性能量`,

    '婚恋': `丙午火年对您的情感世界产生重要影响，需要把握桃花时机。

命理解读：
• 桃花天机：2026年为${dayMaster === '丙' || dayMaster === '丁' ? '比肩夺财' : '桃花星动'}之年，情感机遇显现
• 流年情缘：${balanceType === '偏强' ? '热情主动易得良缘' : '温和内敛需主动出击'}
• 桃花方位：正南方为桃花位，多参加社交活动
• 和合法门：可佩戴粉晶、红纹石增旺桃花运`,

    '健康': `丙午火年需要特别注意火气过旺对健康的影响。

命理解读：
• 健康天机：火旺之年易犯心火过旺、肝气郁结之症
• 流年养生：宜多食梨、百合、银耳等润燥之物
• 保健方位：东方、北方为养身佳位
• 护身法门：练习太极、冥想等平心静气的功夫`,

    '人际': `丙午火年有利于扩大社交圈，增强人际关系。

命理解读：
• 人缘天机：火年热情主动，人际关系日渐活跃
• 社交方位：南方、东南方为贵人聚集之地
• 人脉法门：多参与集体活动，主动结交新朋友`
  }

  return domainExplanations[domainName] || '此领域运势需要结合个人命局具体分析。'
}

// 整体运势综合分析函数
const getOverallAnalysis = (dayMaster: string, balanceType: string, overallScore: number) => {
  const seasonMap: Record<string, string> = {
    '甲': '春季生发，木气旺盛', '乙': '春季柔美，草木葱茏',
    '丙': '夏季炎炎，火势正旺', '丁': '夏季温馨，灯火通明',
    '戊': '四季末，土气厚重', '己': '四季末，土质温润',
    '庚': '秋季肃杀，金气刚健', '辛': '秋季清爽，金光闪耀',
    '壬': '冬季寒冽，水势滔滔', '癸': '冬季纯净，水流清澈'
  }

  const season = seasonMap[dayMaster] || '四季轮转'

  const scoreLevel = overallScore >= 80 ? '上等运势' : overallScore >= 60 ? '中等运势' : '偏弱运势'

  return `天道玄机

您的${dayMaster}命，${season}，今逢丙午流年，火势冲天，乃是大运流转之关键节点。

命理格局
• 日主天机：${dayMaster}为本命日元，${balanceType === '偏强' ? '气势如虹，正值鼎盛' : balanceType === '偏弱' ? '温和含蓄，需待时机' : '中和得体，运势平稳'}
• 流年玄机：丙午火年${dayMaster === '壬' || dayMaster === '癸' ? '财星高照，正偏财并现' : dayMaster === '庚' || dayMaster === '辛' ? '官星当值，事业有成' : '食伤吐秀，才华展现'}
• 吉凶神煞：${dayMaster === '甲' || dayMaster === '乙' ? '有食神制杀，转危为安' : dayMaster === '丙' || dayMaster === '丁' ? '比肩助身，朋友相助' : dayMaster === '戊' || dayMaster === '己' ? '印星生身，贵人提携' : dayMaster === '庚' || dayMaster === '辛' ? '七杀有制，威权显达' : '财星透干，名利双收'}

运势推演
综合评分${overallScore}分，属${scoreLevel}。${overallScore >= 80 ? '此年诸事顺遂，可大胆进取，把握良机。' : overallScore >= 60 ? '此年平稳中有发展机会，需稳扎稳打，循序渐进。' : '此年挑战与机遇并存，需谨慎应对，厚积薄发。'}

趋吉避凶
• 吉方：正南、东南为您的贵人方位，多活动于此地可增旺运势
• 吉色：红、紫、橙等火属性色彩为您带来好运
• 吉时：午时（11:00-13:00）为一天中气场最旺之时，重要事务可在此时段进行`
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

              {/* 专业综合分析 */}
              <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-amber-50 to-red-50 rounded-lg border border-amber-200 text-left">
                <h4 className="text-lg font-medium mb-4 text-amber-900 text-center">专业综合分析</h4>
                <div className="text-sm text-amber-900 space-y-3 whitespace-pre-line">
                  {getOverallAnalysis(chartProfile.dayMaster, chartProfile.balanceType, report.overall.score)}
                </div>
              </div>

              {/* 命盘解读 - 新增 */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200 text-left">
                <h4 className="text-lg font-medium mb-4 text-amber-900 text-center">您的2026年命盘解读</h4>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* 核心特质 */}
                  <div className="p-4 bg-white rounded-lg border border-amber-100">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">🌱</span>
                      <h5 className="font-medium text-gray-900">核心特质：{chartProfile.dayMaster}</h5>
                    </div>
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {getDayMasterExplanation(chartProfile.dayMaster)}
                    </div>
                  </div>

                  {/* 能量状态 */}
                  <div className="p-4 bg-white rounded-lg border border-amber-100">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">⚖️</span>
                      <h5 className="font-medium text-gray-900">能量状态：{chartProfile.balanceType}</h5>
                    </div>
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {getBalanceTypeExplanation(chartProfile.balanceType)}
                    </div>
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
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {getImpactExplanation(chartProfile.dayMaster, chartProfile.year2026Impact.type)}
                    </div>
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

                    {/* 专业命理解读 */}
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                      <p className="text-sm font-semibold text-amber-900 mb-3">专业命理解读</p>
                      <div className="text-xs text-amber-800 space-y-2 whitespace-pre-line">
                        {getDomainExplanation(domain.name, chartProfile.dayMaster, chartProfile.balanceType)}
                      </div>
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

              {/* 专业术语解释库 */}
              <Card className="border-eastern/30 shadow-eastern">
                <CardHeader>
                  <CardTitle className="text-eastern">专业术语解释</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="tian-gan-di-zhi">
                      <AccordionTrigger className="text-left">天干地支</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm text-gray-700 space-y-2">
                          <p>十天干：甲、乙、丙、丁、戊、己、庚、辛、壬、癸</p>
                          <p>• 甲乙属木，丙丁属火，戊己属土，庚辛属金，壬癸属水</p>
                          <p>• 甲丙戊庚壬为阳，乙丁己辛癸为阴</p>
                          <p>十二地支：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥</p>
                          <p>• 寅卯属木，巳午属火，申酉属金，亥子属水，辰戌丑未属土</p>
                          <p>• 子寅辰午申戌为阳，丑卯巳未酉亥为阴</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="shi-shen">
                      <AccordionTrigger className="text-left">十神关系</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm text-gray-700 space-y-2">
                          <p>比劫：比肩、劫财 - 同性为比肩，异性为劫财</p>
                          <p>• 代表：同辈、朋友、兄弟、竞争者、合作伙伴</p>
                          <p>食伤：食神、伤官 - 同性为食神，异性为伤官</p>
                          <p>• 代表：才华、创意、表达、子女、下属、技艺</p>
                          <p>财星：正财、偏财 - 同性为正财，异性为偏财</p>
                          <p>• 代表：财富、妻子、父亲、物质、经营能力</p>
                          <p>官杀：正官、七杀 - 同性为正官，异性为七杀</p>
                          <p>• 代表：事业、权力、压力、子女、约束、法律</p>
                          <p>印星：正印、偏印 - 同性为正印，异性为偏印</p>
                          <p>• 代表：学习、贵人、母亲、依靠、知识、支持</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="liu-nian">
                      <AccordionTrigger className="text-left">流年神煞</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm text-gray-700 space-y-2">
                          <p>流年：指当年的天干地支，每年不同</p>
                          <p>2026丙午年：天干丙火，地支午火，火势旺盛</p>
                          <p>• 丙火为太阳之火，代表光明、热情、表达</p>
                          <p>• 午火为炉中之火，代表极致、热烈、创造力</p>
                          <p>神煞：命理中的吉凶星煞</p>
                          <p>• 吉神：天乙贵人、文昌、禄神等</p>
                          <p>• 凶煞：桃花煞、劫煞、灾煞等</p>
                          <p>岁君并临：流年与命局相互作用的重要时刻</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="yong-shen">
                      <AccordionTrigger className="text-left">用神喜忌</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm text-gray-700 space-y-2">
                          <p>用神：命局中对自己有利的五行</p>
                          <p>• 身强者：以克、泄、耗为用神</p>
                          <p>• 身弱者：以生、帮为用神</p>
                          <p>喜神：生扶用神的五行</p>
                          <p>忌神：克制用神的五行</p>
                          <p>仇神：生扶忌神的五行</p>
                          <p>2026年用神：根据个人日主强弱而定</p>
                          <p>• 火命：以水土为用神</p>
                          <p>• 水命：以木火为用神</p>
                          <p>• 木命：以火土为用神</p>
                          <p>• 金命：以水木为用神</p>
                          <p>• 土命：以金水为用神</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="ge-ju">
                      <AccordionTrigger className="text-left">格局种类</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm text-gray-700 space-y-2">
                          <p>身强格局：日主力量充足</p>
                          <p>• 特征：得令、得势、得地</p>
                          <p>• 宜用：克、泄、耗</p>
                          <p>身弱格局：日主力量不足</p>
                          <p>• 特征：失令、失势、失地</p>
                          <p>• 宜用：生、帮</p>
                          <p>中和格局：日主力量平衡</p>
                          <p>• 特征：五行配置均衡</p>
                          <p>• 宜用：顺其自然</p>
                          <p>特殊格局：从格、化格等</p>
                          <p>• 从格：顺从最旺五行</p>
                          <p>• 化格：日主合化成其他五行</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
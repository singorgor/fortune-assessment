'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, BookOpen, Info, AlertCircle, Star } from 'lucide-react'

export default function MethodPage() {
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
              <h1 className="text-xl font-bold text-eastern">依据与逻辑</h1>
            </div>
            <Link href="/test">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                开始测评
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* 理论依据 */}
        <Card className="border-eastern/30 shadow-eastern">
          <CardHeader>
            <CardTitle className="text-eastern flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              理论依据
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">四柱八字子平法</h3>
              <p className="text-gray-700 leading-relaxed">
                四柱八字，又称子平术，是中国传统命理学的重要组成部分。通过分析人出生年、月、日、时的天干地支组合，
                揭示个人的性格特点、运势起伏和人生轨迹。本次测评采用经典的子平法体系，结合现代应用需求进行简化。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">核心典籍参考</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">《渊海子平》</h4>
                  <p className="text-sm text-amber-800">
                    宋代徐升编著，是八字命理的奠基之作，系统阐述了十神、神煞等核心概念。
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">《三命通会》</h4>
                  <p className="text-sm text-amber-800">
                    明代万民英著，收录了大量命理实例和理论，是研究命理的重要参考文献。
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">《子平真诠》</h4>
                  <p className="text-sm text-amber-800">
                    清代沈孝瞻著，深入阐述了格局理论，对格局的取用有独到见解。
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">《滴天髓》</h4>
                  <p className="text-sm text-amber-800">
                    相传为宋代京图所著，用韵文形式阐述命理精髓，深奥难解但价值极高。
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">核心要素简介</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="daymaster">
                  <AccordionTrigger>日主</AccordionTrigger>
                  <AccordionContent>
                    日主是出生日的天干，代表命主本人。日主的五行属性决定了整个命盘的基本性质，
                    是分析旺衰、选取用神的核心。十天干各有特性：甲木参天、乙木草莽、丙火太阳、
                    丁火烛光、戊土高山、己土田园、庚金顽铁、辛金珠玉、壬水江河、癸水雨露。
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fiveelements">
                  <AccordionTrigger>五行</AccordionTrigger>
                  <AccordionContent>
                    金、木、水、火、土是构成万物的基本元素，之间存在相生相克关系。
                    相生：木生火、火生土、土生金、金生水、水生木。
                    相克：木克土、土克水、水克火、火克金、金克木。
                    命盘中五行的平衡状态决定了运势的吉凶。
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tengods">
                  <AccordionTrigger>十神</AccordionTrigger>
                  <AccordionContent>
                    十神是以日主为中心，分析其他干支与日主关系的十个概念：
                    <br /><br />
                    <strong>比劫：</strong>比肩、劫财 - 代表同辈、朋友、竞争
                    <br />
                    <strong>食伤：</strong>食神、伤官 - 代表表达、创意、子女
                    <br />
                    <strong>财星：</strong>正财、偏财 - 代表财富、父亲、妻子
                    <br />
                    <strong>官杀：</strong>正官、七杀 - 代表事业、压力、子女
                    <br />
                    <strong>印星：</strong>正印、偏印 -代表学习、贵人、母亲
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="bingwu">
                  <AccordionTrigger>2026丙午流年</AccordionTrigger>
                  <AccordionContent>
                    2026年为丙午年，天干丙火，地支午火，是火旺之年。火代表热情、表达、创意、礼仪等。
                    丙午年的特点：
                    <br /><br />
                    • 火势旺盛，利于发挥才华
                    <br />
                    • 表达欲强，适合社交展示
                    <br />
                    • 需注意水火平衡，防心火过旺
                    <br />
                    • 对不同日主产生不同影响
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>

        {/* 推演逻辑 */}
        <Card className="border-eastern/30 shadow-eastern">
          <CardHeader>
            <CardTitle className="text-eastern flex items-center">
              <Info className="mr-2 h-5 w-5" />
              推演逻辑
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">排盘规则</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">年柱</h4>
                  <p className="text-sm text-gray-700">
                    以立春为年界，而非农历正月初一。立春是二十四节气之首，通常在公历2月4日左右。
                    年柱代表祖上、早年运势和基础。
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">月柱</h4>
                  <p className="text-sm text-gray-700">
                    按节气分月，一年十二个月对应十二个节气。每月从节气交节开始，而非农历初一。
                    月柱代表父母、青年运势和事业基础。
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">日柱</h4>
                  <p className="text-sm text-gray-700">
                    每日一字，60甲子循环。日柱代表自己和配偶，是命盘的核心。
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">时柱</h4>
                  <p className="text-sm text-gray-700">
                    一个时辰两小时，共十二时辰。子时23:00-1:00，丑时1:00-3:00，以此类推。
                    时柱代表子女、晚年运势和事业成就。
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">分析框架</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Badge className="mr-3 bg-amber-600">1</Badge>
                  <div>
                    <p className="font-medium">确定日主</p>
                    <p className="text-sm text-gray-600">以日干为核心，分析命盘结构</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-3 bg-amber-600">2</Badge>
                  <div>
                    <p className="font-medium">分析五行</p>
                    <p className="text-sm text-gray-600">统计四柱干支五行力量，判断旺衰</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-3 bg-amber-600">3</Badge>
                  <div>
                    <p className="font-medium">排出十神</p>
                    <p className="text-sm text-gray-600">分析各干支与日主关系，确定十神</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-3 bg-amber-600">4</Badge>
                  <div>
                    <p className="font-medium">选取用神</p>
                    <p className="text-sm text-gray-600">根据旺衰选取有利五行作为用神</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-3 bg-amber-600">5</Badge>
                  <div>
                    <p className="font-medium">流年分析</p>
                    <p className="text-sm text-gray-600">分析丙午流年与命盘的生克关系</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-3 bg-amber-600">6</Badge>
                  <div>
                    <p className="font-medium">结合用事</p>
                    <p className="text-sm text-gray-600">根据用户选择的关注重点，给出针对性建议</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 特色说明 */}
        <Card className="border-eastern/30 shadow-eastern">
          <CardHeader>
            <CardTitle className="text-eastern flex items-center">
              <Star className="mr-2 h-5 w-5" />
              产品特色
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">简化易懂</h4>
                <p className="text-sm text-gray-700">
                  我们将复杂的命理知识简化为易于理解的内容，避免过多术语，
                  让每个人都能读懂自己的运势报告。
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">个性化建议</h4>
                <p className="text-sm text-gray-700">
                  结合您的处境选择和运势打法，提供针对性的行动建议，
                  而不是泛泛而谈的运势分析。
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">积极正向</h4>
                <p className="text-sm text-gray-700">
                  报告内容积极向上，强调个人能动性，避免恐吓性语言，
                  提供切实可行的改进建议。
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">隐私保护</h4>
                <p className="text-sm text-gray-700">
                  所有计算在本地完成，数据不会上传到服务器，
                  全程保护您的隐私安全。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 免责声明 */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              免责声明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• 本测评仅供娱乐参考，不构成投资、医疗、法律等专业建议</p>
              <p>• 命理分析博大精深，此处仅为简化解读，不可作为决策依据</p>
              <p>• 运势是动态变化的，重要的是保持积极心态，努力奋斗</p>
              <p>• 请理性看待，切勿过度迷信或沉溺其中</p>
              <p>• 如遇重大决策，请咨询专业人士意见</p>
            </div>
          </CardContent>
        </Card>

        {/* 快速开始 */}
        <div className="text-center pb-8">
          <Link href="/test">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8">
              立即开始测评
            </Button>
          </Link>
          <p className="mt-3 text-sm text-gray-600">
            准确填写信息，获取您的专属2026运势报告
          </p>
        </div>
      </main>
    </div>
  )
}
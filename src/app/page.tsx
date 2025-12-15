'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Calendar, TrendingUp, BookOpen, Users, Heart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-eastern">
      {/* 导航栏 */}
      <nav className="border-b border-eastern/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-eastern">丙午命盘</h1>
            <div className="flex gap-4">
              <Link href="/method" className="text-eastern hover:text-amber-700 transition-colors">
                依据与逻辑
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* 标题部分 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-eastern mb-4">
            2026丙午·命盘运势推演录
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            基于传统八字智慧，为你解读2026年运势趋势
          </p>
          <Link href="/test">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
              <Sparkles className="mr-2 h-5 w-5" />
              开始测算
            </Button>
          </Link>
        </div>

        {/* 产品特点 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-eastern/30 shadow-eastern">
            <CardHeader>
              <Calendar className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-eastern">四柱八字</CardTitle>
              <CardDescription>
                精确分析年月日时，解读命盘格局
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-eastern/30 shadow-eastern">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-eastern">丙午流年</CardTitle>
              <CardDescription>
                2026火运当值，洞察年度运势走向
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-eastern/30 shadow-eastern">
            <CardHeader>
              <Users className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-eastern">个性化建议</CardTitle>
              <CardDescription>
                结合处境选择，提供定制化行动指南
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 快速了解 */}
        <Card className="mb-12 border-eastern/30 shadow-eastern">
          <CardHeader>
            <CardTitle className="text-eastern flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              快速了解
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="what-is-bazi">
                <AccordionTrigger>什么是八字命盘？</AccordionTrigger>
                <AccordionContent>
                  八字命盘，又称四柱推命，是通过分析人出生年、月、日、时的天干地支组合，
                  揭示个人性格特点、运势起伏的传统文化智慧。本次测评基于《渊海子平》、
                  《三命通会》等典籍，运用简化的子平法进行分析。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="process">
                <AccordionTrigger>测评流程是怎样的？</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-amber-600">1</Badge>
                      <span>输入出生信息（年月日时）</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-amber-600">2</Badge>
                      <span>选择用事与处境（关注重点）</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-amber-600">3</Badge>
                      <span>获取专属2026运势报告</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="report">
                <AccordionTrigger>报告包含哪些内容？</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 text-sm">
                    <p>• <strong>总运</strong>：年度评分、关键词、核心建议</p>
                    <p>• <strong>五领域</strong>：事业、财运、婚恋、健康、人际的详细分析</p>
                    <p>• <strong>12个月</strong>：逐月节气运势提示</p>
                    <p>• <strong>推演依据</strong>：传统命理原理说明</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* 五领域预览 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-eastern mb-8">
            五大领域运势分析
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { name: '事业', icon: TrendingUp, color: 'text-blue-600' },
              { name: '财运', icon: Sparkles, color: 'text-green-600' },
              { name: '婚恋', icon: Heart, color: 'text-red-600' },
              { name: '健康', icon: Calendar, color: 'text-purple-600' },
              { name: '人际', icon: Users, color: 'text-orange-600' }
            ].map((domain) => (
              <Card key={domain.name} className="text-center border-eastern/30">
                <CardContent className="pt-6">
                  <domain.icon className={`h-8 w-8 mx-auto mb-3 ${domain.color}`} />
                  <h3 className="font-semibold text-eastern">{domain.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    趋势分析 · 行动建议
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 免责声明 */}
        <div className="text-center text-sm text-gray-600 border-t pt-8">
          <p>
            本测评仅供娱乐参考，不构成投资、医疗、法律等专业建议。
            理性看待，积极生活。
          </p>
        </div>
      </main>
    </div>
  )
}
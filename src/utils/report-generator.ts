import { ChartProfile, UserContext, Report } from '@/types'
import { monthSolarTerms, year2026Themes } from '@/data/constants'

/**
 * 生成完整的运势报告
 */
export function generateReport(chartProfile: ChartProfile, userContext: UserContext): Report {
  // 生成总体运势
  const overall = generateOverall(chartProfile, userContext)

  // 生成五大领域运势
  const domains = generateDomains(chartProfile, userContext)

  // 生成12个月运势
  const months = generateMonths(chartProfile, userContext)

  // 生成依据说明
  const basis = generateBasis()

  return {
    overall,
    domains,
    months,
    basis
  }
}

/**
 * 生成总体运势 - 大幅优化版
 */
function generateOverall(chartProfile: ChartProfile, userContext: UserContext) {
  const { dayMaster, fiveElements, balanceType, year2026Impact } = chartProfile
  const { useMatter, strategy, situation } = userContext

  // 更复杂的分数计算系统
  let baseScore = 50 // 降低基础分，增加差异化空间

  // 1. 流年影响（核心因素，权重30%）
  const impactScores: Record<string, number> = {
    '大助': 25,
    '助力': 15,
    '机会': 10,
    '消耗': 0,
    '压力': -10,
    '挑战': -15
  }
  baseScore += impactScores[year2026Impact.type] || 0

  // 2. 身强身弱与流年匹配度（权重20%）
  const matchingBonus = calculateBalanceStrategyMatch(balanceType, year2026Impact.type, strategy)
  baseScore += matchingBonus

  // 3. 用事与流年匹配度（权重20%）
  const matterBonus = calculateMatterAlignment(useMatter, year2026Impact.type, dayMaster)
  baseScore += matterBonus

  // 4. 五行调和度（权重15%）
  const harmonyBonus = calculateFiveElementHarmony(fiveElements, year2026Impact.type)
  baseScore += harmonyBonus

  // 5. 处境细节影响（权重15%）
  const situationBonus = calculateSituationImpact(useMatter, situation, year2026Impact.type)
  baseScore += situationBonus

  // 限制分数范围
  const score = Math.max(25, Math.min(98, baseScore))

  // 生成更精准的标题
  const headline = generatePersonalizedHeadline(year2026Impact.type, useMatter, balanceType, score)

  // 生成个性化关键词
  const keywords = generatePersonalizedKeywords(year2026Impact.type, useMatter, balanceType, situation)

  // 生成针对性建议
  const oneAdvice = generatePersonalizedAdvice(year2026Impact.type, useMatter, strategy, balanceType)

  return {
    score,
    headline,
    keywords,
    oneAdvice
  }
}

/**
 * 计算身强身弱与策略的匹配度
 */
function calculateBalanceStrategyMatch(
  balanceType: string,
  impactType: string,
  strategy: string
): number {
  let score = 0

  // 根据身强身弱和流年影响，判断策略是否合适
  if (balanceType === '过旺' || balanceType === '偏强') {
    if (impactType === '压力' || impactType === '挑战') {
      score += strategy === '稳守' ? 8 : strategy === '先守后攻' ? 6 : -2
    } else if (impactType === '消耗') {
      score += strategy === '进取' ? 10 : strategy === '先攻后守' ? 5 : 0
    }
  } else if (balanceType === '过弱' || balanceType === '偏弱') {
    if (impactType === '大助' || impactType === '助力') {
      score += strategy === '进取' ? 10 : strategy === '先攻后守' ? 6 : 2
    } else if (impactType === '压力' || impactType === '挑战') {
      score += strategy === '稳守' ? 12 : strategy === '先守后攻' ? 8 : -5
    }
  } else { // 中和
    score += strategy === '先守后攻' ? 6 : strategy === '先攻后守' ? 5 : 3
  }

  return score
}

/**
 * 计算用事与流年的匹配度
 */
function calculateMatterAlignment(
  useMatter: string,
  impactType: string,
  dayMaster: string
): number {
  const alignmentMap: Record<string, Record<string, number>> = {
    '求官': {
      '大助': 12, '助力': 8, '机会': 10, '消耗': 2,
      '压力': 6, '挑战': 8
    },
    '求财': {
      '大助': 6, '助力': 4, '机会': 12, '消耗': 0,
      '压力': 2, '挑战': 10
    },
    '婚恋': {
      '大助': 10, '助力': 12, '机会': 8, '消耗': 6,
      '压力': -2, '挑战': 4
    },
    '康宁': {
      '大助': 4, '助力': 6, '机会': 4, '消耗': -2,
      '压力': -8, '挑战': -6
    },
    '交游': {
      '大助': 12, '助力': 10, '机会': 8, '消耗': 4,
      '压力': 2, '挑战': 6
    }
  }

  return alignmentMap[useMatter]?.[impactType] || 0
}

/**
 * 计算五行调和度
 */
function calculateFiveElementHarmony(
  elements: Record<string, number>,
  impactType: string
): number {
  const values = Object.values(elements)
  const avg = values.reduce((a, b) => a + b, 0) / values.length

  // 计算五行平衡度
  const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length
  const balance = 1 - (Math.sqrt(variance) / avg) // 平衡度系数

  // 火运之年，火元素的协调性更重要
  const fireElement = elements['火']
  const fireHarmony = fireElement > 0 ? Math.min(fireElement / avg, 2) : 0.5

  let score = Math.round(balance * 10)

  if (impactType === '消耗' || impactType === '压力') {
    score -= Math.round((fireElement - avg) / avg * 5) // 火太旺则扣分
  } else {
    score += Math.round(fireHarmony * 3) // 火旺则加分
  }

  return Math.max(-5, Math.min(10, score))
}

/**
 * 计算处境细节影响
 */
function calculateSituationImpact(
  useMatter: string,
  situation: string,
  impactType: string
): number {
  // 根据具体处境给出细微调整
  const impactKeywords: Record<string, string[]> = {
    '积极向上': ['提升', '机会', '发展', '合作', '突破'],
    '中性平稳': ['稳定', '平衡', '过渡', '调整', '积累'],
    '负面挑战': ['压力', '竞争', '挑战', '困难', '风险']
  }

  let category: '积极向上' | '中性平稳' | '负面挑战' = '中性平稳'

  for (const keyword of situation) {
    if (impactKeywords['积极向上'].some(positive => keyword.includes(positive))) {
      category = '积极向上'
      break
    } else if (impactKeywords['负面挑战'].some(negative => keyword.includes(negative))) {
      category = '负面挑战'
    }
  }

  const categoryScores: Record<string, Record<string, number>> = {
    '积极向上': { '大助': 8, '助力': 6, '机会': 10, '消耗': 2, '压力': -2, '挑战': 4 },
    '中性平稳': { '大助': 4, '助力': 3, '机会': 5, '消耗': 2, '压力': 1, '挑战': 3 },
    '负面挑战': { '大助': 6, '助力': 4, '机会': 8, '消耗': 0, '压力': -4, '挑战': 2 }
  }

  return categoryScores[category]?.[impactType] || 0
}

/**
 * 生成个性化标题
 */
function generatePersonalizedHeadline(
  impactType: string,
  useMatter: string,
  balanceType: string,
  score: number
): string {
  const headlineTemplates: Record<string, Record<string, string>> = {
    '求官': {
      '大助': score >= 85 ? '火运助官，青云直上九万里' : '丙午旺官，仕途亨通显英才',
      '助力': '官星高照，晋升发展正当时',
      '机会': '官运亨通，把握机遇展宏图',
      '消耗': '劳心为官，厚积薄发待时机',
      '压力': '官星克身，以退为进谋发展',
      '挑战': '挑战与机遇并存，突破瓶颈在今朝'
    },
    '求财': {
      '大助': score >= 85 ? '火财两旺，日进斗金不是梦' : '丙午生财，财源滚滚达三江',
      '助力': '财运亨通，稳健增收正当时',
      '机会': '财星高照，把握商机创财富',
      '消耗': '求财辛苦，循序渐进积财富',
      '压力': '财多身弱，稳健理财防风险',
      '挑战': '财运挑战，谨慎投资保本金'
    },
    '婚恋': {
      '大助': score >= 85 ? '桃花逢火，情缘美满结连理' : '丙午暖情，姻缘美满甜如蜜',
      '助力': '感情升温，良缘可期正当时',
      '机会': '桃花运旺，主动出击觅良缘',
      '消耗': '为情付出，真心换心得真情',
      '压力': '情感波动，理性沟通解误会',
      '挑战': '感情考验，用心经营渡难关'
    },
    '康宁': {
      '大助': score >= 85 ? '火气调和，身心健康精神爽' : '丙午养身，活力充沛体康健',
      '助力': '健康向好，养生保健正当时',
      '机会': '身心调和，把握机会促健康',
      '消耗': '注意休养，劳逸结合保健康',
      '压力': '健康挑战，积极调理最重要',
      '挑战': '健康考验，预防为主保平安'
    },
    '交游': {
      '大助': score >= 85 ? '火旺人缘，贵人相助事业兴' : '丙午旺运，人脉广阔机遇多',
      '助力': '人缘极佳，社交活跃结良缘',
      '机会': '贵人运旺，拓展人脉创机会',
      '消耗': '为友付出，真诚待人得回报',
      '压力': '人际挑战，以诚待人化矛盾',
      '挑战': '人脉考验，用心维护保关系'
    }
  }

  return headlineTemplates[useMatter]?.[impactType] || '丙午流年，机遇挑战并存'
}

/**
 * 生成个性化关键词
 */
function generatePersonalizedKeywords(
  impactType: string,
  useMatter: string,
  balanceType: string,
  situation: string
): string[] {
  const keywordPool: Record<string, string[]> = {
    '大助': ['如虎添翼', '势不可挡', '大展宏图', '锦上添花'],
    '助力': ['稳步提升', '顺风顺水', '渐入佳境', '水到渠成'],
    '机会': ['把握时机', '机不可失', '时来运转', '天赐良机'],
    '消耗': ['劳逸结合', '循序渐进', '厚积薄发', '张弛有度'],
    '压力': ['以柔克刚', '化解压力', '转危为安', '借力使力'],
    '挑战': ['迎难而上', '化险为夷', '突破瓶颈', '柳暗花明']
  }

  const matterKeywords: Record<string, string[]> = {
    '求官': ['晋升', '发展', '领导力', '决策'],
    '求财': ['增收', '理财', '投资', '商机'],
    '婚恋': ['感情', '姻缘', '甜蜜', '和谐'],
    '康宁': ['健康', '养生', '活力', '调理'],
    '交游': ['人脉', '贵人', '合作', '社交']
  }

  const baseKeywords = keywordPool[impactType] || []
  const specificKeywords = matterKeywords[useMatter] || []

  return [...baseKeywords.slice(0, 2), ...specificKeywords.slice(0, 2)]
}

/**
 * 生成个性化建议
 */
function generatePersonalizedAdvice(
  impactType: string,
  useMatter: string,
  strategy: string,
  balanceType: string
): string {
  const adviceTemplates: Record<string, Record<string, string>> = {
    '求官': {
      '大助': '把握丙午火运的强势助力，积极主动争取晋升机会，展现领导才能，但切记戒骄戒躁，团结同事。',
      '助力': '运势助力事业发展，稳扎稳打推进工作目标，主动承担责任，提升专业能力。',
      '机会': '事业机会增多，要保持敏锐嗅觉，主动出击把握晋升良机，加强与上级沟通。',
      '消耗': '事业发展需要付出更多努力，合理分配工作与休息时间，提升效率避免透支。',
      '压力': '事业面临挑战，建议以退为进，稳守现有阵地，寻求贵人化解困难。',
      '挑战': '突破事业发展瓶颈的关键年，需要调整策略，迎难而上，相信困难过后就是机遇。'
    },
    '求财': {
      '大助': '财运极其旺盛，但要稳健为先，避免冲动投资。建议分散风险，长期规划，守住财富。',
      '助力': '财运稳步上升，适合稳健理财和适度投资，寻找增收渠道，但防范风险。',
      '机会': '财运机会增多，要把握商机但谨慎决策，建议咨询专业人士，避免投机。',
      '消耗': '求财需要辛勤付出，建议开源节流并重，稳扎稳打积累财富。',
      '压力': '财务压力较大，建议保守理财，控制支出，寻求合作伙伴共担风险。',
      '挑战': '财务管理面临考验，建议制定详细预算，谨慎投资，保本为主。'
    },
    '婚恋': {
      '大助': '感情运势极佳，单身者易遇良缘，有伴侣者感情升温。适合表白、求婚、结婚。',
      '助力': '感情运势良好，主动表达爱意，创造浪漫相处时光，感情稳定发展。',
      '机会': '感情机会增多，积极参加社交活动，主动出击寻找另一半，把握缘分。',
      '消耗': '感情需要付出时间和精力，加强沟通理解，共同经营维护关系。',
      '压力': '感情面临考验，建议理性沟通，控制情绪，以真诚化解误会。',
      '挑战': '感情需要用心经营，面对困难要坦诚相待，共同面对，风雨同舟。'
    },
    '康宁': {
      '大助': '健康运势极佳，精力充沛，但要避免过度自信，注意定期体检，预防胜于治疗。',
      '助力': '健康运势良好，适合制定养生计划，适度运动，调整作息，增强体质。',
      '机会': '健康改善的机会期，建议改变不良习惯，加强锻炼，提升整体健康水平。',
      '消耗': '注意精力管理，避免过度透支，规律作息，均衡饮食，及时补充营养。',
      '压力': '健康面临挑战，建议重视身体信号，及时就医，调整心态，积极配合治疗。',
      '挑战': '健康管理考验期，需要制定详细的保健计划，坚持执行，防患于未然。'
    },
    '交游': {
      '大助': '人缘极佳，贵人运旺，积极拓展社交圈，但要以诚待人，避免投机取巧。',
      '助力': '人际关系和谐，适合维护老朋友，结识新朋友，扩大人脉网络。',
      '机会': '社交机会增多，主动参加集体活动，把握贵人相助的机会。',
      '消耗': '人际交往需要时间精力投入，真诚待人，用心维护重要关系。',
      '压力': '人际关系面临挑战，建议以和为贵，避免争执，寻求中间人调解。',
      '挑战': '人脉维护考验期，需要更加用心经营，以德服人，化敌为友。'
    }
  }

  return adviceTemplates[useMatter]?.[impactType] || '根据个人情况制定策略，顺势而为，谨慎前行。'
}

/**
 * 生成五大领域运势 - 大幅优化版
 */
function generateDomains(chartProfile: ChartProfile, userContext: UserContext) {
  const domains = ['事业', '财运', '婚恋', '健康', '人际'] as const
  const { useMatter, strategy, energy, situation } = userContext
  const { year2026Impact, fiveElements, balanceType, dayMaster } = chartProfile

  return domains.map(domain => {
    // 是否为重点领域
    const isKeyDomain = (
      (useMatter === '求官' && domain === '事业') ||
      (useMatter === '求财' && domain === '财运') ||
      (useMatter === '婚恋' && domain === '婚恋') ||
      (useMatter === '康宁' && domain === '健康') ||
      (useMatter === '交游' && domain === '人际')
    )

    // 复杂的分数计算系统
    let score = calculateDomainScore(domain, chartProfile, userContext, isKeyDomain)

    // 生成趋势
    const trend = generateDomainTrend(score, year2026Impact.type, domain)

    // 生成个性化的亮点和陷阱
    const domainData = generateDomainContent(domain, chartProfile, userContext)

    return {
      name: domain,
      score,
      trend,
      brightSpot: domainData.brightSpot,
      pitfall: domainData.pitfall,
      actions: domainData.actions,
      basisLite: domainData.basisLite
    }
  })
}

/**
 * 计算领域分数
 */
function calculateDomainScore(
  domain: string,
  chartProfile: ChartProfile,
  userContext: UserContext,
  isKeyDomain: boolean
): number {
  const { year2026Impact, fiveElements, balanceType } = chartProfile
  const { useMatter, strategy, energy } = userContext

  // 基础分数（从50开始，增加差异化）
  let baseScore = 50

  // 1. 流年影响（权重40%）
  const domainImpactScores = getDomainImpactScores(domain, year2026Impact.type)
  baseScore += domainImpactScores

  // 2. 是否重点领域（权重20%）
  if (isKeyDomain) {
    baseScore += 15
  }

  // 3. 身强身弱匹配度（权重15%）
  const balanceMatch = calculateDomainBalanceMatch(domain, balanceType, year2026Impact.type)
  baseScore += balanceMatch

  // 4. 策略匹配度（权重15%）
  const strategyMatch = calculateDomainStrategyMatch(domain, strategy, year2026Impact.type)
  baseScore += strategyMatch

  // 5. 精力状态影响（权重10%）
  const energyImpact = calculateEnergyImpact(domain, energy, year2026Impact.type)
  baseScore += energyImpact

  return Math.max(25, Math.min(98, baseScore))
}

/**
 * 获取领域在流年影响下的基础分数
 */
function getDomainImpactScores(domain: string, impactType: string): number {
  const impactMatrix: Record<string, Record<string, number>> = {
    '事业': {
      '大助': 20, '助力': 15, '机会': 12, '消耗': 5,
      '压力': 0, '挑战': 8
    },
    '财运': {
      '大助': 12, '助力': 8, '机会': 18, '消耗': 0,
      '压力': -5, '挑战': 10
    },
    '婚恋': {
      '大助': 18, '助力': 15, '机会': 10, '消耗': 8,
      '压力': -8, '挑战': 5
    },
    '健康': {
      '大助': 8, '助力': 10, '机会': 5, '消耗': -10,
      '压力': -15, '挑战': -5
    },
    '人际': {
      '大助': 22, '助力': 18, '机会': 15, '消耗': 10,
      '压力': 5, '挑战': 12
    }
  }

  return impactMatrix[domain]?.[impactType] || 0
}

/**
 * 计算领域与身强身弱的匹配度
 */
function calculateDomainBalanceMatch(
  domain: string,
  balanceType: string,
  impactType: string
): number {
  let score = 0

  if (balanceType === '过旺' || balanceType === '偏强') {
    if (domain === '健康' && (impactType === '消耗' || impactType === '压力')) {
      score += 12 // 身强者逢消耗，有利健康
    } else if (domain === '事业' && (impactType === '压力' || impactType === '挑战')) {
      score += 8 // 身强者承压能力强
    }
  } else if (balanceType === '过弱' || balanceType === '偏弱') {
    if (domain === '健康' && (impactType === '大助' || impactType === '助力')) {
      score += 15 // 身弱者得助，健康改善
    } else if (domain === '事业' && (impactType === '大助' || impactType === '助力')) {
      score += 10 // 身弱者得贵人
    } else if (domain === '健康' && (impactType === '消耗' || impactType === '压力')) {
      score -= 10 // 身弱者再加压，健康风险
    }
  } else { // 中和
    score += 5 // 中和状态适应性较好
  }

  return score
}

/**
 * 计算策略匹配度
 */
function calculateDomainStrategyMatch(
  domain: string,
  strategy: string,
  impactType: string
): number {
  const strategyMatrix: Record<string, Record<string, Record<string, number>>> = {
    '事业': {
      '稳守': { '压力': 10, '挑战': 8, '消耗': 5, '大助': 0, '助力': 2, '机会': 6 },
      '进取': { '大助': 12, '助力': 10, '机会': 12, '消耗': 8, '压力': -5, '挑战': 6 },
      '先守后攻': { '大助': 8, '助力': 6, '机会': 10, '消耗': 6, '压力': 6, '挑战': 8 },
      '先攻后守': { '大助': 10, '助力': 8, '机会': 8, '消耗': 7, '压力': 2, '挑战': 10 }
    },
    '财运': {
      '稳守': { '压力': 12, '挑战': 10, '消耗': 5, '机会': 5, '大助': 2, '助力': 3 },
      '进取': { '机会': 15, '大助': 10, '助力': 8, '消耗': 6, '压力': -8, '挑战': 8 },
      '先守后攻': { '大助': 8, '机会': 10, '助力': 6, '消耗': 5, '压力': 4, '挑战': 10 },
      '先攻后守': { '机会': 12, '大助': 8, '助力': 5, '消耗': 6, '压力': 0, '挑战': 12 }
    },
    '婚恋': {
      '稳守': { '压力': 8, '挑战': 6, '消耗': 6, '大助': 5, '助力': 8, '机会': 8 },
      '进取': { '大助': 15, '助力': 12, '机会': 15, '消耗': 10, '压力': -5, '挑战': 8 },
      '先守后攻': { '大助': 10, '助力': 10, '机会': 12, '消耗': 8, '压力': 4, '挑战': 10 },
      '先攻后守': { '大助': 12, '助力': 8, '机会': 10, '消耗': 9, '压力': 0, '挑战': 12 }
    },
    '健康': {
      '稳守': { '压力': 15, '挑战': 12, '消耗': 10, '大助': 3, '助力': 5, '机会': 6 },
      '进取': { '大助': 8, '助力': 6, '机会': 8, '消耗': -5, '压力': -15, '挑战': -8 },
      '先守后攻': { '大助': 6, '助力': 8, '机会': 7, '消耗': 3, '压力': 8, '挑战': 6 },
      '先攻后守': { '大助': 7, '助力': 5, '机会': 6, '消耗': 0, '压力': 5, '挑战': 2 }
    },
    '人际': {
      '稳守': { '压力': 6, '挑战': 5, '消耗': 8, '大助': 8, '助力': 10, '机会': 8 },
      '进取': { '大助': 18, '助力': 15, '机会': 18, '消耗': 12, '压力': 5, '挑战': 10 },
      '先守后攻': { '大助': 12, '助力': 12, '机会': 14, '消耗': 10, '压力': 8, '挑战': 12 },
      '先攻后守': { '大助': 15, '助力': 10, '机会': 12, '消耗': 11, '压力': 6, '挑战': 14 }
    }
  }

  return strategyMatrix[domain]?.[strategy]?.[impactType] || 0
}

/**
 * 计算精力状态影响
 */
function calculateEnergyImpact(domain: string, energy: string, impactType: string): number {
  const energyMatrix: Record<string, Record<string, Record<string, number>>> = {
    '时间充裕精力有限': {
      '事业': { '消耗': -8, '压力': -10, '挑战': -5 },
      '健康': { '消耗': -10, '压力': -12 },
      '财运': { '消耗': -5, '压力': -8 }
    },
    '时间紧张精力充沛': {
      '事业': { '消耗': 5, '机会': 8, '大助': 6 },
      '财运': { '机会': 10, '大助': 8 },
      '人际': { '消耗': 8, '大助': 10 }
    },
    '时间精力双紧张': {
      '事业': { '压力': -12, '挑战': -10, '消耗': -15 },
      '健康': { '压力': -15, '挑战': -12, '消耗': -18 },
      '婚恋': { '压力': -8, '挑战': -6 }
    },
    '时间精力双充裕': {
      '事业': { '大助': 8, '机会': 10, '助力': 6 },
      '财运': { '机会': 12, '大助': 10 },
      '婚恋': { '大助': 10, '机会': 12 }
    },
    '工作生活难平衡': {
      '事业': { '消耗': -5, '压力': -8 },
      '健康': { '消耗': -8, '压力': -10 },
      '婚恋': { '消耗': -6, '压力': -6 }
    }
  }

  return energyMatrix[energy]?.[domain]?.[impactType] || 0
}

/**
 * 生成领域趋势
 */
function generateDomainTrend(
  score: number,
  impactType: string,
  domain: string
): '上升' | '平稳' | '波动' | '偏压力' {
  // 基础趋势判断
  if (score >= 85) return '上升'
  if (score >= 70) return '平稳'
  if (score >= 55) return '波动'
  return '偏压力'

  // 根据流年影响调整趋势
  // (这里可以加入更复杂的逻辑)
}

/**
 * 生成个性化的领域内容
 */
function generateDomainContent(
  domain: string,
  chartProfile: ChartProfile,
  userContext: UserContext
) {
  const { year2026Impact, balanceType, dayMaster } = chartProfile
  const { useMatter, strategy } = userContext

  const contentLibrary: Record<string, {
    brightSpot: string;
    pitfall: string;
    actions: string[];
    basisLite: string;
  }> = {
    '事业': {
      brightSpot: generateBrightSpot('事业', year2026Impact.type, balanceType),
      pitfall: generatePitfall('事业', year2026Impact.type, balanceType),
      actions: generateActions('事业', year2026Impact.type, strategy),
      basisLite: generateBasisLite('事业', year2026Impact.type, dayMaster)
    },
    '财运': {
      brightSpot: generateBrightSpot('财运', year2026Impact.type, balanceType),
      pitfall: generatePitfall('财运', year2026Impact.type, balanceType),
      actions: generateActions('财运', year2026Impact.type, strategy),
      basisLite: generateBasisLite('财运', year2026Impact.type, dayMaster)
    },
    '婚恋': {
      brightSpot: generateBrightSpot('婚恋', year2026Impact.type, balanceType),
      pitfall: generatePitfall('婚恋', year2026Impact.type, balanceType),
      actions: generateActions('婚恋', year2026Impact.type, strategy),
      basisLite: generateBasisLite('婚恋', year2026Impact.type, dayMaster)
    },
    '健康': {
      brightSpot: generateBrightSpot('健康', year2026Impact.type, balanceType),
      pitfall: generatePitfall('健康', year2026Impact.type, balanceType),
      actions: generateActions('健康', year2026Impact.type, strategy),
      basisLite: generateBasisLite('健康', year2026Impact.type, dayMaster)
    },
    '人际': {
      brightSpot: generateBrightSpot('人际', year2026Impact.type, balanceType),
      pitfall: generatePitfall('人际', year2026Impact.type, balanceType),
      actions: generateActions('人际', year2026Impact.type, strategy),
      basisLite: generateBasisLite('人际', year2026Impact.type, dayMaster)
    }
  }

  return contentLibrary[domain]
}

/**
 * 生成亮点
 */
function generateBrightSpot(domain: string, impactType: string, balanceType: string): string {
  const brightSpotLibrary: Record<string, Record<string, string>> = {
    '事业': {
      '大助': balanceType === '过弱' || balanceType === '偏弱'
        ? '贵人相助，事业腾飞有期，把握晋升良机'
        : '才能大展，创意迸发，领导力显著提升',
      '助力': '工作顺利推进，团队配合默契，专业能力受认可',
      '机会': '新的工作机会出现，适合转换跑道或开拓新领域',
      '消耗': '通过努力获得认可，虽然辛苦但成果显著',
      '压力': '挑战中见真功夫，压力下展现实力',
      '挑战': '突破事业瓶颈的关键期，熬过就是春天'
    },
    '财运': {
      '大助': '财运极其旺盛，正财偏财双收，投资理财顺风顺水',
      '助力': '收入稳步增长，理财收益良好，财务状况持续改善',
      '机会': '新的增收渠道出现，适合投资创业或开拓副业',
      '消耗': '需要辛勤付出才有收获，稳健积累财富',
      '压力': '开支增大，收入增长缓慢，需要精打细算',
      '挑战': '财务管理面临考验，保守为上，避免冒险'
    },
    '婚恋': {
      '大助': '桃花运极旺，感情升温迅速，单身者易遇正缘',
      '助力': '感情稳定发展，相互理解加深，适合深入发展',
      '机会': '新的社交机会增多，扩大圈子易遇良缘',
      '消耗': '需要投入时间精力维护，真心付出有回报',
      '压力': '感情波动较大，需要理性沟通化解误会',
      '挑战': '感情面临考验，共同面对才能渡过难关'
    },
    '健康': {
      '大助': '精力充沛，活力四射，身体状况达到最佳状态',
      '助力': '健康向好，适合开始养生计划，体质逐步增强',
      '机会': '改善健康的好时机，适合体检和调理身体',
      '消耗': '注意劳逸结合，避免过度透支身体',
      '压力': '健康面临挑战，需要重视身体信号',
      '挑战': '健康管理考验期，需要调整生活方式'
    },
    '人际': {
      '大助': '人缘极佳，贵人运旺，社交圈子迅速扩大',
      '助力': '人际关系和谐，朋友助力明显，合作顺利',
      '机会': '结识新朋友的好时机，拓展人脉网络',
      '消耗': '需要主动维护关系，真诚待人获得回报',
      '压力': '人际关系面临挑战，需要谨慎处理',
      '挑战': '人脉维护考验期，用心经营才能保持'
    }
  }

  return brightSpotLibrary[domain]?.[impactType] || '保持积极心态，把握机会'
}

/**
 * 生成陷阱
 */
function generatePitfall(domain: string, impactType: string, balanceType: string): string {
  const pitfallLibrary: Record<string, Record<string, string>> = {
    '事业': {
      '大助': '成功时容易骄傲自满，需保持谦逊，团结同事',
      '助力': '发展顺利时容易忽视细节，需要保持谨慎',
      '机会': '机会太多容易分散精力，要专注核心目标',
      '消耗': '过度劳累影响效率，需要合理安排时间',
      '压力': '压力下容易情绪化，需要保持理性判断',
      '挑战': '困难时容易灰心丧气，需要坚持和韧性'
    },
    '财运': {
      '大助': '财运旺时容易冲动消费，需要理性理财',
      '助力': '收入增加时容易忽视风险，投资需谨慎',
      '机会': '机会多时容易盲目投资，要做好风险评估',
      '消耗': '辛苦赚钱容易过度节俭，影响生活质量',
      '压力': '财务压力时容易急功近利，需要保持冷静',
      '挑战': '经济困难时容易病急乱投医，避免上当'
    }
  }

  return pitfallLibrary[domain]?.[impactType] || '保持警惕，避免常见陷阱'
}

/**
 * 生成行动建议
 */
function generateActions(domain: string, impactType: string, strategy: string): string[] {
  const actionLibrary: Record<string, Record<string, string[]>> = {
    '事业': {
      '大助': ['积极争取晋升机会', '展现领导才能', '拓展业务范围', '建立战略合作伙伴'],
      '助力': ['提升专业技能', '维护同事关系', '主动承担责任', '加强学习进修'],
      '机会': ['把握新机会', '学习新技能', '扩大人脉圈', '提升创新能力'],
      '消耗': ['合理分配时间', '提高工作效率', '注意劳逸结合', '寻求团队协作'],
      '压力': ['稳守现有阵地', '寻求贵人相助', '调整工作方法', '保持积极心态'],
      '挑战': ['分析问题根源', '制定应对策略', '寻求专业指导', '保持毅力韧性']
    },
    '财运': {
      '大助': ['制定投资计划', '分散投资风险', '规划长期理财', '避免冲动消费'],
      '助力': ['稳健理财增值', '寻找增收渠道', '控制不必要支出', '学习投资知识'],
      '机会': ['把握投资机会', '开拓副业收入', '寻求专业建议', '做好风险评估'],
      '消耗': ['精打细算过日子', '开源节流并重', '制定详细预算', '避免不必要的开支'],
      '压力': ['控制日常开支', '寻找临时增收', '避免债务风险', '寻求财务咨询'],
      '挑战': ['重新财务规划', '削减非必需支出', '寻求家庭支持', '考虑变现资产']
    }
  }

  return actionLibrary[domain]?.[impactType] || ['保持谨慎', '稳步前进', '学习成长', '寻求帮助']
}

/**
 * 生成简明依据
 */
function generateBasisLite(domain: string, impactType: string, dayMaster: string): string {
  const basisLibrary: Record<string, Record<string, string>> = {
    '事业': {
      '大助': '丙午火官星旺相，事业运势如日中天',
      '助力': '火运助事业，工作顺利发展',
      '机会': '官星透干，事业机会增多',
      '消耗': '食伤泄秀，才华展现需努力',
      '压力': '官星克身，事业需要稳扎稳打',
      '挑战': '火运挑战事业，需要以智取胜'
    },
    '财运': {
      '大助': '丙午财星当值，财运亨通达四海',
      '助力': '火土相生，财运稳步上升',
      '机会': '财星高照，投资机会显现',
      '消耗': '求财辛苦，需要勤奋努力',
      '压力': '财多身弱，稳健理财为上',
      '挑战': '火克财运，谨慎投资避险'
    }
  }

  return basisLibrary[domain]?.[impactType] || '根据个人命局具体分析'
}

/**
 * 生成12个月运势 - 大幅优化版
 */
function generateMonths(chartProfile: ChartProfile, userContext: UserContext) {
  const { useMatter, taboos, strategy } = userContext
  const { year2026Impact, dayMaster, balanceType, fiveElements } = chartProfile

  const months = []
  for (let i = 0; i < 12; i++) {
    const monthNum = i + 1
    const solarTerm = monthSolarTerms[i * 2] // 每月两个节气，取第一个

    // 根据命盘和流年影响计算月运势
    const monthData = calculateMonthlyFortune(
      monthNum,
      chartProfile,
      userContext,
      year2026Impact
    )

    months.push({
      month: monthNum,
      ...monthData
    })
  }

  return months
}

/**
 * 计算具体月份的运势
 */
function calculateMonthlyFortune(
  monthNum: number,
  chartProfile: ChartProfile,
  userContext: UserContext,
  year2026Impact: any
) {
  const { dayMaster, balanceType } = chartProfile
  const { useMatter, strategy } = userContext

  // 计算月份基础分数（基于全年运势的月度分布）
  const baseScore = calculateMonthlyScore(monthNum, year2026Impact, balanceType)

  // 确定月份标签
  const tag = generateMonthTag(baseScore, monthNum, useMatter)

  // 生成月度主题
  const theme = generateMonthTheme(tag, monthNum, useMatter, dayMaster)

  // 生成提醒事项
  const reminders = generateMonthReminders(tag, monthNum, useMatter, balanceType)

  // 生成宜做的事
  const goodFor = generateMonthGoodFor(tag, monthNum, useMatter)

  // 生成方法建议
  const methodLite = generateMonthMethod(tag, monthNum, strategy, balanceType)

  return {
    tag,
    theme,
    reminders,
    goodFor,
    methodLite
  }
}

/**
 * 计算月度分数
 */
function calculateMonthlyScore(
  monthNum: number,
  year2026Impact: any,
  balanceType: string
): number {
  // 基础分数（基于全年影响强度）
  let score = 50 + year2026Impact.strengthLevel * 0.4

  // 季节性调整
  const seasonalBonus = getSeasonalBonus(monthNum, year2026Impact.type)
  score += seasonalBonus

  // 月度波动（减少随机性，增加规律性）
  const monthlyPattern = Math.sin((monthNum / 12) * Math.PI * 2) * 10
  score += monthlyPattern

  // 根据身强身弱调整月度适应性
  const balanceAdjustment = getMonthlyBalanceAdjustment(monthNum, balanceType)
  score += balanceAdjustment

  return Math.max(20, Math.min(95, score))
}

/**
 * 获取季节性加分
 */
function getSeasonalBonus(monthNum: number, impactType: string): number {
  // 春季（2-4月）
  if (monthNum >= 2 && monthNum <= 4) {
    return impactType === '大助' || impactType === '助力' ? 8 : 2
  }
  // 夏季（5-7月）- 火旺季节
  if (monthNum >= 5 && monthNum <= 7) {
    return impactType === '消耗' || impactType === '压力' ? -5 : 12
  }
  // 秋季（8-10月）
  if (monthNum >= 8 && monthNum <= 10) {
    return impactType === '机会' || impactType === '挑战' ? 6 : 3
  }
  // 冬季（11-1月）
  if (monthNum >= 11 || monthNum <= 1) {
    return impactType === '压力' || impactType === '挑战' ? -3 : 5
  }

  return 0
}

/**
 * 获取身强身弱的月度调整
 */
function getMonthlyBalanceAdjustment(monthNum: number, balanceType: string): number {
  if (balanceType === '过旺' || balanceType === '偏强') {
    // 身强者在压力较大的月份表现更好
    return monthNum % 4 === 0 ? 5 : -2
  } else if (balanceType === '过弱' || balanceType === '偏弱') {
    // 身弱者在助力较大的月份表现更好
    return monthNum % 3 === 0 ? -5 : 3
  }
  return 0
}

/**
 * 生成月份标签
 */
function generateMonthTag(
  score: number,
  monthNum: number,
  useMatter: string
): string {
  // 根据分数确定基础标签
  let baseTag: string
  if (score >= 85) baseTag = '吉'
  else if (score >= 70) baseTag = '平'
  else if (score >= 55) baseTag = '机会'
  else baseTag = '挑战'

  // 根据月份和用事调整标签
  if (useMatter === '求官' && [3, 6, 9, 12].includes(monthNum)) {
    baseTag = score >= 75 ? '吉' : '机会' // 求官者的关键月份
  } else if (useMatter === '求财' && [4, 8, 12].includes(monthNum)) {
    baseTag = score >= 70 ? '机会' : '平' // 财运关键月
  }

  // 特殊月份调整
  if (monthNum === 6) { // 午月，火最旺
    if (baseTag === '吉') baseTag = '吉'
    else if (baseTag === '挑战') baseTag = '挑战'
  }

  return baseTag
}

/**
 * 生成月度主题
 */
function generateMonthTheme(
  tag: string,
  monthNum: number,
  useMatter: string,
  dayMaster: string
): string {
  const themeLibrary: Record<string, Record<string, string[]>> = {
    '吉': {
      '求官': ['官运亨通，晋升在即', '事业腾飞，大展宏图', '领导赏识，平步青云'],
      '求财': ['财运亨通，日进斗金', '投资获利，财源广进', '商机无限，把握良机'],
      '婚恋': ['桃花运旺，良缘可期', '感情升温，甜蜜美满', '姻缘天定，喜结连理'],
      '康宁': ['身心健康，精力充沛', '百病不侵，安康顺遂', '神清气爽，活力四射'],
      '交游': ['贵人相助，人脉广阔', '社交活跃，朋友助力', '合作顺利，共赢发展']
    },
    '平': {
      '求官': ['稳扎稳打，按部就班', '守成保位，平安发展', '循序渐进，厚积薄发'],
      '求财': ['收支平衡，稳健理财', '守财有道，风险可控', '稳步前进，渐进增长'],
      '婚恋': ['感情平稳，细水长流', '相互理解，和谐共处', '平淡是真，安稳度日'],
      '康宁': ['健康平稳，注意保养', '作息规律，预防为主', '身心平衡，安然无恙'],
      '交游': ['人际关系稳定，维持现状', '朋友往来正常，平淡如水', '社交有度，适度即可']
    },
    '机会': {
      '求官': ['机会降临，把握时机', '新岗位出现，主动争取', '贵人引荐，展露才华'],
      '求财': ['财运机会显现，寻找新路', '投资时机成熟，谨慎决策', '增收渠道出现，积极拓展'],
      '婚恋': ['新的社交机会，扩大圈子', '感情转机出现，主动出击', '桃花运动，把握缘分'],
      '康宁': ['改善健康的好时机', '调理身体的最佳时期', '养生保健，事半功倍'],
      '交游': ['结识新朋友的好机会', '人脉拓展的黄金期', '合作机遇增多，主动把握']
    },
    '挑战': {
      '求官': ['面临挑战，迎难而上', '工作压力增大，调整心态', '竞争激烈，突出重围'],
      '求财': ['财务考验，谨慎应对', '开支增加，控制预算', '投资风险，规避为上'],
      '婚恋': ['感情波动，理性处理', '误会增多，加强沟通', '考验期至，用心经营'],
      '康宁': ['健康挑战，重视信号', '亚健康警告，及时调理', '压力增大，注意放松'],
      '交游': ['人际复杂，谨慎处理', '是非增多，明哲保身', '关系考验，以诚待人']
    }
  }

  const themes = themeLibrary[tag]?.[useMatter] || ['按部就班，稳扎稳打']
  return themes[monthNum % themes.length]
}

/**
 * 生成月度提醒
 */
function generateMonthReminders(
  tag: string,
  monthNum: number,
  useMatter: string,
  balanceType: string
): string[] {
  const reminderLibrary: Record<string, Record<string, string[]>> = {
    '吉': {
      '求官': ['把握晋升机会，展现领导才能', '维护同事关系，团结合作', '制定长远规划，目标明确'],
      '求财': ['理性投资，避免冲动决策', '分散风险，稳健理财', '制定预算，控制支出'],
      '婚恋': ['主动表达爱意，增进感情', '制造浪漫惊喜，甜蜜时光', '规划未来，共同发展'],
      '康宁': ['保持良好作息，规律生活', '适度运动，增强体质', '定期体检，预防胜于治疗'],
      '交游': ['拓展人脉，结识新朋友', '维护重要关系，真诚待人', '把握合作机会，共赢发展']
    },
    '平': {
      '求官': ['专注本职工作，提升能力', '保持低调，避免锋芒', '学习进修，储备能量'],
      '求财': ['坚持理财计划，不要动摇', '控制不必要的开支', '寻找稳健的投资渠道'],
      '婚恋': ['多沟通交流，增进理解', '相互包容，避免争执', '创造温馨时光，增进感情'],
      '康宁': ['保持现有生活习惯', '注意小病小痛，及时处理', '适当运动，保持活力'],
      '交游': ['维持现有社交圈', '适时联系老朋友', '避免无谓是非，保持中立']
    },
    '机会': {
      '求官': ['主动争取新机会', '加强专业技能培训', '扩大人脉圈，寻找贵人'],
      '求财': ['积极寻找增收渠道', '学习新的理财知识', '把握市场机会，谨慎投资'],
      '婚恋': ['参加社交活动，扩大圈子', '主动出击，把握缘分', '提升个人魅力，增强吸引力'],
      '康宁': ['开始新的健康计划', '调整作息，改善体质', '学习养生知识，科学保健'],
      '交游': ['主动参加社交活动', '寻找合作机会', '建立新的朋友关系']
    },
    '挑战': {
      '求官': ['稳守现有阵地', '寻求贵人帮助', '调整工作方法，提高效率'],
      '求财': ['严格控制开支', '避免不必要的投资', '寻求专业理财建议'],
      '婚恋': ['冷静处理矛盾', '加强沟通理解', '给彼此空间和时间'],
      '康宁': ['重视身体预警信号', '及时就医检查', '调整生活节奏'],
      '交游': ['谨慎处理人际关系', '避免卷入是非', '保持低调，明哲保身']
    }
  }

  const allReminders = reminderLibrary[tag]?.[useMatter] || ['保持冷静，理性应对']

  // 根据身强身弱选择不同的提醒重点
  if (balanceType === '过旺' || balanceType === '偏强') {
    allReminders.push('避免过于强势，注意方法')
  } else if (balanceType === '过弱' || balanceType === '偏弱') {
    allReminders.push('注意休息，避免过度劳累')
  }

  // 选择2-3个最相关的提醒
  return allReminders.slice(0, 3)
}

/**
 * 生成月度宜做的事
 */
function generateMonthGoodFor(tag: string, monthNum: number, useMatter: string): string {
  const goodForLibrary: Record<string, Record<string, string[]>> = {
    '吉': {
      '求官': ['争取晋升', '拓展业务', '领导培训', '重要谈判'],
      '求财': ['投资理财', '商业合作', '签订合同', '创业发展'],
      '婚恋': ['表白求婚', '结婚登记', '浪漫约会', '见家长'],
      '康宁': ['运动健身', '户外旅游', '社交聚会', '庆祝活动'],
      '交游': ['扩展人脉', '合作洽谈', '参加宴会', '重要会面']
    },
    '平': {
      '求官': ['日常工作', '技能提升', '团队建设', '常规会议'],
      '求财': ['常规理财', '预算规划', '市场调研', '客户维护'],
      '婚恋': ['沟通交流', '家庭活动', '朋友聚会', '温馨相处'],
      '康宁': ['常规体检', '养生保健', '作息调整', '适度运动'],
      '交游': ['维护关系', '朋友聚餐', '日常工作', '学习交流']
    },
    '机会': {
      '求官': ['学习进修', '寻找机会', '建立联系', '展示才能'],
      '求财': ['寻找商机', '市场分析', '技能学习', '人脉拓展'],
      '婚恋': ['社交活动', '扩大圈子', '提升自己', '寻找缘分'],
      '康宁': ['健康检查', '制定计划', '改善习惯', '学习养生'],
      '交游': ['参加活动', '结识新友', '合作机会', '信息收集']
    },
    '挑战': {
      '求官': ['稳守岗位', '提升能力', '调整策略', '寻求帮助'],
      '求财': ['控制开支', '风险评估', '保守理财', '规划整理'],
      '婚恋': ['冷静思考', '沟通交流', '处理问题', '修复关系'],
      '康宁': ['休息调养', '检查身体', '减压放松', '生活调整'],
      '交游': ['谨慎社交', '维护关系', '避免是非', '保持低调']
    }
  }

  const options = goodForLibrary[tag]?.[useMatter] || ['日常工作']
  return options[monthNum % options.length]
}

/**
 * 生成月度方法建议
 */
function generateMonthMethod(
  tag: string,
  monthNum: number,
  strategy: string,
  balanceType: string
): string {
  const methodLibrary: Record<string, Record<string, string>> = {
    '吉': {
      '稳守': '乘胜追击，扩大战果',
      '进取': '全力以赴，把握巅峰',
      '先守后攻': '先稳固成果，再图发展',
      '先攻后守': '大胆前进，及时收手'
    },
    '平': {
      '稳守': '保持现状，稳中求进',
      '进取': '寻找突破，适度进取',
      '先守后攻': '先稳后进，循序渐进',
      '先攻后守': '适度尝试，及时调整'
    },
    '机会': {
      '稳守': '谨慎把握，控制风险',
      '进取': '主动出击，把握机会',
      '先守后攻': '先观察后行动',
      '先攻后守': '先尝试后评估'
    },
    '挑战': {
      '稳守': '保守应对，规避风险',
      '进取': '迎难而上，化险为夷',
      '先守后攻': '先防守后反击',
      '先攻后守': '先化解后固守'
    }
  }

  let baseMethod = methodLibrary[tag]?.[strategy] || '保持谨慎'

  // 根据身强身弱调整
  if (balanceType === '过旺' || balanceType === '偏强') {
    baseMethod += '，注意控制节奏'
  } else if (balanceType === '过弱' || balanceType === '偏弱') {
    baseMethod += '，量力而行'
  }

  return baseMethod
}

/**
 * 生成依据说明
 */
function generateBasis() {
  return {
    theory: `
      本次推演基于传统四柱八字子平法，分析您的出生年、月、日、时所形成的命盘格局。
      参考典籍：《渊海子平》、《三命通会》、《子平真诠》、《滴天髓》。

      核心要素：
      • 日主：代表您本人，是分析的核心
      • 五行：金、木、水、火、土的生克关系
      • 十神：比肩、劫财、食神、伤官、正财、偏财、正官、七杀、正印、偏印
      • 流年：2026丙午年，天干丙火，地支午火
    `,
    rules: `
      排盘规则：
      • 年柱：以立春为年界，非农历初一
      • 月柱：按节气分月，共二十四节气
      • 日柱：公历日期对应，每日一字
      • 时柱：一个时辰两小时，共十二时辰

      流年分析：
      • 2026年为丙午年，火旺之年
      • 分析丙火与您日主的生克关系
      • 结合您选择的用事处境，给出针对性建议
    `,
    disclaimer: `
      免责声明：
      • 本报告仅供娱乐参考，不构成投资、医疗、法律等专业建议
      • 命理分析博大精深，此处仅为简化解读
      • 运势是变化的，重要的是保持积极心态，努力奋斗
      • 请理性看待，切勿过度迷信
    `
  }
}
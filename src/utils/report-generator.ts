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
 * 生成总体运势
 */
function generateOverall(chartProfile: ChartProfile, userContext: UserContext) {
  const { dayMaster, fiveElements, balanceType, year2026Impact } = chartProfile
  const { useMatter, strategy } = userContext

  // 基础分数计算（简化版）
  let baseScore = 70
  if (year2026Impact.type === '助力') baseScore += 15
  if (year2026Impact.type === '机会') baseScore += 10
  if (year2026Impact.type === '消耗') baseScore -= 5
  if (year2026Impact.type === '压力') baseScore -= 10

  // 根据用事调整
  const matterBonus: Record<string, number> = {
    '求官': 0,
    '求财': 0,
    '婚恋': 0,
    '康宁': 0,
    '交游': 0
  }
  baseScore += matterBonus[useMatter] || 0

  // 根据打法调整
  const strategyBonus: Record<string, number> = {
    '稳守': balanceType === '偏弱' ? 5 : 0,
    '进取': balanceType === '偏强' ? 5 : 0,
    '先守后攻': 3,
    '先攻后守': 2
  }
  baseScore += strategyBonus[strategy] || 0

  // 限制分数范围
  const score = Math.max(40, Math.min(95, baseScore))

  // 生成标题
  const headlines = {
    '助力': ['火运助身，势如破竹', '得时得势，大展宏图', '春风得意，马到成功'],
    '机会': ['机遇降临，把握良机', '时来运转，大有可为', '天时地利，蓄势待发'],
    '消耗': ['多付出多收获', '劳心劳力，厚积薄发', '耕耘有时，收获可期'],
    '压力': ['挑战与机遇并存', '化压力为动力', '淬炼成钢，更进一步']
  }

  const headline = headlines[year2026Impact.type][Math.floor(Math.random() * 3)]

  // 生成关键词
  const keywords = year2026Themes.positive.slice(0, 3)

  if (year2026Impact.type === '消耗') {
    keywords.push('劳逸结合')
  }
  if (year2026Impact.type === '压力') {
    keywords.push('以柔克刚')
  }

  // 生成核心建议
  const advices = {
    '助力': '把握丙午火运，主动出击，展现才华，但需戒骄戒躁',
    '机会': '审时度势，抓住机遇，稳扎稳打，不可冒进',
    '消耗': '合理分配精力，多在表达创作上发力，注意休养生息',
    '压力': '以退为进，化解压力，借力打力，寻求突破'
  }

  const oneAdvice = advices[year2026Impact.type]

  return {
    score,
    headline,
    keywords,
    oneAdvice
  }
}

/**
 * 生成五大领域运势
 */
function generateDomains(chartProfile: ChartProfile, userContext: UserContext) {
  const domains = ['事业', '财运', '婚恋', '健康', '人际'] as const
  const { useMatter, strategy, energy } = userContext
  const { year2026Impact, fiveElements, balanceType } = chartProfile

  return domains.map(domain => {
    // 是否为重点领域
    const isKeyDomain = (
      (useMatter === '求官' && domain === '事业') ||
      (useMatter === '求财' && domain === '财运') ||
      (useMatter === '婚恋' && domain === '婚恋') ||
      (useMatter === '康宁' && domain === '健康') ||
      (useMatter === '交游' && domain === '人际')
    )

    // 基础分数
    let score = 65 + Math.floor(Math.random() * 20)

    // 重点领域加分
    if (isKeyDomain) {
      score += 10
    }

    // 根据火运影响调整
    if (domain === '事业' || domain === '人际') {
      if (year2026Impact.type === '助力') score += 8
      if (year2026Impact.type === '机会') score += 5
    }

    if (domain === '健康' && year2026Impact.type === '消耗') {
      score -= 8
    }

    score = Math.max(40, Math.min(95, score))

    // 生成趋势
    const trends: Array<'上升' | '平稳' | '波动' | '偏压力'> = ['上升', '平稳', '波动', '偏压力']
    let trend: typeof trends[0]

    if (score >= 80) trend = '上升'
    else if (score >= 70) trend = '平稳'
    else if (score >= 60) trend = '波动'
    else trend = '偏压力'

    // 生成亮点和陷阱
    const domainData = {
      '事业': {
        brightSpot: '发挥创意和表达能力的时机',
        pitfall: '避免过于急躁，注意团队协作',
        actions: [
          '提升专业技能，增强核心竞争力',
          '把握火运带来的表达机会',
          '建立良好的人际网络'
        ],
        basisLite: '丙午火有利于事业发展，发挥才能'
      },
      '财运': {
        brightSpot: '正财稳定，偏财有机会',
        pitfall: '防范冲动消费和投资风险',
        actions: [
          '稳健理财，避免投机',
          '积极寻找增收渠道',
          '合理规划支出'
        ],
        basisLite: '火土相生，财运平稳上升'
      },
      '婚恋': {
        brightSpot: '感情表达更加顺畅',
        pitfall: '情绪波动较大，需理性沟通',
        actions: [
          '主动表达爱意和关怀',
          '控制情绪，避免争执',
          '创造浪漫相处时光'
        ],
        basisLite: '火旺有利于感情升温'
      },
      '健康': {
        brightSpot: '精力充沛，活力旺盛',
        pitfall: '注意防暑降温和心脏保养',
        actions: [
          '规律作息，避免熬夜',
          '适度运动，强身健体',
          '清淡饮食，多喝水'
        ],
        basisLite: '火旺需注意水火平衡'
      },
      '人际': {
        brightSpot: '社交活跃，人脉拓展',
        pitfall: '言辞犀利，容易得罪人',
        actions: [
          '主动社交，扩大圈子',
          '注意沟通方式，温和表达',
          '维护重要人际关系'
        ],
        basisLite: '丙午增强表达能力和社交魅力'
      }
    }

    const data = domainData[domain]

    return {
      name: domain,
      score,
      trend,
      brightSpot: data.brightSpot,
      pitfall: data.pitfall,
      actions: data.actions,
      basisLite: data.basisLite
    }
  })
}

/**
 * 生成12个月运势
 */
function generateMonths(chartProfile: ChartProfile, userContext: UserContext) {
  const { useMatter, taboos } = userContext
  const { year2026Impact } = chartProfile

  const months = []
  for (let i = 0; i < 12; i++) {
    const monthNum = i + 1
    const solarTerm = monthSolarTerms[i * 2] // 每月两个节气，取第一个

    // 生成标签
    const tags = ['吉', '平', '凶', '机会', '挑战', '转折']
    const tag = tags[Math.floor(Math.random() * tags.length)]

    // 生成主题
    const themes = {
      '吉': ['春风得意', '诸事顺遂', '喜气洋洋'],
      '平': ['平稳过渡', '按部就班', '保持现状'],
      '凶': ['谨慎行事', '低调做人', '避免冲动'],
      '机会': ['把握良机', '主动出击', '大展拳脚'],
      '挑战': ['迎难而上', '化险为夷', '借力使力'],
      '转折': ['审时度势', '灵活变通', '重新规划']
    }

    const theme = themes[tag as keyof typeof themes][Math.floor(Math.random() * 3)]

    // 生成提醒
    const reminders = [
      '注意言行举止',
      '把握时机，果断行动',
      '保持冷静，理性决策',
      '多听他人意见',
      '注重身体健康',
      '维护重要关系'
    ]

    const selectedReminders: string[] = []
    for (let j = 0; j < 2; j++) {
      const reminder = reminders[Math.floor(Math.random() * reminders.length)]
      if (!selectedReminders.includes(reminder)) {
        selectedReminders.push(reminder)
      }
    }

    // 生成宜做的事
    const goodFor = [
      '学习进修', '商务洽谈', '社交聚会', '签约合作',
      '表白求婚', '投资理财', '体检养生', '乔迁搬家'
    ][Math.floor(Math.random() * 8)]

    // 生成方法建议
    const methodLite = monthNum % 3 === 0 ? '宜静不宜动' : '宜主动出击'

    months.push({
      month: monthNum,
      tag,
      theme,
      reminders: selectedReminders,
      goodFor,
      methodLite
    })
  }

  return months
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
import { StoredData, ChartProfile, UserContext, Report } from '@/types'
import { analyzeChart } from '@/utils/chart-analysis'
import { generateReport } from '@/utils/report-generator'

const DB_NAME = 'fortune2026'
const DB_VERSION = 1
const STORE_NAME = 'testResults'

export class ClientStorage {
  private db: IDBDatabase | null = null

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error('Failed to open database'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('attempt_token', 'attempt_token', { unique: true })
          store.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }

  private async ensureDB() {
    if (!this.db) {
      await this.init()
    }
  }

  async saveTestResult(data: {
    birthInfo: any
    situation: UserContext
  }) {
    // 备用方案：使用 localStorage
    try {
      // 分析命盘
      const chartProfile = analyzeChart(
        data.birthInfo.year,
        data.birthInfo.month,
        data.birthInfo.day,
        data.birthInfo.hour,
        data.birthInfo.minute,
        data.birthInfo.isHourUnknown,
        data.birthInfo.timezone
      )

      // 生成报告
      const report = generateReport(chartProfile, data.situation)

      const storedData = {
        attempt_token: 'token_' + Date.now(),
        result_snapshot: {
          chartProfile,
          userContext: data.situation,
          report
        },
        profile_hash: Date.now().toString(),
        timestamp: Date.now(),
        version: '1.0.0'
      }

      // 使用 localStorage 保存
      localStorage.setItem('fortune2026_result', JSON.stringify(storedData))

      return Promise.resolve()
    } catch (error) {
      console.error('分析或生成报告时出错:', error)
      return Promise.reject(error)
    }
  }

  async getResult(): Promise<StoredData | null> {
    // 备用方案：使用 localStorage
    try {
      const data = localStorage.getItem('fortune2026_result')
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('获取数据失败:', error)
      return null
    }
  }

  async hasResult(): Promise<boolean> {
    const result = await this.getResult()
    return result !== null
  }

  async clearAll() {
    // 备用方案：使用 localStorage
    try {
      localStorage.removeItem('fortune2026_result')
      return Promise.resolve()
    } catch (error) {
      console.error('清除数据失败:', error)
      return Promise.reject(error)
    }
  }

  private generateToken(): string {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  private generateHash(data: any): string {
    // 简单的hash函数，用于验证数据完整性
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(36)
  }
}

// 单例模式
let storageInstance: ClientStorage | null = null

export function createClientStorage(): ClientStorage {
  if (!storageInstance) {
    storageInstance = new ClientStorage()
  }
  return storageInstance
}

// 兼容 localStorage 的简单版本（备用方案）
export function createLocalStorage() {
  return {
    async saveTestResult(data: any) {
      const chartProfile = analyzeChart(
        data.birthInfo.year,
        data.birthInfo.month,
        data.birthInfo.day,
        data.birthInfo.hour,
        data.birthInfo.minute,
        data.birthInfo.isHourUnknown,
        data.birthInfo.timezone
      )
      const report = generateReport(chartProfile, data.situation)

      const storedData = {
        attempt_token: 'token_' + Date.now(),
        result_snapshot: {
          chartProfile,
          userContext: data.situation,
          report
        },
        profile_hash: Date.now().toString(),
        timestamp: Date.now(),
        version: '1.0.0'
      }

      localStorage.setItem('fortune2026_result', JSON.stringify(storedData))
    },

    async getResult(): Promise<StoredData | null> {
      const data = localStorage.getItem('fortune2026_result')
      return data ? JSON.parse(data) : null
    },

    async hasResult(): Promise<boolean> {
      return !!localStorage.getItem('fortune2026_result')
    },

    async clearAll() {
      localStorage.removeItem('fortune2026_result')
    }
  }
}
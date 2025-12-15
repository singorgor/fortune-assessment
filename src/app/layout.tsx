import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '2026丙午·命盘运势推演录',
  description: '输入出生信息推导命盘画像，生成2026年趋势与行动建议',
  manifest: '/manifest.json',
  themeColor: '#d97706',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration)
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError)
                    })
                })
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '网易云 to Bilibili 收藏夹同步工具',
  description: '自动同步网易云音乐歌单到 Bilibili 收藏夹',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                网易云 to Bilibili 收藏夹同步工具
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                自动同步网易云音乐歌单到 Bilibili 收藏夹
              </p>
            </div>
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
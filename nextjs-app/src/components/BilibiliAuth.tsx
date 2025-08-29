'use client'

import { useState } from 'react'
import { BilibiliAuth as BilibiliAuthType } from '@/types'

interface BilibiliAuthProps {
  onComplete: (auth: BilibiliAuthType) => void
}

export default function BilibiliAuth({ onComplete }: BilibiliAuthProps) {
  const [sessdata, setSessdata] = useState('')
  const [biliJct, setBiliJct] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!sessdata || !biliJct) {
      setError('请填写完整的认证信息')
      return
    }

    // 验证 cookie 有效性
    try {
      const response = await fetch('/api/verify-bilibili-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessdata, biliJct }),
      })

      const result = await response.json()

      if (result.success) {
        onComplete({ sessdata, biliJct })
      } else {
        setError(result.error || 'Cookie 验证失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">步骤 2: Bilibili 认证</h2>
      
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <h3 className="font-medium text-blue-900 mb-2">如何获取 Cookie：</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. 在浏览器中登录 <a href="https://www.bilibili.com" target="_blank" rel="noopener noreferrer" className="underline">bilibili.com</a></li>
            <li>2. 按 F12 打开开发者工具</li>
            <li>3. 点击 "Application" 或"应用程序" 标签</li>
            <li>4. 在左侧找到 "Cookies" → "https://www.bilibili.com"</li>
            <li>5. 找到 "SESSDATA" 和 "bili_jct" 并复制它们的值</li>
          </ol>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SESSDATA
          </label>
          <input
            type="text"
            value={sessdata}
            onChange={(e) => setSessdata(e.target.value)}
            placeholder="请输入 SESSDATA 值"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            bili_jct
          </label>
          <input
            type="text"
            value={biliJct}
            onChange={(e) => setBiliJct(e.target.value)}
            placeholder="请输入 bili_jct 值"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!sessdata || !biliJct}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        验证并继续
      </button>
    </div>
  )
}
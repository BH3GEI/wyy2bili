'use client'

import { useState } from 'react'
import { Song } from '@/types'

interface PlaylistFormProps {
  onSubmit: (playlist: Song[]) => void
}

export default function PlaylistForm({ onSubmit }: PlaylistFormProps) {
  const [url, setUrl] = useState('')
  const [manualSongs, setManualSongs] = useState('')
  const [mode, setMode] = useState<'url' | 'manual'>('url')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUrlSubmit = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/parse-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        onSubmit(result.songs)
      } else {
        setError(result.error || '解析失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleManualSubmit = () => {
    const lines = manualSongs.trim().split('\n')
    const songs: Song[] = []
    
    for (const line of lines) {
      const parts = line.split(' - ')
      if (parts.length >= 2) {
        songs.push({
          name: parts[0].trim(),
          artist: parts[1].trim()
        })
      }
    }
    
    if (songs.length > 0) {
      onSubmit(songs)
    } else {
      setError('请输入有效的歌曲列表格式：歌名 - 歌手')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">步骤 1: 获取歌单</h2>
      
      <div className="mb-4">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${mode === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setMode('url')}
          >
            网易云歌单链接
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setMode('manual')}
          >
            手动输入歌单
          </button>
        </div>
      </div>

      {mode === 'url' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            网易云音乐歌单URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://music.163.com/playlist?id=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            注意：由于技术限制，目前可能需要您手动获取歌单数据
          </p>
          <button
            onClick={handleUrlSubmit}
            disabled={!url || loading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '解析中...' : '解析歌单'}
          </button>
        </div>
      )}

      {mode === 'manual' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            歌曲列表 (每行一首歌，格式：歌名 - 歌手)
          </label>
          <textarea
            value={manualSongs}
            onChange={(e) => setManualSongs(e.target.value)}
            placeholder="稻香 - 周杰伦&#10;青花瓷 - 周杰伦&#10;..."
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleManualSubmit}
            disabled={!manualSongs.trim()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            确认歌单
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  )
}
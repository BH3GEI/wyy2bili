'use client'

import { useState, useEffect } from 'react'
import { Song, BilibiliAuth, SyncProgress as SyncProgressType } from '@/types'

interface SyncProgressProps {
  playlist: Song[]
  auth: BilibiliAuth
  onProgress: (progress: SyncProgressType) => void
}

export default function SyncProgress({ playlist, auth, onProgress }: SyncProgressProps) {
  const [progress, setProgress] = useState<SyncProgressType>({
    current: 0,
    total: playlist.length,
    status: 'searching'
  })
  const [collectedSongs, setCollectedSongs] = useState<(Song & { bvid?: string; error?: string })[]>([])
  const [folderName, setFolderName] = useState('')

  useEffect(() => {
    startSync()
  }, [])

  const startSync = async () => {
    try {
      // 创建收藏夹
      const folderResponse = await fetch('/api/create-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auth),
      })

      const folderResult = await folderResponse.json()
      if (!folderResult.success) {
        throw new Error(folderResult.error)
      }

      setFolderName(folderResult.folderName)

      // 开始同步歌曲
      for (let i = 0; i < playlist.length; i++) {
        const song = playlist[i]
        
        setProgress(prev => ({
          ...prev,
          current: i + 1,
          currentSong: song,
          status: 'searching',
          message: `正在搜索: ${song.name} - ${song.artist}`
        }))

        try {
          const response = await fetch('/api/sync-song', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              song,
              auth,
              folderId: folderResult.folderId
            }),
          })

          const result = await response.json()

          if (result.success) {
            setCollectedSongs(prev => [...prev, { ...song, bvid: result.bvid }])
            setProgress(prev => ({
              ...prev,
              status: 'collecting',
              message: `已收藏: ${result.title}`
            }))
          } else {
            setCollectedSongs(prev => [...prev, { ...song, error: result.error }])
            setProgress(prev => ({
              ...prev,
              status: 'error',
              message: `失败: ${result.error}`
            }))
          }

          // 延迟防风控
          if (i < playlist.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 3000))
          }
          
          // 每50首暂停
          if ((i + 1) % 50 === 0 && i < playlist.length - 1) {
            setProgress(prev => ({
              ...prev,
              status: 'searching',
              message: '暂停 10 分钟防风控...'
            }))
            await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000))
          }

        } catch (error) {
          setCollectedSongs(prev => [...prev, { ...song, error: '网络错误' }])
        }

        onProgress(progress)
      }

      setProgress(prev => ({
        ...prev,
        status: 'completed',
        message: '同步完成！'
      }))

    } catch (error) {
      setProgress(prev => ({
        ...prev,
        status: 'error',
        message: `同步失败: ${error instanceof Error ? error.message : '未知错误'}`
      }))
    }
  }

  const successCount = collectedSongs.filter(s => s.bvid).length
  const errorCount = collectedSongs.filter(s => s.error).length

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">步骤 3: 同步进度</h2>
      
      {folderName && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          已创建收藏夹: {folderName}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>进度: {progress.current} / {progress.total}</span>
          <span>{Math.round((progress.current / progress.total) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          ></div>
        </div>
        {progress.message && (
          <p className="text-sm text-gray-600 mt-2">{progress.message}</p>
        )}
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-lg font-semibold text-blue-600">{progress.total}</div>
            <div className="text-sm text-gray-600">总数</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-lg font-semibold text-green-600">{successCount}</div>
            <div className="text-sm text-gray-600">成功</div>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <div className="text-lg font-semibold text-red-600">{errorCount}</div>
            <div className="text-sm text-gray-600">失败</div>
          </div>
        </div>
      </div>

      {collectedSongs.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">处理结果:</h3>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {collectedSongs.map((song, index) => (
              <div 
                key={index}
                className={`text-sm p-2 rounded flex justify-between ${
                  song.bvid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                <span>{song.name} - {song.artist}</span>
                <span>
                  {song.bvid ? '✓' : `✗ ${song.error}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
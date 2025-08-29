import { NextRequest, NextResponse } from 'next/server'
import { BilibiliAPI, isValidDuration } from '@/lib/bilibili'

export async function POST(request: NextRequest) {
  try {
    const { song, auth, folderId } = await request.json()

    if (!song || !auth || !folderId) {
      return NextResponse.json({ 
        success: false, 
        error: '参数不完整' 
      })
    }

    const bilibiliAPI = new BilibiliAPI(auth)
    const keyword = `${song.name} ${song.artist}`

    // 搜索视频
    const searchResult = await bilibiliAPI.searchVideos(keyword)

    if (!searchResult.success || !searchResult.videos) {
      return NextResponse.json({ 
        success: false, 
        error: searchResult.error || '搜索失败' 
      })
    }

    // 筛选合适的视频 (1-10分钟)
    const suitableVideos = searchResult.videos.filter(video => 
      isValidDuration(video.duration)
    )

    if (suitableVideos.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '未找到时长合适的视频' 
      })
    }

    // 选择第一个合适的视频
    const selectedVideo = suitableVideos[0]

    // 添加到收藏夹
    const addResult = await bilibiliAPI.addToFavorites(selectedVideo.bvid, folderId)

    if (addResult.success) {
      return NextResponse.json({
        success: true,
        bvid: selectedVideo.bvid,
        title: selectedVideo.title
      })
    } else {
      return NextResponse.json({
        success: false,
        error: addResult.error || '收藏失败'
      })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: '服务器错误' 
    })
  }
}
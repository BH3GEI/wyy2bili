import { NextRequest, NextResponse } from 'next/server'
import { BilibiliAPI } from '@/lib/bilibili'

export async function POST(request: NextRequest) {
  try {
    const { sessdata, biliJct } = await request.json()

    if (!sessdata || !biliJct) {
      return NextResponse.json({ 
        success: false, 
        error: '请提供完整的认证信息' 
      })
    }

    const bilibiliAPI = new BilibiliAPI({ sessdata, biliJct })
    
    // 创建以当前时间命名的收藏夹
    const now = new Date()
    const folderName = now.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/[^\d]/g, '')

    const result = await bilibiliAPI.createFavoriteFolder(folderName)

    if (result.success) {
      return NextResponse.json({
        success: true,
        folderId: result.folderId,
        folderName
      })
    } else {
      return NextResponse.json(result)
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: '服务器错误' 
    })
  }
}
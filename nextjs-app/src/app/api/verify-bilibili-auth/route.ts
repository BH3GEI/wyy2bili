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
    const result = await bilibiliAPI.verifyAuth()

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: '服务器错误' 
    })
  }
}
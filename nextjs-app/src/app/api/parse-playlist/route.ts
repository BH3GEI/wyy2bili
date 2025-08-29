import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ success: false, error: '请提供有效的URL' })
    }

    // 由于Vercel无法运行Selenium，这里提供一个替代方案
    // 实际部署时，用户需要手动获取歌单数据或使用其他服务
    
    return NextResponse.json({ 
      success: false, 
      error: '由于技术限制，请使用手动输入方式。未来版本将支持API解析。' 
    })

    // TODO: 实现网易云API解析或使用第三方服务
    // 可能的解决方案：
    // 1. 使用网易云音乐API (需要逆向工程)
    // 2. 使用第三方解析服务
    // 3. 让用户在客户端获取数据后提交
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: '服务器错误' 
    })
  }
}
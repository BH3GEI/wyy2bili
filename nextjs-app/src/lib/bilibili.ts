import { BilibiliAuth, BilibiliVideoInfo } from '@/types'

const BILIBILI_API_BASE = 'https://api.bilibili.com'

export class BilibiliAPI {
  private auth: BilibiliAuth

  constructor(auth: BilibiliAuth) {
    this.auth = auth
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Cookie': `SESSDATA=${this.auth.sessdata}; bili_jct=${this.auth.biliJct}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  }

  async verifyAuth(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${BILIBILI_API_BASE}/x/web-interface/nav`, {
        headers: this.getHeaders()
      })
      
      const data = await response.json()
      
      if (data.code === 0 && data.data.isLogin) {
        return { success: true }
      } else {
        return { success: false, error: '登录已过期或Cookie无效' }
      }
    } catch (error) {
      return { success: false, error: '网络错误' }
    }
  }

  async createFavoriteFolder(title: string): Promise<{ success: boolean; folderId?: number; error?: string }> {
    try {
      const response = await fetch(`${BILIBILI_API_BASE}/x/v3/fav/folder/add`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          title,
          intro: '网易云歌单自动同步',
          privacy: 0,
          csrf: this.auth.biliJct
        })
      })

      const data = await response.json()

      if (data.code === 0) {
        return { success: true, folderId: data.data.id }
      } else {
        return { success: false, error: data.message || '创建收藏夹失败' }
      }
    } catch (error) {
      return { success: false, error: '网络错误' }
    }
  }

  async searchVideos(keyword: string): Promise<{ success: boolean; videos?: BilibiliVideoInfo[]; error?: string }> {
    try {
      const encodedKeyword = encodeURIComponent(keyword)
      const response = await fetch(`${BILIBILI_API_BASE}/x/web-interface/search/type?search_type=video&keyword=${encodedKeyword}&page=1&pagesize=20`, {
        headers: this.getHeaders()
      })

      const data = await response.json()

      if (data.code === 0 && data.data.result) {
        const videos: BilibiliVideoInfo[] = data.data.result.map((item: any) => ({
          bvid: item.bvid,
          title: item.title.replace(/<[^>]*>/g, ''), // 移除HTML标签
          duration: item.duration,
          author: item.author,
          pic: item.pic
        }))
        return { success: true, videos }
      } else {
        return { success: false, error: data.message || '搜索失败' }
      }
    } catch (error) {
      return { success: false, error: '网络错误' }
    }
  }

  async addToFavorites(bvid: string, folderId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${BILIBILI_API_BASE}/x/v3/fav/resource/deal`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          rid: bvid,
          type: 2,
          add_media_ids: [folderId],
          del_media_ids: [],
          csrf: this.auth.biliJct
        })
      })

      const data = await response.json()

      if (data.code === 0) {
        return { success: true }
      } else {
        return { success: false, error: data.message || '收藏失败' }
      }
    } catch (error) {
      return { success: false, error: '网络错误' }
    }
  }
}

export function parseDuration(duration: string): number {
  const parts = duration.split(':').map(Number)
  let seconds = 0
  
  for (let i = 0; i < parts.length; i++) {
    seconds += parts[parts.length - 1 - i] * Math.pow(60, i)
  }
  
  return seconds
}

export function isValidDuration(duration: string): boolean {
  const seconds = parseDuration(duration)
  return seconds >= 60 && seconds <= 600 // 1-10分钟
}
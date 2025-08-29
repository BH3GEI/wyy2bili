export interface Song {
  name: string
  artist: string
}

export interface BilibiliAuth {
  sessdata: string
  biliJct: string
}

export interface SyncProgress {
  current: number
  total: number
  currentSong?: Song
  status: 'searching' | 'collecting' | 'completed' | 'error'
  message?: string
}

export interface SyncState {
  step: 'playlist' | 'auth' | 'sync'
  playlist: Song[] | null
  bilibiliAuth: BilibiliAuth | null
  progress: SyncProgress | null
}

export interface PlaylistParseResult {
  success: boolean
  songs?: Song[]
  error?: string
}

export interface BilibiliVideoInfo {
  bvid: string
  title: string
  duration: string
  author: string
  pic: string
}

export interface BilibiliSearchResult {
  result: BilibiliVideoInfo[]
  total: number
}
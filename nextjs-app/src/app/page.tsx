'use client'

import { useState } from 'react'
import PlaylistForm from '@/components/PlaylistForm'
import BilibiliAuth from '@/components/BilibiliAuth'
import SyncProgress from '@/components/SyncProgress'
import { Song, SyncState } from '@/types'

export default function Home() {
  const [syncState, setSyncState] = useState<SyncState>({
    step: 'playlist',
    playlist: null,
    bilibiliAuth: null,
    progress: null
  })

  const handlePlaylistSubmit = (playlist: Song[]) => {
    setSyncState(prev => ({
      ...prev,
      step: 'auth',
      playlist
    }))
  }

  const handleAuthComplete = (auth: { sessdata: string; biliJct: string }) => {
    setSyncState(prev => ({
      ...prev,
      step: 'sync',
      bilibiliAuth: auth
    }))
  }

  const handleSyncProgress = (progress: any) => {
    setSyncState(prev => ({
      ...prev,
      progress
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {syncState.step === 'playlist' && (
          <PlaylistForm onSubmit={handlePlaylistSubmit} />
        )}
        
        {syncState.step === 'auth' && (
          <BilibiliAuth onComplete={handleAuthComplete} />
        )}
        
        {syncState.step === 'sync' && syncState.playlist && syncState.bilibiliAuth && (
          <SyncProgress 
            playlist={syncState.playlist}
            auth={syncState.bilibiliAuth}
            onProgress={handleSyncProgress}
          />
        )}
      </div>
    </div>
  )
}
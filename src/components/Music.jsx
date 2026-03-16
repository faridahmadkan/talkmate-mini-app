import React, { useState } from 'react'

function Music({ user }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(null)

  const tg = window.Telegram?.WebApp

  const searchMusic = () => {
    if (!query.trim()) {
      tg?.showAlert('Please enter a song name')
      return
    }

    setLoading(true)
    tg?.HapticFeedback?.impactOccurred('medium')

    // Mock music results (free samples from SoundHelix)
    const mockResults = [
      {
        id: 1,
        title: `${query} - Official Audio`,
        artist: 'Official Artist',
        duration: '3:45',
        size: '4.2 MB',
        downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      },
      {
        id: 2,
        title: `${query} (Remix)`,
        artist: 'DJ Remix',
        duration: '4:20',
        size: '5.1 MB',
        downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      },
      {
        id: 3,
        title: `${query} - Live Version`,
        artist: 'Live Band',
        duration: '5:10',
        size: '6.3 MB',
        downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      },
      {
        id: 4,
        title: `${query} (Acoustic)`,
        artist: 'Acoustic Session',
        duration: '3:55',
        size: '4.5 MB',
        downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
      },
      {
        id: 5,
        title: `${query} - Instrumental`,
        artist: 'Studio Orchestra',
        duration: '4:05',
        size: '4.8 MB',
        downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
      }
    ]

    setTimeout(() => {
      setResults(mockResults)
      setLoading(false)
    }, 1000)
  }

  const handleDownload = (track) => {
    setDownloading(track.id)
    tg?.HapticFeedback?.impactOccurred('heavy')
    
    // Open in browser or trigger download
    window.open(track.downloadUrl, '_blank')
    
    tg?.showAlert(`Downloading: ${track.title}\n\nThe file is downloading in your browser.`)
    
    setTimeout(() => {
      setDownloading(null)
    }, 2000)
  }

  return (
    <div className="music-container">
      <input
        type="text"
        className="input"
        placeholder="Search for music (e.g., Shape of You)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && searchMusic()}
      />
      
      <button 
        className="button" 
        onClick={searchMusic}
        disabled={loading}
      >
        {loading ? 'Searching...' : '🎵 Search Music'}
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 className="card-title">Results for "{query}"</h3>
          {results.map(track => (
            <div key={track.id} className="card" style={{ padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{track.title}</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>{track.artist}</div>
                  <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '5px' }}>
                    ⏱️ {track.duration} • 📦 {track.size}
                  </div>
                </div>
                <button
                  className="button"
                  style={{ width: 'auto', padding: '10px 20px', margin: 0 }}
                  onClick={() => handleDownload(track)}
                  disabled={downloading === track.id}
                >
                  {downloading === track.id ? '...' : '📥'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Music
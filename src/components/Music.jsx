import React, { useState } from 'react'

function Music({ user, addNotification }) {
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
      addNotification?.(`Found ${mockResults.length} results for "${query}"`)
      setLoading(false)
    }, 1000)
  }

  const handleDownload = (track) => {
    setDownloading(track.id)
    tg?.HapticFeedback?.impactOccurred('heavy')
    
    // Open in browser or trigger download
    window.open(track.downloadUrl, '_blank')
    
    tg?.showAlert(`Downloading: ${track.title}\n\nThe file is downloading in your browser.`)
    addNotification?.(`Downloaded: ${track.title}`)
    
    setTimeout(() => {
      setDownloading(null)
    }, 2000)
  }

  return (
    <div className="music-container">
      <h2 className="section-title">🎵 Music Service</h2>
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
        <div className="results-section">
          <h3>Results for "{query}"</h3>
          {results.map(track => (
            <div key={track.id} className="music-card">
              <div className="music-info">
                <div className="music-title">{track.title}</div>
                <div className="music-artist">{track.artist}</div>
                <div className="music-meta">
                  ⏱️ {track.duration} • 📦 {track.size}
                </div>
              </div>
              <button
                className="download-button"
                onClick={() => handleDownload(track)}
                disabled={downloading === track.id}
              >
                {downloading === track.id ? '...' : '📥'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Music
import React, { useState, useEffect } from 'react'
import { fetchUserData } from '../api'

function Profile({ user }) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const tg = window.Telegram?.WebApp

  useEffect(() => {
    if (user?.id) {
      fetchUserData(user.id)
        .then(data => {
          setUserData(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [user])

  const handleShare = () => {
    tg?.HapticFeedback?.impactOccurred('medium')
    tg?.showAlert('Share this bot with your friends!\n\nhttps://t.me/YOUR_BOT_USERNAME')
  }

  const handleContact = () => {
    tg?.HapticFeedback?.impactOccurred('medium')
    tg?.openTelegramLink('https://t.me/faridahmadkan')
  }

  const handleRateLimit = () => {
    tg?.HapticFeedback?.impactOccurred('light')
    tg?.showAlert('You can send 10 messages per minute.\nThis ensures fair usage for everyone.')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="card">
        <h3 className="card-title">👤 User Profile</h3>
        <div style={{ marginBottom: '15px' }}>
          <p><strong>Name:</strong> {user?.first_name} {user?.last_name || ''}</p>
          <p><strong>Username:</strong> @{user?.username || 'N/A'}</p>
          <p><strong>User ID:</strong> <code>{user?.id}</code></p>
          <p><strong>Language:</strong> {user?.language_code || 'en'}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">📊 Statistics</h3>
        <div className="grid-3">
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
              {userData?.profile?.messageCount || 0}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>Messages</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
              {userData?.favorites?.length || 0}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>Favorites</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
              {userData?.stats?.activeToday || 0}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>Active Today</div>
          </div>
        </div>
      </div>

      {userData?.favorites && userData.favorites.length > 0 && (
        <div className="card">
          <h3 className="card-title">⭐ Recent Favorites</h3>
          {userData.favorites.slice(0, 3).map((fav, i) => (
            <div key={i} style={{ 
              padding: '10px', 
              background: 'var(--card-bg)',
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              {fav.text}
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3 className="card-title">⚙️ Settings & Info</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold' }}>⏱️ Rate Limit</div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px' }}>
            10 messages per minute
          </div>
          <button className="button secondary" onClick={handleRateLimit}>
            Learn More
          </button>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold' }}>📱 Contact Creator</div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px' }}>
            Farid Ahmad Khan
          </div>
          <button className="button secondary" onClick={handleContact}>
            📨 Message Creator
          </button>
        </div>

        <button className="button" onClick={handleShare}>
          📤 Share Bot
        </button>
      </div>
    </div>
  )
}

export default Profile
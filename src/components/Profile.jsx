import React, { useState, useEffect } from 'react'
import { fetchUserData } from '../api'

function Profile({ user, addNotification }) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('stats')

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
    const botUsername = 'TalkMatebot' // ✅ Your correct bot username
    const shareText = encodeURIComponent('🤖 Check out TalkMate Ultimate - the world\'s most powerful free Telegram bot!')
    const shareUrl = `https://t.me/share/url?url=https://t.me/${botUsername}&text=${shareText}`
    
    tg?.openTelegramLink(shareUrl)
    addNotification?.('Share dialog opened!')
  }

  const handleContact = () => {
    tg?.HapticFeedback?.impactOccurred('medium')
    tg?.openTelegramLink('https://t.me/faridahmadkan')
  }

  const handleRateLimit = () => {
    tg?.HapticFeedback?.impactOccurred('light')
    tg?.showAlert('You can send 10 messages per minute.\nThis ensures fair usage for everyone.')
  }

  const handleClearHistory = () => {
    tg?.HapticFeedback?.impactOccurred('heavy')
    tg?.showConfirm('Clear your chat history?', (confirmed) => {
      if (confirmed) {
        // Add logic to clear history
        addNotification?.('Chat history cleared')
        tg?.showAlert('Chat history cleared!')
      }
    })
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <h2 className="section-title">👤 Profile</h2>
      
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.first_name?.charAt(0) || 'U'}
        </div>
        <div className="profile-info">
          <h3>{user?.first_name} {user?.last_name || ''}</h3>
          <p>@{user?.username || 'No username'}</p>
          <p className="user-id">ID: {user?.id}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeSection === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveSection('stats')}
        >
          📊 Stats
        </button>
        <button 
          className={`tab-button ${activeSection === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveSection('favorites')}
        >
          ⭐ Favorites
        </button>
        <button 
          className={`tab-button ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Stats Section */}
      {activeSection === 'stats' && (
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{userData?.profile?.messageCount || 0}</div>
              <div className="stat-label">Messages</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userData?.favorites?.length || 0}</div>
              <div className="stat-label">Favorites</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userData?.stats?.activeToday || 0}</div>
              <div className="stat-label">Active Today</div>
            </div>
          </div>
          
          <div className="global-stats">
            <h4>🌍 Global Statistics</h4>
            <div className="stat-item">
              <span>Total Users:</span>
              <span>{userData?.stats?.totalUsers || 0}</span>
            </div>
            <div className="stat-item">
              <span>Banned Users:</span>
              <span>{userData?.stats?.bannedUsers || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Section */}
      {activeSection === 'favorites' && (
        <div className="favorites-section">
          <h4>⭐ Your Favorites</h4>
          {userData?.favorites && userData.favorites.length > 0 ? (
            userData.favorites.map((fav, i) => (
              <div key={i} className="favorite-item">
                {fav.text}
              </div>
            ))
          ) : (
            <p className="no-data">No favorites yet. Save responses using the ⭐ button!</p>
          )}
        </div>
      )}

      {/* Settings Section */}
      {activeSection === 'settings' && (
        <div className="settings-section">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">⏱️ Rate Limit</div>
              <div className="setting-description">10 messages per minute</div>
            </div>
            <button className="setting-button" onClick={handleRateLimit}>Info</button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">📱 Contact Creator</div>
              <div className="setting-description">Farid Ahmad Khan</div>
            </div>
            <button className="setting-button" onClick={handleContact}>Message</button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">🗑️ Chat History</div>
              <div className="setting-description">Clear your conversation</div>
            </div>
            <button className="setting-button danger" onClick={handleClearHistory}>Clear</button>
          </div>

          <button className="share-button" onClick={handleShare}>
            📤 Share Bot
          </button>
        </div>
      )}
    </div>
  )
}

export default Profile
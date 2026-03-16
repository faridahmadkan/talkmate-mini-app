import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Weather from './components/Weather'
import Music from './components/Music'
import News from './components/News'
import Profile from './components/Profile'
import { getTelegramUser } from './api'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('light')
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Initialize Telegram Web App
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      tg.enableClosingConfirmation?.()
      
      // Get user info
      const tgUser = getTelegramUser()
      setUser(tgUser)
      
      // Set theme
      setTheme(tg.colorScheme || 'light')
      
      // Handle theme changes
      tg.onEvent('themeChanged', () => {
        setTheme(tg.colorScheme)
      })
      
      // Show welcome notification
      addNotification(`Welcome ${tgUser?.first_name || 'User'}!`)
    }
    setLoading(false)
  }, [])

  const addNotification = (message) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading TalkMate Ultimate...</p>
      </div>
    )
  }

  return (
    <Router basename="/talkmate-mini-app">
      <div className={`app ${theme}`}>
        {/* Notifications */}
        <div className="notification-container">
          {notifications.map(notif => (
            <div key={notif.id} className="notification">
              {notif.message}
            </div>
          ))}
        </div>

        {/* Header */}
        <header className="app-header">
          <h1>TalkMate Ultimate</h1>
          {user && <p className="welcome">Welcome, {user.first_name}!</p>}
        </header>
        
        {/* Main Content */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/weather" replace />} />
            <Route path="/weather" element={<Weather user={user} addNotification={addNotification} />} />
            <Route path="/music" element={<Music user={user} addNotification={addNotification} />} />
            <Route path="/news" element={<News addNotification={addNotification} />} />
            <Route path="/profile" element={<Profile user={user} addNotification={addNotification} />} />
          </Routes>
        </main>
        
        {/* Bottom Navigation */}
        <Navigation />
      </div>
    </Router>
  )
}

export default App
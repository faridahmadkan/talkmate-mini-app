import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Weather from './components/Weather'
import Music from './components/Music'
import News from './components/News'
import Profile from './components/Profile'
import { getTelegramUser } from './api'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('light')

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
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--tg-theme-bg-color)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }}></div>
          <p>Loading TalkMate...</p>
        </div>
      </div>
    )
  }

  return (
    <Router basename="/talkmate-mini-app">
      <div className={`app ${theme}`}>
        <header className="app-header">
          <h1>TalkMate Ultimate</h1>
          {user && <p className="welcome">Welcome, {user.first_name}!</p>}
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/weather" replace />} />
            <Route path="/weather" element={<Weather user={user} />} />
            <Route path="/music" element={<Music user={user} />} />
            <Route path="/news" element={<News />} />
            <Route path="/profile" element={<Profile user={user} />} />
          </Routes>
        </main>
        
        <Navigation />
      </div>
    </Router>
  )
}

export default App
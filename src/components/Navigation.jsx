import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const tg = window.Telegram?.WebApp

  const handleClick = () => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light')
    }
  }

  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/weather" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        onClick={handleClick}
      >
        <span className="nav-icon">🌤️</span>
        <span className="nav-label">Weather</span>
      </NavLink>
      
      <NavLink 
        to="/music" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        onClick={handleClick}
      >
        <span className="nav-icon">🎵</span>
        <span className="nav-label">Music</span>
      </NavLink>
      
      <NavLink 
        to="/news" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        onClick={handleClick}
      >
        <span className="nav-icon">📰</span>
        <span className="nav-label">News</span>
      </NavLink>
      
      <NavLink 
        to="/profile" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        onClick={handleClick}
      >
        <span className="nav-icon">👤</span>
        <span className="nav-label">Profile</span>
      </NavLink>
    </nav>
  )
}

export default Navigation
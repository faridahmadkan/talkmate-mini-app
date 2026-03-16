import React, { useState } from 'react'
import axios from 'axios'

function Weather({ user }) {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forecast, setForecast] = useState([])

  const tg = window.Telegram?.WebApp

  const searchWeather = async () => {
    if (!city.trim()) {
      tg?.showAlert('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')
    tg?.HapticFeedback?.impactOccurred('medium')

    try {
      // Get current weather
      const response = await axios.get(
        `https://wttr.in/${encodeURIComponent(city)}?format=%c+%t+%h+%w+%p+%P&m`,
        { timeout: 10000 }
      )
      
      const data = response.data.trim().split(' ')
      if (data.length >= 6) {
        setWeather({
          condition: data[0],
          temp: data[1].replace('+', '').replace('°C', ''),
          humidity: data[2].replace('%', ''),
          wind: data[3].replace('km/h', ''),
          rain: data[4],
          pressure: data[5].replace('hPa', '')
        })

        // Get 3-day forecast
        const forecastRes = await axios.get(
          `https://wttr.in/${encodeURIComponent(city)}?format=%c+%t&m&days=3`,
          { timeout: 10000 }
        )
        
        const lines = forecastRes.data.trim().split('\n').filter(l => l.trim())
        const forecastData = lines.slice(1).map(line => {
          const parts = line.split(' ')
          return {
            condition: parts[0],
            temp: parts[1]?.replace('+', '').replace('°C', '') || 'N/A'
          }
        })
        setForecast(forecastData)
      } else {
        setError('City not found. Please try again.')
      }
    } catch (error) {
      setError('Weather service unavailable. Please try again.')
      console.error('Weather error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="weather-container">
      <input
        type="text"
        className="input"
        placeholder="Enter city name (e.g., London, Kabul, Tokyo)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && searchWeather()}
      />
      
      <button 
        className="button" 
        onClick={searchWeather}
        disabled={loading}
      >
        {loading ? 'Searching...' : '🌤️ Get Weather'}
      </button>

      {error && (
        <div className="card" style={{ background: '#ffebee', color: '#c62828' }}>
          {error}
        </div>
      )}

      {weather && (
        <div className="card">
          <h3 className="card-title">📍 {city}</h3>
          
          <div className="grid-2">
            <div className="weather-detail">
              <div style={{ fontSize: '14px', opacity: 0.7 }}>Condition</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{weather.condition}</div>
            </div>
            <div className="weather-detail">
              <div style={{ fontSize: '14px', opacity: 0.7 }}>Temperature</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
                {weather.temp}°C
              </div>
            </div>
            <div className="weather-detail">
              <div style={{ fontSize: '14px', opacity: 0.7 }}>💧 Humidity</div>
              <div style={{ fontSize: '18px' }}>{weather.humidity}%</div>
            </div>
            <div className="weather-detail">
              <div style={{ fontSize: '14px', opacity: 0.7 }}>💨 Wind</div>
              <div style={{ fontSize: '18px' }}>{weather.wind} km/h</div>
            </div>
            <div className="weather-detail">
              <div style={{ fontSize: '14px', opacity: 0.7 }}>📊 Pressure</div>
              <div style={{ fontSize: '18px' }}>{weather.pressure} hPa</div>
            </div>
            <div className="weather-detail">
              <div style={{ fontSize: '14px', opacity: 0.7 }}>🌧️ Rain</div>
              <div style={{ fontSize: '18px' }}>{weather.rain}</div>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="card">
          <h3 className="card-title">📅 3-Day Forecast</h3>
          <div className="grid-3">
            {forecast.map((day, i) => (
              <div key={i} className="weather-detail" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.7 }}>Day {i + 1}</div>
                <div style={{ fontSize: '20px' }}>{day.condition}</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{day.temp}°C</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Weather
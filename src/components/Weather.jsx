import React, { useState } from 'react'
import axios from 'axios'

function Weather({ user, addNotification }) {
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
        const weatherData = {
          city: city,
          condition: data[0],
          temp: data[1].replace('+', '').replace('°C', ''),
          humidity: data[2].replace('%', ''),
          wind: data[3].replace('km/h', ''),
          rain: data[4],
          pressure: data[5].replace('hPa', '')
        }
        setWeather(weatherData)
        addNotification?.(`Weather for ${city}: ${weatherData.temp}°C, ${weatherData.condition}`)

        // Get 5-day forecast
        const forecastRes = await axios.get(
          `https://wttr.in/${encodeURIComponent(city)}?format=%c+%t&m&days=5`,
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="weather-container">
      <h2 className="section-title">🌤️ Weather Service</h2>
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
        <div className="error-message">
          {error}
        </div>
      )}

      {weather && (
        <div className="weather-card">
          <h3>📍 {city}</h3>
          <div className="weather-main">
            <div className="weather-temp">{weather.temp}°C</div>
            <div className="weather-condition">{weather.condition}</div>
          </div>
          
          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-label">💧 Humidity</span>
              <span className="detail-value">{weather.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">💨 Wind</span>
              <span className="detail-value">{weather.wind} km/h</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📊 Pressure</span>
              <span className="detail-value">{weather.pressure} hPa</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">🌧️ Rain</span>
              <span className="detail-value">{weather.rain}</span>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-card">
          <h3>📅 5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecast.map((day, i) => (
              <div key={i} className="forecast-day">
                <div className="forecast-day-name">Day {i + 1}</div>
                <div className="forecast-condition">{day.condition}</div>
                <div className="forecast-temp">{day.temp}°C</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Weather
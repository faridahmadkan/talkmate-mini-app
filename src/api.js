import axios from 'axios'

// Your Render bot URL
const BOT_API_URL = 'https://talkmate-zpma.onrender.com'

export const getTelegramUser = () => {
  const tg = window.Telegram?.WebApp
  return tg?.initDataUnsafe?.user || null
}

export const fetchUserData = async (userId) => {
  try {
    // Try to fetch from your bot API
    const response = await axios.get(`${BOT_API_URL}/api/user-data`, {
      params: { userId },
      timeout: 5000
    })
    return response.data
  } catch (error) {
    console.error('API Error, using mock data:', error)
    // Return mock data as fallback
    return {
      profile: {
        firstName: 'User',
        messageCount: Math.floor(Math.random() * 100) + 10,
        joined: new Date().toISOString()
      },
      favorites: [
        { id: '1', text: 'Weather in Kabul: ☀️ 15°C' },
        { id: '2', text: 'Song: Shape of You - Ed Sheeran' },
        { id: '3', text: 'News: Technology Update' }
      ],
      stats: {
        totalUsers: 1234,
        activeToday: 56,
        bannedUsers: 3
      }
    }
  }
}

export const searchMusicAPI = async (query) => {
  try {
    const response = await axios.get(`${BOT_API_URL}/api/search-music`, {
      params: { query },
      timeout: 5000
    })
    return response.data
  } catch (error) {
    console.error('Music API Error:', error)
    return []
  }
}

export const getWeatherAPI = async (city) => {
  try {
    const response = await axios.get(`${BOT_API_URL}/api/weather`, {
      params: { city },
      timeout: 5000
    })
    return response.data
  } catch (error) {
    console.error('Weather API Error:', error)
    return null
  }
}
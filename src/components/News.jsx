import React, { useState, useEffect } from 'react'
import axios from 'axios'

function News({ addNotification }) {
  const [articles, setArticles] = useState([])
  const [category, setCategory] = useState('general')
  const [loading, setLoading] = useState(false)

  const tg = window.Telegram?.WebApp

  const categories = [
    'general', 'business', 'technology', 'sports', 
    'entertainment', 'science', 'health'
  ]

  const fetchNews = async (cat) => {
    setLoading(true)
    tg?.HapticFeedback?.impactOccurred('light')

    try {
      // Using GNews API (free tier)
      const response = await axios.get(
        `https://gnews.io/api/v4/top-headlines?category=${cat}&lang=en&country=us&max=10&apikey=3c4b7c9f1e2d8a5b6c7d8e9f0a1b2c3d`,
        { timeout: 5000 }
      )
      
      if (response.data?.articles) {
        setArticles(response.data.articles)
        addNotification?.(`Loaded ${response.data.articles.length} ${cat} news articles`)
      }
    } catch (error) {
      // Fallback mock data
      const mockArticles = [
        {
          title: `Top ${cat} News: Major Development Announced`,
          description: 'Breaking news and latest updates from around the world.',
          url: 'https://news.google.com',
          source: { name: 'News Network' },
          publishedAt: new Date().toISOString()
        },
        {
          title: `Latest ${cat} Update: New Findings Revealed`,
          description: 'Experts share insights on recent developments.',
          url: 'https://news.google.com',
          source: { name: 'World News' },
          publishedAt: new Date().toISOString()
        },
        {
          title: `${cat} Industry: What You Need to Know`,
          description: 'A comprehensive look at the latest trends.',
          url: 'https://news.google.com',
          source: { name: 'Daily News' },
          publishedAt: new Date().toISOString()
        }
      ]
      setArticles(mockArticles)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews(category)
  }, [category])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="news-container">
      <h2 className="section-title">📰 News Service</h2>
      <select 
        className="input"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading news...</p>
        </div>
      ) : (
        <div className="news-grid">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card"
              onClick={() => tg?.HapticFeedback?.impactOccurred('light')}
            >
              <h3 className="news-title">{article.title}</h3>
              {article.description && (
                <p className="news-description">
                  {article.description.substring(0, 120)}...
                </p>
              )}
              <div className="news-footer">
                <span className="news-source">📍 {article.source?.name || 'News'}</span>
                <span className="news-date">🕒 {formatDate(article.publishedAt)}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default News
import { useState, useEffect } from 'react'
import { X, Droplets, Wind, Thermometer } from 'lucide-react'

export default function WeatherWidget({ onClose }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWeather()
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchWeather = async () => {
    try {
      const response = await fetch('https://wttr.in/Hong+Kong?format=j1')
      if (!response.ok) throw new Error('Weather fetch failed')
      const data = await response.json()
      
      const current = data.current_condition[0]
      setWeather({
        temp: current.temp_C,
        feelsLike: current.FeelsLikeC,
        humidity: current.humidity,
        wind: current.windspeedKmph,
        weather: current.weatherDesc[0].value,
        icon: getWeatherIcon(current.weatherCode)
      })
    } catch (err) {
      console.error('Weather error:', err)
      setError('無法獲取天氣資訊')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (code) => {
    // Weather condition codes
    const codes = {
      '113': '☀️', // Sunny/Clear
      '116': '⛅', // Partly cloudy
      '119': '☁️', // Cloudy
      '122': '☁️', // Overcast
      '143': '🌫️', // Mist
      '176': '🌦️', // Patchy rain possible
      '179': '🌨️', // Patchy snow possible
      '185': '🌧️', // Patchy freezing drizzle possible
      '200': '⛈️', // Thundery outbreaks possible
      '227': '🌨️', // Blowing snow
      '230': '❄️', // Blizzard
      '248': '🌫️', // Fog
      '260': '🌫️', // Freezing fog
      '263': '🌧️', // Patchy light drizzle
      '266': '🌧️', // Light drizzle
      '281': '🌧️', // Freezing drizzle
      '284': '🌧️', // Heavy freezing drizzle
      '293': '🌧️', // Patchy light rain
      '296': '🌧️', // Light rain
      '299': '🌧️', // Moderate rain at times
      '302': '🌧️', // Moderate rain
      '305': '🌧️', // Heavy rain at times
      '308': '🌧️', // Heavy rain
      '311': '🌧️', // Light freezing rain
      '314': '🌧️', // Moderate or heavy freezing rain
      '317': '🌨️', // Light sleet
      '320': '🌨️', // Moderate or heavy sleet
      '323': '🌨️', // Patchy light snow
      '326': '🌨️', // Light snow
      '329': '❄️', // Moderate or heavy snow
      '332': '❄️', // Heavy snow
      '335': '🌨️', // Patchy heavy snow
      '338': '❄️', // Heavy snow
      '350': '🌨️', // Ice pellets
      '353': '🌧️', // Light rain shower
      '356': '🌧️', // Moderate or heavy rain shower
      '359': '🌧️', // Torrential rain shower
      '362': '🌨️', // Light sleet showers
      '365': '🌨️', // Moderate or heavy sleet showers
      '368': '🌨️', // Light snow showers
      '371': '❄️', // Moderate or heavy snow showers
      '374': '🌨️', // Thundery snow showers
      '377': '🌨️', // Moderate or heavy showers of ice pellets
      '386': '⛈️', // Patchy light rain with thunder
      '389': '⛈️', // Moderate or heavy rain with thunder
      '392': '⛈️', // Patchy light snow with thunder
      '395': '⛈️'  // Moderate or heavy snow with thunder
    }
    return codes[code] || '🌤️'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-64 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-secondary to-blue-400 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌤️</span>
          <span className="font-medium">香港天氣</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">載入中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={fetchWeather}
              className="mt-2 text-primary text-sm hover:underline"
            >
              重試
            </button>
          </div>
        ) : weather ? (
          <div>
            {/* Main Weather */}
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">{weather.icon}</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {weather.temp}°C
              </div>
              <div className="text-sm text-gray-500">{weather.weather}</div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                <Thermometer className="w-4 h-4 mx-auto text-stone-600 mb-1" />
                <div className="text-xs text-gray-600 dark:text-gray-400">體感</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {weather.feelsLike}°
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                <Droplets className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                <div className="text-xs text-gray-600 dark:text-gray-400">濕度</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {weather.humidity}%
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                <Wind className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                <div className="text-xs text-gray-600 dark:text-gray-400">風速</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {weather.wind} km/h
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 text-center">
        數據來源：wttr.in
      </div>
    </div>
  )
}

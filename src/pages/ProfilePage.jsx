import { useState, useEffect } from 'react'
import { User, Moon, Sun, Cloud, Droplets, Wind, Thermometer, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth()
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    try {
      const response = await fetch('https://wttr.in/Hong+Kong?format=j1')
      if (!response.ok) throw new Error()
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
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (code) => {
    const codes = {
      '113': '☀️', '116': '⛅', '119': '☁️', '122': '☁️', '143': '🌫️',
      '176': '🌦️', '200': '⛈️', '263': '🌧️', '266': '🌧️', '293': '🌧️',
      '296': '🌧️', '299': '🌧️', '302': '🌧️', '308': '🌧️', '353': '🌧️'
    }
    return codes[code] || '🌤️'
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary to-secondary p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">
              {user?.displayName || user?.email || '訪客'}
            </h2>
            {user && (
              <p className="text-white/80 text-sm">{user.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">香港天氣</h3>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : weather ? (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{weather.icon}</span>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {weather.temp}°C
                  </div>
                  <div className="text-sm text-gray-500">{weather.weather}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                  <Thermometer className="w-5 h-5 mx-auto text-orange-500 mb-1" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{weather.feelsLike}°</div>
                  <div className="text-xs text-gray-500">體感</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                  <Droplets className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{weather.humidity}%</div>
                  <div className="text-xs text-gray-500">濕度</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                  <Wind className="w-5 h-5 mx-auto text-gray-500 mb-1" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{weather.wind}</div>
                  <div className="text-xs text-gray-500">風速 km/h</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              無法獲取天氣資訊
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 space-y-3">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5" />
              <span>登出</span>
            </button>
          ) : (
            <div className="p-4 text-center text-gray-500">
              登入以使用更多功能
            </div>
          )}
        </div>
      </div>

      {/* App Info */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-400">香港生活地圖 v1.0.0</p>
      </div>
    </div>
  )
}

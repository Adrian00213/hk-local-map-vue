import { useState, useEffect } from 'react'
import { User, Cloud, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ProfileView() {
  const { user, logout } = useAuth()
  const [w, setW] = useState(null)

  useEffect(() => {
    fetch('https://wttr.in/Hong+Kong?format=j1').then(r => r.json()).then(d => {
      const c = d.current_condition[0]
      setW({ t: c.temp_C, f: c.FeelsLikeC, h: c.humidity, w: c.windspeedKmph, d: c.weatherDesc[0].value })
    }).catch(() => {})
  }, [])

  const icon = w ? ({ '☀️': '☀️', '⛅': '⛅', '☁️': '☁️', '🌧️': '🌧️', '🌦️': '🌦️', '⛈️': '⛈️' }[w.d] || '🌤️') : '🌤️'

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-red-500 to-pink-500 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div className="text-white">
            <h2 className="text-lg font-bold">{user?.displayName || user?.email || '訪客'}</h2>
            {user && <p className="text-white/80 text-sm">{user.email}</p>}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">香港天氣</h3>
          </div>
          {w ? (
            <div className="text-center">
              <span className="text-5xl">{icon}</span>
              <div className="text-3xl font-bold text-gray-900 mt-2">{w.t}°C</div>
              <div className="text-sm text-gray-500">{w.d}</div>
              <div className="flex justify-around mt-4 text-sm">
                <div><span className="font-medium">{w.f}°</span> <span className="text-gray-400">體感</span></div>
                <div><span className="font-medium">{w.h}%</span> <span className="text-gray-400">濕度</span></div>
                <div><span className="font-medium">{w.w}</span> <span className="text-gray-400">風速</span></div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">載入中...</div>
          )}
        </div>
      </div>

      <div className="p-4">
        {user ? (
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-xl shadow-sm text-red-500">
            <LogOut className="w-5 h-5" />
            <span>登出</span>
          </button>
        ) : (
          <div className="bg-white rounded-xl p-4 shadow-sm text-center text-gray-500">
            登入以使用更多功能
          </div>
        )}
      </div>

      <div className="mt-auto p-4 text-center">
        <p className="text-xs text-gray-400">香港生活地圖 v1.0</p>
      </div>
    </div>
  )
}

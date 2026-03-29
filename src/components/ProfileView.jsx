import { useState, useEffect } from 'react'
import { User, Cloud, Thermometer, Droplets, Wind, LogOut, ChevronRight, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ProfileView() {
  const { user, logout } = useAuth()
  const [w, setW] = useState(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
    fetch('https://wttr.in/Hong+Kong?format=j1')
      .then(r => r.json())
      .then(d => {
        const c = d.current_condition[0]
        setW({ t: c.temp_C, f: c.FeelsLikeC, h: c.humidity, w: c.windspeedKmph, d: c.weatherDesc[0].value })
      })
      .catch(() => {})
  }, [])

  const getWeatherIcon = (desc) => {
    const d = desc.toLowerCase()
    if (d.includes('sun') || d.includes('clear')) return '☀️'
    if (d.includes('cloud')) return '☁️'
    if (d.includes('rain')) return '🌧️'
    if (d.includes('mist') || d.includes('fog')) return '🌫️'
    if (d.includes('thunder')) return '⛈️'
    return '🌤️'
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 px-4 pt-8 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">{user?.displayName || '訪客用戶'}</h2>
            {user ? (
              <p className="text-white/80 text-sm">{user.email}</p>
            ) : (
              <p className="text-white/60 text-sm">登入以使用完整功能</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 -mt-2">
        {/* Weather Card */}
        <div className="bg-white rounded-3xl shadow-lg p-5 mb-4 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900">香港天氣</h3>
            </div>
            <span className="text-xs text-slate-400">即時更新</span>
          </div>

          {w ? (
            <div className="text-center py-2">
              <div className="text-7xl mb-2">{getWeatherIcon(w.d)}</div>
              <div className="text-4xl font-bold text-slate-900">{w.t}°C</div>
              <div className="text-sm text-slate-500 mt-1">{w.d}</div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-slate-50 rounded-2xl p-3">
                  <Thermometer className="w-5 h-5 mx-auto text-orange-400 mb-1" />
                  <div className="text-lg font-bold text-slate-900">{w.f}°</div>
                  <div className="text-xs text-slate-400">體感溫度</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3">
                  <Droplets className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                  <div className="text-lg font-bold text-slate-900">{w.h}%</div>
                  <div className="text-xs text-slate-400">濕度</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3">
                  <Wind className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <div className="text-lg font-bold text-slate-900">{w.w}</div>
                  <div className="text-xs text-slate-400">km/h</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">載入天氣中...</p>
            </div>
          )}
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Moon className="w-5 h-5 text-slate-600" />
            </div>
            <span className="flex-1 text-left font-medium text-slate-900">深色模式</span>
            <div className="w-12 h-7 bg-slate-200 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full shadow absolute top-1 left-1" />
            </div>
          </button>

          <div className="h-px bg-slate-100 mx-4" />

          <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Sun className="w-5 h-5 text-slate-600" />
            </div>
            <span className="flex-1 text-left font-medium text-slate-900">語言</span>
            <span className="text-slate-400 text-sm mr-2">繁體中文</span>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Logout */}
        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 mt-4 p-4 bg-white rounded-3xl shadow-sm border border-slate-100 text-red-500 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>登出帳戶</span>
          </button>
        )}

        {/* App Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-300">香港生活地圖 v1.0.0</p>
          <p className="text-xs text-slate-300 mt-1">Made with ❤️ for Hong Kong</p>
        </div>
      </div>
    </div>
  )
}

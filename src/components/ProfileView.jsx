import { useState, useEffect } from 'react'
import { User, Cloud, Thermometer, Droplets, Wind, LogOut, Settings, ChevronRight, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ProfileView() {
  const { user, logout } = useAuth()
  const [w, setW] = useState(null)

  useEffect(() => {
    fetch('https://wttr.in/Hong+Kong?format=j1')
      .then(r => r.json())
      .then(d => {
        const c = d.current_condition[0]
        setW({ t: c.temp_C, f: c.FeelsLikeC, h: c.humidity, w: c.windspeedKmph, d: c.weatherDesc[0].value })
      })
      .catch(() => {})
  }, [])

  const getWeatherIcon = (desc) => {
    const d = desc?.toLowerCase() || ''
    if (d.includes('sun') || d.includes('clear')) return '☀️'
    if (d.includes('cloud')) return '☁️'
    if (d.includes('rain')) return '🌧️'
    if (d.includes('mist') || d.includes('fog')) return '🌫️'
    if (d.includes('thunder')) return '⛈️'
    return '🌤️'
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-50">
      {/* Profile Header - Premium Card */}
      <div className="bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 px-5 pt-8 pb-10">
        <div className="flex items-center gap-4">
          <div className="w-18 h-18 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center shadow-xl">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full rounded-3xl object-cover" />
            ) : (
              <User className="w-9 h-9 text-white" />
            )}
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-extrabold">{user?.displayName || '訪客用戶'}</h2>
            {user ? (
              <p className="text-white/80 text-sm mt-0.5">{user.email}</p>
            ) : (
              <p className="text-white/60 text-sm mt-0.5">登入以使用完整功能</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 -mt-6">
        {/* Weather Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-5 border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-200">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900">香港天氣</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">即時更新</span>
          </div>

          {w ? (
            <div className="text-center py-3">
              <div className="text-8xl mb-2">{getWeatherIcon(w.d)}</div>
              <div className="text-5xl font-extrabold text-slate-900">{w.t}°</div>
              <div className="text-base text-slate-500 mt-1">{w.d}</div>

              <div className="grid grid-cols-3 gap-3 mt-8">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <Thermometer className="w-6 h-6 mx-auto text-orange-400 mb-2" />
                  <div className="text-xl font-bold text-slate-900">{w.f}°</div>
                  <div className="text-xs text-slate-400 mt-1">體感溫度</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <Droplets className="w-6 h-6 mx-auto text-blue-400 mb-2" />
                  <div className="text-xl font-bold text-slate-900">{w.h}%</div>
                  <div className="text-xs text-slate-400 mt-1">濕度</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <Wind className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                  <div className="text-xl font-bold text-slate-900">{w.w}</div>
                  <div className="text-xs text-slate-400 mt-1">km/h 風速</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-3 border-slate-200 border-t-red-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400">載入天氣中...</p>
            </div>
          )}
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden mb-5">
          <button className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Settings className="w-6 h-6 text-slate-500" />
            </div>
            <span className="flex-1 text-left font-semibold text-slate-900">設定</span>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>

          <div className="h-px bg-slate-100 mx-5" />

          <button className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-slate-500" />
            </div>
            <span className="flex-1 text-left font-semibold text-slate-900">關於我們</span>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Logout Button */}
        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-5 bg-white rounded-3xl shadow-md border border-slate-100 text-red-500 font-bold mb-5 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>登出帳戶</span>
          </button>
        )}

        {/* App Info */}
        <div className="text-center pb-8">
          <p className="text-sm text-slate-300 font-medium">香港生活地圖 v1.0.0</p>
          <p className="text-xs text-slate-300 mt-1">Made with ❤️ for Hong Kong</p>
        </div>
      </div>
    </div>
  )
}

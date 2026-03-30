import { useState, useEffect } from 'react'
import { User, Cloud, Thermometer, Droplets, Wind, LogOut, Settings, Moon, Globe } from 'lucide-react'
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
    <div className="h-full w-full flex flex-col bg-zinc-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 px-5 pt-8 pb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-xl">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">{user?.displayName || '訪客用戶'}</h2>
            {user ? (
              <p className="text-white/70 text-sm mt-0.5">{user.email}</p>
            ) : (
              <p className="text-white/60 text-sm mt-0.5">登入以使用完整功能</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 -mt-4">
        {/* Weather Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-zinc-100/80 p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-200/50">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-zinc-900">香港天氣</h3>
            </div>
            <span className="text-xs text-zinc-400 font-medium">即時更新</span>
          </div>

          {w ? (
            <div className="text-center py-2">
              <div className="text-7xl mb-2">{getWeatherIcon(w.d)}</div>
              <div className="text-4xl font-bold text-zinc-900">{w.t}°</div>
              <div className="text-sm text-zinc-500 mt-1">{w.d}</div>

              <div className="grid grid-cols-3 gap-3 mt-8">
                <div className="bg-zinc-50 rounded-2xl p-4">
                  <Thermometer className="w-5 h-5 mx-auto text-orange-400 mb-2" />
                  <div className="text-lg font-bold text-zinc-900">{w.f}°</div>
                  <div className="text-xs text-zinc-400 mt-1">體感溫度</div>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-4">
                  <Droplets className="w-5 h-5 mx-auto text-blue-400 mb-2" />
                  <div className="text-lg font-bold text-zinc-900">{w.h}%</div>
                  <div className="text-xs text-zinc-400 mt-1">濕度</div>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-4">
                  <Wind className="w-5 h-5 mx-auto text-zinc-400 mb-2" />
                  <div className="text-lg font-bold text-zinc-900">{w.w}</div>
                  <div className="text-xs text-zinc-400 mt-1">km/h 風速</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-zinc-200 border-t-violet-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-zinc-400">載入天氣中...</p>
            </div>
          )}
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-100/80 overflow-hidden mb-5">
          <button className="w-full flex items-center gap-4 p-5 hover:bg-zinc-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
              <Moon className="w-5 h-5 text-zinc-600" />
            </div>
            <span className="flex-1 text-left font-medium text-zinc-900">深色模式</span>
            <div className="w-11 h-7 bg-zinc-200 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full shadow absolute top-1 left-1" />
            </div>
          </button>

          <div className="h-px bg-zinc-100 mx-5" />

          <button className="w-full flex items-center gap-4 p-5 hover:bg-zinc-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-zinc-600" />
            </div>
            <span className="flex-1 text-left font-medium text-zinc-900">語言</span>
            <span className="text-sm text-zinc-400 mr-2">繁體中文</span>
          </button>

          <div className="h-px bg-zinc-100 mx-5" />

          <button className="w-full flex items-center gap-4 p-5 hover:bg-zinc-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
              <Settings className="w-5 h-5 text-zinc-600" />
            </div>
            <span className="flex-1 text-left font-medium text-zinc-900">設定</span>
          </button>
        </div>

        {/* Logout */}
        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-3xl shadow-sm border border-zinc-100/80 text-red-500 font-medium mb-5 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>登出帳戶</span>
          </button>
        )}

        {/* App Info */}
        <div className="text-center pb-8">
          <p className="text-sm text-zinc-300 font-medium">香港生活地圖 v1.0.0</p>
          <p className="text-xs text-zinc-300 mt-1">Made with ❤️ for Hong Kong</p>
        </div>
      </div>
    </div>
  )
}

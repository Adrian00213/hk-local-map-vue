import { useState, useEffect } from 'react'
import { Settings, Bell, Globe, Shield, Star, Gift, MessageCircle, Heart, ChevronRight, CreditCard, LogOut, Sparkles, X, Moon, HeartHandshake, User, CheckCircle, Bookmark, BellRing, FileText, Lock, Smartphone, Eye, EyeOff, ExternalLink } from 'lucide-react'

export default function ProfileView() {
  const [activeSection, setActiveSection] = useState(null)
  const [notifications, setNotifications] = useState({ push: true, sound: true, email: false })
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState('繁體中文')
  const [userName] = useState('Adrian')
  const [userEmail] = useState('adrian@example.com')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    // Load saved preference or default to dark
    const saved = localStorage.getItem('hk_dark_mode')
    if (saved !== null) {
      setDarkMode(saved === 'true')
      if (saved === 'true') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message) => setToast(message)

  const toggleDarkMode = () => {
    const newValue = !darkMode
    setDarkMode(newValue)
    localStorage.setItem('hk_dark_mode', String(newValue))
    if (newValue) {
      document.documentElement.classList.add('dark')
      showToast('已切換至深色模式')
    } else {
      document.documentElement.classList.remove('dark')
      showToast('已切換至淺色模式')
    }
  }

  const toggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    showToast(`${key === 'push' ? '推送' : key === 'sound' ? '聲音' : '電郵'}通知已${notifications[key] ? '關閉' : '開啟'}`)
  }

  const menuGroups = [
    {
      title: '我的內容',
      items: [
        { icon: Heart, label: '我的收藏', subtitle: '已收藏的地點', color: 'bg-pink-500', action: () => showToast('我的收藏 - 暫無資料') },
        { icon: Gift, label: '我的優惠', subtitle: '3 個收藏', color: 'bg-amber-500', action: () => setActiveSection('deals') },
        { icon: MessageCircle, label: '我的點評', subtitle: '2 條點評', color: 'bg-emerald-500', action: () => showToast('我的點評 - 暫無資料') },
        { icon: Star, label: '我的評分', subtitle: '查看評分記錄', color: 'bg-violet-500', action: () => showToast('我的評分 - 暫無資料') },
      ]
    },
    {
      title: '設定',
      items: [
        { icon: Bell, label: '通知設定', subtitle: '推送通知', color: 'bg-blue-500', action: () => setActiveSection('notifications') },
        { icon: Globe, label: '語言設定', subtitle: language, color: 'bg-teal-500', action: () => setActiveSection('language') },
        { icon: Shield, label: '私隱設定', subtitle: '資料安全', color: 'bg-indigo-500', action: () => setActiveSection('privacy') },
        { icon: Lock, label: '帳戶安全', subtitle: '密碼、兩步驗證', color: 'bg-red-500', action: () => showToast('帳戶安全 - 暫無資料') },
      ]
    },
    {
      title: '帳戶',
      items: [
        { icon: User, label: '個人資料', subtitle: '編輯個人資訊', color: 'bg-cyan-500', action: () => setActiveSection('profile') },
        { icon: CreditCard, label: '付款方式', subtitle: '添加信用卡', color: 'bg-purple-500', action: () => showToast('付款方式 - 暫無資料') },
        { icon: Smartphone, label: '已連結的裝置', subtitle: 'Google, Apple', color: 'bg-rose-500', action: () => showToast('已連結的裝置 - 暫無資料') },
        { icon: FileText, label: '訂單記錄', subtitle: '查看過往訂單', color: 'bg-orange-500', action: () => showToast('訂單記錄 - 暫無資料') },
      ]
    }
  ]

  return (
    <div className="h-full w-full bg-gray-950 text-white overflow-y-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium animate-slide-down flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-cyan-400 font-medium">2027 Edition</p>
          <h1 className="text-2xl font-bold">我的</h1>
        </div>
        <button 
          onClick={() => showToast('設定')}
          className="w-11 h-11 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="px-5 py-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-5 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl font-bold">
                {userName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-gray-900" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{userName}</h2>
              <p className="text-sm text-gray-400">{userEmail}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-medium">⭐ Premium</span>
                <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">✓ 已驗證</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '收藏', value: '3', color: 'from-pink-500 to-rose-600' },
            { label: '積分', value: '2.8k', color: 'from-cyan-500 to-blue-600' },
            { label: '等級', value: 'VIP', color: 'from-amber-500 to-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-4 text-center border border-gray-800">
              <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                <Star className="w-5 h-5 text-white" />
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 pb-6">
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveSection('deals')}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-sm active:scale-95 transition-transform"
          >
            我的優惠
          </button>
          <button 
            onClick={() => showToast('二維碼 - 暫無資料')}
            className="flex-1 py-3 rounded-2xl bg-gray-800 border border-gray-700 font-semibold text-sm active:scale-95 transition-transform"
          >
            二維碼
          </button>
        </div>
      </div>

      {/* Menu Groups */}
      <div className="px-5 space-y-6 pb-24">
        {menuGroups.map((group, gi) => (
          <div key={gi}>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">{group.title}</p>
            <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
              {group.items.map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-800 active:bg-gray-700 transition-colors ${i < group.items.length - 1 ? 'border-b border-gray-800' : ''}`}
                >
                  <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Dark Mode */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">外觀</p>
          <div className="bg-gray-900 rounded-3xl border border-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center">
                {darkMode ? <Moon className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
              </div>
              <div>
                <p className="font-semibold text-sm">{darkMode ? '深色模式' : '淺色模式'}</p>
                <p className="text-xs text-gray-500">界面主題</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-14 h-8 rounded-full relative transition-colors ${darkMode ? 'bg-cyan-500' : 'bg-amber-500'}`}
            >
              <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${darkMode ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <button 
          onClick={() => showToast('確定要登出嗎？')}
          className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <LogOut className="w-5 h-5" />
          登出帳戶
        </button>

        {/* App Info */}
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="font-semibold">香港本地生活地圖</p>
          <p className="text-xs text-gray-500 mt-1">Version 2.0 · 2027 Edition</p>
        </div>
      </div>

      {/* Language Modal */}
      {activeSection === 'language' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end" onClick={() => setActiveSection(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl border-t border-gray-800 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-900 p-5 border-b border-gray-800 flex items-center gap-4">
              <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold">語言設定</h2>
            </div>
            <div className="p-5 space-y-2">
              {[
                { lang: '繁體中文', flag: '🇭🇰' },
                { lang: '簡體中文', flag: '🇨🇳' },
                { lang: 'English', flag: '🇺🇸' },
                { lang: '日本語', flag: '🇯🇵' },
                { lang: '한국어', flag: '🇰🇷' },
              ].map((item) => (
                <button
                  key={item.lang}
                  onClick={() => { setLanguage(item.lang); setActiveSection(null); showToast(`已切換至 ${item.lang}`) }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors active:scale-98 ${language === item.lang ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-gray-800 border border-gray-700 hover:bg-gray-750'}`}
                >
                  <span className="text-2xl">{item.flag}</span>
                  <span className={`flex-1 text-left font-semibold ${language === item.lang ? 'text-cyan-400' : ''}`}>{item.lang}</span>
                  {language === item.lang && <CheckCircle className="w-6 h-6 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {activeSection === 'notifications' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end" onClick={() => setActiveSection(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl border-t border-gray-800" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-800 flex items-center gap-4">
              <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold">通知設定</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { key: 'push', label: '推送通知', desc: '接收最新優惠及更新' },
                { key: 'sound', label: '聲音提示', desc: '收到通知時播放聲音' },
                { key: 'email', label: '電郵通知', desc: '接收每日的精選內容' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <BellRing className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(item.key)}
                    className={`w-14 h-8 rounded-full relative transition-colors ${notifications[item.key] ? 'bg-cyan-500' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${notifications[item.key] ? 'left-8' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {activeSection === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end" onClick={() => setActiveSection(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl border-t border-gray-800 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-900 p-5 border-b border-gray-800 flex items-center gap-4">
              <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold">私隱設定</h2>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: '允許位置存取', desc: '讓我們為你提供附近的優惠', enabled: true },
                { label: '允許通知', desc: '接收推送通知', enabled: true },
                { label: '匿名使用數據', desc: '幫助我們改進服務', enabled: false },
                { label: '展示習慣分析', desc: '根據你的喜好推薦', enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-800 rounded-2xl">
                  <div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <div className={`w-14 h-8 rounded-full relative transition-colors ${item.enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                    <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${item.enabled ? 'left-8' : 'left-1'}`} />
                  </div>
                </div>
              ))}
              <button 
                onClick={() => { setActiveSection(null); showToast('已刪除所有數據') }}
                className="w-full mt-4 py-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold"
              >
                刪除所有數據
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {activeSection === 'profile' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end" onClick={() => setActiveSection(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl border-t border-gray-800" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-800 flex items-center gap-4">
              <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold">個人資料</h2>
              <button onClick={() => { setActiveSection(null); showToast('已保存') }} className="ml-auto px-4 py-2 rounded-xl bg-cyan-500 text-sm font-semibold text-white">
                保存
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl font-bold">
                    {userName.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">用戶名</p>
                  <p className="font-semibold">{userName}</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">電郵</p>
                  <p className="font-semibold">{userEmail}</p>
                </div>
                <button 
                  onClick={() => showToast('更改密碼 - 暫無資料')}
                  className="w-full bg-gray-800 rounded-2xl p-4 text-left"
                >
                  <p className="text-xs text-gray-500 mb-1">密碼</p>
                  <p className="font-semibold flex items-center gap-2">
                    <span>••••••••</span>
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deals Modal */}
      {activeSection === 'deals' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end" onClick={() => setActiveSection(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl border-t border-gray-800 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-900 p-5 border-b border-gray-800 flex items-center gap-4">
              <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold">我的優惠</h2>
            </div>
            <div className="p-5 space-y-3">
              {[
                { brand: '麥當勞', deal: '免費薯條', expiry: '2027-04-15', color: 'bg-yellow-500' },
                { brand: '星巴克', deal: '買一送一', expiry: '2027-04-20', color: 'bg-green-500' },
                { brand: '肯德基', deal: '半價炸雞', expiry: '2027-04-10', color: 'bg-red-500' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800 rounded-2xl p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-xl`}>
                    🎁
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{item.brand}</p>
                    <p className="text-sm text-cyan-400">{item.deal}</p>
                    <p className="text-xs text-gray-500">到期：{item.expiry}</p>
                  </div>
                </div>
              ))}
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-2xl p-4 flex items-center gap-4 opacity-50">
                  <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center text-xl">🎫</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-400">即將推出</p>
                    <p className="text-sm text-gray-500">更多優惠敬請期待</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Need to add Camera to lucide-react imports or use another icon
const Camera = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
)

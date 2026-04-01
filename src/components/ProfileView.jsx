import { useState, useEffect } from 'react'
import { Settings, Bell, Globe, Shield, Star, Gift, MessageCircle, Heart, ChevronRight, CreditCard, LogOut, Camera, Sparkles, X, Moon, HeartHandshake, User, CheckCircle } from 'lucide-react'

export default function ProfileView() {
  const [activeSection, setActiveSection] = useState(null)
  const [notifications, setNotifications] = useState({ push: true, sound: true })
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState('繁體中文')
  const [userName] = useState('Adrian')
  const [userEmail] = useState('adrian@example.com')

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const toggle = (key) => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))

  const menuGroups = [
    {
      title: '我的內容',
      items: [
        { icon: Heart, label: '我的收藏', subtitle: '已收藏的地點', color: 'bg-pink-500' },
        { icon: Gift, label: '我的優惠', subtitle: '3 個收藏', color: 'bg-amber-500' },
        { icon: MessageCircle, label: '我的點評', subtitle: '2 條點評', color: 'bg-emerald-500' },
        { icon: Star, label: '我的評分', subtitle: '查看評分記錄', color: 'bg-violet-500' },
      ]
    },
    {
      title: '設定',
      items: [
        { icon: Bell, label: '通知設定', subtitle: '推送通知', color: 'bg-blue-500' },
        { icon: Globe, label: '語言設定', subtitle: language, color: 'bg-teal-500', onClick: () => setActiveSection('language') },
        { icon: Shield, label: '私隱設定', subtitle: '資料安全', color: 'bg-indigo-500' },
      ]
    },
    {
      title: '帳戶',
      items: [
        { icon: User, label: '個人資料', subtitle: '編輯個人資訊', color: 'bg-cyan-500' },
        { icon: CreditCard, label: '付款方式', subtitle: '添加信用卡', color: 'bg-purple-500' },
        { icon: HeartHandshake, label: '已連結', subtitle: 'Google, Apple', color: 'bg-rose-500' },
      ]
    }
  ]

  return (
    <div className="h-full w-full bg-gray-950 text-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-cyan-400 font-medium">2027 Edition</p>
          <h1 className="text-2xl font-bold">我的</h1>
        </div>
        <button className="w-11 h-11 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
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
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-sm"
          >
            我的優惠
          </button>
          <button className="flex-1 py-3 rounded-2xl bg-gray-800 border border-gray-700 font-semibold text-sm">
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
                  onClick={item.onClick || (() => {})}
                  className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-800 transition-colors ${i < group.items.length - 1 ? 'border-b border-gray-800' : ''}`}
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
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">深色模式</p>
                <p className="text-xs text-gray-500">界面主題</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-8 rounded-full relative transition-colors ${darkMode ? 'bg-cyan-500' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${darkMode ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <button className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold flex items-center justify-center gap-2">
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl" onClick={() => setActiveSection(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl border-t border-gray-800" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-800 flex items-center gap-4">
              <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold">語言</h2>
            </div>
            <div className="p-5 space-y-2">
              {[
                { lang: '繁體中文', flag: '🇭🇰' },
                { lang: '簡體中文', flag: '🇨🇳' },
                { lang: 'English', flag: '🇺🇸' },
                { lang: '日本語', flag: '🇯🇵' },
              ].map((item) => (
                <button
                  key={item.lang}
                  onClick={() => { setLanguage(item.lang); setActiveSection(null) }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors ${language === item.lang ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-gray-800 border border-gray-700'}`}
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
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Settings, Bell, Globe, Shield, Star, Gift, MessageCircle, Heart, ChevronRight, CreditCard, LogOut, Sparkles, X, Moon, HeartHandshake, User, CheckCircle, Bookmark, BellRing, FileText, Lock, Smartphone, Eye, Sun, ExternalLink, Camera, MapPin, Phone, Mail, Bot } from 'lucide-react'
import AgentSettings from './AgentSettings'

export default function ProfileView() {
  const [activeSection, setActiveSection] = useState(null)
  const [notifications, setNotifications] = useState({ push: true, sound: true, email: false })
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('hk_dark_mode')
    return saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [language, setLanguage] = useState('繁體中文')
  const [userName] = useState('Adrian')
  const [userEmail] = useState('adrian@example.com')
  const [toast, setToast] = useState(null)

  // Sync dark mode state with document class
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message) => setToast(message)

  const toggleDarkMode = () => {
    const newValue = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', newValue)
    localStorage.setItem('hk_dark_mode', String(newValue))
    setDarkMode(newValue)
    showToast(newValue ? '🌙 深色模式' : '☀️ 淺色模式')
  }

  const menuGroups = [
    {
      title: '我的內容',
      items: [
        { icon: Heart, label: '我的收藏', subtitle: '0 個收藏', color: 'bg-rose-500', action: () => showToast('❤️ 我的收藏 - 暫無資料') },
        { icon: Gift, label: '我的優惠', subtitle: '3 個優惠', color: 'bg-amber-500', action: () => showToast('🎁 我的優惠') },
        { icon: MessageCircle, label: '我的點評', subtitle: '0 條點評', color: 'bg-emerald-500', action: () => showToast('💬 我的點評 - 暫無資料') },
        { icon: Star, label: '我的評分', subtitle: '0 條評分', color: 'bg-violet-500', action: () => showToast('⭐ 我的評分 - 暫無資料') },
      ]
    },
    {
      title: '設定',
      items: [
        { icon: Bell, label: '通知設定', subtitle: '開啟', color: 'bg-blue-500', action: () => setActiveSection('notifications') },
        { icon: Globe, label: '語言設定', subtitle: language, color: 'bg-teal-500', action: () => setActiveSection('language') },
        { icon: Moon, label: darkMode ? '深色模式' : '淺色模式', subtitle: darkMode ? '🌙 開啟' : '☀️ 關閉', color: 'bg-purple-500', action: toggleDarkMode },
        { icon: Shield, label: '私隱設定', subtitle: '資料安全', color: 'bg-indigo-500', action: () => setActiveSection('privacy') },
        { icon: Bot, label: '🤖 金龍設定', subtitle: 'AI 行為控制', color: 'bg-pink-500', action: () => setActiveSection('agentsettings') },
      ]
    },
    {
      title: '帳戶',
      items: [
        { icon: User, label: '個人資料', subtitle: '查看及編輯', color: 'bg-cyan-500', action: () => setActiveSection('profile') },
        { icon: CreditCard, label: '付款方式', subtitle: '添加信用卡', color: 'bg-purple-500', action: () => showToast('💳 付款方式 - 暫無資料') },
        { icon: Smartphone, label: '已連結', subtitle: 'Google, Apple', color: 'bg-pink-500', action: () => showToast('📱 已連結的裝置') },
        { icon: FileText, label: '訂單記錄', subtitle: '0 個訂單', color: 'bg-orange-500', action: () => showToast('📋 訂單記錄 - 暫無資料') },
      ]
    }
  ]

  const closeSection = () => setActiveSection(null)

  return (
    <div className="h-full w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-y-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-500 font-medium">2027 Edition</p>
            <h1 className="text-2xl font-bold">我的</h1>
          </div>
          <button 
            onClick={() => showToast('⚙️ 設定')}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-5 py-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-5 border border-amber-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-white">
                {userName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{userName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">⭐ Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '收藏', value: '0', icon: '❤️' },
            { label: '積分', value: '0', icon: '🏆' },
            { label: '等級', value: 'VIP', icon: '⭐' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Groups */}
      <div className="px-5 space-y-6 pb-8">
        {menuGroups.map((group, gi) => (
          <div key={gi}>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3 ml-1">{group.title}</p>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {group.items.map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${i < group.items.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Sign Out */}
        <button 
          onClick={() => showToast('🚪 確定要登出嗎？')}
          className="w-full py-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-500 font-semibold flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          登出帳戶
        </button>

        {/* App Info */}
        <div className="text-center pt-4 pb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="font-semibold text-sm">香港本地生活地圖</p>
          <p className="text-xs text-gray-400 mt-1">Version 2.0 · 2027 Edition</p>
        </div>
      </div>

      {/* Language Modal */}
      {activeSection === 'language' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={closeSection}>
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold">語言設定</h2>
              <button onClick={closeSection} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
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
                  onClick={() => { setLanguage(item.lang); showToast(`語言已切換至 ${item.lang}`); closeSection() }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors ${language === item.lang ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30' : 'bg-gray-50 dark:bg-gray-800'}`}
                >
                  <span className="text-2xl">{item.flag}</span>
                  <span className={`flex-1 text-left font-medium ${language === item.lang ? 'text-amber-600 dark:text-amber-400' : ''}`}>{item.lang}</span>
                  {language === item.lang && <CheckCircle className="w-5 h-5 text-amber-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {activeSection === 'notifications' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={closeSection}>
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold">通知設定</h2>
              <button onClick={closeSection} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { key: 'push', label: '推送通知', desc: '接收最新優惠及更新', icon: Bell },
                { key: 'sound', label: '聲音提示', desc: '收到通知時播放聲音', icon: BellRing },
                { key: 'email', label: '電郵通知', desc: '接收每日的精選內容', icon: Mail },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const newVal = !notifications[item.key]
                      setNotifications(prev => ({ ...prev, [item.key]: newVal }))
                      showToast(`${item.label}已${newVal ? '開啟' : '關閉'}`)
                    }}
                    className={`w-12 h-7 rounded-full relative transition-colors ${notifications[item.key] ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${notifications[item.key] ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {activeSection === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={closeSection}>
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold">私隱設定</h2>
              <button onClick={closeSection} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: '允許位置存取', desc: '讓我們為你提供附近的優惠', enabled: true },
                { label: '允許通知', desc: '接收推送通知', enabled: true },
                { label: '匿名使用數據', desc: '幫助我們改進服務', enabled: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <div className={`w-12 h-7 rounded-full relative transition-colors ${item.enabled ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${item.enabled ? 'left-6' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Agent Settings Modal */}
      {activeSection === 'agentsettings' && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={closeSection}>
          <div className="w-full h-full bg-white dark:bg-gray-900 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold">🤖 金龍設定</h2>
              <button onClick={closeSection} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <AgentSettings />
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {activeSection === 'profile' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={closeSection}>
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold">個人資料</h2>
              <button onClick={closeSection} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-white">
                    {userName.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">用戶名</p>
                  <p className="font-semibold">{userName}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">電郵</p>
                  <p className="font-semibold">{userEmail}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">電話</p>
                  <p className="font-semibold">+852 1234 5678</p>
                </div>
              </div>

              <button 
                onClick={() => { showToast('✅ 資料已保存'); closeSection() }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl mt-4"
              >
                保存更改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { User, Settings, Bell, Globe, Shield, Star, Gift, MessageCircle, Heart, ChevronRight, Clock, MapPin, CreditCard, Smartphone, CheckCircle, ThumbsUp, LogOut, Edit3, Camera, Sparkles, TrendingUp, X, Moon, Volume2, Vibrate, ChevronDown, Award, Crown, Zap, Palette, Lock, QrCode, HeartHandshake, Clock3, ShoppingBag, BellRing } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'

// Refined Premium Color Palette - Apple/Samsung Style
const colors = {
  primary: '#007AFF',      // iOS Blue
  secondary: '#5856D6',    // Purple
  success: '#34C759',     // Green
  warning: '#FF9500',     // Orange
  danger: '#FF3B30',      // Red
  gray: {
    50: '#F5F5F7',
    100: '#E5E5EA',
    200: '#D1D1D6',
    300: '#C7C7CC',
    400: '#AEAEB2',
    500: '#8E8E93',
    600: '#636366',
    700: '#48484A',
    800: '#3A3A3C',
    900: '#2C2C2E',
  }
}

// Premium Icon Component with subtle background
const PremiumIcon = ({ icon: Icon, color = 'primary', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14'
  }
  const iconSizes = {
    sm: 'w-4.5 h-4.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center`} 
         style={{ backgroundColor: `${color}15` }}>
      <Icon className={`${iconSizes[size]}`} style={{ color }} />
    </div>
  )
}

// Premium Section Header
const SectionHeader = ({ title, action }) => (
  <div className="flex items-center justify-between px-4 py-2">
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
    {action}
  </div>
)

// Premium List Item
const PremiumListItem = ({ icon, iconColor, title, subtitle, value, showArrow = true, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50/70 transition-colors active:bg-gray-100/50"
  >
    <PremiumIcon icon={icon} color={iconColor} />
    <div className="flex-1 text-left">
      <p className="font-semibold text-gray-900 text-[15px]">{title}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {value && <span className="text-sm text-gray-400 mr-2">{value}</span>}
    {showArrow && <ChevronRight className="w-5 h-5 text-gray-300" />}
  </button>
)

// Premium Divider
const Divider = ({ inset = 'lg' }) => (
  <div className={`${inset === 'lg' ? 'mx-4' : inset === 'sm' ? 'mx-4' : 'mx-4'} h-px bg-gray-200/60`} />
)

// Premium Settings Modal
const SettingsModal = ({ title, icon: Icon, children }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveSection(null)} />
    <div className="relative w-full max-w-md bg-gray-50 rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden"
         style={{ animation: 'slideUp 0.35s ease-out' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
        <div className="flex items-center gap-4 px-5 py-4">
          <button 
            onClick={() => setActiveSection(null)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center -ml-2"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <PremiumIcon icon={Icon} />
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
        {children}
      </div>
    </div>
    <style>{`
      @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
    `}</style>
  </div>
)

// Premium Toggle
const PremiumToggle = ({ enabled, onToggle, label, subtitle }) => (
  <div className="flex items-center gap-4 px-4 py-4">
    <div className="flex-1">
      <p className="font-semibold text-gray-900 text-[15px]">{label}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    <button
      onClick={onToggle}
      className={`relative w-51 h-31 rounded-full transition-all duration-300 ${
        enabled ? 'bg-success' : 'bg-gray-300'
      }`}
      style={{ width: '51px', height: '31px' }}
    >
      <span 
        className={`absolute top-0.5 w-7 h-7 rounded-full bg-white shadow-md transition-all duration-300 ${
          enabled ? 'left-[22px]' : 'left-[2px]'
        }`}
        style={{ width: '28px', height: '28px', top: '1.5px' }}
      />
    </button>
  </div>
)

// Language Option
const LanguageOption = ({ label, flag, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-4 transition-colors ${
      selected ? 'bg-blue-50/70' : 'hover:bg-gray-100/50'
    }`}
  >
    <span className="text-2xl">{flag}</span>
    <span className={`flex-1 text-left font-semibold text-[15px] ${selected ? 'text-primary' : 'text-gray-900'}`}>
      {label}
    </span>
    {selected && <CheckCircle className="w-6 h-6 text-primary" />}
  </button>
)

export default function ProfileView() {
  const { user, isAuthenticated } = useAuth()
  const { locale, changeLanguage, getLanguageName, t } = useLocale()
  const currentLangName = getLanguageName(locale)
  
  const [savedDeals, setSavedDeals] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [favorites, setFavorites] = useState([])
  const [activeSection, setActiveSection] = useState(null)
  
  const [notifications, setNotifications] = useState({
    push: true,
    sound: true,
    vibration: true,
    promotions: false,
  })
  const [darkMode, setDarkMode] = useState(() => {
    // Load from localStorage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hk_dark_mode')
      if (saved !== null) return saved === 'true'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('hk_dark_mode', String(darkMode))
  }, [darkMode])

  useEffect(() => {
    const saved = localStorage.getItem('hk_saved_deals')
    if (saved) {
      const savedIds = JSON.parse(saved)
      setSavedDeals(SAVED_DEALS.filter(d => savedIds.includes(d.id)))
    }
    setUserReviews(USER_REVIEWS)
    
    const favs = localStorage.getItem('hk_favorites')
    if (favs) setFavorites(JSON.parse(favs))
  }, [])

  // Ultra Clean Profile Page
  return (
    <div className="h-full w-full bg-white overflow-y-auto">
      {/* Clean Profile Header */}
      <div className="bg-white px-5 pt-12 pb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Adrian'}</h2>
            <p className="text-sm text-gray-500 mt-1">{user?.email || 'adrian@example.com'}</p>
            <button className="mt-3 px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
              編輯個人資料
            </button>
          </div>
        </div>
      </div>

      {/* Clean Stats Row */}
      <div className="px-5 py-4 bg-gray-50/50">
        <div className="flex justify-around">
          {[
            { label: '收藏', value: favorites.length || 3 },
            { label: '優惠', value: savedDeals.length || 2 },
            { label: '點評', value: userReviews.length || 2 },
          ].map((stat, idx) => (
            <button key={idx} className="text-center group">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-700">{stat.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Sections - Apple Style */}
      <div className="py-4">
        <SectionHeader title="我的內容" />
        <div className="bg-white">
          <PremiumListItem 
            icon={Heart} 
            iconColor={colors.danger}
            title="我的收藏"
            subtitle="已收藏的地點和內容"
            onClick={() => setActiveSection('favorites')}
          />
          <Divider />
          <PremiumListItem 
            icon={Gift} 
            iconColor={colors.warning}
            title="我的優惠"
            subtitle="收藏的優惠和折扣"
            onClick={() => setActiveSection('deals')}
          />
          <Divider />
          <PremiumListItem 
            icon={MessageCircle} 
            iconColor={colors.success}
            title="我的點評"
            subtitle="發表過的評論"
            onClick={() => setActiveSection('reviews')}
          />
          <Divider />
          <PremiumListItem 
            icon={Star} 
            iconColor={colors.warning}
            title="我的評分"
            subtitle="評分歷史"
            onClick={() => setActiveSection('ratings')}
          />
        </div>
      </div>

      <div className="py-4">
        <SectionHeader title="設定" />
        <div className="bg-white">
          <PremiumListItem 
            icon={Bell} 
            iconColor={colors.primary}
            title="通知設定"
            subtitle="推送通知和提醒"
            onClick={() => setActiveSection('notifications')}
          />
          <Divider />
          <PremiumListItem 
            icon={Globe} 
            iconColor={colors.success}
            title="語言"
            subtitle={currentLangName}
            showArrow={false}
            onClick={() => setActiveSection('language')}
          />
          <Divider />
          <PremiumListItem 
            icon={Lock} 
            iconColor={colors.secondary}
            title="私隱設定"
            subtitle="資料和安全"
            onClick={() => setActiveSection('privacy')}
          />
          <Divider />
          <PremiumListItem 
            icon={QrCode} 
            iconColor={colors.primary}
            title="二維碼"
            subtitle="會員二維碼"
            onClick={() => {}}
          />
        </div>
      </div>

      <div className="py-4">
        <SectionHeader title="帳戶" />
        <div className="bg-white">
          <PremiumListItem 
            icon={Smartphone} 
            iconColor={colors.gray[600]}
            title="電話"
            value="未設定"
            onClick={() => setActiveSection('account')}
          />
          <Divider />
          <PremiumListItem 
            icon={CreditCard} 
            iconColor={colors.gray[600]}
            title="付款"
            subtitle="添加信用卡或扣帳卡"
            onClick={() => {}}
          />
          <Divider />
          <PremiumListItem 
            icon={HeartHandshake} 
            iconColor={colors.gray[600]}
            title="已連結的帳戶"
            subtitle="Google、Apple 等"
            onClick={() => {}}
          />
          <Divider />
          <PremiumListItem 
            icon={Settings} 
            iconColor={colors.gray[600]}
            title="帳戶設定"
            subtitle="個人資料和偏好設定"
            onClick={() => setActiveSection('account')}
          />
        </div>
      </div>

      {/* Dark Mode */}
      <div className="py-4">
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <PremiumIcon icon={Moon} color={colors.gray[600]} />
              <span className="font-semibold text-gray-900 text-[15px]">深色模式</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-51 h-31 rounded-full transition-all duration-300 ${
                darkMode ? 'bg-success' : 'bg-gray-300'
              }`}
              style={{ width: '51px', height: '31px' }}
            >
              <span 
                className={`absolute top-0.5 w-7 h-7 rounded-full bg-white shadow-md transition-all duration-300 ${
                  darkMode ? 'left-[22px]' : 'left-[2px]'
                }`}
                style={{ width: '28px', height: '28px', top: '1.5px' }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="py-4">
        <div className="bg-white">
          <button className="w-full flex items-center justify-center gap-2 py-4 text-danger font-semibold">
            <LogOut className="w-5 h-5" />
            登出
          </button>
        </div>
      </div>

      {/* App Version */}
      <div className="text-center py-8 px-5">
        <p className="text-sm text-gray-400">香港本地生活地圖 v1.0</p>
        <p className="text-xs text-gray-300 mt-1">Made with 🐉 in Hong Kong</p>
      </div>

      {/* Spacer for tab bar */}
      <div className="h-20" />

      {/* Notifications Modal */}
      {activeSection === 'notifications' && (
        <SettingsModal title="通知" icon={Bell}>
          <div className="py-2">
            <div className="px-4 py-3 bg-gray-100/50">
              <p className="text-xs text-gray-500">選擇你希望收到的通知</p>
            </div>
            <div className="bg-white">
              <PremiumToggle 
                label="推送通知"
                subtitle="接收新優惠和更新"
                enabled={notifications.push}
                onToggle={() => setNotifications(n => ({ ...n, push: !n.push }))}
              />
              <Divider />
              <PremiumToggle 
                label="聲音"
                subtitle="通知提示音"
                enabled={notifications.sound}
                onToggle={() => setNotifications(n => ({ ...n, sound: !n.sound }))}
              />
              <Divider />
              <PremiumToggle 
                label="震動"
                subtitle="配合聲音使用"
                enabled={notifications.vibration}
                onToggle={() => setNotifications(n => ({ ...n, vibration: !n.vibration }))}
              />
              <Divider />
              <PremiumToggle 
                label="促銷"
                subtitle="優惠和活動資訊"
                enabled={notifications.promotions}
                onToggle={() => setNotifications(n => ({ ...n, promotions: !n.promotions }))}
              />
            </div>
          </div>
        </SettingsModal>
      )}

      {/* Language Modal */}
      {activeSection === 'language' && (
        <SettingsModal title="語言" icon={Globe}>
          <div className="py-2">
            <div className="bg-white">
              <LanguageOption 
                label="繁體中文"
                flag="🇭🇰"
                selected={currentLangName === '繁體中文'}
                onClick={() => changeLanguage('繁體中文')}
              />
              <Divider />
              <LanguageOption 
                label="簡體中文"
                flag="🇨🇳"
                selected={currentLangName === '簡體中文'}
                onClick={() => changeLanguage('簡體中文')}
              />
              <Divider />
              <LanguageOption 
                label="English"
                flag="🇺🇸"
                selected={currentLangName === 'English'}
                onClick={() => changeLanguage('English')}
              />
              <Divider />
              <LanguageOption 
                label="日本語"
                flag="🇯🇵"
                selected={currentLangName === '日本語'}
                onClick={() => changeLanguage('日本語')}
              />
            </div>
          </div>
        </SettingsModal>
      )}

      {/* Privacy Modal */}
      {activeSection === 'privacy' && (
        <SettingsModal title="私隱" icon={Shield}>
          <div className="py-2">
            <div className="bg-white">
              <PremiumListItem 
                icon={User} 
                iconColor={colors.primary}
                title="個人資料"
                subtitle="管理你的帳戶資料"
              />
              <Divider />
              <PremiumListItem 
                icon={MapPin} 
                iconColor={colors.success}
                title="位置"
                subtitle="位置共享設定"
              />
              <Divider />
              <PremiumListItem 
                icon={Clock3} 
                iconColor={colors.warning}
                title="瀏覽記錄"
                subtitle="查看和刪除歷史"
              />
              <Divider />
              <PremiumListItem 
                icon={BellRing} 
                iconColor={colors.danger}
                title="被遮擋的內容"
                subtitle="管理被遮擋的項目"
              />
            </div>
          </div>
        </SettingsModal>
      )}

      {/* Account Modal */}
      {activeSection === 'account' && (
        <SettingsModal title="帳戶設定" icon={Settings}>
          <div className="py-2">
            <div className="bg-white">
              <PremiumListItem 
                icon={User} 
                iconColor={colors.primary}
                title="個人資料"
                subtitle="編輯姓名和頭像"
              />
              <Divider />
              <PremiumListItem 
                icon={Smartphone} 
                iconColor={colors.secondary}
                title="電話號碼"
                value="未設定"
              />
              <Divider />
              <PremiumListItem 
                icon={Lock} 
                iconColor={colors.gray[600]}
                title="更改密碼"
              />
              <Divider />
              <PremiumListItem 
                icon={HeartHandshake} 
                iconColor={colors.success}
                title="已連結的帳戶"
                subtitle="Google、Apple"
              />
            </div>
          </div>
        </SettingsModal>
      )}

      {/* Ratings Modal */}
      {activeSection === 'ratings' && (
        <SettingsModal title="我的評分" icon={Star}>
          <div className="py-8 px-5">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Star className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">暫無評分記錄</h3>
              <p className="text-sm text-gray-400 mt-2">去地圖評分你去過的地方</p>
            </div>
          </div>
        </SettingsModal>
      )}
    </div>
  )
}

// Sample data
const SAVED_DEALS = [
  { id: '1', title: 'AlipayHK 消費券', desc: '最高回贈 $500', icon: '💜', gradient: 'purple', validUntil: '2026-03-31' },
  { id: '4', title: 'HSBC 餐飲85折', desc: '指定餐廳', icon: '🔴', gradient: 'pink', validUntil: '2026-03-31' },
]
const USER_REVIEWS = [
  { id: '1', placeName: '九記牛腩', rating: 5, text: '真係必試！', time: '2日前', likes: 23 },
  { id: '2', placeName: '山頂纜車', rating: 4, text: '維港景色一流！', time: '1週前', likes: 45 },
]

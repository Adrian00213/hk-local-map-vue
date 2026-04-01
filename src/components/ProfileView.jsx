import { useState, useEffect } from 'react'
import { Settings, Bell, Globe, Shield, Star, Gift, MessageCircle, Heart, ChevronRight, Clock, MapPin, CreditCard, Smartphone, CheckCircle, LogOut, Camera, Sparkles, X, Moon, HeartHandshake, Crown, Zap, QrCode, CheckCircle as Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'

// 2027 Style Components
const GlassCard = ({ children, className = '', glow = false }) => (
  <div className={`relative overflow-hidden rounded-3xl ${className}`}>
    {glow && <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl" />}
    <div className="relative bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-3xl">
      {children}
    </div>
  </div>
)

const NeonButton = ({ children, icon: Icon, color = 'cyan', onClick, className = '' }) => {
  const colorMap = { cyan: 'from-cyan-500 to-blue-600', purple: 'from-purple-500 to-pink-600', orange: 'from-orange-500 to-rose-600', green: 'from-emerald-500 to-teal-600' }
  return (
    <button onClick={onClick} className={`relative group ${className}`}>
      <div className="absolute -inset-1 bg-gradient-to-r ${colorMap[color]} rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity" />
      <div className={`relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r ${colorMap[color]} rounded-2xl font-semibold text-white shadow-lg`}>
        {Icon && <Icon className="w-5 h-5" />}
        {children}
      </div>
    </button>
  )
}

const GlowIcon = ({ icon: Icon, color = 'cyan', size = 'md' }) => {
  const sizeClasses = { sm: 'w-10 h-10', md: 'w-12 h-12', lg: 'w-14 h-14' }
  const iconSizes = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-7 h-7' }
  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${color === 'cyan' ? 'from-cyan-500 to-blue-600' : color === 'purple' ? 'from-purple-500 to-pink-600' : 'from-orange-500 to-rose-600'} p-0.5`}>
      <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
        <Icon className={`${iconSizes[size]} text-cyan-400`} />
      </div>
    </div>
  )
}

const FuturisticAvatar = ({ name, size = 'lg' }) => {
  const sizeClasses = { sm: 'w-12 h-12 text-xl', md: 'w-16 h-16 text-2xl', lg: 'w-24 h-24 text-4xl' }
  return (
    <div className="relative">
      <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-spin-slow opacity-50 blur-sm" />
      <div className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-2xl shadow-purple-500/30`}>
        {name?.charAt(0) || 'U'}
      </div>
      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900" />
    </div>
  )
}

const FuturisticToggle = ({ enabled, onToggle }) => (
  <button onClick={onToggle} className={`relative w-14 h-8 rounded-full transition-all duration-500 ${enabled ? 'bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/50' : 'bg-slate-700'}`}>
    {enabled && <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-md" />}
    <span className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-500 flex items-center justify-center ${enabled ? 'left-8 bg-white shadow-lg shadow-cyan-500/50' : 'left-1 bg-slate-400'}`}>
      {enabled && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
    </span>
  </button>
)

const FuturisticListItem = ({ icon: Icon, color = 'cyan', title, subtitle, value, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/[0.05] transition-all active:scale-[0.98]">
    <GlowIcon icon={Icon} color={color} size="md" />
    <div className="flex-1 text-left">
      <p className="font-semibold text-white text-[15px]">{title}</p>
      {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {value && <span className="text-sm text-slate-500">{value}</span>}
    <ChevronRight className="w-5 h-5 text-slate-600" />
  </button>
)

export default function ProfileView() {
  const { user } = useAuth()
  const { changeLanguage, getLanguageName } = useLocale()
  const currentLangName = getLanguageName(locale)
  
  const [activeSection, setActiveSection] = useState(null)
  const [notifications, setNotifications] = useState({ push: true, sound: true, vibration: true, promotions: false })
  
  useEffect(() => {
    document.documentElement.classList.add('dark')
    localStorage.setItem('hk_dark_mode', 'true')
  }, [])

  return (
    <div className="h-full w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-y-auto">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 pt-16 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-cyan-400 font-medium mb-1">2027 Edition</p>
              <h1 className="text-3xl font-bold text-white">我的</h1>
            </div>
            <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Settings className="w-6 h-6 text-slate-400" />
            </button>
          </div>
          
          {/* User Card */}
          <GlassCard glow className="p-6">
            <div className="flex items-center gap-5">
              <FuturisticAvatar name={user?.name || 'A'} size="lg" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{user?.name || 'Adrian'}</h2>
                <p className="text-slate-400 text-sm mt-1">{user?.email || 'Premium Member'}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-medium">⭐ Premium</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium">✓ 已驗證</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Stats */}
        <div className="px-6 mb-8">
          <div className="grid grid-cols-3 gap-4">
            {[{ label: '收藏', value: 3, icon: Heart, color: 'pink' }, { label: '積分', value: 2.8, icon: Zap, color: 'cyan' }, { label: '等級', value: 'VIP', icon: Crown, color: 'orange' }].map((stat, idx) => (
              <GlassCard key={idx} className="p-4 text-center">
                <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${stat.color === 'pink' ? 'from-pink-500 to-rose-600' : stat.color === 'cyan' ? 'from-cyan-500 to-blue-600' : 'from-orange-500 to-rose-600'} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-8">
          <div className="flex gap-3">
            <NeonButton icon={Gift} color="purple" className="flex-1 justify-center" onClick={() => setActiveSection('deals')}>我的優惠</NeonButton>
            <NeonButton icon={QrCode} color="cyan" className="flex-1 justify-center">二維碼</NeonButton>
          </div>
        </div>

        {/* Menu */}
        <div className="px-6 space-y-6 pb-24">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">我的內容</p>
            <GlassCard>
              <FuturisticListItem icon={Heart} color="pink" title="我的收藏" subtitle="已收藏的地點和內容" onClick={() => {}} />
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              <FuturisticListItem icon={MessageCircle} color="purple" title="我的點評" subtitle="發表過的評論" onClick={() => {}} />
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              <FuturisticListItem icon={Star} color="orange" title="我的評分" subtitle="評分歷史" onClick={() => {}} />
            </GlassCard>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">設定</p>
            <GlassCard>
              <FuturisticListItem icon={Bell} color="cyan" title="通知" subtitle="推送和提醒" onClick={() => setActiveSection('notifications')} />
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              <FuturisticListItem icon={Globe} color="emerald" title="語言" subtitle={currentLangName} onClick={() => setActiveSection('language')} />
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              <FuturisticListItem icon={Shield} color="blue" title="私隱和安全" subtitle="帳戶保護" onClick={() => {}} />
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              <FuturisticListItem icon={Moon} color="purple" title="深色模式" subtitle="界面主題" />
            </GlassCard>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">帳戶</p>
            <GlassCard>
              <FuturisticListItem icon={User} color="cyan" title="個人資料" subtitle="編輯個人資訊" onClick={() => {}} />
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              <FuturisticListItem icon={CreditCard} color="purple" title="付款方式" subtitle="添加信用卡" onClick={() => {}} />
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              <FuturisticListItem icon={HeartHandshake} color="pink" title="已連結" subtitle="Google, Apple" onClick={() => {}} />
            </GlassCard>
          </div>

          <button className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
            <LogOut className="w-5 h-5" />
            登出帳戶
          </button>

          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
            </div>
            <p className="text-white font-semibold">香港本地生活地圖</p>
            <p className="text-slate-500 text-sm mt-1">Version 2.0 · 2027 Edition</p>
            <p className="text-slate-600 text-xs mt-2">Made with 🐉 in Hong Kong</p>
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      {activeSection === 'notifications' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl" onClick={() => setActiveSection(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-2xl rounded-t-3xl border-t border-white/10 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center gap-4">
              <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><X className="w-5 h-5 text-slate-400" /></button>
              <h2 className="text-lg font-bold text-white">通知設定</h2>
            </div>
            <div className="p-5 space-y-3">
              <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                  <div><p className="font-semibold text-white">推送通知</p><p className="text-sm text-slate-400">接收新優惠和更新</p></div>
                  <FuturisticToggle enabled={notifications.push} onToggle={() => setNotifications(n => ({...n, push: !n.push}))} />
                </div>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                  <div><p className="font-semibold text-white">聲音</p><p className="text-sm text-slate-400">通知提示音</p></div>
                  <FuturisticToggle enabled={notifications.sound} onToggle={() => setNotifications(n => ({...n, sound: !n.sound}))} />
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {activeSection === 'language' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl" onClick={() => setActiveSection(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-2xl rounded-t-3xl border-t border-white/10 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center gap-4">
              <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><X className="w-5 h-5 text-slate-400" /></button>
              <h2 className="text-lg font-bold text-white">語言</h2>
            </div>
            <div className="p-5 space-y-3">
              {[{ label: '繁體中文', flag: '🇭🇰', lang: '繁體中文' }, { label: '簡體中文', flag: '🇨🇳', lang: '簡體中文' }, { label: 'English', flag: '🇺🇸', lang: 'English' }, { label: '日本語', flag: '🇯🇵', lang: '日本語' }].map((item) => (
                <button key={item.lang} onClick={() => changeLanguage(item.lang)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${currentLangName === item.lang ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                  <span className="text-2xl">{item.flag}</span>
                  <span className={`flex-1 text-left font-semibold ${currentLangName === item.lang ? 'text-cyan-400' : 'text-white'}`}>{item.label}</span>
                  {currentLangName === item.lang && <Check className="w-6 h-6 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

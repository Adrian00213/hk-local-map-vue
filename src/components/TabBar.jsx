import { Map, Newspaper, Brain, User, Bus, Utensils } from 'lucide-react'

const tabs = [
  { id: 'map', icon: Map, label: '地圖' },
  { id: 'news', icon: Newspaper, label: '資訊' },
  { id: 'transport', icon: Bus, label: '交通' },
  { id: 'ai', icon: Brain, label: 'AI助理' },
  { id: 'profile', icon: User, label: '我的' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav
      className="flex-none bg-white/95 backdrop-blur-xl border-t border-amber-100/50 flex items-stretch z-50 safe-area-bottom"
    >
      <div className="flex justify-around items-center w-full max-w-lg mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-3 min-w-[64px] h-full transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-yellow-600'
                  : 'text-zinc-400 hover:text-yellow-600'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-1000 rounded-full" />
                )}
              </div>
              <span className={`text-[11px] font-medium ${isActive ? 'text-yellow-600' : 'text-zinc-400'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
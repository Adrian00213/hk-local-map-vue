import { Map, Search, Heart, Newspaper, Sparkles, User } from 'lucide-react'

const tabs = [
  { id: 'map', icon: Map, label: '地圖' },
  { id: 'search', icon: Search, label: '搜尋' },
  { id: 'favorites', icon: Heart, label: '收藏' },
  { id: 'news', icon: Newspaper, label: '資訊' },
  { id: 'trip', icon: Sparkles, label: '行程' },
  { id: 'profile', icon: User, label: '我的' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="bg-white/90 backdrop-blur-xl border-t border-zinc-200/50 px-2 pb-1 pt-1 safe-area-bottom">
      <div className="flex justify-around items-end">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[52px] ${
              activeTab === id
                ? 'text-violet-500'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all duration-200 ${
              activeTab === id 
                ? 'bg-gradient-to-br from-violet-50 to-purple-50 shadow-sm' 
                : ''
            }`}>
              <Icon 
                size={20} 
                strokeWidth={activeTab === id ? 2.5 : 2} 
              />
            </div>
            <span className={`text-[10px] font-semibold leading-none ${activeTab === id ? 'text-violet-500' : 'text-zinc-400'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}

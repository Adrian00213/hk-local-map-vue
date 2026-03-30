import { Map, Search, Newspaper, Sparkles, User, Brain } from 'lucide-react'

const tabs = [
  { id: 'map', icon: Map, label: '地圖' },
  { id: 'search', icon: Search, label: '搜尋' },
  { id: 'news', icon: Newspaper, label: '資訊' },
  { id: 'ai', icon: Brain, label: 'AI助理' },
  { id: 'profile', icon: User, label: '我的' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="bg-white/95 backdrop-blur-xl border-t border-zinc-200/50 px-1 pt-1 pb-0 safe-area-bottom">
      <div className="flex justify-around items-end">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-0.5 px-1 py-2 rounded-xl transition-all duration-200 min-w-[56px] min-h-[48px] ${
              activeTab === id
                ? 'text-amber-500'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-200 ${
              activeTab === id 
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm' 
                : ''
            }`}>
              <Icon 
                size={20} 
                strokeWidth={activeTab === id ? 2.5 : 2} 
              />
            </div>
            <span className={`text-[10px] font-semibold leading-none ${activeTab === id ? 'text-amber-500' : 'text-zinc-400'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}

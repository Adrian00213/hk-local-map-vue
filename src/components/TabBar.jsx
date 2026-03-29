import { Map, Search, Heart, Newspaper, User } from 'lucide-react'

const tabs = [
  { id: 'map', icon: Map, label: '地圖' },
  { id: 'search', icon: Search, label: '搜尋' },
  { id: 'favorites', icon: Heart, label: '收藏' },
  { id: 'news', icon: Newspaper, label: '資訊' },
  { id: 'profile', icon: User, label: '我的' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="bg-white border-t border-slate-200 px-2 pb-1 pt-1.5 safe-area-bottom">
      <div className="flex justify-around items-end">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] ${
              activeTab === id
                ? 'text-red-500'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              activeTab === id ? 'bg-red-50' : ''
            }`}>
              <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

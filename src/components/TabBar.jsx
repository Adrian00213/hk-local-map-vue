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
    <nav className="bg-white border-t border-gray-200 px-2 py-1.5 safe-area-bottom">
      <div className="flex justify-around">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
              activeTab === id ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

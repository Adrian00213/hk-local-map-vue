import { Map, Search, Heart, Newspaper, User } from 'lucide-react'

export default function Navigation({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'map', icon: Map, label: '地圖' },
    { id: 'search', icon: Search, label: '搜尋' },
    { id: 'favorites', icon: Heart, label: '收藏' },
    { id: 'news', icon: Newspaper, label: '資訊' },
    { id: 'profile', icon: User, label: '我的' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-2 z-[1001]">
      <div className="flex justify-around items-center">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentPage === id
                ? 'text-primary'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

import { Map, Newspaper, Brain, User } from 'lucide-react'

const tabs = [
  { id: 'map', icon: Map, label: '地圖' },
  { id: 'news', icon: Newspaper, label: '資訊' },
  { id: 'ai', icon: Brain, label: 'AI助理' },
  { id: 'profile', icon: User, label: '我的' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav 
      className="flex-none h-16 bg-white border-t border-gray-200 flex items-stretch z-50"
    >
      <div className="flex justify-around items-center w-full max-w-lg mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 min-w-[60px] h-full ${
              activeTab === id
                ? 'text-amber-500'
                : 'text-gray-400 active:text-gray-600'
            }`}
          >
            <Icon 
              size={22} 
              strokeWidth={activeTab === id ? 2.5 : 2} 
            />
            <span className={`text-[10px] font-medium ${activeTab === id ? 'text-amber-500' : 'text-gray-400'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}

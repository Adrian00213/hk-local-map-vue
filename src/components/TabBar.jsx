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
      className="flex-none h-16 bg-white border-t border-gray-200 flex items-stretch z-50 relative"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        // Fallback for older browsers
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)'
      }}
    >
      {/* Bottom safe area spacer - visible only on notched devices */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white hidden"
        style={{ 
          height: 'env(safe-area-inset-bottom, 0px)',
          display: 'env(safe-area-inset-bottom, none)'
        }}
      />
      <div className="flex justify-around items-center w-full max-w-lg mx-auto h-full">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 min-w-[60px] h-full transition-all duration-200 active:scale-95 ${
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

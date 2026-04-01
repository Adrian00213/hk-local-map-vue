import { Map, Utensils, Brain, User, Bus } from 'lucide-react'

const tabs = [
  { id: 'map', icon: Map, label: '地圖', emoji: '🗺️' },
  { id: 'info', icon: Utensils, label: '資訊', emoji: '🍜' },
  { id: 'transport', icon: Bus, label: '交通', emoji: '🚌' },
  { id: 'ai', icon: Brain, label: 'AI助理', emoji: '🤖' },
  { id: 'profile', icon: User, label: '我的', emoji: '👤' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="bg-white/90 backdrop-blur-lg border-t border-gray-100 px-2 pb-safe">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-300 active:scale-90 min-w-[60px] ${
                isActive 
                  ? 'bg-gradient-to-t from-amber-50 to-orange-50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`relative transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-ping"></div>
                )}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full"></div>
                )}
                
                <Icon 
                  className={`w-6 h-6 transition-all duration-300 ${
                    isActive 
                      ? 'text-amber-500' 
                      : 'text-gray-400'
                  }`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              
              <span 
                className={`text-xs mt-1 transition-all duration-300 ${
                  isActive 
                    ? 'font-bold text-amber-600' 
                    : 'text-gray-400 font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

import { Map, Newspaper, Cloud, User, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navigation({ onMapClick, onNewsClick, onWeatherClick, onFavoritesClick }) {
  const { user } = useAuth()

  return (
    <nav className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-[1001]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={onMapClick}
          className="flex flex-col items-center gap-1 p-2 text-primary"
        >
          <Map className="w-6 h-6" />
          <span className="text-xs font-medium">地圖</span>
        </button>

        <button
          onClick={onFavoritesClick}
          className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-red-500 transition-colors"
        >
          <Heart className="w-6 h-6" />
          <span className="text-xs">收藏</span>
        </button>

        <button
          onClick={onNewsClick}
          className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-primary transition-colors"
        >
          <Newspaper className="w-6 h-6" />
          <span className="text-xs">資訊</span>
        </button>

        <button
          onClick={onWeatherClick}
          className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-primary transition-colors"
        >
          <Cloud className="w-6 h-6" />
          <span className="text-xs">天氣</span>
        </button>

        {user ? (
          <div className="flex flex-col items-center gap-1 p-2 text-gray-500">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs">已登入</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs">未登入</span>
          </div>
        )}
      </div>
    </nav>
  )
}

import { useAuth } from '../context/AuthContext'
import { LogOut, User, Moon, Sun } from 'lucide-react'

export default function Header({ user, onLoginClick, isDarkMode, onDarkModeToggle, greeting }) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm z-[1001] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-white text-lg">🗺️</span>
        </div>
        <div>
          <h1 className="font-semibold text-gray-900 dark:text-white text-sm">
            香港生活地圖
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {greeting}！{user ? user.displayName || user.email : '登入探索'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={onDarkModeToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-primary" />
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all"
          >
            登入
          </button>
        )}
      </div>
    </header>
  )
}

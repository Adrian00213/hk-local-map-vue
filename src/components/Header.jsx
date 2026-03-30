import { useAuth } from '../context/AuthContext'
import { Moon, Sun, LogOut, User } from 'lucide-react'

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
    <header className="bg-white/90 backdrop-blur-xl border-b border-zinc-200/50 px-4 py-3 flex items-center justify-between z-[1001]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-200/50">
          <span className="text-white text-lg">🗺️</span>
        </div>
        <div>
          <h1 className="font-semibold text-zinc-900 text-sm">
            香港生活地圖
          </h1>
          <p className="text-xs text-zinc-500">
            {greeting}！{user ? user.displayName || user.email : '探索精彩'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={onDarkModeToggle}
          className="p-2.5 rounded-xl hover:bg-zinc-100 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-zinc-500" />
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <User className="w-4 h-4 text-violet-600" />
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl hover:bg-zinc-100 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-200/50 btn-premium"
          >
            登入
          </button>
        )}
      </div>
    </header>
  )
}

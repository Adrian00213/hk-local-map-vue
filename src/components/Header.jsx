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
    <header className="bg-white/95 backdrop-blur-xl border-b border-amber-100/50 px-4 py-3 flex items-center justify-between z-[1001]">
      <div className="flex items-center gap-3">
        <img 
          src="/favicon.png" 
          alt="Logo" 
          className="w-10 h-10 rounded-2xl object-contain shadow-lg shadow-amber-200/50"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
        />
        <div>
          <h1 className="font-bold text-zinc-900 text-base tracking-tight">
            香港生活地圖
          </h1>
          <p className="text-xs text-yellow-600 font-medium">
            {greeting}！{user ? user.displayName || user.email : '探索精彩'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={onDarkModeToggle}
          className="p-2.5 rounded-xl hover:bg-yellow-100 transition-colors active:scale-95"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-600" />
          ) : (
            <Moon className="w-5 h-5 text-yellow-600" />
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-yellow-200 flex items-center justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <User className="w-4 h-4 text-yellow-600" />
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl hover:bg-yellow-100 transition-colors active:scale-95"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 text-yellow-600" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-200/50 active:scale-95 transition-transform"
          >
            登入
          </button>
        )}
      </div>
    </header>
  )
}
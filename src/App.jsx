import { useState, useEffect } from 'react'
import { MapProvider, useMap } from './context/MapContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import MapPage from './pages/MapPage'
import SearchPage from './pages/SearchPage'
import FavoritesPage from './pages/FavoritesPage'
import NewsPage from './pages/NewsPage'
import ProfilePage from './pages/ProfilePage'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('map')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '早晨'
    if (hour < 18) return '下午'
    return '晚上'
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'map':
        return <MapPage onNavigate={setCurrentPage} />
      case 'search':
        return <SearchPage />
      case 'favorites':
        return <FavoritesPage />
      case 'news':
        return <NewsPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <MapPage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-light dark:bg-dark">
      <Header
        user={user}
        onLoginClick={() => {}}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        greeting={getGreeting()}
      />

      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>

      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <MapProvider>
        <AppContent />
      </MapProvider>
    </AuthProvider>
  )
}

export default App

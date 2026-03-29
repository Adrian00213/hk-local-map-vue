import { useState, useEffect } from 'react'
import { MapProvider } from './context/MapContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Map from './components/Map'
import MarkerForm from './components/MarkerForm'
import AuthModal from './components/AuthModal'
import WeatherWidget from './components/WeatherWidget'
import NewsFeed from './components/NewsFeed'

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMarkerForm, setShowMarkerForm] = useState(false)
  const [showNewsFeed, setShowNewsFeed] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
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

  return (
    <div className="h-full w-full flex flex-col bg-light dark:bg-dark transition-colors">
      <Header
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        greeting={getGreeting()}
      />

      <main className="flex-1 relative overflow-hidden">
        <Map onAddMarker={() => setShowMarkerForm(true)} />

        {/* Floating Action Button */}
        <button
          onClick={() => setShowMarkerForm(true)}
          className="absolute bottom-24 right-4 z-[1000] w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-90 transition-all active:scale-95"
        >
          <span className="text-2xl">+</span>
        </button>

        {/* Weather Widget Toggle */}
        <button
          onClick={() => setShowWeather(!showWeather)}
          className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 transition-all"
        >
          <span className="text-xl">🌤️</span>
        </button>

        {/* News Feed Toggle */}
        <button
          onClick={() => setShowNewsFeed(!showNewsFeed)}
          className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 transition-all"
        >
          <span className="text-xl">📰</span>
        </button>

        {/* Weather Widget Panel */}
        {showWeather && (
          <div className="absolute top-20 right-4 z-[1000] animate-fadeIn">
            <WeatherWidget onClose={() => setShowWeather(false)} />
          </div>
        )}

        {/* News Feed Panel */}
        {showNewsFeed && (
          <div className="absolute top-20 left-4 z-[1000] w-80 max-h-96 overflow-hidden animate-fadeIn">
            <NewsFeed onClose={() => setShowNewsFeed(false)} />
          </div>
        )}
      </main>

      <Navigation
        onMapClick={() => { setShowNewsFeed(false); setShowWeather(false); }}
        onNewsClick={() => setShowNewsFeed(!showNewsFeed)}
        onWeatherClick={() => setShowWeather(!showWeather)}
      />

      {/* Modals */}
      {showMarkerForm && (
        <MarkerForm
          onClose={() => setShowMarkerForm(false)}
          user={user}
          onLoginRequired={() => {
            setShowMarkerForm(false)
            setShowAuthModal(true)
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
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

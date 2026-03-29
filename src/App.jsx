import { useState, useEffect } from 'react'
import { MapProvider, useMap } from './context/MapContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Map from './components/Map'
import MarkerForm from './components/MarkerForm'
import AuthModal from './components/AuthModal'
import WeatherWidget from './components/WeatherWidget'
import NewsFeed from './components/NewsFeed'
import SearchBar from './components/SearchBar'
import Favorites from './components/Favorites'

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMarkerForm, setShowMarkerForm] = useState(false)
  const [showNewsFeed, setShowNewsFeed] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user } = useAuth()
  const { userLocation } = useMap()

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

        {/* Search Bar - Below Header */}
        <div className="absolute top-28 left-4 right-4 z-[1000]">
          <SearchBar userLocation={userLocation} />
        </div>

        {/* Right Side Buttons */}
        <div className="absolute top-28 right-4 z-[1000] flex flex-col gap-2">
          {/* Weather Button */}
          <button
            onClick={() => setShowWeather(!showWeather)}
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-xl">🌤️</span>
          </button>

          {/* News Button */}
          <button
            onClick={() => setShowNewsFeed(!showNewsFeed)}
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-xl">📰</span>
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => setShowFavorites(true)}
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-xl">❤️</span>
          </button>
        </div>

        {/* Floating Action Button - Add Marker */}
        <button
          onClick={() => setShowMarkerForm(true)}
          className="absolute bottom-6 right-4 z-[1000] w-16 h-16 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:bg-opacity-90 transition-all active:scale-95"
        >
          <span className="text-3xl font-light">+</span>
        </button>

        {/* Weather Widget Panel */}
        {showWeather && (
          <div className="absolute top-36 right-20 z-[1000] animate-fadeIn">
            <WeatherWidget onClose={() => setShowWeather(false)} />
          </div>
        )}

        {/* News Feed Panel */}
        {showNewsFeed && (
          <div className="absolute top-36 left-4 z-[1000] w-80 max-h-96 overflow-hidden animate-fadeIn">
            <NewsFeed onClose={() => setShowNewsFeed(false)} />
          </div>
        )}
      </main>

      <Navigation
        onMapClick={() => { setShowNewsFeed(false); setShowWeather(false); }}
        onNewsClick={() => setShowNewsFeed(!showNewsFeed)}
        onWeatherClick={() => setShowWeather(!showWeather)}
        onFavoritesClick={() => setShowFavorites(true)}
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

      {showFavorites && (
        <Favorites onClose={() => setShowFavorites(false)} />
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

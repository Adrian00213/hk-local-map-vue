import { useState, useEffect, useState as useNextState } from 'react'
import { MapProvider } from './context/MapContext'
import { AuthProvider } from './context/AuthContext'
import { LocaleProvider } from './context/LocaleContext'
import TabBar from './components/TabBar'
import MapView from './components/MapView'
import SmartAssistantView from './components/SmartAssistantView'
import ProfileView from './components/ProfileView'
import OnboardingView from './components/OnboardingView'
import TransportationPage from './pages/TransportationPage'
import InfoPage from './pages/InfoPage'
import ErrorBoundary from './components/ErrorBoundary'

// Smart greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return { emoji: '🌙', text: '夜喇，早啲休息啦！' }
  if (hour < 9) return { emoji: '🌅', text: '早晨！今日加油！' }
  if (hour < 12) return { emoji: '☀️', text: '上午好！' }
  if (hour < 14) return { emoji: '🍜', text: '中午好！食咗飯未？' }
  if (hour < 18) return { emoji: '🌤️', text: '下午好！' }
  if (hour < 21) return { emoji: '🌆', text: '晚安！今晚食咩好？' }
  return { emoji: '🌙', text: '夜喇！記得早啲訓！' }
}

// Toast notification component
function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: '✅',
    error: '❌',
    info: '💡',
    welcome: '👋'
  }

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-medium ${
      type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
      type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
      type === 'welcome' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
      'bg-blue-50 text-blue-700 border border-blue-200'
    }`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  )
}

// Loading splash screen
function LoadingSplash({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center z-50 animate-fade-in">
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl animate-bounce-slow">
          <span className="text-4xl">🐉</span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full flex items-center justify-center text-lg animate-pulse">
          📍
        </div>
      </div>
      <div className="mt-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 animate-pulse">Gold Dragon</h1>
        <p className="text-sm text-gray-500 mt-1">為你探索香港美食 🦾</p>
      </div>
      <div className="mt-8 flex gap-2">
        <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('info')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const seen = localStorage.getItem('hk_onboarding_complete')
    if (!seen) {
      setShowOnboarding(true)
    }
  }, [])

  // Show welcome toast when app loads
  useEffect(() => {
    if (!showOnboarding && !isLoading) {
      const greeting = getGreeting()
      setToast({ message: `${greeting.emoji} ${greeting.text}`, type: 'welcome' })
    }
  }, [isLoading, showOnboarding])

  const renderView = () => {
    const views = {
      map: <MapView />,
      info: <InfoPage showToast={setToast} />,
      transport: <TransportationPage />,
      ai: <SmartAssistantView />,
      profile: <ProfileView />
    }
    return (
      <ErrorBoundary>
        {views[activeTab] || <MapView />}
      </ErrorBoundary>
    )
  }

  if (showOnboarding) {
    return (
      <OnboardingView 
        onComplete={() => setShowOnboarding(false)} 
      />
    )
  }

  if (isLoading) {
    return <LoadingSplash onDone={() => setIsLoading(false)} />
  }

  return (
    <AuthProvider>
      <MapProvider>
        <LocaleProvider>
          <div 
            className="h-screen w-full flex flex-col bg-white/95 backdrop-blur-sm" 
            style={{ height: '100dvh' }}
          >
          {/* Smart Header with Greeting */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 border-b border-amber-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl animate-pulse">{getGreeting().emoji}</span>
                <span className="text-sm font-medium text-gray-700">
                  {getGreeting().text}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>香港</span>
              </div>
            </div>
          </div>

          <main className="flex-1 min-h-0 overflow-y-auto">
            {renderView()}
          </main>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Toast Notifications */}
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </div>
        </LocaleProvider>
      </MapProvider>
    </AuthProvider>
  )
}

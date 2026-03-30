import { useState, useEffect } from 'react'
import { MapProvider } from './context/MapContext'
import { AuthProvider } from './context/AuthContext'
import TabBar from './components/TabBar'
import MapView from './components/MapView'
import SearchView from './components/SearchView'
import NewsView from './components/NewsView'
import SmartAssistantView from './components/SmartAssistantView'
import ProfileView from './components/ProfileView'
import OnboardingView from './components/OnboardingView'

export default function App() {
  const [activeTab, setActiveTab] = useState('map')
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('hk_onboarding_complete')
    if (!seen) {
      setShowOnboarding(true)
    }
  }, [])

  const renderView = () => {
    switch (activeTab) {
      case 'map': return <MapView />
      case 'search': return <SearchView />
      case 'news': return <NewsView />
      case 'ai': return <SmartAssistantView />
      case 'profile': return <ProfileView />
      default: return <MapView />
    }
  }

  if (showOnboarding) {
    return (
      <OnboardingView 
        onComplete={() => setShowOnboarding(false)} 
      />
    )
  }

  return (
    <AuthProvider>
      <MapProvider>
        <div className="h-screen w-screen flex flex-col bg-white overflow-hidden relative">
          <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[70px]">
            {renderView()}
          </main>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </MapProvider>
    </AuthProvider>
  )
}

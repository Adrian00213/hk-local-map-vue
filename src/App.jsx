import { useState } from 'react'
import { MapProvider } from './context/MapContext'
import { AuthProvider } from './context/AuthContext'
import TabBar from './components/TabBar'
import MapView from './components/MapView'
import SearchView from './components/SearchView'
import NewsView from './components/NewsView'
import TripPlannerView from './components/TripPlannerView'
import ProfileView from './components/ProfileView'

export default function App() {
  const [activeTab, setActiveTab] = useState('map')

  const renderView = () => {
    switch (activeTab) {
      case 'map': return <MapView />
      case 'search': return <SearchView />
      case 'news': return <NewsView />
      case 'trip': return <TripPlannerView />
      case 'profile': return <ProfileView />
      default: return <MapView />
    }
  }

  return (
    <AuthProvider>
      <MapProvider>
        <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
          <main className="flex-1 overflow-hidden">
            {renderView()}
          </main>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </MapProvider>
    </AuthProvider>
  )
}

import Map from '../components/Map'
import MarkerForm from '../components/MarkerForm'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function MapPage({ onNavigate }) {
  const [showMarkerForm, setShowMarkerForm] = useState(false)
  const { user } = useAuth()

  return (
    <div className="h-full w-full relative">
      <Map onAddMarker={() => setShowMarkerForm(true)} />

      {/* FAB */}
      <button
        onClick={() => setShowMarkerForm(true)}
        className="absolute bottom-6 right-6 z-[1000] w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:bg-opacity-90 transition-all active:scale-95"
      >
        <span className="text-2xl">+</span>
      </button>

      {showMarkerForm && (
        <MarkerForm
          onClose={() => setShowMarkerForm(false)}
          user={user}
          onLoginRequired={() => {}}
        />
      )}
    </div>
  )
}

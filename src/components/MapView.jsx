import { useState, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'
import MarkerForm from './MarkerForm'

const GOOGLE_MAPS_API_KEY = 'AIzaSyA6VU14iA_ytRMWMxKbVvT_dWamaGeWAFE'

const containerStyle = { width: '100%', height: '100%' }
const defaultCenter = { lat: 22.3193, lng: 114.1694 }

const mapStyles = [
  { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] }
]

export default function MapView() {
  const { markers, userLocation, selectedCategory, setSelectedCategory } = useMap()
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY })

  const getIcon = (category) => {
    const colors = { deals: '#FF6B6B', restaurants: '#FF9F43', places: '#54A0FF', news: '#5FD068' }
    const icons = { deals: '🛒', restaurants: '🍜', places: '🎯', news: '📰' }
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<div style="width:36px;height:36px;background:${colors[category]};border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${icons[category]}</div>`)}`,
      scaledSize: { width: 36, height: 36 },
      anchor: { x: 18, y: 18 }
    }
  }

  const filtered = selectedCategory ? markers.filter(m => m.category === selectedCategory) : markers

  if (!isLoaded) {
    return <div className="h-full w-full flex items-center justify-center bg-gray-100"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="h-full w-full relative">
      <GoogleMap mapContainerStyle={containerStyle} center={userLocation || defaultCenter} zoom={13}
        options={{ styles: document.querySelector('html')?.classList.contains('dark') ? mapStyles : [], disableDefaultUI: true, zoomControl: true }}>
        {userLocation && <Marker position={userLocation} icon={{ url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<div style="width:16px;height:16px;background:#4ECDC4;border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(78,205,196,0.5)"></div>')}`, scaledSize: { width: 16, height: 16 } }} />}
        {filtered.map(m => <Marker key={m.id} position={{ lat: m.lat, lng: m.lng }} icon={getIcon(m.category)} onClick={() => setSelected(m)} />)}
      </GoogleMap>

      {/* Category Pills */}
      <div className="absolute top-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${!selectedCategory ? 'bg-red-500 text-white' : 'bg-white text-gray-700 shadow'}`}>全部</button>
        {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
          <button key={k} onClick={() => setSelectedCategory(k)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 ${selectedCategory === k ? 'bg-red-500 text-white' : 'bg-white text-gray-700 shadow'}`}>{CATEGORY_ICONS[k]}{v}</button>
        ))}
      </div>

      {/* Add Button */}
      <button onClick={() => setShowForm(true)} className="absolute bottom-6 right-6 w-14 h-14 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-light">+</button>

      {/* Info Modal */}
      {selected && (
        <div className="absolute bottom-24 left-4 right-4 bg-white rounded-2xl shadow-xl p-4 max-h-64 overflow-y-auto">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">{CATEGORY_ICONS[selected.category]}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selected.title}</h3>
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{CATEGORY_LABELS[selected.category]}</span>
              {selected.description && <p className="text-sm text-gray-500 mt-2">{selected.description}</p>}
              {selected.contact && <p className="text-xs text-gray-400 mt-1">📍 {selected.contact}</p>}
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 text-xl">×</button>
          </div>
        </div>
      )}

      {showForm && <MarkerForm onClose={() => setShowForm(false)} user={null} onLoginRequired={() => {}} />}
    </div>
  )
}

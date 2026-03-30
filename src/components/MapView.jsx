import { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'
import MarkerForm from './MarkerForm'
import { X, Navigation } from 'lucide-react'

const GOOGLE_MAPS_API_KEY = 'AIzaSyA6VU14iA_ytRMWMxKbVvT_dWamaGeWAFE'
const containerStyle = { width: '100%', height: '100%' }
const defaultCenter = { lat: 22.3193, lng: 114.1694 }

export default function MapView() {
  const { markers, userLocation, selectedCategory, setSelectedCategory } = useMap()
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => setIsDark(document.documentElement.classList.contains('dark')), [])

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY })

  const getMarkerIcon = (cat) => {
    const colors = { deals: '#EF4444', restaurants: '#F97316', places: '#3B82F6', news: '#22C55E' }
    const icons = { deals: '🛒', restaurants: '🍜', places: '🎯', news: '📰' }
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<div style="width:44px;height:44px;background:${colors[cat]};border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,0.18)">${icons[cat]}</div>`)}`,
      scaledSize: { width: 44, height: 44 },
      anchor: { x: 22, y: 22 }
    }
  }

  const filtered = selectedCategory ? markers.filter(m => m.category === selectedCategory) : markers

  if (!isLoaded) return (
    <div className="h-full w-full flex items-center justify-center bg-zinc-50">
      <div className="text-center">
        <div className="w-12 h-12 border-[3px] border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-zinc-500 text-sm font-medium">載入地圖中...</p>
      </div>
    </div>
  )

  return (
    <div className="h-full w-full relative bg-zinc-100">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={14}
        options={{ 
          styles: isDark ? [{ featureType: 'all', stylers: [{ saturation: -100 }] }] : [],
          disableDefaultUI: true,
          zoomControl: false,
          fullscreenControl: false,
        }}
      >
        {userLocation && (
          <Marker position={userLocation} icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<div style="width:18px;height:18px;background:#10B981;border:3px solid white;border-radius:50%;box-shadow:0 4px 12px rgba(16,185,129,0.4)"></div>`)}`,
            scaledSize: { width: 18, height: 18 }
          }} />
        )}
        {filtered.map(m => (
          <Marker key={m.id} position={{ lat: m.lat, lng: m.lng }} icon={getMarkerIcon(m.category)} onClick={() => setSelected(m)} />
        ))}
      </GoogleMap>

      {/* Category Pills - Floating */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="glass rounded-2xl shadow-lg border-subtle p-2 flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              !selectedCategory 
                ? 'bg-violet-500 text-white shadow-md' 
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setSelectedCategory(k)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                selectedCategory === k 
                  ? 'bg-violet-500 text-white shadow-md' 
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <span>{CATEGORY_ICONS[k]}</span>
              <span>{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User Location Button */}
      {userLocation && (
        <button className="absolute right-4 bottom-32 z-20 w-12 h-12 bg-white rounded-2xl shadow-lg border-subtle flex items-center justify-center btn-premium">
          <Navigation className="w-5 h-5 text-violet-500" />
        </button>
      )}

      {/* Add Button - Premium FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="absolute right-4 bottom-6 z-20 w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl shadow-xl shadow-violet-500/30 flex items-center justify-center text-white text-2xl font-light btn-premium"
      >
        +
      </button>

      {/* Selected Place Card - Slide up animation */}
      {selected && (
        <div className="absolute bottom-6 left-4 right-20 z-20 animate-slide-up">
          <div className="bg-white rounded-3xl shadow-xl border-subtle overflow-hidden">
            <div className="p-5">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-3xl shrink-0">
                  {CATEGORY_ICONS[selected.category]}
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <span className="inline-block px-2.5 py-1 bg-violet-50 text-violet-600 text-xs font-semibold rounded-lg mb-1.5">
                    {CATEGORY_LABELS[selected.category]}
                  </span>
                  <h3 className="font-bold text-lg text-zinc-900 leading-tight">{selected.title}</h3>
                  {selected.description && (
                    <p className="text-sm text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">{selected.description}</p>
                  )}
                  {selected.contact && (
                    <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
                      <span>📍</span> {selected.contact}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && <MarkerForm onClose={() => setShowForm(false)} user={null} onLoginRequired={() => {}} />}
    </div>
  )
}

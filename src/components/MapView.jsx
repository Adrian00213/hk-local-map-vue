import { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'
import MarkerForm from './MarkerForm'
import { X } from 'lucide-react'

const GOOGLE_MAPS_API_KEY = 'AIzaSyA6VU14iA_ytRMWMxKbVvT_dWamaGeWAFE'

const containerStyle = { width: '100%', height: '100%' }
const defaultCenter = { lat: 22.3193, lng: 114.1694 }

const darkStyle = [
  { featureType: 'all', stylers: [{ saturation: -100 }, { lightness: -20 }] }
]

export default function MapView() {
  const { markers, userLocation, selectedCategory, setSelectedCategory } = useMap()
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY })

  const getIcon = (cat) => {
    const colors = { deals: '#FF6B6B', restaurants: '#FF9F43', places: '#54A0FF', news: '#5FD068' }
    const icons = { deals: '🛒', restaurants: '🍜', places: '🎯', news: '📰' }
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<div style="width:40px;height:40px;background:${colors[cat]};border:4px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,0.25)">${icons[cat]}</div>`)}`,
      scaledSize: { width: 40, height: 40 },
      anchor: { x: 20, y: 20 }
    }
  }

  const filtered = selectedCategory ? markers.filter(m => m.category === selectedCategory) : markers

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">載入地圖中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative bg-slate-100">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={14}
        options={{
          styles: isDark ? darkStyle : [],
          disableDefaultUI: true,
          zoomControl: false,
          fullscreenControl: false,
        }}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<div style="width:24px;height:24px;background:#10B981;border:4px solid white;border-radius:50%;box-shadow:0 4px 12px rgba(16,185,129,0.4)"></div>`)}`,
              scaledSize: { width: 24, height: 24 }
            }}
          />
        )}
        {filtered.map(m => (
          <Marker
            key={m.id}
            position={{ lat: m.lat, lng: m.lng }}
            icon={getIcon(m.category)}
            onClick={() => setSelected(m)}
          />
        ))}
      </GoogleMap>

      {/* Category Filter */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex gap-2 overflow-x-auto pb-2 px-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
              !selectedCategory
                ? 'bg-red-500 text-white shadow-red-200'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setSelectedCategory(k)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 ${
                selectedCategory === k
                  ? 'bg-red-500 text-white shadow-red-200'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{CATEGORY_ICONS[k]}</span>
              <span>{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 text-xl font-bold hover:bg-slate-50 transition-colors">+</button>
        <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 text-xl font-bold hover:bg-slate-50 transition-colors">−</button>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="absolute bottom-6 right-6 z-20 w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full shadow-xl flex items-center justify-center text-3xl font-light hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
      >
        +
      </button>

      {/* Info Card */}
      {selected && (
        <div className="absolute bottom-6 left-4 right-24 z-20 bg-white rounded-3xl shadow-2xl p-5 animate-slide-up">
          <button
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl">
              {CATEGORY_ICONS[selected.category]}
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <span className="inline-block px-3 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-full mb-2">
                {CATEGORY_LABELS[selected.category]}
              </span>
              <h3 className="font-bold text-lg text-slate-900">{selected.title}</h3>
              {selected.description && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{selected.description}</p>
              )}
              {selected.contact && (
                <p className="text-xs text-slate-400 mt-2">📍 {selected.contact}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showForm && <MarkerForm onClose={() => setShowForm(false)} user={null} onLoginRequired={() => {}} />}
    </div>
  )
}

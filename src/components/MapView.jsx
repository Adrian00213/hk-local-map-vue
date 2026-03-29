import { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'
import MarkerForm from './MarkerForm'
import { X, Navigation } from 'lucide-react'

const GOOGLE_MAPS_API_KEY = 'AIzaSyA6VU14iA_ytRMWMxKbVvT_dWamaGeWAFE'
const containerStyle = { width: '100%', height: '100%' }
const defaultCenter = { lat: 22.3193, lng: 114.1694 }

const darkMapStyle = [{ featureType: 'all', stylers: [{ saturation: -100 }, { lightness: -10 }] }]

export default function MapView() {
  const { markers, userLocation, selectedCategory, setSelectedCategory } = useMap()
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => setIsDark(document.documentElement.classList.contains('dark')), [])

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY })

  const getMarkerIcon = (cat) => {
    const colors = { deals: '#ef4444', restaurants: '#f97316', places: '#3b82f6', news: '#22c55e' }
    const icons = { deals: '🛒', restaurants: '🍜', places: '🎯', news: '📰' }
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<div style="width:48px;height:48px;background:${colors[cat]};border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 8px 24px rgba(0,0,0,0.2)">${icons[cat]}</div>`)}`,
      scaledSize: { width: 48, height: 48 },
      anchor: { x: 24, y: 24 }
    }
  }

  const filtered = selectedCategory ? markers.filter(m => m.category === selectedCategory) : markers

  if (!isLoaded) return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">載入地圖中...</p>
      </div>
    </div>
  )

  return (
    <div className="h-full w-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={14}
        options={{ styles: isDark ? darkMapStyle : [], disableDefaultUI: true, zoomControl: false }}
      >
        {userLocation && (
          <Marker position={userLocation} icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<div style="width:20px;height:20px;background:#10b981;border:3px solid white;border-radius:50%;box-shadow:0 4px 12px rgba(16,185,129,0.5)"></div>`)}`,
            scaledSize: { width: 20, height: 20 }
          }} />
        )}
        {filtered.map(m => (
          <Marker key={m.id} position={{ lat: m.lat, lng: m.lng }} icon={getMarkerIcon(m.category)} onClick={() => setSelected(m)} />
        ))}
      </GoogleMap>

      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="glass rounded-3xl shadow-xl p-4 animate-slide-down">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                !selectedCategory ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部
            </button>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setSelectedCategory(k)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === k ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{CATEGORY_ICONS[k]}</span>
                <span>{v}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Location Button */}
      {userLocation && (
        <button className="absolute right-4 bottom-32 z-20 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
          <Navigation className="w-6 h-6 text-red-500" />
        </button>
      )}

      {/* Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="absolute right-4 bottom-6 z-20 w-16 h-16 bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 rounded-2xl shadow-xl shadow-red-200 flex items-center justify-center text-white text-3xl font-light hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
      >
        +
      </button>

      {/* Selected Place Card */}
      {selected && (
        <div className="absolute bottom-6 left-4 right-20 z-20">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-5">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl shrink-0">
                  {CATEGORY_ICONS[selected.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-full mb-2">
                    {CATEGORY_LABELS[selected.category]}
                  </span>
                  <h3 className="font-bold text-xl text-slate-900">{selected.title}</h3>
                  {selected.description && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{selected.description}</p>
                  )}
                  {selected.contact && (
                    <p className="text-xs text-slate-400 mt-2">📍 {selected.contact}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
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

import { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'
import MarkerForm from './MarkerForm'
import SmartRecommendationEngine from './SmartRecommendationEngine'
import { X, Locate, Zap, Brain } from 'lucide-react'

const GOOGLE_MAPS_API_KEY = 'AIzaSyA6VU14iA_ytRMWMxKbVvT_dWamaGeWAFE'
const containerStyle = { width: '100%', height: '100%' }
const defaultCenter = { lat: 22.3193, lng: 114.1694 }

// Location-based recommendations
const LOCATION_RECOMMENDATIONS = {
  'hongkong': [
    { title: '山頂纜車新優惠', category: 'deals', icon: '🎫', desc: '遊客套票8折', distance: '0.5km' },
    { title: '維港夜景指南', category: 'places', icon: '🌃', desc: '最佳拍攝位置推薦', distance: '1km' },
    { title: '尖沙咀新餐廳', category: 'restaurants', icon: '🍽️', desc: '米芝蓮星級餐廳', distance: '0.8km' },
  ],
  'default': [
    { title: '附近熱門景點', category: 'places', icon: '⭐', desc: '評分最高', distance: '0.3km' },
    { title: '今日優惠', category: 'deals', icon: '🔥', desc: '限時特賣', distance: '0.5km' },
    { title: '人氣美食', category: 'restaurants', icon: '🍜', desc: '本地推薦', distance: '0.2km' },
  ]
}

const getRecommendations = (lat, lng) => {
  if (lat > 22.3 && lat < 22.35 && lng > 114.15 && lng < 114.2) {
    return LOCATION_RECOMMENDATIONS['hongkong']
  }
  return LOCATION_RECOMMENDATIONS['default']
}

export default function MapView() {
  const { markers, userLocation, selectedCategory, setSelectedCategory, refreshUserLocation } = useMap()
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [isDark, setIsDark] = useState(false)
  const [showNearby, setShowNearby] = useState(false)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => setIsDark(document.documentElement.classList.contains('dark')), [])

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY })

  useEffect(() => {
    if (userLocation) {
      const recs = getRecommendations(userLocation.lat, userLocation.lng)
      setRecommendations(recs)
    }
  }, [userLocation])

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
        <div className="w-12 h-12 border-[3px] border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-zinc-500 text-sm font-medium">地圖緊係加载中...</p>
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

      {/* Category Pills */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="glass rounded-2xl shadow-lg border-subtle p-2 flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
              !selectedCategory 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                : 'text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setSelectedCategory(k)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                selectedCategory === k 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                  : 'text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200'
              }`}
            >
              <span>{CATEGORY_ICONS[k]}</span>
              <span>{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Recommendations Toggle */}
      {recommendations.length > 0 && (
        <button
          onClick={() => setShowNearby(!showNearby)}
          className="absolute left-4 bottom-32 z-20 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-xl shadow-amber-500/30 flex items-center gap-2 active:scale-95 transition-transform btn-premium"
        >
          <Zap className="w-5 h-5" />
          <span className="font-semibold text-sm">智能推薦</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{recommendations.length}</span>
        </button>
      )}

      {/* Smart Recommendations Panel */}
      {showNearby && (
        <div className="absolute left-4 right-4 bottom-36 z-20 animate-slide-up">
          <div className="bg-white rounded-3xl shadow-xl border-subtle overflow-hidden max-h-[60vh]">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-zinc-900">🧠 智能推薦</h3>
              </div>
              <button onClick={() => setShowNearby(false)} className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors active:scale-95">
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            <div className="p-3 overflow-y-auto max-h-[calc(60vh-60px)]">
              <SmartRecommendationEngine />
            </div>
          </div>
        </div>
      )}

      {/* Location Button */}
      <button 
        onClick={() => refreshUserLocation?.()}
        className="absolute right-4 bottom-32 z-20 w-12 h-12 bg-white rounded-2xl shadow-lg border-subtle flex items-center justify-center active:scale-95 transition-transform btn-premium"
      >
        <Locate className="w-5 h-5 text-amber-500" />
      </button>

      {/* Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="absolute right-4 bottom-6 z-20 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center text-white text-2xl font-light active:scale-95 transition-transform btn-premium"
      >
        +
      </button>

      {/* Selected Place Card */}
      {selected && (
        <div className="absolute bottom-6 left-4 right-20 z-20 animate-slide-up">
          <div className="bg-white rounded-3xl shadow-xl border-subtle overflow-hidden">
            <div className="p-5">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-2xl shrink-0">
                  {CATEGORY_ICONS[selected.category]}
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-lg mb-1.5">
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
                  className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors active:scale-95"
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

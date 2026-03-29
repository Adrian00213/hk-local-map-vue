import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMap as useMapContext } from '../context/MapContext'
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'
import MarkerPopup from './MarkerPopup'

// Fix for default marker icon issue in Leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom user location icon
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #4ECDC4;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(78, 205, 196, 0.5);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

// Component to handle map events and user location
function MapController() {
  const map = useMap()
  const { userLocation } = useMapContext()

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 14)
    }
  }, [userLocation, map])

  return null
}

export default function Map({ onAddMarker }) {
  const { markers, userLocation, loading, selectedCategory, setSelectedCategory } = useMapContext()
  const mapRef = useRef(null)

  // Default center - Hong Kong
  const defaultCenter = [22.3193, 114.1694]

  // Create custom marker icon
  const createCustomIcon = (category) => {
    const icon = CATEGORY_ICONS[category] || '📍'
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-${category}">${icon}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    })
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">載入地圖中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      {/* Category Filter */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-white dark:bg-gray-800 rounded-full shadow-lg px-2 py-1 flex gap-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            selectedCategory === null 
              ? 'bg-primary text-white' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          全部
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
              selectedCategory === key 
                ? 'bg-primary text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span>{CATEGORY_ICONS[key]}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <MapContainer
        ref={mapRef}
        center={defaultCenter}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapController />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-medium">📍 你的位置</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon(marker.category)}
          >
            <MarkerPopup marker={marker} />
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-24 left-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">圖例</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span>🛒</span>
            <span className="text-gray-600 dark:text-gray-400">優惠</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🍜</span>
            <span className="text-gray-600 dark:text-gray-400">餐廳</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span className="text-gray-600 dark:text-gray-400">好去處</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📰</span>
            <span className="text-gray-600 dark:text-gray-400">最新資訊</span>
          </div>
        </div>
      </div>
    </div>
  )
}

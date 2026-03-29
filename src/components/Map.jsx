import { useState, useEffect, useCallback, useMemo } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { useMap as useMapContext, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'
import MarkerPopup from './MarkerPopup'

const GOOGLE_MAPS_API_KEY = 'AIzaSyA6VU14iA_ytRMWMxKbVvT_dWamaGeWAFE'

const containerStyle = {
  width: '100%',
  height: '100%'
}

// Default center - Hong Kong
const defaultCenter = {
  lat: 22.3193,
  lng: 114.1694
}

const mapStyles = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#242f3e' }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }]
  }
]

const lightMapStyles = [] // Default Google Maps style

export default function Map({ onAddMarker }) {
  const { markers, userLocation, loading, selectedCategory, setSelectedCategory } = useMapContext()
  const [mapRef, setMapRef] = useState(null)
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [isDark, setIsDark] = useState(false)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  })

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const onLoad = useCallback((map) => {
    setMapRef(map)
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          map.panTo(pos)
          map.setZoom(14)
        },
        () => {
          // Default to Hong Kong center
          map.panTo(defaultCenter)
          map.setZoom(13)
        }
      )
    }
  }, [])

  const onUnmount = useCallback(() => {
    setMapRef(null)
  }, [])

  const center = userLocation || defaultCenter

  const filteredMarkers = selectedCategory
    ? markers.filter(m => m.category === selectedCategory)
    : markers

  const getMarkerIcon = (category) => {
    const icons = {
      deals: '🛒',
      restaurants: '🍜',
      places: '🎯',
      news: '📰'
    }
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <div style="
          width: 40px;
          height: 40px;
          background: ${
            category === 'deals' ? '#FF6B6B' :
            category === 'restaurants' ? '#FF9F43' :
            category === 'places' ? '#54A0FF' : '#5FD068'
          };
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${icons[category] || '📍'}
        </div>
      `)}`,
      scaledSize: { width: 40, height: 40 },
      anchor: { x: 20, y: 20 }
    }
  }

  if (loadError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <p className="text-red-500">地圖載入失敗</p>
          <p className="text-sm text-gray-500 mt-2">請檢查網絡連接</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
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
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[10] bg-white dark:bg-gray-800 rounded-full shadow-lg px-2 py-1 flex gap-1">
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

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: isDark ? mapStyles : lightMapStyles,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: 'cooperative'
        }}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <div style="
                  width: 20px;
                  height: 20px;
                  background: #4ECDC4;
                  border: 3px solid white;
                  border-radius: 50%;
                  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.5);
                "></div>
              `)}`,
              scaledSize: { width: 20, height: 20 },
              anchor: { x: 10, y: 10 }
            }}
          />
        )}

        {/* Place Markers */}
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={getMarkerIcon(marker.category)}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {/* Info Window */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
            options={{
              pixelOffset: { width: 0, height: -40 }
            }}
          >
            <div className="min-w-[200px]">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-2xl">{CATEGORY_ICONS[selectedMarker.category]}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedMarker.title}</h3>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                    {CATEGORY_LABELS[selectedMarker.category]}
                  </span>
                </div>
              </div>
              {selectedMarker.description && (
                <p className="text-sm text-gray-600 mb-2">{selectedMarker.description}</p>
              )}
              {selectedMarker.contact && (
                <p className="text-xs text-gray-500 mb-2">📍 {selectedMarker.contact}</p>
              )}
              <div className="flex gap-2">
                <a
                  href={`https://www.google.com/maps?q=${selectedMarker.lat},${selectedMarker.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  查看地圖
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map Legend */}
      <div className="absolute bottom-24 left-4 z-[10] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-xs">
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

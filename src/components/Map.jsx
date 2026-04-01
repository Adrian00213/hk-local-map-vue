import { useState, useEffect, useRef } from 'react'
import { useMap as useMapContext, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

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

const lightMapStyles = []

export default function Map({ onAddMarker }) {
  const { markers, userLocation, selectedCategory, setSelectedCategory } = useMapContext()
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)
  const [isDark, setIsDark] = useState(false)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const markersRef = useRef([])

  // Load Google Maps script dynamically
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
    
    // Check if already loaded
    if (window.google && window.google.maps) {
      setIsGoogleLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA6VU14iA_ytRMWMxKbVvT_dWamaGeWAFE'
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsGoogleLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load Google Maps script')
    }
    document.head.appendChild(script)
    
    return () => {
      // Cleanup if needed
    }
  }, [])

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isGoogleLoaded || !mapContainerRef.current || mapRef.current) return

    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        styles: isDark ? mapStyles : lightMapStyles,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: 'cooperative'
      })
      
      mapRef.current = map
      
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
            
            // Add user location marker
            new window.google.maps.Marker({
              position: pos,
              map: map,
              icon: {
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
              }
            })
          },
          () => {
            map.panTo(defaultCenter)
            map.setZoom(13)
          }
        )
      }
    } catch (error) {
      console.error('Error initializing map:', error)
    }
  }, [isGoogleLoaded, isDark])

  // Update markers when they change
  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

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
      const colors = {
        deals: '#FF6B6B',
        restaurants: '#FF9F43',
        places: '#54A0FF',
        news: '#5FD068'
      }
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <div style="
            width: 40px;
            height: 40px;
            background: ${colors[category] || '#54A0FF'};
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

    filteredMarkers.forEach(marker => {
      try {
        const mapMarker = new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: mapRef.current,
          icon: getMarkerIcon(marker.category),
          title: marker.title
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="min-width: 200px; padding: 8px;">
              <div style="display: flex; align-items: start; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 24px;">${CATEGORY_ICONS[marker.category]}</span>
                <div>
                  <h3 style="font-weight: 600; margin: 0;">${marker.title}</h3>
                  <span style="font-size: 12px; padding: 2px 6px; background: #f3f4f6; border-radius: 4px;">
                    ${CATEGORY_LABELS[marker.category]}
                  </span>
                </div>
              </div>
              ${marker.description ? `<p style="font-size: 14px; color: #666; margin-bottom: 8px;">${marker.description}</p>` : ''}
              ${marker.contact ? `<p style="font-size: 12px; color: #999; margin-bottom: 8px;">📍 ${marker.contact}</p>` : ''}
              <a href="https://www.google.com/maps?q=${marker.lat},${marker.lng}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 6px 12px; background: #3b82f6; color: white; font-size: 12px; border-radius: 4px; text-decoration: none;">
                查看地圖
              </a>
            </div>
          `
        })

        mapMarker.addListener('click', () => {
          infoWindow.open(mapRef.current, mapMarker)
        })

        markersRef.current.push(mapMarker)
      } catch (error) {
        console.error('Error creating marker:', error)
      }
    })
  }, [markers, selectedCategory])

  if (!isGoogleLoaded) {
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
      {/* Category Filter - Horizontal Scrollable */}
      <div className="absolute top-4 left-4 right-4 z-[10]">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-3 py-2 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === null 
                ? 'bg-primary text-white' 
                : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === key 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{CATEGORY_ICONS[key]}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} style={containerStyle}></div>

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

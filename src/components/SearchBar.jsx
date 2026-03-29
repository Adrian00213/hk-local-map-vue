import { useState, useMemo } from 'react'
import { Search, X, MapPin } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

export default function SearchBar({ userLocation }) {
  const { markers, setSelectedCategory } = useMap()
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredMarkers = useMemo(() => {
    if (!searchTerm.trim()) return []

    const term = searchTerm.toLowerCase()
    return markers.filter(m => 
      m.title.toLowerCase().includes(term) ||
      m.description?.toLowerCase().includes(term) ||
      m.contact?.toLowerCase().includes(term) ||
      CATEGORY_LABELS[m.category].toLowerCase().includes(term)
    ).slice(0, 10)
  }, [markers, searchTerm])

  const getDistance = (lat, lng) => {
    if (!userLocation) return null
    const R = 6371 // km
    const dLat = (lat - userLocation.lat) * Math.PI / 180
    const dLng = (lng - userLocation.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return (R * c).toFixed(1)
  }

  return (
    <div className="absolute top-16 left-4 right-4 z-[1001]">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="搜尋地點、優惠、餐廳..."
          className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => { setSearchTerm(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && searchTerm && (
        <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-h-80 overflow-y-auto">
          {filteredMarkers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              找不到相關結果
            </div>
          ) : (
            filteredMarkers.map((marker) => {
              const distance = getDistance(marker.lat, marker.lng)
              return (
                <div
                  key={marker.id}
                  onClick={() => {
                    setSelectedCategory(marker.category)
                    setSearchTerm('')
                    setIsOpen(false)
                  }}
                  className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-lg">
                      {CATEGORY_ICONS[marker.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {marker.title}
                        </h4>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300">
                          {CATEGORY_LABELS[marker.category]}
                        </span>
                      </div>
                      {marker.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {marker.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        {distance && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {distance} km
                          </span>
                        )}
                        {marker.contact && (
                          <span>{marker.contact}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

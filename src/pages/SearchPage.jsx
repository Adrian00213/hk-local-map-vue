import { useState } from 'react'
import { Search, MapPin, Filter } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

export default function SearchPage() {
  const { markers, setSelectedCategory } = useMap()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setCat] = useState(null)

  const filteredMarkers = markers.filter(m => {
    const matchesSearch = !searchTerm || 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.contact?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || m.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Search Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋地點、優惠、餐廳..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <button
            onClick={() => setCat(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              !selectedCategory 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCat(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === key 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <span>{CATEGORY_ICONS[key]}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-500">{filteredMarkers.length} 個結果</p>
        
        {filteredMarkers.map((marker) => (
          <div
            key={marker.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">
                {CATEGORY_ICONS[marker.category]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {marker.title}
                  </h3>
                </div>
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 mb-2">
                  {CATEGORY_LABELS[marker.category]}
                </span>
                {marker.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{marker.description}</p>
                )}
                {marker.contact && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{marker.contact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredMarkers.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">找不到相關結果</p>
          </div>
        )}
      </div>
    </div>
  )
}

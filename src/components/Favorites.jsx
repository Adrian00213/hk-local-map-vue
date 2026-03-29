import { useState, useEffect } from 'react'
import { Heart, X, Star } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'
import { useAuth } from '../context/AuthContext'

const FAVORITES_KEY = 'hklocal_favorites'

export default function Favorites({ onClose }) {
  const { markers } = useMap()
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
    const storedRatings = localStorage.getItem(FAVORITES_KEY + '_ratings')
    if (storedRatings) {
      setRatings(JSON.parse(storedRatings))
    }
  }, [])

  const favoriteMarkers = markers.filter(m => favorites.includes(m.id))

  const toggleFavorite = (markerId) => {
    const newFavorites = favorites.includes(markerId)
      ? favorites.filter(id => id !== markerId)
      : [...favorites, markerId]
    setFavorites(newFavorites)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
  }

  const setRating = (markerId, rating) => {
    const newRatings = { ...ratings, [markerId]: rating }
    setRatings(newRatings)
    localStorage.setItem(FAVORITES_KEY + '_ratings', JSON.stringify(newRatings))
  }

  const getAverageRating = (markerId) => {
    // In a real app, this would be from a database
    // For now, we only show user's own rating
    return ratings[markerId] || 0
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              我的收藏 ({favorites.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {favoriteMarkers.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">暫時未有收藏</p>
              <p className="text-xs text-gray-400 mt-1">
                點擊地圖上的標記可以收藏
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-2xl">
                      {CATEGORY_ICONS[marker.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {marker.title}
                        </h4>
                        <button
                          onClick={() => toggleFavorite(marker.id)}
                          className="p-1"
                        >
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        </button>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                        {CATEGORY_LABELS[marker.category]}
                      </span>
                      {marker.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {marker.description}
                        </p>
                      )}
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(marker.id, star)}
                              className="p-0.5"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= getAverageRating(marker.id)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          {getAverageRating(marker.id) || '未評分'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

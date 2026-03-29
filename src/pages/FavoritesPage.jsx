import { useState, useEffect } from 'react'
import { Heart, Star, MapPin } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

const FAVORITES_KEY = 'hklocal_favorites'
const RATINGS_KEY = 'hklocal_ratings'

export default function FavoritesPage() {
  const { markers } = useMap()
  const [favorites, setFavorites] = useState([])
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) setFavorites(JSON.parse(stored))
    const storedRatings = localStorage.getItem(RATINGS_KEY)
    if (storedRatings) setRatings(JSON.parse(storedRatings))
  }, [])

  const favoriteMarkers = markers.filter(m => favorites.includes(m.id))

  const toggleFavorite = (id) => {
    const newFavs = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(newFavs)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs))
  }

  const setRating = (id, rating) => {
    const newRatings = { ...ratings, [id]: rating }
    setRatings(newRatings)
    localStorage.setItem(RATINGS_KEY, JSON.stringify(newRatings))
  }

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10 p-4">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">我的收藏</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">{favoriteMarkers.length} 個收藏</p>
      </div>

      {/* Favorites List */}
      <div className="p-4 space-y-3">
        {favoriteMarkers.map((marker) => (
          <div
            key={marker.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">
                {CATEGORY_ICONS[marker.category]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {marker.title}
                  </h3>
                  <button onClick={() => toggleFavorite(marker.id)}>
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  </button>
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

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(marker.id, star)}
                        className="p-0.5"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (ratings[marker.id] || 0)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">
                    {ratings[marker.id] ? `你的評分: ${ratings[marker.id]} 星` : '點擊評分'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {favoriteMarkers.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              暫時未有收藏
            </h3>
            <p className="text-sm text-gray-500">
              點擊地圖上的❤️可以收藏地點
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

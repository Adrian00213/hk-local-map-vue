import { useState, useEffect } from 'react'
import { CATEGORY_LABELS } from '../context/MapContext'
import { MapPin, Phone, ExternalLink, Heart } from 'lucide-react'

const FAVORITES_KEY = 'hklocal_favorites'

export default function MarkerPopup({ marker }) {
  const { title, category, description, imageUrl, contact } = marker
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      const favorites = JSON.parse(stored)
      setIsFavorite(favorites.includes(marker.id))
    }
  }, [marker.id])

  const toggleFavorite = (e) => {
    e.stopPropagation()
    const stored = localStorage.getItem(FAVORITES_KEY)
    const favorites = stored ? JSON.parse(stored) : []
    
    if (favorites.includes(marker.id)) {
      const newFavorites = favorites.filter(id => id !== marker.id)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
      setIsFavorite(false)
    } else {
      const newFavorites = [...favorites, marker.id]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
      setIsFavorite(true)
    }
  }

  return (
    <Popup>
      <div className="w-64">
        {/* Image */}
        {imageUrl && (
          <div className="w-full h-32 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        )}
        
        <div className="p-3">
          {/* Category Tag & Favorite */}
          <div className="flex items-center justify-between">
            <span className={`category-tag ${category}`}>
              {CATEGORY_LABELS[category]}
            </span>
            <button
              onClick={toggleFavorite}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart 
                className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
              />
            </button>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mt-2 mb-1">{title}</h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
          )}

          {/* Contact Info */}
          {contact && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <MapPin className="w-3 h-3" />
              <span>{contact}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <a
              href={`https://www.google.com/maps?q=${marker.lat},${marker.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              地圖
            </a>
            {contact && (
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(contact)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-secondary/10 text-secondary text-xs font-medium rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <Phone className="w-3 h-3" />
                導航
              </a>
            )}
          </div>
        </div>
      </div>
    </Popup>
  )
}
